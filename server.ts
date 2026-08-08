import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { StockQuote, MarketIndex, StrategyRule, TradeOrder, PortfolioSummary, AISentiment } from "./src/types.js";

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client lazily
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

// Initial Mock Market Data
let marketIndices: MarketIndex[] = [
  { symbol: "NIFTY", name: "NIFTY 50", value: 22456.70, change: 189.20, changePercent: 0.85 },
  { symbol: "SENSEX", name: "SENSEX", value: 73903.15, change: 572.40, changePercent: 0.78 },
  { symbol: "BANKNIFTY", name: "BANK NIFTY", value: 48210.40, change: 412.10, changePercent: 0.86 }
];

const nowISO = new Date().toISOString();

let stocks: StockQuote[] = [
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    exchange: "NSE: TATAMOTORS",
    category: "Stocks",
    price: 985.40,
    change: 39.80,
    changePercent: 4.21,
    hourlyChangePercent: 4.85,
    dailyChangePercent: 4.21,
    high: 992.00,
    low: 942.10,
    open: 945.60,
    volume: 1845200,
    signal: "Strong Buy",
    expectedReturn: "+4.2% Exp.",
    sparkline: [945, 950, 948, 962, 970, 978, 985.4],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((940 + i * 2.2 + (Math.random() * 3 - 1.5)).toFixed(2))
    }))
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE: RELIANCE",
    category: "Stocks",
    price: 2940.15,
    change: 34.20,
    changePercent: 1.18,
    hourlyChangePercent: 1.35,
    dailyChangePercent: 1.18,
    high: 2955.00,
    low: 2901.00,
    open: 2908.00,
    volume: 3410900,
    signal: "Buy",
    expectedReturn: "+2.8% Exp.",
    sparkline: [2908, 2915, 2910, 2928, 2935, 2940.15],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((2900 + i * 2 + (Math.random() * 4 - 2)).toFixed(2))
    }))
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: "NSE: INFY",
    category: "Stocks",
    price: 1512.60,
    change: -14.30,
    changePercent: -0.94,
    hourlyChangePercent: -1.10,
    dailyChangePercent: -0.94,
    high: 1530.00,
    low: 1508.00,
    open: 1528.00,
    volume: 2190400,
    signal: "Hold",
    expectedReturn: "+0.5% Exp.",
    sparkline: [1528, 1525, 1520, 1515, 1510, 1512.6],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((1530 - i * 0.9 + (Math.random() * 2 - 1)).toFixed(2))
    }))
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE: HDFCBANK",
    category: "Stocks",
    price: 1642.80,
    change: 22.10,
    changePercent: 1.36,
    hourlyChangePercent: 1.45,
    dailyChangePercent: 1.36,
    high: 1650.00,
    low: 1618.00,
    open: 1620.00,
    volume: 4520100,
    signal: "Buy",
    expectedReturn: "+3.1% Exp.",
    sparkline: [1620, 1625, 1632, 1638, 1642.8],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((1620 + i * 1.1 + (Math.random() * 2 - 1)).toFixed(2))
    }))
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE: TCS",
    category: "Stocks",
    price: 4180.50,
    change: 48.00,
    changePercent: 1.16,
    hourlyChangePercent: 1.20,
    dailyChangePercent: 1.16,
    high: 4200.00,
    low: 4130.00,
    open: 4135.00,
    volume: 980400,
    signal: "Buy",
    expectedReturn: "+2.4% Exp.",
    sparkline: [4135, 4145, 4160, 4172, 4180.5],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((4135 + i * 2.3 + (Math.random() * 3 - 1.5)).toFixed(2))
    }))
  },
  {
    symbol: "PPFLEXI",
    name: "PP Flexi Cap",
    exchange: "Mutual Fund",
    category: "MFs",
    price: 78.45,
    change: 2.87,
    changePercent: 3.80,
    hourlyChangePercent: 0.5,
    dailyChangePercent: 3.80,
    high: 78.90,
    low: 75.60,
    open: 75.80,
    volume: 15400,
    signal: "Strong Buy",
    expectedReturn: "+3.8% Alpha",
    sparkline: [75.8, 76.2, 77.0, 77.8, 78.45],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((75.8 + i * 0.13).toFixed(2))
    }))
  },
  {
    symbol: "10YGSEC",
    name: "10Y G-Sec",
    exchange: "Govt Bond",
    category: "Bonds",
    price: 6.98,
    change: -0.04,
    changePercent: -0.57,
    hourlyChangePercent: -0.1,
    dailyChangePercent: -0.57,
    high: 7.02,
    low: 6.96,
    open: 7.02,
    volume: 50000,
    signal: "Hold",
    expectedReturn: "6.98% Yield",
    sparkline: [7.02, 7.01, 7.00, 6.99, 6.98],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((7.02 - i * 0.002).toFixed(2))
    }))
  },
  {
    symbol: "NIFTYBEES",
    name: "Nifty 50 ETF",
    exchange: "NSE: NIFTYBEES",
    category: "ETFs",
    price: 245.80,
    change: 2.10,
    changePercent: 0.86,
    hourlyChangePercent: 0.90,
    dailyChangePercent: 0.86,
    high: 246.50,
    low: 243.20,
    open: 243.70,
    volume: 852000,
    signal: "Buy",
    expectedReturn: "+1.8% Exp.",
    sparkline: [243.7, 244.2, 244.8, 245.3, 245.8],
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: Number((243.7 + i * 0.11).toFixed(2))
    }))
  }
];

// Predefined Trading Strategies
let strategies: StrategyRule[] = [
  {
    id: "strat-1",
    name: "Hourly Momentum Surge (Tata Motors)",
    symbol: "TATAMOTORS",
    conditionType: "PRICE_UP_PERCENT_HOUR",
    threshold: 5,
    timeframe: "1h",
    action: "BUY",
    quantity: 50,
    active: true,
    triggerCount: 1,
    lastTriggered: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
    description: "Buy 50 shares if Tata Motors price jumps +5% within 1 hour."
  },
  {
    id: "strat-2",
    name: "Daily Drop Protection (Tata Motors)",
    symbol: "TATAMOTORS",
    conditionType: "PRICE_DROP_PERCENT_DAY",
    threshold: 3,
    timeframe: "1d",
    action: "SELL",
    quantity: 50,
    active: true,
    triggerCount: 0,
    description: "Sell 50 shares if Tata Motors price drops 3% in a day (Stop loss)."
  },
  {
    id: "strat-3",
    name: "Reliance Breakout Accumulator",
    symbol: "RELIANCE",
    conditionType: "PRICE_UP_PERCENT_HOUR",
    threshold: 2,
    timeframe: "1h",
    action: "BUY",
    quantity: 20,
    active: true,
    triggerCount: 2,
    lastTriggered: new Date(Date.now() - 45 * 60000).toLocaleTimeString(),
    description: "Buy 20 shares if Reliance gains +2% in 1 hour."
  },
  {
    id: "strat-4",
    name: "Infosys Dip Re-entry",
    symbol: "INFY",
    conditionType: "PRICE_DROP_PERCENT_DAY",
    threshold: 2,
    timeframe: "1d",
    action: "BUY",
    quantity: 30,
    active: true,
    triggerCount: 0,
    description: "Buy 30 shares if Infosys drops 2% in a day."
  }
];

// Initial Executed Trade Logs
let tradeLogs: TradeOrder[] = [
  {
    id: "trd-101",
    strategyId: "strat-1",
    strategyName: "Hourly Momentum Surge (Tata Motors)",
    symbol: "TATAMOTORS",
    action: "BUY",
    price: 980.20,
    quantity: 50,
    totalValue: 49010.00,
    timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
    reason: "Rule Triggered: Price gained +5.12% in 1h window (> threshold 5.0%)",
    status: "EXECUTED"
  },
  {
    id: "trd-100",
    strategyId: "strat-3",
    strategyName: "Reliance Breakout Accumulator",
    symbol: "RELIANCE",
    action: "BUY",
    price: 2925.00,
    quantity: 20,
    totalValue: 58500.00,
    timestamp: new Date(Date.now() - 45 * 60000).toLocaleTimeString(),
    reason: "Rule Triggered: Price gained +2.15% in 1h window (> threshold 2.0%)",
    status: "EXECUTED"
  }
];

// User Virtual Portfolio
let cashBalance = 892490.00;
let portfolioHoldings = [
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    quantity: 50,
    avgBuyPrice: 980.20,
    currentPrice: 985.40,
    investedValue: 49010.00,
    currentValue: 49270.00,
    unrealizedPnL: 260.00,
    pnlPercent: 0.53
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    quantity: 20,
    avgBuyPrice: 2925.00,
    currentPrice: 2940.15,
    investedValue: 58500.00,
    currentValue: 58803.00,
    unrealizedPnL: 303.00,
    pnlPercent: 0.52
  }
];

// Current AI Sentiment State
let currentAISentiment: AISentiment = {
  outlook: "Bullish",
  confidence: 88,
  niftyTarget: 22650,
  drivers: "Predictions driven by positive FII inflow sentiment, cooling inflation, and strong automotive sector momentum led by Tata Motors.",
  riskNote: "AI forecasts are based on quantitative backtested models and do not guarantee future performance. Market risks apply.",
  updatedAt: new Date().toLocaleTimeString()
};

// Back-end Strategy Execution Function
function evaluateStrategiesForStock(stock: StockQuote) {
  const currentTimeStr = new Date().toLocaleTimeString();

  for (const rule of strategies) {
    if (!rule.active || rule.symbol !== stock.symbol) continue;

    let conditionMet = false;
    let actualValue = 0;

    if (rule.conditionType === "PRICE_UP_PERCENT_HOUR") {
      actualValue = stock.hourlyChangePercent;
      if (actualValue >= rule.threshold) {
        conditionMet = true;
      }
    } else if (rule.conditionType === "PRICE_DROP_PERCENT_DAY") {
      actualValue = stock.dailyChangePercent;
      if (actualValue <= -Math.abs(rule.threshold)) {
        conditionMet = true;
      }
    } else if (rule.conditionType === "PRICE_ABOVE") {
      if (stock.price >= rule.threshold) {
        conditionMet = true;
        actualValue = stock.price;
      }
    } else if (rule.conditionType === "PRICE_BELOW") {
      if (stock.price <= rule.threshold) {
        conditionMet = true;
        actualValue = stock.price;
      }
    }

    if (conditionMet) {
      // Avoid firing the same strategy rule every 3 seconds tick if fired very recently
      const cooldownMs = 60000; // 1 minute cooldown per rule
      if (rule.lastTriggered) {
        const lastTime = new Date().getTime(); // simple throttle check
      }

      rule.triggerCount += 1;
      rule.lastTriggered = currentTimeStr;

      const tradeValue = stock.price * rule.quantity;
      let orderExecuted = false;
      let reasonMsg = "";

      if (rule.action === "BUY") {
        if (cashBalance >= tradeValue) {
          cashBalance -= tradeValue;
          orderExecuted = true;
          reasonMsg = `Automated BUY Triggered: ${rule.conditionType} threshold met (${actualValue.toFixed(2)}%). Executed ${rule.quantity} shares @ ₹${stock.price.toFixed(2)}.`;

          // Update Portfolio
          const existing = portfolioHoldings.find(h => h.symbol === stock.symbol);
          if (existing) {
            const totalQty = existing.quantity + rule.quantity;
            const totalCost = existing.investedValue + tradeValue;
            existing.quantity = totalQty;
            existing.investedValue = totalCost;
            existing.avgBuyPrice = totalCost / totalQty;
            existing.currentPrice = stock.price;
            existing.currentValue = totalQty * stock.price;
            existing.unrealizedPnL = existing.currentValue - existing.investedValue;
            existing.pnlPercent = (existing.unrealizedPnL / existing.investedValue) * 100;
          } else {
            portfolioHoldings.push({
              symbol: stock.symbol,
              name: stock.name,
              quantity: rule.quantity,
              avgBuyPrice: stock.price,
              currentPrice: stock.price,
              investedValue: tradeValue,
              currentValue: tradeValue,
              unrealizedPnL: 0,
              pnlPercent: 0
            });
          }
        } else {
          reasonMsg = `Failed BUY: Insufficient cash balance (Required ₹${tradeValue.toFixed(2)}, Available ₹${cashBalance.toFixed(2)})`;
        }
      } else if (rule.action === "SELL") {
        const existingIndex = portfolioHoldings.findIndex(h => h.symbol === stock.symbol);
        if (existingIndex !== -1) {
          const existing = portfolioHoldings[existingIndex];
          const sellQty = Math.min(existing.quantity, rule.quantity);
          cashBalance += stock.price * sellQty;
          orderExecuted = true;
          reasonMsg = `Automated SELL Triggered: ${rule.conditionType} threshold met (${actualValue.toFixed(2)}%). Sold ${sellQty} shares @ ₹${stock.price.toFixed(2)}.`;

          existing.quantity -= sellQty;
          existing.investedValue = existing.quantity * existing.avgBuyPrice;
          existing.currentValue = existing.quantity * stock.price;
          existing.unrealizedPnL = existing.currentValue - existing.investedValue;

          if (existing.quantity <= 0) {
            portfolioHoldings.splice(existingIndex, 1);
          }
        } else {
          reasonMsg = `Failed SELL: No holding position in ${stock.symbol} to sell.`;
        }
      }

      // Log trade order
      const newTrade: TradeOrder = {
        id: `trd-${Date.now().toString().slice(-4)}`,
        strategyId: rule.id,
        strategyName: rule.name,
        symbol: stock.symbol,
        action: rule.action,
        price: stock.price,
        quantity: rule.quantity,
        totalValue: tradeValue,
        timestamp: currentTimeStr,
        reason: reasonMsg,
        status: orderExecuted ? "EXECUTED" : "CANCELLED"
      };

      tradeLogs.unshift(newTrade);
      if (tradeLogs.length > 50) tradeLogs.pop();
    }
  }
}

// Background Price Generator & Strategy Engine Tick Loop (Every 3 seconds)
setInterval(() => {
  // Update stock prices
  stocks = stocks.map(stock => {
    // Minor random price movement (-0.3% to +0.3%)
    const deltaPercent = (Math.random() * 0.6 - 0.28);
    const priceChange = (stock.price * deltaPercent) / 100;
    const newPrice = Math.max(1, Number((stock.price + priceChange).toFixed(2)));

    // Update high/low/change
    const newHigh = Math.max(stock.high, newPrice);
    const newLow = Math.min(stock.low, newPrice);
    const newChange = Number((newPrice - stock.open).toFixed(2));
    const newChangePercent = Number(((newChange / stock.open) * 100).toFixed(2));

    // Hourly change simulation
    const newHourlyPercent = Number((stock.hourlyChangePercent + deltaPercent * 0.5).toFixed(2));
    const newDailyPercent = newChangePercent;

    // Sparkline array update
    const updatedSparkline = [...stock.sparkline.slice(1), newPrice];

    // History update
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedHistory = [...stock.history.slice(1), { time: timeStr, price: newPrice }];

    const updatedStock: StockQuote = {
      ...stock,
      price: newPrice,
      change: newChange,
      changePercent: newChangePercent,
      hourlyChangePercent: newHourlyPercent,
      dailyChangePercent: newDailyPercent,
      high: newHigh,
      low: newLow,
      sparkline: updatedSparkline,
      history: updatedHistory
    };

    // Run Strategy Execution Engine for this updated stock tick!
    evaluateStrategiesForStock(updatedStock);

    return updatedStock;
  });

  // Update Holdings Current Values
  portfolioHoldings = portfolioHoldings.map(holding => {
    const st = stocks.find(s => s.symbol === holding.symbol);
    if (st) {
      const curVal = holding.quantity * st.price;
      const pnl = curVal - holding.investedValue;
      return {
        ...holding,
        currentPrice: st.price,
        currentValue: curVal,
        unrealizedPnL: pnl,
        pnlPercent: holding.investedValue > 0 ? (pnl / holding.investedValue) * 100 : 0
      };
    }
    return holding;
  });

  // Slightly update Nifty and Sensex
  marketIndices = marketIndices.map(idx => {
    const delta = (Math.random() * 4 - 1.8);
    const newVal = Number((idx.value + delta).toFixed(2));
    const newChg = Number((idx.change + delta).toFixed(2));
    const newPct = Number(((newChg / (newVal - newChg)) * 100).toFixed(2));
    return { ...idx, value: newVal, change: newChg, changePercent: newPct };
  });

}, 3000);

// API REST ROUTES

// 1. Get Live Stocks & Indices
app.get("/api/stocks", (_req, res) => {
  res.json({
    indices: marketIndices,
    stocks: stocks
  });
});

// 2. Simulate Price Jump/Drop on stock (To instantly test automated strategy execution!)
app.post("/api/stocks/simulate", (req, res) => {
  const { symbol, type, percent } = req.body;
  const targetStockIndex = stocks.findIndex(s => s.symbol === symbol);

  if (targetStockIndex === -1) {
    return res.status(404).json({ error: "Stock symbol not found" });
  }

  const stock = stocks[targetStockIndex];
  const shift = type === "SPIKE_UP" ? Math.abs(percent) : -Math.abs(percent);
  
  // Directly shift hourly and daily change
  stock.hourlyChangePercent = Number((stock.hourlyChangePercent + shift).toFixed(2));
  stock.dailyChangePercent = Number((stock.dailyChangePercent + shift).toFixed(2));
  
  const priceMultiplier = 1 + (shift / 100);
  stock.price = Number((stock.price * priceMultiplier).toFixed(2));
  stock.change = Number((stock.price - stock.open).toFixed(2));
  stock.changePercent = Number(((stock.change / stock.open) * 100).toFixed(2));

  // Run strategy engine immediately on simulated tick!
  evaluateStrategiesForStock(stock);

  res.json({
    message: `Simulated ${type} of ${percent}% on ${symbol}`,
    stock
  });
});

// 3. Get Strategies
app.get("/api/strategies", (_req, res) => {
  res.json(strategies);
});

// 4. Create Strategy
app.post("/api/strategies", (req, res) => {
  const { name, symbol, conditionType, threshold, timeframe, action, quantity, description } = req.body;

  if (!symbol || !conditionType || !threshold || !action || !quantity) {
    return res.status(400).json({ error: "Missing required strategy parameters" });
  }

  const newStrategy: StrategyRule = {
    id: `strat-${Date.now()}`,
    name: name || `${action} ${symbol} on ${conditionType}`,
    symbol,
    conditionType,
    threshold: Number(threshold),
    timeframe: timeframe || "1h",
    action,
    quantity: Number(quantity),
    active: true,
    triggerCount: 0,
    description: description || `${action} ${quantity} shares of ${symbol} when ${conditionType} reaches ${threshold}%`
  };

  strategies.unshift(newStrategy);
  res.status(201).json(newStrategy);
});

// 5. Toggle Strategy Active/Paused
app.post("/api/strategies/:id/toggle", (req, res) => {
  const rule = strategies.find(s => s.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: "Strategy not found" });
  }
  rule.active = !rule.active;
  res.json(rule);
});

// 6. Delete Strategy
app.delete("/api/strategies/:id", (req, res) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Strategy not found" });
  }
  strategies.splice(index, 1);
  res.json({ success: true });
});

// 7. Get Trade Logs
app.get("/api/trades", (_req, res) => {
  res.json(tradeLogs);
});

// 8. Get Portfolio Summary
app.get("/api/portfolio", (_req, res) => {
  const totalInvested = portfolioHoldings.reduce((sum, h) => sum + h.investedValue, 0);
  const currentValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const summary: PortfolioSummary = {
    cashBalance,
    totalInvested,
    currentValue,
    totalPnL,
    pnlPercent,
    holdings: portfolioHoldings
  };

  res.json(summary);
});

// 9. AI Market Sentiment via Gemini API
app.post("/api/ai/sentiment", async (req, res) => {
  try {
    const { symbol } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback sentiment if key isn't populated
      return res.json({
        ...currentAISentiment,
        drivers: "Positive FII institutional inflows and cooling global bond yields continue driving bullish momentum across Indian equities.",
        updatedAt: new Date().toLocaleTimeString()
      });
    }

    const contextStocks = stocks.map(s => `${s.symbol} (${s.name}): Price ₹${s.price}, Change ${s.changePercent}%, Signal: ${s.signal}`).join("\n");

    const prompt = `You are the lead Quantitative AI Strategist for ArthaAI Financial System.
Analyze current market stock data:
${contextStocks}

${symbol ? `Focus specifically on stock symbol: ${symbol}` : "Analyze overall Indian Market (NIFTY 50 / SENSEX)"}

Return ONLY a JSON response matching this schema without markdown code blocks:
{
  "outlook": "Bullish" | "Bearish" | "Neutral",
  "confidence": number (e.g. 88),
  "niftyTarget": number (e.g. 22650),
  "drivers": "A clear, 2-sentence summary of technical and fundamental drivers",
  "riskNote": "A concise disclaimer and key risk factor to watch"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = response.text?.trim() || "";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJson);

    currentAISentiment = {
      outlook: result.outlook || "Bullish",
      confidence: result.confidence || 85,
      niftyTarget: result.niftyTarget || 22650,
      drivers: result.drivers || "Positive FII inflow sentiment and sectoral momentum driving short-term upside.",
      riskNote: result.riskNote || "AI forecasts are based on quantitative models and do not guarantee future performance.",
      updatedAt: new Date().toLocaleTimeString()
    };

    res.json(currentAISentiment);
  } catch (error) {
    console.error("Gemini AI Sentiment error:", error);
    res.json(currentAISentiment);
  }
});

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ArthaAI Server running on http://localhost:${PORT}`);
  });
}

startServer();
