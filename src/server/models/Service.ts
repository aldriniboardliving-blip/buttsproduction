import { Schema, model, models, type Types } from 'mongoose';

export interface IService {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  slugHistory: string[];
  shortDescription?: string;
  description?: string;
  categoryId: Types.ObjectId;
  businessIds: Types.ObjectId[];
  pricing: {
    amount: number;
    currency: 'USD';
    unit: 'per_hour' | 'per_day' | 'per_session' | 'per_load' | 'custom';
    customUnitLabel?: string;
  };
  duration?: string;
  locationType: 'onsite' | 'customer_location' | 'online' | 'granby_street';
  locationDetails?: string;
  gallery: Types.ObjectId[];
  featured: boolean;
  displayOrder: number;
  published: boolean;
  bookingConfig: {
    formKey: string;
    requiresApproval: boolean;
    collectsPayment: boolean;
    depositAmount?: number;
    cancellationPolicy?: string;
    customFields?: Record<string, unknown>;
  };
  faqIds: Types.ObjectId[];
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

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    slugHistory: [{ type: String }],
    shortDescription: String,
    description: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    pricing: {
      amount: { type: Number, required: true },
      currency: { type: String, enum: ['USD'], default: 'USD' },
      unit: {
        type: String,
        enum: ['per_hour', 'per_day', 'per_session', 'per_load', 'custom'],
        required: true,
      },
      customUnitLabel: String,
    },
    duration: String,
    locationType: {
      type: String,
      enum: ['onsite', 'customer_location', 'online', 'granby_street'],
      required: true,
    },
    locationDetails: String,
    gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    bookingConfig: {
      formKey: { type: String, required: true },
      requiresApproval: { type: Boolean, default: true },
      collectsPayment: { type: Boolean, default: false },
      depositAmount: Number,
      cancellationPolicy: String,
      customFields: Schema.Types.Mixed,
    },
    faqIds: [{ type: Schema.Types.ObjectId, ref: 'FAQ' }],
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

ServiceSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } },
);
ServiceSchema.index({ categoryId: 1, published: 1, displayOrder: 1 });
ServiceSchema.index({ businessIds: 1, published: 1 });
ServiceSchema.index({ featured: 1, published: 1 });
ServiceSchema.index({ archivedAt: 1 });

export const Service = models.Service || model<IService>('Service', ServiceSchema);
