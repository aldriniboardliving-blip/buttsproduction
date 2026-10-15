import { LegalDocument, legalMetadata } from '@/components/public/LegalDocument';

export const metadata = legalMetadata(
  'Accessibility Statement',
  'Butts Productions Inc. commitment to making this website usable by everyone.',
  '/accessibility-statement',
);

export default function AccessibilityStatementPage() {
  return (
    <LegalDocument
      index="04"
      overline="Legal"
      title="Accessibility Statement"
      lede="We are committed to making this website usable by as many people as possible, regardless of technology or ability."
      updated="2026"
      sections={[
        {
          heading: 'Our commitment',
          paragraphs: [
            'Butts Productions Inc. aims to conform to the Web Content Accessibility Guidelines (WCAG) at Level AA. Accessibility is treated as an ongoing practice rather than a one-off audit, and we review changes to this site against these guidelines before they go live.',
          ],
        },
        {
          heading: 'What we have done',
          paragraphs: [
            'This site is built to work with assistive technology from the ground up rather than being retrofitted.',
          ],
          list: [
            'Semantic HTML with a logical heading structure on every page.',
            'Visible keyboard focus indicators and full keyboard operability, including menus and dropdowns.',
            'Text and interface colours chosen to meet contrast requirements.',
            'Descriptive alternative text on meaningful imagery; decorative treatments are hidden from screen readers.',
            'Responsive layouts that reflow at narrow widths without horizontal scrolling.',
            'A skip link so keyboard users can bypass the navigation.',
            'Animation that respects your system’s reduced-motion preference.',
          ],
        },
        {
          heading: 'Known limitations',
          paragraphs: [
            'Some older third-party content may not yet meet our current standard. Where we are aware of a problem we are working to correct it.',
          ],
        },
        {
          heading: 'Tell us if something is wrong',
          paragraphs: [
            'If you encounter a barrier anywhere on this site, please tell us. Include the page address, what you were trying to do and the browser or assistive technology you were using, and we will get it looked at.',
            'We aim to acknowledge accessibility reports within two business days.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Accessibility enquiries: info@buttsproductions.com or 1-866-454-7033.',
            'Alternatively write to us at 848 Granby St. Suite 203, Norfolk, VA 23510.',
          ],
        },
      ]}
    />
  );
}