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
        <Card className="bg-zinc-900/60 border-zinc-700/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    Control Panel
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/30">
                    <div className="flex items-center gap-2">
                        {isArmed ? (
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                        ) : (
                            <ShieldOff className="w-4 h-4 text-zinc-500" />
                        )}
                        <span className="text-sm text-zinc-300">
                            {isArmed ? 'Armed' : 'Disarmed'}
                        </span>
                    </div>
                    <Switch
                        checked={isArmed}
                        onCheckedChange={setArmed}
                        disabled={!isConnected || emergencyStopped}
                    />
                </div>

                {emergencyStopped && (
                    <Badge variant="destructive" className="w-full justify-center py-1 animate-pulse">
                        ⚠️ Emergency Stop Active
                    </Badge>
                )}

                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                            <ArrowUp className="w-3 h-3" />
                            Linear Speed
                        </label>
                        <span className="text-xs font-mono text-cyan-400">{linearSpeed}%</span>
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

                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-zinc-400 flex items-center gap-1.5">
                            <RotateCw className="w-3 h-3" />
                            Turn Rate
                        </label>
                        <span className="text-xs font-mono text-cyan-400">{angularSpeed}%</span>
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

                
                <div className="space-y-2">
                    <label className="text-xs text-zinc-400">Movement</label>
                    <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
                        
                        <div />
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('forward')}
                        >
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                        <div />
                        
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('left')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600/50 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
                            disabled={controlsDisabled}
                            onClick={stopDrive}
                        >
                            <Square className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                            disabled={controlsDisabled}
                            onClick={() => sendDrive('right')}
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        
                        <div />
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
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
