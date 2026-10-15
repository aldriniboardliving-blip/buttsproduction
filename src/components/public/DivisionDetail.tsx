import Link from 'next/link';
import { divisions as fallbackDivisions, type Division } from '@/lib/divisions';
import { getPublicDivisions } from '@/server/queries/divisions';
import { Cta } from './Cta';
import { DivisionPlate } from './DivisionPlate';
import { SectionLabel } from './SectionLabel';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

/**
 * Shared body for `/services/[slug]` and `/businesses/[slug]`.
 * One layout, two entry points, so a division page never drifts between
 * the services and businesses sections of the site.
 */
export async function DivisionDetail({
  division,
  context,
}: {
  division: Division;
  context: 'services' | 'businesses';
}) {
  // Resolved live so the "next" link and plate variant stay consistent with
  // whatever the database currently holds, including newly created slugs.
  const { divisions } = await getPublicDivisions();
  const index = Math.max(
    0,
    divisions.findIndex((item) => item.slug === division.slug),
  );
  const sibling = divisions[(index + 1) % divisions.length];
  const alternateContext = context === 'services' ? 'businesses' : 'services';

  return (
    <>
      {/* Hero */}
      <section className="grain wash-strong relative isolate overflow-hidden border-b border-line">
        <div className="grid-fine absolute inset-0 -z-10 opacity-50" />

        <div className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 pt-32 pb-20 sm:pt-40 lg:grid-cols-12 lg:gap-16 lg:pt-44 lg:pb-24">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb" className="overline flex items-center gap-2 text-stone">
                <Link href="/" className="inline-block py-2 transition-colors hover:text-sand">Home</Link>
                <span aria-hidden>/</span>
                <Link href={`/${context}`} className="inline-block py-2 capitalize transition-colors hover:text-sand">
                  {context}
                </Link>
                <span aria-hidden>/</span>
                <span className="truncate text-ivory">{division.name}</span>
              </nav>

              <Reveal delay={0.06}>
                <h1 className="mt-9 text-display-2xl text-ivory">{division.name}</h1>
              </Reveal>

              {(division.price || division.duration) && (
                <Reveal delay={0.12}>
                  <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-y border-line py-6">
                    {division.price && (
                      <p>
                        <span className="overline block text-stone">From</span>
                        <span className="mt-2 block font-display text-5xl leading-none text-sand tabular-nums">
                          ${division.price}
                        </span>
                      </p>
                    )}
                    {division.duration && (
                      <p>
                        <span className="overline block text-stone">Duration</span>
                        <span className="mt-2 block text-2xl text-ivory">{division.duration}</span>
                      </p>
                    )}
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.18}>
                <p className="mt-9 max-w-2xl text-xl leading-relaxed text-stone">
                  {division.shortDescription}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="lg:col-span-5">
              <DivisionPlate
                name={division.name}
                index={`${String(index + 1).padStart(2, '0')} / ${String(divisions.length).padStart(2, '0')}`}
                variant={index}
                className="aspect-4/5 w-full sm:aspect-3/4 lg:aspect-4/5"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <SectionLabel index="A">About</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-8 font-display text-display-lg leading-snug text-ivory">
                  {division.description}
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-8 text-lg leading-relaxed text-stone">
                  Every engagement is handled by the same team that scopes the
                  work, so the person who quotes your job is the person who
                  delivers it. Call{' '}
                  <a href="tel:+18664547033" className="link-underline text-ivory">
                    1-866-454-7033
                  </a>{' '}
                  to talk it through.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={0.12}>
                <SectionLabel index="B">What&apos;s included</SectionLabel>
              </Reveal>

              <RevealGroup className="mt-8 divide-y divide-line border-t border-line">
                {division.highlights.map((highlight) => (
                  <RevealItem key={highlight}>
                    <li className="flex items-start gap-4 py-5">
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-sand"
                      >
                        <path d="M2 8.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm leading-relaxed text-stone">{highlight}</span>
                    </li>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Cta href={division.quotePath ?? '/quote'}>Request a quote</Cta>
                  <Cta href={`/${alternateContext}/${division.slug}`} variant="outline">
                    View as {alternateContext === 'services' ? 'a service' : 'a business'}
                  </Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Next division */}
      <section>
        <Link
          href={`/${context}/${sibling.slug}`}
          className="group block border-b border-line transition-colors duration-300 hover:bg-primary-600/10"
        >
          <div className="mx-auto flex w-full max-w-[1536px] flex-wrap items-center justify-between gap-6 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <div>
              <span className="overline text-stone">Next</span>
              <p className="mt-4 font-display text-display-lg text-ivory transition-colors duration-300 group-hover:text-sand">
                {sibling.name}
              </p>
            </div>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="h-10 w-10 shrink-0 text-stone transition-all duration-300 group-hover:translate-x-2 group-hover:text-sand"
            >
              <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </section>
    </>
  );
}