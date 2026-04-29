import { create } from 'zustand';

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

export const useStore = create<GroundControlState>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),

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
    return { imuData: data, imuHistory: newHistory, imuAccelHistory: newAccelHistory };
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
    return { 
      odomData: data, 
      odomHistory: newHistory,
      // Keep legacy aliases in sync
      encoderData: data,
      encoderHistory: newHistory
    };
  }),

  // Legacy encoder aliases — point to odom state
  encoderData: null,
  encoderHistory: [],
  setEncoderData: (data) => set((state) => {
    const newHistory = [...state.odomHistory, {
      time: Date.now() % 100000,
      speed: data.speed,
      x: data.position.x,
      y: data.position.y,
    }].slice(-60);
    return { 
      odomData: data, 
      odomHistory: newHistory,
      encoderData: data, 
      encoderHistory: newHistory 
    };
  }),

  nearestObject: null,
  setNearestObject: (data) => set({ nearestObject: data }),

  dataRates: { imu: 0, lidar: 0, odom: 0 },
  setDataRate: (sensor, rate) => set((state) => ({
    dataRates: { ...state.dataRates, [sensor]: rate }
  })),
}));
