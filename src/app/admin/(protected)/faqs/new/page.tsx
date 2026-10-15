import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { FaqForm } from '@/components/admin/ContentForms';
import { submitCreateFaq } from '@/server/actions/form-handlers';

export const instant = false;

export default function NewFaqPage() {
  return (
    <Container size="full">
      <AdminPageHeader
        title="New FAQ"
        description="Creates a draft. Published FAQs replace the built-in answers on the public FAQ page."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'FAQs', href: '/admin/faqs' },
        ]}
      />
      <FaqForm action={submitCreateFaq} />
    </Container>
  );
}