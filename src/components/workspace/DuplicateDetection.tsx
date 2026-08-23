import React, { useState } from 'react';
import { DuplicateGroup, ProductItem } from '../../types';
import { ShieldAlert, Check, X, ArrowRight, Merge, RefreshCw, AlertTriangle, ShieldCheck, Database, Upload, Sparkles, Split, Eye, Tag, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DuplicateDetectionProps {
  duplicateGroups: DuplicateGroup[];
  productsCount: number;
  onMergeGroup: (groupId: string, masterId: string) => void;
  onIgnoreGroup: (groupId: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onOpenUpload?: () => void;
  onLoadDemoDataset?: () => void;
}

export const DuplicateDetection: React.FC<DuplicateDetectionProps> = ({
  duplicateGroups = [],
  productsCount = 0,
  onMergeGroup,
  onIgnoreGroup,
  onSelectProduct,
  onOpenUpload,
  onLoadDemoDataset,
}) => {
  const safeGroups = Array.isArray(duplicateGroups) ? duplicateGroups : [];
  const [selectedGroupId, setSelectedGroupId] = useState<string>(safeGroups[0]?.id || '');
  
  // Find currently active group or fallback to first
  const activeGroup = safeGroups.find((g) => g.id === selectedGroupId) || safeGroups[0];

  const handleMerge = (groupId: string, masterId: string) => {
    onMergeGroup(groupId, masterId);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#10b981', '#38bdf8'],
    });

    // Auto-advance to next unresolved group
    const nextUnresolved = safeGroups.find(g => g.id !== groupId && g.resolutionStatus === 'unresolved');
    if (nextUnresolved) {
      setSelectedGroupId(nextUnresolved.id);
    }
  };

  const unresolvedCount = safeGroups.filter(g => g.resolutionStatus === 'unresolved').length;
  const resolvedCount = safeGroups.filter(g => g.resolutionStatus !== 'unresolved').length;

  // If user catalog has 0 items
  if (productsCount === 0) {
    return (
      <div className="space-y-6 font-mono">
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-5 max-w-2xl mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-100">
              No Data Ingested For Duplicate Auditing
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Your private catalog currently has 0 items. Ingest your multi-supplier CSV/XLSX feeds to detect identical OEM parts, or load the trial demo catalog to see live duplicate clustering.
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
    <div className="space-y-6 font-mono">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>SEMANTIC DUPLICATE SHIELD & DEDUPLICATION HUB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-300 font-medium">
              {unresolvedCount} Pending Clusters
            </span>
            {resolvedCount > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-medium">
                {resolvedCount} Merged
              </span>
            )}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
          InduSense analyzes multi-vendor product catalogs using cross-field string distance heuristics and semantic spec matching to detect identical OEM parts entered with conflicting names, units, or supplier SKUs.
        </p>
      </div>

      {safeGroups.length === 0 || (unresolvedCount === 0 && safeGroups.every(g => g.resolutionStatus !== 'unresolved')) ? (
        <div className="p-12 rounded-2xl bg-zinc-900/80 border border-emerald-500/40 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <div className="text-lg font-bold text-zinc-100">ALL DUPLICATE CLUSTERS RECONCILED</div>
          <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
            Your industrial catalog has zero remaining duplicate ambiguities. All vendor records are normalized under authoritative golden master SKUs.
          </p>
          {resolvedCount > 0 && (
            <div className="pt-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-800/60">
                ✓ {resolvedCount} clusters successfully consolidated
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Duplicate Groups List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs text-zinc-400 uppercase tracking-wider flex items-center justify-between px-1">
              <span>Detected Clusters ({safeGroups.length})</span>
              <span className="text-amber-400">{unresolvedCount} Action Required</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {safeGroups.map((group) => {
                const isSelected = (activeGroup?.id === group.id);
                const isResolved = group.resolutionStatus !== 'unresolved';
                const duplicateCount = group.duplicateItems?.length || 0;
                const matchConfidence = group.duplicateItems?.[0]?.similarityScore || 93;

                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full p-4 rounded-xl border text-left transition relative ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                    } ${isResolved ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-zinc-400 text-[11px] font-semibold">
                        CLUSTER #{group.id.slice(-6).toUpperCase()}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        matchConfidence >= 95
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}>
                        {matchConfidence}% Similarity
                      </span>
                    </div>

                    <div className="text-xs font-bold text-zinc-100 line-clamp-1">
                      {group.masterProduct?.cleanName || group.masterProduct?.rawName || 'Industrial Component'}
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-1.5 flex items-center justify-between">
                      <span className="text-zinc-400">{duplicateCount + 1} Conflicting Vendor SKUs</span>
                      {isResolved ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-semibold">
                          <Check className="w-3 h-3" /> Merged
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[10px] font-semibold">Review Pending</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Cluster Diff & Resolution Panel */}
          {activeGroup && (
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <span>DUPLICATE AUDIT</span>
                      <span className="text-cyan-400 font-mono">#{activeGroup.id.slice(-6).toUpperCase()}</span>
                    </h3>
                    <div className="text-xs text-zinc-400 mt-1 font-sans">
                      {activeGroup.duplicateItems?.[0]?.reason || 'High semantic correlation detected across supplier catalog feeds.'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
                      {activeGroup.duplicateItems?.[0]?.similarityScore || 94}% Confidence
                    </span>
                  </div>
                </div>

                {/* Master SKU (Suggested Golden Record) */}
                {activeGroup.masterProduct && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>SUGGESTED MASTER RECORD (GOLDEN STANDARD):</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">Retains normalized specs</span>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-zinc-100">
                            {activeGroup.masterProduct.cleanName}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            SKU: <span className="text-zinc-200">{activeGroup.masterProduct.sku}</span> • {activeGroup.masterProduct.manufacturer} • Supplier: {activeGroup.masterProduct.supplier}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                          ${activeGroup.masterProduct.price?.toLocaleString()}
                        </span>
                      </div>

                      {activeGroup.masterProduct.normalizedSpecs && activeGroup.masterProduct.normalizedSpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {activeGroup.masterProduct.normalizedSpecs.slice(0, 4).map((spec, i) => (
                            <span key={i} className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300">
                              {spec.name}: <strong className="text-zinc-100">{spec.value}{spec.unit ? ` ${spec.unit}` : ''}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-zinc-900 text-zinc-400">
                        <span className="font-sans italic truncate max-w-[320px]">
                          Raw string: &ldquo;{activeGroup.masterProduct.rawName}&rdquo;
                        </span>
                        <button
                          onClick={() => onSelectProduct(activeGroup.masterProduct)}
                          className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                        >
                          <Eye className="w-3 h-3" /> Inspect Spec
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duplicate Variants to consolidate */}
                <div className="space-y-2">
                  <div className="text-xs text-amber-400 font-bold flex items-center justify-between">
                    <span>DETECTED DUPLICATE VARIANTS ({activeGroup.duplicateItems?.length || 0}):</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Conflicting vendor representations</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeGroup.duplicateItems?.map((dupItem, idx) => {
                      const dup = dupItem.product;
                      if (!dup) return null;

                      return (
                        <div
                          key={dup.id || idx}
                          className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold text-zinc-200">{dup.cleanName || dup.rawName}</div>
                              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                                SKU: <span className="text-zinc-300">{dup.sku}</span> • Supplier: <span className="text-amber-300/90">{dup.supplier}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-bold text-zinc-200 font-mono">${dup.price?.toLocaleString()}</div>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                {dupItem.similarityScore}% match
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-zinc-300 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800 font-sans">
                            <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-0.5">Raw Vendor Nomenclature:</span>
                            &ldquo;{dup.rawName}&rdquo;
                          </div>

                          {/* Matched & Conflict Tags */}
                          <div className="space-y-1 text-[10px]">
                            {dupItem.matchedFields && dupItem.matchedFields.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-emerald-400 font-medium">Matched:</span>
                                {dupItem.matchedFields.map((field, fIdx) => (
                                  <span key={fIdx} className="bg-emerald-950/50 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                    {field}
                                  </span>
                                ))}
                              </div>
                            )}

                            {dupItem.conflictFields && dupItem.conflictFields.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                <span className="text-amber-400 font-medium">Conflicts:</span>
                                {dupItem.conflictFields.map((conflict, cIdx) => (
                                  <span key={cIdx} className="bg-amber-950/50 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">
                                    {conflict}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-1 flex items-center justify-end">
                            <button
                              onClick={() => onSelectProduct(dup)}
                              className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                            >
                              <Eye className="w-3 h-3" /> View Specs
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                {activeGroup.resolutionStatus === 'unresolved' ? (
                  <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => onIgnoreGroup(activeGroup.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
                    >
                      Keep as Separate Distinct SKUs
                    </button>

                    <button
                      onClick={() => handleMerge(activeGroup.id, activeGroup.masterProduct?.id || '')}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition"
                    >
                      <Merge className="w-3.5 h-3.5" />
                      <span>Consolidate & Merge Duplicate SKUs</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>This duplicate cluster has been merged into the golden master record.</span>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
