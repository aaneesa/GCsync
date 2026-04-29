import React, { useState, useEffect } from 'react';
import { sessionManager } from '../../services/SessionManager';
import { Play, Square, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const SessionPanel: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setDuration(prev => prev + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStart = () => {
    sessionManager.start();
    setIsRecording(true);
    setSessionId(sessionManager.getSessionId());
  };

  const handleStop = async () => {
    await sessionManager.stop();
    setIsRecording(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Mission Session</span>
        </div>
        {isRecording ? (
          <div className="flex items-center gap-2 text-[10px] text-rose-500 font-bold">
            <Activity size={12} className="animate-pulse" /> RECORDING
          </div>
        ) : (
          <span className="opacity-40 font-mono text-[9px]">IDLE</span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center p-6 gap-6 bg-slate-900/50">
        
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 text-center shadow-inner">
          <div className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-3">Active Session ID</div>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900/50 py-1 rounded border border-slate-800/50 truncate px-3 mb-6">
            {isRecording ? sessionId : 'NO_ACTIVE_SESSION'}
          </div>
          <div className="text-5xl font-bold text-white tracking-tight tabular-nums">
            {formatTime(duration)}
          </div>
        </div>

        <div className="flex gap-4">
          {!isRecording ? (
            <button 
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-transparent hover:bg-emerald-500/10 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all group"
            >
              <Play size={16} className="group-hover:fill-emerald-400" /> Start Mission
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-700 bg-transparent hover:bg-rose-500/10 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all group"
            >
              <Square size={16} className="group-hover:fill-rose-400" /> Stop Mission
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
