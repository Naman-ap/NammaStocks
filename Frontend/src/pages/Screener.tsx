import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, ChevronDown, ChevronRight, Search } from 'lucide-react';
import FilterPanel from '../components/FilterPanel';
import StockTable from '../components/StockTable';

const Screener = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Stock Screener
              </h1>
              <p className="text-gray-400 mt-2">Advanced filtering and analysis tools</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {isFilterOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isFilterOpen ? 1 : 0,
                x: isFilterOpen ? 0 : -20,
                width: isFilterOpen ? "auto" : 0
              }}
              className={`${isFilterOpen ? 'lg:col-span-1' : 'hidden'} transition-all`}
            >
              <FilterPanel />
            </motion.div>

            {/* Stock Table */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${isFilterOpen ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all`}
            >
              <StockTable />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Screener;