import React from 'react';
import { useStore } from '../../store/useStore.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/** Helper: format a number to fixed decimals with sign */
const fmt = (v: number | undefined, decimals = 4) => {
  if (v === undefined || v === null) return '—';
  return v >= 0 ? `+${v.toFixed(decimals)}` : v.toFixed(decimals);
};

/** Single data readout row */
const DataRow: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider shrink-0">{label}</span>
    <span className={`text-[11px] font-mono font-bold tabular-nums ${color}`}>{value}</span>
  </div>
);

export const ImuView: React.FC = () => {
  const imuData = useStore((state) => state.imuData);
  const history = useStore((state) => state.imuHistory);
  const dataRate = useStore((state) => state.dataRates.imu);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>IMU Sensor Data</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-60 font-mono text-[9px] text-indigo-400">{dataRate} Hz</span>
          <span className="opacity-40 font-mono text-[9px]">AXIS_LOCK: ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 flex p-2 gap-2 bg-slate-900/50 overflow-hidden">
        {/* Left: Real-time numeric readouts */}
        <div className="w-[40%] flex flex-col gap-1 min-h-0 overflow-y-auto">
          {/* Orientation Quaternion */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              Orientation
            </div>
            <div className="space-y-0.5">
              <DataRow label="X" value={fmt(imuData?.orientation.x)} color="text-rose-400" />
              <DataRow label="Y" value={fmt(imuData?.orientation.y)} color="text-emerald-400" />
              <DataRow label="Z" value={fmt(imuData?.orientation.z)} color="text-sky-400" />
              <DataRow label="W" value={fmt(imuData?.orientation.w)} color="text-amber-400" />
            </div>
          </div>

          {/* Angular Velocity */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Angular Vel <span className="text-slate-600">rad/s</span>
            </div>
            <div className="space-y-0.5">
              <DataRow label="ωx" value={fmt(imuData?.angular_velocity.x)} color="text-rose-400" />
              <DataRow label="ωy" value={fmt(imuData?.angular_velocity.y)} color="text-emerald-400" />
              <DataRow label="ωz" value={fmt(imuData?.angular_velocity.z)} color="text-sky-400" />
            </div>
          </div>

          {/* Linear Acceleration */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[8px] font-bold text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-rose-500" />
              Accel <span className="text-slate-600">m/s²</span>
            </div>
            <div className="space-y-0.5">
              <DataRow label="ax" value={fmt(imuData?.linear_acceleration.x)} color="text-rose-400" />
              <DataRow label="ay" value={fmt(imuData?.linear_acceleration.y)} color="text-emerald-400" />
              <DataRow label="az" value={fmt(imuData?.linear_acceleration.z)} color="text-sky-400" />
            </div>
          </div>
        </div>

        {/* Right: Angular velocity chart */}
        <div className="w-[60%] flex flex-col justify-center bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-0">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Gyro_Stream</div>
          <ResponsiveContainer width="100%" height="90%" minWidth={0} minHeight={0}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={[-5, 5]} hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b', 
                  borderRadius: '8px',
                  fontSize: '10px' 
                }} 
              />
              <Line type="monotone" dataKey="wx" stroke="#6366f1" dot={false} isAnimationActive={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="wy" stroke="#10b981" dot={false} isAnimationActive={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="wz" stroke="#f43f5e" dot={false} isAnimationActive={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
