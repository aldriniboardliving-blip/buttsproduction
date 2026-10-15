'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { searchMedia, getUploadSignature, confirmUpload, deleteMedia } from './actions';

/**
 * Upload configuration arrives as props from the server page.
 *
 * Importing `@/config/env` here would pull the whole server-validated env
 * module (Mongo URI, Cloudinary secret, session secret) into the browser
 * bundle, so only the two non-secret values are ever handed to the client.
 */
export function MediaLibrary({
  cloudName,
  uploadFolder,
  allowedTypes,
}: {
  cloudName: string;
  uploadFolder: string;
  allowedTypes: string[];
}) {
  const router = useRouter();
  const [assets, setAssets] = useState<Array<{
    _id: string;
    publicId: string;
    secureUrl: string;
    alt: string;
    folder: string;
    usageCount: number;
  }>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadAssets = useCallback(async (p: number) => {
    setLoading(true);
    const result = await searchMedia({ page: p, limit: 20 });
    if (result.success) {
      setAssets(result.data.assets as typeof assets);
      setTotal(result.data.total);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial load. This is the intended use of an effect: synchronising with
    // an external system (the media collection) on mount. The setState calls
    // all happen after the awaited server action resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    loadAssets(1);
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const folder = uploadFolder;
      const sigResult = await getUploadSignature(folder);

      if (!sigResult.success) {
        setError(sigResult.error.message);
        setUploading(false);
        return;
      }

      const { signature, timestamp, apiKey, uploadPreset } = sigResult.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      const confirmResult = await confirmUpload(
        data.public_id,
        file.name.replace(/\.[^.]+$/, ''),
        folder,
      );

      if (confirmResult.success) {
        loadAssets(1);
        setPage(1);
      } else {
        setError(confirmResult.error.message);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    const result = await deleteMedia(id);
    if (result.success) {
      loadAssets(page);
    } else {
      setError(result.error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Media Library</h2>
          <p className="text-sm text-neutral-600 mt-1">{total} assets total</p>
        </div>
        <div>
          <input
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleUpload}
            className="hidden"
            id="media-upload"
            disabled={uploading}
          />
          <label htmlFor="media-upload">
            <Button loading={uploading} className="cursor-pointer">
              Upload Media
            </Button>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <Card><p className="text-center py-8 text-neutral-500">Loading...</p></Card>
      ) : assets.length === 0 ? (
        <Card><p className="text-center py-8 text-neutral-500">No media assets yet.</p></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <Card key={asset._id} padding="none" className="overflow-hidden group">
              <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                <img
                  src={asset.secureUrl}
                  alt={asset.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="danger" onClick={() => handleDelete(asset._id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-neutral-900 truncate">{asset.alt}</p>
                <p className="text-xs text-neutral-500">{asset.usageCount} uses</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => { const p = page - 1; setPage(p); loadAssets(p); }}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-neutral-600">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => { const p = page + 1; setPage(p); loadAssets(p); }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}