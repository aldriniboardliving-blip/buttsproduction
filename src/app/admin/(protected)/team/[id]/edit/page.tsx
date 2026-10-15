import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/db';
import { TeamMember } from '@/server/models/TeamMember';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { TeamForm } from '@/components/admin/ContentForms';
import { submitUpdateTeamMember } from '@/server/actions/form-handlers';
import { toObjectId } from '@/server/lib/authorize';

export const instant = false;

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const objectId = toObjectId(id);
  if (!objectId) notFound();

  await dbConnect();
  const doc = await TeamMember.findById(objectId).lean();
  if (!doc) notFound();

  return (
    <Container size="full">
      <AdminPageHeader
        title={`Edit ${doc.name}`}
        description={doc.role}
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Team', href: '/admin/team' },
        ]}
      />
      <TeamForm
        action={submitUpdateTeamMember}
        member={{
          id: doc._id.toString(),
          name: doc.name,
          role: doc.role,
          bio: doc.bio ?? '',
          email: doc.email ?? '',
          phone: doc.phone ?? '',
          displayOrder: doc.displayOrder,
          published: doc.published,
        }}
      />
    </Container>
  );
}