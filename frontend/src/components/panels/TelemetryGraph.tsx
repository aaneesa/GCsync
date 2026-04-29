import React from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore.ts';

export const TelemetryGraph: React.FC = () => {
  const imuData = useStore((state) => state.imuData);
  const accelHistory = useStore((state) => state.imuAccelHistory);
  const dataRates = useStore((state) => state.dataRates);

  const totalRate = dataRates.imu + dataRates.lidar + dataRates.odom;

  // Compute magnitude of acceleration
  const accelMagnitude = imuData ? Math.sqrt(
    imuData.linear_acceleration.x ** 2 +
    imuData.linear_acceleration.y ** 2 +
    imuData.linear_acceleration.z ** 2
  ).toFixed(2) : '0.00';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-300">Live Telemetry</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Real_Data</span>
      </div>

      <div className="flex-1 flex flex-col p-2 gap-2 bg-slate-900/30">
        <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">|Accel|</div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white tabular-nums">{accelMagnitude}</span>
                    <span className="text-[9px] text-rose-400 font-medium">m/s²</span>
                </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Data Rate</div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white tabular-nums">{totalRate}</span>
                    <span className="text-[9px] text-indigo-400 font-medium">msg/s</span>
                </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Sensors</div>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${dataRates.imu > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      <span className="text-[9px] text-slate-400 font-bold">IMU</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${dataRates.lidar > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      <span className="text-[9px] text-slate-400 font-bold">LDR</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${dataRates.odom > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      <span className="text-[9px] text-slate-400 font-bold">ODO</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[100px]">
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Accel_XYZ_Stream</div>
          <ResponsiveContainer width="100%" height="85%" minWidth={0} minHeight={0}>
            <LineChart data={accelHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={[-15, 5]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #1e293b', 
                  borderRadius: '8px',
                  fontSize: '10px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="ax" stroke="#f43f5e" dot={false} isAnimationActive={false} strokeWidth={1.5} name="ax" />
              <Line type="monotone" dataKey="ay" stroke="#10b981" dot={false} isAnimationActive={false} strokeWidth={1.5} name="ay" />
              <Line type="monotone" dataKey="az" stroke="#6366f1" dot={false} isAnimationActive={false} strokeWidth={1.5} name="az" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
