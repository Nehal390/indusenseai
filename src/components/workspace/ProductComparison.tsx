import React, { useState, useEffect } from 'react';
import { ProductItem, ComparisonAnalysis } from '../../types';
import { generateComparisonVerdict } from '../../services/aiService';
import { Sparkles, X, Check, AlertCircle, ArrowUpRight, Scale, ShieldCheck } from 'lucide-react';

interface ProductComparisonProps {
  products: ProductItem[];
  allCatalogProducts: ProductItem[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (product: ProductItem) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  allCatalogProducts,
  onRemoveProduct,
  onAddProduct,
  onSelectProduct,
}) => {
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(true);
      generateComparisonVerdict(products)
        .then((res) => setAnalysis(res))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setAnalysis(null);
    }
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4 font-mono">
        <Scale className="w-12 h-12 text-cyan-400 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-100">NO PRODUCTS SELECTED FOR COMPARISON</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Navigate to the Product Explorer and check the boxes next to 2 or more products to generate an AI side-by-side spec delta matrix.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <Scale className="w-4 h-4" />
            <span>MULTI-VARIABLE INDUSTRIAL SPEC COMPARISON MATRIX</span>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Comparing {products.length} Selected Components
          </span>
        </div>
      </div>

      {/* AI Comparative Verdict Banner */}
      {analysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-900 border border-cyan-500/40 space-y-2 font-mono text-xs shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI PROCUREMENT & SIZING VERDICT:</span>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed">{analysis.aiVerdict}</p>
        </div>
      )}

      {/* Side-by-Side Product Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 relative space-y-3 font-mono text-xs flex flex-col justify-between"
          >
            <button
              onClick={() => onRemoveProduct(p.id)}
              className="absolute top-3 right-3 p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
              title="Remove product"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {p.category}
              </span>
              <h4 className="font-bold text-zinc-100 line-clamp-2">{p.cleanName}</h4>
              <div className="text-[11px] text-zinc-400">SKU: {p.sku}</div>
              <div className="text-base font-bold text-cyan-300 pt-1">${p.price.toLocaleString()}</div>
            </div>

            <button
              onClick={() => onSelectProduct(p)}
              className="w-full py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-700 transition"
            >
              Inspect Profile
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Specs Matrix Table */}
      {analysis && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl font-mono text-xs">
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
            Specification Delta Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3.5 w-1/4">Specification Parameter</th>
                  {products.map((p) => (
                    <th key={p.id} className="p-3.5 text-zinc-200">{p.manufacturer}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {analysis.specDifferences.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition">
                    <td className="p-3.5 text-zinc-400 font-bold">{row.label}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-3.5">
                        <strong className="text-zinc-100">{row.values[p.id] || '—'}</strong> {row.unit || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
