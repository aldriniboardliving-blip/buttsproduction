import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Community events from Butts Productions Inc., including the Make the Change campaign by The Giving BackPack Foundation.',
  alternates: { canonical: '/events' },
};

const EVENTS = [
  {
    date: '21 Mar 2026',
    time: '8:00 AM — 12:00 PM',
    title: 'Make the Change — Community Change Drive',
    body: 'The Giving BackPack Foundation is proud to launch our “Make the Change” Campaign, a community effort to raise spare change that will fund a Laundry Day for the Homeless in our local community. Every coin counts — the change sitting in your car, your pockets, or your home can help provide something.',
    location: '7506 Ave J, Norfolk, VA 23513',
    cta: { label: 'Get involved', href: '/contact' },
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        index="05"
        overline="Events"
        title={
          <>
            Work that reaches
            <br />
            <span className="text-sand italic">past the invoice.</span>
          </>
        }
        lede="A share of what we do is directed outward — community campaigns, fundraising drives and events run by The Giving BackPack Foundation."
      />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal>
            <SectionLabel index="A">Upcoming &amp; recent</SectionLabel>
          </Reveal>

          <div className="mt-12 space-y-6">
            {EVENTS.map((event) => (
              <Reveal key={event.title}>
                <article className="grid gap-0 border border-line lg:grid-cols-12">
                  <div className="grain wash-strong relative isolate flex flex-col justify-center border-b border-line p-8 sm:p-12 lg:col-span-4 lg:border-r lg:border-b-0">
                    <div className="grid-fine absolute inset-0 -z-10 opacity-50" />
                    <p className="overline text-sand">{event.date}</p>
                    <p className="mt-6 font-display text-4xl leading-none text-ivory tabular-nums">
                      {event.time.split(' — ')[0]}
                    </p>
                    <p className="mt-2 text-sm text-stone tabular-nums">
                      until {event.time.split(' — ')[1]}
                    </p>
                    <p className="mt-8 text-sm leading-relaxed text-stone">
                      {event.location}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-8">
                    <h2 className="font-display text-display-lg text-ivory">
                      {event.title}
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone">
                      {event.body}
                    </p>
                    <div className="mt-10">
                      <Cta href={event.cta.href}>{event.cta.label}</Cta>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="B">Kleen Team Entertainment</SectionLabel>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-8 text-display-lg text-ivory">
                  Book the event, not just the service.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.12}>
                <p className="text-lg leading-relaxed text-stone">
                  Alongside DJ services from DJ PHARFETCHED and tent rentals, we
                  help run community gatherings, fundraisers and celebrations
                  across Hampton Roads. Tell us the date and we will tell you
                  what is possible.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Cta href="/quote/entertainment">Entertainment quote</Cta>
                  <Cta href="/contact" variant="outline">
                    Check a date
                  </Cta>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}