import type { LidarPoint } from './SpatialVisualizer';

export interface TelemetryPacket {
    type: 'telemetry';
    leftRPM: number;
    rightRPM: number;
    voltage: number;
    batteryPercent: number;
    encoderTicks: number[];
}

export interface SpatialPacket {
    type: 'spatial';
    lidarPoints: LidarPoint[];
    heading: number;
    pitch: number;
    roll: number;
}

export interface StatusPacket {
    type: 'status';
    sensorFlags: Record<string, boolean>;
}

export type RobotPacket = TelemetryPacket | SpatialPacket | StatusPacket;

export type PacketHandler = (packet: RobotPacket) => void;

export class CommBridge {
    private ws: WebSocket | null = null;
    private url: string;
    private onPacket: PacketHandler;
    private onStatusChange: (connected: boolean) => void;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        url: string,
        onPacket: PacketHandler,
        onStatusChange: (connected: boolean) => void,
    ) {
        this.url = url;
        this.onPacket = onPacket;
        this.onStatusChange = onStatusChange;
    }

    connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('[CommBridge] ✅ Connected to', this.url);
                this.onStatusChange(true);
            };

            this.ws.onmessage = (event: MessageEvent) => {
                const packet = this.parsePacket(event.data);
                if (packet) this.onPacket(packet);
            };

            this.ws.onclose = () => {
                console.log('[CommBridge] ❌ Disconnected');
                this.onStatusChange(false);
                this.scheduleReconnect();
            };

            this.ws.onerror = (err) => {
                console.error('[CommBridge] WebSocket error:', err);
                this.ws?.close();
            };
        } catch (err) {
            console.error('[CommBridge] Failed to connect:', err);
            this.onStatusChange(false);
        }
    }

    disconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.ws) {
            this.ws.onclose = null;
            this.ws.close();
            this.ws = null;
            this.onStatusChange(false);
            console.log('[CommBridge] 🔌 Manually disconnected');
        }
    }

    parsePacket(raw: string): RobotPacket | null {
        try {
            const data = JSON.parse(raw);
            if (data && typeof data.type === 'string') {
                return data as RobotPacket;
            }
            console.warn('[CommBridge] Unknown packet shape:', data);
            return null;
        } catch {
            console.warn('[CommBridge] Failed to parse message:', raw);
            return null;
        }
    }

    sendRaw(command: Record<string, unknown>): boolean {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('[CommBridge] Cannot send — not connected');
            return false;
        }
        this.ws.send(JSON.stringify(command));
        return true;
    }

    private scheduleReconnect(): void {
        this.reconnectTimer = setTimeout(() => {
            console.log('[CommBridge] Attempting reconnect...');
            this.connect();
        }, 3000);
    }
}
