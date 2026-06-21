import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Clock, Play, AlertCircle, RefreshCw, BarChart2, Briefcase } from 'lucide-react';
import GhostCursor from '../components/GhostCursor';

const historicalData = [
  { month: 'Jan 23', tata: 410, hdfc: 1600 },
  { month: 'Mar 23', tata: 450, hdfc: 1580 },
  { month: 'Jun 23', tata: 580, hdfc: 1620 },
  { month: 'Sep 23', tata: 630, hdfc: 1550 },
  { month: 'Dec 23', tata: 750, hdfc: 1650 },
  { month: 'Mar 24', tata: 950, hdfc: 1450 },
  { month: 'Jun 24', tata: 1050, hdfc: 1550 },
  { month: 'Sep 24', tata: 1100, hdfc: 1600 },
  { month: 'Dec 24', tata: 980, hdfc: 1620 },
  { month: 'Mar 25', tata: 1250, hdfc: 1500 },
  { month: 'Jun 25', tata: 1400, hdfc: 1480 },
  { month: 'Sep 25', tata: 1550, hdfc: 1520 },
  { month: 'Dec 25', tata: 1700, hdfc: 1680 },
  { month: 'Mar 26', tata: 1950, hdfc: 1720 },
];

const TimeTravel = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDriving = searchParams.get('drive') === 'true';

  const [currentYear, setCurrentYear] = useState(2026);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(isDriving);
  const [retroMode, setRetroMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && dataIndex < historicalData.length - 1) {
      interval = setInterval(() => {
        setDataIndex(prev => prev + 1);
      }, 400); // speed of backtest
    } else if (dataIndex >= historicalData.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, dataIndex]);

  const startBacktest = () => {
    setRetroMode(true);
    setCurrentYear(2023);
    setDataIndex(0);
    setTimeout(() => {
      setIsPlaying(true);
    }, 1000);
  };

  const cursorSteps = [
    { targetId: 'tt-year-slider', action: 'click' as const, delayBefore: 1500, onComplete: () => setRetroMode(true) },
    { targetId: 'tt-start-btn', action: 'click' as const, delayBefore: 1500, onComplete: startBacktest },
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] p-6 transition-colors duration-1000 flex flex-col ${retroMode ? 'bg-[#050510]' : 'bg-[#08090c]'}`}>
      {showCursor && <GhostCursor steps={cursorSteps} onAllComplete={() => setShowCursor(false)} />}
      
      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center gap-3">
              <Clock className="w-8 h-8 text-violet-400" />
              Time-Travel Backtesting
            </h1>
            <p className="text-gray-500 text-sm mt-1">Visualize historical performance dynamically.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10" id="tt-year-slider">
            <span className="text-gray-400 font-mono text-sm">2023</span>
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-violet-500 rounded-full"
                animate={{ width: retroMode ? '0%' : '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-white font-mono font-bold">{retroMode ? currentYear : '2026'}</span>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Main Chart */}
          <div className="col-span-3 bg-[#12141a] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col shadow-2xl">
            {retroMode && (
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)', mixBlendMode: 'overlay' }} />
            )}
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-gray-400" />
                Tata Motors vs HDFC Bank (Since 2023)
              </h2>
              <button 
                id="tt-start-btn"
                onClick={startBacktest}
                disabled={isPlaying}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPlaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            <div className="flex-1 min-h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData.slice(0, dataIndex + 1)}>
                  <XAxis dataKey="month" stroke="#4b5563" tick={{fill: '#9ca3af'}} />
                  <YAxis stroke="#4b5563" tick={{fill: '#9ca3af'}} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px' }} />
                  <ReferenceLine y={1000} stroke="#374151" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="tata" 
                    stroke="#8b5cf6" 
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#fff' }}
                    isAnimationActive={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hdfc" 
                    stroke="#ef4444" 
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats panel */}
          <div className="col-span-1 space-y-4">
            <motion.div 
              className="bg-[#12141a] border border-white/5 rounded-3xl p-6"
              animate={{ borderColor: retroMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)' }}
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Tata Motors (TAMO)</p>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={dataIndex}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-white mt-1"
                >
                  ₹{historicalData[dataIndex]?.tata}
                </motion.p>
              </AnimatePresence>
              <p className="text-green-400 text-sm font-bold mt-2">
                {dataIndex > 0 ? `+${(((historicalData[dataIndex].tata - historicalData[0].tata) / historicalData[0].tata) * 100).toFixed(1)}%` : '0.0%'} ROI
              </p>
            </motion.div>

            <motion.div className="bg-[#12141a] border border-white/5 rounded-3xl p-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">HDFC Bank (HDFC)</p>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={dataIndex}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-white mt-1"
                >
                  ₹{historicalData[dataIndex]?.hdfc}
                </motion.p>
              </AnimatePresence>
              <p className="text-red-400 text-sm font-bold mt-2">
                {dataIndex > 0 ? `${(((historicalData[dataIndex].hdfc - historicalData[0].hdfc) / historicalData[0].hdfc) * 100).toFixed(1)}%` : '0.0%'} ROI
              </p>
            </motion.div>

            {dataIndex === historicalData.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-3xl p-5 mt-4"
              >
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-100 leading-relaxed">
                    <strong>Conclusion:</strong> Tata Motors outperformed HDFC significantly. If you had swapped HDFC for TAMO in Jan 2023, your capital would have grown by nearly 375%.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTravel;
