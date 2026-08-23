import React, { useState } from 'react';
import { ProductItem } from '../../types';
import { querySemanticSearch, SemanticSearchResult } from '../../services/aiService';
import { Search, Sparkles, ArrowRight, ArrowUpRight, HelpCircle, CornerDownRight, RotateCcw, Database, Upload } from 'lucide-react';

interface SemanticSearchModalProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onOpenUpload?: () => void;
  onLoadDemoDataset?: () => void;
}

export const SemanticSearchModal: React.FC<SemanticSearchModalProps> = ({
  products,
  onSelectProduct,
  onOpenUpload,
  onLoadDemoDataset,
}) => {
  const [query, setQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isUnfamiliar, setIsUnfamiliar] = useState(false);
  const [unfamiliarExplanation, setUnfamiliarExplanation] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const samplePrompts = [
    'Spherical roller bearings > 5,000 RPM',
    'IE4 premium efficiency process motors',
    'Stainless centrifugal pumps 25 bar',
    'Condition monitoring vibration sensors IO-Link',
    'Incomplete or missing technical specs',
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setLastSearchedQuery(searchQuery);

    try {
      const response = await querySemanticSearch(searchQuery, products);
      setResults(response.results);
      setIsUnfamiliar(response.isUnfamiliarQuery);
      setUnfamiliarExplanation(response.explanation || null);
    } catch (err) {
      console.error(err);
      setIsUnfamiliar(true);
      setUnfamiliarExplanation('Search engine temporarily unavailable. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    setResults([]);
    setIsUnfamiliar(false);
    setUnfamiliarExplanation(null);
  };

  if (products.length === 0) {
    return (
      <div className="space-y-6 font-mono">
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-5 max-w-2xl mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-center justify-center mx-auto text-cyan-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-100">
              Vector Search Awaiting Catalog Data
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Your private catalog has 0 records. Upload your supplier spreadsheets to enable natural language semantic querying, or load the trial demo catalog to test immediately.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Catalog Spreadsheets</span>
              </button>
            )}
            {onLoadDemoDataset && (
              <button
                onClick={onLoadDemoDataset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Load 14-SKU Demo Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Minimal Search Control */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide">NATURAL LANGUAGE INDUSTRIAL VECTOR ENGINE</span>
          </div>
          {hasSearched && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by engineering specs, standards, or performance (e.g. 'high speed bearings with steel cage', '4kW IE4 motor')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            className="w-full pl-11 pr-28 py-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={isSearching || !query.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-xs font-mono font-medium bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition flex items-center gap-1.5 disabled:opacity-40 disabled:hover:bg-cyan-500"
          >
            {isSearching ? (
              <span>Matching...</span>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* Suggested Quick Queries */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Suggested:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(prompt);
                handleSearch(prompt);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition font-mono whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* UNFAMILIAR / OUT OF DOMAIN STATE */}
      {hasSearched && isUnfamiliar && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6 text-left animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 font-medium tracking-wider uppercase">
                  Unrecognized Industrial Query
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold font-mono text-zinc-100">
                No direct semantic match for &ldquo;{lastSearchedQuery}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                {unfamiliarExplanation ||
                  'The search query contains non-industrial terms, conversational phrases, or nomenclature not represented in the active equipment catalog.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/60 space-y-3">
            <div className="text-xs font-mono text-zinc-400">
              Try searching with physical parameters, DIN/ISO standards, or equipment types:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  setQuery('3-phase AC motor with IP55 protection 1750 RPM');
                  handleSearch('3-phase AC motor with IP55 protection 1750 RPM');
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/60 hover:border-cyan-500/40 text-left text-zinc-300 hover:text-zinc-100 transition group"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">3-phase AC motor with IP55 protection 1750 RPM</span>
              </button>

              <button
                onClick={() => {
                  setQuery('Festo pneumatic cylinder 63mm bore ISO 15552');
                  handleSearch('Festo pneumatic cylinder 63mm bore ISO 15552');
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/60 hover:border-cyan-500/40 text-left text-zinc-300 hover:text-zinc-100 transition group"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Festo pneumatic cylinder 63mm bore ISO 15552</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS LIST */}
      {hasSearched && !isUnfamiliar && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>Semantic Matches Found ({results.length})</span>
            <span>Sorted by Cosine Vector Confidence</span>
          </div>

          <div className="space-y-3">
            {results.map(({ product, similarityScore, matchReason }) => (
              <div
                key={product.id}
                className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition space-y-3 font-mono"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-cyan-400 border border-zinc-800">
                      {product.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-100 mt-1">
                      {product.cleanName}
                    </h4>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      SKU: {product.sku} • {product.manufacturer}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0">
                    <div>
                      <div className="text-sm font-bold text-cyan-400">{similarityScore || 90}% Match</div>
                      <div className="text-[10px] text-zinc-400 font-mono">Confidence</div>
                    </div>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-950 text-xs text-zinc-300 border border-zinc-800/60 font-sans">
                  <strong className="text-cyan-400 font-mono">Why Matched: </strong>
                  {matchReason}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {product.normalizedSpecs.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                    >
                      {spec.name}: {spec.value} {spec.unit || ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero results state */}
      {hasSearched && !isUnfamiliar && results.length === 0 && (
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center font-mono space-y-2">
          <div className="text-sm font-bold text-zinc-200">No matching components found</div>
          <div className="text-xs text-zinc-400 font-sans">
            Try adjusting your query with broader terms or engineering units.
          </div>
        </div>
      )}

    </div>
  );
};
