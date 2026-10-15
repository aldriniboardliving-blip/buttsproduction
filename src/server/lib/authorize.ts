import 'server-only';

import { Types } from 'mongoose';
import { getSession, type SessionContext } from '@/lib/auth/service';
import { hasPermission, type Permission } from '@/lib/auth/rbac';
import { failure, type ActionResult } from '@/lib/action-result';

/**
 * Single server-side gate for every admin mutation.
 *
 * Previously each action repeated a bare `getSession()` check with no
 * permission enforcement. This centralises it so a new action cannot forget
 * authorisation, and it never trusts client-supplied role information.
 */
export async function authorize(
  permission: Permission,
): Promise<{ session: SessionContext } | { failure: ActionResult<never> }> {
  const session = await getSession();

  if (!session) {
    return { failure: failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' }) };
  }

  // Per-user overrides win over the role defaults; an explicit empty array
  // is treated as "no extra permissions", not "all permissions".
  const granted = new Set<string>([...(session.permissions ?? [])]);
  const roleGrants = hasPermission(session.role, permission);

  if (!roleGrants && !granted.has(permission)) {
    return {
      failure: failure({
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
        statusCode: 403,
      }),
    };
  }

  return { session };
}

/** Narrow an unknown value to a Mongo ObjectId, rejecting 12-char strings. */
export function toObjectId(value: string): Types.ObjectId | null {
  if (!value || !Types.ObjectId.isValid(value)) return null;
  return new Types.ObjectId(value);
}

/** Convert an array of unknown ids to ObjectIds, dropping invalid entries. */
export function toObjectIds(values: readonly string[] | undefined | null): Types.ObjectId[] {
  if (!values?.length) return [];
  return values
    .map((value) => toObjectId(value))
    .filter((value): value is Types.ObjectId => value !== null);
}

/** Escape a user string for safe use inside a RegExp. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}