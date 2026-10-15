import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Event } from '@/server/models/Event';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { EventForm } from '@/components/admin/ContentForms';
import { submitUpdateEvent } from '@/server/actions/form-handlers';
import { listBusinesses } from '@/server/actions/businesses';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const [doc, businessResult] = await Promise.all([
    Event.findById(objectId).lean(),
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
          { label: 'Events', href: '/admin/events' },
        ]}
      />
      <EventForm
        action={submitUpdateEvent}
        businesses={businesses}
        event={{
          id: doc._id.toString(),
          name: doc.name,
          shortDescription: doc.shortDescription ?? '',
          description: doc.description ?? '',
          startDate: doc.startDate ? new Date(doc.startDate).toISOString() : '',
          endDate: doc.endDate ? new Date(doc.endDate).toISOString() : '',
          venue: doc.venue ?? '',
          address: doc.address ?? '',
          registrationUrl: doc.registrationUrl ?? '',
          featured: doc.featured,
          published: doc.published,
          displayOrder: doc.displayOrder,
          metaTitle: doc.metaTitle ?? '',
          metaDescription: doc.metaDescription ?? '',
        }}
      />
    </Container>
  );
}