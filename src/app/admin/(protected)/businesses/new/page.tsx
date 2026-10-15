import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { BusinessForm } from '../ClientComponents';
import { submitCreateBusiness } from '@/server/actions/form-handlers';

export const instant = false;

export default function NewBusinessPage() {
  return (
    <Container size="full">
      <AdminPageHeader
        title="New business"
        description="Creates a draft. Publish it when you are ready for it to appear on the public site."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Businesses', href: '/admin/businesses' },
        ]}
      />
      <BusinessForm action={submitCreateBusiness} />
    </Container>
  );
}