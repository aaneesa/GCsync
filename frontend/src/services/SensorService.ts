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
  private subscribersReady = false;

  // Data rate tracking
  private imuCount = 0;
  private lidarCount = 0;
  private odomCount = 0;

  constructor() {
    this.setupObservers();
    this.setupDataRateTracker();

    // Subscribe to ROS topics only after connection is confirmed ready
    // This prevents the "Still in CONNECTING state" error
    const connection = RosConnection.getInstance();
    if (connection.isReady()) {
      this.setupSubscribers();
    }

    eventBus.subscribe('ros:connection', (connected: boolean) => {
      if (connected && !this.subscribersReady) {
        // Small delay to ensure WebSocket is fully stable before subscribing
        setTimeout(() => this.setupSubscribers(), 200);
      }
    });
  }

  /**
   * 1. ROS Topic → RosConnection → EventBus (Raw data)
   */
  private setupSubscribers() {
    if (this.subscribersReady) return;
    this.subscribersReady = true;

    const connection = RosConnection.getInstance();
    const RosLib = ROSLIB as any;

    const lidarTopic = new RosLib.Topic({
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

    const imuTopic = new RosLib.Topic({
      ros: connection.ros,
      name: '/imu/data_raw',
      messageType: 'sensor_msgs/Imu'
    });

    imuTopic.subscribe((message: any) => {
      eventBus.publish('raw:imu', message);
    });

    const encoderTopic = new RosLib.Topic({
      ros: connection.ros,
      name: '/odom/unfiltered', 
      messageType: 'nav_msgs/Odometry'
    });

    encoderTopic.subscribe((message: any) => {
      eventBus.publish('raw:encoder', message);
    });

    console.log('SensorService: All topic subscriptions established');
  }

  /**
   * 2. EventBus → SensorFactory → Strategy Processing → Store
   */
  private setupObservers() {
    // Lidar Observer
    eventBus.subscribe('raw:lidar', (raw) => {
      const sensor = SensorFactory.create('lidar', raw);
      const result = sensor.process(this.lidarStrategy);
      useStore.getState().setLidarData(result.points);
      if (result.meta) {
        useStore.getState().setLidarMeta(result.meta);
      }
      sessionManager.addData('lidar', result.points);
      this.lidarCount++;
    });

    // IMU Observer
    eventBus.subscribe('raw:imu', (raw) => {
      const sensor = SensorFactory.create('imu', raw);
      const data = sensor.process(this.imuStrategy);
      useStore.getState().setImuData(data);
      sessionManager.addData('imu', data);
      this.imuCount++;
    });

    // Encoder/Odometry Observer
    eventBus.subscribe('raw:encoder', (raw) => {
      const sensor = SensorFactory.create('encoder', raw);
      const data = sensor.process(this.encoderStrategy);
      useStore.getState().setOdomData(data);
      sessionManager.addData('encoder', data);
      this.odomCount++;
    });
  }

  /**
   * 3. Track data rates (messages per second) for header display
   */
  private setupDataRateTracker() {
    setInterval(() => {
      useStore.getState().setDataRate('imu', this.imuCount);
      useStore.getState().setDataRate('lidar', this.lidarCount);
      useStore.getState().setDataRate('odom', this.odomCount);
      this.imuCount = 0;
      this.lidarCount = 0;
      this.odomCount = 0;
    }, 1000);
  }
}

export const sensorService = new SensorService();
