import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
    Activity,
    Battery,
    BatteryLow,
    BatteryWarning,
    Gauge,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Cpu,
} from 'lucide-react';


function BatteryGauge({ percent, voltage }: { percent: number; voltage: number }) {
    const getColor = () => {
        if (percent > 60) return 'bg-emerald-500';
        if (percent > 30) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getIcon = () => {
        if (percent > 50) return <Battery className="w-5 h-5 text-emerald-400" />;
        if (percent > 20) return <BatteryWarning className="w-5 h-5 text-amber-400" />;
        return <BatteryLow className="w-5 h-5 text-red-400 animate-pulse" />;
    };

    return (
        <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span className="text-sm text-zinc-300">Battery</span>
                </div>
                <div className="text-right">
                    <span className="text-lg font-bold text-zinc-100">{percent}%</span>
                    <span className="text-xs text-zinc-500 ml-1">{voltage.toFixed(2)}V</span>
                </div>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}


function SensorStatus() {
    const sensorFlags = useRobotStore((s) => s.sensorFlags);

    const sensors = [
        { key: 'imu', label: 'IMU', icon: Cpu },
        { key: 'lidar', label: 'LiDAR', icon: Activity },
        { key: 'encoder', label: 'Encoder', icon: Gauge },
        { key: 'battery', label: 'Battery', icon: Battery },
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {sensors.map(({ key, label, icon: Icon }) => {
                const ok = sensorFlags[key] ?? false;
                return (
                    <div
                        key={key}
                        className={`flex items-center gap-2 p-2 rounded-md border text-xs ${ok
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                        {ok ? (
                            <CheckCircle className="w-3 h-3 ml-auto" />
                        ) : (
                            <XCircle className="w-3 h-3 ml-auto" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}


export function HealthMonitorView() {
    const voltage = useRobotStore((s) => s.voltage);
    const batteryPercent = useRobotStore((s) => s.batteryPercent);
    const encoderTicks = useRobotStore((s) => s.encoderTicks);
    const alerts = useRobotStore((s) => s.alerts);
    const motorData = useRobotStore((s) => s.motorData);

    return (
        <Card className="bg-zinc-900/60 border-zinc-700/50 backdrop-blur-sm h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Health Monitor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-auto">
                
                <BatteryGauge percent={batteryPercent} voltage={voltage} />

                
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Left RPM</p>
                        <p className="text-lg font-mono font-bold text-cyan-400">{motorData[0]?.toFixed(0) ?? 0}</p>
                    </div>
                    <div className="p-2 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Right RPM</p>
                        <p className="text-lg font-mono font-bold text-cyan-400">{motorData[1]?.toFixed(0) ?? 0}</p>
                    </div>
                </div>

                
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">L Ticks</p>
                        <p className="text-sm font-mono text-zinc-300">{encoderTicks[0]?.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-center">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">R Ticks</p>
                        <p className="text-sm font-mono text-zinc-300">{encoderTicks[1]?.toLocaleString()}</p>
                    </div>
                </div>

                <Separator className="bg-zinc-700/30" />

                
                <div>
                    <p className="text-xs text-zinc-400 mb-2">Sensor Status</p>
                    <SensorStatus />
                </div>

                <Separator className="bg-zinc-700/30" />

                
                <div className="flex-1 min-h-0">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-zinc-400">Alerts</p>
                        {alerts.length > 0 && (
                            <Badge variant="destructive" className="text-[10px]">
                                {alerts.length}
                            </Badge>
                        )}
                    </div>
                    <ScrollArea className="h-32">
                        {alerts.length === 0 ? (
                            <p className="text-xs text-zinc-600 text-center py-4">No alerts</p>
                        ) : (
                            <div className="space-y-1.5">
                                {alerts.slice(0, 10).map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`flex items-start gap-2 p-2 rounded-md text-xs border ${alert.severity === 'critical'
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                                : alert.severity === 'warning'
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                    : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                            }`}
                                    >
                                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate">{alert.message}</p>
                                            <p className="text-[10px] opacity-60">
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
