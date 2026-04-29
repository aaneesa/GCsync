export class LidarStrategy {
  process(data: any) {
    if (!data.ranges) return [];
    
    const points: [number, number, number][] = [];
    const angleMin = data.angle_min;
    const angleIncrement = data.angle_increment;
    const rangeMin = data.range_min;
    const rangeMax = data.range_max;

    for (let i = 0; i < data.ranges.length; i++) {
      const r = data.ranges[i];
      if (r >= rangeMin && r <= rangeMax) {
        const angle = angleMin + i * angleIncrement;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        points.push([x, y, 0]);
      }
    }
    return points;
  }
}
