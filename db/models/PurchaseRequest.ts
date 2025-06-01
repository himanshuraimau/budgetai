import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseRequest extends Document {
  employeeId: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category: string;
  justification?: string;
  status: 'pending' | 'approved' | 'denied';
  aiDecisionReason?: string;
  submittedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    justification: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      required: true,
      default: 'pending',
    },
    aiDecisionReason: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const PurchaseRequest = mongoose.model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema); 