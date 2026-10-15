'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { dbConnect } from '@/lib/db';
import { Business } from '@/server/models/Business';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { getSession } from '@/lib/auth/service';
import { generateSlug } from '@/lib/slug';

const BusinessInputSchema = z.object({
  name: z.string().min(1).max(100),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  logoId: z.string().optional(),
  coverImageId: z.string().optional(),
  galleryIds: z.array(z.string()).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
  bookingEnabled: z.boolean().default(true),
  defaultBookingForm: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImageId: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
});

export async function createBusiness(
  input: z.infer<typeof BusinessInputSchema>,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const slug = await generateUniqueSlug(Business, generateSlug(input.name));

    const business = await Business.create({
      ...input,
      slug,
      slugHistory: [],
      gallery: input.galleryIds || [],
      contact: {
        phone: input.phone,
        email: input.email,
        address: {
          street: input.street,
          city: input.city,
          state: input.state,
          zip: input.zip,
        },
      },
      social: {
        facebook: input.facebook,
        instagram: input.instagram,
        twitter: input.twitter,
        linkedin: input.linkedin,
        youtube: input.youtube,
        tiktok: input.tiktok,
      },
      settings: {
        bookingEnabled: input.bookingEnabled,
        defaultBookingForm: input.defaultBookingForm,
      },
      logo: input.logoId || undefined,
      coverImage: input.coverImageId || undefined,
      ogImage: input.ogImageId || undefined,
    });

    revalidatePath('/admin/businesses');
    revalidatePath('/businesses');
    return success({ id: business._id.toString(), slug: business.slug });
  } catch (err) {
    if (err instanceof Error && err.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A business with this name already exists' });
    }
    return failure({ code: 'CREATE_ERROR', message: 'Failed to create business' });
  }
}

export async function updateBusiness(
  id: string,
  input: Partial<z.infer<typeof BusinessInputSchema>>,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const existing = await Business.findById(id);
    if (!existing) {
      return failure({ code: 'NOT_FOUND', message: 'Business not found' });
    }

    const updateData: Record<string, unknown> = { ...input };

    if (input.name && input.name !== existing.name) {
      const newSlug = await generateUniqueSlug(Business, generateSlug(input.name), existing._id.toString());
      updateData.slug = newSlug;
      updateData.slugHistory = [...(existing.slugHistory || []), existing.slug];
    }

    if (input.galleryIds) updateData.gallery = input.galleryIds;
    if (input.logoId !== undefined) updateData.logo = input.logoId || undefined;
    if (input.coverImageId !== undefined) updateData.coverImage = input.coverImageId || undefined;
    if (input.ogImageId !== undefined) updateData.ogImage = input.ogImageId || undefined;

    updateData.contact = {
      phone: input.phone ?? existing.contact?.phone,
      email: input.email ?? existing.contact?.email,
      address: {
        street: input.street ?? existing.contact?.address?.street,
        city: input.city ?? existing.contact?.address?.city,
        state: input.state ?? existing.contact?.address?.state,
        zip: input.zip ?? existing.contact?.address?.zip,
      },
    };

    updateData.social = {
      facebook: input.facebook ?? existing.social?.facebook,
      instagram: input.instagram ?? existing.social?.instagram,
      twitter: input.twitter ?? existing.social?.twitter,
      linkedin: input.linkedin ?? existing.social?.linkedin,
      youtube: input.youtube ?? existing.social?.youtube,
      tiktok: input.tiktok ?? existing.social?.tiktok,
    };

    updateData.settings = {
      bookingEnabled: input.bookingEnabled ?? existing.settings?.bookingEnabled ?? true,
      defaultBookingForm: input.defaultBookingForm ?? existing.settings?.defaultBookingForm,
    };

    await Business.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    revalidatePath('/admin/businesses');
    revalidatePath('/businesses');
    revalidatePath(`/businesses/${existing.slug}`);
    return success(undefined);
  } catch {
    return failure({ code: 'UPDATE_ERROR', message: 'Failed to update business' });
  }
}

export async function deleteBusiness(id: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const business = await Business.findByIdAndUpdate(
      id,
      { $set: { archivedAt: new Date(), published: false } },
      { new: true },
    );

    if (!business) {
      return failure({ code: 'NOT_FOUND', message: 'Business not found' });
    }

    revalidatePath('/admin/businesses');
    revalidatePath('/businesses');
    return success(undefined);
  } catch {
    return failure({ code: 'DELETE_ERROR', message: 'Failed to delete business' });
  }
}

export async function publishBusiness(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const business = await Business.findByIdAndUpdate(
      id,
      { $set: { published } },
      { new: true },
    );

    if (!business) {
      return failure({ code: 'NOT_FOUND', message: 'Business not found' });
    }

    revalidatePath('/admin/businesses');
    revalidatePath('/businesses');
    revalidatePath(`/businesses/${business.slug}`);
    return success(undefined);
  } catch {
    return failure({ code: 'UPDATE_ERROR', message: 'Failed to update business' });
  }
}

export async function listBusinesses(params?: {
  published?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ businesses: unknown[]; total: number }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const { published, search, page = 1, limit = 20 } = params || {};
    const query: Record<string, unknown> = { archivedAt: { $exists: false } };

    if (published !== undefined) query.published = published;
    if (search) query.name = { $regex: search, $options: 'i' };

    const [businesses, total] = await Promise.all([
      Business.find(query).sort({ displayOrder: 1, name: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Business.countDocuments(query),
    ]);

    return success({ businesses, total });
  } catch {
    return failure({ code: 'LIST_ERROR', message: 'Failed to list businesses' });
  }
}

async function generateUniqueSlug(
  model: typeof Business,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug, archivedAt: { $exists: false } };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await model.exists(query);
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}
