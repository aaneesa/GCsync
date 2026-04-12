
export abstract class DashboardPanel {
    panelTitle: string;
    isVisible: boolean;

    constructor(title: string) {
        this.panelTitle = title;
        this.isVisible = true;
    }

    
    abstract updatePanel(data: Record<string, unknown>): void;

    
    show(): void {
        this.isVisible = true;
    }

    
    hide(): void {
        this.isVisible = false;
    }
}
