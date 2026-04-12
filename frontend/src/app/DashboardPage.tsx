import { TopBar } from '../components/TopBar';
import { ControlPanelView } from '../components/panels/ControlPanelView';
import { SpatialVisualizerView } from '../components/panels/SpatialVisualizerView';
import { HealthMonitorView } from '../components/panels/HealthMonitorView';
import { TelemetryPanel } from '../components/panels/TelemetryPanel';
import { useWebSocket } from '../hooks/useWebSocket';

export function DashboardPage() {
    useWebSocket('ws://localhost:9090', true);

    return (
        <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
            <TopBar />

            <div className="flex-1 grid grid-cols-[280px_1fr_280px] gap-3 p-3 min-h-0">
                <div className="min-h-0 overflow-auto">
                    <ControlPanelView />
                </div>

                <div className="min-h-0">
                    <SpatialVisualizerView />
                </div>

                <div className="min-h-0 overflow-auto">
                    <HealthMonitorView />
                </div>
            </div>

            <div className="px-3 pb-3">
                <TelemetryPanel />
            </div>
        </div>
    );
}
