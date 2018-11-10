import * as mongoose from 'mongoose';

export const HappinessSchema = new mongoose.Schema(
  {
    ratio: Number,
  },
  { timestamps: true },
);
