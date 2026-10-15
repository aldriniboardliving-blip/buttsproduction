import type { Metadata } from 'next';
import { QuoteDetail } from '@/components/public/QuoteDetail';

export const metadata: Metadata = {
  title: 'Custom Print Quote',
  description:
    'Custom printing, design and branded materials from Kleen Prints Ink. Virtual design consultation $50 per hour.',
  alternates: { canonical: '/quote/custom-print' },
};

export default function CustomPrintQuotePage() {
  return (
    <QuoteDetail
      index={3}
      service={{
        slug: 'custom-print',
        title: 'Custom Print',
        lede: 'Business cards, banners, apparel and promotional items — designed by our design director and produced to a proper standard.',
        price: '$50',
        unit: 'per one-hour design consultation',
        relatedSlug: 'kleen-prints-ink',
        includes: [
          'One-hour virtual design consultation with Maria Vacal, Design Director',
          'Design review of your existing brand material',
          'Preparation files for print',
          'Business cards, flyers and brochures',
          'Banners, signs and promotional items',
          'Custom apparel and branded merchandise',
        ],
        terms: [
          {
            heading: 'Consultations',
            points: [
              'The consultation is one hour and runs remotely.',
              'We will review your current material and agree a direction before anything goes to print.',
              'Printing costs are quoted separately and confirmed in writing before production.',
            ],
          },
          {
            heading: 'Turnaround',
            points: [
              'Standard print runs are typically completed within five to seven business days of artwork approval.',
              'Rush turnaround is available on most items — mention it when you call.',
            ],
          },
          {
            heading: 'Artwork',
            points: [
              'Final artwork is approved by you before production begins.',
              'Please supply any logos or imagery you own in the highest quality available.',
            ],
          },
        ],
      }}
    />
  );
}