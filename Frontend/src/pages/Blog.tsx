import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Tag, 
  Search, 
  Filter,
  Code,
  TrendingUp,
  BookOpen,
  Plus
} from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Building a Stock Screener with React and TypeScript',
      excerpt: 'Learn how to create a powerful stock screening application using modern web technologies...',
      content: `
        // Example: Fetching stock data
        const fetchStockData = async (filters) => {
          const response = await fetch('/api/stocks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filters)
          });
          return response.json();
        };
      `,
      author: 'Rahul Sharma',
      authorAvatar: 'RS',
      publishedAt: '2024-01-15',
      category: 'Tutorial',
      tags: ['React', 'TypeScript', 'Stock Analysis'],
      readTime: '8 min read',
      featured: true,
    },
    {
      id: 2,
      title: 'Understanding Market Volatility Through Data Visualization',
      excerpt: 'Explore how charts and graphs can help interpret market movements and volatility patterns...',
      content: `
        // D3.js example for candlestick chart
        const svg = d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height);
      `,
      author: 'Priya Patel',
      authorAvatar: 'PP',
      publishedAt: '2024-01-12',
      category: 'Analysis',
      tags: ['Data Viz', 'D3.js', 'Market Analysis'],
      readTime: '12 min read',
      featured: false,
    },
    {
      id: 3,
      title: 'API Design for Financial Data Applications',
      excerpt: 'Best practices for designing robust APIs that handle real-time financial data efficiently...',
      content: `
        // Express.js route example
        app.get('/api/stocks/:symbol', async (req, res) => {
          const { symbol } = req.params;
          const data = await getStockData(symbol);
          res.json(data);
        });
      `,
      author: 'Amit Kumar',
      authorAvatar: 'AK',
      publishedAt: '2024-01-10',
      category: 'Backend',
      tags: ['API', 'Node.js', 'Financial Data'],
      readTime: '10 min read',
      featured: false,
    },
    {
      id: 4,
      title: 'Machine Learning for Stock Price Prediction',
      excerpt: 'Implementing ML algorithms to predict stock movements using Python and TensorFlow...',
      content: `
        # Python ML example
        import tensorflow as tf
        from sklearn.preprocessing import MinMaxScaler
        
        model = tf.keras.Sequential([
          tf.keras.layers.LSTM(50, return_sequences=True),
          tf.keras.layers.LSTM(50),
          tf.keras.layers.Dense(1)
        ])
      `,
      author: 'Sneha Reddy',
      authorAvatar: 'SR',
      publishedAt: '2024-01-08',
      category: 'Machine Learning',
      tags: ['Python', 'TensorFlow', 'Prediction'],
      readTime: '15 min read',
      featured: true,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Posts', count: blogPosts.length },
    { id: 'tutorial', label: 'Tutorials', count: 1 },
    { id: 'analysis', label: 'Analysis', count: 1 },
    { id: 'backend', label: 'Backend', count: 1 },
    { id: 'machine-learning', label: 'ML/AI', count: 1 },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Developer Blog
              </h1>
              <p className="text-gray-400 mt-2">Technical insights and tutorials for financial technology</p>
            </div>
            <Link
              to="/blog/new"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all hover:scale-105 mt-4 lg:mt-0"
            >
              <Plus className="w-5 h-5" />
              <span>Write Article</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none text-white placeholder-gray-400"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 border border-gray-600"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Featured Article</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-300 mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{featuredPost.authorAvatar}</span>
                      </div>
                      <span className="text-gray-300">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-gray-400">{featuredPost.readTime}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-600 text-gray-200 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all">
                    Read Article
                  </button>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center space-x-2 mb-3">
                    <Code className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">Code Preview</span>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>{featuredPost.content}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-cyan-500/10 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-medium text-xs">Snippet</span>
                    </div>
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      <code>{post.content.substring(0, 100)}...</code>
                    </pre>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{post.authorAvatar}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{post.author}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors">
                      Read more →
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;