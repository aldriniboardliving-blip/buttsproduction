import { LegalDocument, legalMetadata } from '@/components/public/LegalDocument';

export const metadata = legalMetadata(
  'Privacy Policy',
  'How Butts Productions Inc. collects, uses and protects your personal information.',
  '/privacy-policy',
);

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      index="01"
      overline="Legal"
      title="Privacy Policy"
      lede="Your privacy matters to us. This policy explains what we collect, why we collect it, and what we will never do with it."
      updated="2026"
      sections={[
        {
          heading: 'Information we collect',
          paragraphs: [
            'We collect only the information we need in order to serve you. Depending on how you interact with us, that may include:',
          ],
          list: [
            'Contact details you provide, such as your name, email address and phone number.',
            'Rental details, including your driver’s licence, insurance information and payment method.',
            'Enquiry details submitted through our quote and contact channels.',
            'Basic technical information such as browser type and pages visited.',
          ],
        },
        {
          heading: 'How we use your information',
          paragraphs: [
            'We use your information to provide and improve our services, to process transactions and bookings, to communicate with you about an enquiry or rental, and — only where you have asked for it — to send occasional updates.',
            'We do not sell your personal information. We do not share it with third parties for their own marketing.',
          ],
        },
        {
          heading: 'Payments',
          paragraphs: [
            'Payments are processed through established third-party providers. We receive limited payment confirmation information (for example a card brand and the last four digits) and never store full card details on our systems.',
          ],
        },
        {
          heading: 'Data security',
          paragraphs: [
            'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, loss or disclosure. Admin credentials are hashed with Argon2id and session tokens are stored as one-way hashes.',
          ],
        },
        {
          heading: 'Data retention',
          paragraphs: [
            'We keep personal information only for as long as it is needed for the purpose it was collected, or as required by law. Session records and audit logs are automatically cleared after their respective retention periods.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You may ask us to confirm what personal information we hold about you, request a copy, ask us to correct inaccuracies, or ask us to delete information we no longer have a reason to keep. Contact us using the details below and we will respond as quickly as we can.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'We use a small number of cookies required for the site to function — in particular an administrative session cookie and a CSRF token. These are strictly necessary and are not used for advertising or cross-site tracking.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Butts Productions Inc.',
            '848 Granby St. Suite 203, Norfolk, VA 23510',
            'info@buttsproductions.com · 1-866-454-7033',
          ],
        },
      ]}
    />
  );
}