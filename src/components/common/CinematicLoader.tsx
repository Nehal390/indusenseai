import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Database, GitBranch, CheckCircle2, ChevronRight } from 'lucide-react';

interface CinematicLoaderProps {
  onComplete: () => void;
}

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    { label: 'INITIALIZING INDUSTRIAL NEURAL ENGINE', sub: 'Allocating vector memory & tensor cores', icon: Cpu },
    { label: 'CONNECTING CATALOG DATA PIPELINE', sub: 'Mounting XLSX/CSV ingest stream parser', icon: Database },
    { label: 'UNDERSTANDING MULTI-CATEGORY SPECS', sub: 'Calibrating unit normalization models (kW, RPM, Bar)', icon: ShieldCheck },
    { label: 'SYNTHESIZING SEMANTIC PRODUCT GRAPH', sub: 'Computing cosine similarity & duplicate clusters', icon: GitBranch },
    { label: 'INDUSENSE PLATFORM OPERATIONAL', sub: 'Ready for enterprise catalog transformation', icon: CheckCircle2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return Math.min(next, 100);
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
    setStageIndex(idx);

    // Add telemetry log
    if (progress % 20 === 0 && progress > 0) {
      setLogs((prev) => [
        `[${new Date().toISOString().slice(11, 19)}] >> Core stage ${idx + 1}/${stages.length} synced (Status: 200 OK)`,
        ...prev.slice(0, 3),
      ]);
    }
  }, [progress]);

  const CurrentIcon = stages[stageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6 select-none">
      {/* Background ambient grid & lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b18_1px,transparent_1px),linear-gradient(to_bottom,#18181b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        {/* Animated Brand Wordmark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <CurrentIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold tracking-tight text-zinc-100 font-mono">
              INDUSENSE<span className="text-cyan-400">.AI</span>
            </span>
            <div className="text-[11px] font-mono text-zinc-500 tracking-wider">
              ENTERPRISE INDUSTRIAL INTELLIGENCE v2.8
            </div>
          </div>
        </div>

        {/* Dynamic Stage Indicator */}
        <div className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl mb-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span>STAGE 0{stageIndex + 1} / 05</span>
            <span>{progress}%</span>
          </div>

          <div className="text-base font-semibold text-zinc-100 tracking-wide font-mono">
            {stages[stageIndex].label}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {stages[stageIndex].sub}
          </div>

          {/* Progress Bar with glowing tip */}
          <div className="relative w-full h-2 bg-zinc-950 rounded-full mt-5 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Telemetry Stream Output */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-left font-mono text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE TELEMETRY STREAM</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="truncate text-zinc-400">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-cyan-300 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 transition"
        >
          <span>Bypass Initialization Sequence</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
};
