import { useMemo } from 'react';
import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, ScrollText, Download, Activity, Zap } from 'lucide-react';


function RPMChart() {
    const telemetryHistory = useRobotStore((s) => s.telemetryHistory);

    const chartData = useMemo(
        () =>
            telemetryHistory.map((t, i) => ({
                idx: i,
                time: new Date(t.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
                leftRPM: Math.round(t.leftRPM),
                rightRPM: Math.round(t.rightRPM),
            })),
        [telemetryHistory],
    );

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#555' }}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <YAxis
                    tick={{ fontSize: 10, fill: '#555' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(24, 24, 27, 0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: 12,
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                    labelStyle={{ color: '#888' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <Line
                    type="monotone"
                    dataKey="leftRPM"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    name="Left RPM"
                    strokeLinecap="round"
                />
                <Line
                    type="monotone"
                    dataKey="rightRPM"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    name="Right RPM"
                    strokeLinecap="round"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}


function VoltageChart() {
    const telemetryHistory = useRobotStore((s) => s.telemetryHistory);

    const chartData = useMemo(
        () =>
            telemetryHistory.map((t, i) => ({
                idx: i,
                time: new Date(t.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
                voltage: Math.round(t.voltage * 100) / 100,
                battery: t.batteryPercent,
            })),
        [telemetryHistory],
    );

    return (
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#555' }}
                    interval="preserveStartEnd"
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <YAxis
                    yAxisId="voltage"
                    tick={{ fontSize: 10, fill: '#555' }}
                    domain={[9, 13]}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <YAxis
                    yAxisId="battery"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#555' }}
                    domain={[0, 100]}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(24, 24, 27, 0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: 12,
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    }}
                    labelStyle={{ color: '#888' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                <Line
                    yAxisId="voltage"
                    type="monotone"
                    dataKey="voltage"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Voltage (V)"
                    strokeLinecap="round"
                />
                <Line
                    yAxisId="battery"
                    type="monotone"
                    dataKey="battery"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Battery (%)"
                    strokeLinecap="round"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}


function LogViewer() {
    const logs = useRobotStore((s) => s.logs);

    return (
        <ScrollArea className="h-[170px]">
            {logs.length === 0 ? (
                <div className="text-center py-8">
                    <ScrollText className="w-5 h-5 text-zinc-700 mx-auto mb-1.5" />
                    <p className="text-xs text-zinc-600">No logs yet</p>
                </div>
            ) : (
                <div className="space-y-0.5 pr-4">
                    {logs.map((log, i) => (
                        <p
                            key={i}
                            className={`text-[11px] font-mono leading-relaxed px-2 py-0.5 rounded ${
                                i === 0
                                    ? 'text-zinc-300 bg-zinc-800/30'
                                    : 'text-zinc-500'
                            }`}
                        >
                            {log}
                        </p>
                    ))}
                </div>
            )}
        </ScrollArea>
    );
}


export function TelemetryPanel() {
    const telemetryHistory = useRobotStore((s) => s.telemetryHistory);
    const logs = useRobotStore((s) => s.logs);

    const exportSession = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            telemetry: telemetryHistory,
            logs,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gc-session-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="glass-panel rounded-xl border-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        Telemetry
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-zinc-700/30 bg-zinc-800/30 text-zinc-500 text-[9px] rounded-lg">
                            {telemetryHistory.length} samples
                        </Badge>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-smooth"
                            onClick={exportSession}
                        >
                            <Download className="w-3 h-3 mr-1" />
                            Export
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <Tabs defaultValue="rpm" className="w-full">
                    <TabsList className="bg-zinc-800/30 border border-zinc-700/15 mb-3 rounded-xl p-1 h-auto">
                        <TabsTrigger
                            value="rpm"
                            className="text-xs data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:shadow-none rounded-lg transition-all duration-200 gap-1"
                        >
                            <Activity className="w-3 h-3" />
                            RPM
                        </TabsTrigger>
                        <TabsTrigger
                            value="voltage"
                            className="text-xs data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-none rounded-lg transition-all duration-200 gap-1"
                        >
                            <Zap className="w-3 h-3" />
                            Voltage
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            className="text-xs data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:shadow-none rounded-lg transition-all duration-200 gap-1"
                        >
                            <ScrollText className="w-3 h-3" />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rpm">
                        <RPMChart />
                    </TabsContent>

                    <TabsContent value="voltage">
                        <VoltageChart />
                    </TabsContent>

                    <TabsContent value="logs">
                        <LogViewer />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
