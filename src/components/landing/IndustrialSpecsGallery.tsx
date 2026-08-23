import React, { useState } from 'react';
import { ThreeExplodedView } from '../common/ThreeExplodedView';
import { Layers, Zap, Shield, FileText, ArrowUpRight } from 'lucide-react';
import { ProductItem } from '../../types';

interface IndustrialSpecsGalleryProps {
  onSelectProduct: (product: ProductItem) => void;
  sampleProducts: ProductItem[];
}

export const IndustrialSpecsGallery: React.FC<IndustrialSpecsGalleryProps> = ({
  onSelectProduct,
  sampleProducts,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeProduct = sampleProducts[selectedIdx] || sampleProducts[0];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Layers className="w-3.5 h-3.5" />
            <span>INTERACTIVE CAD & EXPLODED VIEW ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-mono">
            PRECISION 3D INDUSTRIAL PRODUCT INSPECTION
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Inspect physical components in full 3D exploded space. Analyze material tolerances, thermal limits, and assembly subsystems.
          </p>
        </div>

        {/* Product selector buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {sampleProducts.slice(0, 5).map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition flex items-center gap-2 border ${
                selectedIdx === idx
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{p.category.split(' ')[0]}: {p.cleanName.slice(0, 24)}...</span>
            </button>
          ))}
        </div>

        {/* 3D Exploded View Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8">
            <ThreeExplodedView productName={activeProduct.cleanName} />
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {activeProduct.category}
                </span>
                <span className="text-xs font-mono text-zinc-400">SKU: {activeProduct.sku}</span>
              </div>

              <h3 className="text-lg font-bold text-zinc-100 font-mono">{activeProduct.cleanName}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{activeProduct.aiDescription}</p>

              {/* Normalized specs table */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-cyan-400 font-semibold">STANDARDIZED SPECIFICATIONS:</div>
                <div className="space-y-1.5 text-xs font-mono">
                  {activeProduct.normalizedSpecs.slice(0, 5).map((spec, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded bg-zinc-950/60 border border-zinc-800/60">
                      <span className="text-zinc-400">{spec.name}</span>
                      <strong className="text-zinc-200">{spec.value} {spec.unit || ''}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-500 font-mono">UNIT PRICE:</div>
                  <div className="text-lg font-bold font-mono text-zinc-100">${activeProduct.price.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onSelectProduct(activeProduct)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition font-mono"
                >
                  <span>Full Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
