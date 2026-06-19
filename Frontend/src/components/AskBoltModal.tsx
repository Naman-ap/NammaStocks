import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, Sparkles, MessageCircle, Bot } from 'lucide-react';
import { useAgent } from '../hooks/useAgent';
import { useNavigate } from 'react-router-dom';

const ProposalWidget = ({ symbols, onNavigate }: { symbols: string, onNavigate: () => void }) => {
  const [state, setState] = useState<'pending' | 'cancelled'>('pending');

  if (state === 'cancelled') {
    return (
      <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
        <p className="text-xs text-red-400 font-medium">Action Cancelled</p>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3 shadow-lg shadow-black/20">
      <p className="text-xs text-gray-300 font-medium flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-cyan-400" />
        Proposed Action: <span className="text-cyan-400">Compare Stocks ({symbols})</span>
      </p>
      <div className="flex gap-2">
        <button onClick={onNavigate} className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95">
          Execute
        </button>
        <button onClick={() => setState('cancelled')} className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95">
          Cancel
        </button>
      </div>
    </div>
  );
};

const AskBoltModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { messages, isTyping, error, sendMessage } = useAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestedPrompts = [
    'Analyze RELIANCE stock performance',
    'Top gainers today',
    'Compare IT sector stocks',
    'Explain P/E ratio',
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;
    
    const currentMessage = message;
    setMessage('');
    await sendMessage(currentMessage);
  };

  const handlePromptClick = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 shadow-xl">
            Ask AI Agent
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 bg-[#08090c]/80 backdrop-blur-2xl rounded-3xl border border-white/10 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Ask Agent</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-br-sm'
                      : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-sm backdrop-blur-md'
                  }`}>
                    {msg.type === 'bot' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-medium text-cyan-400">Agent</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content.replace(/\[(ACTION|PROPOSAL):.*?\]/, '')}</p>
                    
                    {msg.type === 'bot' && msg.content.includes('[PROPOSAL:NAVIGATE_COMPARE:') && (
                      <ProposalWidget 
                        symbols={msg.content.match(/\[PROPOSAL:NAVIGATE_COMPARE:(.*?)\]/)?.[1] || ''}
                        onNavigate={() => {
                          const symbols = msg.content.match(/\[PROPOSAL:NAVIGATE_COMPARE:(.*?)\]/)?.[1];
                          if (symbols) {
                            setIsOpen(false);
                            navigate(`/screener?drive=true&target=compare&symbols=${symbols}`);
                          }
                        }}
                      />
                    )}
                    
                    <p className={`text-[10px] mt-2 ${msg.type === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm backdrop-blur-md">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-medium text-cyan-400">Agent</span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-2 h-4">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <p className="text-xs font-medium text-gray-400 mb-2 px-1">Suggested for you</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center space-x-2 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message Agent..."
                  className="flex-1 px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500 focus:bg-white/10 focus:outline-none text-white text-sm placeholder-gray-500 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isTyping}
                  className="absolute right-2 p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-2">
                Agent can make mistakes. Consider verifying important information.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskBoltModal;