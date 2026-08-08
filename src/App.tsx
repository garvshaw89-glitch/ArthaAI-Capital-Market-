import React, { useState, useEffect } from 'react';
import { StockQuote, MarketIndex, StrategyRule, TradeOrder, PortfolioSummary, AISentiment, StockCategory } from './types';
import { Header } from './components/Header';
import { LiveMarquee } from './components/LiveMarquee';
import { AISentimentCard } from './components/AISentimentCard';
import { CategoryBar } from './components/CategoryBar';
import { FeaturedForecast } from './components/FeaturedForecast';
import { MarketPulse } from './components/MarketPulse';
import { ActiveSignals } from './components/ActiveSignals';
import { StrategyEngineView } from './components/StrategyEngineView';
import { SIPCalculatorModal } from './components/SIPCalculatorModal';
import { Navigation } from './components/Navigation';
import { Sparkles, ShieldCheck, Wallet, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<StockCategory>('All');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

  // Live Data States
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [strategies, setStrategies] = useState<StrategyRule[]>([]);
  const [tradeLogs, setTradeLogs] = useState<TradeOrder[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);

  // AI Sentiment State
  const [aiSentiment, setAiSentiment] = useState<AISentiment>({
    outlook: 'Bullish',
    confidence: 88,
    niftyTarget: 22650,
    drivers: 'Predictions driven by positive FII inflow sentiment, cooling inflation data, and sectoral automotive momentum.',
    riskNote: 'AI forecasts are based on quantitative models and do not guarantee future performance. Market risks apply.',
    updatedAt: new Date().toLocaleTimeString()
  });

  // Fetch Live Stock & Strategy Data
  const fetchData = async () => {
    try {
      const [stocksRes, stratRes, tradesRes, portRes] = await Promise.all([
        fetch('/api/stocks'),
        fetch('/api/strategies'),
        fetch('/api/trades'),
        fetch('/api/portfolio')
      ]);

      if (stocksRes.ok) {
        const data = await stocksRes.json();
        setIndices(data.indices || []);
        setStocks(data.stocks || []);
      }

      if (stratRes.ok) {
        const strats = await stratRes.json();
        setStrategies(strats);
      }

      if (tradesRes.ok) {
        const logs = await tradesRes.json();
        setTradeLogs(logs);
      }

      if (portRes.ok) {
        const port = await portRes.json();
        setPortfolio(port);
      }
    } catch (err) {
      console.error('Error fetching live stock feed:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter stocks by category
  const filteredStocks = stocks.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  // Refresh AI Sentiment via Gemini API
  const handleRefreshSentiment = async () => {
    try {
      const res = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        setAiSentiment(data);
      }
    } catch (e) {
      console.error('AI Sentiment error:', e);
    }
  };

  // Toggle Strategy Active/Pause
  const handleToggleStrategy = async (id: string) => {
    try {
      await fetch(`/api/strategies/${id}/toggle`, { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error('Error toggling strategy:', e);
    }
  };

  // Delete Strategy
  const handleDeleteStrategy = async (id: string) => {
    try {
      await fetch(`/api/strategies/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error('Error deleting strategy:', e);
    }
  };

  // Create Strategy Rule
  const handleCreateStrategy = async (rule: Partial<StrategyRule>) => {
    try {
      await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      });
      fetchData();
    } catch (e) {
      console.error('Error creating strategy:', e);
    }
  };

  // Simulate Market Spike/Drop to test strategy execution live
  const handleSimulateTick = async (symbol: string, type: 'SPIKE_UP' | 'DROP_DOWN', percent: number) => {
    try {
      await fetch('/api/stocks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, type, percent })
      });
      fetchData();
    } catch (e) {
      console.error('Error simulating tick:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        indices={indices}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenStrategyEngine={() => setActiveTab('strategy')}
        activeTab={activeTab}
      />

      {/* Ticker Marquee */}
      <LiveMarquee />

      {/* Desktop Navigation */}
      <Navigation activeTab={activeTab} onTabChange={(tab) => {
        if (tab === 'calculator') {
          setIsCalculatorOpen(true);
        } else {
          setActiveTab(tab);
        }
      }} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 pt-4 pb-24 space-y-5">
        {activeTab === 'dashboard' && (
          <>
            {/* AI Sentiment Card */}
            <AISentimentCard sentiment={aiSentiment} onRefreshSentiment={handleRefreshSentiment} />

            {/* Category Filter Pills */}
            <CategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            {/* Featured Forecast Chart */}
            <FeaturedForecast stocks={filteredStocks} />

            {/* Active Signals & Watchlist */}
            <ActiveSignals
              stocks={filteredStocks}
              onSelectStockToSimulate={(sym, type) => handleSimulateTick(sym, type, 5)}
              onSelectStockForStrategy={(sym) => {
                setActiveTab('strategy');
              }}
            />

            {/* Market Pulse News */}
            <MarketPulse />
          </>
        )}

        {activeTab === 'stocks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Live Stock Market & Signals</h2>
              <CategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </div>

            <FeaturedForecast stocks={filteredStocks} />

            <ActiveSignals
              stocks={filteredStocks}
              onSelectStockToSimulate={(sym, type) => handleSimulateTick(sym, type, 5)}
              onSelectStockForStrategy={(sym) => {
                setActiveTab('strategy');
              }}
            />
          </div>
        )}

        {activeTab === 'strategy' && (
          <StrategyEngineView
            strategies={strategies}
            tradeLogs={tradeLogs}
            portfolio={portfolio}
            stocks={stocks}
            onToggleStrategy={handleToggleStrategy}
            onDeleteStrategy={handleDeleteStrategy}
            onCreateStrategy={handleCreateStrategy}
            onSimulateTick={handleSimulateTick}
            onRefreshData={fetchData}
          />
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-[#1E293B] p-5 rounded-xl border border-[#334155]">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-[#a078ff]" />
                  Virtual Algorithmic Trading Account
                </h2>
                <p className="text-xs text-[#cbc3d7] mt-1">
                  Automated execution engine holds and manages real-time order entries.
                </p>
              </div>

              {portfolio && (
                <div className="text-right">
                  <div className="text-xs text-[#cbc3d7]">Total Portfolio Value</div>
                  <div className="text-2xl font-bold font-numeric text-[#4edea3]">
                    ₹{(portfolio.cashBalance + portfolio.currentValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              )}
            </div>

            {/* Strategy Engine Component Embedded */}
            <StrategyEngineView
              strategies={strategies}
              tradeLogs={tradeLogs}
              portfolio={portfolio}
              stocks={stocks}
              onToggleStrategy={handleToggleStrategy}
              onDeleteStrategy={handleDeleteStrategy}
              onCreateStrategy={handleCreateStrategy}
              onSimulateTick={handleSimulateTick}
              onRefreshData={fetchData}
            />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <Navigation activeTab={activeTab} onTabChange={(tab) => {
        if (tab === 'calculator') {
          setIsCalculatorOpen(true);
        } else {
          setActiveTab(tab);
        }
      }} />

      {/* SIP & Lumpsum Calculator Modal */}
      <SIPCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
}
