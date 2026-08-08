import React, { useState } from 'react';
import { AISentiment } from '../types';
import { Sparkles, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

interface AISentimentCardProps {
  sentiment: AISentiment;
  onRefreshSentiment: () => Promise<void>;
}

export const AISentimentCard: React.FC<AISentimentCardProps> = ({ sentiment, onRefreshSentiment }) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await onRefreshSentiment();
    setLoading(false);
  };

  return (
    <section className="bg-[#0F1115] rounded-xl p-4 md:p-5 relative overflow-hidden shadow-lg border border-indigo-500/25">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600 opacity-10 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Market Sentiment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Short-term algorithmic outlook & neural predictions</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-1.5 rounded-lg bg-[#161920] border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Re-run AI Sentiment Engine"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            {sentiment.outlook}
          </div>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 gap-3 mt-3 relative z-10">
        <div className="bg-[#161920] p-3 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">AI Confidence</p>
          <p className="text-xl md:text-2xl font-bold text-indigo-400 font-numeric">{sentiment.confidence}%</p>
        </div>
        <div className="bg-[#161920] p-3 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Nifty Target</p>
          <p className="text-xl md:text-2xl font-bold text-slate-100 font-numeric">
            {sentiment.niftyTarget.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* AI Drivers & Risk Disclaimer Footer */}
      <div className="bg-[#161920]/80 rounded-lg border border-slate-800 p-3 mt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Drivers & Market Context</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {sentiment.drivers}
        </p>
        <p className="text-[11px] text-amber-400/80 italic pt-1 border-t border-slate-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{sentiment.riskNote}</span>
        </p>
      </div>
    </section>
  );
};
