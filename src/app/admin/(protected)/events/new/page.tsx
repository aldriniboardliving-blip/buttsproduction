import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { EventForm } from '@/components/admin/ContentForms';
import { submitCreateEvent } from '@/server/actions/form-handlers';
import { listBusinesses } from '@/server/actions/businesses';

export const instant = false;

export default async function NewEventPage() {
  const businessResult = await listBusinesses({ limit: 100 });
  const businesses = businessResult.success
    ? (businessResult.data.businesses as { _id: string; name: string }[]).map((biz) => ({
        value: biz._id,
        label: biz.name,
      }))
    : [];

  return (
    <Container size="full">
      <AdminPageHeader
        title="New event"
        description="Creates a draft. Published events appear on the public events page."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Events', href: '/admin/events' },
        ]}
      />
      <EventForm action={submitCreateEvent} businesses={businesses} />
    </Container>
  );
}