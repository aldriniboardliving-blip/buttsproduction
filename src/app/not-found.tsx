import type { Metadata } from 'next';
import Link from 'next/link';

// With `cacheComponents` the static shell (header/footer) is committed with a
// 200 before the page can throw, so a not-found page can still be served with
// 200. Blocking indexing here prevents those responses entering search indexes.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

const SUGGESTIONS = [
  { label: 'Services', href: '/services' },
  { label: 'Businesses', href: '/businesses' },
  { label: 'Request a quote', href: '/quote' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFound() {
  return (
    <div className="grain wash-strong relative isolate flex min-h-svh flex-col justify-center overflow-hidden">
      <div className="grid-fine absolute inset-0 -z-10 opacity-50" />

      <div className="mx-auto w-full max-w-[1536px] px-5 py-32 sm:px-8 lg:px-12">
        <p className="overline text-sand">Error 404</p>

        <h1 className="mt-8 text-display-2xl text-ivory">
          This page took
          <br />
          <span className="text-sand italic">a different route.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-stone">
          The page you were looking for isn&apos;t here. It may have moved, or
          the address may be slightly off. Here are some places that definitely
          exist.
        </p>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion.href}>
              <Link
                href={suggestion.href}
                className="link-underline text-sm text-ivory/80 transition-colors duration-200 hover:text-sand"
              >
                {suggestion.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-sand px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ivory"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}