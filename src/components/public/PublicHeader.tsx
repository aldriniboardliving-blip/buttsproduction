import Link from 'next/link';
import { Navigation } from './Navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  {
    label: 'Services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'Businesses', href: '/businesses' },
    ],
  },
  { href: '/quote', label: 'Get a Quote' },
  { href: '/events', label: 'Events' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-neutral-900" aria-label="Butts Productions Home">
              Butts Productions
            </Link>
          </div>

          <Navigation navItems={navItems} />

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link
              href="/quote"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Get a Quote
            </Link>
          </div>

          <MobileMenuButton />
        </div>
      </nav>
    </header>
  );
}

function MobileMenuButton() {
  return (
    <button
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
      aria-label="Toggle menu"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}