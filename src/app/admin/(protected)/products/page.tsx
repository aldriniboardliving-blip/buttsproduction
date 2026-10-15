import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listProducts, publishProduct, deleteProduct, restoreProduct } from '@/server/actions/products';

export const instant = false;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listProducts({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.products.map((raw) => {
        const doc = raw as {
          _id: string;
          name: string;
          slug: string;
          published: boolean;
          featured: boolean;
          price?: number;
          inStock: boolean;
          archivedAt?: string;
          updatedAt?: string;
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
            typeof doc.price === 'number'
              ? `$${doc.price}${doc.inStock ? '' : ' · out of stock'}`
              : doc.inStock
                ? undefined
                : 'Out of stock',
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="Products"
        description="Catalogue items for the Why Not Buy It Shop and Refurbished Goods divisions."
        newHref="/admin/products/new"
        newLabel="New product"
        listPath="/admin/products"
        editBase="/admin/products"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No products yet"
        emptyDescription="Add catalogue items here. There is no cart or payment processing."
        onPublish={publishProduct}
        onArchive={deleteProduct}
        onRestore={restoreProduct}
      />
    </Container>
  );
}