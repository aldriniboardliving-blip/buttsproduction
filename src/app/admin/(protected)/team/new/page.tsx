import { Container } from '@/components/ui/Container';
import { AdminPageHeader } from '@/components/admin/AdminPrimitives';
import { TeamForm } from '@/components/admin/ContentForms';
import { submitCreateTeamMember } from '@/server/actions/form-handlers';

export const instant = false;

export default function NewTeamMemberPage() {
  return (
    <Container size="full">
      <AdminPageHeader
        title="New team member"
        description="Published team members appear on the public About page."
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Team', href: '/admin/team' },
        ]}
      />
      <TeamForm action={submitCreateTeamMember} />
    </Container>
  );
}