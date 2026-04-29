import React from 'react';
import { ReactFlow, Background, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../../store/useStore.ts';
import { motion } from 'framer-motion';

const nodeStyle = { 
  background: '#020617', 
  color: '#94a3b8', 
  border: '1px solid #1e293b', 
  borderRadius: '8px', 
  padding: '8px 12px', 
  fontSize: '10px', 
  fontWeight: '600',
  width: 100,
  textAlign: 'center' as const
};

const activeNodeStyle = { 
  ...nodeStyle,
  background: '#0f172a', 
  color: '#f8fafc', 
  border: '1px solid #6366f1', 
  boxShadow: '0 0 15px rgba(99,102,241,0.1)'
};

const initialNodes: Node[] = [
  { id: '1', position: { x: 50, y: 100 }, data: { label: 'Sensor Hub' }, style: nodeStyle },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'ESP32 Bridge' }, style: nodeStyle },
  { id: '3', position: { x: 350, y: 100 }, data: { label: 'ROS Core' }, style: nodeStyle },
  { id: '4', position: { x: 500, y: 100 }, data: { label: 'Mission Dash' }, style: activeNodeStyle },
];

export const SystemGraph: React.FC = () => {
  const isConnected = useStore((state) => state.isConnected);

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: isConnected, style: { stroke: isConnected ? '#6366f1' : '#334155', strokeWidth: 1.5 } },
    { id: 'e2-3', source: '2', target: '3', animated: isConnected, style: { stroke: isConnected ? '#6366f1' : '#334155', strokeWidth: 1.5 } },
    { id: 'e3-4', source: '3', target: '4', animated: isConnected, style: { stroke: isConnected ? '#6366f1' : '#334155', strokeWidth: 1.5 } },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <span className="font-semibold text-slate-300">System Map</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{isConnected ? 'Link Active' : 'Link Offline'}</span>
        </div>
      </div>
      <div className="flex-1 relative bg-slate-950/50">
        <ReactFlow 
          nodes={initialNodes} 
          edges={initialEdges}
          fitView
          proOptions={{ hideAttribution: true }}
          suppressHydrationWarning
        >
          <Background color="#1e293b" gap={20} size={1} variant={"dots" as any} />
        </ReactFlow>
      </div>
    </motion.div>
  );
};
