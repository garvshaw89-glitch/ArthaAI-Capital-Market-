import React, { useState } from 'react';
import { StrategyRule, TradeOrder, PortfolioSummary, StockQuote } from '../types';
import { Activity, Zap, Play, Pause, Plus, Trash2, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Wallet } from 'lucide-react';

interface StrategyEngineViewProps {
  strategies: StrategyRule[];
  tradeLogs: TradeOrder[];
  portfolio: PortfolioSummary | null;
  stocks: StockQuote[];
  onToggleStrategy: (id: string) => void;
  onDeleteStrategy: (id: string) => void;
  onCreateStrategy: (rule: Partial<StrategyRule>) => void;
  onSimulateTick: (symbol: string, type: 'SPIKE_UP' | 'DROP_DOWN', percent: number) => void;
  onRefreshData: () => void;
}

export const StrategyEngineView: React.FC<StrategyEngineViewProps> = ({
  strategies,
  tradeLogs,
  portfolio,
  stocks,
  onToggleStrategy,
  onDeleteStrategy,
  onCreateStrategy,
  onSimulateTick,
  onRefreshData
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState('TATAMOTORS');
  const [conditionType, setConditionType] = useState<StrategyRule['conditionType']>('PRICE_UP_PERCENT_HOUR');
  const [threshold, setThreshold] = useState<number>(5);
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(50);
  const [customName, setCustomName] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStrategy({
      name: customName || `${action} ${selectedStock} on ${conditionType}`,
      symbol: selectedStock,
      conditionType,
      threshold,
      timeframe: conditionType === 'PRICE_UP_PERCENT_HOUR' ? '1h' : '1d',
      action,
      quantity
    });
    setShowCreateForm(false);
    setCustomName('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header Banner */}
      <section className="bg-[#0F1115] rounded-xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h2 className="font-bold text-xl md:text-2xl text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-400" />
                Algorithmic Strategy Execution Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Server-side real-time engine processing stock feeds every 3 seconds. Predefined rules auto-execute orders when 1h or 1d price momentum thresholds are crossed.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRefreshData}
              className="p-2 rounded-lg bg-[#161920] border border-slate-800 hover:border-indigo-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Engine</span>
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Rule</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Market Trigger Simulator Bar */}
      <section className="bg-[#0F1115] rounded-xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Live Strategy Engine Tester</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Inject realistic price movements to verify back-end order execution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={() => onSimulateTick('TATAMOTORS', 'SPIKE_UP', 5.2)}
            className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center justify-between transition-all"
          >
            <span>Spike Tata Motors +5.2% (1h)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSimulateTick('TATAMOTORS', 'DROP_DOWN', 3.5)}
            className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold flex items-center justify-between transition-all"
          >
            <span>Drop Tata Motors -3.5% (1d)</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSimulateTick('RELIANCE', 'SPIKE_UP', 2.3)}
            className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold flex items-center justify-between transition-all"
          >
            <span>Spike Reliance +2.3% (1h)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSimulateTick('INFY', 'DROP_DOWN', 2.5)}
            className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-bold flex items-center justify-between transition-all"
          >
            <span>Drop Infosys -2.5% (1d)</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Create New Custom Strategy Rule Form Modal / Inline Box */}
      {showCreateForm && (
        <form onSubmit={handleFormSubmit} className="bg-[#0F1115] rounded-xl border border-indigo-500/50 p-4 md:p-5 space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="font-bold text-base text-indigo-300 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Define New Trading Rule
            </h3>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Rule Title</label>
              <input
                type="text"
                placeholder="e.g. Buy Tata Motors on +5% 1h Surge"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Target Stock</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
              >
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.name} ({s.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Trigger Rule Condition</label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value as any)}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
              >
                <option value="PRICE_UP_PERCENT_HOUR">Price goes UP by X% in 1 hour</option>
                <option value="PRICE_DROP_PERCENT_DAY">Price DROPS by X% in 1 day</option>
                <option value="PRICE_ABOVE">Price rises ABOVE ₹X</option>
                <option value="PRICE_BELOW">Price falls BELOW ₹X</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Threshold Value (%) / (₹)</label>
              <input
                type="number"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500 font-numeric"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500"
              >
                <option value="BUY">BUY Order</option>
                <option value="SELL">SELL Order</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Quantity (Shares)</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#161920] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-indigo-500 font-numeric"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(99,102,241,0.3)]"
          >
            Activate Strategy Rule
          </button>
        </form>
      )}

      {/* Active Rules Grid */}
      <section className="space-y-3">
        <h3 className="font-bold text-lg text-white">Active Strategy Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {strategies.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                rule.active
                  ? 'bg-[#0F1115] border-slate-800 hover:border-indigo-500/40'
                  : 'bg-[#161920]/60 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        rule.action === 'BUY'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {rule.action} {rule.quantity} QTY
                    </span>
                    <span className="font-bold text-xs text-white">{rule.symbol}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleStrategy(rule.id)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        rule.active
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-[#161920] border-slate-800 text-slate-400'
                      }`}
                      title={rule.active ? 'Pause Rule' : 'Activate Rule'}
                    >
                      {rule.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onDeleteStrategy(rule.id)}
                      className="p-1.5 rounded-lg bg-[#161920] border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-1">{rule.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{rule.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                <span className="font-numeric">
                  Triggers: <strong className="text-white">{rule.triggerCount}</strong>
                </span>
                <span>
                  Last:{' '}
                  <strong className="text-indigo-400 font-numeric">
                    {rule.lastTriggered || 'Never'}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Executed Trade Logs Table */}
      <section className="bg-[#0F1115] rounded-xl border border-slate-800 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Real-time Executed Trades Log
          </h3>
          <span className="text-xs text-slate-400 font-numeric">Total: {tradeLogs.length} Orders</span>
        </div>

        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Symbol</th>
                <th className="py-2 px-2">Action</th>
                <th className="py-2 px-2">Exec Price</th>
                <th className="py-2 px-2">Qty</th>
                <th className="py-2 px-2">Total Value</th>
                <th className="py-2 px-2">Trigger Reason</th>
                <th className="py-2 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {tradeLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-500">
                    No trades executed yet. Click the strategy simulator buttons above to trigger a rule.
                  </td>
                </tr>
              ) : (
                tradeLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#161920] transition-colors">
                    <td className="py-2.5 px-2 font-numeric text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-2 font-bold text-white whitespace-nowrap">{log.symbol}</td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-numeric text-white whitespace-nowrap">₹{log.price.toFixed(2)}</td>
                    <td className="py-2.5 px-2 font-numeric text-white whitespace-nowrap">{log.quantity}</td>
                    <td className="py-2.5 px-2 font-numeric font-bold text-emerald-400 whitespace-nowrap">
                      ₹{log.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 max-w-xs truncate" title={log.reason}>
                      {log.reason}
                    </td>
                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'EXECUTED'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Portfolio Summary Card */}
      {portfolio && (
        <section className="bg-[#0F1115] rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-400" />
              Virtual Portfolio Holdings
            </h3>
            <div className="text-right">
              <span className="text-xs text-slate-400">Available Cash Balance: </span>
              <span className="font-numeric font-bold text-sm text-emerald-400">
                ₹{portfolio.cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {portfolio.holdings.map((h) => (
              <div key={h.symbol} className="bg-[#161920] rounded-lg p-3 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-white">{h.name} ({h.symbol})</span>
                  <span className="text-[11px] font-numeric text-slate-400">{h.quantity} Shares</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs text-slate-400">Cur Value: ₹{h.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className={`font-numeric text-xs font-bold ${h.unrealizedPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {h.unrealizedPnL >= 0 ? '+' : ''}₹{h.unrealizedPnL.toFixed(2)} ({h.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
