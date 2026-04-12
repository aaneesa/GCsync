import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Square,
    ShieldCheck,
    ShieldOff,
    Gauge,
    RotateCw,
    Gamepad2,
} from 'lucide-react';
import { useState } from 'react';


export function ControlPanelView() {
    const isConnected = useRobotStore((s) => s.isConnected);
    const isArmed = useRobotStore((s) => s.isArmed);
    const emergencyStopped = useRobotStore((s) => s.emergencyStopped);
    const setArmed = useRobotStore((s) => s.setArmed);
    const addLog = useRobotStore((s) => s.addLog);

    const [linearSpeed, setLinearSpeed] = useState(50);
    const [angularSpeed, setAngularSpeed] = useState(50);

    const controlsDisabled = !isConnected || !isArmed || emergencyStopped;

    const sendDrive = (direction: string) => {
        if (controlsDisabled) return;
        const v = direction === 'forward' ? linearSpeed : direction === 'backward' ? -linearSpeed : 0;
        const w = direction === 'left' ? angularSpeed : direction === 'right' ? -angularSpeed : 0;
        addLog(`🎮 Drive: ${direction} (v=${v}%, w=${w}%)`);
    };

    const stopDrive = () => {
        addLog('🛑 Drive: STOP');
    };

    return (
        <Card className="glass-panel rounded-xl h-full border-0 animate-fade-in">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    Control Panel
                    <Badge variant="outline" className="ml-auto text-[9px] border-zinc-700 text-zinc-500 uppercase tracking-wider">
                        Panel
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Arm/Disarm Toggle */}
                <div className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isArmed
                        ? 'bg-amber-500/5 border border-amber-500/15 glow-amber'
                        : 'bg-zinc-800/40 border border-zinc-700/20'
                }`}>
                    <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                            isArmed ? 'bg-amber-500/15' : 'bg-zinc-700/30'
                        }`}>
                            {isArmed ? (
                                <ShieldCheck className="w-4 h-4 text-amber-400" />
                            ) : (
                                <ShieldOff className="w-4 h-4 text-zinc-500" />
                            )}
                        </div>
                        <div>
                            <span className={`text-sm font-medium ${isArmed ? 'text-amber-400' : 'text-zinc-400'}`}>
                                {isArmed ? 'Armed' : 'Disarmed'}
                            </span>
                            <p className="text-[10px] text-zinc-600">{isArmed ? 'Motors active' : 'Motors locked'}</p>
                        </div>
                    </div>
                    <Switch
                        checked={isArmed}
                        onCheckedChange={setArmed}
                        disabled={!isConnected || emergencyStopped}
                    />
                </div>

                {emergencyStopped && (
                    <div className="w-full py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center animate-pulse glow-red">
                        <span className="text-xs font-semibold text-red-400">⚠️ Emergency Stop Active</span>
                    </div>
                )}

                {/* Linear Speed Slider */}
                <div className="space-y-2 p-3 rounded-xl bg-zinc-800/25 border border-zinc-700/15">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                            <ArrowUp className="w-3 h-3 text-cyan-400/60" />
                            Linear Speed
                        </label>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">{linearSpeed}%</span>
                    </div>
                    <Slider
                        value={[linearSpeed]}
                        onValueChange={([v]) => setLinearSpeed(v)}
                        max={100}
                        step={5}
                        disabled={controlsDisabled}
                        className="cursor-pointer"
                    />
                </div>

                {/* Angular Speed Slider */}
                <div className="space-y-2 p-3 rounded-xl bg-zinc-800/25 border border-zinc-700/15">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                            <RotateCw className="w-3 h-3 text-purple-400/60" />
                            Turn Rate
                        </label>
                        <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">{angularSpeed}%</span>
                    </div>
                    <Slider
                        value={[angularSpeed]}
                        onValueChange={([v]) => setAngularSpeed(v)}
                        max={100}
                        step={5}
                        disabled={controlsDisabled}
                        className="cursor-pointer"
                    />
                </div>

                {/* D-Pad Movement Controls */}
                <div className="space-y-2">
                    <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                        <Gamepad2 className="w-3.5 h-3.5 text-zinc-500" />
                        Movement
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                        <div />
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700/40 bg-zinc-800/30 text-zinc-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 hover:glow-cyan transition-all duration-200 rounded-xl h-10"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('forward')}
                        >
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                        <div />

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700/40 bg-zinc-800/30 text-zinc-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-200 rounded-xl h-10"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('left')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600/30 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/40 transition-all duration-200 rounded-xl h-10"
                            disabled={controlsDisabled}
                            onClick={stopDrive}
                        >
                            <Square className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700/40 bg-zinc-800/30 text-zinc-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-200 rounded-xl h-10"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('right')}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <div />
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700/40 bg-zinc-800/30 text-zinc-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-200 rounded-xl h-10"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('backward')}
                        >
                            <ArrowDown className="w-4 h-4" />
                        </Button>
                        <div />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
