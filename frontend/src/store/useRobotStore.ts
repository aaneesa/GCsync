import { create } from 'zustand';
import { RobotState, type TelemetrySnapshot, type HealthAlert, type LidarPoint } from '../core';

export interface RobotStoreState {
    motorData: number[];
    encoderTicks: number[];

    sensorFlags: Record<string, boolean>;

    lidarPoints: LidarPoint[];
    heading: number;
    pitch: number;
    roll: number;

    voltage: number;
    batteryPercent: number;
    alerts: HealthAlert[];

    isConnected: boolean;
    isArmed: boolean;
    emergencyStopped: boolean;

    telemetryHistory: TelemetrySnapshot[];
    logs: string[];

    updateMotorData: (data: number[]) => void;
    updateEncoderTicks: (ticks: number[]) => void;
    updateSpatial: (points: LidarPoint[], heading: number, pitch: number, roll: number) => void;
    updateHealth: (voltage: number, battery: number) => void;
    updateSensorFlags: (flags: Record<string, boolean>) => void;
    setConnected: (connected: boolean) => void;
    setArmed: (armed: boolean) => void;
    emergencyStop: () => void;
    resetEmergencyStop: () => void;
    pushTelemetry: (snapshot: TelemetrySnapshot) => void;
    addLog: (message: string) => void;
    addAlert: (alert: HealthAlert) => void;
    clearAlerts: () => void;
}

const robotState = new RobotState();

export const useRobotStore = create<RobotStoreState>((set, get) => ({
    motorData: [0, 0],
    encoderTicks: [0, 0],
    sensorFlags: { imu: true, lidar: true, encoder: true, battery: true },
    lidarPoints: [],
    heading: 0,
    pitch: 0,
    roll: 0,
    voltage: 12.6,
    batteryPercent: 100,
    alerts: [],
    isConnected: false,
    isArmed: false,
    emergencyStopped: false,
    telemetryHistory: [],
    logs: [],

    updateMotorData: (data) => {
        robotState.motorData = data;
        set({ motorData: data });
    },

    updateEncoderTicks: (ticks) => {
        robotState.encoderTicks = ticks;
        set({ encoderTicks: ticks });
    },

    updateSpatial: (points, heading, pitch, roll) => {
        set({ lidarPoints: points, heading, pitch, roll });
    },

    updateHealth: (voltage, battery) => {
        robotState.voltage = voltage;
        robotState.batteryPercent = battery;
        set({ voltage, batteryPercent: battery });
    },

    updateSensorFlags: (flags) => {
        robotState.sensorFlags = flags;
        set({ sensorFlags: flags });
    },

    setConnected: (connected) => {
        set({ isConnected: connected });
        const state = get();
        state.addLog(connected ? '🟢 Connected to robot' : '🔴 Disconnected from robot');
    },

    setArmed: (armed) => {
        const state = get();
        if (state.emergencyStopped && armed) {
            state.addLog('⚠️ Cannot arm — emergency stop is active');
            return;
        }
        set({ isArmed: armed });
        state.addLog(armed ? '🔓 Robot ARMED' : '🔒 Robot DISARMED');
    },

    emergencyStop: () => {
        set({ isArmed: false, emergencyStopped: true, motorData: [0, 0] });
        const state = get();
        state.addLog('🛑 EMERGENCY STOP ENGAGED');
        state.addAlert({
            id: crypto.randomUUID(),
            severity: 'critical',
            message: 'Emergency stop engaged — all motors halted',
            timestamp: Date.now(),
        });
    },

    resetEmergencyStop: () => {
        set({ emergencyStopped: false });
        get().addLog('✅ Emergency stop reset');
    },

    pushTelemetry: (snapshot) => {
        robotState.pushTelemetry(snapshot);
        set({ telemetryHistory: [...robotState.telemetryHistory] });
    },

    addLog: (message) => {
        robotState.addLog(message);
        set({ logs: [...robotState.logs] });
    },

    addAlert: (alert) => {
        set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 50) }));
    },

    clearAlerts: () => set({ alerts: [] }),
}));
