import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, BarChart2,
  Bell, Search, ChevronRight, Flame, Zap,
  Globe, Clock, ArrowUpRight, ArrowDownRight,
  PieChart, Layers, Newspaper, RefreshCw
} from 'lucide-react';
import Heatmap from '../components/Heatmap';
import TopMovers from '../components/TopMovers';
import RealTimeTickerTape from '../components/RealTimeTickerTape';
import NewsSection from '../components/NewsSection';
import GlobalMarkets from '../components/GlobalMarkets';
import { dashboardApi, MarketSummaryItem } from '../api/Dashboard';

// ─── Mini Spark Line (pure SVG, no deps) ─────────────────────────────────────
const SparkLine = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  
  // Create an area path by closing the polyline points to the bottom corners
  const areaPath = `M 0,${h} L ${points.replace(/,/g, ' ').replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, '$1,$2 ')}L ${w},${h} Z`;
  const strokeColor = positive ? '#10B981' : '#F43F5E';
  // Use a unique ID based on the data length/first val as a simple hack, or just positive/negative
  const gradientId = positive ? 'spark-pos' : 'spark-neg';

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// ─── Quick‑stats data ─────────────────────────────────────────────────────────
const INITIAL_MARKET_INDICES: MarketSummaryItem[] = [
  { symbol: '^NSEI', name: 'NIFTY 50', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: '^BSESN', name: 'SENSEX', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: '^NSEBANK', name: 'BANK NIFTY', price: 0, change: 0, changePercent: 0, positive: false, spark: [] },
  { symbol: '^INDIAVIX', name: 'VIX', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
];

const INITIAL_WATCHLIST: MarketSummaryItem[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: 'TCS.NS', name: 'Tata Consultancy', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 0, change: 0, changePercent: 0, positive: false, spark: [] },
  { symbol: 'INFY.NS', name: 'Infosys', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd', price: 0, change: 0, changePercent: 0, positive: true, spark: [] },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', price: 0, change: 0, changePercent: 0, positive: false, spark: [] },
];

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── TABS for the right column ────────────────────────────────────────────────
const RIGHT_TABS = [
  { id: 'movers', label: 'Top Movers', icon: Flame },
  { id: 'news',   label: 'News',       icon: Newspaper },
];

const Dashboard = () => {
  const [activeRightTab, setActiveRightTab] = React.useState<'movers' | 'news'>('movers');
  const [activeWatchItem, setActiveWatchItem] = React.useState('RELIANCE.NS');
  const [marketIndices, setMarketIndices] = React.useState<MarketSummaryItem[]>(INITIAL_MARKET_INDICES);
  const [watchlist, setWatchlist] = React.useState<MarketSummaryItem[]>(INITIAL_WATCHLIST);
  const [heatmapData, setHeatmapData] = React.useState<any[]>([]);
  const [globalMarketsData, setGlobalMarketsData] = React.useState<Record<string, any[]>>({});
  const [topGainersLosersData, setTopGainersLosersData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const symbols = [
          ...INITIAL_MARKET_INDICES.map(i => i.symbol),
          ...INITIAL_WATCHLIST.map(w => w.symbol)
        ];
        const data = await dashboardApi.getMarketSummary(symbols);
        
        if (data.summary) {
          setMarketIndices(prev => prev.map(item => data.summary[item.symbol] ? { ...item, ...data.summary[item.symbol] } : item));
          setWatchlist(prev => prev.map(item => data.summary[item.symbol] ? { ...item, ...data.summary[item.symbol] } : item));
        }
        
        if (data.heatmap) setHeatmapData(data.heatmap);
        if (data.globalMarkets) setGlobalMarketsData(data.globalMarkets);
        if (data.topGainersLosers) setTopGainersLosersData(data.topGainersLosers);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      }
    };
    fetchMarketData();
  }, []);

  return (
    <div className="min-h-screen bg-theme-canvas text-content-primary flex flex-col overflow-hidden">

      {/* ── TICKER TAPE ──────────────────────────────────────────────────── */}
      <RealTimeTickerTape />

      {/* Note: The top header (Search/Notification) has been removed to optimize space as requested */}

      {/* ── MAIN BODY: 3-column layout ───────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT COLUMN: Watchlist sidebar ───────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-theme-border bg-theme-surface overflow-y-auto flex-shrink-0">
          <div className="px-4 py-4 border-b border-theme-border bg-theme-canvas">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-content-secondary tracking-widest uppercase">
                <Layers className="w-3.5 h-3.5" />
                Watchlist
              </div>
            </div>
          </div>

          <div className="flex-1 py-2">
            {watchlist.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setActiveWatchItem(s.symbol)}
                className={`w-full text-left px-4 py-3.5 flex items-center justify-between transition-all group border-l-2 ${
                  activeWatchItem === s.symbol
                    ? 'bg-blue-50/50 border-trade-action'
                    : 'border-transparent hover:bg-theme-canvas hover:border-theme-border/50'
                }`}
              >
                <div>
                  <p className={`text-sm font-bold ${activeWatchItem === s.symbol ? 'text-trade-action' : 'text-content-primary group-hover:text-content-primary'}`}>
                    {s.symbol}
                  </p>
                  <p className="text-xs text-content-secondary mt-0.5 truncate w-28">{s.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-content-primary">₹{s.price.toLocaleString()}</p>
                  <p className={`text-xs font-bold ${s.positive ? 'text-trade-gain' : 'text-trade-loss'}`}>
                    {s.positive ? '+' : ''}{s.changePercent.toFixed(2)}%
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Portfolio mini-summary */}
          <div className="p-4 border-t border-theme-border space-y-3">
            <p className="text-xs font-bold text-content-secondary tracking-widest uppercase">Portfolio Today</p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-2xl font-black text-content-primary">₹4,82,310</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ArrowUpRight className="w-4 h-4 text-trade-gain" />
                <p className="text-sm text-trade-gain font-bold">+₹12,430 (2.64%)</p>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-theme-border overflow-hidden">
                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-trade-action to-indigo-500" />
              </div>
              <p className="text-xs text-content-secondary mt-1">64% of daily target</p>
            </div>
          </div>
        </aside>

        {/* ── CENTRE COLUMN: Main chart + grid ─────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5 min-w-0">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

            {/* Index Strip */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {marketIndices.map((idx) => (
                <div
                  key={idx.symbol}
                  className="bg-theme-surface border border-theme-border rounded-2xl px-4 py-3 flex items-center justify-between hover:border-trade-action/30 hover:shadow-surface transition-all"
                >
                  <div>
                    <p className="text-[11px] text-content-secondary font-bold tracking-wider uppercase">{idx.name}</p>
                    <p className="text-2xl font-black tracking-tight text-content-primary mt-0.5">{idx.price.toLocaleString()}</p>
                    <p className={`text-xs font-bold mt-0.5 ${idx.positive ? 'text-trade-gain' : 'text-trade-loss'}`}>
                      {idx.positive ? '+' : ''}{idx.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <SparkLine data={idx.spark} positive={idx.positive} />
                </div>
              ))}
            </motion.div>

            {/* Heatmap Section */}
            <motion.div variants={itemVariants} className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-surface flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-violet-100 border border-violet-200">
                  <PieChart className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="font-bold text-content-primary leading-none">Sector Heatmap</h2>
                  <p className="text-xs text-content-secondary mt-0.5">Performance by industry</p>
                </div>
              </div>
              <div className="flex-1">
                <Heatmap data={heatmapData} />
              </div>
            </motion.div>

            {/* Global Markets Section */}
            <motion.div variants={itemVariants} className="flex flex-col h-[280px]">
              <div className="flex-1 flex">
                <GlobalMarkets data={globalMarketsData} />
              </div>
            </motion.div>

          </motion.div>
        </main>

        {/* ── RIGHT COLUMN: Top Movers / News ──────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-80 border-l border-theme-border bg-slate-50/40 flex-shrink-0 overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-theme-border">
            {RIGHT_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id as 'movers' | 'news')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all border-b-2 ${
                    activeRightTab === tab.id
                      ? 'border-trade-action text-trade-action bg-blue-50/60'
                      : 'border-transparent text-content-secondary hover:text-content-primary hover:bg-theme-canvas'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <AnimatePresence mode="wait">
              {activeRightTab === 'movers' ? (
                <motion.div
                  key="movers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TopMovers data={topGainersLosersData} />
                </motion.div>
              ) : (
                <motion.div
                  key="news"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <NewsSection symbol={activeWatchItem} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Market clock */}
          <div className="border-t border-theme-border px-4 py-3 flex items-center gap-2 bg-theme-canvas">
            <Clock className="w-3.5 h-3.5 text-content-secondary" />
            <span className="text-xs text-content-secondary">Market Hours</span>
            <span className="ml-auto text-xs font-bold text-trade-gain bg-trade-gain/10 px-2 py-0.5 rounded-md">OPEN</span>
            <span className="text-xs text-content-secondary">09:15 – 15:30</span>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;