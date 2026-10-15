import type { Metadata } from 'next';
import { QuoteDetail } from '@/components/public/QuoteDetail';

export const metadata: Metadata = {
  title: 'Entertainment Quote',
  description:
    'DJ services with DJ PHARFETCHED, tent and event equipment rentals from Kleen Team Entertainment. From $300 per two-hour booking.',
  alternates: { canonical: '/quote/entertainment' },
};

export default function EntertainmentQuotePage() {
  return (
    <QuoteDetail
      index={5}
      service={{
        slug: 'entertainment',
        title: 'Entertainment',
        lede: 'Book a DJ, or rent tents for your next event. Kleen Team Entertainment brings the energy and the equipment.',
        price: '$300',
        unit: 'per two-hour booking',
        relatedSlug: 'kleen-team-entertainment',
        includes: [
          'Two-hour DJ set with DJ PHARFETCHED',
          'Tent rentals for any occasion',
          'Sound system and speaker setup',
          'Lighting',
          'Custom packages for weddings, parties and corporate events',
        ],
        terms: [
          {
            heading: 'Availability',
            points: [
              'Dates are confirmed by phone or email and held once a deposit is received.',
              'Weekends and June through August book out early — ask well in advance.',
            ],
          },
          {
            heading: 'Booking and deposit',
            points: [
              'A deposit secures your date; the balance is due on the day of the event.',
              'Deposits are non-refundable inside seventy-two hours of the event date.',
              'We will confirm total cost in writing, including travel, setup and teardown.',
            ],
          },
          {
            heading: 'On the day',
            points: [
              'Setup begins before your stated start time so music begins when you need it to.',
              'Please confirm the venue, load-in access and power availability when booking.',
            ],
          },
        ],
      }}
    />
  );
}