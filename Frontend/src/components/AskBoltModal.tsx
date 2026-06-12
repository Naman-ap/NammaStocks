import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, Sparkles, MessageCircle, Bot } from 'lucide-react';

const AskBoltModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your AI stock analysis assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Analyze RELIANCE stock performance',
    'Top gainers today',
    'Compare IT sector stocks',
    'Explain P/E ratio',
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: `I understand you're asking about "${message}". Based on current market data and analysis, here's what I found... [This is a demo response]`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
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
            className="fixed bottom-24 right-6 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/50">
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
                className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
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
                      : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm'
                  }`}>
                    {msg.type === 'bot' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-medium text-cyan-400">Agent</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
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
                  <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm">
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
                      className="px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/30">
              <div className="flex items-center space-x-2 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message Agent..."
                  className="flex-1 px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white text-sm placeholder-gray-500 transition-all"
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