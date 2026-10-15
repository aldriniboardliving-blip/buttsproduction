import type { Metadata } from 'next';
import { QuoteDetail } from '@/components/public/QuoteDetail';

export const metadata: Metadata = {
  title: 'Consulting Quote',
  description:
    'Two-hour consulting sessions with Butts Productions Consulting. $145 per session, virtual or in person.',
  alternates: { canonical: '/quote/coaching' },
};

export default function CoachingQuotePage() {
  return (
    <QuoteDetail
      index={2}
      service={{
        slug: 'coaching',
        title: 'Consulting',
        lede: 'Preparing you and your next big business venture. Creative consulting that helps businesses sharpen their brand and their content.',
        price: '$145',
        unit: 'per two-hour session',
        relatedSlug: 'butts-consulting',
        includes: [
          'A two-hour working session, in person or virtual',
          'Creative and brand strategy review',
          'Media production planning',
          'Digital marketing direction',
          'Brand identity development guidance',
          'Event planning advice',
          'A written summary of agreed next steps',
        ],
        terms: [
          {
            heading: 'Sessions',
            points: [
              'Sessions run two hours. Longer engagements can be arranged as consecutive sessions.',
              'Virtual sessions are available; in-person sessions run at our Norfolk office.',
              'We will confirm the agenda with you before the session begins so the time is used well.',
            ],
          },
          {
            heading: 'Booking and payment',
            points: [
              'Payment is due at the time of booking to secure the date.',
              'Rescheduling is free up to twenty-four hours before the session.',
              'Cancellations inside twenty-four hours are non-refundable, but may be rescheduled once.',
            ],
          },
          {
            heading: 'What we need from you',
            points: [
              'An honest account of where the business is now and where you want it to be.',
              'Any existing brand material you want us to work from.',
              'Access to the right people if we need to speak to your team.',
            ],
          },
        ],
      }}
    />
  );
}