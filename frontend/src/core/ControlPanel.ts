import { DashboardPanel } from './DashboardPanel';


export interface DriveCommand {
    linear: number;  
    angular: number; 
}


export class ControlPanel extends DashboardPanel {
    isArmed: boolean;
    targetSpeed: number; 
    targetTurn: number;  

    constructor() {
        super('Control Panel');
        this.isArmed = false;
        this.targetSpeed = 0;
        this.targetTurn = 0;
    }

    
    updatePanel(data: Record<string, unknown>): void {
        if (typeof data.isArmed === 'boolean') this.isArmed = data.isArmed;
        if (typeof data.targetSpeed === 'number') this.targetSpeed = data.targetSpeed;
        if (typeof data.targetTurn === 'number') this.targetTurn = data.targetTurn;
    }

    
    sendDriveCmd(v: number, w: number): DriveCommand {
        if (!this.isArmed) {
            console.warn('[ControlPanel] Cannot send drive command — robot is disarmed.');
            return { linear: 0, angular: 0 };
        }
        return { linear: v, angular: w };
    }

    
    emergencyStop(): DriveCommand {
        this.isArmed = false;
        this.targetSpeed = 0;
        this.targetTurn = 0;
        console.warn('[ControlPanel] 🛑 EMERGENCY STOP ENGAGED');
        return { linear: 0, angular: 0 };
    }
}
