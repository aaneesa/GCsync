import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  robotId: string;
  operatorName: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'failed';
  metadata: Record<string, any>;
}

const SessionSchema: Schema = new Schema({
  robotId: { type: String, required: true },
  operatorName: { type: String, default: 'Admin' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
