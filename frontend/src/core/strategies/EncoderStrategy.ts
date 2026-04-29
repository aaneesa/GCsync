export class EncoderStrategy {
  process(data: any) {
    const position = data.pose?.pose?.position || { x: 0, y: 0, z: 0 };
    const orientation = data.pose?.pose?.orientation || { x: 0, y: 0, z: 0, w: 1 };
    const linearVelocity = data.twist?.twist?.linear || { x: 0, y: 0, z: 0 };
    const angularVelocity = data.twist?.twist?.angular || { x: 0, y: 0, z: 0 };

    const speed = Math.sqrt(
      linearVelocity.x * linearVelocity.x +
      linearVelocity.y * linearVelocity.y +
      linearVelocity.z * linearVelocity.z
    );

    return {
      position: {
        x: position.x,
        y: position.y,
        z: position.z,
      },
      orientation: {
        x: orientation.x,
        y: orientation.y,
        z: orientation.z,
        w: orientation.w,
      },
      linearVelocity: {
        x: linearVelocity.x,
        y: linearVelocity.y,
        z: linearVelocity.z,
      },
      angularVelocity: {
        x: angularVelocity.x,
        y: angularVelocity.y,
        z: angularVelocity.z,
      },
      speed,
      timestamp: Date.now(),
    };
  }
}