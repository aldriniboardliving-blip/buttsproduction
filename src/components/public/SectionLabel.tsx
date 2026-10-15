import { cn } from '@/lib/utils';

/**
 * Small uppercase label with an optional index numeral and a hairline rule.
 * Used to open every public section so they read as one system.
 */
export function SectionLabel({
  index,
  children,
  className,
  tone = 'sand',
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  tone?: 'sand' | 'stone' | 'ivory';
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {index && (
        <span className="overline text-sand tabular-nums">{index}</span>
      )}
      <span
        className={cn(
          'overline',
          tone === 'sand' && 'text-sand',
          tone === 'stone' && 'text-stone',
          tone === 'ivory' && 'text-ivory',
        )}
      >
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}