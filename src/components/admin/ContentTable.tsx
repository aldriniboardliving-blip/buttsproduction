'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './AdminPrimitives';

export interface ContentRow {
  id: string;
  title: string;
  subtitle?: string;
  published: boolean;
  featured?: boolean;
  archived?: boolean;
  extra?: string;
  updatedAt?: string;
}

type Action = (id: string, ...args: never[]) => Promise<{ success: boolean; error?: { message: string } }>;

/**
 * Shared admin list.
 *
 * Every content type uses this table so publish / unpublish / archive /
 * restore behave identically everywhere. The mutation functions are server
 * actions passed in as props, which keeps authorisation on the server and
 * avoids one bespoke list component per entity.
 */
export function ContentTable({
  rows,
  columns,
  editBase,
  onPublish,
  onArchive,
  onRestore,
}: {
  rows: ContentRow[];
  columns?: { label: string; className?: string }[];
  /** Path prefix; the row id is appended, e.g. `/admin/businesses` -> `/admin/businesses/<id>/edit`. */
  editBase: string;
  onPublish: (id: string, published: boolean) => Promise<{ success: boolean; error?: { message: string } }>;
  onArchive: (id: string) => Promise<{ success: boolean; error?: { message: string } }>;
  onRestore: (id: string) => Promise<{ success: boolean; error?: { message: string } }>;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [isPending, startTransition] = useTransition();

  const hrefFor = (id: string) => `${editBase}/${id}/edit`;

  function run(row: ContentRow, action: 'publish' | 'archive' | 'restore') {
    setError('');

    if (action === 'archive') {
      const message = `Archive "${row.title}"? It will be removed from the public site. You can restore it afterwards.`;
      if (!window.confirm(message)) return;
    }

    setBusyId(row.id);

    startTransition(async () => {
      const result =
        action === 'publish'
          ? await onPublish(row.id, !row.published)
          : action === 'archive'
            ? await onArchive(row.id)
            : await onRestore(row.id);

      setBusyId('');
      if (!result.success) {
        setError(result.error?.message ?? 'That action could not be completed.');
        return;
      }
      router.refresh();
    });
  }

  const head = columns ?? [
    { label: 'Title' },
    { label: 'Status' },
    { label: 'Updated' },
    { label: 'Actions', className: 'text-right' },
  ];

  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              {head.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {rows.map((row) => {
              const busy = busyId === row.id;
              return (
                <tr key={row.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={hrefFor(row.id)}
                      className="font-medium text-neutral-900 hover:text-primary-600"
                    >
                      {row.title}
                    </Link>
                    {row.subtitle && (
                      <p className="mt-0.5 text-xs text-neutral-500">{row.subtitle}</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        published={row.published}
                        archived={row.archived}
                        featured={row.featured}
                      />
                      {row.extra && (
                        <span className="text-xs text-neutral-500">{row.extra}</span>
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {row.updatedAt
                      ? new Date(row.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy || row.archived}
                        loading={busy}
                        onClick={() => run(row, 'publish')}
                      >
                        {row.published ? 'Unpublish' : 'Publish'}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => router.push(hrefFor(row.id))}
                      >
                        Edit
                      </Button>

                      {row.archived ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => run(row, 'restore')}
                        >
                          Restore
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busy}
                          onClick={() => run(row, 'archive')}
                        >
                          Archive
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isPending && <p className="sr-only" role="status">Updating…</p>}
    </>
  );
}