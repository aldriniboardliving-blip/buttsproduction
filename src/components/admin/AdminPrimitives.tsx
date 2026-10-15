import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function AdminPageHeader({
  title,
  description,
  action,
  breadcrumb,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <header className="mb-8">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link href={crumb.href} className="hover:text-neutral-900">
                  {crumb.label}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li aria-current="page" className="text-neutral-700">
              {title}
            </li>
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}

/** Draft / Published / Archived, mapped onto the shared Badge component. */
export function StatusBadge({
  published,
  archived,
  featured,
}: {
  published: boolean;
  archived?: boolean;
  featured?: boolean;
}) {
  if (archived) return <Badge variant="default">Archived</Badge>;
  if (published) return <Badge variant="success">Published</Badge>;
  return <Badge variant="warning">Draft</Badge>;
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

/** Alert used for action errors and database failures. */
export function AdminAlert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'info' | 'warning';
  children: React.ReactNode;
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'mb-6 rounded-lg border px-4 py-3 text-sm',
        tone === 'error' && 'border-red-200 bg-red-50 text-red-800',
        tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-900',
        tone === 'info' && 'border-primary-200 bg-primary-50 text-primary-800',
      )}
    >
      {children}
    </div>
  );
}