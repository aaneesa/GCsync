import { useRobotStore } from '../store/useRobotStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, ZapOff, Wifi, WifiOff, ShieldAlert, ShieldCheck, Clock, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';


function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span className="font-mono tabular-nums">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
        </div>
    );
}


export function TopBar() {
    const isConnected = useRobotStore((s) => s.isConnected);
    const isArmed = useRobotStore((s) => s.isArmed);
    const emergencyStopped = useRobotStore((s) => s.emergencyStopped);
    const emergencyStop = useRobotStore((s) => s.emergencyStop);
    const resetEmergencyStop = useRobotStore((s) => s.resetEmergencyStop);
    const voltage = useRobotStore((s) => s.voltage);
    const batteryPercent = useRobotStore((s) => s.batteryPercent);
    const connectionStatus = useRobotStore((s) => s.connectionStatus);

    return (
        <header className="relative flex items-center justify-between px-5 py-2.5 glass-panel-strong border-b border-white/5 z-50">
            {/* Subtle scan line overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line" />
            </div>

            {/* ── Left: Logo & branding ── */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-smooth hover:shadow-cyan-500/40 hover:scale-105">
                        <Zap className="w-5 h-5 text-white drop-shadow-sm" />
                    </div>
                    {/* Connection indicator dot */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900 transition-colors duration-300 ${isConnected ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
                </div>
                <div>
                    <h1 className="text-base font-bold tracking-tight text-gradient-cyan">GCsync</h1>
                    <p className="text-[10px] text-zinc-500 -mt-0.5 tracking-wide uppercase">Ground Control</p>
                </div>
            </div>

            {/* ── Center: Status badges ── */}
            <div className="flex items-center gap-3">
                {/* Connection status */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-smooth ${
                    isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                    {isConnected ? (
                        <Wifi className="w-3.5 h-3.5" />
                    ) : (
                        <WifiOff className="w-3.5 h-3.5" />
                    )}
                    <span className="capitalize">{connectionStatus}</span>
                </div>

                {/* Armed status */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-smooth ${
                    isArmed
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 glow-amber'
                        : 'bg-zinc-800/50 text-zinc-500 border border-zinc-700/30'
                }`}>
                    {isArmed ? (
                        <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                        <ShieldAlert className="w-3.5 h-3.5" />
                    )}
                    {isArmed ? 'ARMED' : 'DISARMED'}
                </div>

                {/* Uplink indicator */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-800/30 border border-zinc-700/20">
                    <Radio className={`w-3 h-3 ${isConnected ? 'text-cyan-400 animate-breathing' : 'text-zinc-600'}`} />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Uplink</span>
                </div>

                {/* Battery & voltage */}
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800/30 border border-zinc-700/20">
                    <span className="text-xs font-mono text-zinc-400">{voltage.toFixed(1)}V</span>
                    <div className="w-px h-3 bg-zinc-700" />
                    <span className={`text-xs font-mono ${batteryPercent < 20 ? 'text-red-400 animate-pulse' : batteryPercent < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {batteryPercent}%
                    </span>
                </div>

                <LiveClock />
            </div>

            {/* ── Right: E-Stop ── */}
            <div className="flex items-center gap-2">
                {emergencyStopped && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 transition-smooth text-xs"
                        onClick={resetEmergencyStop}
                    >
                        Reset E-Stop
                    </Button>
                )}
                <Button
                    size="lg"
                    className={`font-bold tracking-wider transition-all duration-300 rounded-xl ${emergencyStopped
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50 animate-pulse glow-red'
                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-md shadow-red-900/30 hover:shadow-red-900/50'
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
