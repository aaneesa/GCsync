import { create } from 'zustand';

interface GroundControlState {
  // Connection
  isConnected: boolean;
  setIsConnected: (status: boolean) => void;
  
  // Lidar
  lidarPoints: [number, number, number][];
  setLidarData: (points: [number, number, number][]) => void;

  // IMU
  imuData: {
    orientation: { x: number; y: number; z: number; w: number };
    angular_velocity: { x: number; y: number; z: number };
    linear_acceleration: { x: number; y: number; z: number };
  } | null;
  setImuData: (data: any) => void;

  // Encoder
  encoderData: {
    ticks: number;
    speed: number;
    timestamp: number;
  } | null;
  setEncoderData: (data: any) => void;
}

export const useStore = create<GroundControlState>((set) => ({
  isConnected: false,
  setIsConnected: (status) => set({ isConnected: status }),

  lidarPoints: [],
  setLidarData: (points) => set({ lidarPoints: points }),

  imuData: null,
  setImuData: (data) => set({ imuData: data }),

  encoderData: null,
  setEncoderData: (data) => set({ encoderData: data })
}));
