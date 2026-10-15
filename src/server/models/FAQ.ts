import { Schema, model, models, type Types } from 'mongoose';

export interface IFAQ {
  _id: Types.ObjectId;
  question: string;
  answer: string;
  /** Optional grouping, e.g. "Car rental". */
  category?: string;
  /** Optional scoping to a business or service. */
  businessIds: Types.ObjectId[];
  serviceIds: Types.ObjectId[];
  displayOrder: number;
  published: boolean;
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, required: true, trim: true },
    category: { type: String, trim: true, maxlength: 80 },
    businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
    serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    displayOrder: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: false },
    archivedAt: { type: Date },
    archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

FAQSchema.index({ displayOrder: 1, published: 1 });
FAQSchema.index({ published: 1, archivedAt: 1 });
FAQSchema.index({ archivedAt: 1 });

export const FAQ = models.FAQ || model<IFAQ>('FAQ', FAQSchema);