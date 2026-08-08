import React from 'react';
import { StockQuote } from '../types';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';

interface ActiveSignalsProps {
  stocks: StockQuote[];
  onSelectStockToSimulate?: (symbol: string, type: 'SPIKE_UP' | 'DROP_DOWN') => void;
  onSelectStockForStrategy?: (symbol: string) => void;
}

export const ActiveSignals: React.FC<ActiveSignalsProps> = ({
  stocks,
  onSelectStockToSimulate,
  onSelectStockForStrategy
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-lg text-white">Active Signals & Watchlist</h3>
        <span className="text-xs text-slate-400">Live Market Feed</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {stocks.map((stock) => {
          const isUp = stock.changePercent >= 0;
          return (
            <div
              key={stock.symbol}
              className="bg-[#0F1115] rounded-xl border border-slate-800 p-3 flex items-center justify-between hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#161920] flex items-center justify-center border border-slate-800 font-bold text-base text-indigo-400 shadow-sm">
                  {stock.symbol.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {stock.name}
                  </h4>
                  <p className="font-numeric text-xs text-slate-400">{stock.exchange}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Price & Change */}
                <div className="text-right">
                  <div className="font-numeric font-bold text-sm text-slate-100">
                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`font-numeric text-xs font-semibold flex items-center justify-end ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>

                {/* Badge Signal */}
                <div className="text-right min-w-[90px]">
                  <div className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold text-[10px] inline-block mb-1 uppercase tracking-wide">
                    {stock.signal}
                  </div>
                  <p className="font-numeric text-[11px] text-emerald-400 font-semibold">{stock.expectedReturn}</p>
                </div>

                {/* Strategy Action Buttons */}
                <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-3">
                  <button
                    onClick={() => onSelectStockForStrategy && onSelectStockForStrategy(stock.symbol)}
                    className="p-1.5 rounded-lg bg-[#161920] border border-slate-800 hover:border-indigo-500/50 text-indigo-400 hover:text-indigo-300 transition-all"
                    title="Build Strategy Rule for this stock"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectStockToSimulate && onSelectStockToSimulate(stock.symbol, 'SPIKE_UP')}
                    className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-bold"
                    title="Simulate +5% Spike to test Strategy Engine"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
