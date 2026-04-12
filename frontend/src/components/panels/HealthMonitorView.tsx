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
    Zap,
} from 'lucide-react';


function BatteryGauge({ percent, voltage }: { percent: number; voltage: number }) {
    const getColor = () => {
        if (percent > 60) return 'from-emerald-500 to-emerald-400';
        if (percent > 30) return 'from-amber-500 to-amber-400';
        return 'from-red-500 to-red-400';
    };

    const getGlow = () => {
        if (percent > 60) return 'shadow-emerald-500/20';
        if (percent > 30) return 'shadow-amber-500/20';
        return 'shadow-red-500/20';
    };

    const getIcon = () => {
        if (percent > 50) return <Battery className="w-5 h-5 text-emerald-400" />;
        if (percent > 20) return <BatteryWarning className="w-5 h-5 text-amber-400" />;
        return <BatteryLow className="w-5 h-5 text-red-400 animate-pulse" />;
    };

    return (
        <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/15 space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/20">
                        {getIcon()}
                    </div>
                    <div>
                        <span className="text-sm font-medium text-zinc-300">Battery</span>
                        <p className="text-[10px] text-zinc-600">System power</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-2xl font-bold tabular-nums ${percent > 60 ? 'text-emerald-400' : percent > 30 ? 'text-amber-400' : 'text-red-400'}`}>
                        {percent}
                    </span>
                    <span className="text-sm text-zinc-500 ml-0.5">%</span>
                    <p className="text-[10px] font-mono text-zinc-500">{voltage.toFixed(2)}V</p>
                </div>
            </div>
            <div className={`h-2 bg-zinc-800 rounded-full overflow-hidden shadow-inner ${getGlow()}`}>
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-700 ease-out`}
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
        { key: 'battery', label: 'Battery', icon: Zap },
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {sensors.map(({ key, label, icon: Icon }) => {
                const ok = sensorFlags[key] ?? false;
                return (
                    <div
                        key={key}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all duration-300 ${ok
                            ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/8 border-red-500/20 text-red-400 animate-pulse'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded flex items-center justify-center ${ok ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            <Icon className="w-3 h-3" />
                        </div>
                        <span className="font-medium">{label}</span>
                        {ok ? (
                            <CheckCircle className="w-3 h-3 ml-auto opacity-70" />
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
        <Card className="glass-panel rounded-xl h-full flex flex-col border-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    Health Monitor
                    <Badge variant="outline" className="ml-auto text-[9px] border-zinc-700 text-zinc-500 uppercase tracking-wider">
                        Panel
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-auto">
                {/* Battery */}
                <BatteryGauge percent={batteryPercent} voltage={voltage} />

                {/* Motor Data */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/15 text-center group hover:border-cyan-500/20 transition-colors duration-200">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Left RPM</p>
                        <p className="text-xl font-mono font-bold text-cyan-400 tabular-nums mt-0.5">{motorData[0]?.toFixed(0) ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/15 text-center group hover:border-purple-500/20 transition-colors duration-200">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Right RPM</p>
                        <p className="text-xl font-mono font-bold text-purple-400 tabular-nums mt-0.5">{motorData[1]?.toFixed(0) ?? 0}</p>
                    </div>
                </div>

                {/* Encoder Ticks */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-zinc-800/30 border border-zinc-700/15 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-wider">L Ticks</p>
                        <p className="text-sm font-mono text-zinc-300 mt-0.5 tabular-nums">{encoderTicks[0]?.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-800/30 border border-zinc-700/15 text-center">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-wider">R Ticks</p>
                        <p className="text-sm font-mono text-zinc-300 mt-0.5 tabular-nums">{encoderTicks[1]?.toLocaleString()}</p>
                    </div>
                </div>

                <Separator className="bg-zinc-700/15" />

                {/* Sensor Status */}
                <div>
                    <p className="text-xs text-zinc-400 mb-2.5 font-medium">Sensor Status</p>
                    <SensorStatus />
                </div>

                <Separator className="bg-zinc-700/15" />

                {/* Alerts */}
                <div className="flex-1 min-h-0">
                    <div className="flex items-center justify-between mb-2.5">
                        <p className="text-xs text-zinc-400 font-medium">Alerts</p>
                        {alerts.length > 0 && (
                            <Badge variant="destructive" className="text-[9px] h-4 px-1.5 rounded-md">
                                {alerts.length}
                            </Badge>
                        )}
                    </div>
                    <ScrollArea className="h-32">
                        {alerts.length === 0 ? (
                            <div className="text-center py-6">
                                <CheckCircle className="w-5 h-5 text-zinc-700 mx-auto mb-1.5" />
                                <p className="text-xs text-zinc-600">All systems nominal</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {alerts.slice(0, 10).map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`flex items-start gap-2 p-2.5 rounded-xl text-xs border transition-all duration-200 ${alert.severity === 'critical'
                                            ? 'bg-red-500/8 border-red-500/20 text-red-400'
                                            : alert.severity === 'warning'
                                                ? 'bg-amber-500/8 border-amber-500/20 text-amber-400'
                                                : 'bg-blue-500/8 border-blue-500/20 text-blue-400'
                                        }`}
                                    >
                                        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium">{alert.message}</p>
                                            <p className="text-[10px] opacity-50 mt-0.5">
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
