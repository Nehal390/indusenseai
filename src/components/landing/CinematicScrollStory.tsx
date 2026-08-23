import React, { useState } from 'react';
import { Database, Cpu, Layers, GitMerge, ShieldCheck, ArrowRight, Sparkles, AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface CinematicScrollStoryProps {
  onEnterWorkspace: () => void;
}

export const CinematicScrollStory: React.FC<CinematicScrollStoryProps> = ({ onEnterWorkspace }) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 'stage-1',
      number: '01',
      title: 'RAW INDUSTRIAL DATA',
      tagline: 'Industrial data is everywhere. Intelligence is not.',
      description: 'Legacy enterprise catalogs are trapped in unstandardized CSV and XLSX spreadsheets with corrupted SKUs, inconsistent unit strings (e.g. "5HP" vs "3.7kW"), missing technical tolerances, and fragmented supplier records.',
      icon: Database,
      accentColor: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
      interactiveData: {
        rawSnippets: [
          { sku: 'SIE_MTR_5HP_460', name: 'SIEMENS 5HP 3PHASE AC MOTOR', err: 'Inconsistent unit formatting' },
          { sku: 'SKF-BRG-22216-E', name: 'Bearing 22216E SKF Brand 80*140*33', err: 'Unparsed geometry dimensions' },
          { sku: '5HP-SIEMENS-INDUS', name: '5 HP Siemens Industrial Electric Motor', err: 'Duplicate SKU alias undetected' },
        ],
      },
    },
    {
      id: 'stage-2',
      number: '02',
      title: 'AI UNDERSTANDING',
      tagline: 'Multi-modal neural extraction & entity resolution.',
      description: 'The InduSense AI engine ingests raw text and technical documents, recognizing complex engineering attributes: rotational velocity (RPM), ingress protection (IP55/IP66), power ratings, and DIN/ISO compliance tags.',
      icon: Cpu,
      accentColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      interactiveData: {
        parsedAttributes: [
          { key: 'Power Output', value: '3.7 kW (5.0 HP)', confidence: '99.4%' },
          { key: 'Operating Envelope', value: '-20°C to +40°C', confidence: '98.1%' },
          { key: 'Dynamic Load Capacity', value: '240 kN', confidence: '99.8%' },
        ],
      },
    },
    {
      id: 'stage-3',
      number: '03',
      title: 'STRUCTURE & NORMALIZATION',
      tagline: 'Automatic classification across industrial taxonomies.',
      description: 'Messy catalog rows are instantly categorized into standardized hierarchies: Motors & Drives, Spherical Bearings, Multistage Centrifugal Pumps, Profile Pneumatics, and Condition Sensors.',
      icon: Layers,
      accentColor: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      interactiveData: {
        categories: [
          { name: 'Motors & Drives', count: '1,420 SKUs', status: 'Normalized' },
          { name: 'Bearings & Bushings', count: '890 SKUs', status: 'Normalized' },
          { name: 'Pumps & Hydraulics', count: '640 SKUs', status: 'Normalized' },
        ],
      },
    },
    {
      id: 'stage-4',
      number: '04',
      title: 'SEMANTIC RELATIONSHIPS',
      tagline: 'Building the connected engineering graph.',
      description: 'Products are linked dynamically. InduSense connects compatible shaft couplings, direct drop-in alternatives, certified replacements, and supplier price differentials.',
      icon: GitMerge,
      accentColor: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
      interactiveData: {
        links: [
          { source: 'Siemens SIMOTICS 184T', target: 'ABB M3BP 90L', rel: 'Direct Equivalent (IE4 Tier)' },
          { source: 'SKF 22216 E Bearing', target: 'FAG 22216-E1-XL', rel: 'Drop-in Interchangeable' },
        ],
      },
    },
    {
      id: 'stage-5',
      number: '05',
      title: 'CONTINUOUS INTELLIGENCE',
      tagline: 'Real-time health audits & duplicate elimination.',
      description: 'Continuous validation algorithms calculate completeness scores, flag missing technical specifications, and merge duplicate procurement entries into a single verified master record.',
      icon: ShieldCheck,
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      interactiveData: {
        healthMetrics: [
          { metric: 'Catalog Completeness', val: '98.6%', trend: '+34%' },
          { metric: 'Duplicate SKUs Eliminated', val: '142 Clusters', trend: 'Merged' },
          { metric: 'Search Precision', val: '99.2%', trend: 'Sub-second' },
        ],
      },
    },
    {
      id: 'stage-6',
      number: '06',
      title: 'ENTER INDUSENSE WORKSPACE',
      tagline: 'Take full control of your industrial product data.',
      description: 'Jump straight into the live enterprise application to explore, search with natural language, run explainable AI recommendations, and export pristine structured catalogs.',
      icon: Sparkles,
      accentColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/40',
      interactiveData: {
        cta: true,
      },
    },
  ];

  return (
    <section id="storyline" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>THE 6-STAGE INDUSTRIAL DATA TRANSFORMATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-mono">
            FROM SPREADSHEET CHAOS TO ACTIONABLE INTELLIGENCE
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Watch how unstandardized legacy catalogs transform into high-precision, searchable vector structures.
          </p>
        </div>

        {/* Stage Navigation Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-4">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isCurrent = activeStage === idx;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition relative overflow-hidden ${
                  isCurrent
                    ? 'bg-zinc-900 border-cyan-400 text-zinc-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                  <span className={isCurrent ? 'text-cyan-400 font-bold' : 'text-zinc-500'}>
                    STAGE {stg.number}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-cyan-400' : 'text-zinc-500'}`} />
                </div>
                <div className="text-xs font-semibold truncate text-zinc-200">{stg.title}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Storytelling Canvas Card */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Stage Explanation */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400">
                <span>STAGE {stages[activeStage].number} OF 06</span>
                <span>•</span>
                <span className="text-zinc-400">{stages[activeStage].tagline}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                {stages[activeStage].title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {stages[activeStage].description}
              </p>

              {activeStage === 5 ? (
                <div className="pt-4">
                  <button
                    onClick={onEnterWorkspace}
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95"
                  >
                    <span>Enter Live Workspace Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveStage((prev) => Math.min(prev + 1, stages.length - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                  >
                    <span>Next Transformation Stage</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Interactive Visualizer */}
            <div className="lg:col-span-6">
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-5 font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800/80 pb-2">
                  <span className="text-cyan-400 font-semibold">STAGE_TELEMETRY // {stages[activeStage].id.toUpperCase()}</span>
                  <span>STATUS: ACTIVE</span>
                </div>

                {activeStage === 0 && (
                  <div className="space-y-2">
                    <div className="text-rose-400 text-[11px]">3 CRITICAL ANOMALIES DETECTED IN RAW FEED:</div>
                    {stages[0].interactiveData.rawSnippets?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-900/90 border border-rose-900/40 flex items-start justify-between gap-2">
                        <div>
                          <div className="text-zinc-200 font-bold">{item.sku}</div>
                          <div className="text-zinc-400 text-[11px] truncate">{item.name}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] shrink-0 border border-rose-800/50">
                          {item.err}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 1 && (
                  <div className="space-y-2">
                    <div className="text-cyan-400 text-[11px]">NEURAL EXTRACTION & ENTITY CONFIDENCE:</div>
                    {stages[1].interactiveData.parsedAttributes?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-900/90 border border-cyan-900/40 flex items-center justify-between">
                        <span className="text-zinc-400">{item.key}:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-zinc-100">{item.value}</strong>
                          <span className="text-cyan-400 font-bold text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded">
                            {item.confidence}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 2 && (
                  <div className="space-y-2">
                    <div className="text-blue-400 text-[11px]">HIERARCHICAL TAXONOMY MAP:</div>
                    {stages[2].interactiveData.categories?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-900/90 border border-blue-900/40 flex items-center justify-between">
                        <span className="text-zinc-200 font-medium">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400">{item.count}</span>
                          <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 3 && (
                  <div className="space-y-2">
                    <div className="text-purple-400 text-[11px]">SEMANTIC GRAPH COMPATIBILITY BRIDGES:</div>
                    {stages[3].interactiveData.links?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-900/90 border border-purple-900/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-300 font-bold">{item.source}</span>
                          <span className="text-purple-400 text-[10px] bg-purple-950 px-1.5 py-0.5 rounded">
                            {item.rel}
                          </span>
                        </div>
                        <div className="text-zinc-400 text-[11px]">↔ Equivalent: {item.target}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 4 && (
                  <div className="space-y-2">
                    <div className="text-emerald-400 text-[11px]">INTELLIGENCE HEALTH AUDIT:</div>
                    {stages[4].interactiveData.healthMetrics?.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded bg-zinc-900/90 border border-emerald-900/40 flex items-center justify-between">
                        <span className="text-zinc-400">{item.metric}:</span>
                        <div className="flex items-center gap-2">
                          <strong className="text-emerald-300">{item.val}</strong>
                          <span className="text-zinc-500 text-[10px]">({item.trend})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 5 && (
                  <div className="p-4 rounded bg-cyan-950/30 border border-cyan-800/60 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                    <div className="text-zinc-200 font-bold">ALL CATALOG LAYERS INITIALIZED</div>
                    <p className="text-zinc-400 text-[11px]">
                      Access the full suite of product explorer, semantic search, duplicate shield, comparison matrix, and real-time voice copilot.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
