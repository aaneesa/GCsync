import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../../store/useStore.ts';

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 150 }, data: { label: 'SENS_HUB' }, style: { background: '#0f1115', color: '#00f2ff', border: '1px solid #00f2ff44', borderRadius: '2px', padding: '10px', fontSize: '10px', fontFamily: 'monospace' } },
  { id: '2', position: { x: 200, y: 150 }, data: { label: 'ESP32_BRDG' }, style: { background: '#0f1115', color: '#00f2ff', border: '1px solid #00f2ff44', borderRadius: '2px', padding: '10px', fontSize: '10px', fontFamily: 'monospace' } },
  { id: '3', position: { x: 350, y: 150 }, data: { label: 'ROS_CORE' }, style: { background: '#0f1115', color: '#00f2ff', border: '1px solid #00f2ff44', borderRadius: '2px', padding: '10px', fontSize: '10px', fontFamily: 'monospace' } },
  { id: '4', position: { x: 550, y: 150 }, data: { label: 'GCSYNC_DASH' }, style: { background: '#00f2ff22', color: '#00f2ff', border: '1px solid #00f2ff', borderRadius: '2px', padding: '10px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' } },
];

export const SystemGraph: React.FC = () => {
  const isConnected = useStore((state) => state.isConnected);

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: isConnected, style: { stroke: isConnected ? '#00f2ff' : '#334155', strokeWidth: 2 } },
    { id: 'e2-3', source: '2', target: '3', animated: isConnected, style: { stroke: isConnected ? '#00f2ff' : '#334155', strokeWidth: 2 } },
    { id: 'e3-4', source: '3', target: '4', animated: isConnected, style: { stroke: isConnected ? '#00f2ff' : '#334155', strokeWidth: 2 } },
  ];

  return (
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex justify-between items-center">
        <span>SYSTEM_PIPELINE_MAP</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-emerald shadow-[0_0_8px_#00ff9f]' : 'bg-neon-rose shadow-[0_0_8px_#ff0055]'}`} />
          <span className="text-[9px] font-mono opacity-60 tracking-widest">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>
      <div className="flex-1 w-full relative bg-black">
        <ReactFlow 
          nodes={initialNodes} 
          edges={initialEdges}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#00f2ff" gap={20} size={1} variant={"dots" as any} className="opacity-10" />
        </ReactFlow>
      </div>
    </div>
  );
};
