import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Scale, RefreshCw, Lightbulb } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { Button, Card } from '../common';

export const AIChatBox = ({ contractId = 'general', contractTitle = 'Contract' }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { chatMessages, isChatLoading, sendChatMessage, resetChat } = useAI();

  const suggestedQuestions = [
    'Are there any non-compete or restrictive terms?',
    'Can the company terminate without notice or severance?',
    'What is the required notice period for termination?',
    'How does the auto-renewal clause work?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isChatLoading) return;

    sendChatMessage(contractId, query);
    setInput('');
  };

  return (
    <Card className="flex flex-col h-[650px] p-0 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0F172A]">AI Legal Assistant</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                Verified Assistant
              </span>
            </div>
            <p className="text-[11px] text-[#475569]">
              Grounded in: <strong className="text-[#0F172A]">{contractTitle}</strong>
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetChat}
          title="Reset Conversation"
        >
          <RefreshCw className="w-4 h-4 text-[#475569]" />
        </Button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-[18px] p-4 leading-relaxed space-y-2.5 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-[#2563EB] text-white font-medium rounded-tr-none'
                  : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-none'
              }`}
            >
              <p className="text-xs leading-relaxed">{msg.text}</p>

              {/* Citations Block */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">
                    Legal References:
                  </span>
                  {msg.citations.map((cite, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[10px] text-[#475569] bg-slate-50 px-2.5 py-1.5 rounded-[8px] border border-[#E2E8F0]"
                    >
                      <Scale className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                      <span>{cite}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-[10px] bg-slate-100 text-[#475569] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isChatLoading && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-[16px] bg-white border border-[#E2E8F0] text-[#475569] flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span className="text-xs">AI Assistant is reviewing the contract clauses...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-[#E2E8F0] overflow-x-auto flex gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 px-3 py-1.5 rounded-[10px] bg-white hover:bg-slate-100 text-[#475569] text-[11px] font-medium transition border border-[#E2E8F0] flex items-center gap-1.5 shadow-sm"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-[#E2E8F0] bg-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this contract or legal enforceability..."
          className="flex-1 px-4 py-2.5 rounded-[12px] enterprise-input text-xs"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="px-5 h-10"
          disabled={!input.trim() || isChatLoading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};
