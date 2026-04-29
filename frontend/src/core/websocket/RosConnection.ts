import * as ROSLIB from 'roslib';
import { eventBus } from '../observer/EventBus';

export class RosConnection {
  private static instance: RosConnection;
  public ros: ROSLIB.Ros;
  private isConnected: boolean = false;
  private url: string = 'ws://localhost:9090';

  private constructor() {
    this.ros = new (ROSLIB as any).Ros({ url: this.url });

    this.ros.on('connection', () => {
      console.log('Connected to websocket server.');
      this.isConnected = true;
      eventBus.publish('ros:connection', true);
    });

    this.ros.on('error', (error) => {
      console.error('Error connecting to websocket server: ', error);
      this.isConnected = false;
      eventBus.publish('ros:connection', false);
    });

    this.ros.on('close', () => {
      console.log('Connection to websocket server closed.');
      this.isConnected = false;
      eventBus.publish('ros:connection', false);
      
      // Attempt reconnection
      setTimeout(() => this.connect(), 3000);
    });
  }

  public static getInstance(): RosConnection {
    if (!RosConnection.instance) {
      RosConnection.instance = new RosConnection();
    }
    return RosConnection.instance;
  }

  public connect(url?: string) {
    if (url) this.url = url;
    if (!this.isConnected) {
      this.ros.connect(this.url);
    }
  }

  public getIsConnected() {
    return this.isConnected;
  }
}
