import { Schema, model, models, type Types } from 'mongoose';

export interface IAuditLog {
  _id: Types.ObjectId;
  actorId: Types.ObjectId;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: Types.ObjectId;
  targetSlug?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    actorEmail: { type: String, required: true },
    action: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetSlug: String,
    metadata: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ targetType: 1, targetId: 1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const AuditLog = models.AuditLog || model<IAuditLog>('AuditLog', AuditLogSchema);
