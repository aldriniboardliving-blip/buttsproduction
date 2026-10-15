import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Butts Productions Inc. — Norfolk, VA',
    template: '%s | Butts Productions',
  },
  description:
    'A family-owned collection of Norfolk businesses: janitorial services, consulting, custom print, dispatching, car rentals, entertainment and community outreach.',
  applicationName: 'Butts Productions',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Butts Productions',
    locale: 'en_US',
    url: APP_URL,
    title: 'Butts Productions Inc. — Norfolk, VA',
    description:
      'A family-owned collection of Norfolk businesses serving the community for over fifteen years.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Butts Productions Inc. — Norfolk, VA',
    description:
      'A family-owned collection of Norfolk businesses serving the community for over fifteen years.',
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: '#171916',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-svh bg-ink text-ivory antialiased">{children}</body>
    </html>
  );
}