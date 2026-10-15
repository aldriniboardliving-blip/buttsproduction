import Link from 'next/link';
import { Cta } from './Cta';
import { SectionLabel } from './SectionLabel';
import { DivisionPlate } from './DivisionPlate';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export type QuoteService = {
  slug: string;
  title: string;
  lede: string;
  price: string;
  unit: string;
  includes: string[];
  terms: Array<{ heading: string; points: string[] }>;
  relatedSlug?: string;
};

/**
 * Shared layout for the five `/quote/*` routes.
 *
 * There is no quote-submission endpoint behind this site yet, so rather than
 * ship a form that cannot work, each page presents real rates and terms and
 * routes the visitor to a channel that does: phone or email.
 */
export function QuoteDetail({ service, index }: { service: QuoteService; index: number }) {
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
                <Link href="/quote" className="inline-block py-2 transition-colors hover:text-sand">Quote</Link>
                <span aria-hidden>/</span>
                <span className="text-ivory">{service.title}</span>
              </nav>

              <Reveal delay={0.06}>
                <h1 className="mt-9 text-display-2xl text-ivory">{service.title}</h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-9 max-w-xl text-xl leading-relaxed text-stone">
                  {service.lede}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <Cta href="tel:+18664547033">Call 1-866-454-7033</Cta>
                  <Cta
                    href={`mailto:info@buttsproductions.com?subject=${encodeURIComponent(
                      `Quote enquiry — ${service.title}`,
                    )}`}
                    variant="outline"
                  >
                    Email this division
                  </Cta>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.22} className="lg:col-span-5">
              <div className="border border-line bg-surface">
                <div className="border-b border-line p-7">
                  <p className="overline text-stone">Starting rate</p>
                  <p className="mt-4 font-display text-6xl leading-none text-sand tabular-nums">
                    {service.price}
                  </p>
                  <p className="mt-3 text-sm text-stone">{service.unit}</p>
                </div>
                <DivisionPlate
                  name={service.title}
                  index={`${String(index).padStart(2, '0')}`}
                  variant={index}
                  className="aspect-16/9 w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Includes + terms */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="A">What&apos;s included</SectionLabel>
              </Reveal>
              <RevealGroup className="mt-8 divide-y divide-line border-t border-line">
                {service.includes.map((item) => (
                  <RevealItem key={item}>
                    <li className="flex items-start gap-4 py-4">
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
                      <span className="text-sm leading-relaxed text-stone">{item}</span>
                    </li>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.1}>
                <SectionLabel index="B">Terms</SectionLabel>
              </Reveal>

              <RevealGroup className="mt-8 space-y-10">
                {service.terms.map((group) => (
                  <RevealItem key={group.heading}>
                    <div>
                      <h2 className="font-display text-xl text-ivory">{group.heading}</h2>
                      <ul className="mt-4 space-y-3">
                        {group.points.map((point) => (
                          <li key={point} className="flex gap-3 leading-relaxed text-stone">
                            <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-sand" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.24}>
                <div className="mt-12 border-t border-line pt-8">
                  <p className="leading-relaxed text-stone">
                    Prices are starting rates and will be confirmed in writing
                    before any work is booked in.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Cta href="tel:+18664547033">Call to confirm</Cta>
                    {service.relatedSlug && (
                      <Cta href={`/services/${service.relatedSlug}`} variant="ghost">
                        About this division
                      </Cta>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}