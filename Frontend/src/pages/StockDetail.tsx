import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  PieChart,
  Calendar,
  ExternalLink
} from 'lucide-react';
import CandlestickChart from '../components/CandlestickChart';
import KeyRatioCards from '../components/KeyRatioCards';
import NewsSection from '../components/NewsSection';

const StockDetail = () => {
  const { symbol } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock stock data
  const stockData = {
    symbol: symbol || 'RELIANCE',
    name: 'Reliance Industries Limited',
    price: 2847.65,
    change: 68.45,
    changePercent: 2.46,
    dayHigh: 2865.30,
    dayLow: 2789.20,
    open: 2795.50,
    previousClose: 2779.20,
    volume: 4567890,
    marketCap: 1923456,
    pe: 24.5,
    pb: 2.1,
    dividend: 24.50,
    bookValue: 1356.20,
    sector: 'Oil & Gas',
    industry: 'Petroleum Products',
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'financials', label: 'Financials', icon: PieChart },
    { id: 'news', label: 'News', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Stock Header */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {stockData.symbol.substring(0, 2)}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{stockData.symbol}</h1>
                  <p className="text-gray-400">{stockData.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-600 text-gray-200 rounded-md">
                      {stockData.sector}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-gray-600 text-gray-200 rounded-md">
                      {stockData.industry}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0 text-right">
                <div className="text-3xl font-bold text-white">
                  ₹{stockData.price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end space-x-2 mt-1 ${
                  stockData.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stockData.change > 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    {stockData.change > 0 ? '+' : ''}₹{stockData.change.toFixed(2)}
                  </span>
                  <span>
                    ({stockData.change > 0 ? '+' : ''}{stockData.changePercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Open', value: `₹${stockData.open}` },
              { label: 'High', value: `₹${stockData.dayHigh}` },
              { label: 'Low', value: `₹${stockData.dayLow}` },
              { label: 'Volume', value: `${(stockData.volume / 100000).toFixed(1)}L` },
              { label: 'Market Cap', value: `₹${(stockData.marketCap / 100).toLocaleString()}Cr` },
              { label: 'P/E Ratio', value: stockData.pe },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg"
              >
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white font-semibold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'overview' && (
                <>
                  <CandlestickChart symbol={stockData.symbol} />
                  <KeyRatioCards data={stockData} />
                </>
              )}
              
              {activeTab === 'financials' && (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">Financial Highlights</h3>
                  <div className="space-y-4">
                    <div className="text-gray-300">
                      <p>Detailed financial data and analysis coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'news' && <NewsSection symbol={stockData.symbol} />}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Company Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">₹{(stockData.marketCap / 100).toLocaleString()}Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Book Value</span>
                    <span className="text-white">₹{stockData.bookValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">P/E Ratio</span>
                    <span className="text-white">{stockData.pe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">P/B Ratio</span>
                    <span className="text-white">{stockData.pb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dividend Yield</span>
                    <span className="text-white">{stockData.dividend}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all">
                    Add to Watchlist
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
                    Set Price Alert
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Company Website</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockDetail;