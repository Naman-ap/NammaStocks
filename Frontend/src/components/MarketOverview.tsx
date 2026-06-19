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
    <div className="space-y-2">
      {marketData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.07 }}
          className="flex items-center justify-between p-3 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/6 hover:border-white/10 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${item.positive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">{item.title}</p>
              <p className="text-base font-black text-white">{item.value}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.positive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
              {item.percentage}
            </span>
            <p className={`text-xs mt-1 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketOverview;