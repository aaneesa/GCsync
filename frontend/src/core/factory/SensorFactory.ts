import { LidarSensor, ImuSensor, EncoderSensor } from '../../domain/Sensors';

export class SensorFactory {
  static create(type: string, data: any) {
    switch (type) {
      case 'lidar':
        return new LidarSensor(data);
      case 'imu':
        return new ImuSensor(data);
      case 'encoder':
        return new EncoderSensor(data);
      default:
        throw new Error(`Unknown sensor type: ${type}`);
    }
  }
}
