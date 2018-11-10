import * as mongoose from 'mongoose';

export const SensorsSchema = new mongoose.Schema(
  {
    uid: String,
    temperature: Number,
    humidity: Number,
    noise: Number,
    acceleration: Number,
  },
  { timestamps: true },
);
