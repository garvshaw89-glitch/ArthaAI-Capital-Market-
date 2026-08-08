import React from 'react';

export const LiveMarquee: React.FC = () => {
  return (
    <div className="w-full bg-[#0A0B0E] border-b border-slate-800/80 py-1.5 overflow-hidden whitespace-nowrap text-xs">
      <div className="flex items-center gap-8 animate-marquee max-w-7xl mx-auto">
        <span className="flex items-center gap-1.5 text-indigo-400 font-bold tracking-wider uppercase shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          LIVE
        </span>
        <span className="text-slate-400">RBI keeps benchmark repo rates unchanged at 6.50% in policy review...</span>
        <span className="text-slate-400">Global equity markets rally following cooling inflation figures...</span>
        <span className="text-slate-400">Tata Motors reports strong quarterly EV sales guidance; strategy rules active...</span>
        <span className="text-slate-400">Reliance Industries announces strategic energy expansion plans...</span>
        <span className="text-slate-400">Foreign Institutional Investors (FIIs) net buyers for third straight session...</span>
      </div>
    </div>
  );
};
