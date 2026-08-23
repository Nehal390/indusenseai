import React, { useState } from 'react';
import { ProductItem, RecommendationResult } from '../../types';
import { generateIndustrialRecommendation } from '../../services/aiService';
import { Sparkles, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, DollarSign, Layers, ArrowUpRight } from 'lucide-react';

interface RecommendationEngineProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  products,
  onSelectProduct,
}) => {
  const [requirement, setRequirement] = useState('');
  const [operatingDuty, setOperatingDuty] = useState('Continuous 24/7 Heavy Industrial');
  const [environment, setEnvironment] = useState('Harsh / Corrosive / Washdown');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const sampleRequirements = [
    'I need a spherical roller bearing for a heavy vibrating crusher running at 5,000 RPM.',
    'I need an energy-efficient 3-phase induction motor for severe washdown chemical pumps.',
    'High-pressure multistage pump capable of delivering 15 m3/h at 25 bar operating pressure.',
    'Real-time condition monitoring vibration sensor with IO-Link 1.1 protocol.',
  ];

  const handleGenerate = async (customText?: string) => {
    const text = customText || requirement;
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      const fullQuery = `${text} [Duty: ${operatingDuty}, Environment: ${environment}]`;
      const result = await generateIndustrialRecommendation(fullQuery, products);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Parameter Input Form */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>EXPLAINABLE INDUSTRIAL RECOMMENDATION ENGINE</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-zinc-300">
            Define Engineering Requirements & Operational Parameters:
          </label>
          <textarea
            rows={3}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="e.g. 'I need a high-power AC motor for a continuous chemical slurry mixer in an IP66 washdown environment'..."
            className="w-full p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-700 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition resize-none"
          />
        </div>

        {/* Operating Conditions Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1.5">
            <span className="text-zinc-400">Duty Cycle / Load Profile:</span>
            <select
              value={operatingDuty}
              onChange={(e) => setOperatingDuty(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="Continuous 24/7 Heavy Industrial">Continuous 24/7 Severe Duty (S1)</option>
              <option value="Intermittent / High Start-Stop Cycle">Intermittent High Shock Cycle (S3/S4)</option>
              <option value="Precision High-Speed Indexing">High-Speed Precision Positioning</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-zinc-400">Ambient Installation Environment:</span>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-200 focus:outline-none"
            >
              <option value="Harsh / Corrosive / Washdown">Corrosive / High Ingress / Washdown (IP66+)</option>
              <option value="High Vibration / Thermal Extremes">High Vibration / Thermal Shock (-20°C to +80°C)</option>
              <option value="Standard Clean Industrial Floor">Standard Indoor Industrial Plant (IP55)</option>
            </select>
          </div>
        </div>

        {/* Quick Requirement Chips */}
        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-400">Select pre-configured industrial scenario:</span>
          <div className="flex flex-wrap gap-2">
            {sampleRequirements.map((req, i) => (
              <button
                key={i}
                onClick={() => {
                  setRequirement(req);
                  handleGenerate(req);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-zinc-200 transition font-mono truncate max-w-md"
              >
                {req}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing Trade-off Model...' : 'Synthesize AI Engineering Recommendation'}</span>
        </button>

      </div>

      {/* Recommendation Results Card */}
      {recommendation && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>EXPLAINABLE AI RECOMMENDATION REPORT</span>
              </div>
              <h3 className="text-xl font-bold font-mono text-zinc-100">
                Optimal Candidate: {recommendation.bestMatch.cleanName}
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {recommendation.matchScore}% Spec Compliance
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {recommendation.confidence}% Confidence
              </span>
            </div>
          </div>

          {/* Section 1: Why This Was Recommended */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-2 font-mono text-xs">
            <div className="text-cyan-400 font-bold">ENGINEERING JUSTIFICATION:</div>
            <p className="text-zinc-200 leading-relaxed text-sm">{recommendation.reason}</p>
          </div>

          {/* Section 2: Operating Envelope & Trade-offs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
              <div className="text-emerald-400 font-bold">RECOMMENDED OPERATING ENVELOPE:</div>
              <p className="text-zinc-300 leading-relaxed">{recommendation.recommendedOperatingEnvelope}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ENGINEERING TRADE-OFFS & CONSTRAINTS:</span>
              </div>
              <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                {recommendation.tradeOffs.map((trade, i) => (
                  <li key={i}>{trade}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Certified Direct Alternatives */}
          {recommendation.directAlternatives.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Certified Direct Alternatives & Substitutes:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.directAlternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 transition space-y-2.5 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">{alt.product.cleanName}</span>
                      <span className="text-cyan-400 font-bold">${alt.product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{alt.whyConsider}</p>
                    <div className="text-[11px] text-amber-300/90 pt-1 border-t border-zinc-800/80">
                      Delta: {alt.tradeOff}
                    </div>
                    <button
                      onClick={() => onSelectProduct(alt.product)}
                      className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] transition flex items-center justify-center gap-1 border border-zinc-700"
                    >
                      <span>Inspect Alternative</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between font-mono">
            <span className="text-xs text-zinc-400">
              Primary Spec Price: <strong className="text-zinc-100">${recommendation.bestMatch.price.toLocaleString()}</strong>
            </span>
            <button
              onClick={() => onSelectProduct(recommendation.bestMatch)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
            >
              Open Full Candidate Intelligence Profile
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
