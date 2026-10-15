import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Product } from '@/server/models/Product';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { ProductForm } from '@/components/admin/ContentForms';
import { submitUpdateProduct } from '@/server/actions/form-handlers';
import { listCategories } from '@/server/actions/categories';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const [doc, categoryResult] = await Promise.all([
    Product.findById(objectId).lean(),
    listCategories(),
  ]);

  if (!doc) notFound();

  return (
    <Container size="full">
      <AdminPageHeader
        title={`Edit ${doc.name}`}
        description={`/${doc.slug}`}
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Products', href: '/admin/products' },
        ]}
      />
      <ProductForm
        action={submitUpdateProduct}
        categories={categoryResult.success ? categoryResult.data.categories : []}
        product={{
          id: doc._id.toString(),
          name: doc.name,
          shortDescription: doc.shortDescription ?? '',
          description: doc.description ?? '',
          price: doc.price,
          inStock: doc.inStock,
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