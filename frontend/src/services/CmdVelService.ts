import * as ROSLIB from 'roslib';
import { RosConnection } from '../core/websocket/RosConnection';
import { eventBus } from '../core/observer/EventBus';

export class CmdVelService {
  private cmdVelTopic: any = null;
  private currentLinearX: number = 0;
  private currentAngularZ: number = 0;
  private publishInterval: any = null;
  private readonly HZ = 10; 

  constructor() {
    eventBus.subscribe('ros:connection', (connected: boolean) => {
      if (connected) {
        this.cmdVelTopic = null;
        this.startPublishing();
      } else {
        this.stopPublishing();
      }
    });

    if (RosConnection.getInstance().getIsConnected()) {
      this.startPublishing();
    }
  }

  private startPublishing() {
    if (this.publishInterval) return;
    this.publishInterval = setInterval(() => {
      this.publish();
    }, 1000 / this.HZ);
  }

  private stopPublishing() {
    if (this.publishInterval) {
      clearInterval(this.publishInterval);
      this.publishInterval = null;
    }
  }

  private ensureTopic() {
    const connection = RosConnection.getInstance();
    const RosLib = ROSLIB as any;

    if (!this.cmdVelTopic && connection.isReady()) {
      this.cmdVelTopic = new RosLib.Topic({
        ros: connection.ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
      });
      console.log('CmdVelService: Topic initialized');
    }
    return this.cmdVelTopic;
  }

  public updateVelocity(linearX: number, angularZ: number) {
    this.currentLinearX = linearX;
    this.currentAngularZ = angularZ;
  }

  public send(linearX: number, angularZ: number) {
    this.updateVelocity(linearX, angularZ);
  }

  private publish() {
    const connection = RosConnection.getInstance();
    const RosLib = ROSLIB as any;

    // If not connected, don't try to publish
    if (!connection.isReady()) return;
    
    const topic = this.ensureTopic();
    if (!topic) return;

    const twist = new RosLib.Message({
      linear: { x: this.currentLinearX, y: 0.0, z: 0.0 },
      angular: { x: 0.0, y: 0.0, z: this.currentAngularZ }
    });

    topic.publish(twist);
  }
}

export const cmdVelService = new CmdVelService();
