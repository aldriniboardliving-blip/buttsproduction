import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader, AdminEmptyState, AdminAlert } from './AdminPrimitives';
import { ContentFilters, ContentPagination } from './ContentFilters';
import { ContentTable, type ContentRow } from './ContentTable';

type Mutation = (
  id: string,
  ...args: never[]
) => Promise<{ success: boolean; error?: { message: string } }>;

/**
 * Standard shell for an admin listing page: header, primary action, filters,
 * table, pagination. Server component — the mutation functions are server
 * actions forwarded to the client table.
 */
export function ContentListPage({
  title,
  description,
  newHref,
  newLabel,
  rows,
  columns,
  listPath,
  editBase,
  search,
  published,
  page,
  totalPages,
  total,
  error,
  emptyTitle,
  emptyDescription,
  onPublish,
  onArchive,
  onRestore,
  notice,
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
  rows: ContentRow[];
  columns?: { label: string; className?: string }[];
  listPath: string;
  editBase: string;
  search: string;
  published: string;
  page: number;
  totalPages: number;
  total: number;
  error?: string;
  emptyTitle: string;
  emptyDescription?: string;
  onPublish: Mutation;
  onArchive: Mutation;
  onRestore: Mutation;
  notice?: string;
}) {
  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: 'Admin', href: '/admin/dashboard' }]}
        action={
          newHref ? (
            <Link href={newHref}>
              <Button>{newLabel ?? `New ${title.replace(/s$/, '')}`}</Button>
            </Link>
          ) : undefined
        }
      />

      {notice && <AdminAlert tone="info">{notice}</AdminAlert>}
      {error && <AdminAlert>{error}</AdminAlert>}

      <ContentFilters action={listPath} search={search} published={published} />

      {rows.length === 0 ? (
        <AdminEmptyState
          title={search || published !== 'all' ? 'No matching records' : emptyTitle}
          description={
            search || published !== 'all'
              ? 'Try a different search term or status filter.'
              : emptyDescription
          }
          action={
            newHref && !search && published === 'all' ? (
              <Link href={newHref}>
                <Button>{newLabel ?? `New ${title.replace(/s$/, '')}`}</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ContentTable
          rows={rows}
          columns={columns}
          editBase={editBase}
          onPublish={onPublish as never}
          onArchive={onArchive as never}
          onRestore={onRestore as never}
        />
      )}

      <ContentPagination
        action={listPath}
        page={page}
        totalPages={totalPages}
        total={total}
        params={{ ...(search ? { search } : {}), ...(published !== 'all' ? { published } : {}) }}
      />
    </>
  );
}