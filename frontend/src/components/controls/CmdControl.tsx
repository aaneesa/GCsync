import { useStore } from '../../store/useStore.ts';
import React, { useState, useCallback } from 'react'; 
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Octagon, ShieldAlert } from 'lucide-react';

const STEP = 0.1;
const MIN_VAL = -1.0;
const MAX_VAL = 1.0;

/** Clamp a value between min and max, round to 1 decimal */
const clamp = (v: number) => Math.round(Math.max(MIN_VAL, Math.min(MAX_VAL, v)) * 10) / 10;

export const CmdControl: React.FC = () => {
  const isConnected = useStore((state) => state.isConnected);
  const [linearX, setLinearX] = useState(0);
  const [angularZ, setAngularZ] = useState(0);

  const sendCmd = useCallback((lx: number, az: number) => {
    setLinearX(lx);
    setAngularZ(az);
    // Command disabled temporarily
  }, []);

  const handleUp = () => {
    if (!isConnected) return;
    const next = clamp(linearX + STEP);
    sendCmd(next, angularZ);
  };

  const handleDown = () => {
    if (!isConnected) return;
    const next = clamp(linearX - STEP);
    sendCmd(next, angularZ);
  };

  const handleLeft = () => {
    if (!isConnected) return;
    const next = clamp(angularZ + STEP);
    sendCmd(linearX, next);
  };

  const handleRight = () => {
    if (!isConnected) return;
    const next = clamp(angularZ - STEP);
    sendCmd(linearX, next);
  };

  const handleStop = () => {
    sendCmd(0, 0);
  };

  const btnBase = `flex items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 select-none touch-none`;
  const dirBtn = `${btnBase} w-14 h-14 border-slate-700 bg-slate-950 hover:bg-indigo-500/15 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 shadow-lg`;
  const disabledBtn = `${btnBase} w-14 h-14 border-slate-800 bg-slate-950 text-slate-700 cursor-not-allowed opacity-40`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="font-semibold text-slate-300">Command Matrix</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">D-Pad_Control</span>
      </div>

      <div className="flex-1 flex flex-col p-6 gap-5 bg-slate-900/30">
        {/* D-Pad + Readouts */}
        <div className="flex-1 flex items-center justify-around">
          {/* D-Pad Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 place-items-center">
            {/* Row 1: empty - UP - empty */}
            <div />
            <button
              onClick={handleUp}
              className={isConnected ? dirBtn : disabledBtn}
              title="Increase Linear X (+0.1)"
            >
              <ChevronUp size={24} strokeWidth={2.5} />
            </button>
            <div />

            {/* Row 2: LEFT - STOP - RIGHT */}
            <button
              onClick={handleLeft}
              className={isConnected ? dirBtn : disabledBtn}
              title="Increase Angular Z (+0.1)"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleStop}
              className={`${btnBase} w-14 h-14 border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 hover:text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]`}
              title="Emergency Stop — Reset to 0"
            >
              <Octagon size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleRight}
              className={isConnected ? dirBtn : disabledBtn}
              title="Decrease Angular Z (−0.1)"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>

            {/* Row 3: empty - DOWN - empty */}
            <div />
            <button
              onClick={handleDown}
              className={isConnected ? dirBtn : disabledBtn}
              title="Decrease Linear X (−0.1)"
            >
              <ChevronDown size={24} strokeWidth={2.5} />
            </button>
            <div />
          </div>

          {/* Readout Cards */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 w-36">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Linear_X</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-bold tabular-nums ${linearX > 0 ? 'text-emerald-400' : linearX < 0 ? 'text-rose-400' : 'text-white'}`}>
                  {linearX >= 0 ? '+' : ''}{linearX.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-600 font-medium">m/s</span>
              </div>
              {/* Mini bar */}
              <div className="mt-2 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-150 ${linearX >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.abs(linearX) * 100}%`, marginLeft: linearX < 0 ? 'auto' : undefined }}
                />
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 w-36">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Angular_Z</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-bold tabular-nums ${angularZ > 0 ? 'text-sky-400' : angularZ < 0 ? 'text-amber-400' : 'text-white'}`}>
                  {angularZ >= 0 ? '+' : ''}{angularZ.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-600 font-medium">rad/s</span>
              </div>
              {/* Mini bar */}
              <div className="mt-2 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-150 ${angularZ >= 0 ? 'bg-sky-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.abs(angularZ) * 100}%`, marginLeft: angularZ < 0 ? 'auto' : undefined }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Kill Switch */}
        <button 
          onClick={handleStop}
          className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-500 px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] active:scale-[0.98]"
        >
          <ShieldAlert size={16} className="animate-pulse" /> Safety_Kill_Stop
        </button>
      </div>
    </motion.div>
  );
};
