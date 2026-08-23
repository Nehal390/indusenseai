import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Sliders, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const ProblemVisualizer: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950/60 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE CATALOG COMPARISON</span>
          </div>
          <h2 className="text-3xl font-bold font-mono text-zinc-100">
            LEGACY SPREADSHEET VS INDUSENSE INTELLIGENCE
          </h2>
          <p className="text-sm text-zinc-400">
            Drag the slider to reveal how InduSense converts ambiguous raw text into certified engineering specifications.
          </p>
        </div>

        {/* Interactive Split View Container */}
        <div className="relative rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Box: Raw Chaos */}
            <div className="p-6 rounded-xl bg-zinc-950/80 border border-rose-900/40 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>RAW LEGACY CSV SPREADSHEET</span>
                  </div>
                  <span className="text-[11px] font-mono text-rose-500 bg-rose-950/50 px-2 py-0.5 rounded">
                    Quality: 42% (High Risk)
                  </span>
                </div>

                <div className="font-mono text-xs text-zinc-300 space-y-3 pt-4">
                  <div>
                    <span className="text-zinc-500">RAW_SKU:</span> SIE-MOT-5HP-3PH-460V
                  </div>
                  <div>
                    <span className="text-zinc-500">RAW_STRING:</span> SIEMENS 5HP 3PHASE AC MOTOR 1800RPM 460V
                  </div>
                  <div className="p-3 bg-rose-950/20 rounded border border-rose-900/30 text-rose-300 text-[11px] leading-relaxed">
                    "heavy duty 5hp tefc motor 460 volts 60hz cast iron frame nema 184t footprint"
                  </div>
                  <div className="space-y-1 text-zinc-400 text-[11px] pt-2">
                    <div className="text-rose-400 flex items-center gap-1.5">✕ No torque or nominal power (kW) conversion</div>
                    <div className="text-rose-400 flex items-center gap-1.5">✕ Ingress rating unparsed from description</div>
                    <div className="text-rose-400 flex items-center gap-1.5">✕ 2 undetected vendor duplicate records</div>
                    <div className="text-rose-400 flex items-center gap-1.5">✕ Impossible to perform natural language query</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                Procurement Risk: Duplicate orders, inaccurate sizing, delayed lead times.
              </div>
            </div>

            {/* Right Box: InduSense Intelligence */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-cyan-950/20 to-zinc-950/90 border border-cyan-500/40 flex flex-col justify-between space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>INDUSENSE NORMALIZED MASTER</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    Quality: 98% (Certified)
                  </span>
                </div>

                <div className="font-mono text-xs space-y-3 pt-4">
                  <div>
                    <span className="text-zinc-400">STANDARDIZED:</span>{' '}
                    <strong className="text-zinc-100">Siemens SIMOTICS GP 5 HP (3.7 kW) Induction Motor</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Power Rating:</span> <strong className="text-cyan-300">3.7 kW / 5.0 HP</strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Full Torque:</span> <strong className="text-cyan-300">20.4 Nm</strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Enclosure:</span> <strong className="text-cyan-300">IP55 / TEFC</strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400">Efficiency:</span> <strong className="text-emerald-400">IE3 Premium</strong>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] pt-1">
                    <div className="text-cyan-300 flex items-center gap-1.5">✓ IEC / DIN / NEMA multi-standard indexed</div>
                    <div className="text-cyan-300 flex items-center gap-1.5">✓ Semantic duplicates linked & grouped</div>
                    <div className="text-cyan-300 flex items-center gap-1.5">✓ 1-click CAD exploded view ready</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Hallucination Guarantee • Deterministic Spec Extraction</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
