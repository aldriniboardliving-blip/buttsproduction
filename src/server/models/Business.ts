import { Schema, model, models, type Types } from 'mongoose';

export interface IBusiness {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  slugHistory: string[];
  shortDescription?: string;
  description?: string;
  logo?: Types.ObjectId;
  coverImage?: Types.ObjectId;
  gallery: Types.ObjectId[];
  contact: {
    phone?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    hours?: Record<string, { open: string; close: string; closed: boolean }>;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  featured: boolean;
  displayOrder: number;
  published: boolean;
  serviceIds: Types.ObjectId[];
  teamMemberIds: Types.ObjectId[];
  settings: {
    bookingEnabled: boolean;
    defaultBookingForm?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Types.ObjectId;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    slugHistory: [{ type: String }],
    shortDescription: String,
    description: String,
    logo: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    coverImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
    contact: {
      phone: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
      hours: Schema.Types.Mixed,
    },
    social: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String,
      tiktok: String,
    },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    teamMemberIds: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }],
    settings: {
      bookingEnabled: { type: Boolean, default: true },
      defaultBookingForm: String,
    },
    metaTitle: String,
    metaDescription: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    canonicalUrl: String,
    noindex: Boolean,
    nofollow: Boolean,
    archivedAt: Date,
    archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

BusinessSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } },
);
BusinessSchema.index({ published: 1, displayOrder: 1 });
BusinessSchema.index({ featured: 1, published: 1 });
BusinessSchema.index({ archivedAt: 1 });

export const Business = models.Business || model<IBusiness>('Business', BusinessSchema);
