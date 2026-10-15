import { cn } from '@/lib/utils';

const STOP_WORDS = new Set(['the', 'of', 'it', 'and', 'for', 'a', 'our']);

function initialsFor(name: string) {
  const words = name
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word.toLowerCase()));

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * The site's visual device in place of photography.
 *
 * There is no brand photography in the repository, so rather than filling the
 * layout with unrelated stock imagery each division gets a composed "plate
 * mark": a dark surface, a fine hairline grid, one directional light wash and
 * an outlined serif monogram. Four fixed compositions cycle by index, so the
 * treatment reads as one designed system while staying recognisable per
 * division — and it can be swapped for real imagery later without changing
 * layout.
 */
export function DivisionPlate({
  name,
  index,
  variant = 0,
  className,
}: {
  name: string;
  index?: string;
  variant?: number;
  className?: string;
}) {
  const initials = initialsFor(name);
  const v = ((variant % 4) + 4) % 4;

  const washPosition = [
    'radial-gradient(90% 70% at 18% 12%, rgb(52 68 56 / 0.72) 0%, rgb(52 68 56 / 0) 62%)',
    'radial-gradient(90% 70% at 84% 88%, rgb(52 68 56 / 0.66) 0%, rgb(52 68 56 / 0) 60%)',
    'radial-gradient(70% 90% at 50% 100%, rgb(52 68 56 / 0.6) 0%, rgb(52 68 56 / 0) 66%)',
    'radial-gradient(80% 70% at 90% 10%, rgb(52 68 56 / 0.68) 0%, rgb(52 68 56 / 0) 60%)',
  ][v];

  const monogramPosition = [
    'right-[-0.12em] bottom-[-0.18em] text-[13rem]',
    'right-[-0.1em] top-[-0.14em] text-[11rem]',
    'left-[-0.1em] bottom-[-0.16em] text-[12rem]',
    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem]',
  ][v];

  return (
    <div
      aria-hidden
      className={cn(
        'grain relative isolate overflow-hidden bg-surface',
        className,
      )}
      style={{ backgroundImage: washPosition }}
    >
      <div className="grid-fine absolute inset-0 -z-10" />

      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute font-display leading-none font-medium',
          'text-transparent select-none',
          monogramPosition,
        )}
        style={{
          WebkitTextStroke: '1px rgb(242 238 229 / 0.2)',
        }}
      >
        {initials}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <span aria-hidden className="h-px w-10 bg-sand/60" />
        {index && (
          <span className="overline text-stone tabular-nums">{index}</span>
        )}
      </div>
    </div>
  );
}