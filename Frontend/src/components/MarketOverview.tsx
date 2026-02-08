import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    {
      title: 'NIFTY 50',
      value: '19,674.25',
      change: '+247.85',
      percentage: '+1.28%',
      positive: true,
      icon: TrendingUp,
    },
    {
      title: 'SENSEX',
      value: '66,023.69',
      change: '+834.16',
      percentage: '+1.28%',
      positive: true,
      icon: TrendingUp,
    },
    {
      title: 'BANK NIFTY',
      value: '44,856.30',
      change: '-156.75',
      percentage: '-0.35%',
      positive: false,
      icon: TrendingDown,
    },
    {
      title: 'VIX',
      value: '13.42',
      change: '+0.87',
      percentage: '+6.95%',
      positive: true,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {marketData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">{item.title}</h3>
            <item.icon className={`w-5 h-5 ${item.positive ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                {item.change}
              </span>
              <span className={`text-sm ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                ({item.percentage})
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketOverview;