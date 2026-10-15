'use server';

import { dbConnect } from '@/lib/db';
import { failure, success, type ActionResult } from '@/lib/action-result';
import { SiteSettings, SETTINGS_KEY } from '@/server/models/SiteSettings';
import { authorize, toObjectId } from '@/server/lib/authorize';
import { recordAudit, revalidateContent } from '@/server/lib/audit';
import { settingsInputSchema, toFieldErrors } from './schemas';

export async function getSettingsFormValue(): Promise<ActionResult<Record<string, unknown>>> {
  const auth = await authorize('settings:read');
  if ('failure' in auth) return auth.failure;

  try {
    await dbConnect();
    const doc = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();

    if (!doc) {
      return success({
        siteName: '',
        siteDescription: '',
        tagline: '',
        phone: '',
        emergencyPhone: '',
        fax: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        hours: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
        defaultMetaTitle: '',
        defaultMetaDescription: '',
      });
    }

    const contact = doc.contact ?? {};
    const address = contact.address ?? {};

    return success({
      siteName: doc.siteName,
      siteDescription: doc.siteDescription,
      tagline: doc.tagline ?? '',
      phone: contact.phone ?? '',
      emergencyPhone: contact.emergencyPhone ?? '',
      fax: contact.fax ?? '',
      email: contact.email ?? '',
      street: address.street ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      zip: address.zip ?? '',
      hours: contact.hours ?? '',
      facebook: doc.socials?.facebook ?? '',
      instagram: doc.socials?.instagram ?? '',
      twitter: doc.socials?.twitter ?? '',
      linkedin: doc.socials?.linkedin ?? '',
      youtube: doc.socials?.youtube ?? '',
      defaultMetaTitle: doc.defaultMetaTitle ?? '',
      defaultMetaDescription: doc.defaultMetaDescription ?? '',
    });
  } catch (error) {
    console.error('[settings] load failed', error);
    return failure({ code: 'LIST_ERROR', message: 'Could not load settings' });
  }
}

export async function saveSettings(raw: unknown): Promise<ActionResult> {
  const auth = await authorize('settings:update');
  if ('failure' in auth) return auth.failure;

  const parsed = settingsInputSchema.safeParse(raw);
  if (!parsed.success) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields',
      fields: toFieldErrors(parsed.error),
    });
  }
  const input = parsed.data;

  try {
    await dbConnect();

    const doc = {
      key: SETTINGS_KEY,
      siteName: input.siteName,
      siteDescription: input.siteDescription,
      tagline: input.tagline || undefined,
      contact: {
        phone: input.phone || undefined,
        emergencyPhone: input.emergencyPhone || undefined,
        fax: input.fax || undefined,
        email: input.email || undefined,
        hours: input.hours || undefined,
        address: {
          street: input.street || undefined,
          city: input.city || undefined,
          state: input.state || undefined,
          zip: input.zip || undefined,
          country: 'US',
        },
      },
      socials: {
        facebook: input.facebook || undefined,
        instagram: input.instagram || undefined,
        twitter: input.twitter || undefined,
        linkedin: input.linkedin || undefined,
        youtube: input.youtube || undefined,
      },
      defaultMetaTitle: input.defaultMetaTitle || undefined,
      defaultMetaDescription: input.defaultMetaDescription || undefined,
      updatedBy: toObjectId(auth.session.userId) ?? undefined,
    };

    await SiteSettings.findOneAndUpdate({ key: SETTINGS_KEY }, { $set: doc }, { upsert: true, new: true });

    await recordAudit(auth.session, 'settings.update', 'SiteSettings', SETTINGS_KEY);

    revalidateContent({
      admin: ['/admin/settings', '/admin/dashboard'],
      listing: ['/', '/contact', '/about'],
    });

    return success(undefined);
  } catch (error) {
    console.error('[settings] save failed', error);
    return failure({ code: 'UPDATE_ERROR', message: 'Could not save settings' });
  }
}