import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { useRobotStore } from '../../store/useRobotStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../ui/badge';
import { Compass, Navigation } from 'lucide-react';
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
        <Card className="bg-zinc-900/60 border-zinc-700/50 backdrop-blur-sm h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-cyan-400" />
                        Spatial Visualizer
                    </div>
                    <div className="flex items-center gap-3 text-xs font-normal">
                        <Badge variant="outline" className="border-zinc-600 text-zinc-400 gap-1">
                            <Navigation className="w-3 h-3" />
                            {heading.toFixed(1)}°
                        </Badge>
                        <span className="text-zinc-500">P: {pitch.toFixed(1)}°</span>
                        <span className="text-zinc-500">R: {roll.toFixed(1)}°</span>
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                            {lidarPoints.length} pts
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2">
                <div className="w-full h-full rounded-lg overflow-hidden border border-zinc-700/30 bg-zinc-950">
                    <Canvas
                        camera={{ position: [5, 5, 5], fov: 50 }}
                        style={{ background: '#0a0a0a' }}
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
