import Link from 'next/link';

const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Car Rental', href: '/quote/car-rental' },
    { label: 'Dispatch', href: '/quote/dispatch' },
    { label: 'Consulting', href: '/quote/coaching' },
    { label: 'Custom Print', href: '/quote/custom-print' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Accessibility', href: '/accessibility-statement' },
  ],
};

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.058 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" strokeWidth="2" />
    <circle cx="18" cy="6" r="1.5" strokeWidth="2" />
  </svg>
);

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61574100779353', Icon: FacebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/butts_productions', Icon: InstagramIcon },
];

export function PublicFooter() {
  return (
    <footer className="bg-neutral-900 text-neutral-300" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold text-white" aria-label="Butts Productions Home">
              Butts Productions
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Family-owned business providing diverse services to the community for over 15 years.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p>info@buttsproductions.com</p>
              <p>1-866-454-7033 (24/7)</p>
              <p>757-900-9914 (Local)</p>
              <p>848 Granby St. Suite 203, Norfolk, VA 23510</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © 2026 Butts Productions Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}