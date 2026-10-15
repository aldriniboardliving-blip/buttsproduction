import type { MetadataRoute } from 'next';
import { getPublicDivisions } from '@/server/queries/divisions';
import { getPublishedEventSlugs } from '@/server/queries/events';
import { getPublishedProducts } from '@/server/queries/content';

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [divisionResult, eventSlugs, products] = await Promise.all([
    getPublicDivisions(),
    getPublishedEventSlugs(),
    getPublishedProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/businesses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/products`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/quote`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/events`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: 'yearly', priority: 0.7 },
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

  // Only published records reach here: the query layer filters drafts,
  // archived and noindex content before it is ever returned.
  const divisionRoutes: MetadataRoute.Sitemap = divisionResult.divisions.flatMap((division) => [
    { url: `${BASE}/services/${division.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/businesses/${division.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]);

  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${BASE}/events/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE}/products/${product.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...divisionRoutes, ...eventRoutes, ...productRoutes];
}