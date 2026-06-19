import React from 'react';
import { motion } from 'framer-motion';

const Heatmap = () => {
  const sectors = [
    { name: 'IT', change: 2.45, size: 'large' },
    { name: 'Banking', change: -0.89, size: 'large' },
    { name: 'Auto', change: 1.67, size: 'medium' },
    { name: 'Pharma', change: -1.23, size: 'medium' },
    { name: 'FMCG', change: 0.34, size: 'medium' },
    { name: 'Metals', change: 3.21, size: 'small' },
    { name: 'Telecom', change: -2.45, size: 'small' },
    { name: 'Oil & Gas', change: 1.89, size: 'small' },
    { name: 'Textiles', change: 0.67, size: 'small' },
    { name: 'Realty', change: -0.45, size: 'small' },
    { name: 'Power', change: 2.11, size: 'small' },
    { name: 'Infra', change: 1.34, size: 'small' },
  ];

  const getColor = (change: number) => {
    if (change > 2) return 'bg-gradient-to-br from-green-500 to-green-700 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
    if (change > 1) return 'bg-gradient-to-br from-green-400 to-green-600 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
    if (change > 0) return 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] text-gray-900';
    if (change > -1) return 'bg-gradient-to-br from-rose-400 to-rose-500 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
    if (change > -2) return 'bg-gradient-to-br from-red-500 to-red-600 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
    return 'bg-gradient-to-br from-red-600 to-red-800 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]';
  };

  const getSize = (size: string) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2 min-h-[8rem]';
      case 'medium': return 'col-span-2 min-h-[4rem]';
      default: return 'min-h-[4rem]';
    }
  };

  return (
    <div className="grid grid-cols-6 gap-3 h-auto min-h-[20rem]">
      {sectors.map((sector, index) => (
        <motion.div
          key={sector.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          className={`${getColor(sector.change)} ${getSize(sector.size)} rounded-2xl p-4 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" />
          
          <div className="relative z-10">
            <h3 className={`font-bold tracking-tight ${sector.change > 0 && sector.change <= 1 ? 'text-gray-900' : 'text-white'} text-sm md:text-base`}>{sector.name}</h3>
          </div>
          <div className="text-right relative z-10 mt-2">
            <p className={`font-extrabold ${sector.change > 0 && sector.change <= 1 ? 'text-gray-900' : 'text-white'} text-sm md:text-lg drop-shadow-sm`}>
              {sector.change > 0 ? '+' : ''}{sector.change}%
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Heatmap;