import React from 'react';
import { motion } from 'framer-motion';

const RealTimeTickerTape = () => {
  const stocks = [
    { symbol: 'RELIANCE', price: '2,847.65', change: '+2.45%', positive: true },
    { symbol: 'TCS', price: '3,456.80', change: '+1.23%', positive: true },
    { symbol: 'HDFC', price: '1,678.90', change: '-0.89%', positive: false },
    { symbol: 'INFY', price: '1,432.15', change: '+0.67%', positive: true },
    { symbol: 'ICICIBANK', price: '945.25', change: '+1.45%', positive: true },
    { symbol: 'BAJFINANCE', price: '6,789.30', change: '-1.23%', positive: false },
    { symbol: 'HCLTECH', price: '1,156.75', change: '+2.11%', positive: true },
    { symbol: 'WIPRO', price: '445.60', change: '+0.34%', positive: true },
  ];

  const duplicatedStocks = [...stocks, ...stocks, ...stocks];

  return (
    <div className="bg-[#08090c]/40 backdrop-blur-md border-b border-white/5 overflow-hidden">
      <motion.div
        className="flex space-x-8 py-3"
        animate={{ x: [-1000, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedStocks.map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <span className="text-white font-medium">{stock.symbol}</span>
            <span className="text-gray-300">₹{stock.price}</span>
            <span className={`font-medium ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
              {stock.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default RealTimeTickerTape;