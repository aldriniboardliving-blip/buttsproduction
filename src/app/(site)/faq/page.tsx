import type { Metadata } from 'next';
import { PageHero } from '@/components/public/PageHero';
import { SectionLabel } from '@/components/public/SectionLabel';
import { Cta } from '@/components/public/Cta';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Answers to the questions we are asked most often about car rental, cleaning, print, dispatching and entertainment services.',
  alternates: { canonical: '/faq' },
};

const FAQS = [
  {
    q: 'What do I need to rent a car?',
    a: "You’ll need a valid driver’s licence — usually held for at least twelve months — a credit or debit card in the renter’s name, proof of identity such as a passport for international renters, and you must meet the minimum age requirement.",
  },
  {
    q: 'What is the minimum age to rent?',
    a: 'Twenty-one. Drivers under twenty-five may pay a young driver fee on some vehicles.',
  },
  {
    q: 'Is insurance included?',
    a: 'No. We offer insurance as a refundable add-on of one hundred dollars, or you can supply your own cover — the choice is yours at the time of booking.',
  },
  {
    q: 'Can I rent with a prepaid card?',
    a: 'No — we need a bank card in the renter’s name, and a larger deposit applies.',
  },
  {
    q: 'What fuel policy do you use?',
    a: 'Full-to-full. Please return the vehicle with a full tank; the fuel gauge at collection is recorded with the renter.',
  },
  {
    q: 'Can I return the car to a different location?',
    a: 'No. The vehicle must be returned to the pick-up location.',
  },
  {
    q: 'What happens if I return the car late?',
    a: 'Late returns may incur additional hourly or daily charges. There is a fifteen-minute grace period after the scheduled pick-up time for the reservation itself.',
  },
  {
    q: 'Is there a mileage limit?',
    a: 'Yes — one hundred and fifty miles per day is included. Excess mileage fees may apply, and unlimited mileage is available for an additional charge.',
  },
  {
    q: 'Can someone else drive the rental car?',
    a: 'Yes, but additional drivers must be listed on the rental agreement and meet the same age and licensing requirements. Extra fees may apply.',
  },
  {
    q: 'Are pets allowed in the vehicle?',
    a: 'Pets are permitted, but a cleaning fee of two hundred dollars applies to cover cleaning and sanitising the vehicle after use.',
  },
  {
    q: 'What happens if I lock my keys in the car?',
    a: 'A one hundred dollar pop-a-lock service fee applies. Please call us rather than attempting to open the vehicle yourself.',
  },
  {
    q: 'Can I jump-start the vehicle if the battery dies?',
    a: 'Please do not. Jump-starting is strictly prohibited. Contact Butts Productions headquarters or AAA roadside assistance so we can help safely — attempting repairs may incur additional fees or end the rental agreement.',
  },
];

export default function FAQPage() {
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
                  <SectionLabel index="A">{FAQS.length} answers</SectionLabel>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-7 text-sm leading-relaxed text-stone">
                    Most of these apply to car rental. Each service page carries
                    its own terms in full.
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
                {FAQS.map((faq, i) => (
                  <RevealItem key={faq.q}>
                    <details className="group py-7" name="faq">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-8">
                        <span className="flex gap-5">
                          <span className="overline mt-2 text-stone tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-xl leading-snug text-ivory transition-colors duration-200 group-hover:text-sand sm:text-2xl">
                            {faq.q}
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
                        {faq.a}
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