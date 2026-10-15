'use server';

import type { Types } from 'mongoose';
import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { Business } from '@/server/models/Business';
import { generateSlug } from '@/lib/slug';
import { generateUniqueSlug } from '@/lib/generate-unique-slug';
import { authorize, escapeRegExp, toObjectId, toObjectIds } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { businessInputSchema, listQuerySchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'business:read',
  create: 'business:create',
  update: 'business:update',
  remove: 'business:delete',
  publish: 'business:publish',
} as const;

function firstId(value: string): Types.ObjectId | undefined {
  return value ? toObjectId(value) ?? undefined : undefined;
}

function socialsOf(input: ReturnType<typeof businessInputSchema.parse>) {
  return {
    facebook: input.facebook || undefined,
    instagram: input.instagram || undefined,
    twitter: input.twitter || undefined,
    linkedin: input.linkedin || undefined,
    youtube: input.youtube || undefined,
    tiktok: input.tiktok || undefined,
  };
}

export async function createBusiness(raw: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = businessInputSchema.safeParse(raw);
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
    const slug = await generateUniqueSlug(Business, generateSlug(input.name));

    const business = await Business.create({
      name: input.name,
      slug,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      logo: firstId(input.logoId),
      coverImage: firstId(input.coverImageId),
      gallery: toObjectIds(input.galleryIds),
      contact: {
        phone: input.phone || undefined,
        email: input.email || undefined,
        address: {
          street: input.street || undefined,
          city: input.city || undefined,
          state: input.state || undefined,
          zip: input.zip || undefined,
          country: input.country || 'US',
        },
        hours: input.hours || undefined,
      },
      social: socialsOf(input),
      featured: input.featured,
      displayOrder: input.displayOrder,
      published: input.published,
      settings: {
        bookingEnabled: input.bookingEnabled,
        defaultBookingForm: input.defaultBookingForm || undefined,
      },
      metaTitle: input.metaTitle || undefined,
      metaDescription: input.metaDescription || undefined,
      ogTitle: input.ogTitle || undefined,
      ogDescription: input.ogDescription || undefined,
      ogImage: firstId(input.ogImageId),
      canonicalUrl: input.canonicalUrl || undefined,
      noindex: input.noindex,
      nofollow: input.nofollow,
    });

    await recordAudit(auth.session, 'business.create', 'Business', business._id.toString(), {
      slug,
      name: business.name,
    });

    revalidateContent({
      admin: ['/admin/businesses', '/admin/dashboard'],
      listing: ['/businesses', '/'],
      detail: [`/businesses/${slug}`],
    });

    return success({ id: business._id.toString(), slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A business with this slug already exists' });
    }
    console.error('[businesses] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the business' });
  }
}

export async function updateBusiness(id: string, raw: unknown): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

  const parsed = businessInputSchema.partial().safeParse(raw);
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
    const existing = await Business.findById(objectId);
    if (!existing) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

    const update: Record<string, unknown> = {};

    if (typeof input.name === 'string' && input.name && input.name !== existing.name) {
      const slug = await generateUniqueSlug(Business, generateSlug(input.name), existing._id.toString());
      update.slug = slug;
      update.slugHistory = [...(existing.slugHistory ?? []), existing.slug];
    }

    if (typeof input.shortDescription === 'string') update.shortDescription = input.shortDescription || undefined;
    if (typeof input.description === 'string') update.description = input.description || undefined;
    if (input.logoId !== undefined) update.logo = firstId(input.logoId);
    if (input.coverImageId !== undefined) update.coverImage = firstId(input.coverImageId);
    if (input.galleryIds !== undefined) update.gallery = toObjectIds(input.galleryIds);

    // Merge rather than replace, so untouched contact fields survive an edit.
    const contactTouched =
      ['phone', 'email', 'street', 'city', 'state', 'zip', 'country', 'hours'] as const;
    if (contactTouched.some((key) => input[key] !== undefined)) {
      update.contact = {
        phone: input.phone ?? existing.contact?.phone,
        email: input.email ?? existing.contact?.email,
        address: {
          street: input.street ?? existing.contact?.address?.street,
          city: input.city ?? existing.contact?.address?.city,
          state: input.state ?? existing.contact?.address?.state,
          zip: input.zip ?? existing.contact?.address?.zip,
          country: input.country ?? existing.contact?.address?.country,
        },
        hours: input.hours ?? existing.contact?.hours,
      };
    }

    const socialKeys = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'] as const;
    if (socialKeys.some((key) => input[key] !== undefined)) {
      update.social = {
        facebook: input.facebook ?? existing.social?.facebook,
        instagram: input.instagram ?? existing.social?.instagram,
        twitter: input.twitter ?? existing.social?.twitter,
        linkedin: input.linkedin ?? existing.social?.linkedin,
        youtube: input.youtube ?? existing.social?.youtube,
        tiktok: input.tiktok ?? existing.social?.tiktok,
      };
    }

    if (input.featured !== undefined) update.featured = input.featured;
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.published !== undefined) update.published = input.published;
    if (input.bookingEnabled !== undefined || input.defaultBookingForm !== undefined) {
      update.settings = {
        bookingEnabled: input.bookingEnabled ?? existing.settings?.bookingEnabled ?? true,
        defaultBookingForm: input.defaultBookingForm ?? existing.settings?.defaultBookingForm,
      };
    }

    if (input.metaTitle !== undefined) update.metaTitle = input.metaTitle || undefined;
    if (input.metaDescription !== undefined) update.metaDescription = input.metaDescription || undefined;
    if (input.ogTitle !== undefined) update.ogTitle = input.ogTitle || undefined;
    if (input.ogDescription !== undefined) update.ogDescription = input.ogDescription || undefined;
    if (input.ogImageId !== undefined) update.ogImage = firstId(input.ogImageId);
    if (input.canonicalUrl !== undefined) update.canonicalUrl = input.canonicalUrl || undefined;
    if (input.noindex !== undefined) update.noindex = input.noindex;
    if (input.nofollow !== undefined) update.nofollow = input.nofollow;

    const previousSlug = existing.slug;
    await Business.updateOne({ _id: objectId }, { $set: update });

    const newSlug = (update.slug as string | undefined) ?? previousSlug;

    await recordAudit(auth.session, 'business.update', 'Business', id, {
      slug: newSlug,
      renamed: newSlug !== previousSlug ? previousSlug : undefined,
    });

    revalidateContent({
      admin: ['/admin/businesses', '/admin/dashboard'],
      listing: ['/businesses', '/'],
      // Invalidate the old slug too, so a rename cannot leave a stale page.
      detail: [`/businesses/${newSlug}`, ...(newSlug !== previousSlug ? [`/businesses/${previousSlug}`] : [])],
    });

    return success({ slug: newSlug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A business with this slug already exists' });
    }
    console.error('[businesses] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the business' });
  }
}

export async function publishBusiness(id: string, published: boolean): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

  try {
    await dbConnect();
    const business = await Business.findById(objectId);

    if (!business) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

    if (business.archivedAt) {
      return failure({
        code: 'CONFLICT',
        message: 'Restore this business before publishing it',
      });
    }

    if (published && !business.name) {
      return failure({ code: 'VALIDATION_ERROR', message: 'This business has no name' });
    }

    business.published = published;
    await business.save();

    await recordAudit(
      auth.session,
      published ? 'business.publish' : 'business.unpublish',
      'Business',
      id,
      { slug: business.slug },
    );

    revalidateContent({
      admin: ['/admin/businesses', '/admin/dashboard'],
      listing: ['/businesses', '/'],
      detail: [`/businesses/${business.slug}`],
    });

    return success({ slug: business.slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({
        code: 'DUPLICATE',
        message: 'Another published business already uses this slug',
      });
    }
    console.error('[businesses] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteBusiness(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

  try {
    await dbConnect();
    const business = await Business.findById(objectId);
    if (!business) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

    // Soft delete keeps service relationships and media references intact.
    business.archivedAt = new Date();
    business.published = false;
    business.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await business.save();

    await recordAudit(auth.session, 'business.archive', 'Business', id, { slug: business.slug });

    revalidateContent({
      admin: ['/admin/businesses', '/admin/dashboard'],
      listing: ['/businesses', '/'],
      detail: [`/businesses/${business.slug}`],
    });

    return success(undefined);
  } catch (error) {
    console.error('[businesses] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the business' });
  }
}

export async function restoreBusiness(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Business not found' });

  try {
    await dbConnect();
    const result = await Business.updateOne(
      { _id: objectId },
      { $unset: { archivedAt: '', archivedBy: '' } },
    );
    if (result.matchedCount === 0) {
      return failure({ code: 'NOT_FOUND', message: 'Business not found' });
    }

    await recordAudit(auth.session, 'business.restore', 'Business', id);
    revalidateContent({ admin: ['/admin/businesses'], listing: ['/businesses', '/'] });

    return success(undefined);
  } catch (error) {
    console.error('[businesses] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the business' });
  }
}

export async function listBusinesses(
  raw: unknown = {},
): Promise<ActionResult<{ businesses: unknown[]; total: number; page: number; totalPages: number }>> {
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

    const [businesses, total] = await Promise.all([
      Business.find(query)
        .select('name slug published featured displayOrder archivedAt shortDescription updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Business.countDocuments(query),
    ]);

    return success({
      businesses,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('[businesses] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load businesses' });
  }
}