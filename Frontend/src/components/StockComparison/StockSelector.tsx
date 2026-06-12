import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockSelectorProps {
  availableStocks: Stock[];
  selectedStocks: Stock[];
  onSelect: (stock: Stock) => void;
  onDeselect: (symbol: string) => void;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  availableStocks,
  selectedStocks,
  onSelect,
  onDeselect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');

  const selectedSymbols = new Set(selectedStocks.map(s => s.symbol));

  const filteredStocks = availableStocks.filter(stock => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = !filterSector || stock.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  const sectors = Array.from(new Set(availableStocks.map(s => s.sector)));

  const handleToggle = (stock: Stock) => {
    if (selectedSymbols.has(stock.symbol)) {
      onDeselect(stock.symbol);
    } else {
      onSelect(stock);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Select Stocks</h2>

      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
          />
        </div>

        {/* Sector Filter */}
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white"
        >
          <option value="">All Sectors</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {/* Stock List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredStocks.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No stocks found</p>
        ) : (
          filteredStocks.map(stock => (
            <motion.button
              key={stock.symbol}
              whileHover={{ x: 4 }}
              onClick={() => handleToggle(stock)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                selectedSymbols.has(stock.symbol)
                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedSymbols.has(stock.symbol) && (
                  <Check className="w-4 h-4 text-cyan-400" />
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm">{stock.symbol}</p>
                  <p className="text-xs opacity-70">{stock.sector}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{stock.price.toFixed(2)}</p>
                <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Selection Summary */}
      {selectedStocks.length > 0 && (
        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-sm text-cyan-400">
            {selectedStocks.length} stock{selectedStocks.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default StockSelector;
