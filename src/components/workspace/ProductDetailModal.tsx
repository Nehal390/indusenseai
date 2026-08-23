import React, { useState } from 'react';
import { ProductItem } from '../../types';
import { ThreeExplodedView } from '../common/ThreeExplodedView';
import { X, ShieldCheck, Layers, Cpu, Check, AlertCircle, FileText, ArrowRight, ExternalLink, Bookmark, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onSelectAlternative?: (product: ProductItem) => void;
  onToggleCompare?: (product: ProductItem) => void;
  isCompared?: boolean;
  onBookmark?: (productId: string) => void;
  isBookmarked?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectAlternative,
  onToggleCompare,
  isCompared = false,
  onBookmark,
  isBookmarked = false,
}) => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'cad3d' | 'rawSource'>('intelligence');

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-start justify-between gap-4 bg-zinc-950/40">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {product.category}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                SKU: <strong className="text-zinc-200">{product.sku}</strong>
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                Quality: {product.dataQualityScore}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">
              {product.cleanName}
            </h2>
            <div className="text-xs text-zinc-400 flex items-center gap-3">
              <span>Manufacturer: <strong className="text-zinc-200">{product.manufacturer}</strong></span>
              <span>•</span>
              <span>Supplier: <strong className="text-zinc-200">{product.supplier}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onBookmark && (
              <button
                onClick={() => onBookmark(product.id)}
                className={`p-2 rounded-xl border transition ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
                title="Bookmark Product"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800/80 bg-zinc-950/20 font-mono text-xs">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition ${
              activeTab === 'intelligence'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Intelligence Profile
          </button>
          <button
            onClick={() => setActiveTab('cad3d')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition ${
              activeTab === 'cad3d'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            3D CAD Exploded View
          </button>
          <button
            onClick={() => setActiveTab('rawSource')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition ${
              activeTab === 'rawSource'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Raw Ingested Data vs Inferred
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              
              {/* AI Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-900 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI SPECIFICATION & OPERATING ENVELOPE SUMMARY</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {product.aiDescription}
                </p>
              </div>

              {/* Standardized Spec Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  Normalized Engineering Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.normalizedSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between font-mono text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="text-zinc-400">{spec.name}</span>
                        {spec.isAiInferred && (
                          <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                            <span>✦ AI Normalized</span>
                            <span>({spec.confidence}%)</span>
                          </div>
                        )}
                      </div>
                      <strong className="text-zinc-100 text-sm">
                        {spec.value} {spec.unit || ''}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase">Industrial Applications</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.applications.map((app, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase">Standards & Compliance</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.certifications.map((cert, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-cyan-300 font-mono">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'cad3d' && (
            <div className="space-y-4">
              <ThreeExplodedView productName={product.cleanName} />
            </div>
          )}

          {activeTab === 'rawSource' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-zinc-400 font-bold border-b border-zinc-800 pb-2">ORIGINAL UNPROCESSED ROW FIELDS:</div>
                <div className="space-y-2 text-zinc-300">
                  <div><span className="text-zinc-500">raw_name:</span> {product.rawName}</div>
                  <div><span className="text-zinc-500">raw_description:</span> {product.rawDescription}</div>
                  <div><span className="text-zinc-500">raw_price:</span> ${product.price} {product.currency}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
                <div className="text-cyan-400 font-bold">MISSING ATTRIBUTE DETECTION:</div>
                {product.missingFields.length === 0 ? (
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>All critical technical specifications verified.</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-rose-300">
                    <div>The following parameters were missing in source and enriched by InduSense:</div>
                    <ul className="list-disc list-inside">
                      {product.missingFields.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs">
            <span className="text-zinc-400">UNIT PRICE:</span>{' '}
            <strong className="text-lg text-zinc-100 font-bold">${product.price.toLocaleString()}</strong>
          </div>

          <div className="flex items-center gap-3">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(product)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition ${
                  isCompared
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-zinc-100'
                }`}
              >
                {isCompared ? '✓ Added to Comparison' : '+ Compare Product'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
