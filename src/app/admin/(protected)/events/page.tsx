import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listEvents, publishEvent, deleteEvent, restoreEvent } from '@/server/actions/events';
import { eventPhase } from '@/server/models/Event';

export const instant = false;

function formatDate(value?: string) {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listEvents({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.events.map((raw) => {
        const doc = raw as {
          _id: string;
          name: string;
          slug: string;
          published: boolean;
          featured: boolean;
          startDate: string;
          endDate?: string;
          venue?: string;
          archivedAt?: string;
          updatedAt?: string;
        };
        const phase = eventPhase({ startDate: new Date(doc.startDate), endDate: doc.endDate ? new Date(doc.endDate) : undefined });

        return {
          id: doc._id,
          title: doc.name,
          subtitle: doc.venue ?? `/${doc.slug}`,
          published: doc.published,
          featured: doc.featured,
          archived: Boolean(doc.archivedAt),
          updatedAt: doc.updatedAt,
          extra: `${phase} · ${formatDate(doc.startDate)}`,
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="Events"
        description="Published events appear on the public events page. Dates determine whether an event is upcoming, ongoing or past."
        newHref="/admin/events/new"
        newLabel="New event"
        listPath="/admin/events"
        editBase="/admin/events"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No events yet"
        emptyDescription="Publish an event and it will appear on the public site."
        onPublish={publishEvent}
        onArchive={deleteEvent}
        onRestore={restoreEvent}
      />
    </Container>
  );
}