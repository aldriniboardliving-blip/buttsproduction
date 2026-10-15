import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'sand' | 'outline' | 'ghost';

const base =
  'group/cta relative inline-flex items-center gap-3 text-sm font-medium transition-all duration-200 ease-[var(--ease-out-quint)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  sand: 'bg-sand text-ink px-7 py-3.5 hover:bg-ivory active:bg-sand/90',
  outline:
    'border border-line-strong text-ivory px-7 py-3.5 hover:border-sand hover:text-sand',
  ghost: 'text-ivory px-0 py-1 hover:text-sand',
};

/** Public-site call to action. Deliberately separate from the admin
 * `Button`, which stays a light-surface form control. */
export function Cta({
  href,
  children,
  variant = 'sand',
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
    >
      <span>{children}</span>
      {arrow && (
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-4 w-4 shrink-0 transition-transform duration-200 ease-[var(--ease-out-quint)] group-hover/cta:translate-x-1"
        >
          <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Link>
  );
}