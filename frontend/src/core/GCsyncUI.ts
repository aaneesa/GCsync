import { DashboardPanel } from './DashboardPanel';
import { ControlPanel } from './ControlPanel';
import { HealthMonitor } from './HealthMonitor';
import { SpatialVisualizer } from './SpatialVisualizer';

/**
 * GCsyncUI — Top-level orchestrator that *composes* DashboardPanel instances.
 *
 * Matches the UML class diagram:
 *   GCsyncUI ◆── DashboardPanel  (composition)
 *
 * Responsibilities:
 *   • Owns and manages the lifecycle of every panel
 *   • Broadcasts data updates to all visible panels
 *   • Handles connection / emergency-stop state transitions
 */
export class GCsyncUI {
    connectionStatus: string;
    private isEmergencyStopped: boolean;

    /** Composed panel instances (composition relationship) */
    private panels: DashboardPanel[];

    /** Named references for quick access */
    readonly controlPanel: ControlPanel;
    readonly healthMonitor: HealthMonitor;
    readonly spatialVisualizer: SpatialVisualizer;

    constructor() {
        this.connectionStatus = 'disconnected';
        this.isEmergencyStopped = false;

        this.controlPanel = new ControlPanel();
        this.healthMonitor = new HealthMonitor();
        this.spatialVisualizer = new SpatialVisualizer();

        this.panels = [
            this.controlPanel,
            this.healthMonitor,
            this.spatialVisualizer,
        ];
    }

    /**
     * Initialise all composed panels and set initial connection status.
     */
    init(): void {
        this.connectionStatus = 'initializing';
        this.panels.forEach((p) => p.show());
        console.log('[GCsyncUI] Initialized with', this.panels.length, 'panels');
    }

    /**
     * Push a data payload to every *visible* panel.
     */
    updateAllPanels(data: Record<string, unknown>): void {
        this.panels.forEach((panel) => {
            if (panel.isVisible) {
                panel.updatePanel(data);
            }
        });
    }

    /**
     * Transition into the disconnected state:
     *  – mark connection lost
     *  – disable controls on the ControlPanel
     */
    handleDisconnect(): void {
        this.connectionStatus = 'disconnected';
        this.controlPanel.isArmed = false;
        console.log('[GCsyncUI] Handling disconnect — all controls disarmed');
    }

    /**
     * Transition into the connected state.
     */
    handleConnect(): void {
        this.connectionStatus = 'connected';
        console.log('[GCsyncUI] Connected');
    }

    /**
     * Engage emergency stop across the whole UI.
     */
    triggerEmergencyStop(): void {
        this.isEmergencyStopped = true;
        this.controlPanel.emergencyStop();
        console.log('[GCsyncUI] 🛑 Emergency stop triggered');
    }

    /**
     * Reset emergency stop state.
     */
    resetEmergencyStop(): void {
        this.isEmergencyStopped = false;
        console.log('[GCsyncUI] ✅ Emergency stop reset');
    }

    /** Check emergency stop state */
    getEmergencyStopped(): boolean {
        return this.isEmergencyStopped;
    }

    /** Add a panel dynamically (extends the composition at runtime) */
    addPanel(panel: DashboardPanel): void {
        this.panels.push(panel);
    }

    /** Remove a panel by title */
    removePanel(title: string): boolean {
        const idx = this.panels.findIndex((p) => p.panelTitle === title);
        if (idx !== -1) {
            this.panels.splice(idx, 1);
            return true;
        }
        return false;
    }

    /** Look up a panel by its title */
    getPanelByTitle(title: string): DashboardPanel | undefined {
        return this.panels.find((p) => p.panelTitle === title);
    }

    /** Get all registered panels */
    getAllPanels(): DashboardPanel[] {
        return [...this.panels];
    }

    /** Get the count of visible panels */
    getVisiblePanelCount(): number {
        return this.panels.filter((p) => p.isVisible).length;
    }
}
