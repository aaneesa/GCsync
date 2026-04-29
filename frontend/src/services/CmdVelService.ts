import * as ROSLIB from 'roslib';
import { RosConnection } from '../core/websocket/RosConnection';

export class CmdVelService {
  private cmdVelTopic: any;

  constructor() {
    const connection = RosConnection.getInstance();
    
    this.cmdVelTopic = new (ROSLIB as any).Topic({
      ros: connection.ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    });
  }

  public send(linearX: number, angularZ: number) {
    const twist = new (ROSLIB as any).Message({
      linear: {
        x: linearX,
        y: 0.0,
        z: 0.0
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: angularZ
      }
    });
    this.cmdVelTopic.publish(twist);
  }
}

export const cmdVelService = new CmdVelService();
