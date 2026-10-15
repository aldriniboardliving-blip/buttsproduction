import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublicDivisions } from '@/server/queries/divisions';
import { PageHero } from '@/components/public/PageHero';
import { DivisionPlate } from '@/components/public/DivisionPlate';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Services',
    description:
      'Eleven divisions under one roof: janitorial services, consulting, custom print, dispatching, car rentals, entertainment and more.',
    alternates: { canonical: '/services' },
  };
}

export default async function ServicesPage() {
  const { divisions, dbAvailable } = await getPublicDivisions();

  const priced = divisions.filter((division) => typeof division.price === 'number');

  return (
    <>
      <PageHero
        index="01"
        overline="Services"
        title={
          <>
            Everything we do,
            <br />
            <span className="text-sand italic">under one roof.</span>
          </>
        }
        lede="Butts Productions runs eleven divisions. Some clean buildings, some build brands, some move freight or play music — all of them held to the same standard."
        aside={
          <dl className="space-y-5">
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
              <dt className="overline text-stone">Divisions</dt>
              <dd className="font-display text-3xl text-ivory tabular-nums">{divisions.length}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
              <dt className="overline text-stone">With published rates</dt>
              <dd className="font-display text-3xl text-ivory tabular-nums">{priced.length}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="overline text-stone">Coverage</dt>
              <dd className="text-right text-ivory">Hampton Roads</dd>
            </div>
          </dl>
        }
      />

      {/* Editorially ordered index — database content merged over the fallback. */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <RevealGroup className="border-t border-line" gap={0.05}>
            {divisions.map((division, i) => (
              <RevealItem key={division.slug}>
                <Link
                  href={`/services/${division.slug}`}
                  className="group grid items-center gap-x-8 gap-y-4 border-b border-line py-8 transition-colors duration-300 hover:bg-primary-600/10 sm:grid-cols-12 sm:px-4 lg:py-10"
                >
                  <span className="overline text-stone tabular-nums sm:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-display-md text-ivory transition-colors duration-300 group-hover:text-sand sm:col-span-4">
                    {division.name}
                  </h2>
                  <p className="lines-2 text-sm leading-relaxed text-stone sm:col-span-5">
                    {division.shortDescription}
                  </p>
                  <span className="flex items-center justify-between gap-4 sm:col-span-2 sm:justify-end">
                    {division.price ? (
                      <span className="text-sm text-ivory tabular-nums">
                        ${division.price}
                        {division.duration && (
                          <span className="text-stone"> / {division.duration}</span>
                        )}
                      </span>
                    ) : (
                      <span className="overline text-[9px] text-stone">Enquire</span>
                    )}
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-4 w-4 shrink-0 text-stone transition-all duration-300 group-hover:translate-x-1 group-hover:text-sand"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Editorial feature rows */}
      <section className="grain border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="space-y-6">
            {divisions.slice(0, 4).map((division, i) => (
              <Reveal key={division.slug} delay={0.04 * i}>
                <Link
                  href={`/services/${division.slug}`}
                  className="group grid items-stretch gap-0 border border-line transition-colors duration-300 hover:border-sand/40 lg:grid-cols-12"
                >
                  <div className="lg:col-span-5">
                    <DivisionPlate
                      name={division.name}
                      index={String(i + 1).padStart(2, '0')}
                      variant={i}
                      className="aspect-16/10 w-full lg:h-full lg:aspect-auto lg:min-h-64"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7">
                    <span className="overline text-sand">{division.duration ?? 'Enquire'}</span>
                    <h3 className="mt-4 font-display text-display-lg text-ivory transition-colors duration-300 group-hover:text-sand">
                      {division.name}
                    </h3>
                    <p className="mt-4 max-w-lg leading-relaxed text-stone">
                      {division.description || division.shortDescription}
                    </p>
                    {typeof division.price === 'number' && (
                      <p className="mt-6 font-display text-3xl text-sand tabular-nums">
                        ${division.price}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}