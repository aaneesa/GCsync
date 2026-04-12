import { useEffect, useRef, useCallback } from 'react';
import { useRobotStore } from '../store/useRobotStore';
import { CommBridge } from '../core';
import type { RobotPacket, LidarPoint } from '../core';


function generateDummyLidarPoints(count: number): LidarPoint[] {
    const points: LidarPoint[] = [];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * i) / count - Math.PI / 2; 
        const distance = 2 + Math.random() * 3; 
        const noise = (Math.random() - 0.5) * 0.3;
        points.push({
            x: Math.cos(angle) * (distance + noise),
            y: Math.sin(angle) * (distance + noise),
            z: (Math.random() - 0.5) * 0.5, 
            intensity: 0.3 + Math.random() * 0.7,
        });
    }
    for (let i = 0; i < 20; i++) {
        const wallX = 4 + (Math.random() - 0.5) * 0.2;
        const wallY = -2 + (i / 20) * 4;
        points.push({ x: wallX, y: wallY, z: (Math.random() - 0.5) * 0.3, intensity: 0.8 });
    }
    return points;
}

/**
 * useWebSocket - Custom hook that manages the WebSocket connection.
 *
 * In real usage, set `wsUrl` to the robot's WebSocket endpoint.
 * When `useDummyData` is true (default), it simulates telemetry at ~2 Hz
 * so the dashboard works without a real robot.
 *
 * Data flow: WebSocket → CommBridge.parsePacket() → Zustand Store → Panels
 */
export function useWebSocket(
    wsUrl: string = 'ws://localhost:9090',
    useDummyData: boolean = true,
) {
    const bridgeRef = useRef<CommBridge | null>(null);
    const dummyTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Pull actions from the store
    const {
        setConnected,
        updateMotorData,
        updateEncoderTicks,
        updateSpatial,
        updateHealth,
        updateSensorFlags,
        pushTelemetry,
        addLog,
        addAlert,
    } = useRobotStore.getState();

    /**
     * Handle a parsed packet from CommBridge and dispatch to Zustand store.
     */
    const handlePacket = useCallback((packet: RobotPacket) => {
        const store = useRobotStore.getState();

        switch (packet.type) {
            case 'telemetry':
                store.updateMotorData([packet.leftRPM, packet.rightRPM]);
                store.updateEncoderTicks(packet.encoderTicks);
                store.updateHealth(packet.voltage, packet.batteryPercent);
                store.pushTelemetry({
                    timestamp: Date.now(),
                    leftRPM: packet.leftRPM,
                    rightRPM: packet.rightRPM,
                    voltage: packet.voltage,
                    batteryPercent: packet.batteryPercent,
                });
                break;
            case 'spatial':
                store.updateSpatial(packet.lidarPoints, packet.heading, packet.pitch, packet.roll);
                break;
            case 'status':
                store.updateSensorFlags(packet.sensorFlags);
                // Generate alerts for disconnected sensors
                Object.entries(packet.sensorFlags).forEach(([sensor, ok]) => {
                    if (!ok) {
                        store.addAlert({
                            id: crypto.randomUUID(),
                            severity: 'warning',
                            message: `Sensor disconnected: ${sensor}`,
                            timestamp: Date.now(),
                        });
                    }
                });
                break;
        }
    }, []);

    /**
     * Start a dummy data generator that simulates realistic robot telemetry.
     */
    const startDummyData = useCallback(() => {
        // Mark as "connected" immediately
        setConnected(true);
        addLog('🧪 Running in SIMULATION mode with dummy data');

        let tick = 0;
        let headingDeg = 0;
        let totalTicksL = 0;
        let totalTicksR = 0;
        let batteryVolts = 12.6;

        dummyTimerRef.current = setInterval(() => {
            tick++;
            const store = useRobotStore.getState();

            // Slowly drain battery
            batteryVolts = Math.max(9.5, batteryVolts - 0.002);
            const batteryPct = Math.max(0, Math.round(((batteryVolts - 9.5) / 3.1) * 100));

            // Simulate RPM (sinusoidal variation)
            const leftRPM = store.isArmed ? 120 + Math.sin(tick * 0.1) * 30 + (Math.random() - 0.5) * 10 : 0;
            const rightRPM = store.isArmed ? 115 + Math.cos(tick * 0.12) * 25 + (Math.random() - 0.5) * 10 : 0;

            // Encoder ticks
            totalTicksL += Math.round(leftRPM / 10);
            totalTicksR += Math.round(rightRPM / 10);

            // Heading drift
            headingDeg = (headingDeg + 0.5 + Math.random() * 0.3) % 360;

            // Push telemetry packet
            handlePacket({
                type: 'telemetry',
                leftRPM: Math.round(leftRPM * 10) / 10,
                rightRPM: Math.round(rightRPM * 10) / 10,
                voltage: Math.round(batteryVolts * 100) / 100,
                batteryPercent: batteryPct,
                encoderTicks: [totalTicksL, totalTicksR],
            });

            // Push spatial data every other tick
            if (tick % 2 === 0) {
                handlePacket({
                    type: 'spatial',
                    lidarPoints: generateDummyLidarPoints(80),
                    heading: headingDeg,
                    pitch: Math.sin(tick * 0.05) * 3,
                    roll: Math.cos(tick * 0.07) * 2,
                });
            }

            // Occasional sensor status
            if (tick % 10 === 0) {
                handlePacket({
                    type: 'status',
                    sensorFlags: {
                        imu: true,
                        lidar: Math.random() > 0.05, // 5% chance of "disconnect"
                        encoder: true,
                        battery: true,
                    },
                });
            }

            // Low battery alert
            if (batteryPct <= 20 && tick % 20 === 0) {
                addAlert({
                    id: crypto.randomUUID(),
                    severity: 'warning',
                    message: `Battery low: ${batteryPct}% (${batteryVolts.toFixed(1)}V)`,
                    timestamp: Date.now(),
                });
            }
        }, 500); 
    }, [handlePacket, setConnected, addLog, addAlert]);

    
    useEffect(() => {
        if (useDummyData) {
            startDummyData();
        } else {
            
            const bridge = new CommBridge(
                wsUrl,
                handlePacket,
                (connected) => {
                    const store = useRobotStore.getState();
                    store.setConnected(connected);
                },
            );
            bridgeRef.current = bridge;
            bridge.connect();
        }

        return () => {
            
            if (dummyTimerRef.current) {
                clearInterval(dummyTimerRef.current);
                dummyTimerRef.current = null;
            }
            bridgeRef.current?.disconnect();
        };
    }, [wsUrl, useDummyData, handlePacket, startDummyData]);

    
    const sendCommand = useCallback((command: Record<string, unknown>) => {
        if (bridgeRef.current) {
            return bridgeRef.current.sendRaw(command);
        }
        
        const store = useRobotStore.getState();
        store.addLog(`📡 Command sent: ${JSON.stringify(command)}`);
        return true;
    }, []);

    return { sendCommand };
}
