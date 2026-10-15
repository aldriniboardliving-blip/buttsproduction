import Link from 'next/link';
import type { Metadata } from 'next';
import { divisions } from '@/lib/divisions';
import { PageHero } from '@/components/public/PageHero';
import { DivisionPlate } from '@/components/public/DivisionPlate';
import { Cta } from '@/components/public/Cta';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Businesses',
  description:
    'The eleven companies inside Butts Productions Inc., from Keeping it Kleen to Butts Car Rentals and The Giving BackPack Foundation.',
  alternates: { canonical: '/businesses' },
};

export default function BusinessesPage() {
  return (
    <>
      <PageHero
        index="02"
        overline="Businesses"
        title={
          <>
            One company,
            <br />
            <span className="text-sand italic">eleven brands.</span>
          </>
        }
        lede="Each division was built by someone in the family and run by someone who knows that division inside out. They share a name, an office and a standard."
        aside={
          <p className="font-display text-display-md leading-snug text-ivory">
            &ldquo;Butts&rdquo; stands for Building Up The Legacy for my Three
            Sons.
          </p>
        }
      />

      {/* Asymmetric plate grid */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
            {divisions.map((division, i) => {
              // Deliberately irregular spans so the grid reads as a composition.
              const span =
                i % 5 === 0 ? 'lg:col-span-7' : i % 5 === 3 ? 'lg:col-span-5' : 'lg:col-span-6';
              const aspect = i % 3 === 0 ? 'aspect-16/10' : 'aspect-4/3';

              return (
                <Reveal key={division.slug} delay={0.04 * (i % 4)} className={span}>
                  <Link
                    href={`/businesses/${division.slug}`}
                    className="group block h-full border border-line transition-colors duration-300 hover:border-sand/40"
                  >
                    <DivisionPlate
                      name={division.name}
                      index={String(i + 1).padStart(2, '0')}
                      variant={i}
                      className={`${aspect} w-full`}
                    />
                    <div className="p-6 sm:p-7">
                      <h2 className="font-display text-xl text-ivory transition-colors duration-300 group-hover:text-sand">
                        {division.name}
                      </h2>
                      <p className="lines-2 mt-3 text-sm leading-relaxed text-stone">
                        {division.shortDescription}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team ownership */}
      <section className="grain border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="text-display-xl text-ivory">
                  Built by the people who run it.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-7 leading-relaxed text-stone">
                  Every division has a named owner on the ground. That is not a
                  marketing line — it is how a fifteen-year-old family business
                  stays accountable.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="mt-9">
                  <Cta href="/about" variant="outline">
                    Meet the team
                  </Cta>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <RevealGroup className="grid gap-px border border-line bg-line sm:grid-cols-2">
                {[
                  { name: 'Aleta Butts', role: 'CEO — Keeping it Kleen, The Giving BackPack Foundation, Keeping it Real Psych, 757 Dispatching' },
                  { name: 'Jared Butts', role: 'Founder — Keeping it Kleen, Kleen Prints Ink, Butts Consulting, Butts Car Rentals, Kleen Team Entertainment' },
                  { name: 'Maria Vacal', role: 'Kleen Prints Ink — Design Director; Sweet Tender Loving Care — Owner' },
                  { name: 'Richard Johnson', role: 'Keeping it Kleen — Manager; Refurbished Goods — CEO' },
                  { name: 'Bakari Butts', role: 'Kleen Team Entertainment — DJ PHARFETCHED' },
                  { name: 'Summer Sabate', role: 'Butts Productions Inc — Assistant' },
                ].map((person) => (
                  <RevealItem key={person.name}>
                    <div className="h-full bg-surface p-6">
                      <p className="font-display text-lg text-ivory">{person.name}</p>
                      <p className="mt-2 text-sm leading-relaxed text-stone">{person.role}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}