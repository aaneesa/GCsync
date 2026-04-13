import type { LidarPoint } from "./SpatialVisualizer";

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
    private ipAddress: string;
    private port: number;
    private isConnected: boolean;
    private static instance: CommBridge;

    private onPacket: PacketHandler;
    private onStatusChange: (connected: boolean) => void;
    private ws: WebSocket | null = null;

    private constructor(
        ipAddress: string,
        port: number,
        onPacket: PacketHandler,
        onStatusChange: (connected: boolean) => void
    ) {
        this.ipAddress = ipAddress;
        this.port = port;
        this.onPacket = onPacket;
        this.onStatusChange = onStatusChange;
        this.isConnected = false;
    }

    public static getInstance(
        ipAddress?: string,
        port?: number,
        onPacket?: PacketHandler,
        onStatusChange?: (connected: boolean) => void
    ): CommBridge {
        if (!CommBridge.instance) {
            if (!ipAddress || !port || !onPacket || !onStatusChange) {
                throw new Error("Initial call to getInstance must provide arguments");
            }
            CommBridge.instance = new CommBridge(ipAddress, port, onPacket, onStatusChange);
        }
        return CommBridge.instance;
    }

    public connect(): void {
        if (this.ws) return;

        this.ws = new WebSocket(`ws://${this.ipAddress}:${this.port}`);

        this.ws.onopen = () => {
            this.isConnected = true;
            this.onStatusChange(true);
        };

        this.ws.onmessage = (event) => {
            const packet = this.parsePacket(event.data);
            if (packet) this.onPacket(packet);
        };

        this.ws.onclose = () => {
            this.isConnected = false;
            this.onStatusChange(false);
            this.ws = null;
        };
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    private parsePacket(raw: string): RobotPacket | null {
        try {
            return JSON.parse(raw) as RobotPacket;
        } catch {
            return null;
        }
    }

    private sendRaw(command: Record<string, unknown>): void {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify(command));
        }
    }
}