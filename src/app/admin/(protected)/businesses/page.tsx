import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listBusinesses, publishBusiness, deleteBusiness, restoreBusiness } from '@/server/actions/businesses';
import { dbConnect } from '@/lib/db';

export const instant = false;

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listBusinesses({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.businesses.map((raw) => {
        const doc = raw as {
          _id: string;
          name: string;
          slug: string;
          published: boolean;
          featured: boolean;
          archivedAt?: string;
          updatedAt?: string;
          shortDescription?: string;
        };
        return {
          id: doc._id,
          title: doc.name,
          subtitle: `/${doc.slug}`,
          published: doc.published,
          featured: doc.featured,
          archived: Boolean(doc.archivedAt),
          updatedAt: doc.updatedAt,
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="Businesses"
        description="Each business is a division of Butts Productions Inc. Publishing one makes it visible on the public site."
        newHref="/admin/businesses/new"
        newLabel="New business"
        listPath="/admin/businesses"
        editBase="/admin/businesses"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No businesses yet"
        emptyDescription="Create your first division to start publishing content."
        onPublish={publishBusiness}
        onArchive={deleteBusiness}
        onRestore={restoreBusiness}
      />

      <p className="mt-10 text-xs text-neutral-500">
        Looking for a read-only view?{' '}
        <Link href="/businesses" className="underline hover:text-neutral-900">
          Open the public businesses page
        </Link>
        .
      </p>
    </Container>
  );
}