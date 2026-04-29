import { cmdVelService } from '../../services/CmdVelService';
import { useStore } from '../../store/useStore.ts';
import React, { useRef, useState } from 'react'; 

export const CmdControl: React.FC = () => {
  const isConnected = useStore((state) => state.isConnected);
  const padRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isConnected) return;
    setIsDragging(true);
    updatePos(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) updatePos(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setPos({ x: 0, y: 0 });
    cmdVelService.send(0, 0); // Stop
  };

  const updatePos = (e: React.PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate raw position relative to center
    let x = e.clientX - rect.left - centerX;
    let y = e.clientY - rect.top - centerY;
    
    // Constrain to circle
    const maxRadius = rect.width / 2;
    const distance = Math.sqrt(x*x + y*y);
    if (distance > maxRadius) {
      x = (x / distance) * maxRadius;
      y = (y / distance) * maxRadius;
    }

    setPos({ x, y });

    // Normalize to [-1, 1]
    const normX = x / maxRadius;
    const normY = y / maxRadius;

    // Linear velocity is -y (forward is negative y on screen), Angular is -x
    const maxLinear = 1.0;
    const maxAngular = 1.0;
    
    cmdVelService.send(-normY * maxLinear, -normX * maxAngular);
  };

  return (
    <div className="flex flex-col h-full fused-panel overflow-hidden">
      <div className="px-4 py-2 panel-header-unified flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-rose animate-pulse-energy" />
          <span>CMD_VEL_CTRL_PAD</span>
        </div>
        <span className="opacity-40 font-mono text-[9px]">CTRL_DRIVE_01</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div 
          ref={padRef}
          className={`relative w-44 h-44 rounded-full border border-white/5 transition-all duration-500 touch-none overflow-hidden
            ${isConnected ? 'bg-slate-900/40 opacity-100 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' : 'bg-slate-900/20 opacity-30 cursor-not-allowed'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* HUD Grid Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-white -translate-x-1/2" />
            <div className="absolute inset-4 border border-white rounded-full" />
            <div className="absolute inset-12 border border-white rounded-full" />
          </div>

          {/* Joystick handle */}
          <div 
            className="absolute top-1/2 left-1/2 w-14 h-14 bg-neon-rose rounded-full shadow-[0_0_25px_rgba(255,0,85,0.6)] border-2 border-white/30 cursor-grab active:cursor-grabbing transition-transform duration-75 z-10"
            style={{ 
              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
            }}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-10">
          <div className="text-center">
            <div className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.2em] mb-1">LINEAR_X</div>
            <div className="text-2xl font-black text-white tracking-tighter font-mono">
              {(pos.y / -88).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.2em] mb-1">ANGULAR_Z</div>
            <div className="text-2xl font-black text-white tracking-tighter font-mono">
              {(pos.x / -88).toFixed(2)}
            </div>
          </div>
        </div>

        {!isConnected && (
          <div className="mt-4 text-[9px] text-neon-rose font-mono font-bold border border-neon-rose/30 px-3 py-1 rounded-sm animate-pulse-energy">
            SYSTEM_DISARMED: NO_LINK
          </div>
        )}
      </div>
    </div>
  );
};
