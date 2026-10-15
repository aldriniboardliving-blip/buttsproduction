import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Starting prices across every Butts Productions division — car rental, consulting, print, dispatching and entertainment.',
  alternates: { canonical: '/quote' },
};

const QUOTES = [
  {
    href: '/quote/car-rental',
    name: 'Car Rental',
    price: '$70',
    unit: 'per day',
    note: '150 miles included · $100 refundable deposit',
  },
  {
    href: '/quote/coaching',
    name: 'Consulting',
    price: '$145',
    unit: 'per 2 hr session',
    note: 'Virtual or in person',
  },
  {
    href: '/quote/custom-print',
    name: 'Custom Print',
    price: '$50',
    unit: 'per 1 hr consultation',
    note: 'Design review and print preparation',
  },
  {
    href: '/quote/entertainment',
    name: 'Entertainment',
    price: '$300',
    unit: 'per 2 hr booking',
    note: 'DJ, tents, sound and lighting',
  },
  {
    href: '/quote/dispatch',
    name: 'Dispatching',
    price: '$100',
    unit: 'per engagement',
    note: 'Loads and logistics handled for you',
  },
  {
    href: '/contact',
    name: 'Janitorial & other',
    price: 'On request',
    unit: 'priced per site',
    note: 'Call for a tailored quote',
  },
];

const STEPS = [
  { n: '01', t: 'Tell us what you need', d: 'Call the number, or email the division directly. The more detail you give, the more accurate the quote.' },
  { n: '02', t: 'Get a rate in writing', d: 'We confirm pricing, inclusions and timing before anything is booked in. No surprises afterwards.' },
  { n: '03', t: 'We do the work', d: 'The same person who scoped your job delivers it. Our motto is simple: strive for excellence and wipe away imperfections.' },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        index="07"
        overline="Quote"
        title={
          <>
            Straight rates,
            <br />
            <span className="text-sand italic">no surprises.</span>
          </>
        }
        lede="Starting prices across the divisions below. Everything is confirmed in writing before work is booked, so you always know what you are paying for."
        aside={
          <div>
            <p className="overline text-sand">Prefer to talk?</p>
            <div className="mt-6 flex flex-col gap-4">
              <Cta href="tel:+18664547033" variant="outline">
                1-866-454-7033
              </Cta>
              <Cta href="mailto:info@buttsproductions.com" variant="ghost">
                info@buttsproductions.com
              </Cta>
            </div>
          </div>
        }
      />

      {/* Rates */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionLabel index="A">Starting rates</SectionLabel>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {QUOTES.map((quote) => (
              <RevealItem key={quote.href}>
                <Link
                  href={quote.href}
                  className="group flex h-full flex-col bg-ink p-7 transition-colors duration-300 hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-xl text-ivory transition-colors duration-300 group-hover:text-sand">
                      {quote.name}
                    </h2>
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="mt-1 h-4 w-4 shrink-0 text-stone transition-all duration-300 group-hover:translate-x-1 group-hover:text-sand"
                    >
                      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <p className="mt-8 font-display text-4xl leading-none text-sand tabular-nums">
                    {quote.price}
                  </p>
                  <p className="mt-2 text-xs text-stone">{quote.unit}</p>

                  <p className="mt-auto pt-6 text-sm leading-relaxed text-stone">
                    {quote.note}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Process */}
      <section className="grain border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionLabel index="B">How it works</SectionLabel>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step) => (
              <RevealItem key={step.n}>
                <div className="border-t border-line pt-6">
                  <span className="font-display text-5xl leading-none text-sand tabular-nums">
                    {step.n}
                  </span>
                  <h3 className="mt-6 font-display text-xl text-ivory">{step.t}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{step.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}