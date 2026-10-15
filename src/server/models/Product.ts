import { Schema, model, models, type Types } from 'mongoose';

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  slugHistory: string[];
  shortDescription?: string;
  description?: string;
  /** Optional — the "Why Not Buy It Shop" catalogue does not require pricing. */
  price?: number;
  currency: 'USD';
  inStock: boolean;
  featuredImage?: Types.ObjectId;
  gallery: Types.ObjectId[];
  categoryId?: Types.ObjectId;
  businessIds: Types.ObjectId[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
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

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    slugHistory: { type: [String], default: [] },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String },
    price: { type: Number, min: 0 },
    currency: { type: String, enum: ['USD'], default: 'USD' },
    inStock: { type: Boolean, default: true },
    featuredImage: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    gallery: [{ type: Schema.Types.ObjectId, ref: 'MediaAsset' }],
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0 },
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

ProductSchema.index({ slug: 1 }, { unique: true, partialFilterExpression: { published: true, archivedAt: { $exists: false } } });
ProductSchema.index({ published: 1, displayOrder: 1 });
ProductSchema.index({ featured: 1, published: 1 });
ProductSchema.index({ categoryId: 1, published: 1 });
ProductSchema.index({ archivedAt: 1 });

export const Product = models.Product || model<IProduct>('Product', ProductSchema);