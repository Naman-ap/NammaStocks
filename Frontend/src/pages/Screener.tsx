import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';
import GhostCursor from '../components/GhostCursor';

const Screener = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const isDriveMode = searchParams.get('drive') === 'true';
  const targetAction = searchParams.get('target');
  const symbols = searchParams.get('symbols');

  const cursorSteps = isDriveMode && targetAction === 'compare' ? [
    {
      targetId: 'compare-btn',
      action: 'click' as const,
      delayBefore: 1500, // Wait 1.5s on screener page before moving
      onComplete: () => {
        // After clicking, navigate to compare page with drive flag
        setTimeout(() => {
          navigate(`/screener/compare?drive=true&symbols=${symbols}`);
        }, 800);
      }
    }
  ] : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black relative overflow-hidden">
      {isDriveMode && <GhostCursor steps={cursorSteps} />}
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
                Stock Screener
              </h1>
              <p className="text-gray-400 mt-2 text-lg font-medium tracking-wide">Advanced filtering and analysis tools</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                id="compare-btn"
                onClick={() => navigate('/screener/compare')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all hover:scale-105"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Compare Stocks</span>
              </button>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all hover:bg-white/10"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {isFilterOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Ribbon */}
          <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-none">
            {['Top Gainers', 'Volume Shockers', '52W High', 'Undervalued (P/E < 15)', 'High Dividend', 'Large Cap Tech', 'Oversold (RSI < 30)'].map((filter) => (
              <button key={filter} className="flex-shrink-0 px-5 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-full text-sm font-semibold tracking-wide text-gray-300 hover:text-cyan-400 transition-all whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                {filter}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Filter Panel - Sticky Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isFilterOpen ? 1 : 0,
                x: isFilterOpen ? 0 : -20,
                width: isFilterOpen ? 320 : 0
              }}
              className={`${isFilterOpen ? 'w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-24' : 'hidden'} transition-all`}
            >
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2 pb-8">
                <FilterPanel />
              </div>
            </motion.div>

            {/* Stock Table */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full min-w-0 pb-8"
            >
              <StockTable />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Screener;