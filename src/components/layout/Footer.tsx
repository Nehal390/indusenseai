import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC<{ onOpenUpload: () => void; onNavigate: (tab: string) => void }> = ({
  onOpenUpload,
  onNavigate,
}) => {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-zinc-400 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1 */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-zinc-100">
              INDUSENSE<span className="text-cyan-400">.AI</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Industrial product intelligence converting unstandardized catalogs and spreadsheets into structured technical master data.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider mb-3">
            Platform Capabilities
          </h4>
          <ul className="space-y-1.5 text-xs">
            <li><button onClick={() => onNavigate('explorer')} className="hover:text-zinc-200 transition">Catalog Explorer</button></li>
            <li><button onClick={() => onNavigate('duplicates')} className="hover:text-zinc-200 transition">Duplicate Shield</button></li>
            <li><button onClick={() => onNavigate('search')} className="hover:text-zinc-200 transition">Semantic Spec Search</button></li>
            <li><button onClick={() => onNavigate('compare')} className="hover:text-zinc-200 transition">Product Comparison Matrix</button></li>
            <li><button onClick={() => onNavigate('analytics')} className="hover:text-zinc-200 transition">Data Quality Analytics</button></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider mb-3">
            Standards & Compliance
          </h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> IEC 60034 Electrical Machines</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> ISO 15 Rolling Bearings</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> DIN / ANSI B73.1 Fluid Pumps</li>
            <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> IO-Link Sensor Profile 1.1</li>
          </ul>
        </div>

        {/* Col 4: Action */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
            Private Ingestion
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Ingest raw CSV or XLSX feeds into your private workspace.
          </p>
          <button
            onClick={onOpenUpload}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono transition border border-zinc-700"
          >
            Upload Catalog File
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div>© 2026 InduSense AI Inc. Enterprise Industrial Intelligence.</div>
        <div className="flex items-center gap-4">
          <span>Vector Precision: 99.4%</span>
          <span>SOC-2 Certified</span>
        </div>
      </div>
    </footer>
  );
};
