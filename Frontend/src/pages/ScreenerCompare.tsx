import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StockGridView from '../components/StockComparison/StockGridView';
import ComparisonChart from '../components/StockComparison/ComparisonChart';
import GhostCursor from '../components/GhostCursor';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

const ScreenerCompare = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isAgentDriving, setIsAgentDriving] = useState(false);

  // Mock available stocks with realistic data
  const availableStocks: Stock[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: 2934.50,
      change: 28.75,
      changePercent: 0.99,
      sector: 'Oil & Gas',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 4125.30,
      change: -52.70,
      changePercent: -1.26,
      sector: 'IT',
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank Limited',
      price: 2087.45,
      change: 35.20,
      changePercent: 1.71,
      sector: 'Banking',
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1892.60,
      change: -25.40,
      changePercent: -1.32,
      sector: 'IT',
    },
    {
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      price: 1425.80,
      change: 18.75,
      changePercent: 1.33,
      sector: 'IT',
    },
    {
      symbol: 'BAJAJ-AUTO',
      name: 'Bajaj Auto Limited',
      price: 9234.55,
      change: -145.45,
      changePercent: -1.55,
      sector: 'Automobile',
    },
    {
      symbol: 'MARUTI',
      name: 'Maruti Suzuki India Limited',
      price: 12567.80,
      change: 234.20,
      changePercent: 1.90,
      sector: 'Automobile',
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      price: 758.90,
      change: 12.30,
      changePercent: 1.65,
      sector: 'Banking',
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Limited',
      price: 1567.50,
      change: -18.50,
      changePercent: -1.17,
      sector: 'Banking',
    },
    {
      symbol: 'AXISBANK',
      name: 'Axis Bank Limited',
      price: 1342.75,
      change: 22.45,
      changePercent: 1.70,
      sector: 'Banking',
    },
  ];

  // Ghost cursor steps
  const symbolsParam = searchParams.get('symbols');
  const isDriveMode = searchParams.get('drive') === 'true';

  const symbolsToClick = symbolsParam ? symbolsParam.split(',') : [];

  const cursorSteps = isDriveMode ? [
    ...symbolsToClick.map((symbol, index) => ({
      targetId: `stock-${symbol}`,
      action: 'click' as const,
      delayBefore: index === 0 ? 1500 : 1200, // slower, more human speed
      onComplete: () => {
        const stockObj = availableStocks.find(s => s.symbol === symbol);
        if (stockObj) {
          setSelectedStocks(prev => {
            if (!prev.find(s => s.symbol === symbol)) {
              return [...prev, stockObj];
            }
            return prev;
          });
        }
      }
    })),
    {
      targetId: 'view-compare-btn',
      action: 'click' as const,
      delayBefore: 1200,
      onComplete: () => {
        setViewMode('compare');
      }
    }
  ] : [];

  // Initialize selected stocks from URL params if NOT in drive mode
  useEffect(() => {
    if (symbolsParam && !isDriveMode) {
      const initialSelected = availableStocks.filter(s => symbolsToClick.includes(s.symbol));
      if (initialSelected.length > 0) {
        setSelectedStocks(initialSelected);
        if (initialSelected.length > 1) {
          setViewMode('compare');
        }
      }
    }
  }, [symbolsParam, isDriveMode]);

  const handleSelectStock = (stock: Stock) => {
    if (!selectedStocks.find(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const handleDeselectStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black relative overflow-hidden">
      {isDriveMode && (
        <GhostCursor 
          steps={cursorSteps} 
          onAllComplete={() => {
            setIsAgentDriving(false);
            navigate(`/screener/compare?symbols=${symbolsParam}`, { replace: true });
          }} 
        />
      )}
      
      {/* Agent Driving Toast */}
      {isDriveMode && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#08090c]/90 backdrop-blur-md border border-cyan-500/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute left-6"></div>
          <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          <span className="text-cyan-400 text-sm font-semibold tracking-wide ml-2">Agent is driving the UI...</span>
        </motion.div>
      )}

      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="max-w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Sticky Control Bar */}
          <div className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/10 pb-4 shadow-2xl">
            {/* Header & Controls Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4">
              {/* Left: Title & Back */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/screener')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Back to Screener"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Compare
                  </h1>
                </div>
              </div>

              {/* Center: Search & Filter */}
              <div className="flex-1 flex max-w-2xl gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search stocks..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-500 text-sm transition-colors"
                  />
                </div>
                <select
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none text-white text-sm cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <option value="">All Sectors</option>
                  <option value="IT">IT</option>
                  <option value="Banking">Banking</option>
                  <option value="Oil & Gas">Oil & Gas</option>
                  <option value="Automobile">Automobile</option>
                </select>
              </div>

              {/* Right: View Mode */}
              <div className="flex items-center gap-4">
                <div className="text-sm hidden xl:block">
                  <span className="text-gray-400">Selected: </span>
                  <span className="text-cyan-400 font-semibold">{selectedStocks.length}</span>
                </div>
                {selectedStocks.length > 0 && (
                  <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${viewMode === 'grid'
                          ? 'bg-cyan-500/20 text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      Grid
                    </button>
                    {selectedStocks.length > 1 && (
                      <button
                        id="view-compare-btn"
                        onClick={() => setViewMode('compare')}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${viewMode === 'compare'
                            ? 'bg-blue-500/20 text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        Compare
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Stock Pills Ribbon */}
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent mask-linear-fade">
                {availableStocks.map((stock) => (
                  <button
                    id={`stock-${stock.symbol}`}
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedStocks.find(s => s.symbol === stock.symbol)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 border border-transparent'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {stock.symbol}
                    {selectedStocks.find(s => s.symbol === stock.symbol) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area - Full Width */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            {/* Grid View */}
            {viewMode === 'grid' && (
              <StockGridView
                selectedStocks={selectedStocks}
                onRemoveStock={handleDeselectStock}
                onView={() => setViewMode('grid')}
                onCompare={() => setViewMode('compare')}
              />
            )}

            {/* Comparison View */}
            {viewMode === 'compare' && selectedStocks.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Timeframe Selector */}
                <div className="flex gap-2 bg-gray-800 p-3 rounded-lg border border-gray-700 overflow-x-auto w-fit">
                  {['1D', '1W', '1M', '1Y', '5Y'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${selectedTimeframe === tf
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                        }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Comparison Chart */}
                <ComparisonChart
                  stocks={selectedStocks}
                  timeframe={selectedTimeframe}
                />

                {/* Comparison Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Comparison Table</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700 bg-gray-900/50">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Symbol</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Price</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Change</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Change %</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Sector</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStocks.map(stock => (
                          <tr key={stock.symbol} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-white">{stock.symbol}</td>
                            <td className="px-6 py-4 text-white">₹{stock.price.toFixed(2)}</td>
                            <td className={`px-6 py-4 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 font-semibold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 text-gray-400">{stock.sector}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenerCompare;
