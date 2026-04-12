import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../ui/badge';
import { Compass, Navigation, Crosshair } from 'lucide-react';
import * as THREE from 'three';


function LidarPointCloud() {
    const lidarPoints = useRobotStore((s) => s.lidarPoints);
    const pointsRef = useRef<THREE.Points>(null);

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(lidarPoints.length * 3);
        const col = new Float32Array(lidarPoints.length * 3);

        lidarPoints.forEach((pt, i) => {
            pos[i * 3] = pt.x;
            pos[i * 3 + 1] = pt.z;
            pos[i * 3 + 2] = pt.y;

            const intensity = pt.intensity ?? 0.5;
            col[i * 3] = 0.1 + intensity * 0.4;
            col[i * 3 + 1] = 0.8 + intensity * 0.2;
            col[i * 3 + 2] = 0.9 + intensity * 0.1;
        });

        return { positions: pos, colors: col };
    }, [lidarPoints]);

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={positions.length / 3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                    count={colors.length / 3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.08} vertexColors sizeAttenuation transparent opacity={0.85} />
        </points>
    );
}


function RobotArrow() {
    const heading = useRobotStore((s) => s.heading);
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            const targetRotation = (-heading * Math.PI) / 180;
            groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.1, 0.3, 8]} />
                <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
            <Text position={[0, 0.3, 0.5]} fontSize={0.15} color="#06b6d4">
                N
            </Text>
        </group>
    );
}


function GridFloor() {
    return (
        <Grid
            position={[0, -0.01, 0]}
            args={[20, 20]}
            cellSize={1}
            cellColor="#333"
            sectionSize={5}
            sectionColor="#555"
            fadeDistance={15}
            infiniteGrid
        />
    );
}


export function SpatialVisualizerView() {
    const heading = useRobotStore((s) => s.heading);
    const pitch = useRobotStore((s) => s.pitch);
    const roll = useRobotStore((s) => s.roll);
    const lidarPoints = useRobotStore((s) => s.lidarPoints);

    return (
        <Card className="glass-panel rounded-xl h-full flex flex-col border-0 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Compass className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        Spatial Visualizer
                    </div>
                    <div className="flex items-center gap-2 text-xs font-normal">
                        <Badge variant="outline" className="border-cyan-500/20 bg-cyan-500/5 text-cyan-400 gap-1 text-[10px] rounded-lg">
                            <Navigation className="w-3 h-3" />
                            {heading.toFixed(1)}°
                        </Badge>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-800/40 border border-zinc-700/20">
                            <span className="text-[10px] text-zinc-500">P</span>
                            <span className="text-[10px] font-mono text-zinc-400">{pitch.toFixed(1)}°</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-800/40 border border-zinc-700/20">
                            <span className="text-[10px] text-zinc-500">R</span>
                            <span className="text-[10px] font-mono text-zinc-400">{roll.toFixed(1)}°</span>
                        </div>
                        <Badge variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-400 text-[10px] rounded-lg gap-1">
                            <Crosshair className="w-3 h-3" />
                            {lidarPoints.length}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-700/20 bg-zinc-950">
                    {/* Scan-line overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-[0.04]">
                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line" />
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-cyan-500/20 rounded-tl z-10 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-cyan-500/20 rounded-tr z-10 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-cyan-500/20 rounded-bl z-10 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-cyan-500/20 rounded-br z-10 pointer-events-none" />

                    <Canvas
                        camera={{ position: [5, 5, 5], fov: 50 }}
                        style={{ background: '#080810' }}
                    >
                        <ambientLight intensity={0.4} />
                        <pointLight position={[10, 10, 10]} intensity={0.8} />
                        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#22d3ee" />

                        <LidarPointCloud />
                        <RobotArrow />
                        <GridFloor />

                        <OrbitControls
                            enablePan
                            enableZoom
                            enableRotate
                            autoRotate={false}
                            maxPolarAngle={Math.PI / 2}
                        />
                    </Canvas>
                </div>
            </CardContent>
        </Card>
    );
}
