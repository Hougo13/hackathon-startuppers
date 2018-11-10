import { Document } from 'mongoose';

export interface Sensors extends Document {
  readonly uid: string;
  readonly temperature: number;
  readonly humidity: number;
  readonly noise: number;
  readonly acceleration: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
