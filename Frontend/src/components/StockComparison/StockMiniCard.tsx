import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockMiniCardProps {
  stock: Stock;
}

const StockMiniCard: React.FC<StockMiniCardProps> = ({ stock }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1D');

  // Generate realistic price movement data based on stock's actual change
  const generateChartData = () => {
    // Calculate volatility based on the stock's change percentage
    const volatility = Math.abs(stock.changePercent) * (stock.price / 100);
    
    // Determine trend direction
    const trendDirection = stock.change >= 0 ? 1 : -1;
    
    const dataMap: { [key: string]: Array<{ time: string; price: number }> } = {
      '1D': [
        { time: '09:30', price: stock.price + (volatility * 2.5 * trendDirection * -1) },
        { time: '09:45', price: stock.price + (volatility * 2.2 * trendDirection * -1) },
        { time: '10:00', price: stock.price + (volatility * 1.8 * trendDirection * -1) },
        { time: '10:30', price: stock.price + (volatility * 1.2 * trendDirection * -1) },
        { time: '11:00', price: stock.price + (volatility * 0.5 * trendDirection * -1) },
        { time: '11:30', price: stock.price + (volatility * 0.2 * trendDirection * -1) },
        { time: '12:00', price: stock.price + (volatility * 0.8 * trendDirection) },
        { time: '12:30', price: stock.price + (volatility * 1.5 * trendDirection) },
        { time: '13:00', price: stock.price + (volatility * 0.9 * trendDirection) },
        { time: '14:00', price: stock.price + (volatility * 1.1 * trendDirection) },
        { time: '15:00', price: stock.price },
      ],
      '1W': [
        { time: 'Mon', price: stock.price - (volatility * 8) },
        { time: 'Tue', price: stock.price - (volatility * 5.5) },
        { time: 'Wed', price: stock.price - (volatility * 3) },
        { time: 'Thu', price: stock.price - (volatility * 1) },
        { time: 'Fri', price: stock.price + (volatility * 0.5) },
      ],
      '1M': [
        { time: 'W1', price: stock.price - (volatility * 20) },
        { time: 'W2', price: stock.price - (volatility * 13) },
        { time: 'W3', price: stock.price - (volatility * 6) },
        { time: 'W4', price: stock.price + (volatility * 1) },
      ],
      '1Y': [
        { time: 'Jan', price: stock.price - (volatility * 80) },
        { time: 'Feb', price: stock.price - (volatility * 65) },
        { time: 'Mar', price: stock.price - (volatility * 50) },
        { time: 'Apr', price: stock.price - (volatility * 38) },
        { time: 'May', price: stock.price - (volatility * 25) },
        { time: 'Jun', price: stock.price - (volatility * 15) },
        { time: 'Jul', price: stock.price - (volatility * 8) },
        { time: 'Aug', price: stock.price - (volatility * 3) },
        { time: 'Sep', price: stock.price + (volatility * 2) },
        { time: 'Oct', price: stock.price + (volatility * 5) },
        { time: 'Nov', price: stock.price + (volatility * 2) },
        { time: 'Dec', price: stock.price },
      ],
      '5Y': [
        { time: '2020', price: stock.price - (volatility * 200) },
        { time: '2021', price: stock.price - (volatility * 140) },
        { time: '2022', price: stock.price - (volatility * 85) },
        { time: '2023', price: stock.price - (volatility * 35) },
        { time: '2024', price: stock.price - (volatility * 8) },
        { time: '2025', price: stock.price },
      ],
    };
    
    return dataMap[activeTimeframe] || dataMap['1D'];
  };

  const chartData = generateChartData();
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 overflow-hidden transition-all"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
            <p className="text-sm text-gray-400">{stock.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">₹{stock.price.toFixed(2)}</p>
            <div className={`flex items-center justify-end space-x-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500">{stock.name}</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-1 p-3 bg-gray-900/30 border-b border-gray-700 overflow-x-auto">
        {['1D', '1W', '1M', '1Y', '5Y'].map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
              activeTimeframe === tf
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4 bg-gray-800/50">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              style={{ fontSize: '11px' }}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '11px' }}
              tick={{ fill: '#9CA3AF' }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              formatter={(value) => [`₹${value}`, 'Price']}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700 text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Change</span>
          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {isPositive ? '+' : ''}{stock.change.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StockMiniCard;
