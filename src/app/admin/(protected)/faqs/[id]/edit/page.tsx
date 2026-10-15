import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { FAQ } from '@/server/models/FAQ';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { FaqForm } from '@/components/admin/ContentForms';
import { submitUpdateFaq } from '@/server/actions/form-handlers';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const doc = await FAQ.findById(objectId).lean();
  if (!doc) notFound();

  return (
    <Container size="full">
      <AdminPageHeader
        title="Edit FAQ"
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'FAQs', href: '/admin/faqs' },
        ]}
      />
      <FaqForm
        action={submitUpdateFaq}
        faq={{
          id: doc._id.toString(),
          question: doc.question,
          answer: doc.answer,
          category: doc.category ?? '',
          displayOrder: doc.displayOrder,
          published: doc.published,
        }}
      />
    </Container>
  );
}