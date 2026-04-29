import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore.ts';
import * as THREE from 'three';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrientationCube = () => {
  const imuData = useStore((state) => state.imuData);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && imuData?.orientation) {
      const q = imuData.orientation;
      meshRef.current.quaternion.set(q.x, q.y, q.z, q.w);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 0.5, 3]} />
      <meshStandardMaterial color="#8b5cf6" wireframe={false} />
      <axesHelper args={[3]} />
    </mesh>
  );
};

export const ImuView: React.FC = () => {
  const imuData = useStore((state) => state.imuData);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (imuData) {
      setHistory(prev => {
        const newHist = [...prev, {
          time: Date.now() % 10000,
          wx: imuData.angular_velocity.x,
          wy: imuData.angular_velocity.y,
          wz: imuData.angular_velocity.z
        }];
        return newHist.slice(-50); // Keep last 50 points
      });
    }
  }, [imuData]);

  return (
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse-energy" />
          <span>IMU_ORIENTATION_PROC</span>
        </div>
        <span className="opacity-40 font-mono text-[9px]">SENS_GYRO_02</span>
      </div>
      <div className="flex-1 flex p-4 gap-4">
        <div className="w-1/2 bg-black border border-white/5 rounded-sm overflow-hidden relative">
           <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#bc13fe" />
              <OrientationCube />
           </Canvas>
        </div>
        <div className="w-1/2 flex flex-col justify-center bg-black border border-white/5 rounded-sm p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
              <XAxis dataKey="time" hide />
              <YAxis domain={[-5, 5]} stroke="#bc13fe" fontSize={8} />
              <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #bc13fe', fontSize: '10px' }} />
              <Line type="monotone" dataKey="wx" stroke="#ff0055" dot={false} isAnimationActive={false} strokeWidth={2} />
              <Line type="monotone" dataKey="wy" stroke="#00ff9f" dot={false} isAnimationActive={false} strokeWidth={2} />
              <Line type="monotone" dataKey="wz" stroke="#00f2ff" dot={false} isAnimationActive={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
