import mongoose, { Schema, Document } from 'mongoose';

export interface IOnboardingAudit extends Document {
  companyCode: string;
  companyId: mongoose.Types.ObjectId;
  employeeEmail: string;
  employeeId?: mongoose.Types.ObjectId;
  walletCreationSuccess: boolean;
  walletId?: string;
  errorMessage?: string;
  retryCount: number;
  lastRetryAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OnboardingAuditSchema = new Schema<IOnboardingAudit>(
  {
    companyCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    employeeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    walletCreationSuccess: {
      type: Boolean,
      required: true,
      default: false,
    },
    walletId: {
      type: String,
      trim: true,
    },
    errorMessage: {
      type: String,
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastRetryAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
OnboardingAuditSchema.index({ companyCode: 1, walletCreationSuccess: 1 });
OnboardingAuditSchema.index({ companyId: 1, createdAt: -1 });
OnboardingAuditSchema.index({ employeeEmail: 1, walletCreationSuccess: 1 });

export const OnboardingAudit = mongoose.models?.OnboardingAudit as mongoose.Model<IOnboardingAudit> || mongoose.model<IOnboardingAudit>('OnboardingAudit', OnboardingAuditSchema); 