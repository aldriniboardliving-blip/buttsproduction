'use server';

import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { Category } from '@/server/models/Category';
import { authorize } from '@/server/lib/authorize';

/** All categories, for select controls in the service form. */
export async function listCategories(): Promise<
  ActionResult<{ categories: { value: string; label: string }[] }>
> {
  const auth = await authorize('category:read');
  if ('failure' in auth) return auth.failure;

  try {
    await dbConnect();
    const docs = await Category.find({}).select('name').sort({ displayOrder: 1, name: 1 }).lean();

    return success({
      categories: docs.map((doc) => ({ value: doc._id.toString(), label: doc.name })),
    });
  } catch (error) {
    console.error('[categories] list failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load categories' });
  }
}