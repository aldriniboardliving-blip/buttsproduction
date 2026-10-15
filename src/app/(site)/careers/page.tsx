import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { divisions } from '@/lib/divisions';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join the Butts Productions Inc. team in Norfolk, VA. Opportunities across janitorial, print, dispatching, entertainment and the office.',
  alternates: { canonical: '/careers' },
};

const VALUES = [
  {
    title: 'Ownership',
    body: 'Every division is run by a named person who is accountable for it — and can grow it.',
  },
  {
    title: 'Trade-off honesty',
    body: 'We tell you what a job needs, what it costs, and where we are genuinely strong.',
  },
  {
    title: 'Build for the long run',
    body: 'Fifteen years in, we still make decisions we would be comfortable explaining to our sons.',
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        index="06"
        overline="Careers"
        title={
          <>
            Now hiring,
            <br />
            <span className="text-sand italic">across every division.</span>
          </>
        }
        lede="We are always interested in people who want to build something rather than just clock in. If that sounds like you, we would like to hear from you."
        aside={
          <div>
            <p className="overline text-sand">Get hired</p>
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

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="A">How we work</SectionLabel>
              </Reveal>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <RevealGroup className="divide-y divide-line border-t border-line">
                {VALUES.map((value, i) => (
                  <RevealItem key={value.title}>
                    <div className="grid gap-4 py-8 sm:grid-cols-12 sm:gap-8">
                      <h2 className="font-display text-xl text-ivory sm:col-span-5">
                        {String(i + 1).padStart(2, '0')} · {value.title}
                      </h2>
                      <p className="leading-relaxed text-stone sm:col-span-7">
                        {value.body}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      <section className="grain border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionLabel index="B">Where we are hiring</SectionLabel>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {divisions.map((division) => (
              <RevealItem key={division.slug}>
                <div className="h-full bg-surface p-6 transition-colors duration-300 hover:bg-ink">
                  <h3 className="font-display text-lg text-ivory">{division.name}</h3>
                  <p className="lines-2 mt-3 text-sm leading-relaxed text-stone">
                    {division.shortDescription}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.2}>
            <p className="mt-12 max-w-2xl leading-relaxed text-stone">
              We do not post every opening publicly, so if you want to work with
              us, call or email and tell us what you do best. Reliable people
              have never had trouble finding a place here.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}