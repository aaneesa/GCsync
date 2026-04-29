import React, { useState } from 'react';
import { useStore } from '../../store/useStore.ts';
import { Settings, Save, Play, Square, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export const MissionControl: React.FC = () => {
  const { robotId, operatorName, setMissionSettings, currentSessionId } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempRobotId, setTempRobotId] = useState(robotId);
  const [tempOperator, setTempOperator] = useState(operatorName);

  const handleSave = () => {
    setMissionSettings(tempRobotId, tempOperator);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-slate-400" />
          <span className="font-semibold text-slate-300">Mission Configuration</span>
        </div>
        {currentSessionId && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Recording</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 bg-slate-900/50 flex flex-col gap-4">
        <div className="space-y-4">
          {/* Robot ID Field */}
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Machine identifier</label>
            <div className="relative group">
              <input 
                type="text"
                disabled={!isEditing}
                value={isEditing ? tempRobotId : robotId}
                onChange={(e) => setTempRobotId(e.target.value)}
                className={`w-full bg-slate-950 border ${isEditing ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.1)]' : 'border-slate-800'} rounded-lg px-3 py-2 text-xs font-mono text-white outline-none transition-all`}
              />
              {!isEditing && <div className="absolute inset-0 bg-transparent cursor-not-allowed" />}
            </div>
          </div>

          {/* Operator Name Field */}
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Operator Callsign</label>
            <input 
              type="text"
              disabled={!isEditing}
              value={isEditing ? tempOperator : operatorName}
              onChange={(e) => setTempOperator(e.target.value)}
              className={`w-full bg-slate-950 border ${isEditing ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.1)]' : 'border-slate-800'} rounded-lg px-3 py-2 text-xs font-mono text-white outline-none transition-all`}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex gap-2">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={12} /> Commit Changes
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Settings size={12} /> Edit Config
              </button>
            )}
          </div>
          
          <button 
            disabled={!currentSessionId}
            onClick={() => useStore.getState().setImuData({
              orientation: { x: 0, y: 0, z: 0, w: 1 },
              angular_velocity: { x: 0.1, y: 0.2, z: 0.3 },
              linear_acceleration: { x: 0, y: 0, z: 9.8 }
            })}
            className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
              currentSessionId 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play size={12} /> Send Test Pulse
          </button>
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Database size={16} className={currentSessionId ? 'text-indigo-400' : 'text-slate-600'} />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Cloud Sync</div>
              <div className="text-[10px] font-mono text-white">
                {currentSessionId ? `ID: ${currentSessionId.slice(-8)}` : 'DISCONNECTED'}
              </div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${currentSessionId ? 'bg-emerald-500' : 'bg-slate-700'}`} />
        </div>
      </div>
    </motion.div>
  );
};
