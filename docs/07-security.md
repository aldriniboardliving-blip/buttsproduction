# Butts Productions — Authentication & Authorization Flows

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────────────┐   │
│  │  Client  │────▶│  Server      │────▶│  MongoDB             │   │
│  │  Browser │     │  Action      │     │  (AdminUser +        │   │
│  │          │     │  (login)     │     │  Session)            │   │
│  └──────────┘     └──────────────┘     └──────────────────────┘   │
│       │                  │                       │                 │
│       │  1. POST email/  │                       │                 │
│       │     password     │                       │                 │
│       │                  │                       │                 │
│       │                  │  2. Verify Argon2id   │                 │
│       │                  │     hash              │                 │
│       │                  │                       │                 │
│       │                  │  3. Check rate limit  │                 │
│       │                  │     (5/15min)         │                 │
│       │                  │                       │                 │
│       │                  │  4. Create Session    │                 │
│       │                  │     document          │                 │
│       │                  │                       │                 │
│       │                  │  5. Set HttpOnly      │                 │
│       │                  │     cookie            │                 │
│       │◀─────────────────│                       │                 │
│       │  6. Redirect to  │                       │                 │
│       │     /admin       │                       │                 │
│       │                  │                       │                 │
└───────┼──────────────────┼───────────────────────┼───────────────┘
        │                  │                       │
        ▼                  ▼                       ▼
   ┌──────────┐     ┌──────────────┐     ┌──────────────────────┐
   │ Subsequent          │  Middleware  │     │  Session             │
   │ Requests            │  (admin/*)   │     │  Validation          │
   │                     │              │     │                      │
   │ Cookie sent         │  1. Read     │     │  1. Lookup session   │
   │ automatically       │     cookie   │     │     by token hash    │
   │                     │              │     │                      │
   │                     │  2. Verify   │     │  2. Check expiry     │
   │                     │     not      │     │     & revoked        │
   │                     │     expired  │     │                      │
   │                     │              │     │  3. Load AdminUser   │
   │                     │  3. Attach   │     │     & permissions    │
   │                     │     user to  │     │                      │
   │                     │     request  │     │  4. Return auth ctx  │
   └──────────┘     └──────────────┘     └──────────────────────────┘
```

---

## 1. Admin Login Flow

### Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant M as Middleware
    participant A as Server Action (login)
    participant DB as MongoDB
    participant C as Cookie Store

    U->>A: POST {email, password, rememberMe}
    A->>DB: Find AdminUser by email
    DB-->>A: AdminUser (with passwordHash)
    A->>A: Verify Argon2id(password, hash)
    alt Invalid credentials
        A-->>U: {success: false, error: 'INVALID_CREDENTIALS'}
    else Valid credentials
        A->>DB: Check rate limit (loginAttempts, lockedUntil)
        alt Rate limited
            A-->>U: {success: false, error: 'RATE_LIMITED'}
        else OK
            A->>DB: Create Session document
            Note right of A: token = crypto.randomBytes(32).toString('hex')<br/>tokenHash = await hash(token)
            A->>DB: Update AdminUser (lastLoginAt, loginAttempts=0)
            A->>C: Set-Cookie: session=token; HttpOnly; Secure; SameSite=Lax; Max-Age=...
            Note right of A: Max-Age: 24h (default) or 30d (rememberMe)
            A-->>U: {success: true, data: {redirectTo: '/admin'}}
    end
```

### Login Server Action
```typescript
// src/app/admin/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminUser } from '@/server/models/AdminUser';
import { Session } from '@/server/models/Session';
import { verifyPassword, hashToken } from '@/lib/auth/password';
import { checkRateLimit, recordLoginAttempt } from '@/lib/auth/rate-limit';
import { createSessionToken, setSessionCookie, SESSION_CONFIG } from '@/lib/auth/session';

export async function adminLogin(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<ActionResult<{ redirectTo: string }>> {
  // Normalize
  email = email.toLowerCase().trim();

  // Rate limit by IP + email
  const rateLimit = await checkRateLimit('login', email);
  if (!rateLimit.allowed) {
    return { success: false, error: { code: 'RATE_LIMITED', message: 'Too many attempts. Try again later.' } };
  }

  // Find user
  const user = await AdminUser.findOne({ email, archivedAt: { $exists: false } });
  if (!user) {
    await recordLoginAttempt(email, false);
    // Generic error - no account enumeration
    return { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } };
  }

  // Verify password
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await recordLoginAttempt(email, false);
    await AdminUser.updateOne(
      { _id: user._id },
      { $inc: { loginAttempts: 1 }, $set: { lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null } }
    );
    return { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } };
  }

  // Reset login attempts on success
  await AdminUser.updateOne({ _id: user._id }, { $set: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });

  // Create session
  const token = createSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + (rememberMe ? SESSION_CONFIG.REMEMBER_ME_TTL : SESSION_CONFIG.DEFAULT_TTL));

  await Session.create({
    userId: user._id,
    token: tokenHash,
    userAgent: headers().get('user-agent') || undefined,
    ip: headers().get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    expiresAt,
  });

  // Set cookie
  await setSessionCookie(token, rememberMe);

  // Audit log
  await auditLog('login', 'AdminUser', user._id, { rememberMe });

  return { success: true, data: { redirectTo: '/admin' } };
}
```

---

## 2. Session Management

### Cookie Configuration
```typescript
// src/lib/auth/session.ts
export const SESSION_CONFIG = {
  COOKIE_NAME: 'bp_session',
  DEFAULT_TTL: 24 * 60 * 60 * 1000,        // 24 hours
  REMEMBER_ME_TTL: 30 * 24 * 60 * 60 * 1000, // 30 days
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    domain: process.env.COOKIE_DOMAIN, // e.g., '.buttsproductions.com' for subdomains
  },
} as const;

export async function setSessionCookie(token: string, rememberMe: boolean) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_CONFIG.COOKIE_NAME, token, {
    ...SESSION_CONFIG.COOKIE_OPTIONS,
    maxAge: rememberMe ? SESSION_CONFIG.REMEMBER_ME_TTL / 1000 : SESSION_CONFIG.DEFAULT_TTL / 1000,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.COOKIE_NAME);
}

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

### Session Validation (Middleware)
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow login page and setup page
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/admin/setup')
    ) {
      return NextResponse.next();
    }

    const session = await verifySession(request);
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Attach to request for server components
    const response = NextResponse.next();
    response.headers.set('x-admin-user-id', session.userId.toString());
    response.headers.set('x-admin-role', session.role);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

```typescript
// src/lib/auth/session.ts
export interface SessionContext {
  userId: Types.ObjectId;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
}

export async function verifySession(request: NextRequest): Promise<SessionContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const session = await Session.findOne({
    token: tokenHash,
    expiresAt: { $gt: new Date() },
    revokedAt: { $exists: false },
  }).lean();

  if (!session) return null;

  const user = await AdminUser.findById(session.userId)
    .select('email name role permissions archivedAt')
    .lean();

  if (!user || user.archivedAt) return null;

  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
  };
}
```

---

## 3. Initial Admin Setup (One-Time)

### Flow
```mermaid
sequenceDiagram
    participant U as Admin (Browser)
    participant A as Server Action (setup)
    participant DB as MongoDB
    participant ENV as Environment

    Note over ENV: ADMIN_SETUP_TOKEN=secure-random-string
    U->>A: GET /admin/setup?token=xxx
    A->>ENV: Validate token matches
    alt Invalid token
        A-->>U: 404
    else Valid token
        A-->>U: Render setup form
        U->>A: POST {email, password, name, token}
        A->>ENV: Validate token
        A->>DB: Check if any AdminUser exists
        alt Admin exists
            A-->>U: {error: 'SETUP_COMPLETE'}
        else No admin
            A->>A: Hash password (Argon2id)
            A->>DB: Create AdminUser (superadmin)
            A->>DB: Create initial SiteSettings
            A->>ENV: Invalidate token (delete from env or mark used)
            A-->>U: {success: true, redirectTo: '/admin/login'}
    end
```

### Setup Token Generation
```bash
# Run once locally
node -e "console.log('ADMIN_SETUP_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"
# Add to .env.local (development) or Vercel Environment Variables (production)
```

---

## 4. Password Security

### Argon2id Configuration
```typescript
// src/lib/auth/password.ts
import { hash, verify } from '@node-rs/argon2';

export const ARGON2_CONFIG = {
  memoryCost: 19456,    // ~19 MB
  timeCost: 2,          // 2 iterations
  parallelism: 1,
  hashLength: 32,
  outputType: 'encoded' as const,
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_CONFIG);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch {
    return false;
  }
}

export async function hashToken(token: string): Promise<string> {
  // SHA-256 for session tokens (fast, not for passwords)
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 5. CSRF Protection

```typescript
// src/lib/auth/csrf.ts
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'bp_csrf';
const CSRF_HEADER = 'x-csrf-token';

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24h
  });
  return token;
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

// Usage in Server Actions
export async function adminMutationAction(formData: FormData) {
  const request = new Request('', { method: 'POST', body: formData });
  if (!(await validateCsrfToken(request))) {
    return { success: false, error: { code: 'CSRF_INVALID', message: 'Invalid CSRF token' } };
  }
  // ... proceed
}
```

---

## 6. Authorization Model (RBAC)

### Role Definitions
```typescript
// src/lib/auth/rbac.ts
export type Permission =
  // Businesses
  | 'business:create' | 'business:read' | 'business:update' | 'business:delete'
  | 'business:publish' | 'business:reorder'
  // Services
  | 'service:create' | 'service:read' | 'service:update' | 'service:delete'
  | 'service:publish' | 'service:reorder' | 'service:assign'
  // Categories
  | 'category:create' | 'category:read' | 'category:update' | 'category:delete'
  // Pages & Blocks
  | 'page:create' | 'page:read' | 'page:update' | 'page:delete'
  | 'page:publish' | 'block:manage'
  // Navigation
  | 'navigation:create' | 'navigation:read' | 'navigation:update' | 'navigation:delete'
  | 'navigation:reorder'
  // Media
  | 'media:upload' | 'media:read' | 'media:update' | 'media:delete'
  // Bookings
  | 'booking:read' | 'booking:update' | 'booking:note' | 'booking:export'
  // Events
  | 'event:create' | 'event:read' | 'event:update' | 'event:delete' | 'event:publish'
  // FAQs
  | 'faq:create' | 'faq:read' | 'faq:update' | 'faq:delete' | 'faq:publish'
  // Testimonials
  | 'testimonial:create' | 'testimonial:read' | 'testimonial:update' | 'testimonial:delete'
  // Settings
  | 'settings:read' | 'settings:update'
  // Legal
  | 'legal:create' | 'legal:read' | 'legal:update' | 'legal:delete'
  // Team
  | 'team:create' | 'team:read' | 'team:update' | 'team:delete'
  // Statistics
  | 'statistic:create' | 'statistic:read' | 'statistic:update' | 'statistic:delete'
  // Users (future)
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete'
  // Audit
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  superadmin: [
    // All permissions
    'business:create', 'business:read', 'business:update', 'business:delete',
    'business:publish', 'business:reorder',
    'service:create', 'service:read', 'service:update', 'service:delete',
    'service:publish', 'service:reorder', 'service:assign',
    'category:create', 'category:read', 'category:update', 'category:delete',
    'page:create', 'page:read', 'page:update', 'page:delete',
    'page:publish', 'block:manage',
    'navigation:create', 'navigation:read', 'navigation:update', 'navigation:delete',
    'navigation:reorder',
    'media:upload', 'media:read', 'media:update', 'media:delete',
    'booking:read', 'booking:update', 'booking:note', 'booking:export',
    'event:create', 'event:read', 'event:update', 'event:delete', 'event:publish',
    'faq:create', 'faq:read', 'faq:update', 'faq:delete', 'faq:publish',
    'testimonial:create', 'testimonial:read', 'testimonial:update', 'testimonial:delete',
    'settings:read', 'settings:update',
    'legal:create', 'legal:read', 'legal:update', 'legal:delete',
    'team:create', 'team:read', 'team:update', 'team:delete',
    'statistic:create', 'statistic:read', 'statistic:update', 'statistic:delete',
    'user:create', 'user:read', 'user:update', 'user:delete',
    'audit:read',
  ],
  content_manager: [
    'business:read', 'business:update', 'business:publish', 'business:reorder',
    'service:read', 'service:update', 'service:publish', 'service:reorder', 'service:assign',
    'category:read', 'category:update',
    'page:read', 'page:update', 'page:publish', 'block:manage',
    'navigation:read', 'navigation:update', 'navigation:reorder',
    'media:upload', 'media:read', 'media:update',
    'event:read', 'event:update', 'event:publish',
    'faq:read', 'faq:update', 'faq:publish',
    'testimonial:read', 'testimonial:update',
    'legal:read', 'legal:update',
    'team:read', 'team:update',
    'statistic:read', 'statistic:update',
    'settings:read',
  ],
  booking_manager: [
    'business:read',
    'service:read',
    'media:read',
    'booking:read', 'booking:update', 'booking:note', 'booking:export',
    'event:read',
    'faq:read',
    'settings:read',
  ],
};

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: AdminRole, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`);
  }
}
```

### Authorization in Server Actions
```typescript
// src/lib/auth/authorization.ts
import { getSession } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';

export async function assertPermission(permission: Permission): Promise<SessionContext> {
  const session = await getSession();
  if (!session) throw new AuthenticationError('Not authenticated');
  requirePermission(session.role, permission);
  return session;
}

// Usage
export async function deleteBusiness(id: string) {
  const session = await assertPermission('business:delete');
  // ... proceed
}
```

---

## 7. Audit Logging

```typescript
// src/lib/audit.ts
import { AuditLog } from '@/server/models/AuditLog';
import { getSession } from '@/lib/auth/session';

export async function auditLog(
  action: string,
  targetType: string,
  targetId: Types.ObjectId,
  metadata?: Record<string, unknown>
): Promise<void> {
  const session = await getSession();
  await AuditLog.create({
    actorId: session?.userId || new Types.ObjectId(),
    actorEmail: session?.email || 'system',
    action,
    targetType,
    targetId,
    targetSlug: metadata?.slug as string,
    metadata,
    ip: headers().get('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: headers().get('user-agent'),
    severity: getSeverity(action),
  });
}

function getSeverity(action: string): 'info' | 'warning' | 'critical' {
  if (action.includes('delete') || action.includes('archive') || action === 'user:create') return 'critical';
  if (action.includes('publish') || action.includes('status_change')) return 'warning';
  return 'info';
}
```

---

## 8. Logout Flow

```typescript
// src/app/admin/login/actions.ts
export async function adminLogout(): Promise<ActionResult<void>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = await hashToken(token);
    await Session.updateOne(
      { token: tokenHash },
      { $set: { revokedAt: new Date() } }
    );
  }

  await clearSessionCookie();
  await auditLog('logout', 'Session', new Types.ObjectId());

  redirect('/admin/login');
}
```

---

## 9. Password Reset (Future)

Not in Phase 1 scope. Placeholder for Phase 5+:
- Forgot password → email with reset token (1hr expiry)
- Reset page → validate token → new password → revoke all sessions
- Rate limited: 3 requests/hour/email

---

## Approval

**Phase 2 Authentication & Authorization Deliverable** — Reply "Approved" to proceed to Environment Spec & Cloudinary/Email docs, or request revisions.