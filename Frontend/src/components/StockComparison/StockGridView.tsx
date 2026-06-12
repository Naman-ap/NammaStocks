import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import StockMiniCard from './StockMiniCard';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface StockGridViewProps {
  selectedStocks: Stock[];
  onRemoveStock: (symbol: string) => void;
  onCompare: () => void;
  onView: () => void;
}

const StockGridView: React.FC<StockGridViewProps> = ({
  selectedStocks,
  onRemoveStock,
  onCompare,
  onView,
}) => {
  if (selectedStocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-800 rounded-2xl border-2 border-dashed border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">No stocks selected</p>
          <p className="text-gray-500 text-sm">Select stocks from the screener to view or compare them</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Selected Stocks ({selectedStocks.length})
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {selectedStocks.map(s => s.symbol).join(', ')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
          >
            View Details
          </button>
          {selectedStocks.length > 1 && (
            <button
              onClick={onCompare}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Compare
            </button>
          )}
        </div>
      </div>

      {/* Grid View of Stocks - 2 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedStocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <button
              onClick={() => onRemoveStock(stock.symbol)}
              className="absolute top-2 right-2 z-10 p-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-colors"
              title="Remove stock"
            >
              <X className="w-4 h-4" />
            </button>
            <StockMiniCard stock={stock} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StockGridView;
