import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  Search, 
  BookOpen, 
  Menu, 
  X,
  TrendingUp,
  Bot,
  Newspaper
} from 'lucide-react';

interface NavbarProps {
  onToggleAgent?: () => void;
  isAgentOpen?: boolean;
}

const Navbar = ({ onToggleAgent, isAgentOpen }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/screener', icon: Search, label: 'Screener' },
    { path: '/commodities-insights', icon: TrendingUp, label: 'Commodities' },
    { path: '/blog', icon: BookOpen, label: 'Blog' },
    { path: '/news', icon: Newspaper, label: 'News' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-theme-surface/90 border-b border-theme-border sticky top-0 z-50 backdrop-blur-2xl shadow-surface shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/NammaStockLogo.png" 
                alt="Namma Stocks" 
                className="h-14 w-auto object-contain mix-blend-multiply" 
              />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500/90 to-blue-600/90 bg-clip-text text-transparent drop-shadow-sm">
             Namma Stocks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium tracking-wide ${
                  isActive(item.path) 
                    ? 'text-trade-action bg-blue-50 border border-blue-200 shadow-sm' 
                    : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="w-px h-6 bg-theme-border mx-2" />
            
            <button 
              onClick={onToggleAgent}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium tracking-wide border ${
                isAgentOpen 
                  ? 'text-white bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent shadow-sm' 
                  : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas border-transparent'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Agent</span>
              {!isAgentOpen && (
                 <span className="hidden lg:flex items-center gap-1 bg-theme-canvas border border-theme-border px-1.5 py-0.5 rounded text-[10px] ml-1">
                   <span className="font-mono">⌘</span>K
                 </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={onToggleAgent}
              className={`p-2 rounded-lg transition-colors ${isAgentOpen ? 'text-trade-action bg-blue-50' : 'text-content-secondary'}`}
            >
              <Bot className="w-6 h-6" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-theme-canvas transition-colors text-content-secondary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-theme-border overflow-hidden"
            >
              <div className="flex flex-col py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive(item.path) 
                        ? 'text-trade-action bg-blue-50 border border-blue-200' 
                        : 'text-content-secondary hover:text-content-primary hover:bg-theme-canvas border border-transparent'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;