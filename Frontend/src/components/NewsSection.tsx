import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, ChevronDown } from 'lucide-react';

const NewsSection = ({ symbol }: { symbol: string }) => {
  const [visibleNews, setVisibleNews] = useState(5);

  const newsItems = [
    {
      id: 1,
      title: 'Reliance Industries announces Q4 results, beats estimates',
      summary: 'The company reported strong quarterly earnings with revenue growth of 12% YoY...',
      source: 'Economic Times',
      timestamp: '2 hours ago',
      category: 'Earnings',
      url: '#',
    },
    {
      id: 2,
      title: 'New renewable energy project approved by board',
      summary: 'RIL board approves ₹45,000 crore investment in solar and wind energy projects...',
      source: 'Business Standard',
      timestamp: '4 hours ago',
      category: 'Corporate Action',
      url: '#',
    },
    {
      id: 3,
      title: 'Analysts upgrade target price following strong performance',
      summary: 'Multiple brokerages raise target price citing improved operational metrics...',
      source: 'MoneyControl',
      timestamp: '6 hours ago',
      category: 'Analyst Note',
      url: '#',
    },
    {
      id: 4,
      title: 'Partnership announced with international tech giant',
      summary: 'Strategic alliance to develop next-generation digital solutions...',
      source: 'LiveMint',
      timestamp: '1 day ago',
      category: 'Partnership',
      url: '#',
    },
    {
      id: 5,
      title: 'Expansion into new geographic markets approved',
      summary: 'Company plans to establish presence in Southeast Asian markets...',
      source: 'Financial Express',
      timestamp: '1 day ago',
      category: 'Expansion',
      url: '#',
    },
    {
      id: 6,
      title: 'Dividend declaration for current financial year',
      summary: 'Board declares final dividend of ₹8 per share for FY24...',
      source: 'Economic Times',
      timestamp: '2 days ago',
      category: 'Dividend',
      url: '#',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Earnings': 'bg-green-500',
      'Corporate Action': 'bg-blue-500',
      'Analyst Note': 'bg-purple-500',
      'Partnership': 'bg-orange-500',
      'Expansion': 'bg-cyan-500',
      'Dividend': 'bg-emerald-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Latest News</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-gray-400">Real-time updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {newsItems.slice(0, visibleNews).map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-700 rounded-xl border border-gray-600 hover:border-gray-500 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-md ${getCategoryColor(news.category)}`}>
                  {news.category}
                </span>
                <span className="text-xs text-gray-400">{news.timestamp}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            
            <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
              {news.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {news.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{news.source}</span>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Read more
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {visibleNews < newsItems.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleNews(prev => prev + 3)}
            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-colors"
          >
            <span>Load more news</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsSection;