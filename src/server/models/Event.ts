import { Schema, model, models, type Types } from 'mongoose';

export type EventStatus = 'draft' | 'published';

export interface IEvent {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  slugHistory: string[];
  shortDescription?: string;
  description?: string;
  bannerImage?: Types.ObjectId;
  gallery: Types.ObjectId[];
  startDate: Date;
  endDate?: Date;
  /** Free-text venue; the business is not venue-booking software. */
  venue?: string;
  address?: string;
  /** External registration/ticketing URL. Not an internal booking engine. */
  registrationUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  businessIds: Types.ObjectId[];
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

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    slugHistory: { type: [String], default: [] },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String },
    bannerImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
    startDate: { type: Date, required: true },
    // An end date earlier than the start date is rejected before write by the
    // action's Zod schema; this keeps the model honest if written elsewhere.
    endDate: {
      type: Date,
      validate: {
        validator(this: IEvent, value?: Date) {
          if (!value) return true;
          return value.getTime() >= new Date(this.startDate).getTime();
        },
        message: 'endDate must be on or after startDate',
      },
    },
    venue: { type: String, trim: true, maxlength: 200 },
    address: { type: String, trim: true, maxlength: 300 },
    registrationUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
    businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 170 },
    ogTitle: { type: String, trim: true, maxlength: 95 },
    ogDescription: { type: String, trim: true, maxlength: 240 },
    ogImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    canonicalUrl: { type: String, trim: true },
    noindex: { type: Boolean },
    nofollow: { type: Boolean },
    archivedAt: { type: Date },
    archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

EventSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } });
EventSchema.index({ published: 1, startDate: -1 });
EventSchema.index({ published: 1, displayOrder: 1 });
EventSchema.index({ archivedAt: 1 });

export const Event = models.Event || model<IEvent>('Event', EventSchema);

/** Upcoming / ongoing / past, derived rather than stored so it is never stale. */
export type EventPhase = 'upcoming' | 'ongoing' | 'past';

export function eventPhase(event: { startDate: Date; endDate?: Date }, now = new Date()): EventPhase {
  if (now.getTime() < new Date(event.startDate).getTime()) return 'upcoming';
  if (event.endDate && now.getTime() > new Date(event.endDate).getTime()) return 'past';
  if (!event.endDate && now.getTime() > new Date(event.startDate).getTime()) {
    // No end date: treat as ongoing for the remainder of the start day.
    const dayEnd = new Date(event.startDate);
    dayEnd.setHours(23, 59, 59, 999);
    return now.getTime() > dayEnd.getTime() ? 'past' : 'ongoing';
  }
  return 'ongoing';
}