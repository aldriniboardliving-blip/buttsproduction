import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listServices, publishService, deleteService, restoreService } from '@/server/actions/services';

export const instant = false;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listServices({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.services.map((raw) => {
        const doc = raw as {
          _id: string;
          name: string;
          slug: string;
          published: boolean;
          featured: boolean;
          archivedAt?: string;
          updatedAt?: string;
          duration?: string;
          pricing?: { amount?: number };
          categoryId?: { name?: string } | string | null;
        };
        const category =
          doc.categoryId && typeof doc.categoryId === 'object' ? doc.categoryId.name : undefined;

        return {
          id: doc._id,
          title: doc.name,
          subtitle: [category, `/${doc.slug}`].filter(Boolean).join(' · '),
          published: doc.published,
          featured: doc.featured,
          archived: Boolean(doc.archivedAt),
          updatedAt: doc.updatedAt,
          extra:
            typeof doc.pricing?.amount === 'number'
              ? `$${doc.pricing.amount}${doc.duration ? ` · ${doc.duration}` : ''}`
              : undefined,
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="Services"
        description="Services appear on the public services listing and their own detail page once published."
        newHref="/admin/services/new"
        newLabel="New service"
        listPath="/admin/services"
        editBase="/admin/services"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No services yet"
        emptyDescription="Create a service to describe something the company offers."
        onPublish={publishService}
        onArchive={deleteService}
        onRestore={restoreService}
      />
    </Container>
  );
}