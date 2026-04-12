import { DashboardPanel } from './DashboardPanel';


export interface LidarPoint {
    x: number;
    y: number;
    z: number;
    intensity?: number; 
}


export class SpatialVisualizer extends DashboardPanel {
    lidarPoints: LidarPoint[];
    heading: number; 
    pitch: number;
    roll: number;

    constructor() {
        super('Spatial Visualizer');
        this.lidarPoints = [];
        this.heading = 0;
        this.pitch = 0;
        this.roll = 0;
    }

    
    updatePanel(data: Record<string, unknown>): void {
        if (Array.isArray(data.lidarPoints)) {
            this.lidarPoints = data.lidarPoints as LidarPoint[];
        }
        if (typeof data.heading === 'number') this.heading = data.heading;
        if (typeof data.pitch === 'number') this.pitch = data.pitch;
        if (typeof data.roll === 'number') this.roll = data.roll;
    }

    
    renderMap(): LidarPoint[] {
        return this.lidarPoints;
    }

    
    rotateByIMU(deltaDeg: number): void {
        this.heading = (this.heading + deltaDeg) % 360;
        if (this.heading < 0) this.heading += 360;
    }
}
