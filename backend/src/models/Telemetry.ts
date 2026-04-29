import mongoose, { Schema, Document } from 'mongoose';

export interface ITelemetry extends Document {
  sessionId: mongoose.Types.ObjectId;
  timestamp: Date;
  type: 'imu' | 'odom' | 'lidar';
  data: Record<string, any>;
}

const TelemetrySchema: Schema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['imu', 'odom', 'lidar'], required: true },
  data: { type: Object, required: true }
});

// Index for time-series queries
TelemetrySchema.index({ sessionId: 1, timestamp: -1 });

export default mongoose.model<ITelemetry>('Telemetry', TelemetrySchema);
