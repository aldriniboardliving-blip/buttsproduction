import Link from 'next/link';
import { divisions } from '@/lib/divisions';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { DivisionPlate } from '@/components/public/DivisionPlate';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

const FEATURED = [
  'keeping-it-kleen',
  'car-rentals',
  'butts-consulting',
  'kleen-team-entertainment',
];

const FACTS = [
  { value: '15+', label: 'Years serving the community' },
  { value: '11', label: 'Business divisions' },
  { value: '4', label: 'Vehicles in the rental fleet' },
];

const FAQS = [
  {
    q: 'What do I need to rent a car?',
    a: "A valid driver's licence held for at least twelve months, a credit or debit card in the renter's name, proof of identity, and a minimum age of 21.",
  },
  {
    q: 'Is there a mileage limit?',
    a: 'Yes — 150 miles per day is included with every rental. Excess mileage fees may apply, and unlimited mileage is available for an additional charge.',
  },
  {
    q: 'Can someone else drive the rental car?',
    a: 'Yes, but additional drivers must be listed on the rental agreement and meet the same age and licensing requirements. Extra fees may apply.',
  },
];

export default function HomePage() {
  const featured = FEATURED.map((slug) => divisions.find((d) => d.slug === slug)!).filter(Boolean);

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="grain wash-strong relative isolate overflow-hidden">
        <div className="grid-fine absolute inset-0 -z-10 opacity-50" />

        <div className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-14 pt-32 pb-20 sm:pt-40 sm:pb-24 lg:grid-cols-12 lg:gap-12 lg:pt-44 lg:pb-28">
            {/* Copy */}
            <div className="lg:col-span-7">
              <Reveal>
                <SectionLabel index="01">Norfolk, Virginia</SectionLabel>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="mt-9 text-display-2xl text-ivory">
                  Building up
                  <br />
                  <span className="text-sand italic">the legacy.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-9 max-w-xl text-lg leading-relaxed text-stone sm:text-xl">
                  Butts Productions is a family-owned collection of Norfolk
                  businesses — janitorial, consulting, dispatching, car rental,
                  print and entertainment — built over fifteen years on one
                  idea: that a company should leave more than it takes.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <Cta href="/quote">Request a quote</Cta>
                  <Cta href="/about" variant="ghost">
                    Our story
                  </Cta>
                </div>
              </Reveal>

              <RevealGroup
                className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-8"
                gap={0.09}
                delay={0.36}
              >
                {FACTS.map((fact) => (
                  <RevealItem key={fact.label}>
                    <p className="font-display text-4xl leading-none text-sand tabular-nums sm:text-5xl">
                      {fact.value}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-stone">{fact.label}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            {/* Plate */}
            <Reveal delay={0.24} className="lg:col-span-5">
              <div className="relative">
                <DivisionPlate
                  name="Butts Productions"
                  index="Est. 2011"
                  variant={3}
                  className="aspect-4/5 w-full sm:aspect-3/4 lg:aspect-4/5"
                />

                <div className="absolute -bottom-6 -left-4 w-56 border border-line bg-ink/95 p-5 backdrop-blur-xl sm:-left-8 sm:w-64">
                  <p className="overline text-sand">The name</p>
                  <p className="mt-3 font-display text-lg leading-snug text-ivory">
                    &ldquo;Butts&rdquo; stands for{' '}
                    <span className="text-sand">Building Up The Legacy</span> for
                    my Three Sons.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mx-auto w-full max-w-[1536px] px-5 pb-10 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 text-stone">
            <span aria-hidden className="h-8 w-px bg-line-strong" />
            <span className="overline text-[9px]">Scroll</span>
          </div>
        </div>
      </section>

      {/* ============ Brand introduction ============ */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="02">Who we are</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 text-display-xl text-ivory">
                  A collaboration of family and friends, brought together by a
                  shared vision of <span className="text-sand">growth</span>,
                  hard work, and legacy.
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <div className="space-y-6 text-lg leading-relaxed text-stone">
                  <p>
                    Founded by Jared Butts, the company began with Keeping it
                    Kleen Janitorial Services — a one-man cleaning operation
                    committed to excellence and reliability. It has since grown
                    into a multi-faceted enterprise, and into a family one.
                  </p>
                  <p>
                    The mission was simple from the start: build something that
                    provided for the family, and that his three sons — Jeremiah,
                    Jacob and Jonathan — could be proud of. That vision is now
                    the reason the business still runs the way it does.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
                  <div>
                    <dt className="overline text-sand">Founded</dt>
                    <dd className="mt-2 text-ivory">Jared Butts, ~2011</dd>
                  </div>
                  <div>
                    <dt className="overline text-sand">Headquarters</dt>
                    <dd className="mt-2 text-ivory">848 Granby St. Suite 203, Norfolk</dd>
                  </div>
                  <div>
                    <dt className="overline text-sand">Divisions</dt>
                    <dd className="mt-2 text-ivory">{divisions.length} operating businesses</dd>
                  </div>
                  <div>
                    <dt className="overline text-sand">Coverage</dt>
                    <dd className="mt-2 text-ivory">Hampton Roads &amp; beyond</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Divisions index ============ */}
      <section className="relative">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <SectionLabel index="03">What we do</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 max-w-2xl text-display-xl text-ivory">
                  Eleven divisions, one standard of work.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.16}>
              <Cta href="/services" variant="outline">
                View all services
              </Cta>
            </Reveal>
          </div>

          {/* Editorial index — deliberately not a card grid. */}
          <RevealGroup className="mt-16 border-t border-line" gap={0.05}>
            {divisions.map((division, i) => (
              <RevealItem key={division.slug}>
                <Link
                  href={`/services/${division.slug}`}
                  className="group relative grid items-center gap-x-8 gap-y-3 border-b border-line py-7 transition-colors duration-300 hover:bg-primary-600/10 sm:grid-cols-12 sm:px-4 lg:py-9"
                >
                  <span className="overline text-stone tabular-nums sm:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3 className="font-display text-display-md text-ivory transition-colors duration-300 group-hover:text-sand sm:col-span-5">
                    {division.name}
                  </h3>

                  <p className="lines-2 text-sm leading-relaxed text-stone sm:col-span-4">
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

      {/* ============ Featured divisions ============ */}
      <section className="grain border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <Reveal>
            <SectionLabel index="04">In focus</SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-8 max-w-2xl text-display-xl text-ivory">
              Four of the divisions our clients ask for most.
            </h2>
          </Reveal>

          {/* Asymmetric editorial grid */}
          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            {featured.map((division, i) => {
              const wide = i === 0 || i === 3;
              return (
                <Reveal
                  key={division.slug}
                  delay={0.06 * i}
                  className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
                >
                  <Link
                    href={`/services/${division.slug}`}
                    className="group media-zoom relative block h-full border border-line bg-ink transition-colors duration-300 hover:border-sand/40"
                  >
                    <DivisionPlate
                      name={division.name}
                      index={division.duration}
                      variant={i}
                      className={wide ? 'aspect-16/10 w-full' : 'aspect-4/3 w-full'}
                    />

                    <div className="relative flex items-end justify-between gap-6 p-6 sm:p-8">
                      <div>
                        <h3 className="font-display text-display-md text-ivory transition-colors duration-300 group-hover:text-sand">
                          {division.name}
                        </h3>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone">
                          {division.shortDescription}
                        </p>
                      </div>

                      {division.price && (
                        <span className="shrink-0 font-display text-3xl text-sand tabular-nums">
                          ${division.price}
                        </span>
                      )}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Community ============ */}
      <section className="relative">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="05">Community</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 text-display-lg text-ivory">
                  Make the Change
                </h2>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-6 text-lg leading-relaxed text-stone">
                  Every coin counts. The change sitting in your car, your
                  pockets, or your home can help provide something.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <p className="text-lg leading-relaxed text-stone">
                  The Giving BackPack Foundation launched its &ldquo;Make the
                  Change&rdquo; campaign to raise spare change that will fund a
                  laundry day for the homeless in our local community.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <dl className="mt-10 divide-y divide-line border-y border-line">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <dt className="overline text-sand">When</dt>
                    <dd className="text-ivory">March 21, 2026 · 8:00 AM — 12:00 PM</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <dt className="overline text-sand">Where</dt>
                    <dd className="text-ivory">7506 Ave J, Norfolk, VA 23513</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.28}>
                <div className="mt-10">
                  <Cta href="/contact" variant="outline">
                    Get involved
                  </Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ teaser ============ */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="06">Questions</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 text-display-lg text-ivory">
                  Common answers, up front.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-8">
                  <Cta href="/faq" variant="ghost">
                    All FAQs
                  </Cta>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <RevealGroup className="divide-y divide-line border-t border-line">
                {FAQS.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <details className="group py-6">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-xl text-ivory transition-colors duration-200 hover:text-sand">
                        {faq.q}
                        <span
                          aria-hidden
                          className="mt-1 shrink-0 text-sand transition-transform duration-300 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone">
                        {faq.a}
                      </p>
                      {i === FAQS.length - 1 && <span className="sr-only">{faq.q}</span>}
                    </details>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Closing CTA ============ */}
      <section className="grain wash-strong relative isolate overflow-hidden">
        <div className="grid-fine absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto w-full max-w-[1536px] px-5 py-28 text-center sm:px-8 lg:px-12 lg:py-40">
          <Reveal>
            <SectionLabel index="07" tone="stone" className="justify-center">
              Start here
            </SectionLabel>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-9 max-w-4xl text-display-2xl text-ivory">
              Tell us what you need.
              <br />
              <span className="text-sand italic">We&apos;ll take it from there.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-stone">
              Whether you need a vehicle for the week, a room spotless, a brand
              built, or a DJ for the night — one enquiry reaches the whole
              company.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Cta href="/quote">Request a quote</Cta>
              <Cta href="tel:+18664547033" variant="outline">
                1-866-454-7033
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}