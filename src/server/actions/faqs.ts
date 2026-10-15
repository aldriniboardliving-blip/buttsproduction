'use server';

import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { FAQ } from '@/server/models/FAQ';
import { authorize, escapeRegExp, toObjectId, toObjectIds } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { faqInputSchema, listQuerySchema, toFieldErrors } from './schemas';

const PERMISSIONS = {
  read: 'faq:read',
  create: 'faq:create',
  update: 'faq:update',
  remove: 'faq:delete',
  publish: 'faq:publish',
} as const;

const PATHS = { admin: '/admin/faqs', listing: ['/faq', '/'] } as const;

export async function createFaq(raw: unknown): Promise<ActionResult<{ id: string }>> {
  const auth = await authorize(PERMISSIONS.create);
  if ('failure' in auth) return auth.failure;

  const parsed = faqInputSchema.safeParse(raw);
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
    const faq = await FAQ.create({
      question: input.question,
      answer: input.answer,
      category: input.category || undefined,
      businessIds: toObjectIds(input.businessIds),
      serviceIds: toObjectIds(input.serviceIds),
      displayOrder: input.displayOrder,
      published: input.published,
    });

    await recordAudit(auth.session, 'faq.create', 'FAQ', faq._id.toString());
    revalidateContent({ admin: [PATHS.admin, '/admin/dashboard'], listing: [...PATHS.listing] });

    return success({ id: faq._id.toString() });
  } catch (error) {
    console.error('[faqs] create failed', error);
    return failure({ code: 'CREATE_ERROR', message: 'Could not create the FAQ' });
  }
}

export async function updateFaq(id: string, raw: unknown): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.update);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

  const parsed = faqInputSchema.partial().safeParse(raw);
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
    if (input.question !== undefined) update.question = input.question;
    if (input.answer !== undefined) update.answer = input.answer;
    if (input.category !== undefined) update.category = input.category || undefined;
    if (input.businessIds !== undefined) update.businessIds = toObjectIds(input.businessIds);
    if (input.serviceIds !== undefined) update.serviceIds = toObjectIds(input.serviceIds);
    if (input.displayOrder !== undefined) update.displayOrder = input.displayOrder;
    if (input.published !== undefined) update.published = input.published;

    const result = await FAQ.updateOne({ _id: objectId }, { $set: update });
    if (result.matchedCount === 0) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

    await recordAudit(auth.session, 'faq.update', 'FAQ', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[faqs] update failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not update the FAQ' });
  }
}

export async function publishFaq(id: string, published: boolean): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.publish);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

  try {
    await dbConnect();
    const faq = await FAQ.findById(objectId);
    if (!faq) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });
    if (faq.archivedAt) return failure({ code: 'CONFLICT', message: 'Restore this FAQ before publishing it' });

    faq.published = published;
    await faq.save();

    await recordAudit(
      auth.session,
      published ? 'faq.publish' : 'faq.unpublish',
      'FAQ',
      id,
    );
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[faqs] publish failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not change the publication status' });
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

  try {
    await dbConnect();
    const faq = await FAQ.findById(objectId);
    if (!faq) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

    faq.archivedAt = new Date();
    faq.published = false;
    faq.archivedBy = toObjectId(auth.session.userId) ?? undefined;
    await faq.save();

    await recordAudit(auth.session, 'faq.archive', 'FAQ', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });

    return success(undefined);
  } catch (error) {
    console.error('[faqs] delete failed', error);
    return failure({ code: 'DELETE_ERROR', message: 'Could not archive the FAQ' });
  }
}

export async function listFaqs(
  raw: unknown = {},
): Promise<ActionResult<{ faqs: unknown[]; total: number; page: number; totalPages: number }>> {
  const auth = await authorize(PERMISSIONS.read);
  if ('failure' in auth) return auth.failure;

  const parsed = listQuerySchema.safeParse(raw);
  if (!parsed.success) return failure({ code: 'VALIDATION_ERROR', message: 'Invalid filters' });

  const { search, published, page, limit } = parsed.data;

  try {
    await dbConnect();
    const query: Record<string, unknown> = {};
    if (search) query.question = { $regex: escapeRegExp(search), $options: 'i' };
    if (published !== 'all') query.published = published === 'true';

    const [faqs, total] = await Promise.all([
      FAQ.find(query)
        .select('question answer category displayOrder published archivedAt updatedAt')
        .sort({ displayOrder: 1, question: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      FAQ.countDocuments(query),
    ]);

    return success({ faqs, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    console.error('[faqs] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load FAQs' });
  }
}
export async function restoreFaq(id: string): Promise<ActionResult> {
  const auth = await authorize(PERMISSIONS.remove);
  if ('failure' in auth) return auth.failure;

  const objectId = toObjectId(id);
  if (!objectId) return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });

  try {
    await dbConnect();
    const result = await FAQ.updateOne({ _id: objectId }, { $unset: { archivedAt: '', archivedBy: '' } });
    if (result.matchedCount === 0) {
      return failure({ code: 'NOT_FOUND', message: 'FAQ not found' });
    }

    await recordAudit(auth.session, 'Faq.restore', 'FAQ', id);
    revalidateContent({ admin: [PATHS.admin], listing: [...PATHS.listing] });
    return success(undefined);
  } catch (error) {
    console.error('[Faq] restore failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not restore the FAQ' });
  }
}