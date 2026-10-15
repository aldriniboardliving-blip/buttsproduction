import { LegalDocument, legalMetadata } from '@/components/public/LegalDocument';

export const metadata = legalMetadata(
  'Refund Policy',
  'Refund and cancellation terms for Butts Productions Inc. services, including car rentals.',
  '/refund-policy',
);

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      index="03"
      overline="Legal"
      title="Refund Policy"
      lede="We want you to be confident before you book, and we want the process to be straightforward if something changes."
      updated="2026"
      sections={[
        {
          heading: 'Car rentals',
          paragraphs: [
            'Cancellations made twenty-four hours or more before the scheduled pick-up time are eligible for a full refund of amounts paid.',
            'Cancellations made within twenty-four hours of the scheduled pick-up time are not eligible for a partial refund. As a gesture of goodwill we will apply a ten per cent discount to your next rental booking.',
            'There is a fifteen-minute grace period after the scheduled pick-up time. After that the reservation is released and no refund is issued, even where you have told us you are running late.',
          ],
        },
        {
          heading: 'Other services',
          paragraphs: [
            'Refund eligibility for consulting, janitorial, print and entertainment work depends on the stage the job has reached. We will always tell you the position before you commit to a booking.',
          ],
          list: [
            'Work not yet started can normally be cancelled in full.',
            'Work already scheduled but not begun is subject to a scheduling fee.',
            'Work already in progress is non-refundable, but unused time can be rescheduled.',
            'Completed work is non-refundable.',
          ],
        },
        {
          heading: 'Refusable deposits',
          paragraphs: [
            'The one hundred dollar car rental deposit is refundable in full on return of the vehicle, subject to the condition check. It is not a charge for the rental itself.',
          ],
        },
        {
          heading: 'Processing',
          paragraphs: [
            'Approved refunds are returned to the original payment method and normally settle within five to ten business days, depending on your bank.',
          ],
        },
        {
          heading: 'If something went wrong',
          paragraphs: [
            'If a service was not delivered as agreed, contact us as soon as possible with the details. We would always rather resolve a problem than argue about a policy, and we will put it in writing.',
          ],
        },
      ]}
    />
  );
}