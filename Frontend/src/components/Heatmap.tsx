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
    if (change > 2) return 'bg-green-500';
    if (change > 1) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change > -1) return 'bg-red-300';
    if (change > -2) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getSize = (size: string) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2 h-32';
      case 'medium': return 'col-span-2 h-16';
      default: return 'h-16';
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 h-80">
      {sectors.map((sector, index) => (
        <motion.div
          key={sector.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`${getColor(sector.change)} ${getSize(sector.size)} rounded-xl p-3 flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer`}
        >
          <div>
            <h3 className="text-white font-semibold text-sm">{sector.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">
              {sector.change > 0 ? '+' : ''}{sector.change}%
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Heatmap;