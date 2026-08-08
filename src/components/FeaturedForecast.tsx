import React, { useState } from 'react';
import { StockQuote } from '../types';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

interface FeaturedForecastProps {
  stocks: StockQuote[];
}

export const FeaturedForecast: React.FC<FeaturedForecastProps> = ({ stocks }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('TATAMOTORS');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const stock = stocks.find((s) => s.symbol === selectedSymbol) || stocks[0];

  const history = stock?.history || [];
  const prices = history.map((h) => h.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.995 : 100;
  const maxPrice = prices.length ? Math.max(...prices) * 1.005 : 110;
  const priceRange = maxPrice - minPrice || 1;

  // Generate SVG path points
  const points = prices.map((p, index) => {
    const x = (index / Math.max(1, prices.length - 1)) * 100;
    const y = 100 - ((p - minPrice) / priceRange) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Predicted band points
  const lastY = prices.length ? 100 - ((prices[prices.length - 1] - minPrice) / priceRange) * 100 : 50;

  return (
    <section className="bg-[#0F1115] rounded-xl border border-slate-800 p-4 flex flex-col gap-3 shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-1.5">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Featured Forecast Chart
          </h3>
          <span className="bg-[#161920] border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">
            Backtest: 87.4%
          </span>
        </div>

        {/* Stock Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {stocks.slice(0, 5).map((s) => (
            <button
              key={s.symbol}
              onClick={() => setSelectedSymbol(s.symbol)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                selectedSymbol === s.symbol
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#161920] text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {s.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Quote Summary Bar */}
      {stock && (
        <div className="flex justify-between items-center bg-[#161920] rounded-lg p-2.5 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{stock.name}</span>
              <span className="text-[11px] text-slate-500">{stock.exchange}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-numeric font-bold text-lg text-white">
                ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`font-numeric text-xs font-semibold ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400">1H Shift</div>
            <div className={`font-numeric text-xs font-bold ${stock.hourlyChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stock.hourlyChangePercent >= 0 ? '+' : ''}{stock.hourlyChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Interactive Chart Area */}
      <div className="h-52 w-full bg-[#161920] rounded-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Timeframe Controls */}
        <div className="flex justify-between items-center z-10 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-[11px]">AI Real-time Tick Chart</span>
          </div>

          <div className="flex gap-1 bg-[#0A0B0E] p-0.5 rounded border border-slate-800">
            {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  timeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart SVG Canvas */}
        <div className="w-full h-36 relative z-10 my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Filled Gradient below line */}
            <path
              d={`M 0,100 L ${points} L 100,100 Z`}
              fill="url(#chartGradient)"
            />

            {/* Main Price Line */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Projected AI Extension Line */}
            <line
              x1="90"
              y1={lastY}
              x2="100"
              y2={Math.max(10, lastY - 8)}
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeDasharray="3,3"
            />
          </svg>

          {/* AI Forecast Projection Zone Overlay */}
          <div className="absolute top-0 bottom-0 right-0 w-1/4 bg-gradient-to-l from-indigo-500/15 to-transparent pointer-events-none flex items-center justify-end pr-2">
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/40">
              AI Forecast
            </span>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 z-10">
          <span>Min: ₹{minPrice.toFixed(1)}</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            Target Projection +4.2%
          </span>
          <span>Max: ₹{maxPrice.toFixed(1)}</span>
        </div>
      </div>
    </section>
  );
};
