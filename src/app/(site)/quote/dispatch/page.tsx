import type { Metadata } from 'next';
import { QuoteDetail } from '@/components/public/QuoteDetail';

export const metadata: Metadata = {
  title: 'Dispatch Quote',
  description:
    'Dispatching services from Butts Productions Inc. — "We dispatch. You Drive!" Loads and logistics for independent truckers.',
  alternates: { canonical: '/quote/dispatch' },
};

export default function DispatchQuotePage() {
  return (
    <QuoteDetail
      index={4}
      service={{
        slug: 'dispatch',
        title: 'Dispatching',
        lede: '“We dispatch. You Drive!” We handle the loads, the paperwork and the logistics so you can stay focused on the road and the work that pays.',
        price: '$100',
        unit: 'per dispatch engagement',
        relatedSlug: 'dispatching',
        includes: [
          'Load matching suited to your equipment and lanes',
          'Rate negotiation with the broker or shipper',
          'Paperwork, confirmations and documentation handling',
          '24/7 dispatch availability',
          'Support for single drivers and small fleets',
        ],
        terms: [
          {
            heading: 'Getting started',
            points: [
              'Call or email with your equipment type, preferred lanes and any restrictions.',
              'We will confirm how we work together before your first load.',
              'There is no sign-up fee.',
            ],
          },
          {
            heading: 'Rates',
            points: [
              'Dispatching fees are quoted per engagement and confirmed up front.',
              'We will always tell you the rate before you commit to a load.',
              'Rates depend on lane, equipment and timing — quoted per job.',
            ],
          },
          {
            heading: 'Compliance',
            points: [
              'You remain responsible for your own authority, insurance and hours-of-service compliance.',
              'We handle load matching and broker communication.',
            ],
          },
        ],
      }}
    />
  );
}