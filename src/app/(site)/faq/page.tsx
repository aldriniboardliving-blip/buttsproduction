import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { getPublishedFaqs } from '@/server/queries/content';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FAQs',
    description:
      'Answers to the questions we are asked most often about car rental, cleaning, print, dispatching and entertainment services.',
    alternates: { canonical: '/faq' },
  };
}

/** Used until real FAQs are published in the admin. */
const FALLBACK_FAQS = [
  {
    id: 'fb-1',
    question: 'What do I need to rent a car?',
    answer:
      'A valid driver’s licence — usually held for at least twelve months — a credit or debit card in the renter’s name, proof of identity, and you must meet the minimum age requirement.',
  },
  {
    id: 'fb-2',
    question: 'What is the minimum age to rent?',
    answer: 'Twenty-one. Drivers under twenty-five may pay a young driver fee on some vehicles.',
  },
  {
    id: 'fb-3',
    question: 'Is insurance included?',
    answer:
      'No. We offer insurance as a refundable add-on of one hundred dollars, or you can supply your own cover — the choice is yours at the time of booking.',
  },
  {
    id: 'fb-4',
    question: 'What fuel policy do you use?',
    answer:
      'Full-to-full. Please return the vehicle with a full tank; the fuel gauge at collection is recorded with the renter.',
  },
  {
    id: 'fb-5',
    question: 'Can I return the car to a different location?',
    answer: 'No. The vehicle must be returned to the pick-up location.',
  },
  {
    id: 'fb-6',
    question: 'Is there a mileage limit?',
    answer:
      'Yes — one hundred and fifty miles per day is included. Excess mileage fees may apply, and unlimited mileage is available for an additional charge.',
  },
  {
    id: 'fb-7',
    question: 'Can someone else drive the rental car?',
    answer:
      'Yes, but additional drivers must be listed on the rental agreement and meet the same age and licensing requirements. Extra fees may apply.',
  },
  {
    id: 'fb-8',
    question: 'Are pets allowed in the vehicle?',
    answer:
      'Pets are permitted, but a cleaning fee of two hundred dollars applies to cover cleaning and sanitising the vehicle after use.',
  },
];

export default async function FAQPage() {
  const published = await getPublishedFaqs();
  const faqs = published.length > 0 ? published : FALLBACK_FAQS;
  const usingFallback = published.length === 0;

  return (
    <>
      <PageHero
        index="04"
        overline="FAQs"
        title={
          <>
            Answers,
            <br />
            <span className="text-sand italic">before you ask.</span>
          </>
        }
        lede="The questions we are asked most often, answered plainly. If yours is not here, call us — we would rather answer it than have you guess."
      />

      <section>
        <div className="mx-auto w-full max-w-[1536px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <Reveal>
                  <SectionLabel index="A">{faqs.length} answers</SectionLabel>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-7 text-sm leading-relaxed text-stone">
                    {usingFallback
                      ? 'These are the standing answers for car rental. Each service page carries its own terms in full.'
                      : 'Published from the website CMS.'}
                  </p>
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="mt-8">
                    <Cta href="/contact" variant="outline">
                      Ask us something
                    </Cta>
                  </div>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-8 lg:col-start-5">
              <RevealGroup className="divide-y divide-line border-t border-line">
                {faqs.map((faq, i) => (
                  <RevealItem key={faq.id}>
                    <details className="group py-7" name="faq">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-8">
                        <span className="flex gap-5">
                          <span className="overline mt-2 text-stone tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-xl leading-snug text-ivory transition-colors duration-200 group-hover:text-sand sm:text-2xl">
                            {faq.question}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="relative mt-2 h-4 w-4 shrink-0 text-sand transition-transform duration-300 group-open:rotate-45"
                        >
                          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                          <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                        </span>
                      </summary>
                      <p className="mt-5 max-w-2xl pl-0 leading-relaxed text-stone sm:pl-12">
                        {faq.answer}
                      </p>
                    </details>
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