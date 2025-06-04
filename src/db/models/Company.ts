import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  size: '1-10' | '11-50' | '51-200' | '200+';
  industry: 'Tech' | 'Finance' | 'Healthcare' | 'Retail' | 'Other';
  adminId: mongoose.Types.ObjectId;
  joinCode: string;
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
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.models?.Company as mongoose.Model<ICompany> || mongoose.model<ICompany>('Company', CompanySchema); 