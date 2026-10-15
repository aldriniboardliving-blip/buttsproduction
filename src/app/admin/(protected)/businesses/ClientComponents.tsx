'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createBusiness, updateBusiness, deleteBusiness, publishBusiness } from './actions';

interface BusinessFormProps {
  business?: {
    _id: string;
    name: string;
    shortDescription?: string;
    description?: string;
    phone?: string;
    email?: string;
    published: boolean;
    featured: boolean;
    displayOrder: number;
  };
}

export function BusinessForm({ business }: BusinessFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const data = Object.fromEntries(formData);
      
      const getString = (key: string): string => {
        const val = data[key];
        if (typeof val === 'string') return val;
        if (val instanceof File) return '';
        return '';
      };

      const getBoolean = (key: string): boolean => {
        const val = data[key];
        if (typeof val === 'string') return val === 'on' || val === 'true';
        return Boolean(val);
      };

      const getNumber = (key: string): number => {
        const val = data[key];
        if (typeof val === 'string') return parseInt(val) || 0;
        return 0;
      };

      // Transform form data to match the expected schema
      const transformedData = {
        name: getString('name'),
        shortDescription: getString('shortDescription'),
        description: getString('description'),
        logoId: getString('logoId') || undefined,
        coverImageId: getString('coverImageId') || undefined,
        galleryIds: data.galleryIds ? (Array.isArray(data.galleryIds) ? data.galleryIds.filter((v): v is string => typeof v === 'string') : [getString('galleryIds')]) : undefined,
        phone: getString('phone'),
        email: getString('email'),
        street: getString('street'),
        city: getString('city'),
        state: getString('state'),
        zip: getString('zip'),
        facebook: getString('facebook'),
        instagram: getString('instagram'),
        twitter: getString('twitter'),
        linkedin: getString('linkedin'),
        youtube: getString('youtube'),
        tiktok: getString('tiktok'),
        featured: getBoolean('featured'),
        displayOrder: getNumber('displayOrder'),
        published: getBoolean('published'),
        bookingEnabled: getBoolean('bookingEnabled'),
        defaultBookingForm: getString('defaultBookingForm'),
        metaTitle: getString('metaTitle'),
        metaDescription: getString('metaDescription'),
        ogTitle: getString('ogTitle'),
        ogDescription: getString('ogDescription'),
        ogImageId: getString('ogImageId') || undefined,
        canonicalUrl: getString('canonicalUrl'),
        noindex: getBoolean('noindex'),
        nofollow: getBoolean('nofollow'),
      };

      const result = business
        ? await updateBusiness(business._id, transformedData)
        : await createBusiness(transformedData);

      if (result.success) {
        router.push('/admin/businesses');
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Name"
            name="name"
            defaultValue={business?.name}
            required
            placeholder="Business name"
          />
          <Input
            label="Short Description"
            name="shortDescription"
            defaultValue={business?.shortDescription}
            placeholder="Brief description (max 300 chars)"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={business?.description}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-base focus:outline-2 focus:outline-offset-1 focus:outline-primary-500"
              placeholder="Full business description..."
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone" name="phone" defaultValue={business?.phone} placeholder="1-866-454-7033" />
          <Input label="Email" name="email" type="email" defaultValue={business?.email} placeholder="info@example.com" />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Publishing</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" name="published" defaultChecked={business?.published} className="h-4 w-4 rounded border-neutral-300 text-primary-600" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={business?.featured} className="h-4 w-4 rounded border-neutral-300 text-primary-600" />
            Featured on homepage
          </label>
          <Input
            label="Display Order"
            name="displayOrder"
            type="number"
            defaultValue={business?.displayOrder ?? 0}
            hint="Lower numbers appear first"
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {business ? 'Update Business' : 'Create Business'}
        </Button>
      </div>
    </form>
  );
}

export function BusinessList({ businesses }: { businesses: Array<{
  _id: string;
  name: string;
  slug: string;
  published: boolean;
  featured: boolean;
  displayOrder: number;
}> }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Are you sure? This will archive the business.')) return;

    startTransition(async () => {
      const result = await deleteBusiness(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  function handlePublish(id: string, published: boolean) {
    startTransition(async () => {
      await publishBusiness(id, published);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {businesses.length === 0 ? (
        <Card>
          <p className="text-center text-neutral-500 py-8">No businesses yet. Create your first one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {businesses.map((biz) => (
            <Card key={biz._id} padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-neutral-900">{biz.name}</p>
                  <p className="text-sm text-neutral-500">/{biz.slug}</p>
                </div>
                <div className="flex gap-2">
                  {biz.published && <Badge variant="success">Published</Badge>}
                  {biz.featured && <Badge variant="primary">Featured</Badge>}
                  {!biz.published && <Badge>Draft</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePublish(biz._id, !biz.published)}
                >
                  {biz.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/businesses/${biz._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(biz._id)}
                  loading={isPending}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
