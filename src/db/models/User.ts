import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'admin' | 'employee';
  companyId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  password: string;
  // Enhanced Payman integration fields
  paymanWalletId?: string;
  walletCreatedAt?: Date;
  walletCreationSuccess?: boolean;
  joinedViaCode?: string;
  personalWalletConnected?: boolean;
  personalWalletId?: string;
  onboardingCompleted: boolean;
  // Wallet preferences
  notificationsEnabled: boolean;
  dailySpendingLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee'],
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: false, // Allow creation without company initially
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    password: {
      type: String,
      required: true,
    },
    // Enhanced Payman integration fields
    paymanWalletId: {
      type: String,
      trim: true,
    },
    walletCreatedAt: {
      type: Date,
    },
    walletCreationSuccess: {
      type: Boolean,
      default: false,
    },
    joinedViaCode: {
      type: String,
      trim: true,
    },
    personalWalletConnected: {
      type: Boolean,
      default: false,
    },
    personalWalletId: {
      type: String,
      trim: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    // Wallet preferences
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    dailySpendingLimit: {
      type: Number,
      min: 0,
      // If not set, will inherit from company default
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
UserSchema.index({ companyId: 1 });
UserSchema.index({ paymanWalletId: 1 });
UserSchema.index({ joinedViaCode: 1 });

export const User = mongoose.models?.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', UserSchema);