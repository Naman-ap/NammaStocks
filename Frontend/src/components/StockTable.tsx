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
      className={`px-6 py-4 text-left cursor-pointer hover:bg-white/5 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1 group">
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400 group-hover:text-cyan-400 transition-colors">{label}</span>
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    </th>
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">Screened Stocks</h2>
          <span className="text-sm font-semibold tracking-widest uppercase text-gray-500 bg-black/20 px-3 py-1 rounded-full">{stocks.length} results</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/20 border-b border-white/5">
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
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedStocks.map((stock, index) => (
              <motion.tr
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div>
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="text-white font-bold group-hover:text-cyan-400 transition-colors"
                    >
                      {stock.symbol}
                    </Link>
                    <p className="text-xs font-medium text-gray-500 mt-1 tracking-wide">{stock.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-bold tracking-wide">₹{stock.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-md ${stock.change > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {stock.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className={`${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <p className="font-bold tracking-wide">
                        {stock.change > 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                      </p>
                      <p className="text-xs font-medium px-1.5 py-0.5 mt-1 rounded-md bg-white/5 inline-block">
                        {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300 font-medium">{stock.volume}L</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300 font-medium">₹{(stock.marketCap / 100).toLocaleString()}Cr</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300 font-medium">{stock.pe}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-300 font-medium">{stock.pb}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase bg-white/5 text-gray-300 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                    {stock.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
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