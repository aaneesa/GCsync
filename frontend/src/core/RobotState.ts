import type { LidarPoint } from './SpatialVisualizer';
import type { HealthAlert } from './HealthMonitor';


export interface TelemetrySnapshot {
    timestamp: number;
    leftRPM: number;
    rightRPM: number;
    voltage: number;
    batteryPercent: number;
}


export class RobotState {
    
    motorData: number[];        
    encoderTicks: number[];     

    
    sensorFlags: Record<string, boolean>;

    
    lidarPoints: LidarPoint[];
    heading: number;
    pitch: number;
    roll: number;

    
    voltage: number;
    batteryPercent: number;

    
    isConnected: boolean;
    isArmed: boolean;
    emergencyStopped: boolean;

    
    alerts: HealthAlert[];

    
    telemetryHistory: TelemetrySnapshot[];
    static MAX_HISTORY = 120; 

    
    logs: string[];
    static MAX_LOGS = 200;

    constructor() {
        this.motorData = [0, 0];
        this.encoderTicks = [0, 0];
        this.sensorFlags = {
            imu: true,
            lidar: true,
            encoder: true,
            battery: true,
        };
        this.lidarPoints = [];
        this.heading = 0;
        this.pitch = 0;
        this.roll = 0;
        this.voltage = 12.6;
        this.batteryPercent = 100;
        this.isConnected = false;
        this.isArmed = false;
        this.emergencyStopped = false;
        this.alerts = [];
        this.telemetryHistory = [];
        this.logs = [];
    }

    
    updateState(data: Partial<RobotState>): void {
        Object.assign(this, data);
    }

    
    isValid(): boolean {
        return (
            this.motorData.length === 2 &&
            this.voltage >= 0 &&
            this.batteryPercent >= 0 &&
            this.batteryPercent <= 100
        );
    }

    
    getField<K extends keyof RobotState>(key: K): RobotState[K] {
        return this[key];
    }

    
    pushTelemetry(snapshot: TelemetrySnapshot): void {
        this.telemetryHistory.push(snapshot);
        if (this.telemetryHistory.length > RobotState.MAX_HISTORY) {
            this.telemetryHistory.shift();
        }
    }

    
    addLog(message: string): void {
        const ts = new Date().toLocaleTimeString();
        this.logs.unshift(`[${ts}] ${message}`);
        if (this.logs.length > RobotState.MAX_LOGS) {
            this.logs.pop();
        }
    }
}
