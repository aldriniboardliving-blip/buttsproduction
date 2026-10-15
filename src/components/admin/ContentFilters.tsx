import Link from 'next/link';

/**
 * Server-rendered filter bar. A plain GET form means search and filtering
 * work without JavaScript and stay shareable/bookmarkable via the URL.
 */
export function ContentFilters({
  action,
  search,
  published,
  placeholder = 'Search…',
}: {
  action: string;
  search: string;
  published: string;
  placeholder?: string;
}) {
  return (
    <form method="get" action={action} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label htmlFor="content-search" className="sr-only">
          Search
        </label>
        <input
          id="content-search"
          type="search"
          name="search"
          defaultValue={search}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="content-published" className="sr-only">
          Publication status
        </label>
        <select
          id="content-published"
          name="published"
          defaultValue={published}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500"
        >
          <option value="all">All statuses</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>

        <button
          type="submit"
          className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Filter
        </button>

        {(search || published !== 'all') && (
          <Link
            href={action}
            className="h-10 rounded-lg px-3 py-2.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}

export function ContentPagination({
  action,
  page,
  totalPages,
  total,
  params,
}: {
  action: string;
  page: number;
  totalPages: number;
  total: number;
  params: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const search = new URLSearchParams({ ...params, page: String(target) });
    return `${action}?${search.toString()}`;
  }

  const visible = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4"
    >
      <p className="text-xs text-neutral-600">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex items-center gap-2">
        <PageLink href={hrefFor(Math.max(1, page - 1))} disabled={page <= 1}>
          Previous
        </PageLink>
        {visible.map((n, index) => (
          <span key={n} className="flex items-center gap-2">
            {index > 0 && visible[index - 1] !== n - 1 && (
              <span className="px-1 text-neutral-400">…</span>
            )}
            <PageLink href={hrefFor(n)} current={n === page}>
              {n}
            </PageLink>
          </span>
        ))}
        <PageLink href={hrefFor(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
          Next
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  children,
  current,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  disabled?: boolean;
}) {
  const className = [
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm transition-colors',
    current
      ? 'bg-neutral-900 text-white'
      : disabled
        ? 'pointer-events-none text-neutral-300'
        : 'text-neutral-700 hover:bg-neutral-100',
  ].join(' ');

  if (disabled) {
    return (
      <span aria-disabled className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-current={current ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}