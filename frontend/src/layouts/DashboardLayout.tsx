import React from 'react';
import { useStore } from '../store/useStore.ts';
import { Cpu, Activity, Zap, Database } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const isConnected = useStore((state) => state.isConnected);
  const dataRates = useStore((state) => state.dataRates);

  const totalRate = dataRates.imu + dataRates.lidar + dataRates.odom;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden h-screen">
      {/* High-Tech Utility Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-8 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="text-white" size={18} />
            </div>
            <div>
                <h1 className="text-sm font-bold tracking-tight text-white leading-none">GCsync</h1>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Mission_Control_V1</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 border-l border-slate-800 pl-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Activity size={12} className={totalRate > 0 ? 'text-emerald-500' : 'text-slate-600'} /> Data Rate
              </div>
              <div className="text-xs font-bold text-white tabular-nums font-mono">{totalRate} <span className="text-slate-500 text-[9px]">msg/s</span></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Zap size={12} className="text-indigo-400" /> Streams
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
                <span className={dataRates.imu > 0 ? 'text-emerald-400' : 'text-slate-600'}>IMU:{dataRates.imu}</span>
                <span className={dataRates.lidar > 0 ? 'text-emerald-400' : 'text-slate-600'}>LDR:{dataRates.lidar}</span>
                <span className={dataRates.odom > 0 ? 'text-emerald-400' : 'text-slate-600'}>ODO:{dataRates.odom}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <Database size={12} className="text-slate-400" /> Pipeline
              </div>
              <div className="text-xs font-bold text-white uppercase">ROS→WS→STORE</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
              {isConnected ? 'System_Linked' : 'Link_Lost'}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-right leading-tight hidden sm:block">
            SESS: {Date.now().toString().slice(-8)}<br/>
            USER: ADMIN_01
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-hidden relative p-4 bg-slate-950">
        {children}
      </main>
    </div>
  );
};
