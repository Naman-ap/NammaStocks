import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import Heatmap from '../components/Heatmap';
import TopMovers from '../components/TopMovers';
import RealTimeTickerTape from '../components/RealTimeTickerTape';
import MarketOverview from '../components/MarketOverview';
import { useNewsSentimentFinnhub, useTopGainersLosers, useCompanyOverview } from '../hooks/useDashboard';

const Dashboard = () => {
  // Fetch dashboard data
  // const gainersLosers = useTopGainersLosers();
  // const newsSentiment = useNewsSentimentFinnhub('AAPL');
  // const companyOverview = useCompanyOverview('AAPL');

  // // Log data for debugging
  // useEffect(() => {
  //   console.log('Top Gainers/Losers:', gainersLosers);
  // }, [gainersLosers]);

  // useEffect(() => {
  //   console.log('News Sentiment:', newsSentiment);
  // }, [newsSentiment]);

  // useEffect(() => {
  //   console.log('Company Overview:', companyOverview);
  // }, [companyOverview]);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <RealTimeTickerTape />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Market Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Real-time Indian stock market insights</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Data</span>
              </div>
            </div>
          </motion.div>

          {/* Market Overview Cards */}
          <motion.div variants={itemVariants}>
            <MarketOverview />
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Heatmap */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Sector Heatmap</h2>
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
                <Heatmap />
              </div>
            </motion.div>

            {/* Top Movers */}
            <motion.div variants={itemVariants}>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Top Movers</h2>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <TopMovers />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;