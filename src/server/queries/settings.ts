import 'server-only';

import { dbConnect } from '@/lib/db';
import { connection } from 'next/server';
import { SiteSettings, SETTINGS_KEY } from '@/server/models/SiteSettings';

export interface PublicSiteSettings {
  siteName: string;
  siteDescription: string;
  tagline?: string;
  phone?: string;
  emergencyPhone?: string;
  fax?: string;
  email?: string;
  address?: { street?: string; city?: string; state?: string; zip?: string; country?: string };
  hours?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
}

/** Hardcoded contact details used when no settings document exists yet. */
const DEFAULT_SETTINGS: PublicSiteSettings = {
  siteName: 'Butts Productions Inc.',
  siteDescription: 'A family-owned collection of Norfolk businesses serving the community for over fifteen years.',
  phone: '1-866-454-7033',
  emergencyPhone: '757-900-9914',
  fax: '757-295-8107',
  email: 'info@buttsproductions.com',
  address: {
    street: '848 Granby St. Suite 203',
    city: 'Norfolk',
    state: 'VA',
    zip: '23510',
    country: 'US',
  },
  hours: 'Monday – Saturday · 9:00am – 9:00pm',
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61574100779353',
    instagram: 'https://www.instagram.com/butts_productions',
  },
};

/**
 * Site-wide settings for public rendering.
 *
 * Falls back to the defaults when the collection is empty (a fresh install)
 * or unreachable. Never returns credentials — only presentational values.
 */
export async function getSiteSettings(): Promise<PublicSiteSettings> {
  await connection();
  try {
    await dbConnect();
    const doc = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();

    if (!doc) return DEFAULT_SETTINGS;

    const contact = doc.contact ?? {};
    const address = contact.address ?? {};

    return {
      siteName: doc.siteName,
      siteDescription: doc.siteDescription,
      tagline: doc.tagline ?? undefined,
      phone: contact.phone ?? undefined,
      emergencyPhone: contact.emergencyPhone ?? undefined,
      fax: contact.fax ?? undefined,
      email: contact.email ?? undefined,
      address: {
        street: address.street ?? undefined,
        city: address.city ?? undefined,
        state: address.state ?? undefined,
        zip: address.zip ?? undefined,
        country: address.country ?? undefined,
      },
      hours: contact.hours ?? undefined,
      socials: {
        facebook: doc.socials?.facebook ?? undefined,
        instagram: doc.socials?.instagram ?? undefined,
        twitter: doc.socials?.twitter ?? undefined,
        linkedin: doc.socials?.linkedin ?? undefined,
        youtube: doc.socials?.youtube ?? undefined,
      },
      defaultMetaTitle: doc.defaultMetaTitle ?? undefined,
      defaultMetaDescription: doc.defaultMetaDescription ?? undefined,
    };
  } catch (error) {
    console.error('[settings] failed to load site settings, using defaults', error);
    return DEFAULT_SETTINGS;
  }
}