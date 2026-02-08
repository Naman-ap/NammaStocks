import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpDown, TrendingUp, TrendingDown, Star } from 'lucide-react';

const StockTable = () => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const stocks = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      price: 2847.65,
      change: 2.45,
      changePercent: 1.28,
      volume: 45.67,
      marketCap: 1923456,
      pe: 24.5,
      pb: 2.1,
      sector: 'Oil & Gas',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      price: 3456.80,
      change: 42.30,
      changePercent: 1.23,
      volume: 23.45,
      marketCap: 1234567,
      pe: 28.9,
      pb: 12.4,
      sector: 'IT',
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank Limited',
      price: 1678.90,
      change: -15.23,
      changePercent: -0.89,
      volume: 67.89,
      marketCap: 987654,
      pe: 18.7,
      pb: 2.8,
      sector: 'Banking',
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: 1432.15,
      change: 9.45,
      changePercent: 0.67,
      volume: 34.56,
      marketCap: 567890,
      pe: 22.1,
      pb: 8.9,
      sector: 'IT',
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Limited',
      price: 945.25,
      change: 13.56,
      changePercent: 1.45,
      volume: 89.12,
      marketCap: 654321,
      pe: 16.5,
      pb: 2.3,
      sector: 'Banking',
    },
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const TableHeader = ({ label, sortKey, className = '' }: any) => (
    <th
      className={`px-6 py-4 text-left cursor-pointer hover:bg-gray-700 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span className="text-sm font-semibold text-gray-300">{label}</span>
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
      </div>
    </th>
  );

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Screened Stocks</h2>
          <span className="text-sm text-gray-400">{stocks.length} results</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <TableHeader label="Stock" sortKey="name" />
              <TableHeader label="Price" sortKey="price" />
              <TableHeader label="Change" sortKey="change" />
              <TableHeader label="Volume" sortKey="volume" />
              <TableHeader label="Market Cap" sortKey="marketCap" />
              <TableHeader label="P/E" sortKey="pe" />
              <TableHeader label="P/B" sortKey="pb" />
              <TableHeader label="Sector" sortKey="sector" />
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-gray-300">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedStocks.map((stock, index) => (
              <motion.tr
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="text-white font-semibold hover:text-cyan-400 transition-colors"
                    >
                      {stock.symbol}
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">{stock.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-medium">₹{stock.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {stock.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <div className={`${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <p className="font-medium">
                        {stock.change > 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </p>
                      <p className="text-xs">
                        ({stock.change > 0 ? '+' : ''}{stock.changePercent}%)
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300">{stock.volume}L</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300">₹{(stock.marketCap / 100).toLocaleString()}Cr</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300">{stock.pe}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300">{stock.pb}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-600 text-gray-200 rounded-md">
                    {stock.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                    <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;