import React from 'react';
import { ArrowRight, Upload, Sparkles, ShieldCheck, Database, Layers, GitMerge } from 'lucide-react';
import { ThreeHeroScene } from '../common/ThreeHeroScene';
import { MotionBackground } from '../common/MotionBackground';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenUpload: () => void;
  onScrollToStory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onOpenUpload,
  onScrollToStory,
}) => {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-zinc-950 px-4 sm:px-6 lg:px-8 pt-6 pb-16">
      
      {/* Dynamic Animated Motion Canvas Background */}
      <MotionBackground />

      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-cyan-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Core Value Proposition */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>ENTERPRISE INDUSTRIAL PRODUCT INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-100 font-mono leading-tight">
            Industrial data is everywhere.{' '}
            <span className="text-zinc-400 font-normal">
              Intelligence is not.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-normal leading-relaxed">
            Convert messy supplier spreadsheets into standardized, deduplicated, and vector-searchable master technical data.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
            <button
              onClick={onExploreCatalog}
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition active:scale-[0.99]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Live Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ingest Catalog Feed</span>
            </button>
          </div>

          {/* Minimal Key Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80 max-w-md font-mono text-left">
            <div>
              <div className="text-xl font-bold text-zinc-100">99.4%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Normalization</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-400">42ms</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Vector Query</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-100">0%</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Duplicate Leakage</div>
            </div>
          </div>

        </div>

        {/* Right Column: Minimal Interactive 3D Viewport */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden p-2 shadow-2xl">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/80 text-[11px] font-mono text-zinc-400">
              <span className="text-zinc-300">Interactive Component Assembly (WebGL 3D)</span>
              <span className="text-cyan-400 font-mono">DIN / ISO Standards</span>
            </div>

            <div className="w-full h-[380px] sm:h-[420px]">
              <ThreeHeroScene />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
