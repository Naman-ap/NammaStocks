import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart3 } from 'lucide-react';

const KeyRatioCards = ({ data }: any) => {
  const ratios = [
    {
      title: 'Price to Earnings',
      value: data.pe,
      suffix: 'x',
      icon: BarChart3,
      trend: 'neutral',
      description: 'Current P/E ratio',
    },
    {
      title: 'Price to Book',
      value: data.pb,
      suffix: 'x',
      icon: PieChart,
      trend: 'positive',
      description: 'Price relative to book value',
    },
    {
      title: 'Market Cap',
      value: (data.marketCap / 100).toLocaleString(),
      prefix: '₹',
      suffix: 'Cr',
      icon: DollarSign,
      trend: 'positive',
      description: 'Total market value',
    },
    {
      title: 'Dividend Yield',
      value: data.dividend,
      suffix: '%',
      icon: TrendingUp,
      trend: 'positive',
      description: 'Annual dividend yield',
    },
    {
      title: 'Book Value',
      value: data.bookValue.toLocaleString(),
      prefix: '₹',
      icon: Activity,
      trend: 'neutral',
      description: 'Book value per share',
    },
    {
      title: 'Volume',
      value: (data.volume / 100000).toFixed(1),
      suffix: 'L',
      icon: BarChart3,
      trend: 'positive',
      description: 'Trading volume today',
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-cyan-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Key Ratios & Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratios.map((ratio, index) => {
          const TrendIcon = getTrendIcon(ratio.trend);
          
          return (
            <motion.div
              key={ratio.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10`}>
                  <ratio.icon className={`w-6 h-6 ${getTrendColor(ratio.trend)}`} />
                </div>
                <TrendIcon className={`w-5 h-5 ${getTrendColor(ratio.trend)}`} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">{ratio.title}</h3>
                <div className="flex items-baseline space-x-1">
                  {ratio.prefix && (
                    <span className="text-lg font-bold text-white">{ratio.prefix}</span>
                  )}
                  <span className="text-2xl font-bold text-white">{ratio.value}</span>
                  {ratio.suffix && (
                    <span className="text-lg font-bold text-white">{ratio.suffix}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{ratio.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyRatioCards;