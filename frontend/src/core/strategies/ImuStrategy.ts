export class ImuStrategy {
  process(data: any) {
    return {
      orientation: {
        x: data.orientation?.x || 0,
        y: data.orientation?.y || 0,
        z: data.orientation?.z || 0,
        w: data.orientation?.w || 1,
      },
      angular_velocity: {
        x: data.angular_velocity?.x || 0,
        y: data.angular_velocity?.y || 0,
        z: data.angular_velocity?.z || 0,
      },
      linear_acceleration: {
        x: data.linear_acceleration?.x || 0,
        y: data.linear_acceleration?.y || 0,
        z: data.linear_acceleration?.z || 0,
      }
    };
  }
}
