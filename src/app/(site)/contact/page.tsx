import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { divisions } from '@/lib/divisions';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach Butts Productions Inc. in Norfolk, VA by phone, email or in person at 848 Granby St. Suite 203.',
  alternates: { canonical: '/contact' },
};

const CHANNELS = [
  {
    label: 'Toll free',
    value: '1-866-454-7033',
    note: 'Answered 24/7',
    href: 'tel:+18664547033',
  },
  {
    label: 'Local',
    value: '757-900-9914',
    note: 'Norfolk office',
    href: 'tel:+17579009914',
  },
  {
    label: 'Fax',
    value: '757-295-8107',
    note: 'Documents & contracts',
    href: 'tel:+17572958107',
  },
  {
    label: 'Email',
    value: 'info@buttsproductions.com',
    note: 'Replies within one business day',
    href: 'mailto:info@buttsproductions.com',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="03"
        overline="Contact"
        title={
          <>
            One enquiry,
            <br />
            <span className="text-sand italic">reaches the whole company.</span>
          </>
        }
        lede="Call any number, send an email, or come by the office on Granby Street. Whichever route you take, you will reach a person who can actually do something about it."
      />

      {/* Channels */}
      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionLabel index="A">Reach us</SectionLabel>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((channel) => (
              <RevealItem key={channel.label} className="min-w-0">
                <a
                  href={channel.href}
                  className="group flex h-full min-w-0 flex-col bg-ink p-7 transition-colors duration-300 hover:bg-surface"
                >
                  <span className="overline text-stone">{channel.label}</span>
                  <span className="mt-5 break-words font-display text-2xl leading-tight text-ivory transition-colors duration-300 group-hover:text-sand">
                    {channel.value}
                  </span>
                  <span className="mt-auto pt-6 text-xs text-stone">{channel.note}</span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Office */}
      <section className="grain border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="B">Headquarters</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <address className="mt-8 font-display text-display-md not-italic leading-snug text-ivory">
                  848 Granby St.
                  <br />
                  Suite 203
                  <br />
                  <span className="text-sand">Norfolk, VA 23510</span>
                </address>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-7 leading-relaxed text-stone">
                  Visitor parking is available on Granby Street. Please check in
                  at the Suite 203 door on arrival.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <dl className="mt-10 divide-y divide-line border-y border-line">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <dt className="overline text-sand">Drivers</dt>
                    <dd className="text-ivory">Sunday–Saturday · 9:00am – 9:00pm</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <dt className="overline text-sand">Office</dt>
                    <dd className="text-ivory">Monday–Friday</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-4 py-5">
                    <dt className="overline text-sand">Phone</dt>
                    <dd className="text-ivory">Answered 24/7</dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <SectionLabel index="C">Not sure where to start?</SectionLabel>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="mt-8 text-lg leading-relaxed text-stone">
                  Pick the division closest to what you need. Each page carries
                  its own rates, inclusions and the right next step.
                </p>
              </Reveal>

              <RevealGroup className="mt-10 divide-y divide-line border-t border-line">
                {divisions.slice(0, 6).map((division) => (
                  <RevealItem key={division.slug}>
                    <a
                      href={`/businesses/${division.slug}`}
                      className="group flex items-center justify-between gap-6 py-4 transition-colors duration-200 hover:text-sand"
                    >
                      <span className="text-ivory transition-colors duration-200 group-hover:text-sand">
                        {division.name}
                      </span>
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
                    </a>
                  </RevealItem>
                ))}
              </RevealGroup>

              <Reveal delay={0.3}>
                <div className="mt-12">
                  <Cta href="/quote">Request a quote</Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}