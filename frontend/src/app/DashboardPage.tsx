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
            {/* Background mesh gradient */}
            <div className="fixed inset-0 bg-mesh pointer-events-none z-0" />
            {/* Subtle grid overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 flex flex-col h-full">
                <TopBar />

                <div className="flex-1 grid grid-cols-[300px_1fr_300px] gap-3 p-3 min-h-0 animate-fade-in">
                    {/* Left panel — Controls */}
                    <div className="min-h-0 overflow-auto rounded-xl">
                        <ControlPanelView />
                    </div>

                    {/* Center panel — 3D Visualizer */}
                    <div className="min-h-0 rounded-xl">
                        <SpatialVisualizerView />
                    </div>

                    {/* Right panel — Health Monitor */}
                    <div className="min-h-0 overflow-auto rounded-xl">
                        <HealthMonitorView />
                    </div>
                </div>

                {/* Bottom panel — Telemetry */}
                <div className="px-3 pb-3 animate-slide-up" style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}>
                    <TelemetryPanel />
                </div>
            </div>
        </div>
    );
}
