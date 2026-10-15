import 'server-only';

import { connection } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Business } from '@/server/models/Business';
import { Service } from '@/server/models/Service';
import { divisions as fallbackDivisions, type Division } from '@/lib/divisions';

export type DivisionSource = 'database' | 'fallback';

export interface PublicDivision extends Division {
  source: DivisionSource;
  updatedAt?: string;
}

export interface DivisionQueryResult {
  divisions: PublicDivision[];
  /** False when the database could not be reached and fallback was used. */
  dbAvailable: boolean;
  /** Slugs served purely from the hardcoded fallback. */
  fallbackSlugs: string[];
}

const PUBLISHED = { published: true, archivedAt: { $exists: false } } as const;

/**
 * Derives display fields the `Division` shape needs from a lean Mongoose doc.
 *
 * `highlights` is presentation copy that only exists in the fallback dataset;
 * a database-backed division falls back to its own short description so the
 * detail page always has a populated list.
 */
function fromBusiness(doc: Record<string, unknown>): Division {
  const contact = (doc.contact ?? {}) as Record<string, unknown>;
  const address = (contact.address ?? {}) as Record<string, unknown>;
  const socials = (doc.social ?? {}) as Record<string, string | undefined>;
  const phone = typeof contact.phone === 'string' ? contact.phone : undefined;

  const highlights = [
    doc.shortDescription ? String(doc.shortDescription) : undefined,
    contact.email ? `Email: ${contact.email}` : undefined,
    phone ? `Telephone: ${phone}` : undefined,
    address.city ? `Based in ${[address.city, address.state].filter(Boolean).join(', ')}` : undefined,
    socials.facebook ? 'Active on Facebook' : undefined,
    socials.instagram ? 'Active on Instagram' : undefined,
  ].filter((value): value is string => Boolean(value));

  return {
    slug: String(doc.slug),
    name: String(doc.name),
    shortDescription: String(doc.shortDescription ?? ''),
    description: String(doc.description ?? doc.shortDescription ?? ''),
    highlights,
  };
}

function fromService(doc: Record<string, unknown>): Division {
  const pricing = (doc.pricing ?? {}) as Record<string, unknown>;
  const amount = typeof pricing.amount === 'number' ? pricing.amount : undefined;
  const unit = typeof pricing.unit === 'string' ? pricing.unit : undefined;
  const label =
    unit && unit !== 'custom' ? unit.replace('per_', 'per ') : 'per session';

  const highlights = [
    doc.duration ? `Typical duration: ${doc.duration}` : undefined,
    amount !== undefined ? `From $${amount} ${label}` : undefined,
    typeof doc.locationType === 'string'
      ? `Location: ${doc.locationType.replace(/_/g, ' ')}`
      : undefined,
    doc.featured ? 'Featured service' : undefined,
  ].filter((value): value is string => Boolean(value));

  return {
    slug: String(doc.slug),
    name: String(doc.name),
    shortDescription: String(doc.shortDescription ?? ''),
    description: String(doc.description ?? doc.shortDescription ?? ''),
    price: amount,
    duration: typeof doc.duration === 'string' ? doc.duration : undefined,
    highlights,
  };
}

async function loadPublished(): Promise<{ businesses: Record<string, unknown>[]; services: Record<string, unknown>[] } | null> {
  try {
    // Marks the route as request-time rendered so published content is never
    // baked into a prerendered page and go stale after an admin edit.
    await dbConnect();

    const [businesses, services] = await Promise.all([
      Business.find(PUBLISHED)
        .select('name slug shortDescription description contact social featured updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      Service.find(PUBLISHED)
        .select('name slug shortDescription description pricing duration locationType featured updatedAt')
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
    ]);

    return {
      businesses: businesses as unknown as Record<string, unknown>[],
      services: services as unknown as Record<string, unknown>[],
    };
  } catch (error) {
    // Surfaced loudly on the server so an operator can see the database is
    // not actually working — the fallback below must not mask this.
    console.error(
      '[divisions] database unavailable, serving hardcoded fallback content',
      error,
    );
    return null;
  }
}

/**
 * Public list of divisions for `/services` and `/businesses`.
 *
 * Merges published database records over the hardcoded `divisions.ts` set,
 * matching on slug so an entity can never appear twice. Unpublished and
 * archived records are excluded by the query, never by post-filtering.
 */
export async function getPublicDivisions(): Promise<DivisionQueryResult> {
  await connection();
  const published = await loadPublished();

  if (!published) {
    return {
      divisions: fallbackDivisions.map((division) => ({ ...division, source: 'fallback' as const })),
      dbAvailable: false,
      fallbackSlugs: fallbackDivisions.map((division) => division.slug),
    };
  }

  const overrides = new Map<string, { division: Division; updatedAt?: string }>();

  for (const business of published.businesses) {
    const division = fromBusiness(business);
    overrides.set(division.slug, {
      division,
      updatedAt: business.updatedAt ? String(business.updatedAt) : undefined,
    });
  }
  for (const service of published.services) {
    const division = fromService(service);
    overrides.set(division.slug, {
      division,
      updatedAt: service.updatedAt ? String(service.updatedAt) : undefined,
    });
  }

  // Preserve the curated ordering of the fallback dataset for slugs it knows,
  // then append any database-only entries in the order the database returned.
  const merged: PublicDivision[] = [];
  const consumed = new Set<string>();

  for (const fallback of fallbackDivisions) {
    const override = overrides.get(fallback.slug);
    if (override) {
      merged.push({
        // Fallback-only presentation fields survive; content fields are DB-owned.
        ...fallback,
        ...override.division,
        price: override.division.price ?? fallback.price,
        duration: override.division.duration ?? fallback.duration,
        highlights: override.division.highlights.length
          ? override.division.highlights
          : fallback.highlights,
        source: 'database',
        updatedAt: override.updatedAt,
      });
    } else {
      merged.push({ ...fallback, source: 'fallback' });
    }
    consumed.add(fallback.slug);
  }

  for (const [slug, override] of overrides) {
    if (consumed.has(slug)) continue;
    merged.push({
      ...override.division,
      highlights: override.division.highlights.length ? override.division.highlights : [override.division.shortDescription],
      source: 'database',
      updatedAt: override.updatedAt,
    });
  }

  return {
    divisions: merged,
    dbAvailable: true,
    fallbackSlugs: merged.filter((d) => d.source === 'fallback').map((d) => d.slug),
  };
}

/** Single division by slug. Database first, then the fallback dataset. */
export async function getPublicDivision(slug: string): Promise<PublicDivision | null> {
  await connection();
  const { divisions: all } = await getPublicDivisions();
  return all.find((division) => division.slug === slug) ?? null;
}

/** Only the slugs the database currently backs — used by the sitemap. */
export async function getDatabaseBackedSlugs(): Promise<Set<string>> {
  await connection();
  const published = await loadPublished();
  if (!published) return new Set();
  return new Set([
    ...published.businesses.map((doc) => String(doc.slug)),
    ...published.services.map((doc) => String(doc.slug)),
  ]);
}