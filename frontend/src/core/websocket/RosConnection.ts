import * as ROSLIB from 'roslib';
import { eventBus } from '../observer/EventBus';
import { TelemetryService } from '../../services/TelemetryService';
import { useStore } from '../../store/useStore';

export class RosConnection {
  private static instance: RosConnection;
  public ros: ROSLIB.Ros;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private url: string = 'ws://10.15.242.12:9090';

  private constructor() {
    // Initialize without URL to prevent automatic connection attempt
    this.ros = new (ROSLIB as any).Ros();

    this.ros.on('connection', async () => {
      console.log('Successfully connected to:', this.url);
      this.isConnected = true;
      this.isConnecting = false;
      eventBus.publish('ros:connection', true);

      // Start MongoDB Session
      const { robotId, operatorName } = useStore.getState();
      const session = await TelemetryService.startSession({
        robotId,
        operatorName
      });
      if (session && session._id) {
        useStore.getState().setCurrentSessionId(session._id);
        console.log('MongoDB Session Started:', session._id);
      }
    });

    this.ros.on('error', (error: any) => {
      console.error('WebSocket Error:', error);
      this.isConnected = false;
      this.isConnecting = false;
      eventBus.publish('ros:connection', false);
    });

    this.ros.on('close', () => {
      console.warn('WebSocket Connection Closed');
      this.isConnected = false;
      this.isConnecting = false;
      eventBus.publish('ros:connection', false);
      // Attempt reconnection after 5 seconds
      setTimeout(() => this.connect(), 5000);
    });

    // Start initial connection
    this.connect();
  }

  public static getInstance(): RosConnection {
    if (!RosConnection.instance) {
      RosConnection.instance = new RosConnection();
    }
    return RosConnection.instance;
  }

  public connect(url?: string) {
    if (url) this.url = url;
    
    // Prevent concurrent connection attempts (fixes "Still in CONNECTING state" error)
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;
    console.log('Attempting to connect to ROS bridge at:', this.url);
    try {
      this.ros.connect(this.url);
    } catch (e) {
      console.error('Failed to initiate connection:', e);
      this.isConnecting = false;
    }
  }

  public getIsConnected() {
    return this.isConnected;
  }

  /**
   * Returns true if the roslib connection is established.
   */
  public isReady(): boolean {
    return this.isConnected;
  }
}
