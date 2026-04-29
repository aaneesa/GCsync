import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore.ts';
import { motion } from 'framer-motion';

const PointCloud = () => {
  const lidarPoints = useStore((state) => state.lidarPoints);
  const setNearestObject = useStore((state) => state.setNearestObject);
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
    return geo;
  }, []);

  useFrame(() => {
    if (pointsRef.current && lidarPoints.length > 0) {
      const positions = new Float32Array(lidarPoints.length * 3);
      let minX = 0, minY = 0, minZ = 0, minDist = Infinity;

      for (let i = 0; i < lidarPoints.length; i++) {
        const x = lidarPoints[i][0];
        const y = lidarPoints[i][1];
        const z = lidarPoints[i][2];
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const dist = Math.sqrt(x*x + y*y + z*z);
        if (dist < minDist && dist > 0.1) {
          minDist = dist;
          minX = x; minY = y; minZ = z;
        }
      }

      if (minDist !== Infinity) {
        setNearestObject({ x: minX, y: minY, z: minZ, distance: minDist });
      }

      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.04} 
        color="#f8fafc" 
        transparent 
        opacity={0.9} 
        sizeAttenuation={true} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const LidarView: React.FC = () => {
  const nearestObject = useStore((state) => state.nearestObject);
  const lidarMeta = useStore((state) => state.lidarMeta);
  const dataRate = useStore((state) => state.dataRates.lidar);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden relative group"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <span className="font-semibold text-slate-300 tracking-tight">LiDAR Mission Scan</span>
        </div>
        <div className="flex gap-4 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
          <span className="text-indigo-400">{dataRate} Hz</span>
          <span>Sens: Active</span>
          <span>Mode: Continuous</span>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-950" style={{ minHeight: 0 }}>
        {/* LiDAR HUD Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-3 rounded-lg shadow-xl">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                Target_Lock
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-[10px] text-slate-500 font-medium">DIST:</span>
                <span className="text-[10px] font-mono text-white font-bold">{nearestObject?.distance.toFixed(2) ?? '0.00'}m</span>
                <span className="text-[10px] text-slate-500 font-medium">BEAR:</span>
                <span className="text-[10px] font-mono text-white font-bold">
                  {nearestObject ? (Math.atan2(nearestObject.y, nearestObject.x) * 180 / Math.PI).toFixed(1) : '0.0'}°
                </span>
              </div>
            </div>

            {/* Scan Metadata HUD */}
            {lidarMeta && (
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-3 rounded-lg shadow-xl">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  Scan_Info
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-[10px] text-slate-500 font-medium">PTS:</span>
                  <span className="text-[10px] font-mono text-white font-bold">{lidarMeta.pointCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium">ANG:</span>
                  <span className="text-[10px] font-mono text-white font-bold">
                    {(lidarMeta.angleMin * 180 / Math.PI).toFixed(0)}° → {(lidarMeta.angleMax * 180 / Math.PI).toFixed(0)}°
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">RNG:</span>
                  <span className="text-[10px] font-mono text-white font-bold">
                    {lidarMeta.rangeMin.toFixed(1)} – {lidarMeta.rangeMax.toFixed(1)}m
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1 opacity-20">
               <div className="w-6 h-px bg-indigo-500" />
               <div className="w-12 h-px bg-indigo-500" />
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-right shadow-xl">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Local_Coords</div>
              <div className="flex flex-col gap-0.5 font-mono text-[10px]">
                <div className="flex justify-between gap-6">
                  <span className="text-slate-500">X_AXIS:</span>
                  <span className="text-white font-bold">{nearestObject?.x.toFixed(3) ?? '0.000'}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-slate-500">Y_AXIS:</span>
                  <span className="text-white font-bold">{nearestObject?.y.toFixed(3) ?? '0.000'}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-slate-500">Z_AXIS:</span>
                  <span className="text-white font-bold">{nearestObject?.z.toFixed(3) ?? '0.000'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{ width: '100%', height: '100%' }}>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.5} />
            <PointCloud />
            <Grid 
              infiniteGrid 
              sectionColor="#3341551a" 
              cellColor="#1e293b1a" 
              sectionThickness={1}
              cellThickness={0.5}
              sectionSize={1}
              cellSize={0.5}
              fadeDistance={50}
              fadeStrength={5}
            />
            <OrbitControls enableDamping dampingFactor={0.05} />
          </Canvas>
        </div>
      </div>
    </motion.div>
  );
};
