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
    <div className="space-y-6">
      {/* Gainers */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-green-400">Top Gainers</h3>
        </div>
        <div className="space-y-3">
          {gainers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div>
                <p className="text-white font-medium text-sm">{stock.symbol}</p>
                <p className="text-gray-400 text-xs">₹{stock.price}</p>
              </div>
              <div className="text-green-400 font-semibold text-sm">
                {stock.change}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Losers */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingDown className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Top Losers</h3>
        </div>
        <div className="space-y-3">
          {losers.map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div>
                <p className="text-white font-medium text-sm">{stock.symbol}</p>
                <p className="text-gray-400 text-xs">₹{stock.price}</p>
              </div>
              <div className="text-red-400 font-semibold text-sm">
                {stock.change}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;