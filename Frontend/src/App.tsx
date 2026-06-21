import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Screener from './pages/Screener';
import ScreenerCompare from './pages/ScreenerCompare';
import StockDetail from './pages/StockDetail';
import Blog from './pages/Blog';
import ArticleForm from './pages/ArticleForm';
import TextileInsights from './pages/TextileInsights';
import CommoditiesInsights from './pages/CommoditiesInsights';
import News from './pages/News';
import AskBoltModal from './components/AskBoltModal';

import TimeTravel from './pages/TimeTravel';
import PortfolioRebalance from './pages/PortfolioRebalance';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth/callback';
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  return (
    <div className="h-screen bg-theme-canvas text-content-primary flex overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {!isAuthPage && <Navbar onToggleAgent={() => setIsAgentOpen(prev => !prev)} isAgentOpen={isAgentOpen} />}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/screener" element={<Screener />} />
            <Route path="/screener/compare" element={<ScreenerCompare />} />
            <Route path="/portfolio/rebalance" element={<PortfolioRebalance />} />
            <Route path="/time-travel" element={<TimeTravel />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/commodities-insights" element={<CommoditiesInsights />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/new" element={<ArticleForm />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
      </div>
      
      {/* Agent Right Sidebar */}
      {!isAuthPage && <AskBoltModal isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />}
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#111827',
            border: '1px solid #E5E7EB',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;