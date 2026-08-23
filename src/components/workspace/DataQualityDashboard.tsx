import React from 'react';
import { DataQualityReport } from '../../types';
import { BarChart3, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, FileSpreadsheet, Activity, Upload, Database } from 'lucide-react';

interface DataQualityDashboardProps {
  report: DataQualityReport;
  onOpenExport: () => void;
  onOpenUpload?: () => void;
  onLoadDemoDataset?: () => void;
}

export const DataQualityDashboard: React.FC<DataQualityDashboardProps> = ({
  report,
  onOpenExport,
  onOpenUpload,
  onLoadDemoDataset,
}) => {
  const qualityPillars = [
    { label: 'Catalog Completeness', val: report.completeness, color: 'text-cyan-400', bar: 'bg-cyan-400' },
    { label: 'Field Consistency', val: report.consistency, color: 'text-blue-400', bar: 'bg-blue-400' },
    { label: 'Duplicate Risk Shield', val: report.duplicateRisk, color: 'text-purple-400', bar: 'bg-purple-400' },
    { label: 'Attribute Coverage', val: report.attributeCoverage, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'Taxonomy Validity', val: report.validity, color: 'text-amber-400', bar: 'bg-amber-400' },
  ];

  if (report.totalRecords === 0) {
    return (
      <div className="space-y-6 font-mono">
        <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-5 max-w-2xl mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-center justify-center mx-auto text-cyan-400">
            <Activity className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-100">
              Quality & Health Metrics Awaiting Catalog Ingestion
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
              Your private repository currently contains 0 records. Upload your supplier feeds to audit attribute completeness, or load the demo trial catalog to see real-time data health analytics.
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
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
            <Activity className="w-4 h-4" />
            <span>REAL-TIME INDUSTRIAL DATA HEALTH & AUDIT DASHBOARD</span>
          </div>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Structured Catalog</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Overall Health Score Gauge */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#27272a"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * report.overallScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-zinc-100">{report.overallScore}</span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider">/ 100 Score</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-100">Overall Catalog Integrity</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Based on {report.totalRecords} ingested industrial records.
            </p>
          </div>
        </div>

        {/* Right: 5 Pillars of Quality */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 text-xs">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Quality Pillar Breakdown:
          </div>
          <div className="space-y-3">
            {qualityPillars.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">{p.label}</span>
                  <strong className={p.color}>{p.val}%</strong>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full ${p.bar} transition-all duration-700`}
                    style={{ width: `${p.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Category Quality Index:
          </div>
          <div className="space-y-2">
            {report.categoryBreakdown.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-200">{cat.category}</span>
                  <span className="text-zinc-500 text-[10px]">({cat.count} items)</span>
                </div>
                <span className="font-bold text-emerald-400">{cat.avgQuality}% Avg Health</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Field Audit */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Common Missing Attributes:
          </div>
          <div className="space-y-2">
            {report.missingFieldStats.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800"
              >
                <span className="text-zinc-300">{item.field}</span>
                <span className="text-amber-400 font-bold text-xs">{item.percentage}% Missing</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
