import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FilterPanel = () => {
  const [openSections, setOpenSections] = useState({
    price: true,
    marketCap: true,
    ratios: true,
    technical: false,
    fundamental: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, isOpen, onToggle, children }: any) => (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
      >
        <span className="text-white font-medium">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  );

  const RangeInput = ({ label, min, max, step = 1 }: any) => (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Min"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white text-sm"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
      </div>

      <div className="divide-y divide-gray-700">
        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <RangeInput label="Price (₹)" />
        </FilterSection>

        <FilterSection
          title="Market Cap"
          isOpen={openSections.marketCap}
          onToggle={() => toggleSection('marketCap')}
        >
          <RangeInput label="Market Cap (Cr)" />
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none text-white text-sm">
              <option value="">All</option>
              <option value="large">Large Cap</option>
              <option value="mid">Mid Cap</option>
              <option value="small">Small Cap</option>
            </select>
          </div>
        </FilterSection>

        <FilterSection
          title="Valuation Ratios"
          isOpen={openSections.ratios}
          onToggle={() => toggleSection('ratios')}
        >
          <RangeInput label="P/E Ratio" />
          <RangeInput label="P/B Ratio" />
          <RangeInput label="Debt to Equity" />
        </FilterSection>

        <FilterSection
          title="Technical Indicators"
          isOpen={openSections.technical}
          onToggle={() => toggleSection('technical')}
        >
          <RangeInput label="RSI" />
          <RangeInput label="Volume (Lakhs)" />
          <div>
            <label className="block text-sm text-gray-400 mb-2">Moving Averages</label>
            <div className="space-y-2">
              {['Above 20 DMA', 'Above 50 DMA', 'Above 200 DMA'].map((option) => (
                <label key={option} className="flex items-center">
                  <input type="checkbox" className="mr-2 text-cyan-400" />
                  <span className="text-sm text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Fundamental Metrics"
          isOpen={openSections.fundamental}
          onToggle={() => toggleSection('fundamental')}
        >
          <RangeInput label="ROE (%)" />
          <RangeInput label="Revenue Growth (%)" />
          <RangeInput label="Profit Growth (%)" />
        </FilterSection>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
            Apply Filters
          </button>
          <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;