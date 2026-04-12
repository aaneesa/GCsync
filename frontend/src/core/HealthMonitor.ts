import { DashboardPanel } from './DashboardPanel';


export type AlertSeverity = 'info' | 'warning' | 'critical';


export interface HealthAlert {
    id: string;
    severity: AlertSeverity;
    message: string;
    timestamp: number;
}


export class HealthMonitor extends DashboardPanel {
    voltage: number;        
    batteryPercent: number; 
    ticks: number[];        
    alerts: HealthAlert[];

    
    static LOW_VOLTAGE_WARN = 11.0;    
    static LOW_VOLTAGE_CRIT = 10.0;    
    static LOW_BATTERY_WARN = 20;      

    constructor() {
        super('Health Monitor');
        this.voltage = 12.6;
        this.batteryPercent = 100;
        this.ticks = [0, 0];
        this.alerts = [];
    }

    
    updatePanel(data: Record<string, unknown>): void {
        if (typeof data.voltage === 'number') this.voltage = data.voltage;
        if (typeof data.batteryPercent === 'number') this.batteryPercent = data.batteryPercent;
        if (Array.isArray(data.ticks)) this.ticks = data.ticks as number[];
    }

    
    checkBattery(): HealthAlert[] {
        const newAlerts: HealthAlert[] = [];

        if (this.voltage <= HealthMonitor.LOW_VOLTAGE_CRIT) {
            newAlerts.push({
                id: crypto.randomUUID(),
                severity: 'critical',
                message: `Battery voltage critically low: ${this.voltage.toFixed(1)}V`,
                timestamp: Date.now(),
            });
        } else if (this.voltage <= HealthMonitor.LOW_VOLTAGE_WARN) {
            newAlerts.push({
                id: crypto.randomUUID(),
                severity: 'warning',
                message: `Battery voltage low: ${this.voltage.toFixed(1)}V`,
                timestamp: Date.now(),
            });
        }

        if (this.batteryPercent <= HealthMonitor.LOW_BATTERY_WARN) {
            newAlerts.push({
                id: crypto.randomUUID(),
                severity: 'warning',
                message: `Battery level low: ${this.batteryPercent}%`,
                timestamp: Date.now(),
            });
        }

        this.alerts = [...newAlerts, ...this.alerts].slice(0, 50); 
        return newAlerts;
    }

    
    warnLowVoltage(): boolean {
        return this.voltage <= HealthMonitor.LOW_VOLTAGE_CRIT;
    }
}
