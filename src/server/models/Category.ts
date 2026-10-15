import { Schema, model, models, type Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  serviceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: String,
    icon: String,
    displayOrder: { type: Number, default: 0 },
    serviceCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ displayOrder: 1 });

export const Category = models.Category || model<ICategory>('Category', CategorySchema);
