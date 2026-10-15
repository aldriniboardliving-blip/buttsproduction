import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { ProductForm } from '@/components/admin/ContentForms';
import { submitCreateProduct } from '@/server/actions/form-handlers';
import { listCategories } from '@/server/actions/categories';

export const instant = false;

export default async function NewProductPage() {
  const categoryResult = await listCategories();

  return (
    <Container size="full">
      <AdminPageHeader
        title="New product"
        description="Creates a draft catalogue entry. There is no cart — orders are arranged by phone or email."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Products', href: '/admin/products' },
        ]}
      />
      <ProductForm
        action={submitCreateProduct}
        categories={categoryResult.success ? categoryResult.data.categories : []}
      />
    </Container>
  );
}