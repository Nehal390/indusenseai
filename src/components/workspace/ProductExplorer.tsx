import React, { useState, useMemo } from 'react';
import { ProductItem } from '../../types';
import { ThreeGraphScene } from '../common/ThreeGraphScene';
import { 
  Search, 
  Grid, 
  List, 
  Network, 
  Check, 
  Plus, 
  Sparkles, 
  FileSpreadsheet,
  ArrowUpRight,
  Upload,
  PackagePlus,
  Database,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ProductExplorerProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  selectedCompareIds: string[];
  onToggleCompare: (product: ProductItem) => void;
  onOpenCompareView: () => void;
  onOpenExport: () => void;
  onOpenUpload: () => void;
  onOpenAddProduct: () => void;
  onLoadDemoDataset: () => void;
}

export const ProductExplorer: React.FC<ProductExplorerProps> = ({
  products,
  onSelectProduct,
  selectedCompareIds,
  onToggleCompare,
  onOpenCompareView,
  onOpenExport,
  onOpenUpload,
  onOpenAddProduct,
  onLoadDemoDataset,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'graph'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'quality' | 'priceAsc' | 'priceDesc' | 'name'>('quality');

  const categories: string[] = ['All', 'Motors & Drives', 'Bearings & Bushings', 'Pumps & Hydraulics', 'Pneumatic Actuators', 'Industrial Sensors'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.cleanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.rawDescription.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'quality') return b.dataQualityScore - a.dataQualityScore;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return a.cleanName.localeCompare(b.cleanName);
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // EMPTY CATALOG STATE: When user creates a clean account and has 0 products
  if (products.length === 0) {
    return (
      <div className="space-y-6 font-mono">
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>CLEAN ENTERPRISE WORKSPACE ACTIVE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Your Catalog Repository Is Ready
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
              No products found in your private workspace yet. You can upload messy supplier spreadsheets (CSV / XLSX), manually add single components, or load the trial demo catalog.
            </p>
          </div>

          {/* 3 Primary Onboarding Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            
            {/* 1. Upload CSV / Excel */}
            <button
              onClick={onOpenUpload}
              className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-bold">OPTION 1</span>
              </div>
              <div className="text-xs font-bold text-zinc-100 group-hover:text-cyan-300">
                Upload Spreadsheet
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Drag & drop CSV or Excel catalog feeds to parse and clean automatically.
              </p>
            </button>

            {/* 2. Add Component Manually */}
            <button
              onClick={onOpenAddProduct}
              className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <PackagePlus className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 font-bold">OPTION 2</span>
              </div>
              <div className="text-xs font-bold text-zinc-100 group-hover:text-cyan-300">
                Add SKU Manually
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Directly enter technical specs, power, voltage, and pricing.
              </p>
            </button>

            {/* 3. Try Trial Demo Dataset */}
            <button
              onClick={onLoadDemoDataset}
              className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-500/40 hover:border-cyan-400 transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <Database className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">TRIAL TESTING</span>
              </div>
              <div className="text-xs font-bold text-zinc-100 group-hover:text-cyan-300">
                Load 14-SKU Demo
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Explore with pre-loaded motors, bearings, pumps, and sensors.
              </p>
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* Top Filter & Action Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
        
        {/* Search input & View switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by SKU, model name, specification, manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-700/80 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
            />
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Grid Spec View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'table' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Dense Data Table"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`p-1.5 rounded text-xs transition ${
                  viewMode === 'graph' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="3D Knowledge Graph"
              >
                <Network className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition"
              title="Add Single Product"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add SKU</span>
            </button>

            {/* Compare Drawer CTA */}
            {selectedCompareIds.length > 0 && (
              <button
                onClick={onOpenCompareView}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>Compare ({selectedCompareIds.length})</span>
              </button>
            )}

            {/* Export structured catalog */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
            >
              <FileSpreadsheet className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Category Pills & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 font-semibold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-md px-2 py-1 text-zinc-200 focus:outline-none"
            >
              <option value="quality">Data Quality Score</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="name">Nomenclature A-Z</option>
            </select>
          </div>
        </div>

      </div>

      {/* VIEW MODES */}

      {/* 1. 3D KNOWLEDGE GRAPH VIEW */}
      {viewMode === 'graph' && (
        <ThreeGraphScene products={filteredProducts} onSelectProduct={onSelectProduct} />
      )}

      {/* 2. DENSE DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 w-10">Compare</th>
                  <th className="p-3">SKU / Model Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Manufacturer</th>
                  <th className="p-3">Normalized Specs</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Health</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredProducts.map((p) => {
                  const isCompared = selectedCompareIds.includes(p.id);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-800/40 transition group"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => onToggleCompare(p)}
                          className="accent-cyan-400 cursor-pointer"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-zinc-100 group-hover:text-cyan-300 transition">
                          {p.cleanName}
                        </div>
                        <div className="text-[11px] text-zinc-500">{p.sku}</div>
                      </td>
                      <td className="p-3 text-zinc-400">{p.category}</td>
                      <td className="p-3 text-zinc-300">{p.manufacturer}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.normalizedSpecs.slice(0, 2).map((s, i) => (
                            <span key={i} className="text-[10px] bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300">
                              {s.name}: {s.value}{s.unit || ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-zinc-100">${p.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded border bg-zinc-950 border-zinc-800 text-zinc-300">
                          {p.dataQualityScore}%
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs rounded transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CARD / SPEC GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isCompared = selectedCompareIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 p-4 flex flex-col justify-between space-y-3 transition group"
              >
                <div className="space-y-2.5">
                  
                  {/* Top Category & Health */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {p.dataQualityScore}% Health
                    </span>
                  </div>

                  {/* Title & SKU */}
                  <div>
                    <h4
                      onClick={() => onSelectProduct(p)}
                      className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition font-mono cursor-pointer line-clamp-2"
                    >
                      {p.cleanName}
                    </h4>
                    <div className="text-xs font-mono text-zinc-500 mt-0.5">
                      SKU: {p.sku} • {p.manufacturer}
                    </div>
                  </div>

                  {/* Normalized Specs Preview */}
                  <div className="space-y-1 pt-1.5 border-t border-zinc-800/80 font-mono text-xs">
                    {p.normalizedSpecs.slice(0, 3).map((spec, i) => (
                      <div key={i} className="flex items-center justify-between p-1 rounded bg-zinc-950 border border-zinc-800/60">
                        <span className="text-zinc-400 text-[11px]">{spec.name}</span>
                        <span className="text-zinc-200 text-[11px] font-medium">{spec.value} {spec.unit || ''}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between font-mono">
                  <span className="text-sm font-semibold text-zinc-100">${p.price.toLocaleString()}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleCompare(p)}
                      className={`p-1.5 rounded-lg text-xs border transition ${
                        isCompared
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
                    >
                      {isCompared ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
