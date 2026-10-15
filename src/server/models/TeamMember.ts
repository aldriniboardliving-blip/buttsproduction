import { Schema, model, models, type Types } from 'mongoose';

export interface ITeamMember {
  _id: Types.ObjectId;
  name: string;
  role: string;
  bio?: string;
  photo?: Types.ObjectId;
  email?: string;
  phone?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  displayOrder: number;
  published: boolean;
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 200 },
    bio: { type: String, trim: true, maxlength: 1200 },
    photo: { type: Schema.Types.ObjectId, ref: 'MediaAsset' },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    socials: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
    displayOrder: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: false },
    archivedAt: { type: Date },
    archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ published: 1, displayOrder: 1 });
TeamMemberSchema.index({ archivedAt: 1 });

export const TeamMember =
  models.TeamMember || model<ITeamMember>('TeamMember', TeamMemberSchema);