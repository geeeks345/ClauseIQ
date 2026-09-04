import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContracts } from '../context/ContractContext';
import { AIChatBox } from '../components/chat/AIChatBox';
import { Bot, FileText, Sparkles, MessageSquare, Plus, Clock } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';

export const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { contracts, fetchContracts } = useContracts();

  const initialContractId = searchParams.get('contractId') || (contracts[0]?._id || 'general');
  const [selectedContractId, setSelectedContractId] = useState(initialContractId);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    const fromUrl = searchParams.get('contractId');
    if (fromUrl) {
      setSelectedContractId(fromUrl);
    } else if (contracts.length > 0 && selectedContractId === 'general') {
      setSelectedContractId(contracts[0]._id);
    }
  }, [searchParams, contracts]);

  const activeContract = contracts.find((c) => c._id === selectedContractId);

  const handleContractChange = (val) => {
    setSelectedContractId(val);
    setSearchParams({ contractId: val });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">AI Legal Assistant</h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Ask questions about legal enforceability, notice periods, non-competes, and liability terms.
        </p>
      </div>

      {/* Two-Column Chat Layout (Section 14: Left Conversation History & Right Chat Window) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context & History */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Document Context
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => handleContractChange('general')}
                className={`w-full text-left p-3 rounded-[12px] text-xs font-semibold transition border ${
                  selectedContractId === 'general'
                    ? 'bg-blue-50 text-[#2563EB] border-blue-200 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-[#475569] border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span className="font-bold">Global Legal Knowledge Base</span>
                </div>
              </button>

              {contracts.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleContractChange(c._id)}
                  className={`w-full text-left p-3 rounded-[12px] text-xs font-semibold transition border ${
                    selectedContractId === c._id
                      ? 'bg-blue-50 text-[#2563EB] border-blue-200 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="line-clamp-1 font-bold">{c.title}</span>
                    <Badge variant={c.riskSummary?.riskLevel?.toLowerCase() || 'neutral'} className="text-[10px] py-0 px-2">
                      {c.riskSummary?.riskLevel || 'Unanalyzed'}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-[#475569] font-normal block mt-1">
                    {c.contractType || 'Contract'}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Chat Box */}
        <div className="lg:col-span-8">
          <AIChatBox
            contractId={selectedContractId}
            contractTitle={activeContract?.title || 'Global Legal Knowledge Base'}
          />
        </div>
      </div>
    </div>
  );
};
