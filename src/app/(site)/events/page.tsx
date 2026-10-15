import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { getPublishedEvents } from '@/server/queries/events';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Events',
    description:
      'Community events from Butts Productions Inc., including campaigns by The Giving BackPack Foundation.',
    alternates: { canonical: '/events' },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function EventsPage() {
  const events = await getPublishedEvents();

  const live = events.filter((event) => event.phase !== 'past');
  const past = events.filter((event) => event.phase === 'past').reverse();

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
            <SectionLabel index="A">
              {live.length > 0 ? 'Upcoming & ongoing' : 'Upcoming'}
            </SectionLabel>
          </Reveal>

          {live.length === 0 ? (
            <Reveal delay={0.08}>
              <p className="mt-10 max-w-2xl leading-relaxed text-stone">
                Nothing is scheduled at the moment. Community events run
                periodically — get in touch if you would like to be told about the
                next one.
              </p>
            </Reveal>
          ) : (
            <div className="mt-12 space-y-6">
              {live.map((event, i) => (
                <Reveal key={event.id} delay={0.04 * i}>
                  <article className="grid gap-0 border border-line lg:grid-cols-12">
                    <div className="grain wash-strong relative isolate flex flex-col justify-center border-b border-line p-8 sm:p-12 lg:col-span-4 lg:border-r lg:border-b-0">
                      <div className="grid-fine absolute inset-0 -z-10 opacity-50" />
                      <p className="overline text-sand">{event.phase}</p>
                      <p className="mt-6 font-display text-4xl leading-tight text-ivory">
                        {formatDate(event.startDate)}
                      </p>
                      {event.venue && (
                        <p className="mt-4 text-sm leading-relaxed text-stone">{event.venue}</p>
                      )}
                      {event.address && (
                        <p className="mt-1 text-sm leading-relaxed text-stone">{event.address}</p>
                      )}
                    </div>

                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-8">
                      <h2 className="font-display text-display-lg text-ivory">{event.name}</h2>
                      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone">
                        {event.description || event.shortDescription}
                      </p>
                      <div className="mt-10 flex flex-wrap gap-4">
                        <Cta href={`/events/${event.slug}`}>Event details</Cta>
                        {event.registrationUrl && (
                          <Cta href={event.registrationUrl} variant="outline">
                            Register
                          </Cta>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="grain border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <Reveal>
              <SectionLabel index="B">Past events</SectionLabel>
            </Reveal>

            <RevealGroup className="mt-12 divide-y divide-line border-t border-line">
              {past.map((event) => (
                <RevealItem key={event.id}>
                  <a
                    href={`/events/${event.slug}`}
                    className="group flex flex-wrap items-baseline justify-between gap-4 py-6 transition-colors hover:text-sand"
                  >
                    <span>
                      <span className="block font-display text-xl text-ivory transition-colors group-hover:text-sand">
                        {event.name}
                      </span>
                      <span className="mt-1 block text-sm text-stone">
                        {formatDate(event.startDate)}
                      </span>
                    </span>
                    <span className="overline text-[9px] text-stone">View details</span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionLabel index="C">Kleen Team Entertainment</SectionLabel>
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
                  across Hampton Roads. Tell us the date and we will tell you what
                  is possible.
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