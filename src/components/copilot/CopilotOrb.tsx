import React from 'react';
import { Sparkles, Mic, Bot } from 'lucide-react';

interface CopilotOrbProps {
  isOpen: boolean;
  onToggle: () => void;
  voiceState: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const CopilotOrb: React.FC<CopilotOrbProps> = ({
  isOpen,
  onToggle,
  voiceState,
}) => {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onToggle}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-zinc-950 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none"
        title="Open InduSense AI Copilot"
      >
        {/* Animated Ripple Glow Rings */}
        <span className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-60 pointer-events-none" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 opacity-30 blur-sm group-hover:opacity-75 transition" />

        {/* Center Orb Icon */}
        <div className="relative z-10 flex items-center justify-center">
          {voiceState === 'listening' ? (
            <Mic className="w-6 h-6 text-cyan-300 animate-pulse" />
          ) : (
            <Sparkles className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition duration-300" />
          )}
        </div>

        {/* Status indicator pip */}
        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 ${
          voiceState === 'listening'
            ? 'bg-rose-400 animate-ping'
            : voiceState === 'speaking'
            ? 'bg-emerald-400 animate-pulse'
            : 'bg-cyan-400'
        }`} />
      </button>
    </div>
  );
};
