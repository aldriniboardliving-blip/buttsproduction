'use server';

import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { TeamMember } from '@/server/models/TeamMember';
import { Business } from '@/server/models/Business';
import { authorize, escapeRegExp, toObjectId } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { listQuerySchema, teamMemberInputSchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'team:read',
  create: 'team:create',
  update: 'team:update',
  remove: 'team:delete',
  publish: 'faq:publish',
} as const;

const PATHS = { admin: '/admin/team', listing: ['/about', '/businesses', '/'] } as const;

export async function createTeamMember(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = teamMemberInputSchema.safeParse(raw);
  if (!parsed.success) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields',
      fields: toFieldErrors(parsed.error),
    });
  }
  const input = parsed.data;

  try {
    await dbConnect();
    const member = await TeamMember.create({
      name: input.name,
      role: input.role,
      bio: input.bio || undefined,
      photo: toObjectId(input.photoId) ?? undefined,
      email: input.email || undefined,
      phone: input.phone || undefined,
      socials: {
        facebook: input.facebook || undefined,
        instagram: input.instagram || undefined,
        linkedin: input.linkedin || undefined,
        twitter: input.twitter || undefined,
      },
      displayOrder: input.displayOrder,
      published: input.published,
    });

    await recordAudit(auth.session, 'team.create', 'TeamMember', member._id.toString(), {
      name: member.name,
    });
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success({ id: member._id.toString() });
  } catch (error) {
    console.error('[team] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the team member' });
  }
}

export async function updateTeamMember(id: string, raw: unknown): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Team member not found' });

  const parsed = teamMemberInputSchema.partial().safeParse(raw);
  if (!parsed.success) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields',
      fields: toFieldErrors(parsed.error),
    });
  }
  const input = parsed.data;

  try {
    await dbConnect();
    const update: Record<string, unknown> = {};
    if (input.name !== undefined) update.name = input.name;
    if (input.role !== undefined) update.role = input.role;
    if (input.bio !== undefined) update.bio = input.bio || undefined;
    if (input.photoId !== undefined) update.photo = toObjectId(input.photoId) ?? undefined;
    if (input.email !== undefined) update.email = input.email || undefined;
    if (input.phone !== undefined) update.phone = input.phone || undefined;
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.published !== undefined) update.published = input.published;
    if (['facebook', 'instagram', 'linkedin', 'twitter'].some((k) => input[k as keyof typeof input] !== undefined)) {
      update.socials = {
        facebook: input.facebook,
        instagram: input.instagram,
        linkedin: input.linkedin,
        twitter: input.twitter,
      };
    }

    const result = await TeamMember.updateOne({ _id: objectId }, { $set: update });
    if (result.matchedCount === 0) {
      return failure({ code: 'NOT_FOUND', message: 'Team member not found' });
    }

    await recordAudit(auth.session, 'team.update', 'TeamMember', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[team] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the team member' });
  }
}

export async function publishTeamMember(id: string, published: boolean): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Team member not found' });

  try {
    await dbConnect();
    const member = await TeamMember.findById(objectId);
    if (!member) return failure({ code: 'NOT_FOUND', message: 'Team member not found' });
    if (member.archivedAt) {
      return failure({ code: 'CONFLICT', message: 'Restore this team member before publishing them' });
    }

    member.published = published;
    await member.save();

    await recordAudit(
      auth.session,
      published ? 'team.publish' : 'team.unpublish',
      'TeamMember',
      id,
    );
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[team] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Team member not found' });

  try {
    await dbConnect();
    const member = await TeamMember.findById(objectId);
    if (!member) return failure({ code: 'NOT_FOUND', message: 'Team member not found' });

    member.archivedAt = new Date();
    member.published = false;
    member.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await member.save();

    // Detach from businesses so a published page never renders a dangling id.
    await Business.updateMany({ teamMemberIds: member._id }, { $pull: { teamMemberIds: member._id } });

    await recordAudit(auth.session, 'team.archive', 'TeamMember', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[team] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the team member' });
  }
}

export async function listTeamMembers(
  raw: unknown = {},
): Promise<ActionResult<{ members: unknown[]; total: number; page: number; totalPages: number }>> {
  const auth = await authorize(PERMISSIONS.read);
  if ('failure' in auth) return auth.failure;

  const parsed = listQuerySchema.safeParse(raw);
  if (!parsed.success) return failure({ code: 'VALIDATION_ERROR', message: 'Invalid filters' });

  const { search, published, page, limit } = parsed.data;

  try {
    await dbConnect();
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: escapeRegExp(search), $options: 'i' } },
        { role: { $regex: escapeRegExp(search), $options: 'i' } },
      ];
    }
    if (published !== 'all') query.published = published === 'true';

    const [members, total] = await Promise.all([
      TeamMember.find(query)
        .select('name role photo published displayOrder archivedAt updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TeamMember.countDocuments(query),
    ]);

    return success({ members, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    console.error('[team] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load team members' });
  }
}
export async function restoreTeamMember(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'team member not found' });

  try {
    await dbConnect();
    const result = await TeamMember.updateOne({ _id: objectId }, { $unset: { archivedAt: '', archivedBy: '' } });
    if (result.matchedCount === 0) {
      return failure({ code: 'NOT_FOUND', message: 'team member not found' });
    }

    await recordAudit(auth.session, 'TeamMember.restore', 'team member', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });
    return success(undefined);
  } catch (error) {
    console.error('[TeamMember] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the team member' });
  }
}