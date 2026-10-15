'use server';

import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { Product } from '@/server/models/Product';
import { Category } from '@/server/models/Category';
import { generateSlug } from '@/lib/slug';
import { generateUniqueSlug } from '@/lib/generate-unique-slug';
import { authorize, escapeRegExp, toObjectId, toObjectIds } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { listQuerySchema, productInputSchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'product:read',
  create: 'product:create',
  update: 'product:update',
  remove: 'product:delete',
  publish: 'product:publish',
} as const;

const PATHS = { admin: '/admin/products', listing: ['/products', '/'], detail: '/products' } as const;

export async function createProduct(raw: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = productInputSchema.safeParse(raw);
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
    if (input.categoryId) {
      const categoryId = toObjectId(input.categoryId);
      if (!categoryId || !(await Category.exists({ _id: categoryId }))) {
        return failure({
          code: 'VALIDATION_ERROR',
          message: 'Choose a valid category',
          fields: { categoryId: ['Unknown category'] },
        });
      }
    }

    const slug = await generateUniqueSlug(Product, generateSlug(input.name));

    const product = await Product.create({
      name: input.name,
      slug,
      shortDescription: input.shortDescription || undefined,
      description: input.description || undefined,
      price: input.price,
      currency: 'USD',
      inStock: input.inStock,
      featuredImage: toObjectId(input.featuredImageId) ?? undefined,
      gallery: toObjectIds(input.galleryIds),
      categoryId: toObjectId(input.categoryId) ?? undefined,
      businessIds: toObjectIds(input.businessIds),
      featured: input.featured,
      published: input.published,
      displayOrder: input.displayOrder,
      metaTitle: input.metaTitle || undefined,
      metaDescription: input.metaDescription || undefined,
      ogTitle: input.ogTitle || undefined,
      ogDescription: input.ogDescription || undefined,
      ogImage: toObjectId(input.ogImageId) ?? undefined,
      canonicalUrl: input.canonicalUrl || undefined,
      noindex: input.noindex,
      nofollow: input.nofollow,
    });

    await recordAudit(auth.session, 'product.create', 'Product', product._id.toString(), {
      slug,
      name: product.name,
    });

    revalidateContent({
      admin: [PATHS.admin, '/admin/dashboard'],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${slug}`],
    });

    return success({ id: product._id.toString(), slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A product with this slug already exists' });
    }
    console.error('[products] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the product' });
  }
}

export async function updateProduct(id: string, raw: unknown): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Product not found' });

  const parsed = productInputSchema.partial().safeParse(raw);
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
    const existing = await Product.findById(objectId);
    if (!existing) return failure({ code: 'NOT_FOUND', message: 'Product not found' });

    const update: Record<string, unknown> = {};

    if (typeof input.name === 'string' && input.name && input.name !== existing.name) {
      const slug = await generateUniqueSlug(Product, generateSlug(input.name), existing._id.toString());
      update.slug = slug;
      update.slugHistory = [...(existing.slugHistory ?? []), existing.slug];
    }

    if (input.shortDescription !== undefined) update.shortDescription = input.shortDescription || undefined;
    if (input.description !== undefined) update.description = input.description || undefined;
    if (input.price !== undefined) update.price = input.price;
    if (input.inStock !== undefined) update.inStock = input.inStock;
    if (input.featuredImageId !== undefined) update.featuredImage = toObjectId(input.featuredImageId) ?? undefined;
    if (input.galleryIds !== undefined) update.gallery = toObjectIds(input.galleryIds);
    if (input.categoryId !== undefined) update.categoryId = toObjectId(input.categoryId) ?? undefined;
    if (input.businessIds !== undefined) update.businessIds = toObjectIds(input.businessIds);
    if (input.featured !== undefined) update.featured = input.featured;
    if (input.published !== undefined) update.published = input.published;
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.metaTitle !== undefined) update.metaTitle = input.metaTitle || undefined;
    if (input.metaDescription !== undefined) update.metaDescription = input.metaDescription || undefined;
    if (input.ogTitle !== undefined) update.ogTitle = input.ogTitle || undefined;
    if (input.ogDescription !== undefined) update.ogDescription = input.ogDescription || undefined;
    if (input.ogImageId !== undefined) update.ogImage = toObjectId(input.ogImageId) ?? undefined;
    if (input.canonicalUrl !== undefined) update.canonicalUrl = input.canonicalUrl || undefined;
    if (input.noindex !== undefined) update.noindex = input.noindex;
    if (input.nofollow !== undefined) update.nofollow = input.nofollow;

    const previousSlug = existing.slug;
    await Product.updateOne({ _id: objectId }, { $set: update });
    const newSlug = (update.slug as string | undefined) ?? previousSlug;

    await recordAudit(auth.session, 'product.update', 'Product', id, { slug: newSlug });
    revalidateContent({
      admin: [PATHS.admin],
      listing: [...PATHS.listing],
      detail: [
        `${PATHS.detail}/${newSlug}`,
        ...(newSlug !== previousSlug ? [`${PATHS.detail}/${previousSlug}`] : []),
      ],
    });

    return success({ slug: newSlug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'A product with this slug already exists' });
    }
    console.error('[products] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the product' });
  }
}

export async function publishProduct(id: string, published: boolean): Promise<ActionResult<{ slug: string }>> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Product not found' });

  try {
    await dbConnect();
    const product = await Product.findById(objectId);
    if (!product) return failure({ code: 'NOT_FOUND', message: 'Product not found' });
    if (product.archivedAt) {
      return failure({ code: 'CONFLICT', message: 'Restore this product before publishing it' });
    }

    product.published = published;
    await product.save();

    await recordAudit(
      auth.session,
      published ? 'product.publish' : 'product.unpublish',
      'Product',
      id,
      { slug: product.slug },
    );

    revalidateContent({
      admin: [PATHS.admin],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${product.slug}`],
    });

    return success({ slug: product.slug });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return failure({ code: 'DUPLICATE', message: 'Another published product already uses this slug' });
    }
    console.error('[products] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'Product not found' });

  try {
    await dbConnect();
    const product = await Product.findById(objectId);
    if (!product) return failure({ code: 'NOT_FOUND', message: 'Product not found' });

    product.archivedAt = new Date();
    product.published = false;
    product.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await product.save();

    await recordAudit(auth.session, 'product.archive', 'Product', id, { slug: product.slug });
    revalidateContent({
      admin: [PATHS.admin],
      listing: [...PATHS.listing],
      detail: [`${PATHS.detail}/${product.slug}`],
    });

    return success(undefined);
  } catch (error) {
    console.error('[products] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the product' });
  }
}

export async function listProducts(
  raw: unknown = {},
): Promise<ActionResult<{ products: unknown[]; total: number; page: number; totalPages: number }>> {
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

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('categoryId', 'name')
        .select('name slug published featured price inStock archivedAt updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return success({ products, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    console.error('[products] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load products' });
  }
}
export async function restoreProduct(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'product not found' });

  try {
    await dbConnect();
    const result = await Product.updateOne({ _id: objectId }, { $unset: { archivedAt: '', archivedBy: '' } });
    if (result.matchedCount === 0) {
      return failure({ code: 'NOT_FOUND', message: 'product not found' });
    }

    await recordAudit(auth.session, 'Product.restore', 'product', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });
    return success(undefined);
  } catch (error) {
    console.error('[Product] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the product' });
  }
}