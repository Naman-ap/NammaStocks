import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TopMovers = () => {
  const gainers = [
    { symbol: 'ADANIPORTS', price: '789.45', change: '+5.67%' },
    { symbol: 'TATASTEEL', price: '123.80', change: '+4.23%' },
    { symbol: 'JSWSTEEL', price: '678.90', change: '+3.89%' },
    { symbol: 'HINDALCO', price: '456.25', change: '+3.45%' },
  ];

  const losers = [
    { symbol: 'BAJAJ-AUTO', price: '4,567.30', change: '-2.45%' },
    { symbol: 'MARUTI', price: '9,876.75', change: '-1.89%' },
    { symbol: 'ASIANPAINT', price: '3,234.60', change: '-1.67%' },
    { symbol: 'NESTLEIND', price: '2,345.80', change: '-1.23%' },
  ];

  return (
    <div className="space-y-8">
      {/* Gainers */}
      <div>
        <div className="flex items-center space-x-2 mb-5 bg-green-500/10 w-max px-3 py-1.5 rounded-lg border border-green-500/20">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-bold text-green-400 tracking-wide uppercase">Top Gainers</h3>
        </div>
        <div className="space-y-3">
          {gainers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-white font-bold text-base group-hover:text-green-400 transition-colors">{stock.symbol}</p>
                <p className="text-gray-400 text-sm font-medium mt-0.5">₹{stock.price}</p>
              </div>
              <div className="bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20">
                <span className="text-green-400 font-bold text-sm">
                  {stock.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Losers */}
      <div>
        <div className="flex items-center space-x-2 mb-5 bg-red-500/10 w-max px-3 py-1.5 rounded-lg border border-red-500/20">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-red-400 tracking-wide uppercase">Top Losers</h3>
        </div>
        <div className="space-y-3">
          {losers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div>
                <p className="text-white font-bold text-base group-hover:text-red-400 transition-colors">{stock.symbol}</p>
                <p className="text-gray-400 text-sm font-medium mt-0.5">₹{stock.price}</p>
              </div>
              <div className="bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                <span className="text-red-400 font-bold text-sm">
                  {stock.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;