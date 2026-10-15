import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { ServiceForm } from '../ClientComponents';
import { submitCreateService } from '@/server/actions/form-handlers';
import { listCategories } from '@/server/actions/categories';
import { listBusinesses } from '@/server/actions/businesses';

export const instant = false;

export default async function NewServicePage() {
  // Draft businesses are included: a service can be prepared before the
  // business it belongs to is published.
  const [categoryResult, businessResult] = await Promise.all([
    listCategories(),
    listBusinesses({ limit: 100 }),
  ]);

  const businesses = businessResult.success
    ? (businessResult.data.businesses as { _id: string; name: string }[]).map((biz) => ({
        value: biz._id,
        label: biz.name,
      }))
    : [];

  return (
    <Container size="full">
      <AdminPageHeader
        title="New service"
        description="Creates a draft. Publish it when you are ready for it to appear on the public site."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Services', href: '/admin/services' },
        ]}
      />

      <ServiceForm
        action={submitCreateService}
        categories={categoryResult.success ? categoryResult.data.categories : []}
        businesses={businesses}
      />
    </Container>
  );
}