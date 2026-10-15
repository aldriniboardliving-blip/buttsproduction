import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listFaqs, publishFaq, deleteFaq, restoreFaq } from '@/server/actions/faqs';

export const instant = false;

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listFaqs({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.faqs.map((raw) => {
        const doc = raw as {
          _id: string;
          question: string;
          category?: string;
          published: boolean;
          archivedAt?: string;
          updatedAt?: string;
        };
        return {
          id: doc._id,
          title: doc.question,
          subtitle: doc.category,
          published: doc.published,
          archived: Boolean(doc.archivedAt),
          updatedAt: doc.updatedAt,
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="FAQs"
        description="Published FAQs appear on the public FAQ page."
        newHref="/admin/faqs/new"
        newLabel="New FAQ"
        listPath="/admin/faqs"
        editBase="/admin/faqs"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No FAQs yet"
        emptyDescription="Add the questions customers ask you most."
        onPublish={publishFaq}
        onArchive={deleteFaq}
        onRestore={restoreFaq}
      />
    </Container>
  );
}