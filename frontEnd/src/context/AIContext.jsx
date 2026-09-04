import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Contract Intelligence Assistant. Ask me anything about risk exposures, termination clauses, non-compete enforceability, or statutory benchmarks.',
      citations: [],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async (contractId) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await api.post(`/ai/analyze/${contractId}`);
      const analysis = res.data.data.analysis;
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      return { success: true, analysis };
    } catch (err) {
      const msg = err.response?.data?.message || 'Analysis failed';
      setError(msg);
      setIsAnalyzing(false);
      return { success: false, error: msg };
    }
  };

  const fetchAnalysis = useCallback(async (contractId) => {
    setIsAnalyzing(true);
    try {
      const res = await api.get(`/ai/analysis/${contractId}`);
      const analysis = res.data.data.analysis;
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      return analysis;
    } catch (err) {
      setIsAnalyzing(false);
      return null;
    }
  }, []);

  const sendChatMessage = async (contractId, question) => {
    // Add user message immediately
    const userMsg = {
      sender: 'user',
      text: question,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await api.post(`/ai/chat/${contractId || 'general'}`, {
        question,
        conversationHistory: history,
      });

      const responseData = res.data.data.chatResponse;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: responseData.answer,
          citations: responseData.citations || [],
          suggestedPrompts: responseData.suggestedPrompts || [],
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsChatLoading(false);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Unable to process query: ${err.response?.data?.message || err.message}`,
          citations: [],
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsChatLoading(false);
    }
  };

  const runComparison = async (contractAId, contractBId) => {
    setIsComparing(true);
    setError(null);
    try {
      const res = await api.post('/ai/compare', { contractAId, contractBId });
      const comp = res.data.data.comparison;
      setComparisonResult(comp);
      setIsComparing(false);
      return { success: true, comparison: comp };
    } catch (err) {
      const msg = err.response?.data?.message || 'Comparison failed';
      setError(msg);
      setIsComparing(false);
      return { success: false, error: msg };
    }
  };

  const resetChat = () => {
    setChatMessages([
      {
        sender: 'ai',
        text: 'Chat history reset. How can I assist you with your contracts today?',
        citations: [],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <AIContext.Provider
      value={{
        currentAnalysis,
        isAnalyzing,
        comparisonResult,
        isComparing,
        chatMessages,
        isChatLoading,
        error,
        runAnalysis,
        fetchAnalysis,
        sendChatMessage,
        runComparison,
        resetChat,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
