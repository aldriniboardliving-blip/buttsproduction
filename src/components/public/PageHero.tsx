import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from './SectionLabel';

/**
 * Shared opening treatment for public pages. Gives each route the same
 * atmospheric foundation while the content beneath it stays page-specific.
 */
export function PageHero({
  overline,
  index,
  title,
  lede,
  aside,
  children,
  className,
}: {
  overline: string;
  index?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        'grain wash-strong relative isolate overflow-hidden border-b border-line',
        className,
      )}
    >
      <div className="grid-fine absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 pt-28 pb-20 sm:pt-36 sm:pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-44 lg:pb-28">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index={index}>{overline}</SectionLabel>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-8 text-display-xl text-ivory">{title}</h1>
            </Reveal>

            {lede && (
              <Reveal delay={0.16}>
                <div className="mt-8 max-w-2xl text-lg leading-relaxed text-stone sm:text-xl">
                  {lede}
                </div>
              </Reveal>
            )}
          </div>

          {aside && (
            <Reveal delay={0.24} className="lg:col-span-4 lg:col-start-9">
              <div className="lg:pt-4">{aside}</div>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.3} className="lg:col-span-12">
              <div className="mt-4">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}