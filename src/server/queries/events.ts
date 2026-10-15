import 'server-only';

import { dbConnect } from '@/lib/db';
import { connection } from 'next/server';
import { Event, eventPhase, type EventPhase } from '@/server/models/Event';

const PUBLISHED = { published: true, archivedAt: { $exists: false } } as const;

export interface PublicEvent {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  address?: string;
  registrationUrl?: string;
  featured: boolean;
  phase: EventPhase;
  bannerUrl?: string;
}

interface LeanEvent {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  venue?: string;
  address?: string;
  registrationUrl?: string;
  featured: boolean;
  bannerImage?: { secureUrl?: string } | null;
}

function toPublic(doc: LeanEvent): PublicEvent {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    description: doc.description,
    startDate: new Date(doc.startDate).toISOString(),
    endDate: doc.endDate ? new Date(doc.endDate).toISOString() : undefined,
    venue: doc.venue,
    address: doc.address,
    registrationUrl: doc.registrationUrl,
    featured: Boolean(doc.featured),
    phase: eventPhase({ startDate: doc.startDate, endDate: doc.endDate }),
    bannerUrl: doc.bannerImage?.secureUrl,
  };
}

async function query(filter: Record<string, unknown>, sort: Record<string, 1 | -1>) {
  await dbConnect();
  return Event.find({ ...PUBLISHED, ...filter })
    .populate('bannerImage', 'secureUrl alt')
    .select('name slug shortDescription description startDate endDate venue address registrationUrl featured bannerImage')
    .sort(sort)
    .lean() as unknown as Promise<LeanEvent[]>;
}

export async function getPublishedEvents(): Promise<PublicEvent[]> {
  await connection();
  try {
    const docs = await query({}, { startDate: -1 });
    return docs.map(toPublic);
  } catch (error) {
    console.error('[events] failed to load public events', error);
    return [];
  }
}

export async function getUpcomingEvents(limit = 3): Promise<PublicEvent[]> {
  await connection();
  try {
    const docs = await query({ startDate: { $gte: new Date() } }, { startDate: 1 });
    return docs.slice(0, limit).map(toPublic);
  } catch (error) {
    console.error('[events] failed to load upcoming events', error);
    return [];
  }
}

export async function getPublishedEventBySlug(slug: string): Promise<PublicEvent | null> {
  await connection();
  try {
    const docs = await query({ slug }, { startDate: 1 });
    return docs[0] ? toPublic(docs[0]) : null;
  } catch (error) {
    console.error('[events] failed to load event', slug, error);
    return null;
  }
}

export async function getPublishedEventSlugs(): Promise<string[]> {
  await connection();
  try {
    await dbConnect();
    return await Event.find(PUBLISHED).select('slug').lean().then((docs) =>
      docs.map((doc) => doc.slug),
    );
  } catch (error) {
    console.error('[events] failed to load slugs for sitemap', error);
    return [];
  }
}