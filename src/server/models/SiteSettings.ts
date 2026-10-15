import { Schema, model, models, type Types } from 'mongoose';

/**
 * Singleton site-wide settings document.
 *
 * Only non-secret, publicly-presentable values live here. Credentials
 * (MongoDB, Cloudinary, session secret, SMTP keys) stay in the environment
 * and must never be written to this collection.
 */
export interface ISiteSettings {
  _id: Types.ObjectId;
  /** Always 'default' — enforces a single document. */
  key: 'default';
  siteName: string;
  siteDescription: string;
  tagline?: string;
  logo?: Types.ObjectId;
  favicon?: Types.ObjectId;
  ogImage?: Types.ObjectId;
  contact: {
    phone?: string;
    emergencyPhone?: string;
    fax?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    hours?: string;
  };
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  /** Maintained by the sitemap/queries layer, not editable by hand. */
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false },
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, enum: ['default'], default: 'default' },
    siteName: { type: String, required: true, trim: true, maxlength: 120 },
    siteDescription: { type: String, required: true, trim: true, maxlength: 300 },
    tagline: { type: String, trim: true, maxlength: 160 },
    logo: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    favicon: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    ogImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    contact: {
      phone: { type: String, trim: true },
      emergencyPhone: { type: String, trim: true },
      fax: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: AddressSchema, default: () => ({}) },
      hours: { type: String, trim: true },
    },
    socials: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },
    defaultMetaTitle: { type: String, trim: true, maxlength: 70 },
    defaultMetaDescription: { type: String, trim: true, maxlength: 170 },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

export const SETTINGS_KEY = 'default' as const;

export const SiteSettings =
  models.SiteSettings || model<ISiteSettings>('SiteSettings', SiteSettingsSchema);