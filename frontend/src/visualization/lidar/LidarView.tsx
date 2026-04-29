import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore.ts';

const PointCloud = () => {
  const lidarPoints = useStore((state) => state.lidarPoints);
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    return geo;
  }, []);

  useFrame(() => {
    if (pointsRef.current && lidarPoints.length > 0) {
      const positions = new Float32Array(lidarPoints.length * 3);
      for (let i = 0; i < lidarPoints.length; i++) {
        positions[i * 3] = lidarPoints[i][0];
        positions[i * 3 + 1] = lidarPoints[i][1];
        positions[i * 3 + 2] = lidarPoints[i][2];
      }
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.05} color="#00f2ff" sizeAttenuation={true} />
    </points>
  );
};

export const LidarView: React.FC = () => {
  return (
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-energy" />
          <span>LIDAR_SENS_STREAM</span>
        </div>
        <span className="opacity-40 font-mono text-[9px]">SENS_SCAN_01</span>
      </div>
      <div className="flex-1 relative bg-black">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={['#000']} />
          <ambientLight intensity={0.5} />
          <PointCloud />
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            sectionColor="#00f2ff22" 
            cellColor="#00f2ff11" 
            sectionSize={1}
          />
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>
    </div>
  );
};
