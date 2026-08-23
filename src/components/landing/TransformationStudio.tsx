import React, { useState } from 'react';
import { Database, Cpu, Search, Sparkles, Check, ArrowRight, ShieldAlert, GitMerge, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

interface TransformationStudioProps {
  onEnterWorkspace: () => void;
  onOpenUpload: () => void;
}

export const TransformationStudio: React.FC<TransformationStudioProps> = ({
  onEnterWorkspace,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'ingest' | 'dedup' | 'search'>('ingest');

  const steps = [
    {
      id: 'ingest',
      number: '01',
      title: 'Ingest Messy Feeds',
      description: 'Raw spreadsheets with corrupted SKUs & conflicting units',
      icon: Database,
    },
    {
      id: 'dedup',
      number: '02',
      title: 'Neural Deduplication',
      description: 'Cluster identical OEM parts & eliminate duplicate spending',
      icon: GitMerge,
    },
    {
      id: 'search',
      number: '03',
      title: 'Natural Language Search',
      description: 'Find components by engineering parameters & standards',
      icon: Search,
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950/80 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>HOW INDUSENSE TRANSFORMS INDUSTRIAL DATA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100 tracking-tight">
            From Supplier Chaos to Structured Master Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            A single unified pipeline to parse unformatted specs, eliminate duplicate procurement risk, and query hardware intuitively.
          </p>
        </div>

        {/* 3 Interactive Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id as any)}
                className={`p-4 rounded-xl border text-left transition relative font-mono ${
                  isActive
                    ? 'bg-zinc-900 border-cyan-500/60 text-zinc-100 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={isActive ? 'text-cyan-400 font-bold' : 'text-zinc-500'}>
                    PHASE {step.number}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                </div>
                <div className="text-sm font-semibold text-zinc-100">{step.title}</div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{step.description}</p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Stage Display */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          
          {/* TAB 1: INGEST */}
          {activeTab === 'ingest' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-mono">
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="text-xs text-cyan-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>MULTI-SOURCE INGESTION & PARSING</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Ingest Incomplete CSV, XLSX & Supplier Catalogs
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Industrial suppliers write specifications inconsistently — &ldquo;5HP&rdquo; vs &ldquo;3.7kW&rdquo;, &ldquo;SKF-22216&rdquo; vs &ldquo;BRG 22216E&rdquo;. InduSense ingests raw spreadsheets and applies NLP extraction to standardize units, RPM, voltage, and dimensions.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={onOpenUpload}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Upload Test Catalog</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-2 text-xs">
                <div className="text-[11px] text-zinc-400 pb-1">RAW SUPPLIER SPREADSHEET (SAMPLE ROWS):</div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-rose-400">SIE_MTR_5HP_460</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">Unstandardized Units</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">SIEMENS 5HP 3PHASE AC MOTOR 1750RPM 460V</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-rose-400">SKF-BRG-22216-E</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">Unparsed Tolerances</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Bearing 22216E SKF Brand 80*140*33mm Steel Cage</div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-rose-400">5HP-SIEMENS-INDUS</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Duplicate Alias</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">5 HP Siemens Industrial Electric Motor - Premium</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDUPLICATION */}
          {activeTab === 'dedup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-mono">
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="text-xs text-cyan-400 flex items-center gap-2">
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>AI DUPLICATE SHIELD</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Detect & Merge Duplicate OEM Parts Automatically
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Prevent duplicate parts from being ordered under different internal SKUs or varying distributor part numbers. InduSense computes exact cosine and attribute similarity to cluster identical components.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={onEnterWorkspace}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
                  >
                    <span>View Duplicate Shield</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
                <div className="flex items-center justify-between text-zinc-300 border-b border-zinc-800 pb-2">
                  <span className="text-cyan-400 font-bold">MATCHED DUPLICATE CLUSTER #01</span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 text-[10px]">96.4% Match</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-200 font-semibold">SKF 22216 E Spherical Roller</div>
                      <div className="text-[10px] text-zinc-400">SKU: SKF-22216-E • $240</div>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">Master SKU</span>
                  </div>

                  <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-400">SKF-BRG-22216-E Roller Bearing</div>
                      <div className="text-[10px] text-zinc-500">SKU: SKF-BRG-22216-E • $265</div>
                    </div>
                    <span className="text-[10px] text-amber-400">Duplicate</span>
                  </div>
                </div>
                <div className="pt-1 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Merging saves procurement inventory holding costs.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VECTOR SEARCH */}
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-mono">
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="text-xs text-cyan-400 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  <span>NATURAL LANGUAGE VECTOR MATCHING</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100">
                  Search by Operational Requirements & Standards
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Engineers don’t always know the exact part number. With InduSense, search with natural requirements like &ldquo;IE4 process motor for chemical plant&rdquo; or &ldquo;stainless centrifugal pump 25 bar&rdquo;.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={onEnterWorkspace}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
                  >
                    <span>Launch AI Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center gap-2 text-zinc-200">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>&ldquo;high-efficiency 3-phase motor with IE4 rating&rdquo;</span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">Siemens SIMOTICS SD IE4 Motor</span>
                    <span className="text-xs text-emerald-400">98% Match</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    Matches power ratings, continuous S1 duty profile, and IEC 60034-30 standard.
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300">Power: 3.7 kW</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300">RPM: 1450</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300">Efficiency: IE4</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
