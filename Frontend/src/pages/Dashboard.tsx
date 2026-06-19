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
import MarketOverview from '../components/MarketOverview';
import NewsSection from '../components/NewsSection';

// ─── Mini Spark Line (pure SVG, no deps) ─────────────────────────────────────
const SparkLine = ({ data, positive }: { data: number[]; positive: boolean }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={positive ? '#34d399' : '#f87171'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// ─── Quick‑stats data ─────────────────────────────────────────────────────────
const marketIndices = [
  { label: 'NIFTY 50',   value: '19,674',  change: '+1.28%', positive: true,  spark: [62,65,63,68,67,72,74,71,76,78] },
  { label: 'SENSEX',     value: '66,023',  change: '+1.28%', positive: true,  spark: [55,58,57,62,65,70,68,73,75,78] },
  { label: 'BANK NIFTY', value: '44,856',  change: '-0.35%', positive: false, spark: [80,75,78,72,70,68,71,65,63,60] },
  { label: 'VIX',        value: '13.42',   change: '+6.95%', positive: true,  spark: [40,42,41,45,47,50,52,55,54,58] },
];

const watchlist = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,847', change: '+2.45%', positive: true },
  { symbol: 'TCS',      name: 'Tata Consultancy',   price: '3,456', change: '+1.23%', positive: true },
  { symbol: 'HDFC',     name: 'HDFC Bank',           price: '1,678', change: '-0.89%', positive: false },
  { symbol: 'INFY',     name: 'Infosys',             price: '1,432', change: '+0.67%', positive: true },
  { symbol: 'WIPRO',    name: 'Wipro Ltd',           price: '445',   change: '+0.34%', positive: true },
  { symbol: 'BAJFIN',   name: 'Bajaj Finance',       price: '6,789', change: '-1.23%', positive: false },
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
  const [activeRightTab, setActiveRightTab] = useState<'movers' | 'news'>('movers');
  const [activeWatchItem, setActiveWatchItem] = useState('RELIANCE');

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col overflow-hidden">

      {/* ── TICKER TAPE ──────────────────────────────────────────────────── */}
      <RealTimeTickerTape />

      {/* ── TOP HEADER BAR ───────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d0f14]">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Market Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 tracking-widest uppercase font-semibold">
            NSE · BSE · Real-time feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-52 focus-within:border-cyan-500/50 transition-colors">
            <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <input
              placeholder="Search stocks…"
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
            />
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/25 px-3 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
            <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Live</span>
          </div>

          {/* Notification icon */}
          <button className="relative p-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
            <Bell className="w-4 h-4 text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
          </button>
        </div>
      </header>

      {/* ── MAIN BODY: 3-column layout ───────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT COLUMN: Watchlist sidebar ───────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-white/5 bg-[#0d0f14] overflow-y-auto flex-shrink-0">
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-widest uppercase">
              <Layers className="w-3.5 h-3.5" />
              Watchlist
            </div>
          </div>

          <div className="flex-1 py-2">
            {watchlist.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setActiveWatchItem(s.symbol)}
                className={`w-full text-left px-4 py-3.5 flex items-center justify-between transition-all group border-l-2 ${
                  activeWatchItem === s.symbol
                    ? 'bg-cyan-500/10 border-cyan-400'
                    : 'border-transparent hover:bg-white/3 hover:border-white/10'
                }`}
              >
                <div>
                  <p className={`text-sm font-bold ${activeWatchItem === s.symbol ? 'text-cyan-300' : 'text-gray-200 group-hover:text-white'}`}>
                    {s.symbol}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 truncate w-28">{s.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">₹{s.price}</p>
                  <p className={`text-xs font-bold ${s.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {s.change}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Portfolio mini-summary */}
          <div className="p-4 border-t border-white/5 space-y-3">
            <p className="text-xs font-bold text-gray-500 tracking-widest uppercase">Portfolio Today</p>
            <div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-2xl p-4 border border-white/5">
              <p className="text-2xl font-black text-white">₹4,82,310</p>
              <div className="flex items-center gap-1.5 mt-1">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400 font-bold">+₹12,430 (2.64%)</p>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
              </div>
              <p className="text-xs text-gray-600 mt-1">64% of daily target</p>
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
                  key={idx.label}
                  className="bg-[#12141a] border border-white/5 rounded-2xl px-4 py-3 flex items-center justify-between hover:border-white/10 transition-colors"
                >
                  <div>
                    <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">{idx.label}</p>
                    <p className="text-xl font-black text-white mt-0.5">{idx.value}</p>
                    <p className={`text-xs font-bold mt-0.5 ${idx.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {idx.change}
                    </p>
                  </div>
                  <SparkLine data={idx.spark} positive={idx.positive} />
                </div>
              ))}
            </motion.div>

            {/* Bottom 2-col: Heatmap + Market Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
              {/* Heatmap */}
              <motion.div variants={itemVariants} className="xl:col-span-3 bg-[#12141a] border border-white/5 rounded-3xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <PieChart className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white leading-none">Sector Heatmap</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Performance by industry</p>
                  </div>
                </div>
                <Heatmap />
              </motion.div>

              {/* Market Overview stacked */}
              <motion.div variants={itemVariants} className="xl:col-span-2 flex flex-col gap-4">
                <div className="bg-[#12141a] border border-white/5 rounded-3xl p-5 flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Globe className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white leading-none">Market Pulse</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Key indices at a glance</p>
                    </div>
                  </div>
                  <MarketOverview />
                </div>
              </motion.div>
            </div>

          </motion.div>
        </main>

        {/* ── RIGHT COLUMN: Top Movers / News ──────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-80 border-l border-white/5 bg-[#0d0f14] flex-shrink-0 overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-white/5">
            {RIGHT_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightTab(tab.id as 'movers' | 'news')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all border-b-2 ${
                    activeRightTab === tab.id
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeRightTab === 'movers' ? (
                <motion.div
                  key="movers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TopMovers />
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
          <div className="border-t border-white/5 px-4 py-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs text-gray-600">Market Hours</span>
            <span className="ml-auto text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">OPEN</span>
            <span className="text-xs text-gray-500">09:15 – 15:30</span>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;