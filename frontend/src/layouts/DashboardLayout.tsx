import React from 'react';
import { useStore } from '../store/useStore.ts';
import { Wifi, WifiOff, Cpu, Clock, HardDrive } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const isConnected = useStore((state) => state.isConnected);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-400 flex flex-col font-sans selection:bg-neon-cyan/30 overflow-hidden h-screen">
      {/* Integrated HUD Header */}
      <header className="h-10 border-b border-divider bg-black/40 px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-neon-cyan animate-pulse-energy" size={16} />
            <h1 className="text-[11px] font-black tracking-[0.4em] text-white uppercase">GCSYNC_CORE_v2.0</h1>
          </div>
          <div className="h-3 w-px bg-divider mx-2" />
          <div className="text-[8px] font-mono text-slate-600 tracking-widest hidden md:block">
            STATION_ID: GS_01 // SECURE_LINK: ACTIVE // FREQ: 2.4GHZ
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-neon-emerald shadow-[0_0_8px_#00ff9f]' : 'bg-neon-rose shadow-[0_0_8px_#ff0055]'} animate-pulse`} />
             <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500">
               {isConnected ? 'Link_Online' : 'Link_Offline'}
             </span>
          </div>
        </div>
      </header>

      {/* Full-Bleed Main Viewport */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
