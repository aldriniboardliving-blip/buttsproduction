'use server';

import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import { MediaAsset } from '@/server/models/MediaAsset';
import { getSignedUploadParams, deleteCloudinaryAsset, getCloudinaryAssetDetails } from '@/lib/cloudinary';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { config } from '@/config/env';
import { getSession } from '@/lib/auth/service';

export async function getUploadSignature(folder: string): Promise<
  ActionResult<{ signature: string; timestamp: number; apiKey: string; uploadPreset: string }>
> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    const sig = await getSignedUploadParams(folder);
    return success(sig);
  } catch {
    return failure({ code: 'UPLOAD_ERROR', message: 'Failed to generate upload signature' });
  }
}

export async function confirmUpload(
  publicId: string,
  alt: string,
  folder: string,
  tags?: string[],
): Promise<ActionResult<{ asset: { id: string; publicId: string; secureUrl: string; alt: string } }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  if (!alt.trim()) {
    return failure({ code: 'VALIDATION_ERROR', message: 'Alt text is required' });
  }

  try {
    const details = await getCloudinaryAssetDetails(publicId);

    await dbConnect();
    const asset = await MediaAsset.create({
      publicId: details.public_id,
      secureUrl: details.secure_url,
      width: details.width,
      height: details.height,
      format: details.format,
      bytes: details.bytes,
      folder,
      alt,
      tags: tags || [],
      uploadedBy: session.userId,
    });

    revalidatePath('/admin/media');
    return success({ asset: { id: asset._id.toString(), publicId: asset.publicId, secureUrl: asset.secureUrl, alt: asset.alt } });
  } catch {
    return failure({ code: 'UPLOAD_ERROR', message: 'Failed to save media asset' });
  }
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const asset = await MediaAsset.findById(id);

    if (!asset) {
      return failure({ code: 'NOT_FOUND', message: 'Media asset not found' });
    }

    if (asset.usageCount > 0) {
      return failure({
        code: 'IN_USE',
        message: 'Cannot delete: asset is referenced by content',
      });
    }

    await deleteCloudinaryAsset(asset.publicId);
    await MediaAsset.findByIdAndDelete(id);

    revalidatePath('/admin/media');
    return success(undefined);
  } catch (err) {
    if (err instanceof Error && err.message.includes('Cloudinary delete failed')) {
      return failure({ code: 'DELETE_ERROR', message: 'Failed to delete from Cloudinary' });
    }
    return failure({ code: 'DELETE_ERROR', message: 'Failed to delete media asset' });
  }
}

export async function updateMedia(
  id: string,
  data: { alt?: string; caption?: string; tags?: string[] },
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const asset = await MediaAsset.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true },
    );

    if (!asset) {
      return failure({ code: 'NOT_FOUND', message: 'Media asset not found' });
    }

    revalidatePath('/admin/media');
    return success(undefined);
  } catch {
    return failure({ code: 'UPDATE_ERROR', message: 'Failed to update media asset' });
  }
}

export async function searchMedia(params: {
  folder?: string;
  tags?: string[];
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ assets: unknown[]; total: number }>> {
  const session = await getSession();
  if (!session) {
    return failure({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    await dbConnect();
    const { folder, tags, q, page = 1, limit = 20 } = params;
    const query: Record<string, unknown> = {};

    if (folder) query.folder = folder;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (q) query.alt = { $regex: q, $options: 'i' };

    const [assets, total] = await Promise.all([
      MediaAsset.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      MediaAsset.countDocuments(query),
    ]);

    return success({ assets, total });
  } catch {
    return failure({ code: 'SEARCH_ERROR', message: 'Failed to search media assets' });
  }
}