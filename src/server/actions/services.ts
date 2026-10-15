'use server';

import type { Types } from 'mongoose';
import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { Service } from '@/server/models/Service';
import { Category } from '@/server/models/Category';
import { Business } from '@/server/models/Business';
import { generateSlug } from '@/lib/slug';
import { generateUniqueSlug } from '@/lib/generate-unique-slug';
import { authorize, escapeRegExp, toObjectId, toObjectIds } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { listQuerySchema, serviceInputSchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'service:read',
  create: 'service:create',
  update: 'service:update',
  remove: 'service:delete',
  publish: 'service:publish',
} as const;

function idOf(value: string | undefined): Types.ObjectId | undefined {
  return value ? toObjectId(value) ?? undefined : undefined;
}

const seoOf = (
  input: Partial<ReturnType<typeof serviceInputSchema.parse>>,
  existing?: {
    metaTitle?: string;
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    canonicalUrl?: string;
  },
) => ({
  metaTitle: input.metaTitle ?? existing?.metaTitle,
  metaDescription: input.metaDescription ?? existing?.metaDescription,
  ogTitle: input.ogTitle ?? existing?.ogTitle,
  ogDescription: input.ogDescription ?? existing?.ogDescription,
  canonicalUrl: input.canonicalUrl ?? existing?.canonicalUrl,
});

export async function createService(raw: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = serviceInputSchema.safeParse(raw);
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

    // Referenced records must exist before we can safely attach them.
    const categoryId = toObjectId(input.categoryId);
    if (!categoryId || !(await Category.exists({ _id: categoryId }))) {
      return failure({ code: 'VALIDATION_ERROR', message: 'Choose a valid category', fields: { categoryId: ['Unknown category'] } });
    }

    const businessIds = toObjectIds(input.businessIds);
    if (businessIds.length > 0) {
      const found = await Business.countDocuments({ _id: { $in: businessIds } });
      if (found !== businessIds.length) {
        return failure({ code: 'VALIDATION_ERROR', message: 'One or more businesses no longer exist', fields: { businessIds: ['Unknown business'] } });
      }
    }

    const slug = await generateUniqueSlug(Service, generateSlug(input.name));

    const service = await Service.create({
      name: input.name,
      slug,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      categoryId,
      businessIds,
      pricing: {
        amount: input.pricing.amount,
        currency: input.pricing.currency,
        unit: input.pricing.unit,
        customUnitLabel: input.pricing.customUnitLabel || undefined,
      },
      duration: input.duration || undefined,
      locationType: input.locationType,
      locationDetails: input.locationDetails || undefined,
      gallery: toObjectIds(input.galleryIds),
      featured: input.featured,
      displayOrder: input.displayOrder,
      published: input.published,
      bookingConfig: input.bookingConfig ?? {
        formKey: 'general',
        requiresApproval: true,
        collectsPayment: false,
      },
      faqIds: toObjectIds(input.faqIds),
      ...seoOf(input),
      noindex: input.noindex,
      nofollow: input.nofollow,
    });

    await Promise.all([
      Category.updateOne({ _id: categoryId }, { $inc: { serviceCount: 1 } }),
      businessIds.length
        ? Business.updateMany({ _id: { $in: businessIds } }, { $addToSet: { serviceIds: service._id } })
        : Promise.resolve(),
    ]);

    await recordAudit(auth.session, 'service.create', 'Service', service._id.toString(), {
      slug,
      name: service.name,
    });

    revalidateContent({
      admin: ['/admin/services', '/admin/dashboard'],
      listing: ['/services', '/'],
      detail: [`/services/${slug}`],
    });

    return success({ id: service._id.toString(), slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A service with this slug already exists' });
    }
    console.error('[services] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the service' });
  }
}

export async function updateService(id: string, raw: unknown): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

  const parsed = serviceInputSchema.partial().safeParse(raw);
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
    const existing = await Service.findById(objectId);
    if (!existing) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

    const update: Record<string, unknown> = {};

    if (typeof input.name === 'string' && input.name && input.name !== existing.name) {
      const slug = await generateUniqueSlug(Service, generateSlug(input.name), existing._id.toString());
      update.slug = slug;
      update.slugHistory = [...(existing.slugHistory ?? []), existing.slug];
    }

    if (input.shortDescription !== undefined) update.shortDescription = input.shortDescription || undefined;
    if (input.description !== undefined) update.description = input.description || undefined;
    if (input.duration !== undefined) update.duration = input.duration || undefined;
    if (input.locationType !== undefined) update.locationType = input.locationType;
    if (input.locationDetails !== undefined) update.locationDetails = input.locationDetails || undefined;
    if (input.galleryIds !== undefined) update.gallery = toObjectIds(input.galleryIds);
    if (input.faqIds !== undefined) update.faqIds = toObjectIds(input.faqIds);
    if (input.pricing !== undefined) update.pricing = input.pricing;
    if (input.bookingConfig !== undefined) {
      update.bookingConfig = {
        ...existing.bookingConfig,
        ...input.bookingConfig,
      };
    }
    if (input.featured !== undefined) update.featured = input.featured;
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.published !== undefined) update.published = input.published;

    const seo = seoOf(input, existing);
    const seoKeys = ['metaTitle', 'metaDescription', 'ogTitle', 'ogDescription', 'canonicalUrl'] as const;
    for (const key of seoKeys) {
      if (input[key] !== undefined) update[key] = seo[key] || undefined;
    }
    if (input.noindex !== undefined) update.noindex = input.noindex;
    if (input.nofollow !== undefined) update.nofollow = input.nofollow;

    const previousSlug = existing.slug;
    const previousCategory = existing.categoryId;
    const previousBusinesses: string[] = existing.businessIds.map((value: Types.ObjectId) =>
      value.toString(),
    );

    if (input.categoryId !== undefined) {
      const categoryId = toObjectId(input.categoryId);
      if (!categoryId || !(await Category.exists({ _id: categoryId }))) {
        return failure({ code: 'VALIDATION_ERROR', message: 'Choose a valid category', fields: { categoryId: ['Unknown category'] } });
      }
      update.categoryId = categoryId;
    }

    if (input.businessIds !== undefined) {
      const businessIds = toObjectIds(input.businessIds);
      if (businessIds.length > 0) {
        const found = await Business.countDocuments({ _id: { $in: businessIds } });
        if (found !== businessIds.length) {
          return failure({ code: 'VALIDATION_ERROR', message: 'One or more businesses no longer exist', fields: { businessIds: ['Unknown business'] } });
        }
      }
      update.businessIds = businessIds;
    }

    await Service.updateOne({ _id: objectId }, { $set: update });

    // Keep denormalised counters and relationships truthful.
    const nextCategory = (update.categoryId as Types.ObjectId | undefined) ?? previousCategory;
    if (nextCategory.toString() !== previousCategory.toString()) {
      await Promise.all([
        Category.updateOne({ _id: previousCategory }, { $inc: { serviceCount: -1 } }),
        Category.updateOne({ _id: nextCategory }, { $inc: { serviceCount: 1 } }),
      ]);
    }

    const nextBusinesses: string[] = (
      (update.businessIds as Types.ObjectId[] | undefined) ?? toObjectIds(previousBusinesses)
    ).map((value: Types.ObjectId) => value.toString());
    const removed: string[] = previousBusinesses.filter((value: string) => !nextBusinesses.includes(value));
    const added: string[] = nextBusinesses.filter((value: string) => !previousBusinesses.includes(value));

    if (removed.length || added.length) {
      if (removed.length) {
        await Business.updateMany({ _id: { $in: removed } }, { $pull: { serviceIds: objectId } });
      }
      if (added.length) {
        await Business.updateMany({ _id: { $in: added } }, { $addToSet: { serviceIds: objectId } });
      }
    }

    const newSlug = (update.slug as string | undefined) ?? previousSlug;

    await recordAudit(auth.session, 'service.update', 'Service', id, {
      slug: newSlug,
      renamed: newSlug !== previousSlug ? previousSlug : undefined,
    });

    revalidateContent({
      admin: ['/admin/services', '/admin/dashboard'],
      listing: ['/services', '/'],
      detail: [`/services/${newSlug}`, ...(newSlug !== previousSlug ? [`/services/${previousSlug}`] : [])],
    });

    return success({ slug: newSlug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A service with this slug already exists' });
    }
    console.error('[services] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the service' });
  }
}

export async function publishService(id: string, published: boolean): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

  try {
    await dbConnect();
    const service = await Service.findById(objectId);
    if (!service) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

    if (service.archivedAt) {
      return failure({ code: 'CONFLICT', message: 'Restore this service before publishing it' });
    }

    service.published = published;
    await service.save();

    await recordAudit(
      auth.session,
      published ? 'service.publish' : 'service.unpublish',
      'Service',
      id,
      { slug: service.slug },
    );

    revalidateContent({
      admin: ['/admin/services', '/admin/dashboard'],
      listing: ['/services', '/'],
      detail: [`/services/${service.slug}`],
    });

    return success({ slug: service.slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'Another published service already uses this slug' });
    }
    console.error('[services] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

  try {
    await dbConnect();
    const service = await Service.findById(objectId);
    if (!service) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

    service.archivedAt = new Date();
    service.published = false;
    service.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await service.save();

    await Promise.all([
      Category.updateOne({ _id: service.categoryId }, { $inc: { serviceCount: -1 } }),
      Business.updateMany({ serviceIds: service._id }, { $pull: { serviceIds: service._id } }),
    ]);

    await recordAudit(auth.session, 'service.archive', 'Service', id, { slug: service.slug });

    revalidateContent({
      admin: ['/admin/services', '/admin/dashboard'],
      listing: ['/services', '/'],
      detail: [`/services/${service.slug}`],
    });

    return success(undefined);
  } catch (error) {
    console.error('[services] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the service' });
  }
}

export async function restoreService(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

  try {
    await dbConnect();
    const result = await Service.updateOne(
      { _id: objectId },
      { $unset: { archivedAt: '', archivedBy: '' } },
    );
    if (result.matchedCount === 0) return failure({ code: 'NOT_FOUND', message: 'Service not found' });

    await recordAudit(auth.session, 'service.restore', 'Service', id);
    revalidateContent({ admin: ['/admin/services'], listing: ['/services', '/'] });
    return success(undefined);
  } catch (error) {
    console.error('[services] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the service' });
  }
}

export async function listServices(
  raw: unknown = {},
): Promise<ActionResult<{ services: unknown[]; total: number; page: number; totalPages: number }>> {
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

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('categoryId', 'name')
        .populate('businessIds', 'name')
        .select('name slug published featured displayOrder archivedAt pricing duration categoryId businessIds updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Service.countDocuments(query),
    ]);

    return success({
      services,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('[services] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load services' });
  }
}