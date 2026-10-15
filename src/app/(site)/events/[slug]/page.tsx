import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublishedEventBySlug } from '@/server/queries/events';
import { PageHero } from '@/components/public/PageHero';
import { Cta } from '@/components/public/Cta';
import { Reveal } from '@/components/motion/Reveal';

export const instant = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) return { title: 'Event not found' };

  return {
    title: event.name,
    description: event.shortDescription ?? event.description?.slice(0, 160),
    alternates: { canonical: `/events/${event.slug}` },
  };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) notFound();

  return (
    <>
      <PageHero
        index="05"
        overline={event.phase === 'past' ? 'Past event' : 'Event'}
        title={event.name}
        lede={event.shortDescription}
        aside={
          <dl className="space-y-5">
            <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
              <dt className="overline text-stone">Starts</dt>
              <dd className="text-right text-ivory">
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </dd>
            </div>
            {event.endDate && (
              <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
                <dt className="overline text-stone">Ends</dt>
                <dd className="text-right text-ivory">
                  {new Date(event.endDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            )}
            {event.venue && (
              <div className="flex items-baseline justify-between gap-6">
                <dt className="overline text-stone">Venue</dt>
                <dd className="text-right text-ivory">{event.venue}</dd>
              </div>
            )}
          </dl>
        }
      />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-lg leading-relaxed text-stone">{event.description}</p>
            </Reveal>

            {event.address && (
              <Reveal delay={0.08}>
                <p className="mt-8 text-sm text-stone">{event.address}</p>
              </Reveal>
            )}

            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap gap-4">
                {event.registrationUrl ? (
                  <Cta href={event.registrationUrl}>Register</Cta>
                ) : (
                  <Cta href="/contact">Get in touch</Cta>
                )}
                <Cta href="/events" variant="outline">
                  All events
                </Cta>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}