import 'server-only';

import { revalidatePath } from 'next/cache';
import { AuditLog, type IAuditLog } from '@/server/models/AuditLog';
import type { SessionContext } from '@/lib/auth/service';

const SEVERITIES: IAuditLog['severity'][] = ['info', 'warning', 'critical'];

function severityFor(action: string): IAuditLog['severity'] {
  if (/delete|archive|restore/i.test(action)) return 'critical';
  if (/publish|unpublish|status_change/i.test(action)) return 'warning';
  return 'info';
}

/**
 * Records an administrative action against the real acting user.
 *
 * The pre-existing `auditLog()` in `@/lib/auth/service` hardcodes a zero
 * ObjectId as the actor because it is called from unauthenticated contexts
 * (login/setup). Authenticated mutations must use this instead so the audit
 * trail is attributable.
 *
 * Never throws: an audit failure must not roll back a successful mutation,
 * but it is logged to the server console so it is not silently lost.
 */
export async function recordAudit(
  session: SessionContext,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await AuditLog.create({
      actorId: session.userId,
      actorEmail: session.email,
      action,
      targetType,
      targetId,
      targetSlug: typeof metadata?.slug === 'string' ? metadata.slug : undefined,
      metadata,
      severity: SEVERITIES.includes(severityFor(action)) ? severityFor(action) : 'info',
    });
  } catch (error) {
    console.error('[audit] failed to record action', { action, targetType, targetId }, error);
  }
}

export interface RevalidationTarget {
  /** Admin section to refresh, e.g. `/admin/businesses`. */
  admin?: string[];
  /** Public listing pages, e.g. `/businesses`. */
  listing?: string[];
  /** Public detail routes, including any previous slug. */
  detail?: string[];
}

/**
 * Invalidates every surface affected by a content mutation.
 *
 * The admin tables, the public listing, the detail page (old *and* new slug,
 * so a rename cannot leave a stale page cached), the sitemap, and the homepage
 * sections that surface featured content.
 */
export function revalidateContent({ admin = [], listing = [], detail = [] }: RevalidationTarget): void {
  const publicPaths = new Set<string>(['/', '/sitemap.xml']);

  for (const path of listing) publicPaths.add(path);
  for (const path of detail) publicPaths.add(path);
  for (const path of admin) {
    revalidatePath(path);
  }

  for (const path of publicPaths) {
    revalidatePath(path);
  }
}