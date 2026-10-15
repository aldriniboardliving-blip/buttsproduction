import { config } from '@/config/env';

const CLOUDINARY_BASE = `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload`;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  folder: string;
}

export async function getSignedUploadParams(
  folder: string,
  resourceType: 'image' | 'raw' | 'video' = 'image'
): Promise<{ signature: string; timestamp: number; apiKey: string; uploadPreset: string; folder: string }> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureSource = `folder=${folder}&timestamp=${timestamp}&upload_preset=${config.cloudinary.uploadPreset}${config.cloudinary.apiSecret}`;
  const signature = await hashSignature(signatureSource);

  return {
    signature,
    timestamp,
    apiKey: config.cloudinary.apiKey,
    uploadPreset: config.cloudinary.uploadPreset,
    folder,
  };
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image'): Promise<void> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureSource = `public_id=${publicId}&timestamp=${timestamp}${config.cloudinary.apiSecret}`;
  const signature = await hashSignature(signatureSource);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', config.cloudinary.apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('resource_type', resourceType);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/destroy`,
    { method: 'POST', body: formData },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary delete failed: ${error}`);
  }
}

export async function getCloudinaryAssetDetails(publicId: string): Promise<{
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  folder: string;
  tags: string[];
  context: { alt?: string; caption?: string };
}> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureSource = `public_ids=${publicId}&timestamp=${timestamp}${config.cloudinary.apiSecret}`;
  const signature = await hashSignature(signatureSource);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/resources/image/tags?public_ids=${publicId}&timestamp=${timestamp}&signature=${signature}&api_key=${config.cloudinary.apiKey}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch asset details from Cloudinary');
  }

  const data = await response.json();
  const asset = data.resources[0];

  return {
    public_id: asset.public_id,
    secure_url: asset.secure_url,
    width: asset.width,
    height: asset.height,
    format: asset.format,
    bytes: asset.bytes,
    folder: asset.folder,
    tags: asset.tags || [],
    context: asset.context || {},
  };
}

export function getCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string; quality?: string; format?: string } = {},
): string {
  const transforms: string[] = ['f_auto', 'q_auto'];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  if (options.format) transforms.push(`f_${options.format}`);

  return `${CLOUDINARY_BASE}/${transforms.join(',')}/${publicId}`;
}

export function getBlurPlaceholder(publicId: string): string {
  return `${CLOUDINARY_BASE}/c_scale,w_20,q_auto,f_auto/${publicId}`;
}

async function hashSignature(source: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(source);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}