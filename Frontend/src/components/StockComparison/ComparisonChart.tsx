import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

interface ComparisonChartProps {
  stocks: Stock[];
  timeframe: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ stocks, timeframe }) => {
  const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  // Generate mock comparison data - Realistic
  const generateComparisonData = () => {
    if (timeframe === '1D') {
      return [
        { time: '09:30', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 12 }), {}) },
        { time: '10:30', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 8 }), {}) },
        { time: '11:30', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 2 }), {}) },
        { time: '12:30', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price + 3 }), {}) },
        { time: '13:30', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {}) },
      ];
    }
    if (timeframe === '1W') {
      return [
        { time: 'Mon', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 40 }), {}) },
        { time: 'Tue', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 28 }), {}) },
        { time: 'Wed', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 15 }), {}) },
        { time: 'Thu', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 5 }), {}) },
        { time: 'Fri', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {}) },
      ];
    }
    if (timeframe === '1M') {
      return [
        { time: 'W1', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 110 }), {}) },
        { time: 'W2', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 70 }), {}) },
        { time: 'W3', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 30 }), {}) },
        { time: 'W4', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {}) },
      ];
    }
    if (timeframe === '1Y') {
      return [
        { time: 'Jan', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 420 }), {}) },
        { time: 'Apr', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 260 }), {}) },
        { time: 'Jul', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 100 }), {}) },
        { time: 'Oct', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 20 }), {}) },
        { time: 'Dec', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {}) },
      ];
    }
    // 5Y
    return [
      { time: '2020', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 1100 }), {}) },
      { time: '2021', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 800 }), {}) },
      { time: '2022', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 450 }), {}) },
      { time: '2023', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 150 }), {}) },
      { time: '2024', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price - 30 }), {}) },
      { time: '2025', ...stocks.reduce((acc, s) => ({ ...acc, [s.symbol]: s.price }), {}) },
    ];
  };

  const data = generateComparisonData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Price Comparison ({timeframe})</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#E5E7EB' }}
            formatter={(value) => `₹${value}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {stocks.map((stock, index) => (
            <Line
              key={stock.symbol}
              type="monotone"
              dataKey={stock.symbol}
              stroke={colors[index % colors.length]}
              dot={false}
              strokeWidth={2}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ComparisonChart;
