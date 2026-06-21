import { useState, useCallback } from 'react';

export type AgentResponse = {
  content: string;
  timestamp: Date;
};

export const useAgent = () => {
  const [latestResponse, setLatestResponse] = useState<AgentResponse | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCommand = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsThinking(true);
    setError(null);
    setLatestResponse(null);

    try {
      // Send a single message to the backend
      const response = await fetch('http://localhost:8000/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          model: 'llama3.2' // Default model
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setLatestResponse({
        content: data.response,
        timestamp: new Date(),
      });
    } catch (err: any) {
      console.error("AI Agent Error:", err);
      setError(err.message || 'An error occurred');
      
      setLatestResponse({
        content: 'Sorry, I encountered an error connecting to my local brain. Please ensure the backend and Ollama are running.',
        timestamp: new Date(),
      });
    } finally {
      setIsThinking(false);
    }
  }, []);

  return {
    latestResponse,
    isThinking,
    error,
    sendCommand,
    clearResponse: () => setLatestResponse(null),
  };
};
