import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Service } from '@/server/models/Service';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { ServiceForm } from '../../ClientComponents';
import { submitUpdateService } from '@/server/actions/form-handlers';
import { listCategories } from '@/server/actions/categories';
import { listBusinesses } from '@/server/actions/businesses';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const [doc, categoryResult, businessResult] = await Promise.all([
    Service.findById(objectId).lean(),
    listCategories(),
    listBusinesses({ limit: 100 }),
  ]);

  if (!doc) notFound();

  const businesses = businessResult.success
    ? (businessResult.data.businesses as { _id: string; name: string }[]).map((biz) => ({
        value: biz._id,
        label: biz.name,
      }))
    : [];

  return (
    <Container size="full">
      <AdminPageHeader
        title={`Edit ${doc.name}`}
        description={`/${doc.slug}`}
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Services', href: '/admin/services' },
        ]}
      />

      <ServiceForm
        action={submitUpdateService}
        categories={categoryResult.success ? categoryResult.data.categories : []}
        businesses={businesses}
        service={{
          id: doc._id.toString(),
          name: doc.name,
          shortDescription: doc.shortDescription ?? '',
          description: doc.description ?? '',
          categoryId: doc.categoryId?.toString() ?? '',
          businessIds: ((doc.businessIds ?? []) as { toString(): string }[]).map((value) => value.toString()),
          amount: doc.pricing?.amount,
          unit: doc.pricing?.unit,
          customUnitLabel: doc.pricing?.customUnitLabel ?? '',
          duration: doc.duration ?? '',
          locationType: doc.locationType,
          locationDetails: doc.locationDetails ?? '',
          featured: doc.featured,
          displayOrder: doc.displayOrder,
          published: doc.published,
          metaTitle: doc.metaTitle ?? '',
          metaDescription: doc.metaDescription ?? '',
        }}
      />
    </Container>
  );
}