'use server';

import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { Service } from '@/server/models/Service';
import { Category } from '@/server/models/Category';
import { Business } from '@/server/models/Business';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { getSession } from '@/lib/auth/service';
import { generateSlug } from '@/lib/slug';
import { generateUniqueSlug } from '@/lib/generate-unique-slug';

const ServicePricingSchema = z.object({
  amount: z.number().int().min(0),
  currency: z.enum(['USD']).default('USD'),
  unit: z.enum(['per_hour', 'per_day', 'per_session', 'per_load', 'custom']),
  customUnitLabel: z.string().optional(),
});

const ServiceBookingConfigSchema = z.object({
  formKey: z.string(),
  requiresApproval: z.boolean().default(true),
  collectsPayment: z.boolean().default(false),
  depositAmount: z.number().int().min(0).optional(),
  cancellationPolicy: z.string().optional(),
  customFields: z.record(z.string(), z.unknown()).optional(),
});

const ServiceInputSchema = z.object({
  name: z.string().min(1).max(100),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  businessIds: z.array(z.string()).min(1),
  pricing: ServicePricingSchema,
  duration: z.string().optional(),
  locationType: z.enum(['onsite', 'customer_location', 'online', 'granby_street']),
  locationDetails: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  bookingConfig: ServiceBookingConfigSchema,
  faqIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
});

export async function createService(
  input: z.infer<typeof ServiceInputSchema>,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const slug = await generateUniqueSlug(Service, generateSlug(input.name), '');

    const service = await Service.create({
      ...input,
      slug,
      slugHistory: [],
      gallery: input.galleryIds || [],
    });

    await Category.findByIdAndUpdate(input.categoryId, { $inc: { serviceCount: 1 } });

    await Business.updateMany(
      { _id: { $in: input.businessIds } },
      { $addToSet: { serviceIds: service._id } },
    );

    return success({ id: service._id.toString(), slug: service.slug });
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A service with this name already exists' });
    }
    return failure({ code: 'CREATE_ERROR', message: 'Failed to create service' });
  }
}

export async function updateService(
  id: string,
  input: Partial<z.infer<typeof ServiceInputSchema>>,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const existing = await Service.findById(id);
    if (!existing) {
      return failure({ code: 'NOT_FOUND', message: 'Service not found' });
    }

    const updateData: Record<string, unknown> = { ...input };

    if (input.name && input.name !== existing.name) {
      const newSlug = await generateUniqueSlug(Service, generateSlug(input.name), existing._id.toString());
      updateData.slug = newSlug;
      updateData.slugHistory = [...(existing.slugHistory || []), existing.slug];
    }

    if (input.galleryIds) updateData.gallery = input.galleryIds;

    if (input.businessIds) {
      await Business.updateMany(
        { _id: { $in: existing.businessIds, $nin: input.businessIds } },
        { $pull: { serviceIds: existing._id } },
      );
      await Business.updateMany(
        { _id: { $in: input.businessIds } },
        { $addToSet: { serviceIds: existing._id } },
      );
      updateData.businessIds = input.businessIds;
    }

    if (input.categoryId && input.categoryId !== existing.categoryId.toString()) {
      await Category.findByIdAndUpdate(existing.categoryId, { $inc: { serviceCount: -1 } });
      await Category.findByIdAndUpdate(input.categoryId, { $inc: { serviceCount: 1 } });
    }

    await Service.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    return success(undefined);
  } catch {
    return failure({ code: 'UPDATE_ERROR', message: 'Failed to update service' });
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { archivedAt: new Date(), published: false } },
      { new: true },
    );

    if (!service) {
      return failure({ code: 'NOT_FOUND', message: 'Service not found' });
    }

    await Category.findByIdAndUpdate(service.categoryId, { $inc: { serviceCount: -1 } });

    await Business.updateMany(
      { _id: { $in: service.businessIds } },
      { $pull: { serviceIds: service._id } },
    );

    return success(undefined);
  } catch {
    return failure({ code: 'DELETE_ERROR', message: 'Failed to delete service' });
  }
}

export async function publishService(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { published } },
      { new: true },
    );

    if (!service) {
      return failure({ code: 'NOT_FOUND', message: 'Service not found' });
    }

    return success(undefined);
  } catch {
    return failure({ code: 'UPDATE_ERROR', message: 'Failed to update service' });
  }
}

export async function listServices(params?: {
  published?: boolean;
  categoryId?: string;
  businessId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ services: unknown[]; total: number }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const { published, categoryId, businessId, search, page = 1, limit = 20 } = params || {};
    const query: Record<string, unknown> = { archivedAt: { $exists: false } };

    if (published !== undefined) query.published = published;
    if (categoryId) query.categoryId = categoryId;
    if (businessId) query.businessIds = businessId;
    if (search) query.name = { $regex: search, $options: 'i' };

    const [services, total] = await Promise.all([
      Service.find(query).sort({ displayOrder: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Service.countDocuments(query),
    ]);

    return success({ services, total });
  } catch {
    return failure({ code: 'LIST_ERROR', message: 'Failed to list services' });
  }
}