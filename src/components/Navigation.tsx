import React from 'react';
import { LayoutDashboard, TrendingUp, Cpu, Calculator, PieChart } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'strategy', label: 'Strategy', icon: Cpu },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile Bottom Fixed Bar */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-[#0F1115] border-t border-slate-800 shadow-xl flex justify-around items-center px-2 h-16 md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:flex items-center justify-center gap-2 max-w-7xl mx-auto pt-2 pb-1 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] border border-indigo-400/30'
                  : 'bg-[#0F1115] border border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
