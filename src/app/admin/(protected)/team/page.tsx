import { Container } from '@/components/ui/Container';
import { ContentListPage } from '@/components/admin/ContentListPage';
import { listTeamMembers, publishTeamMember, deleteTeamMember, restoreTeamMember } from '@/server/actions/team';

export const instant = false;

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const published = typeof params.published === 'string' ? params.published : 'all';
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await listTeamMembers({ search, published, page, limit: 20 });

  const rows = result.success
    ? result.data.members.map((raw) => {
        const doc = raw as {
          _id: string;
          name: string;
          role: string;
          published: boolean;
          archivedAt?: string;
          updatedAt?: string;
        };
        return {
          id: doc._id,
          title: doc.name,
          subtitle: doc.role,
          published: doc.published,
          archived: Boolean(doc.archivedAt),
          updatedAt: doc.updatedAt,
        };
      })
    : [];

  return (
    <Container size="full">
      <ContentListPage
        title="Team"
        description="Published team members appear on the public About page."
        newHref="/admin/team/new"
        newLabel="New team member"
        listPath="/admin/team"
        editBase="/admin/team"
        rows={rows}
        search={search}
        published={published}
        page={result.success ? result.data.page : page}
        totalPages={result.success ? result.data.totalPages : 1}
        total={result.success ? result.data.total : 0}
        error={result.success ? undefined : result.error.message}
        emptyTitle="No team members yet"
        emptyDescription="Add the people behind the divisions."
        onPublish={publishTeamMember}
        onArchive={deleteTeamMember}
        onRestore={restoreTeamMember}
      />
    </Container>
  );
}