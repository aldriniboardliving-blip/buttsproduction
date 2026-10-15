# Butts Productions — Environment Configuration

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Environment Variables Specification

### `.env.example` (Commit to Repo)
```bash
# ============================================
# APPLICATION
# ============================================
NODE_ENV=development                    # development | production | test
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Butts Productions"
NEXT_PUBLIC_APP_DESCRIPTION="Family-owned business providing diverse services to the community"

# ============================================
# DATABASE (MongoDB Atlas)
# ============================================
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/buttsproductions?retryWrites=true&w=majority
MONGODB_DB_NAME=buttsproductions

# ============================================
# AUTHENTICATION
# ============================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_SETUP_TOKEN=your-super-secret-setup-token-here
SESSION_SECRET=your-session-secret-min-32-chars
COOKIE_DOMAIN=.buttsproductions.com          # production: .buttsproductions.com, dev: localhost

# ============================================
# CLOUDINARY
# ============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=buttsproductions_admin  # unsigned preset for admin direct upload
CLOUDINARY_FOLDER_PREFIX=buttsproductions

# ============================================
# EMAIL (Resend)
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM_NAME="Butts Productions"
EMAIL_FROM_EMAIL=noreply@buttsproductions.com
EMAIL_REPLY_TO=info@buttsproductions.com

# ============================================
# RECAPTCHA (Google reCAPTCHA v3)
# ============================================
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# ============================================
# ANALYTICS & MONITORING
# ============================================
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
SENTRY_DSN=https://xxxx@sentry.io/xxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@sentry.io/xxxx

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_ENABLE_SPANISH_FORM=true
NEXT_PUBLIC_MAINTENANCE_MODE=false

# ============================================
# RATE LIMITING (Redis - optional, uses in-memory fallback)
# ============================================
REDIS_URL=redis://localhost:6379
RATE_LIMIT_ENABLED=true

# ============================================
# FILE UPLOAD LIMITS
# ============================================
MAX_FILE_SIZE_MB=20
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/avif,application/pdf
```

---

### `.env.local` (Development - Git Ignored)
```bash
# Copy .env.example and fill in values
# NEVER commit this file
```

### Production (Vercel Environment Variables)
Set in Vercel Dashboard → Settings → Environment Variables:
- All variables from `.env.example` with production values
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_URL=https://buttsproductions.com`
- `COOKIE_DOMAIN=.buttsproductions.com`
- `MONGODB_URI` → Atlas production cluster
- `CLOUDINARY_*` → Production Cloudinary account
- `RESEND_API_KEY` → Production Resend key
- `RECAPTCHA_*` → Production keys
- `SENTRY_DSN` → Production Sentry project
- `GA4_MEASUREMENT_ID` → Production GA4 property

---

## Environment Validation (Zod Schema)

```typescript
// src/config/env.ts
import { z } from 'zod';

const EnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1),

  // Database
  MONGODB_URI: z.string().startsWith('mongodb'),
  MONGODB_DB_NAME: z.string().min(1),

  // Auth
  ADMIN_SETUP_TOKEN: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
  CLOUDINARY_FOLDER_PREFIX: z.string().min(1),

  // Email
  RESEND_API_KEY: z.string().startsWith('re_'),
  EMAIL_FROM_NAME: z.string().min(1),
  EMAIL_FROM_EMAIL: z.string().email(),
  EMAIL_REPLY_TO: z.string().email(),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),

  // Analytics
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
  NEXT_PUBLIC_GTM_CONTAINER_ID: z.string().startsWith('GTM-').optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Features
  NEXT_PUBLIC_ENABLE_SPANISH_FORM: z.coerce.boolean().default(true),
  NEXT_PUBLIC_MAINTENANCE_MODE: z.coerce.boolean().default(false),

  // Rate Limiting
  REDIS_URL: z.string().url().optional(),
  RATE_LIMIT_ENABLED: z.coerce.boolean().default(true),

  // Uploads
  MAX_FILE_SIZE_MB: z.coerce.number().int().min(1).max(100).default(20),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/avif,application/pdf'),
});

export type Env = z.infer<typeof EnvSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const msg = Object.entries(errors)
      .map(([k, v]) => `${k}: ${v.join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${msg}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

// Client-safe env (only NEXT_PUBLIC_*)
export function getClientEnv() {
  const env = getEnv();
  return {
    APP_URL: env.NEXT_PUBLIC_APP_URL,
    APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    APP_DESCRIPTION: env.NEXT_PUBLIC_APP_DESCRIPTION,
    RECAPTCHA_SITE_KEY: env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    GA4_MEASUREMENT_ID: env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    GTM_CONTAINER_ID: env.NEXT_PUBLIC_GTM_CONTAINER_ID,
    SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
    ENABLE_SPANISH_FORM: env.NEXT_PUBLIC_ENABLE_SPANISH_FORM,
    MAINTENANCE_MODE: env.NEXT_PUBLIC_MAINTENANCE_MODE,
  };
}
```

---

## Configuration Modules

```typescript
// src/config/index.ts
export const config = {
  app: {
    name: getEnv().NEXT_PUBLIC_APP_NAME,
    url: getEnv().NEXT_PUBLIC_APP_URL,
    description: getEnv().NEXT_PUBLIC_APP_DESCRIPTION,
  },
  db: {
    uri: getEnv().MONGODB_URI,
    name: getEnv().MONGODB_DB_NAME,
  },
  auth: {
    setupToken: getEnv().ADMIN_SETUP_TOKEN,
    sessionSecret: getEnv().SESSION_SECRET,
    cookieDomain: getEnv().COOKIE_DOMAIN,
    defaultTtlMs: 24 * 60 * 60 * 1000,
    rememberMeTtlMs: 30 * 24 * 60 * 60 * 1000,
  },
  cloudinary: {
    cloudName: getEnv().CLOUDINARY_CLOUD_NAME,
    apiKey: getEnv().CLOUDINARY_API_KEY,
    apiSecret: getEnv().CLOUDINARY_API_SECRET,
    uploadPreset: getEnv().CLOUDINARY_UPLOAD_PRESET,
    folderPrefix: getEnv().CLOUDINARY_FOLDER_PREFIX,
  },
  email: {
    apiKey: getEnv().RESEND_API_KEY,
    fromName: getEnv().EMAIL_FROM_NAME,
    fromEmail: getEnv().EMAIL_FROM_EMAIL,
    replyTo: getEnv().EMAIL_REPLY_TO,
  },
  recaptcha: {
    secretKey: getEnv().RECAPTCHA_SECRET_KEY,
    siteKey: getEnv().NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  analytics: {
    ga4: getEnv().NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    gtm: getEnv().NEXT_PUBLIC_GTM_CONTAINER_ID,
    sentryDsn: getEnv().SENTRY_DSN,
    sentryPublicDsn: getEnv().NEXT_PUBLIC_SENTRY_DSN,
  },
  features: {
    spanishForm: getEnv().NEXT_PUBLIC_ENABLE_SPANISH_FORM,
    maintenanceMode: getEnv().NEXT_PUBLIC_MAINTENANCE_MODE,
  },
  upload: {
    maxSizeBytes: getEnv().MAX_FILE_SIZE_MB * 1024 * 1024,
    allowedTypes: getEnv().ALLOWED_FILE_TYPES.split(',').map(s => s.trim()),
  },
  rateLimit: {
    enabled: getEnv().RATE_LIMIT_ENABLED,
    redisUrl: getEnv().REDIS_URL,
  },
} as const;
```

---

## Required External Services Setup

### 1. MongoDB Atlas
1. Create cluster (M10+ recommended for production)
2. Create database user with readWrite on `buttsproductions` db
3. Whitelist IPs (0.0.0.0/0 for Vercel, or VPC peering)
4. Get connection string → `MONGODB_URI`

### 2. Cloudinary
1. Create account
2. Note `cloud_name`, `api_key`, `api_secret`
3. Create **unsigned upload preset**: `buttsproductions_admin`
   - Folder: `buttsproductions/admin`
   - Allowed formats: jpg, png, webp, avif, pdf
   - Max file size: 20MB
   - Eager transformations: `f_auto,q_auto,w_1920` + responsive widths
4. Create **signed upload** for server-side (uses api_secret)

### 3. Resend (Email)
1. Create account
2. Verify domain `buttsproductions.com` (DKIM/SPF/DMARC)
3. Create API key → `RESEND_API_KEY`
4. Set up templates (see email specs)

### 4. Google reCAPTCHA v3
1. Go to Google Cloud Console → reCAPTCHA Enterprise
2. Create site (Score-based, v3)
3. Add domains: `localhost`, `buttsproductions.com`, `*.vercel.app`
4. Get Site Key → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
5. Get Secret Key → `RECAPTCHA_SECRET_KEY`

### 5. Google Analytics 4
1. Create GA4 property
2. Data stream → Web → Enhanced measurement ON
3. Measurement ID → `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
4. (Optional) GTM container → `NEXT_PUBLIC_GTM_CONTAINER_ID`

### 6. Sentry
1. Create project (Next.js)
2. DSN → `SENTRY_DSN` (server) + `NEXT_PUBLIC_SENTRY_DSN` (client)
3. Set up source maps upload in CI

### 7. Vercel
1. Connect GitHub repo
2. Add environment variables
3. Configure custom domain `buttsproductions.com`
4. Add staging subdomain `staging.buttsproductions.com`

---

## Secrets Management Rules

| Variable | Client-Safe? | Rotation | Notes |
|----------|--------------|----------|-------|
| `MONGODB_URI` | ❌ | Quarterly | Atlas user rotation |
| `SESSION_SECRET` | ❌ | Annual | 32+ chars random |
| `ADMIN_SETUP_TOKEN` | ❌ | One-time | Remove after setup |
| `CLOUDINARY_API_SECRET` | ❌ | Quarterly | Regenerate in Cloudinary |
| `RESEND_API_KEY` | ❌ | Quarterly | Regenerate in Resend |
| `RECAPTCHA_SECRET_KEY` | ❌ | Annual | |
| `SENTRY_DSN` | ❌ | As needed | |
| `NEXT_PUBLIC_*` | ✅ | N/A | Safe for client bundle |
| `COOKIE_DOMAIN` | ❌ | Rare | Production only |

---

## Validation at Build Time

```typescript
// next.config.ts
import { getEnv } from './src/config/env';

// Validate at build time
getEnv(); // Throws if invalid

export default {
  // ... config
  env: getClientEnv(), // Only client-safe vars
};
```

---

## Approval

**Phase 2 Environment Configuration Deliverable** — Reply "Approved" to proceed to Cloudinary & Email specs, or request revisions.