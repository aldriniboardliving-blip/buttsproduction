import Link from 'next/link';
import { divisions } from '@/lib/divisions';
import { Wordmark } from './PublicHeader';
import { Cta } from './Cta';

const CONTACT = [
  { label: 'Toll free (24/7)', value: '1-866-454-7033', href: 'tel:+18664547033' },
  { label: 'Local', value: '757-900-9914', href: 'tel:+17579009914' },
  { label: 'Fax', value: '757-295-8107', href: 'tel:+17572958107' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61574100779353',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24.1v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8v8.44C19.61 23.1 24 18.1 24 12.07z',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/butts_productions',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z',
  },
];

// Evaluated once per build rather than per render, so prerendering stays
// deterministic under `cacheComponents`.
const COPYRIGHT_YEAR = new Date().getFullYear();

export function PublicFooter() {
  return (
    <footer className="grain wash relative isolate overflow-hidden border-t border-line">
      <div className="grid-fine absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-4">
            <Wordmark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone">
              A family-owned collection of businesses serving Norfolk and the
              surrounding community for over fifteen years.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-stone">
              848 Granby St. Suite 203
              <br />
              Norfolk, VA 23510
            </p>

            <div className="mt-8 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid h-10 w-10 place-items-center border border-line text-stone transition-colors duration-200 hover:border-sand hover:text-sand"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Company">
            <h2 className="overline text-sand">Company</h2>
            <ul className="mt-6 space-y-3.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Businesses', href: '/businesses' },
                { label: 'Careers', href: '/careers' },
                { label: 'Events', href: '/events' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/70 transition-colors duration-200 hover:text-sand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label="Divisions">
            <h2 className="overline text-sand">Divisions</h2>
            <ul className="mt-6 space-y-3.5">
              {divisions.map((division) => (
                <li key={division.slug}>
                  <Link
                    href={`/businesses/${division.slug}`}
                    className="text-sm text-ivory/70 transition-colors duration-200 hover:text-sand"
                  >
                    {division.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="overline text-sand">Get in touch</h2>
            <ul className="mt-6 space-y-3.5">
              {CONTACT.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group block text-sm text-ivory/70 transition-colors duration-200 hover:text-sand"
                  >
                    <span className="overline block text-[9px] text-stone">{item.label}</span>
                    <span className="mt-1 block tabular-nums">{item.value}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:info@buttsproductions.com"
                  className="text-sm text-ivory/70 transition-colors duration-200 hover:text-sand"
                >
                  info@buttsproductions.com
                </a>
              </li>
            </ul>

            <Cta href="/quote" variant="sand" className="mt-8 w-full justify-center">
              Request a quote
            </Cta>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {COPYRIGHT_YEAR} Butts Productions Inc. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms & Conditions', href: '/terms-conditions' },
              { label: 'Refund Policy', href: '/refund-policy' },
              { label: 'Accessibility', href: '/accessibility-statement' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors duration-200 hover:text-sand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}