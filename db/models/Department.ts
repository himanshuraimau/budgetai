import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  monthlyBudget: number;
  currentSpent: number;
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyBudget: {
      type: Number,
      required: true,
      min: 0,
    },
    currentSpent: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    employeeCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema); 