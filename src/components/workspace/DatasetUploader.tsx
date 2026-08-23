import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, X, Sparkles, Database, FileText } from 'lucide-react';
import { parseFileToDataset } from '../../services/dataPipeline';
import { Dataset } from '../../types';
import { INITIAL_DATASETS } from '../../data/sampleDatasets';

interface DatasetUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (dataset: Dataset) => void;
}

export const DatasetUploader: React.FC<DatasetUploaderProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setProgressPercent(10);
    setProcessingStage('Reading raw file data stream...');

    try {
      const dataset = await parseFileToDataset(file, (stage, percent) => {
        setProcessingStage(stage);
        setProgressPercent(percent);
      });

      setTimeout(() => {
        setIsProcessing(false);
        onDatasetLoaded(dataset);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMsg(`Failed to parse file: ${err?.message || 'Invalid format'}. Ensure the file has valid columns.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  };

  const handleSelectSample = (sample: Dataset) => {
    onDatasetLoaded(sample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-cyan-500/40 flex items-center justify-center">
              <Upload className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100 font-mono">
                INGEST INDUSTRIAL CATALOG
              </h3>
              <p className="text-xs text-zinc-400">
                Upload CSV or XLSX files to parse, clean, normalize, and vectorize.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <div className="text-base font-bold text-zinc-100">{processingStage}</div>
              <div className="text-xs text-cyan-400">{progressPercent}% Pipeline Completed</div>
            </div>
            <div className="w-64 h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-zinc-700 hover:border-cyan-500/60 bg-zinc-950/60 hover:bg-zinc-950/90'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-zinc-200">
                  Drop your CSV or XLSX file here, or <span className="text-cyan-400 underline">browse</span>
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Supports up to 50MB files • Automatically detects columns (SKU, Name, Specs, Price)
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-mono text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick-Load Sample Datasets */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  OR INSTANTLY LOAD PRE-CONFIGURED INDUSTRIAL DATASET:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_DATASETS.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => handleSelectSample(ds)}
                    className="p-3 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-left transition space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition font-mono">
                        {ds.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {ds.recordCount} SKUs
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{ds.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
