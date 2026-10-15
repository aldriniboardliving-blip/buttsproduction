'use server';

import type { Types } from 'mongoose';
import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { Event } from '@/server/models/Event';
import { generateSlug } from '@/lib/slug';
import { generateUniqueSlug } from '@/lib/generate-unique-slug';
import { authorize, escapeRegExp, toObjectId, toObjectIds } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { eventInputSchema, listQuerySchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'event:read',
  create: 'event:create',
  update: 'event:update',
  remove: 'event:delete',
  publish: 'event:publish',
} as const;

const PATHS = { admin: '/admin/events', listing: ['/events', '/'], detail: '/events' } as const;

function mapInput(input: Partial<ReturnType<typeof eventInputSchema.parse>>, existing?: Record<string, unknown>) {
  const pick = <T,>(value: T | undefined, fallback: T | undefined): T | undefined =>
    value === undefined ? fallback : value;

  return {
    shortDescription: pick(input.shortDescription, existing?.shortDescription as string | undefined) || undefined,
    description: pick(input.description, existing?.description as string | undefined) || undefined,
    venue: pick(input.venue, existing?.venue as string | undefined) || undefined,
    address: pick(input.address, existing?.address as string | undefined) || undefined,
    registrationUrl: pick(input.registrationUrl, existing?.registrationUrl as string | undefined) || undefined,
    startDate: pick(input.startDate as Date | undefined, existing?.startDate as Date | undefined),
    endDate: pick(input.endDate as Date | undefined, existing?.endDate as Date | undefined),
    bannerImage: input.bannerImageId !== undefined
      ? toObjectId(input.bannerImageId) ?? undefined
      : (existing?.bannerImage as Types.ObjectId | undefined),
    gallery: input.galleryIds !== undefined
      ? toObjectIds(input.galleryIds)
      : ((existing?.gallery as Types.ObjectId[] | undefined) ?? []),
    businessIds: input.businessIds !== undefined
      ? toObjectIds(input.businessIds)
      : ((existing?.businessIds as Types.ObjectId[] | undefined) ?? []),
    ogImage: input.ogImageId !== undefined
      ? toObjectId(input.ogImageId) ?? undefined
      : (existing?.ogImage as Types.ObjectId | undefined),
    metaTitle: pick(input.metaTitle, existing?.metaTitle as string | undefined) || undefined,
    metaDescription: pick(input.metaDescription, existing?.metaDescription as string | undefined) || undefined,
    ogTitle: pick(input.ogTitle, existing?.ogTitle as string | undefined) || undefined,
    ogDescription: pick(input.ogDescription, existing?.ogDescription as string | undefined) || undefined,
    canonicalUrl: pick(input.canonicalUrl, existing?.canonicalUrl as string | undefined) || undefined,
  };
}

export async function createEvent(raw: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = eventInputSchema.safeParse(raw);
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
    const slug = await generateUniqueSlug(Event, generateSlug(input.name));
    const mapped = mapInput(input);

    const event = await Event.create({
      name: input.name,
      slug,
      ...mapped,
      featured: input.featured,
      published: input.published,
      displayOrder: input.displayOrder,
      noindex: input.noindex,
      nofollow: input.nofollow,
    });

    await recordAudit(auth.session, 'event.create', 'Event', event._id.toString(), {
      slug,
      name: event.name,
    });

    revalidateContent({
      admin: [PATHS.admin, '/admin/dashboard'],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${slug}`],
    });

    return success({ id: event._id.toString(), slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'An event with this slug already exists' });
    }
    console.error('[events] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the event' });
  }
}

export async function updateEvent(id: string, raw: unknown): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

  const parsed = eventInputSchema.partial().safeParse(raw);
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
    const existing = await Event.findById(objectId).lean();
    if (!existing) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

    const update: Record<string, unknown> = { ...mapInput(input, existing as never) };

    if (typeof input.name === 'string' && input.name && input.name !== existing.name) {
      const slug = await generateUniqueSlug(Event, generateSlug(input.name), existing._id.toString());
      update.slug = slug;
      update.slugHistory = [...(existing.slugHistory ?? []), existing.slug];
    }
    if (input.featured !== undefined) update.featured = input.featured;
    if (input.published !== undefined) update.published = input.published;
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.noindex !== undefined) update.noindex = input.noindex;
    if (input.nofollow !== undefined) update.nofollow = input.nofollow;

    const previousSlug = existing.slug;
    await Event.updateOne({ _id: objectId }, { $set: update });
    const newSlug = (update.slug as string | undefined) ?? previousSlug;

    await recordAudit(auth.session, 'event.update', 'Event', id, { slug: newSlug });
    revalidateContent({
      admin: [PATHS.admin, '/admin/dashboard'],
      listing: [...PATHS.listing],
      detail: [
        `${PATHS.detail}/${newSlug}`,
        ...(newSlug !== previousSlug ? [`${PATHS.detail}/${previousSlug}`] : []),
      ],
    });

    return success({ slug: newSlug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'An event with this slug already exists' });
    }
    console.error('[events] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the event' });
  }
}

export async function publishEvent(id: string, published: boolean): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

  try {
    await dbConnect();
    const event = await Event.findById(objectId);
    if (!event) return failure({ code: 'NOT_FOUND', message: 'Event not found' });
    if (event.archivedAt) {
      return failure({ code: 'CONFLICT', message: 'Restore this event before publishing it' });
    }

    event.published = published;
    await event.save();

    await recordAudit(
      auth.session,
      published ? 'event.publish' : 'event.unpublish',
      'Event',
      id,
      { slug: event.slug },
    );

    revalidateContent({
      admin: [PATHS.admin, '/admin/dashboard'],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${event.slug}`],
    });

    return success({ slug: event.slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'Another published event already uses this slug' });
    }
    console.error('[events] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

  try {
    await dbConnect();
    const event = await Event.findById(objectId);
    if (!event) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

    event.archivedAt = new Date();
    event.published = false;
    event.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await event.save();

    await recordAudit(auth.session, 'event.archive', 'Event', id, { slug: event.slug });
    revalidateContent({
      admin: [PATHS.admin, '/admin/dashboard'],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${event.slug}`],
    });

    return success(undefined);
  } catch (error) {
    console.error('[events] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the event' });
  }
}

export async function restoreEvent(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

  try {
    await dbConnect();
    const result = await Event.updateOne({ _id: objectId }, { $unset: { archivedAt: '', archivedBy: '' } });
    if (result.matchedCount === 0) return failure({ code: 'NOT_FOUND', message: 'Event not found' });

    await recordAudit(auth.session, 'event.restore', 'Event', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });
    return success(undefined);
  } catch (error) {
    console.error('[events] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the event' });
  }
}

export async function listEvents(
  raw: unknown = {},
): Promise<ActionResult<{ events: unknown[]; total: number; page: number; totalPages: number }>> {
  const auth = await authorize(PERMISSIONS.read);
  if ('failure' in auth) return auth.failure;

  const parsed = listQuerySchema.safeParse(raw);
  if (!parsed.success) return failure({ code: 'VALIDATION_ERROR', message: 'Invalid filters' });

  const { search, published, page, limit } = parsed.data;

  try {
    await dbConnect();
    const query: Record<string, unknown> = {};
    if (search) query.name = { $regex: escapeRegExp(search), $options: 'i' };
    if (published !== 'all') query.published = published === 'true';

    const [events, total] = await Promise.all([
      Event.find(query)
        .select('name slug published featured startDate endDate venue archivedAt updatedAt')
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(query),
    ]);

    return success({ events, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    console.error('[events] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load events' });
  }
}