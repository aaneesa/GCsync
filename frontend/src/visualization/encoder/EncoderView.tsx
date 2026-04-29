import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const EncoderView: React.FC = () => {
  const encoderData = useStore((state) => state.encoderData);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (encoderData) {
      setHistory(prev => {
        const newHist = [...prev, {
          time: Date.now() % 10000,
          speed: encoderData.speed
        }];
        return newHist.slice(-50);
      });
    }
  }, [encoderData]);

  return (
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse-energy" />
          <span>ENCODER_ODOMETRY_STATS</span>
        </div>
        <span className="opacity-40 font-mono text-[9px]">SENS_ENC_03</span>
      </div>
      
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between px-6 py-4 bg-black border border-white/5 rounded-sm">
          <div className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Linear_Speed</div>
          <div className="text-3xl font-black text-white tracking-tighter">
            {encoderData ? encoderData.speed.toFixed(2) : '0.00'} <span className="text-sm text-neon-emerald ml-1">M/S</span>
          </div>
        </div>

        <div className="flex-1 bg-black border border-white/5 rounded-sm p-2 min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff9f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff9f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={[-2, 2]} stroke="#00ff9f" fontSize={8} width={25} />
              <Tooltip contentStyle={{ backgroundColor: '#0f1115', border: '1px solid #00ff9f', fontSize: '10px' }} />
              <Area type="monotone" dataKey="speed" stroke="#00ff9f" fillOpacity={1} fill="url(#colorSpeed)" isAnimationActive={false} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
