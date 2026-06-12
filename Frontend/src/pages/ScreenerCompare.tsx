import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StockGridView from '../components/StockComparison/StockGridView';
import ComparisonChart from '../components/StockComparison/ComparisonChart';

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
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

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

  const handleSelectStock = (stock: Stock) => {
    if (!selectedStocks.find(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  const handleDeselectStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s.symbol !== symbol));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-4 bg-gray-800 border-b border-gray-700">
            <button
              onClick={() => navigate('/screener')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to Screener"
            >
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Stock Comparison
              </h1>
              <p className="text-gray-400 text-sm">Compare and analyze multiple stocks</p>
            </div>
          </div>

          {/* Stock Selector Top Bar */}
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl border border-gray-700 p-4"
            >
              <div className="space-y-4">
                {/* Search and Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Search Box */}
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by symbol or company name..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Sector Filter */}
                  <select
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white"
                  >
                    <option value="">All Sectors</option>
                    <option value="IT">IT</option>
                    <option value="Banking">Banking</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Automobile">Automobile</option>
                  </select>
                </div>

                {/* Stock Pills/Tags */}
                <div className="flex flex-wrap gap-2">
                  {availableStocks.slice(0, 8).map((stock) => (
                    <motion.button
                      key={stock.symbol}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSelectStock(stock)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStocks.find(s => s.symbol === stock.symbol)
                          ? 'bg-cyan-500 text-white border border-cyan-400'
                          : 'bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {stock.symbol}
                      {selectedStocks.find(s => s.symbol === stock.symbol) && (
                        <Check className="w-3 h-3 inline ml-1" />
                      )}
                    </motion.button>
                  ))}
                  <button
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500 transition-all"
                  >
                    +{availableStocks.length - 8} More
                  </button>
                </div>

                {/* Selection Info and View Mode */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-700">
                  <div className="text-sm">
                    <span className="text-gray-400">Selected: </span>
                    <span className="text-cyan-400 font-semibold">{selectedStocks.length}</span>
                    {selectedStocks.length > 0 && (
                      <span className="text-gray-400 ml-2">
                        ({selectedStocks.map(s => s.symbol).join(', ')})
                      </span>
                    )}
                  </div>

                  {/* View Mode Selector */}
                  {selectedStocks.length > 0 && (
                    <div className="flex gap-2 bg-gray-900/50 p-2 rounded-lg w-fit">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-cyan-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Grid View
                      </button>
                      {selectedStocks.length > 1 && (
                        <button
                          onClick={() => setViewMode('compare')}
                          className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
                            viewMode === 'compare'
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Compare View
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                        selectedTimeframe === tf
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
