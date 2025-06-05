import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  size: '1-10' | '11-50' | '51-200' | '200+';
  industry: 'Tech' | 'Finance' | 'Healthcare' | 'Retail' | 'Other';
  adminId: mongoose.Types.ObjectId;
  joinCode: string;
  // Enhanced Payman integration fields
  paymanWalletId?: string;
  walletCreatedAt?: Date;
  walletCreationSuccess?: boolean;
  employeeCount: number;
  lastEmployeeJoinedAt?: Date;
  // Wallet policies
  defaultDailyLimit: number;
  defaultTransactionLimit: number;
  defaultApprovalThreshold: number;
  allowedCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '200+'],
      required: true,
    },
    industry: {
      type: String,
      enum: ['Tech', 'Finance', 'Healthcare', 'Retail', 'Other'],
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    employeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastEmployeeJoinedAt: {
      type: Date,
    },
    // Default wallet policies for the company
    defaultDailyLimit: {
      type: Number,
      default: 1000, // $1000 daily limit
      min: 0,
    },
    defaultTransactionLimit: {
      type: Number,
      default: 500, // $500 per transaction
      min: 0,
    },
    defaultApprovalThreshold: {
      type: Number,
      default: 200, // Requires approval above $200
      min: 0,
    },
    allowedCategories: {
      type: [String],
      default: [
        'Office Supplies',
        'Software',
        'Marketing',
        'Travel',
        'Equipment',
        'Utilities',
        'Other'
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient lookups
CompanySchema.index({ joinCode: 1 });
CompanySchema.index({ paymanWalletId: 1 });

export const Company = mongoose.models?.Company as mongoose.Model<ICompany> || mongoose.model<ICompany>('Company', CompanySchema); 