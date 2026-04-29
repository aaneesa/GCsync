export class EncoderStrategy {
  private lastTime: number = 0;
  private lastTicks: number = 0;
  private readonly TICK_TO_METER = 0.01; // example conversion factor

  process(data: any) {
    const currentTicks = data.data || 0; // assuming Int32 or similar
    const currentTime = Date.now();
    
    let speed = 0;
    if (this.lastTime > 0 && currentTime > this.lastTime) {
      const dt = (currentTime - this.lastTime) / 1000.0;
      const dTicks = currentTicks - this.lastTicks;
      speed = (dTicks * this.TICK_TO_METER) / dt;
    }

    this.lastTime = currentTime;
    this.lastTicks = currentTicks;

    return {
      ticks: currentTicks,
      speed: speed,
      timestamp: currentTime
    };
  }
}
