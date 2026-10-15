import type { MetadataRoute } from 'next';
import { divisions } from '@/lib/divisions';

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/businesses`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/quote`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/events`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/careers`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/quote/car-rental`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/quote/coaching`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/quote/custom-print`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/quote/dispatch`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/quote/entertainment`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms-conditions`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/refund-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/accessibility-statement`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const divisionRoutes: MetadataRoute.Sitemap = divisions.flatMap((division) => [
    { url: `${BASE}/services/${division.slug}`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/businesses/${division.slug}`, changeFrequency: 'monthly', priority: 0.7 },
  ]);

  return [...staticRoutes, ...divisionRoutes];
}