export type StockCategory = 'All' | 'Stocks' | 'MFs' | 'Bonds' | 'ETFs';

export interface StockQuote {
  symbol: string;
  name: string;
  exchange: string;
  category: StockCategory;
  price: number;
  change: number;
  changePercent: number;
  hourlyChangePercent: number;
  dailyChangePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  signal: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  expectedReturn: string;
  sparkline: number[];
  history: { time: string; price: number }[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export type ConditionType = 
  | 'PRICE_UP_PERCENT_HOUR' 
  | 'PRICE_DROP_PERCENT_DAY' 
  | 'PRICE_ABOVE' 
  | 'PRICE_BELOW';

export interface StrategyRule {
  id: string;
  name: string;
  symbol: string;
  conditionType: ConditionType;
  threshold: number; // e.g., 5 for 5%
  timeframe: '15m' | '1h' | '1d';
  action: 'BUY' | 'SELL';
  quantity: number;
  active: boolean;
  triggerCount: number;
  lastTriggered?: string;
  description: string;
}

export interface TradeOrder {
  id: string;
  strategyId: string;
  strategyName: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  totalValue: number;
  timestamp: string;
  reason: string;
  status: 'EXECUTED' | 'CANCELLED';
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnL: number;
  pnlPercent: number;
}

export interface PortfolioSummary {
  cashBalance: number;
  totalInvested: number;
  currentValue: number;
  totalPnL: number;
  pnlPercent: number;
  holdings: PortfolioHolding[];
}

export interface AISentiment {
  outlook: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number;
  niftyTarget: number;
  drivers: string;
  riskNote: string;
  updatedAt: string;
}

export interface SIPCalculationResult {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
  doublingYears: number;
  trajectory: { year: number; invested: number; value: number; stepUpValue?: number }[];
}
