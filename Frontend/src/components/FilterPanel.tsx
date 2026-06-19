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
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-medium tracking-wide">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
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
      <label className="block text-sm font-semibold tracking-wider uppercase text-gray-400 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Min"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:bg-white/10 focus:outline-none text-white text-sm transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:bg-white/10 focus:outline-none text-white text-sm transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="p-5 border-b border-white/5 bg-white/5">
        <h2 className="text-lg font-bold text-white tracking-wide">Filters</h2>
      </div>

      <div className="divide-y divide-white/5">
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
            <label className="block text-sm font-semibold tracking-wider uppercase text-gray-400 mb-2">Category</label>
            <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:bg-white/10 focus:outline-none text-white text-sm transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
              <option value="" className="bg-gray-900">All</option>
              <option value="large" className="bg-gray-900">Large Cap</option>
              <option value="mid" className="bg-gray-900">Mid Cap</option>
              <option value="small" className="bg-gray-900">Small Cap</option>
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
            <label className="block text-sm font-semibold tracking-wider uppercase text-gray-400 mb-2">Moving Averages</label>
            <div className="space-y-3">
              {['Above 20 DMA', 'Above 50 DMA', 'Above 200 DMA'].map((option) => (
                <label key={option} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3 border border-white/20 rounded bg-white/5 group-hover:border-cyan-400 transition-colors">
                    <input type="checkbox" className="absolute opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{option}</span>
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

      <div className="p-5 border-t border-white/5 bg-white/5">
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2.5 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-all font-bold tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            Apply Filters
          </button>
          <button className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all font-semibold tracking-wide">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;