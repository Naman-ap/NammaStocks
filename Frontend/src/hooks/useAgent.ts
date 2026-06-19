import { useState, useCallback } from 'react';

export type AgentMessage = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

export const useAgent = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your AI stock analysis assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMsg: AgentMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      // Create a snapshot of the messages to send to the backend
      setMessages(currentMessages => {
          // This is a little trick to avoid stale state in useCallback without adding it to deps
          // We'll actually do the fetch outside of this state updater, but we need the current messages.
          return currentMessages;
      });
      
      // Wait we have `messages` in deps, so we can just use `messages`.
      const history = messages.map(msg => ({
        role: msg.type === 'bot' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      history.push({
        role: 'user',
        content: content
      });

      const response = await fetch('http://localhost:8000/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: history,
          model: 'llama3.2' // Default model
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMsg: AgentMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("AI Agent Error:", err);
      setError(err.message || 'An error occurred');
      
      const errorMsg: AgentMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error connecting to my local brain. Please ensure the backend and Ollama are running.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    setMessages,
  };
};
