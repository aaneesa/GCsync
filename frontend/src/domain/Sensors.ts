import { BaseSensor } from './BaseSensor';

export class LidarSensor extends BaseSensor {
  process(strategy: any) {
    return strategy.process(this.raw);
  }
}

export class ImuSensor extends BaseSensor {
  process(strategy: any) {
    return strategy.process(this.raw);
  }
}

export class EncoderSensor extends BaseSensor {
  process(strategy: any) {
    return strategy.process(this.raw);
  }
}
