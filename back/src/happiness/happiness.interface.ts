import { Document } from 'mongoose';

export interface Happiness extends Document {
  readonly ratio: number;
  readonly dateTime: Date;
}
