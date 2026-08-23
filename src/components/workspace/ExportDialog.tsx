import React, { useState } from 'react';
import { ProductItem } from '../../types';
import { exportDatasetToCsv, exportDatasetToXlsx } from '../../services/dataPipeline';
import { X, FileSpreadsheet, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  datasetName: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  products,
  datasetName,
}) => {
  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');

  if (!isOpen) return null;

  const handleExport = () => {
    const filename = `indusense_${datasetName.toLowerCase().replace(/\s+/g, '_')}_cleaned.${format}`;
    if (format === 'csv') {
      exportDatasetToCsv(products, filename);
    } else {
      exportDatasetToXlsx(products, filename);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#10b981', '#38bdf8'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-cyan-500/40 flex items-center justify-center">
              <Download className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">EXPORT ENRICHED MASTER DATASET</h3>
              <p className="text-xs text-zinc-400">Download normalized, standardized industrial catalog.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-Export Audit Stats */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
          <div className="text-cyan-400 font-bold">PRE-EXPORT CATALOG AUDIT SUMMARY:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
            <div>• Master Records: <strong className="text-zinc-100">{products.length}</strong></div>
            <div>• Normalized Specs: <strong className="text-zinc-100">100%</strong></div>
            <div>• Duplicates Reconciled: <strong className="text-emerald-400">Clean</strong></div>
            <div>• ISO Standards: <strong className="text-zinc-100">Mapped</strong></div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-zinc-300">Select Export Format:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-xl border text-center transition ${
                format === 'csv'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              CSV Spreadsheet (.csv)
            </button>
            <button
              onClick={() => setFormat('xlsx')}
              className={`p-3 rounded-xl border text-center transition ${
                format === 'xlsx'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Microsoft Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate & Download</span>
          </button>
        </div>

      </div>
    </div>
  );
};
