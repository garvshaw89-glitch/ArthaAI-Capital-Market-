import React from 'react';
import { Newspaper, TrendingUp, BarChart } from 'lucide-react';

export const MarketPulse: React.FC = () => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-lg text-white">Market Pulse</h3>
        <button className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Trending Card 1 */}
        <div className="bg-[#0F1115] rounded-xl border border-slate-800 p-3 flex gap-3 hover:border-indigo-500/40 transition-all">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#161920] flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-sky-500/20 flex items-center justify-center text-indigo-400">
              <Newspaper className="w-8 h-8" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Trending
                </span>
                <span className="text-slate-400 text-[10px] font-numeric">10m ago</span>
              </div>
              <h4 className="text-xs md:text-sm font-bold text-slate-100 leading-snug">
                Nifty hits new all-time high as auto and banking stocks lead market rally
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Source: MoneyControl</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#0F1115] rounded-xl border border-slate-800 p-3 flex gap-3 hover:border-indigo-500/40 transition-all">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#161920] flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Institutional
                </span>
                <span className="text-slate-400 text-[10px] font-numeric">25m ago</span>
              </div>
              <h4 className="text-xs md:text-sm font-bold text-slate-100 leading-snug">
                FIIs turn net buyers in Indian equities for third consecutive trading session
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Source: Economic Times</p>
          </div>
        </div>
      </div>
    </section>
  );
};
