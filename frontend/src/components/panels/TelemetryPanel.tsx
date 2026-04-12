import { useMemo } from 'react';
import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, ScrollText, Download } from 'lucide-react';


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
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#666' }}
                    interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', fontSize: 12 }}
                    labelStyle={{ color: '#999' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                    type="monotone"
                    dataKey="leftRPM"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    name="Left RPM"
                />
                <Line
                    type="monotone"
                    dataKey="rightRPM"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    name="Right RPM"
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
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#666' }}
                    interval="preserveStartEnd"
                />
                <YAxis yAxisId="voltage" tick={{ fontSize: 10, fill: '#666' }} domain={[9, 13]} />
                <YAxis yAxisId="battery" orientation="right" tick={{ fontSize: 10, fill: '#666' }} domain={[0, 100]} />
                <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', fontSize: 12 }}
                    labelStyle={{ color: '#999' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                    yAxisId="voltage"
                    type="monotone"
                    dataKey="voltage"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Voltage (V)"
                />
                <Line
                    yAxisId="battery"
                    type="monotone"
                    dataKey="battery"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Battery (%)"
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
                <p className="text-xs text-zinc-600 text-center py-8">No logs yet</p>
            ) : (
                <div className="space-y-0.5 pr-4">
                    {logs.map((log, i) => (
                        <p key={i} className="text-[11px] font-mono text-zinc-400 leading-relaxed">
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
        <Card className="bg-zinc-900/60 border-zinc-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        Telemetry
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-zinc-600 text-zinc-400 text-[10px]">
                            {telemetryHistory.length} samples
                        </Badge>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-zinc-400 hover:text-zinc-200"
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
                    <TabsList className="bg-zinc-800/50 border border-zinc-700/30 mb-3">
                        <TabsTrigger value="rpm" className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-cyan-400">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            RPM
                        </TabsTrigger>
                        <TabsTrigger value="voltage" className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-amber-400">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Voltage
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-emerald-400">
                            <ScrollText className="w-3 h-3 mr-1" />
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
