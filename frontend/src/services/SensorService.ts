import * as ROSLIB from 'roslib';
import { RosConnection } from '../core/websocket/RosConnection';
import { SensorFactory } from '../core/factory/SensorFactory';
import { LidarStrategy } from '../core/strategies/LidarStrategy';
import { ImuStrategy } from '../core/strategies/ImuStrategy';
import { EncoderStrategy } from '../core/strategies/EncoderStrategy';
import { eventBus } from '../core/observer/EventBus';
import { useStore } from '../store/useStore.ts';
import { sessionManager } from './SessionManager';

export class SensorService {
  private lidarStrategy = new LidarStrategy();
  private imuStrategy = new ImuStrategy();
  private encoderStrategy = new EncoderStrategy();

  constructor() {
    this.setupSubscribers();
    this.setupObservers();
  }

  /**
   * 1. ROS Topic → RosConnection → EventBus (Raw data)
   */
  private setupSubscribers() {
    const connection = RosConnection.getInstance();

    const lidarTopic = new (ROSLIB as any).Topic({
      ros: connection.ros,
      name: '/scan',
      messageType: 'sensor_msgs/LaserScan'
    });

    let lastLidarTime = 0;
    lidarTopic.subscribe((message: any) => {
      const now = Date.now();
      if (now - lastLidarTime < 100) return; 
      lastLidarTime = now;
      eventBus.publish('raw:lidar', message);
    });

    const imuTopic = new (ROSLIB as any).Topic({
      ros: connection.ros,
      name: '/imu/data',
      messageType: 'sensor_msgs/Imu'
    });

    imuTopic.subscribe((message: any) => {
      eventBus.publish('raw:imu', message);
    });

    const encoderTopic = new (ROSLIB as any).Topic({
      ros: connection.ros,
      name: '/encoder/ticks',
      messageType: 'std_msgs/Int32'
    });

    encoderTopic.subscribe((message: any) => {
      eventBus.publish('raw:encoder', message);
    });
  }

  /**
   * 2. EventBus → SensorFactory → Strategy Processing → Store
   */
  private setupObservers() {
    // Lidar Observer
    eventBus.subscribe('raw:lidar', (raw) => {
      const sensor = SensorFactory.create('lidar', raw);
      const points = sensor.process(this.lidarStrategy);
      useStore.getState().setLidarData(points);
      sessionManager.addData('lidar', points);
    });

    // IMU Observer
    eventBus.subscribe('raw:imu', (raw) => {
      const sensor = SensorFactory.create('imu', raw);
      const data = sensor.process(this.imuStrategy);
      useStore.getState().setImuData(data);
      sessionManager.addData('imu', data);
    });

    // Encoder Observer
    eventBus.subscribe('raw:encoder', (raw) => {
      const sensor = SensorFactory.create('encoder', raw);
      const data = sensor.process(this.encoderStrategy);
      useStore.getState().setEncoderData(data);
      sessionManager.addData('encoder', data);
    });
  }
}

export const sensorService = new SensorService();
