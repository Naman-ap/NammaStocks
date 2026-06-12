import React from 'react';
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
import AskBoltModal from './components/AskBoltModal';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth/callback';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/screener" element={<Screener />} />
        <Route path="/screener/compare" element={<ScreenerCompare />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/commodities-insights" element={<CommoditiesInsights />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/new" element={<ArticleForm />} />
      </Routes>
      {!isAuthPage && <AskBoltModal />}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151'
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