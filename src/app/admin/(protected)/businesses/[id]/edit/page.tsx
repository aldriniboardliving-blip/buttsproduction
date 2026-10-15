import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { BusinessForm } from '../../ClientComponents';
import { submitUpdateBusiness } from '@/server/actions/form-handlers';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const { Business } = await import('@/server/models/Business');
  const doc = await Business.findById(objectId).lean();

  if (!doc) notFound();

  const contact = doc.contact ?? {};
  const address = contact.address ?? {};
  const social = doc.social ?? {};

  return (
    <Container size="full">
      <AdminPageHeader
        title={`Edit ${doc.name}`}
        description={`/${doc.slug}`}
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Businesses', href: '/admin/businesses' },
        ]}
      />

      <BusinessForm
        action={submitUpdateBusiness}
        business={{
          id: doc._id.toString(),
          name: doc.name,
          shortDescription: doc.shortDescription ?? '',
          description: doc.description ?? '',
          phone: contact.phone ?? '',
          email: contact.email ?? '',
          street: address.street ?? '',
          city: address.city ?? '',
          state: address.state ?? '',
          zip: address.zip ?? '',
          country: address.country ?? '',
          hours: typeof contact.hours === 'string' ? contact.hours : '',
          facebook: social.facebook ?? '',
          instagram: social.instagram ?? '',
          twitter: social.twitter ?? '',
          linkedin: social.linkedin ?? '',
          youtube: social.youtube ?? '',
          tiktok: social.tiktok ?? '',
          featured: doc.featured,
          displayOrder: doc.displayOrder,
          published: doc.published,
          metaTitle: doc.metaTitle ?? '',
          metaDescription: doc.metaDescription ?? '',
        }}
      />
    </Container>
  );
}