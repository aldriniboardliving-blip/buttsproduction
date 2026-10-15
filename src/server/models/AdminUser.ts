import { Schema, model, models, type Types } from 'mongoose';

export type AdminRole = 'superadmin' | 'content_manager' | 'booking_manager';

export interface IAdminUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  rememberToken?: string;
  rememberTokenExpires?: Date;
  archivedAt?: Date;
  archivedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['superadmin', 'content_manager', 'booking_manager'],
      default: 'superadmin',
    },
    permissions: [{ type: String }],
    lastLoginAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    rememberToken: String,
    rememberTokenExpires: Date,
    archivedAt: Date,
    archivedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true },
);

AdminUserSchema.index({ email: 1 }, { unique: true });
AdminUserSchema.index({ archivedAt: 1 });

export const AdminUser = models.AdminUser || model<IAdminUser>('AdminUser', AdminUserSchema);
