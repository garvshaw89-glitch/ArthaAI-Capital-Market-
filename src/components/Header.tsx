import React from 'react';
import { MarketIndex } from '../types';
import { Search, Bell, Activity, Sparkles } from 'lucide-react';

interface HeaderProps {
  indices: MarketIndex[];
  onOpenCalculator: () => void;
  onOpenStrategyEngine: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ indices, onOpenCalculator, onOpenStrategyEngine, activeTab }) => {
  return (
    <header className="sticky top-0 w-full z-50 bg-[#0F1115]/95 backdrop-blur-md border-b border-slate-800 flex flex-col pt-3 px-4 pb-2">
      <div className="flex items-center justify-between mb-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              ArthaAI
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#161920] border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">Engine Active</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onOpenStrategyEngine}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'strategy'
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'bg-[#161920] text-slate-300 border border-slate-800 hover:border-indigo-500/50 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Strategy Engine</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          >
            Calculator
          </button>

          <div className="flex items-center gap-1 text-slate-400 border-l border-slate-800 pl-2">
            <button className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Market Index Ticker Ribbon */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between font-numeric text-xs text-slate-400 bg-[#0F1115] rounded-lg px-3 py-1.5 border border-slate-800 overflow-x-auto hide-scrollbar gap-4">
          {indices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-1.5 shrink-0">
              <span className="font-semibold text-slate-200">{idx.name}</span>
              <span className="text-emerald-400 font-medium">{idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              <span className={`flex items-center text-[10px] font-semibold ${idx.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {idx.changePercent >= 0 ? '▲' : '▼'} {Math.abs(idx.changePercent)}%
              </span>
            </div>
          ))}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 border-l border-slate-800 pl-3 shrink-0">
            <span>Market Status: <span className="text-emerald-400 font-semibold">OPEN</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};
