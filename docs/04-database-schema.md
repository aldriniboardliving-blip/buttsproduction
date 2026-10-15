# Butts Productions — Database Schema (MongoDB + Mongoose)

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Design Principles

- **Single responsibility**: Each collection has a clear domain
- **Referential integrity**: Application-level cascading (no MongoDB transactions for simplicity)
- **Soft deletes**: `archivedAt` timestamp instead of hard deletes
- **Timestamps**: `createdAt`, `updatedAt` on all collections
- **Unique slugs**: Partial unique indexes on published+non-archived documents
- **Optimistic locking**: `version` field for concurrent edits (future)
- **Audit trail**: Separate `AuditLogs` collection, not embedded

---

## TypeScript Interfaces (Source of Truth)

```typescript
// src/types/database.ts

import { Types } from 'mongoose';

// ============================================
// CORE TYPES
// ============================================

export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeletable {
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
}

export interface SEOFields {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: Types.ObjectId; // MediaAsset ref
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface Slugged {
  slug: string;
  slugHistory?: string[]; // for redirect tracking
}

// ============================================
// ADMIN & AUTH
// ============================================

export type AdminRole = 'superadmin' | 'content_manager' | 'booking_manager';

export interface AdminUser extends Timestamped, SoftDeletable {
  _id: Types.ObjectId;
  email: string; // unique, lowercase
  passwordHash: string; // Argon2id
  name: string;
  role: AdminRole;
  permissions: string[]; // computed from role
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  rememberToken?: string; // for remember-me
  rememberTokenExpires?: Date;
}

export interface Session extends Timestamped {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string; // hashed session token
  userAgent?: string;
  ip?: string;
  expiresAt: Date;
  revokedAt?: Date;
}

// ============================================
// BUSINESSES
// ============================================

export interface BusinessContact {
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
}

export interface BusinessSocial {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface Business extends Timestamped, SoftDeletable, SEOFields, Slugged {
  _id: Types.ObjectId;
  name: string;
  shortDescription?: string;
  description?: string; // markdown/rich text
  logo?: Types.ObjectId; // MediaAsset
  coverImage?: Types.ObjectId; // MediaAsset
  gallery?: Types.ObjectId[]; // MediaAsset[]
  contact: BusinessContact;
  social: BusinessSocial;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  serviceIds: Types.ObjectId[]; // denormalized for queries
  teamMemberIds: Types.ObjectId[];
  settings: {
    bookingEnabled: boolean;
    defaultBookingForm?: string; // form key
  };
}

// ============================================
// SERVICES
// ============================================

export type ServiceLocationType = 'onsite' | 'customer_location' | 'online' | 'granby_street';

export interface ServicePricing {
  amount: number; // cents
  currency: 'USD';
  unit: 'per_hour' | 'per_day' | 'per_session' | 'per_load' | 'custom';
  customUnitLabel?: string;
}

export interface ServiceBookingConfig {
  formKey: string; // 'car_rental' | 'dispatch' | 'coaching' | 'custom_print' | 'entertainment' | 'careers' | 'notify'
  requiresApproval: boolean;
  collectsPayment: boolean;
  depositAmount?: number; // cents
  cancellationPolicy?: string; // markdown
  customFields?: Record<string, unknown>; // form-specific config
}

export interface Service extends Timestamped, SoftDeletable, SEOFields, Slugged {
  _id: Types.ObjectId;
  name: string;
  shortDescription?: string;
  description?: string; // markdown/rich text
  categoryId: Types.ObjectId;
  businessIds: Types.ObjectId[]; // many-to-many
  pricing: ServicePricing;
  duration?: string; // e.g., "2 hr", "1 day"
  locationType: ServiceLocationType;
  locationDetails?: string;
  gallery?: Types.ObjectId[]; // MediaAsset[]
  featured: boolean;
  displayOrder: number;
  published: boolean;
  bookingConfig: ServiceBookingConfig;
  faqIds: Types.ObjectId[]; // related FAQs
}

// ============================================
// CATEGORIES
// ============================================

export interface Category extends Timestamped, Slugged {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string; // icon name
  displayOrder: number;
  serviceCount: number; // denormalized
}

// ============================================
// PAGES & CONTENT BLOCKS
// ============================================

export type BlockType =
  | 'hero'
  | 'richText'
  | 'imageText'
  | 'gallery'
  | 'serviceGrid'
  | 'businessGrid'
  | 'statistics'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'events'
  | 'contact'
  | 'newsletter';

export interface BlockConfig {
  // Hero
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: Types.ObjectId;
  backgroundVideo?: Types.ObjectId;
  textAlign?: 'left' | 'center' | 'right';
  overlay?: boolean;

  // RichText
  content?: string; // markdown

  // ImageText
  image?: Types.ObjectId;
  imageAlt?: string;
  text?: string;
  imagePosition?: 'left' | 'right';
  reverseOnMobile?: boolean;

  // Gallery
  images?: Types.ObjectId[];
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number;

  // ServiceGrid / BusinessGrid
  entityIds?: Types.ObjectId[];
  maxItems?: number;
  showPrice?: boolean;
  showCategory?: boolean;

  // Statistics
  stats?: Array<{ label: string; value: string; icon?: string }>;

  // Testimonials
  testimonialIds?: Types.ObjectId[];
  autoRotate?: boolean;

  // FAQ
  faqIds?: Types.ObjectId[];
  category?: string;

  // CTA
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  backgroundImage?: Types.ObjectId;

  // Events
  eventIds?: Types.ObjectId[];
  showPast?: boolean;
  maxEvents?: number;

  // Contact
  showForm?: boolean;
  formKey?: string;

  // Newsletter
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export interface ContentBlock extends Timestamped {
  _id: Types.ObjectId;
  type: BlockType;
  config: BlockConfig;
  enabled: boolean;
  displayOrder: number;
  // For A/B testing or scheduling (future)
  startDate?: Date;
  endDate?: Date;
}

export interface Page extends Timestamped, SoftDeletable, SEOFields, Slugged {
  _id: Types.ObjectId;
  title: string;
  template: 'default' | 'home' | 'business' | 'service' | 'landing';
  blocks: ContentBlock[]; // embedded for atomic updates
  published: boolean;
  isSystemPage: boolean; // home, 404, etc.
}

// ============================================
// NAVIGATION
// ============================================

export interface NavigationItem extends Timestamped, Slugged {
  _id: Types.ObjectId;
  label: string;
  href?: string; // internal or external
  target?: '_self' | '_blank';
  parentId?: Types.ObjectId;
  children?: Types.ObjectId[]; // denormalized for rendering
  displayOrder: number;
  published: boolean;
  megaMenu: boolean; // renders as dropdown column
  megaMenuColumn?: number; // 1-4
  icon?: string;
  // For dynamic items
  dynamic?: {
    type: 'businesses' | 'services' | 'categories';
    filter?: Record<string, unknown>;
  };
}

// ============================================
// MEDIA ASSETS (Cloudinary References)
// ============================================

export interface MediaAsset extends Timestamped {
  _id: Types.ObjectId;
  publicId: string; // Cloudinary public_id (unique)
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  folder: string;
  alt: string;
  caption?: string;
  tags?: string[];
  usageCount: number; // references from content
  usageRefs?: Array<{ type: string; id: Types.ObjectId; field: string }>;
  uploadedBy: Types.ObjectId; // AdminUser
  // Derived
  aspectRatio: number;
  responsiveUrls?: Record<string, string>; // breakpoint -> url
}

// ============================================
// BOOKINGS & INQUIRIES
// ============================================

export type BookingStatus =
  | 'new'
  | 'pending_review'
  | 'contacted'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface BookingFormData {
  // Car Rental
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  cityState?: string;
  zip?: string;
  pickupDate?: string;
  pickupTime?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  driversLicenseFileId?: Types.ObjectId;
  insuranceCardFileId?: Types.ObjectId;
  insuranceType?: 'own' | 'none';
  additionalDriver?: 'yes' | 'no';
  inTown?: 'yes' | 'no';
  unlimitedMiles?: 'yes' | 'no';
  vehicleSelection?: 'rosie' | 'princess' | 'scarlet' | 'pepper';
  termsAccepted?: boolean;
  signature?: string; // base64

  // Dispatch
  company?: string;
  mcNumber?: string;
  dotNumber?: string;
  truckType?: string;
  paymentMethod?: 'zelle' | 'credit' | 'cashapp' | 'ach';
  pickupLocation?: string;
  deliveryLocation?: string;
  weight?: string;
  commodity?: string;
  equipment?: string;
  totalRate?: string;
  detentionRate?: string;
  carrierSignature?: string;
  dispatcherSignature?: string;

  // Coaching
  sessionDateTime?: string;
  sessionTier?: '45min' | '120min' | '360min';

  // Custom Print
  product?: 'tshirt' | 'decal' | 'hat' | 'mug' | 'candle';
  shirtColor?: string;
  fontColor?: string;
  shirtSize?: string;
  customText?: string;
  inspirationImageFileId?: Types.ObjectId;
  dueDate?: string;
  deliveryAddress?: string;

  // Entertainment
  message?: string;

  // Careers
  ssn?: string; // encrypted
  position?: string;
  desiredSalary?: string;
  shirtSize?: string;
  felonyConviction?: 'yes' | 'no';
  highSchoolGrad?: 'no' | 'yes' | 'ged';
  usCitizen?: 'yes' | 'no';
  everFired?: 'yes' | 'no';
  acknowledgmentSignature?: string;

  // Notify Me
  notifyEmail?: string;

  // Generic
  [key: string]: unknown;
}

export interface BookingStatusHistoryEntry {
  _id: Types.ObjectId;
  fromStatus: BookingStatus;
  toStatus: BookingStatus;
  changedBy: Types.ObjectId; // AdminUser
  note?: string;
  timestamp: Date;
  customerNotified: boolean;
}

export interface BookingNote {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  internal: boolean;
  createdAt: Date;
}

export interface Booking extends Timestamped {
  _id: Types.ObjectId;
  serviceId: Types.ObjectId;
  businessId: Types.ObjectId;
  formKey: string;
  formData: BookingFormData;
  status: BookingStatus;
  statusHistory: BookingStatusHistoryEntry[];
  notes: BookingNote[];
  customerEmail: string;
  customerPhone?: string;
  customerName: string;
  submittedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  // For export/filtering
  sourcePage?: string;
  userAgent?: string;
  ip?: string;
}

// ============================================
// EVENTS
// ============================================

export interface Event extends Timestamped, SoftDeletable, SEOFields, Slugged {
  _id: Types.ObjectId;
  title: string;
  shortDescription?: string;
  description?: string; // markdown
  startDate: Date;
  endDate: Date;
  timezone: string; // IANA
  location: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    virtual?: boolean;
    virtualUrl?: string;
  };
  images?: Types.ObjectId[]; // MediaAsset[]
  registrationOpen: boolean;
  maxAttendees?: number;
  currentAttendees: number; // denormalized
  registrationFormKey?: string;
  businessId?: Types.ObjectId; // organizing business
  published: boolean;
}

// ============================================
// FAQs
// ============================================

export interface FAQ extends Timestamped, SoftDeletable {
  _id: Types.ObjectId;
  question: string;
  answer: string; // markdown
  category: string; // 'general' | 'car_rental' | 'dispatch' | 'consulting' | etc.
  displayOrder: number;
  published: boolean;
  helpfulYes: number;
  helpfulNo: number;
}

// ============================================
// TESTIMONIALS
// ============================================

export interface Testimonial extends Timestamped, SoftDeletable {
  _id: Types.ObjectId;
  authorName: string;
  authorRole?: string;
  authorImage?: Types.ObjectId;
  content: string;
  rating: number; // 1-5
  entityType?: 'business' | 'service' | 'event';
  entityId?: Types.ObjectId;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  source?: 'direct' | 'google' | 'facebook' | 'yelp';
  sourceUrl?: string;
}

// ============================================
// NEWSLETTER SUBSCRIBERS
// ============================================

export interface NewsletterSubscriber extends Timestamped {
  _id: Types.ObjectId;
  email: string; // unique
  source: string; // 'footer' | 'homepage' | 'checkout' | 'event' | etc.
  confirmed: boolean;
  confirmedAt?: Date;
  confirmationToken?: string;
  confirmationTokenExpires?: Date;
  unsubscribedAt?: Date;
  unsubscribeToken?: string;
  tags?: string[];
}

// ============================================
// JOB APPLICATIONS
// ============================================

export type ApplicationStatus =
  | 'new'
  | 'reviewing'
  | 'interviewing'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication extends Timestamped {
  _id: Types.ObjectId;
  formData: BookingFormData; // reuse form data structure
  resumeFileId?: Types.ObjectId;
  status: ApplicationStatus;
  statusHistory: Array<{
    fromStatus: ApplicationStatus;
    toStatus: ApplicationStatus;
    changedBy: Types.ObjectId;
    note?: string;
    timestamp: Date;
  }>;
  notes: BookingNote[];
  sourcePage?: string;
}

// ============================================
// SITE SETTINGS (Singleton)
// ============================================

export interface SiteSettings extends Timestamped {
  _id: Types.ObjectId; // fixed: 'site_settings'
  contact: {
    phone: string;
    phoneLocal: string;
    fax: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    hours: string;
  };
  social: BusinessSocial;
  seoDefaults: SEOFields;
  analytics: {
    ga4MeasurementId?: string;
    gtmContainerId?: string;
  };
  email: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
  };
  booking: {
    defaultCancellationPolicy: string;
    maxFileSizeMB: number;
    allowedFileTypes: string[];
  };
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// ============================================
// LEGAL PAGES
// ============================================

export interface LegalPage extends Timestamped, SEOFields, Slugged {
  _id: Types.ObjectId;
  title: string;
  content: string; // markdown
  lastReviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  published: boolean;
}

// ============================================
// TEAM MEMBERS
// ============================================

export interface TeamMember extends Timestamped, SoftDeletable, Slugged {
  _id: Types.ObjectId;
  name: string;
  role: string;
  bio?: string;
  image?: Types.ObjectId;
  businessIds: Types.ObjectId[];
  social: BusinessSocial;
  displayOrder: number;
  published: boolean;
}

// ============================================
// STATISTICS (Homepage counters)
// ============================================

export interface Statistic extends Timestamped, SoftDeletable {
  _id: Types.ObjectId;
  label: string;
  value: string; // formatted (e.g., "15+", "500+")
  icon?: string;
  displayOrder: number;
  published: boolean;
  verified: boolean; // only show if true
  verificationSource?: string;
}

// ============================================
// AUDIT LOGS
// ============================================

export interface AuditLog extends Timestamped {
  _id: Types.ObjectId;
  actorId: Types.ObjectId; // AdminUser
  actorEmail: string; // denormalized for querying
  action: string; // 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'login' | 'logout' | 'status_change' | 'export'
  targetType: string; // collection name
  targetId: Types.ObjectId;
  targetSlug?: string; // for readability
  metadata?: Record<string, unknown>; // before/after, changed fields
  ip?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'critical';
}
```

---

## Mongoose Models (Implementation)

```typescript
// src/server/models/AdminUser.ts
import { model, Schema, Types } from 'mongoose';
import { AdminUser } from '@/types/database';

const AdminUserSchema = new Schema<AdminUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['superadmin', 'content_manager', 'booking_manager'], default: 'superadmin' },
  permissions: [{ type: String }],
  lastLoginAt: Date,
  loginAttempts: { type: Number, default: 0 },
  lockedUntil: Date,
  rememberToken: String,
  rememberTokenExpires: Date,
  archivedAt: Date,
  archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

AdminUserSchema.index({ email: 1 }, { unique: true });

export const AdminUser = model<AdminUser>('AdminUser', AdminUserSchema);
```

```typescript
// src/server/models/Business.ts
import { model, Schema, Types } from 'mongoose';
import { Business } from '@/types/database';

const BusinessContactSchema = new Schema({
  phone: String,
  email: String,
  address: {
    street: String, city: String, state: String, zip: String, country: String,
  },
  hours: Schema.Types.Mixed,
}, { _id: false });

const BusinessSocialSchema = new Schema({
  facebook: String, instagram: String, twitter: String,
  linkedin: String, youtube: String, tiktok: String,
}, { _id: false });

const BusinessSchema = new Schema<Business>({
  name: { type: String, required: true, trim: true },
  shortDescription: String,
  description: String,
  logo: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
  coverImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
  gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
  contact: BusinessContactSchema,
  social: BusinessSocialSchema,
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  teamMemberIds: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }],
  settings: {
    bookingEnabled: { type: Boolean, default: true },
    defaultBookingForm: String,
  },
  // SEO
  metaTitle: String, metaDescription: String, ogTitle: String, ogDescription: String,
  ogImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
  canonicalUrl: String, noindex: Boolean, nofollow: Boolean,
  // Slug
  slug: { type: String, required: true, trim: true, lowercase: true },
  slugHistory: [String],
  archivedAt: Date,
  archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

// Partial unique index on published, non-archived slugs
BusinessSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } }
);
BusinessSchema.index({ published: 1, displayOrder: 1 });
BusinessSchema.index({ featured: 1, published: 1 });

export const Business = model<Business>('Business', BusinessSchema);
```

```typescript
// src/server/models/Service.ts
import { model, Schema, Types } from 'mongoose';
import { Service, ServicePricing, ServiceBookingConfig } from '@/types/database';

const ServicePricingSchema = new Schema<ServicePricing>({
  amount: { type: Number, required: true }, // cents
  currency: { type: String, enum: ['USD'], default: 'USD' },
  unit: { type: String, enum: ['per_hour', 'per_day', 'per_session', 'per_load', 'custom'], required: true },
  customUnitLabel: String,
}, { _id: false });

const ServiceBookingConfigSchema = new Schema<ServiceBookingConfig>({
  formKey: { type: String, required: true },
  requiresApproval: { type: Boolean, default: true },
  collectsPayment: { type: Boolean, default: false },
  depositAmount: Number,
  cancellationPolicy: String,
  customFields: Schema.Types.Mixed,
}, { _id: false });

const ServiceSchema = new Schema<Service>({
  name: { type: String, required: true, trim: true },
  shortDescription: String,
  description: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
  pricing: { type: ServicePricingSchema, required: true },
  duration: String,
  locationType: { type: String, enum: ['onsite', 'customer_location', 'online', 'granby_street'], required: true },
  locationDetails: String,
  gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  bookingConfig: { type: ServiceBookingConfigSchema, required: true },
  faqIds: [{ type: Schema.Types.ObjectId, ref: 'FAQ' }],
  // SEO
  metaTitle: String, metaDescription: String, ogTitle: String, ogDescription: String,
  ogImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
  canonicalUrl: String, noindex: Boolean, nofollow: Boolean,
  // Slug
  slug: { type: String, required: true, trim: true, lowercase: true },
  slugHistory: [String],
  archivedAt: Date,
  archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
}, { timestamps: true });

ServiceSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } }
);
ServiceSchema.index({ categoryId: 1, published: 1, displayOrder: 1 });
ServiceSchema.index({ businessIds: 1, published: 1 });
ServiceSchema.index({ featured: 1, published: 1 });

export const Service = model<Service>('Service', ServiceSchema);
```

```typescript
// src/server/models/Booking.ts
import { model, Schema, Types } from 'mongoose';
import { Booking, BookingStatus, BookingStatusHistoryEntry, BookingNote, BookingFormData } from '@/types/database';

const BookingStatusHistorySchema = new Schema<BookingStatusHistoryEntry>({
  fromStatus: { type: String, enum: ['new', 'pending_review', 'contacted', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'] },
  toStatus: { type: String, enum: ['new', 'pending_review', 'contacted', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'] },
  changedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  note: String,
  timestamp: { type: Date, default: Date.now },
  customerNotified: { type: Boolean, default: false },
}, { _id: true });

const BookingNoteSchema = new Schema<BookingNote>({
  authorId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  content: { type: String, required: true },
  internal: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const BookingSchema = new Schema<Booking>({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  formKey: { type: String, required: true },
  formData: { type: Schema.Types.Mixed, required: true }, // validated at submission
  status: { type: String, enum: ['new', 'pending_review', 'contacted', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'], default: 'new' },
  statusHistory: [BookingStatusHistorySchema],
  notes: [BookingNoteSchema],
  customerEmail: { type: String, required: true, lowercase: true, trim: true },
  customerPhone: String,
  customerName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  sourcePage: String,
  userAgent: String,
  ip: String,
}, { timestamps: true });

BookingSchema.index({ serviceId: 1, status: 1, submittedAt: -1 });
BookingSchema.index({ businessId: 1, status: 1, submittedAt: -1 });
BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ submittedAt: -1 });
BookingSchema.index({ status: 1, submittedAt: -1 });

export const Booking = model<Booking>('Booking', BookingSchema);
```

```typescript
// src/server/models/MediaAsset.ts
import { model, Schema, Types } from 'mongoose';
import { MediaAsset } from '@/types/database';

const MediaAssetSchema = new Schema<MediaAsset>({
  publicId: { type: String, required: true, unique: true },
  secureUrl: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, required: true },
  bytes: { type: Number, required: true },
  folder: { type: String, required: true },
  alt: { type: String, required: true },
  caption: String,
  tags: [String],
  usageCount: { type: Number, default: 0 },
  usageRefs: [{
    type: { type: String },
    id: { type: Schema.Types.ObjectId },
    field: { type: String },
  }],
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
}, { timestamps: true });

MediaAssetSchema.virtual('aspectRatio').get(function() {
  return this.width / this.height;
});

MediaAssetSchema.index({ folder: 1, createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });
MediaAssetSchema.index({ uploadedBy: 1 });

export const MediaAsset = model<MediaAsset>('MediaAsset', MediaAssetSchema);
```

---

## Index Summary

| Collection | Indexes |
|------------|---------|
| `AdminUser` | `email` (unique) |
| `Session` | `userId`, `token` (unique), `expiresAt` (TTL) |
| `Business` | `slug` (unique, partial), `published+displayOrder`, `featured+published` |
| `Service` | `slug` (unique, partial), `categoryId+published+displayOrder`, `businessIds+published`, `featured+published` |
| `Category` | `slug` (unique), `displayOrder` |
| `Page` | `slug` (unique), `published` |
| `NavigationItem` | `parentId+displayOrder`, `published` |
| `MediaAsset` | `publicId` (unique), `folder+createdAt`, `tags`, `uploadedBy` |
| `Booking` | `serviceId+status+submittedAt`, `businessId+status+submittedAt`, `customerEmail`, `submittedAt`, `status+submittedAt` |
| `Event` | `slug` (unique, partial), `startDate`, `published+registrationOpen` |
| `FAQ` | `category+published+displayOrder` |
| `Testimonial` | `entityType+entityId+published`, `featured+published` |
| `NewsletterSubscriber` | `email` (unique), `confirmed` |
| `JobApplication` | `status+createdAt` |
| `LegalPage` | `slug` (unique) |
| `TeamMember` | `slug` (unique, partial), `businessIds+published+displayOrder` |
| `Statistic` | `published+verified+displayOrder` |
| `AuditLog` | `actorId+createdAt`, `targetType+targetId`, `createdAt` (TTL 1yr) |

---

## Slug Generation Strategy

```typescript
// src/lib/slug.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function ensureUniqueSlug<T extends { slug: string }>(
  model: Model<T>,
  baseSlug: string,
  excludeId?: Types.ObjectId
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await model.exists(query);
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}
```

---

## Migration Notes (Wix → MongoDB)

1. **Businesses**: 11 divisions → 11 Business docs (3 from external domains need content extraction)
2. **Services**: 6 service pages → 6 Service docs + categories
3. **Pages**: Homepage blocks, About, FAQ, Legal → Page docs
4. **Media**: ~80 Wix CDN URLs → download → Cloudinary upload → MediaAsset docs
5. **Team**: 6 members → TeamMember docs
6. **FAQs**: 10 Q&As → FAQ docs (category: 'car_rental' + 'general')
7. **Events**: 1 event → Event doc
8. **Bookings**: Historical Wix form data → not migrated (fresh start)
9. **Navigation**: Mega-menu structure → NavigationItem tree

---

## Approval

**Phase 2 Database Schema Deliverable** — Reply "Approved" to proceed to API contracts & auth flows, or request revisions.