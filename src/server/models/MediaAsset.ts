import { Schema, model, models, type Types } from 'mongoose';

export interface IMediaAsset {
  _id: Types.ObjectId;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  folder: string;
  alt: string;
  caption?: string;
  tags: string[];
  usageCount: number;
  usageRefs: Array<{ type: string; id: Types.ObjectId; field: string }>;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>({
  publicId: { type: String, required: true, unique: true },
  secureUrl: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  format: { type: String, required: true },
  bytes: { type: Number, required: true },
  folder: { type: String, required: true },
  alt: { type: String, required: true },
  caption: String,
  tags: [{ type: String }],
  usageCount: { type: Number, default: 0 },
  usageRefs: [{
    type: { type: String },
    id: { type: Schema.Types.ObjectId },
    field: { type: String },
    _id: false,
  }],
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
}, { timestamps: true });

MediaAssetSchema.index({ folder: 1, createdAt: -1 });
MediaAssetSchema.index({ tags: 1 });
MediaAssetSchema.index({ uploadedBy: 1 });
MediaAssetSchema.index({ publicId: 1 }, { unique: true });

export const MediaAsset = models.MediaAsset || model<IMediaAsset>('MediaAsset', MediaAssetSchema);