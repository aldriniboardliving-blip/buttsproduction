'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createService, updateService, deleteService, publishService } from './actions';

interface ServiceFormProps {
  businesses: Array<{ _id: string; name: string }>;
  service?: {
    _id: string;
    name: string;
    shortDescription?: string;
    description?: string;
    categoryId: string;
    businessIds: string[];
    pricing: { amount: number; currency: string; unit: string; customUnitLabel?: string };
    duration?: string;
    locationType: string;
    locationDetails?: string;
    featured: boolean;
    displayOrder: number;
    published: boolean;
    bookingConfig: { formKey: string; requiresApproval: boolean; collectsPayment: boolean; depositAmount?: number; cancellationPolicy?: string; customFields?: Record<string, unknown> };
    faqIds?: string[];
  };
}

export function ServiceForm({ businesses, service }: ServiceFormProps) {
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

      const getArray = (key: string): string[] => {
        const val = data[key];
        if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
        const str = getString(key);
        return str ? [str] : [];
      };

      // Transform form data to match the expected schema
      const transformedData = {
        name: getString('name'),
        shortDescription: getString('shortDescription'),
        description: getString('description'),
        categoryId: getString('categoryId'),
        businessIds: getArray('businessIds'),
        pricing: {
          amount: getNumber('priceAmount'),
          currency: 'USD' as const,
          unit: getString('priceUnit') as 'per_hour' | 'per_day' | 'per_session' | 'per_load' | 'custom',
          customUnitLabel: getString('customUnitLabel') || undefined,
        },
        duration: getString('duration'),
        locationType: getString('locationType') as 'onsite' | 'customer_location' | 'online' | 'granby_street',
        locationDetails: getString('locationDetails'),
        galleryIds: data.galleryIds ? (Array.isArray(data.galleryIds) ? data.galleryIds.filter((v): v is string => typeof v === 'string') : [getString('galleryIds')]) : undefined,
        featured: getBoolean('featured'),
        displayOrder: getNumber('displayOrder'),
        published: getBoolean('published'),
        bookingConfig: {
          formKey: getString('formKey') || 'custom',
          requiresApproval: getBoolean('requiresApproval'),
          collectsPayment: getBoolean('collectsPayment'),
          depositAmount: getNumber('depositAmount'),
          cancellationPolicy: getString('cancellationPolicy'),
        },
        faqIds: data.faqIds ? (Array.isArray(data.faqIds) ? data.faqIds.filter((v): v is string => typeof v === 'string') : [getString('faqIds')]) : undefined,
        metaTitle: getString('metaTitle'),
        metaDescription: getString('metaDescription'),
        ogTitle: getString('ogTitle'),
        ogDescription: getString('ogDescription'),
        ogImageId: getString('ogImageId') || undefined,
        canonicalUrl: getString('canonicalUrl'),
        noindex: getBoolean('noindex'),
        nofollow: getBoolean('nofollow'),
      };

      const result = service
        ? await updateService(service._id, transformedData)
        : await createService(transformedData);

      if (result.success) {
        router.push('/admin/services');
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
            defaultValue={service?.name}
            required
            placeholder="Service name"
          />
          <Input
            label="Short Description"
            name="shortDescription"
            defaultValue={service?.shortDescription}
            placeholder="Brief description (max 300 chars)"
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={service?.description}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-base focus:outline-2 focus:outline-offset-1 focus:outline-primary-500"
              placeholder="Full service description..."
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Pricing & Details</h3>
        <div className="space-y-4">
          <Input label="Category ID" name="categoryId" defaultValue={service?.categoryId} required placeholder="Category ID" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Price (cents)" name="priceAmount" type="number" defaultValue={service?.pricing?.amount} required placeholder="7000" />
            <Input label="Currency" name="priceCurrency" defaultValue={service?.pricing?.currency ?? 'USD'} placeholder="USD" />
          </div>
          <Input label="Unit" name="priceUnit" defaultValue={service?.pricing?.unit ?? 'per_day'} placeholder="per_day | per_hour | per_session | per_load | custom" />
          <Input label="Custom Unit Label" name="customUnitLabel" defaultValue={service?.pricing?.customUnitLabel} placeholder="Custom unit label" />
          <Input label="Duration" name="duration" defaultValue={service?.duration} placeholder="e.g., 2 hr, 1 day" />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Location Type *</label>
            <select name="locationType" required className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500">
              <option value="onsite">On-site</option>
              <option value="customer_location">Customer Location</option>
              <option value="online">Online</option>
              <option value="granby_street">Granby Street</option>
            </select>
          </div>
          <Input label="Location Details" name="locationDetails" defaultValue={service?.locationDetails} placeholder="Additional location details" />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Business Assignment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Assign to Businesses</label>
            <div className="space-y-2">
              {businesses.map((biz) => (
                <label key={biz._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="businessIds"
                    value={biz._id}
                    defaultChecked={service?.businessIds?.includes(biz._id)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary-600"
                  />
                  <span className="text-sm text-neutral-700">{biz.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Publishing</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" name="published" defaultChecked={service?.published} className="h-4 w-4 rounded border-neutral-300 text-primary-600" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={service?.featured} className="h-4 w-4 rounded border-neutral-300 text-primary-600" />
            Featured on homepage
          </label>
          <Input
            label="Display Order"
            name="displayOrder"
            type="number"
            defaultValue={service?.displayOrder ?? 0}
            hint="Lower numbers appear first"
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          {service ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}

export function ServiceList({ services }: { services: Array<{
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  businessIds: string[];
  pricing: { amount: number; currency: string; unit: string };
  published: boolean;
  featured: boolean;
  displayOrder: number;
}> }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm('Are you sure? This will archive the service.')) return;

    startTransition(async () => {
      const result = await deleteService(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  function handlePublish(id: string, published: boolean) {
    startTransition(async () => {
      await publishService(id, published);
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

      {services.length === 0 ? (
        <Card>
          <p className="text-center text-neutral-500 py-8">No services yet. Create your first one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <Card key={svc._id} padding="sm" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-neutral-900">{svc.name}</p>
                  <p className="text-sm text-neutral-500">/{svc.slug}</p>
                </div>
                <div className="flex gap-2">
                  {svc.published && <Badge variant="success">Published</Badge>}
                  {svc.featured && <Badge variant="primary">Featured</Badge>}
                  {!svc.published && <Badge>Draft</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePublish(svc._id, !svc.published)}
                >
                  {svc.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/admin/services/${svc._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(svc._id)}
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