import { LegalDocument, legalMetadata } from '@/components/public/LegalDocument';

export const metadata = legalMetadata(
  'Terms & Conditions',
  'The terms that apply when you use any Butts Productions Inc. service.',
  '/terms-conditions',
);

export default function TermsConditionsPage() {
  return (
    <LegalDocument
      index="02"
      overline="Legal"
      title="Terms & Conditions"
      lede="By using the services provided by Butts Productions Inc. you agree to the terms below. Service-specific terms — such as car rental conditions — appear on the relevant service page."
      updated="2026"
      sections={[
        {
          heading: 'About these terms',
          paragraphs: [
            'These terms apply to all divisions of Butts Productions Inc. together with any terms specific to the service you have booked. Where a service page states additional terms, those terms apply in addition to these.',
          ],
        },
        {
          heading: 'Bookings and payment',
          paragraphs: [
            'Bookings are confirmed on receipt of the stated deposit or payment. Prices shown on the site are starting prices and may vary with the specifics of a job; we will always confirm a price with you before work begins.',
          ],
          list: [
            'All bookings are subject to availability.',
            'Prices and terms may change without notice.',
            'A confirmed booking requires a deposit where the service states one.',
          ],
        },
        {
          heading: 'Your responsibilities',
          paragraphs: [
            'When you give us access to your property, your vehicle, your brand or your event, we ask that you provide accurate information and that an authorised representative is available on the day.',
          ],
          list: [
            'Information you provide must be accurate and complete.',
            'You must confirm any permits, licences or insurance required for the work.',
            'You must inform us in advance of any site-specific rules or risks.',
          ],
        },
        {
          heading: 'Changes and cancellations',
          paragraphs: [
            'Cancellation windows differ by service and are stated on that service’s page. Where a service does not state a window, changes or cancellations made at least twenty-four hours before the scheduled start carry no penalty.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'We carry out our work with reasonable skill and care. Except where a service page says otherwise, we are not liable for indirect or consequential loss, and nothing in these terms limits liability that cannot lawfully be limited.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'We do not work on anything unlawful, and we do not assist with any request that would harm an individual or misrepresent a client. We may decline or discontinue any engagement where we reasonably believe these terms have been breached.',
          ],
        },
        {
          heading: 'Governing law',
          paragraphs: [
            'These terms are governed by the laws of the Commonwealth of Virginia, and the courts of Norfolk, Virginia have jurisdiction over any dispute arising from them.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions about these terms can be sent to info@buttsproductions.com or raised on 1-866-454-7033.',
          ],
        },
      ]}
    />
  );
}