import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { stocksApi } from '../../api/Stocks';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface ComparisonChartProps {
  stocks: Stock[];
  timeframe: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ stocks, timeframe }) => {
  const colors = ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#ef4444', '#f97316', '#84cc16', '#14b8a6'];
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const periodMap: Record<string, string> = {
    '1D': '1d',
    '1W': '5d',
    '1M': '1mo',
    '1Y': '1y',
    '5Y': '5y'
  };

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (stocks.length === 0) {
        setData([]);
        return;
      }
      setLoading(true);
      try {
        const period = periodMap[timeframe] || '1mo';
        const promises = stocks.map(stock => {
          const querySymbol = stock.symbol.includes('.') ? stock.symbol : `${stock.symbol}.NS`;
          return stocksApi.getStockHistory(querySymbol, period).then(res => ({
            symbol: stock.symbol,
            history: res?.history || {}
          }));
        });
        
        const results = await Promise.all(promises);
        
        // 1. Group data by exact timestamp
        const groupedData: Record<number, any> = {};

        results.forEach(res => {
          Object.entries(res.history).forEach(([dateStr, value]: [string, any]) => {
            const d = new Date(dateStr);
            const timestamp = d.getTime();
            const rawPrice = Number(value.Close);
            
            if (isNaN(rawPrice)) return; // skip if not a valid number

            if (!groupedData[timestamp]) {
              groupedData[timestamp] = { timestamp, fullDate: dateStr };
            }
            // Store raw price first
            groupedData[timestamp][`${res.symbol}_raw`] = rawPrice;
          });
        });
        
        // Convert to array and sort chronologically
        let finalData = Object.values(groupedData).sort((a, b) => a.timestamp - b.timestamp);

        // 2. Normalize to Percentage Change
        // Find starting price for each stock
        const startingPrices: Record<string, number> = {};
        
        stocks.forEach(stock => {
          // find the first data point where this stock has a valid price
          const firstValidPoint = finalData.find(d => typeof d[`${stock.symbol}_raw`] === 'number');
          if (firstValidPoint) {
            startingPrices[stock.symbol] = firstValidPoint[`${stock.symbol}_raw`];
          }
        });

        // Calculate % change for each data point
        finalData = finalData.map(point => {
          const newPoint = { ...point };
          stocks.forEach(stock => {
            const rawPrice = point[`${stock.symbol}_raw`];
            const startPrice = startingPrices[stock.symbol];
            
            if (typeof rawPrice === 'number' && typeof startPrice === 'number' && startPrice !== 0) {
              const percentChange = ((rawPrice - startPrice) / startPrice) * 100;
              newPoint[stock.symbol] = percentChange; // This is what the chart plots
            }
          });
          return newPoint;
        });

        setData(finalData);
      } catch (error) {
        console.error("Failed to fetch comparison data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComparisonData();
  }, [stocks, timeframe]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const date = new Date(dataPoint.timestamp);
      
      const dateStr = timeframe === '1D' || timeframe === '1W'
        ? date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      return (
        <div className="bg-theme-surface border border-theme-border p-3 rounded-xl shadow-xl">
          <p className="text-content-primary font-bold mb-2">
            {dateStr}
          </p>
          <div className="space-y-1 text-sm font-medium">
            {payload.map((entry: any, index: number) => {
              const rawPrice = dataPoint[`${entry.dataKey}_raw`];
              const percentChange = entry.value;
              const sign = percentChange > 0 ? '+' : '';
              
              if (rawPrice === undefined || percentChange === undefined) return null;

              return (
                <p key={index} style={{ color: entry.color }}>
                  {entry.name}: <span className="font-bold">₹{rawPrice.toFixed(2)}</span>
                  <span className="ml-2 opacity-80">({sign}{percentChange.toFixed(2)}%)</span>
                </p>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (timeframe === '1D') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const formatYAxis = (tickItem: number) => {
    return `${tickItem > 0 ? '+' : ''}${tickItem.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-theme-surface rounded-3xl p-6 border border-theme-border shadow-surface relative"
    >
      <h2 className="text-xl font-bold text-content-primary mb-4">Performance Comparison ({timeframe})</h2>
      
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-theme-surface/50 backdrop-blur-sm rounded-3xl">
          <div className="text-content-primary font-bold">Loading chart data...</div>
        </div>
      )}

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {stocks.map((stock, index) => {
                const color = colors[index % colors.length];
                return (
                  <linearGradient key={`gradient-${stock.symbol}`} id={`color-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} opacity={0.2} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
              stroke="#9CA3AF"
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              minTickGap={50}
              tickFormatter={formatXAxis}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            <Brush 
              dataKey="timestamp" 
              height={24} 
              stroke="#3B82F6" 
              fill="transparent" 
              travellerWidth={10} 
              tickFormatter={formatXAxis} 
            />
            {stocks.map((stock, index) => (
              <Area
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#color-${stock.symbol})`}
                connectNulls={true}
                isAnimationActive={true}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ComparisonChart;
