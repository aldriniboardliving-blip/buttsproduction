import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founded by Jared Butts, Butts Productions Inc. is a family-owned collection of Norfolk businesses built on hard work, trust and generational vision.',
  alternates: { canonical: '/about' },
};

const TEAM = [
  { name: 'Aleta Butts', roles: ['CEO — Keeping it Kleen', 'The Giving BackPack Foundation', 'Keeping it Real Psych', '757 Dispatching Services'] },
  { name: 'Jared Butts', roles: ['Founder — Keeping it Kleen', 'Kleen Prints Ink', 'Butts Consulting', 'Butts Car Rentals', 'Kleen Team Entertainment'] },
  { name: 'Maria Vacal', roles: ['Kleen Prints Ink — Design Director', 'Sweet Tender Loving Care — Owner'] },
  { name: 'Richard Johnson', roles: ['Keeping it Kleen — Manager', 'Refurbished Goods — CEO'] },
  { name: 'Bakari Butts', roles: ['Kleen Team Entertainment — DJ PHARFETCHED'] },
  { name: 'Summer Sabate', roles: ['Butts Productions Inc — Assistant'] },
];

const STORY = [
  'At Butts Productions Inc., Butts isn’t just a name — it stands for Building Up The Legacy for my Three Sons. We are a proud family-owned and operated business founded on the principles of hard work, dedication, and generational vision.',
  'Established fifteen years ago by Jared Butts, the story began with Keeping it Kleen Janitorial Services — a small but passionate cleaning company committed to excellence and reliability. What started as a one-man operation has evolved into a multi-faceted enterprise, driven by a mission to create something greater than business success: a lasting legacy for the family and the generations to come.',
  'The mission was simple: build a business that provided for the family, and that his three sons — Jeremiah, Jacob and Jonathan — could be proud of. Something that would keep growing and evolving with time. Today that vision is the reason the company still runs the way it does.',
  'Over the years the family has grown, and so has the business. As more relatives joined, the name came to represent a legacy of hard work, trust, and a commitment to doing the best in every endeavour.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="02"
        overline="About"
        title={
          <>
            Finding inspiration
            <br />
            <span className="text-sand italic">in every turn.</span>
          </>
        }
        lede="Butts Productions Inc. is a collaboration of family and friends, brought together by a shared vision of growth, hard work, and legacy."
      />

      {/* Story */}
      <section className="grain border-b border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="A">Our story</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <blockquote className="mt-8 border-l border-sand pl-6 font-display text-display-md leading-snug text-ivory">
                  Together we’re more than a business — we’re a community
                  working toward a bright future.
                </blockquote>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <RevealGroup className="space-y-7">
                {STORY.map((paragraph, i) => (
                  <RevealItem key={i}>
                    <p
                      className={
                        i === 0
                          ? 'font-display text-xl leading-relaxed text-ivory'
                          : 'text-lg leading-relaxed text-stone'
                      }
                    >
                      {paragraph}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="B">Our clients</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 text-display-lg text-ivory">
                  We don&apos;t just serve clients.
                  <br />
                  <span className="text-sand italic">We empower visionaries.</span>
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <p className="text-lg leading-relaxed text-stone">
                  Across the divisions we work with independent truckers and
                  small fleet owners, party vendors, event promoters and
                  consulting firms — people and teams serious about growing
                  their brand and reaching new levels of success.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-7 leading-relaxed text-stone">
                  Our ideal clients are entrepreneurial, motivated, and ready
                  to take action. Whether you&apos;re organising an unforgettable
                  event, building a logistics business, offering expert
                  consulting, or launching your next venture — we provide the
                  support, structure and services to help you thrive.
                </p>
              </Reveal>
              <Reveal delay={0.28}>
                <div className="mt-10">
                  <Cta href="/services">Explore our services</Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="grain border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <Reveal>
            <SectionLabel index="C">Meet the team</SectionLabel>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((person) => (
              <RevealItem key={person.name}>
                <article className="group h-full bg-surface p-7 transition-colors duration-300 hover:bg-ink">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl text-ivory transition-colors duration-300 group-hover:text-sand">
                      {person.name}
                    </h3>
                    <span aria-hidden className="h-px w-8 shrink-0 bg-line-strong" />
                  </div>
                  <ul className="mt-5 space-y-2">
                    {person.roles.map((role) => (
                      <li key={role} className="text-sm leading-relaxed text-stone">
                        {role}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}