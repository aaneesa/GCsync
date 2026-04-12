import { useRobotStore } from '../store/useRobotStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, ZapOff, Wifi, WifiOff, ShieldAlert, ShieldCheck } from 'lucide-react';


export function TopBar() {
    const isConnected = useRobotStore((s) => s.isConnected);
    const isArmed = useRobotStore((s) => s.isArmed);
    const emergencyStopped = useRobotStore((s) => s.emergencyStopped);
    const emergencyStop = useRobotStore((s) => s.emergencyStop);
    const resetEmergencyStop = useRobotStore((s) => s.resetEmergencyStop);
    const voltage = useRobotStore((s) => s.voltage);
    const batteryPercent = useRobotStore((s) => s.batteryPercent);

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50">

            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">GCsync</h1>
                    <p className="text-[11px] text-zinc-400 -mt-0.5">Robot Ground Control Dashboard</p>
                </div>
            </div>


            <div className="flex items-center gap-4">

                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <Wifi className="w-4 h-4 text-emerald-400" />
                    ) : (
                        <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <Badge
                        variant={isConnected ? 'default' : 'destructive'}
                        className={`text-xs ${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}`}
                    >
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                </div>


                <div className="flex items-center gap-2">
                    {isArmed ? (
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                        <ShieldAlert className="w-4 h-4 text-zinc-400" />
                    )}
                    <Badge
                        variant="outline"
                        className={`text-xs ${isArmed
                            ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                            : 'border-zinc-600 text-zinc-400'
                            }`}
                    >
                        {isArmed ? 'ARMED' : 'DISARMED'}
                    </Badge>
                </div>


                <div className="hidden md:flex items-center gap-3 text-xs text-zinc-400">
                    <span>{voltage.toFixed(1)}V</span>
                    <span className="text-zinc-600">|</span>
                    <span className={batteryPercent < 20 ? 'text-red-400' : ''}>{batteryPercent}%</span>
                </div>
            </div>


            <div className="flex items-center gap-2">
                {emergencyStopped && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        onClick={resetEmergencyStop}
                    >
                        Reset E-Stop
                    </Button>
                )}
                <Button
                    size="lg"
                    className={`font-bold tracking-wide transition-all duration-200 ${emergencyStopped
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50 animate-pulse'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-900/30'
                        }`}
                    onClick={emergencyStop}
                >
                    {emergencyStopped ? (
                        <ZapOff className="w-4 h-4 mr-2" />
                    ) : (
                        <Zap className="w-4 h-4 mr-2" />
                    )}
                    E-STOP
                </Button>
            </div>
        </header>
    );
}
