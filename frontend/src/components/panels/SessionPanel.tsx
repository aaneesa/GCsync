import React, { useState, useEffect } from 'react';
import { sessionManager } from '../../services/SessionManager';
import { Play, Square, Save, Activity } from 'lucide-react';

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
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse-energy" />
          <span>MISSION_SESSION_MNGR</span>
        </div>
        {isRecording ? (
          <div className="flex items-center gap-2 text-[10px] text-rose-500 animate-pulse-intense font-black">
            <Activity size={12}/> REC_ACTIVE
          </div>
        ) : (
          <span className="opacity-40 font-mono text-[9px]">SESS_LOG_01</span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center p-4 gap-6">
        
        <div className="bg-black border border-white/5 rounded-sm p-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
          <div className="text-slate-500 text-[8px] font-mono tracking-widest uppercase mb-2">Active_Session_ID</div>
          <div className="text-[11px] font-mono text-slate-300 truncate px-2">
            {isRecording ? sessionId : 'IDLE_WAITING_REQUEST'}
          </div>
          <div className="text-4xl font-black mt-4 text-neon-emerald tracking-tighter font-mono">
            {formatTime(duration)}
          </div>
        </div>

        <div className="flex gap-3">
          {!isRecording ? (
            <button 
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 bg-neon-emerald/10 text-neon-emerald hover:bg-neon-emerald/20 border border-neon-emerald/40 px-4 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <Play size={14} fill="currentColor" /> Initiate_Log
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/40 px-4 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <Square size={14} fill="currentColor" /> Terminate_Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
