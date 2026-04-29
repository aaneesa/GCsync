import { create } from 'zustand';
import { TelemetryService } from '../services/TelemetryService';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface ImuData {
  orientation: Quaternion;
  angular_velocity: Vec3;
  linear_acceleration: Vec3;
}

interface OdometryData {
  position: Vec3;
  orientation: Quaternion;
  linearVelocity: Vec3;
  angularVelocity: Vec3;
  speed: number;
  timestamp: number;
}

interface LidarMeta {
  pointCount: number;
  angleMin: number;
  angleMax: number;
  rangeMin: number;
  rangeMax: number;
  angleIncrement: number;
}

interface GroundControlState {
  // Connection
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
  
  // Session Tracking
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  robotId: string;
  operatorName: string;
  setMissionSettings: (robotId: string, operatorName: string) => void;
  telemetryBuffer: any[];
  flushTelemetry: () => Promise<void>;
  
  // Lidar
  lidarPoints: [number, number, number][];
  lidarMeta: LidarMeta | null;
  setLidarData: (points: [number, number, number][]) => void;
  setLidarMeta: (meta: LidarMeta) => void;

  // IMU
  imuData: ImuData | null;
  imuHistory: any[];
  imuAccelHistory: any[];
  setImuData: (data: ImuData) => void;

  // Odometry (was Encoder)
  odomData: OdometryData | null;
  odomHistory: any[];
  setOdomData: (data: OdometryData) => void;

  // Legacy encoder aliases (keep backward compat)
  encoderData: OdometryData | null;
  encoderHistory: any[];
  setEncoderData: (data: OdometryData) => void;

  // Analysis
  nearestObject: { x: number; y: number; z: number; distance: number } | null;
  setNearestObject: (data: any) => void;

  // Data rate tracking
  dataRates: { imu: number; lidar: number; odom: number };
  setDataRate: (sensor: 'imu' | 'lidar' | 'odom', rate: number) => void;
}

export const useStore = create<GroundControlState>((set, get) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),
  
  currentSessionId: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  robotId: 'GCS_ROBOT_ALPHA',
  operatorName: 'Mission_Admin',
  setMissionSettings: (robotId, operatorName) => set({ robotId, operatorName }),
  telemetryBuffer: [],

  flushTelemetry: async () => {
    const { currentSessionId, telemetryBuffer } = get();
    if (!currentSessionId || telemetryBuffer.length === 0) {
      if (!currentSessionId) console.warn('[STORE] No active session ID - skipping telemetry save');
      return;
    }

    console.log(`[STORE] Flushing ${telemetryBuffer.length} items to MongoDB...`);
    // Send to backend
    await TelemetryService.logBatch(telemetryBuffer);
    
    // Clear buffer
    set({ telemetryBuffer: [] });
  },

  lidarPoints: [],
  lidarMeta: null,
  setLidarData: (points) => set({ lidarPoints: points }),
  setLidarMeta: (meta) => set({ lidarMeta: meta }),

  imuData: null,
  imuHistory: [],
  imuAccelHistory: [],
  setImuData: (data) => set((state) => {
    const now = Date.now() % 100000;
    const newHistory = [...state.imuHistory, {
      time: now,
      wx: data.angular_velocity.x,
      wy: data.angular_velocity.y,
      wz: data.angular_velocity.z
    }].slice(-50);
    const newAccelHistory = [...state.imuAccelHistory, {
      time: now,
      ax: data.linear_acceleration.x,
      ay: data.linear_acceleration.y,
      az: data.linear_acceleration.z
    }].slice(-50);

    // Buffer for MongoDB (limit buffer size to prevent memory issues)
    const newBuffer = state.currentSessionId ? [
      ...state.telemetryBuffer, 
      { sessionId: state.currentSessionId, type: 'imu', data, timestamp: new Date() }
    ].slice(-500) : state.telemetryBuffer;

    return { 
      imuData: data, 
      imuHistory: newHistory, 
      imuAccelHistory: newAccelHistory,
      telemetryBuffer: newBuffer
    };
  }),

  odomData: null,
  odomHistory: [],
  setOdomData: (data) => set((state) => {
    const newHistory = [...state.odomHistory, {
      time: Date.now() % 100000,
      speed: data.speed,
      x: data.position.x,
      y: data.position.y,
    }].slice(-60);

    // Buffer for MongoDB
    const newBuffer = state.currentSessionId ? [
      ...state.telemetryBuffer, 
      { sessionId: state.currentSessionId, type: 'odom', data, timestamp: new Date() }
    ].slice(-500) : state.telemetryBuffer;

    return { 
      odomData: data, 
      odomHistory: newHistory,
      telemetryBuffer: newBuffer,
      // Keep legacy aliases in sync
      encoderData: data,
      encoderHistory: newHistory
    };
  }),

  // Legacy encoder aliases — point to odom state
  encoderData: null,
  encoderHistory: [],
  setEncoderData: (data) => get().setOdomData(data),

  nearestObject: null,
  setNearestObject: (data) => set({ nearestObject: data }),

  dataRates: { imu: 0, lidar: 0, odom: 0 },
  setDataRate: (sensor, rate) => set((state) => ({
    dataRates: { ...state.dataRates, [sensor]: rate }
  })),
}));

// Auto-flush telemetry every 3 seconds
setInterval(() => {
  useStore.getState().flushTelemetry();
}, 3000);
