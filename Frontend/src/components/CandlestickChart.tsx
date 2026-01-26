import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const CandlestickChart = ({ symbol }: { symbol: string }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');

  // Mock chart data
  const chartData = [
    { time: '09:15', open: 2780, high: 2795, low: 2775, close: 2790, volume: 45000 },
    { time: '09:30', open: 2790, high: 2810, low: 2785, close: 2805, volume: 52000 },
    { time: '09:45', open: 2805, high: 2820, low: 2800, close: 2815, volume: 48000 },
    { time: '10:00', open: 2815, high: 2830, low: 2810, close: 2825, volume: 55000 },
    { time: '10:15', open: 2825, high: 2840, low: 2820, close: 2835, volume: 61000 },
    { time: '10:30', open: 2835, high: 2845, low: 2830, close: 2840, volume: 58000 },
    { time: '10:45', open: 2840, high: 2850, low: 2835, close: 2845, volume: 52000 },
    { time: '11:00', open: 2845, high: 2855, low: 2840, close: 2850, volume: 49000 },
  ];

  const timeframes = ['1D', '5D', '1M', '3M', '6M', '1Y'];

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{symbol} Chart</h2>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex bg-gray-700 rounded-xl p-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-xl focus:border-cyan-400 focus:outline-none"
          >
            <option value="candlestick">Candlestick</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
          </select>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#00D4FF" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Bar dataKey="close" fill="#00D4FF" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Technical Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
        {[
          { label: 'RSI (14)', value: '68.45', color: 'text-yellow-400' },
          { label: 'MACD', value: '+12.34', color: 'text-green-400' },
          { label: '20 DMA', value: '2,834.56', color: 'text-cyan-400' },
          { label: '50 DMA', value: '2,789.23', color: 'text-blue-400' },
        ].map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm">{indicator.label}</p>
            <p className={`font-semibold ${indicator.color}`}>{indicator.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CandlestickChart;