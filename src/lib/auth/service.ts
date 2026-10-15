import { AdminUser, type IAdminUser } from '@/server/models/AdminUser';
import { Session } from '@/server/models/Session';
import { AuditLog } from '@/server/models/AuditLog';
import { hashPassword, verifyPassword, hashToken, generateSecureToken } from './password';
import { setSessionCookie, clearSessionCookie, SESSION_COOKIE } from './session';
import { config } from '@/config/env';
import { dbConnect } from '@/lib/db';
import { headers } from 'next/headers';

export interface SessionContext {
  userId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = await hashToken(token);

  await dbConnect();
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
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
  };
}

export async function createLoginSession(
  userId: string,
  rememberMe: boolean,
): Promise<void> {
  const token = generateSecureToken(32);
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(
    Date.now() + (rememberMe ? config.auth.rememberMeTtlMs : config.auth.defaultTtlMs),
  );

  const h = await headers();

  await dbConnect();
  await Session.create({
    userId,
    token: tokenHash,
    userAgent: h.get('user-agent') || undefined,
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim(),
    expiresAt,
  });

  await setSessionCookie(token, rememberMe);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = await hashToken(token);
    await dbConnect();
    await Session.updateOne(
      { token: tokenHash },
      { $set: { revokedAt: new Date() } },
    );
  }

  await clearSessionCookie();
}

export async function destroyAllUserSessions(userId: string): Promise<void> {
  await dbConnect();
  await Session.updateMany(
    { userId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export async function auditLog(
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>,
  actorEmail?: string,
): Promise<void> {
  await dbConnect();
  const h = await headers();
  await AuditLog.create({
    actorId: '000000000000000000000000',
    actorEmail: actorEmail ?? 'system',
    action,
    targetType,
    targetId,
    targetSlug: metadata?.slug ? String(metadata.slug) : undefined,
    metadata,
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: h.get('user-agent') ?? undefined,
    severity: getSeverity(action),
  });
}

function getSeverity(action: string): 'info' | 'warning' | 'critical' {
  if (action.includes('delete') || action.includes('archive')) return 'critical';
  if (action.includes('publish') || action.includes('status_change')) return 'warning';
  return 'info';
}

export async function createInitialAdmin(
  email: string,
  password: string,
  name: string,
): Promise<IAdminUser> {
  await dbConnect();

  const existing = await AdminUser.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error('An admin with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const admin = await AdminUser.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: 'superadmin',
    permissions: [],
  });

  return admin;
}

export async function validateLoginCredentials(
  email: string,
  password: string,
): Promise<IAdminUser | null> {
  await dbConnect();

  const user = await AdminUser.findOne({
    email: email.toLowerCase(),
    archivedAt: { $exists: false },
  });

  if (!user) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error('ACCOUNT_LOCKED');
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    await AdminUser.updateOne(
      { _id: user._id },
      {
        $inc: { loginAttempts: 1 },
        $set: {
          lockedUntil:
            user.loginAttempts >= 4
              ? new Date(Date.now() + 15 * 60 * 1000)
              : undefined,
        },
      },
    );
    return null;
  }

  await AdminUser.updateOne(
    { _id: user._id },
    { $set: { loginAttempts: 0, lockedUntil: undefined, lastLoginAt: new Date() } },
  );

  return user;
}

export async function getAdminCount(): Promise<number> {
  await dbConnect();
  return AdminUser.countDocuments({ archivedAt: { $exists: false } });
}
