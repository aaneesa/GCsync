import React from 'react';
import { useStore } from '../../store/useStore.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/** Helper: format a number to fixed decimals with sign */
const fmt = (v: number | undefined, decimals = 4) => {
  if (v === undefined || v === null) return '—';
  return v >= 0 ? `+${v.toFixed(decimals)}` : v.toFixed(decimals);
};

/** Single data readout row */
const DataRow: React.FC<{ label: string; value: string; color: string; unit?: string }> = ({ label, value, color, unit }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider shrink-0">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-[11px] font-mono font-bold tabular-nums ${color}`}>{value}</span>
      {unit && <span className="text-[8px] text-slate-600">{unit}</span>}
    </div>
  </div>
);

export const EncoderView: React.FC = () => {
  const odomData = useStore((state) => state.odomData);
  const history = useStore((state) => state.odomHistory);
  const dataRate = useStore((state) => state.dataRates.odom);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Odometry Data</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-60 font-mono text-[9px] text-emerald-400">{dataRate} Hz</span>
          <span className="opacity-40 font-mono text-[9px]">DRIVE_TYPE: DIFF</span>
        </div>
      </div>
      
      <div className="flex-1 flex p-2 gap-2 bg-slate-900/50 overflow-hidden">
        {/* Left: Numeric readouts */}
        <div className="w-[45%] flex flex-col gap-1 min-h-0 overflow-y-auto">
          {/* Speed Hero */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Speed</div>
              <div className="text-2xl font-bold text-white tabular-nums leading-none">
                {odomData ? odomData.speed.toFixed(3) : '0.000'}
              </div>
            </div>
            <span className="text-xs text-emerald-400/60 font-medium">m/s</span>
          </div>

          {/* Position */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-sky-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-sky-500" />
              Position
            </div>
            <div className="space-y-0.5">
              <DataRow label="X" value={fmt(odomData?.position.x)} color="text-rose-400" unit="m" />
              <DataRow label="Y" value={fmt(odomData?.position.y)} color="text-emerald-400" unit="m" />
              <DataRow label="Z" value={fmt(odomData?.position.z)} color="text-sky-400" unit="m" />
            </div>
          </div>

          {/* Orientation */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-amber-500" />
              Orientation
            </div>
            <div className="space-y-0.5">
              <DataRow label="Z" value={fmt(odomData?.orientation.z)} color="text-sky-400" />
              <DataRow label="W" value={fmt(odomData?.orientation.w)} color="text-amber-400" />
            </div>
          </div>

          {/* Velocities */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Velocity
            </div>
            <div className="space-y-0.5">
              <DataRow label="Lin X" value={fmt(odomData?.linearVelocity.x)} color="text-rose-400" unit="m/s" />
              <DataRow label="Lin Y" value={fmt(odomData?.linearVelocity.y)} color="text-emerald-400" unit="m/s" />
              <DataRow label="Ang Z" value={fmt(odomData?.angularVelocity.z)} color="text-sky-400" unit="rad/s" />
            </div>
          </div>
        </div>

        {/* Right: Speed chart */}
        <div className="w-[55%] flex flex-col bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-0">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Speed_Stream</div>
          <div className="flex-1 min-h-[100px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={[-2, 2]} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '8px',
                    fontSize: '10px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorSpeed)" 
                  isAnimationActive={false} 
                  strokeWidth={1.5} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
