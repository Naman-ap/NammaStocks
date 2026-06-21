import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Zap, Bot, X, TrendingUp, Clock, Scale } from 'lucide-react';
import { useAgent } from '../hooks/useAgent';
import { useNavigate } from 'react-router-dom';

const ProposalWidget = ({ actionType, payload, onNavigate }: { actionType: string, payload: string, onNavigate: () => void }) => {
  const [state, setState] = useState<'pending' | 'cancelled'>('pending');

  if (state === 'cancelled') return null;

  const getTitle = () => {
    if (actionType === 'NAVIGATE_COMPARE') return `Compare Stocks (${payload})`;
    if (actionType === 'NAVIGATE_TIMETRAVEL') return `Time-Travel Backtest (${payload})`;
    if (actionType === 'NAVIGATE_REBALANCE') return `Rebalance Portfolio`;
    return `Execute Action`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="mt-3 bg-theme-canvas border border-trade-action/30 rounded-xl p-3.5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,184,217,0.15)] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600" />
      <p className="text-[13px] text-content-primary font-semibold flex items-center gap-2 pl-1 tracking-tight">
        <Zap className="w-3.5 h-3.5 text-trade-action" />
        {getTitle()}
      </p>
      <div className="flex gap-2 pl-1">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigate} 
          className="flex-1 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-xs font-semibold text-white shadow-sm shadow-trade-action/20 transition-colors"
        >
          Execute
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState('cancelled')} 
          className="flex-1 py-1.5 bg-theme-surface border border-theme-border rounded-lg text-xs font-medium text-content-secondary transition-colors"
        >
          Dismiss
        </motion.button>
      </div>
    </motion.div>
  );
};

interface AskBoltModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  { icon: TrendingUp, text: "Compare AAPL vs MSFT" },
  { icon: Clock, text: "Time travel back to 2020" },
  { icon: Scale, text: "Rebalance my portfolio" },
];

const AskBoltModal = ({ isOpen, onClose }: AskBoltModalProps) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const { latestResponse, isThinking, error, sendCommand, clearResponse } = useAgent();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || message;
    if (!textToSend.trim() || isThinking) return;
    
    if (!customMessage) setMessage('');
    await sendCommand(textToSend);
  };

  const handleClear = () => {
    setMessage('');
    clearResponse();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 340, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 35 }}
          className="border-l border-theme-border bg-theme-surface flex flex-col h-full shrink-0 shadow-[-12px_0_40px_rgba(0,0,0,0.08)] z-40 relative overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-canvas shrink-0 min-w-[340px]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                <Sparkles className="w-4 h-4 text-trade-action" />
              </div>
              <span className="font-semibold text-content-primary text-[13px] tracking-wide">Agent Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {(latestResponse || error) && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleClear} 
                    className="text-[11px] font-medium text-content-secondary hover:text-content-primary transition-colors px-2 py-1 rounded-md hover:bg-theme-surface"
                  >
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
              <button 
                onClick={onClose} 
                className="p-1.5 text-content-secondary hover:text-content-primary hover:bg-theme-border rounded-lg transition-colors border border-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-thin min-w-[340px] bg-theme-surface">
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 text-content-secondary text-[13px] bg-theme-canvas p-3 rounded-xl border border-theme-border/50 shadow-sm w-fit"
              >
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite]" />
                  <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite_0.15s]" />
                  <div className="w-1.5 h-1.5 bg-trade-action rounded-full animate-[bounce_1s_infinite_0.3s]" />
                </div>
                <span className="font-medium tracking-tight">Agent is analyzing...</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-trade-loss text-[13px] flex items-start gap-2.5 bg-trade-loss/10 p-3.5 rounded-xl border border-trade-loss/20 shadow-sm"
              >
                <X className="w-4 h-4 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed font-medium">{error}</span>
              </motion.div>
            )}

            {latestResponse && !isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex flex-col gap-3"
              >
                <div className="bg-theme-canvas border border-theme-border p-4 rounded-2xl shadow-sm rounded-tl-sm relative">
                  <p className="text-[13px] text-content-primary leading-relaxed tracking-tight">
                    {latestResponse.content.replace(/\[(ACTION|PROPOSAL):.*?\]/, '')}
                  </p>
                </div>

                {latestResponse.content.includes('[PROPOSAL:') && (
                  <ProposalWidget 
                    actionType={latestResponse.content.match(/\[PROPOSAL:([^:]+):/)?.[1] || ''}
                    payload={latestResponse.content.match(/\[PROPOSAL:[^:]+:(.*?)\]/)?.[1] || ''}
                    onNavigate={() => {
                      const action = latestResponse.content.match(/\[PROPOSAL:([^:]+):/)?.[1];
                      const payload = latestResponse.content.match(/\[PROPOSAL:[^:]+:(.*?)\]/)?.[1];
                      if (action === 'NAVIGATE_COMPARE') {
                        navigate(`/screener?drive=true&target=compare&symbols=${payload}`);
                      } else if (action === 'NAVIGATE_TIMETRAVEL') {
                        navigate(`/time-travel?drive=true&symbols=${payload}`);
                      } else if (action === 'NAVIGATE_REBALANCE') {
                        navigate(`/portfolio/rebalance?drive=true`);
                      }
                    }}
                  />
                )}
              </motion.div>
            )}
            
            {!latestResponse && !isThinking && !error && (
               <motion.div 
                 initial={{ opacity: 0, filter: "blur(4px)" }}
                 animate={{ opacity: 1, filter: "blur(0px)" }}
                 transition={{ delay: 0.1, duration: 0.4 }}
                 className="h-full flex flex-col justify-center py-8 min-w-[340px] pr-8"
               >
                 <div className="w-12 h-12 bg-gradient-to-br from-theme-canvas to-theme-surface rounded-2xl flex items-center justify-center mb-5 border border-theme-border shadow-sm ring-1 ring-white/5">
                   <Bot className="w-6 h-6 text-trade-action drop-shadow-[0_0_8px_rgba(0,184,217,0.5)]" />
                 </div>
                 <h3 className="text-[15px] font-semibold text-content-primary mb-1.5 tracking-tight">How can I help?</h3>
                 <p className="text-[13px] text-content-secondary leading-relaxed mb-6 max-w-[260px]">
                   I can analyze markets, execute tasks, and guide you through NammaStocks. Try asking me to:
                 </p>
                 
                 <div className="flex flex-col gap-2 w-full max-w-[280px]">
                   {SUGGESTIONS.map((suggestion, idx) => (
                     <motion.button
                       key={idx}
                       whileHover={{ scale: 1.02, x: 4 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => handleSendMessage(suggestion.text)}
                       className="flex items-center gap-3 p-3 text-left bg-theme-canvas hover:bg-theme-surface border border-theme-border hover:border-trade-action/50 rounded-xl transition-colors group shadow-sm"
                     >
                       <div className="p-1.5 bg-theme-surface group-hover:bg-trade-action/10 rounded-md transition-colors">
                         <suggestion.icon className="w-3.5 h-3.5 text-content-secondary group-hover:text-trade-action transition-colors" />
                       </div>
                       <span className="text-[12px] font-medium text-content-primary group-hover:text-trade-action transition-colors tracking-tight">
                         {suggestion.text}
                       </span>
                     </motion.button>
                   ))}
                 </div>
               </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-theme-border bg-theme-canvas min-w-[340px] shadow-[0_-4px_24px_rgba(0,0,0,0.05)] z-10">
            <div className="flex items-end space-x-2 bg-theme-surface border border-theme-border rounded-xl p-2.5 focus-within:border-trade-action/50 focus-within:ring-2 focus-within:ring-trade-action/20 shadow-inner transition-all group">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask the Agent..."
                className="flex-1 bg-transparent border-none text-content-primary text-[13px] p-1.5 resize-none max-h-32 min-h-[40px] focus:ring-0 focus:outline-none placeholder:text-content-secondary/60 scrollbar-thin tracking-tight"
                disabled={isThinking}
                rows={1}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={!message.trim() || isThinking}
                className="p-2 mb-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-cyan-500/20 shrink-0"
              >
                <Send className="w-4 h-4 translate-x-px" />
              </motion.button>
            </div>
            <div className="flex justify-between items-center mt-3 px-1.5 text-[10px] text-content-secondary/80 font-medium tracking-wide uppercase">
              <p>Enter to send</p>
              <p>Shift+Enter for newline</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AskBoltModal;