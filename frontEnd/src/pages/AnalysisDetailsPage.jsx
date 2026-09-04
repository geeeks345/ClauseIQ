import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  FileDown,
  Clock,
  Layers,
  BookOpen,
  Scale,
  History,
} from 'lucide-react';
import { useContracts } from '../context/ContractContext';
import { useAI } from '../context/AIContext';
import { RiskScoreHero, ClauseAccordion } from '../components/analysis/ClauseAccordion';
import { Card, Badge, Button, LoadingSpinner } from '../components/common';
import api from '../services/api';

export const AnalysisDetailsPage = () => {
  const { id } = useParams();
  const { selectedContract, getContractById, loading: contractLoading } = useContracts();
  const { currentAnalysis, isAnalyzing, runAnalysis, fetchAnalysis } = useAI();
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'clauses' | 'ai-explanation' | 'references' | 'history'

  useEffect(() => {
    if (id) {
      getContractById(id);
      fetchAnalysis(id);
    }
  }, [id, getContractById, fetchAnalysis]);

  const handleTriggerAnalysis = () => {
    if (id) {
      runAnalysis(id);
    }
  };

  const downloadPdf = () => {
    const token = localStorage.getItem('clauseiq_token');
    window.open(`${api.defaults.baseURL}/reports/pdf/${id}?token=${token}`, '_blank');
  };

  const downloadJson = () => {
    const token = localStorage.getItem('clauseiq_token');
    window.open(`${api.defaults.baseURL}/reports/json/${id}?token=${token}`, '_blank');
  };

  if (contractLoading && !selectedContract) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Link to="/contracts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Contracts
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
                {selectedContract?.title || 'Contract Analysis'}
              </h1>
              <Badge variant={selectedContract?.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                {selectedContract?.riskSummary?.riskLevel || 'Unanalyzed'}
              </Badge>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              {selectedContract?.originalName} • {selectedContract?.wordCount || 0} words • {selectedContract?.pageCount || 1} pages
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentAnalysis && (
            <>
              <Button variant="outline" size="sm" onClick={downloadPdf}>
                <FileDown className="w-4 h-4 mr-1 text-[#2563EB]" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={downloadJson}>
                <Download className="w-4 h-4 mr-1 text-[#16A34A]" /> Export Summary
              </Button>
            </>
          )}

          <Link to={`/chat?contractId=${id}`}>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1 text-[#2563EB]" /> AI Assistant
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleTriggerAnalysis}
            disabled={isAnalyzing}
            isLoading={isAnalyzing}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {currentAnalysis ? 'Re-Analyze' : 'Start AI Analysis'}
          </Button>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        {[
          { id: 'summary', label: 'Executive Summary', icon: Sparkles },
          { id: 'clauses', label: 'Extracted Clauses', icon: Layers },
          { id: 'ai-explanation', label: 'Plain English', icon: BookOpen },
          { id: 'references', label: 'Legal References', icon: Scale },
          { id: 'history', label: 'Audit History', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition ${
                isSelected
                  ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                  : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {isAnalyzing ? (
        <Card className="text-center py-20 space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#2563EB] animate-spin" />
            <Sparkles className="w-6 h-6 text-[#2563EB] absolute" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">Reviewing Document Clauses & Risks</h3>
          <p className="text-xs text-[#475569] max-w-md mx-auto">
            Reading contract text, analyzing liability terms, and preparing plain-language recommendations...
          </p>
        </Card>
      ) : currentAnalysis ? (
        <div className="space-y-6 animate-fade-in">
          {activeTab === 'summary' && (
            <>
              <RiskScoreHero
                analysis={currentAnalysis}
                contractTitle={selectedContract?.title || 'Contract'}
              />
              <ClauseAccordion clauses={currentAnalysis.clauses || []} />
            </>
          )}

          {activeTab === 'clauses' && (
            <ClauseAccordion clauses={currentAnalysis.clauses || []} />
          )}

          {activeTab === 'ai-explanation' && (
            <div className="space-y-4">
              {(currentAnalysis.clauses || []).map((c, i) => (
                <Card key={i} className="p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-[#0F172A]">{c.title}</h4>
                    <Badge variant={c.risk}>{c.risk} Risk</Badge>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed bg-blue-50/60 p-4 rounded-[12px] border border-blue-100">
                    {c.plainEnglish}
                  </p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentAnalysis.clauses || [])
                .flatMap((c) => c.legalReferences || [])
                .map((ref, idx) => (
                  <Card key={idx} className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs">
                      <Scale className="w-4 h-4" />
                      <span>{ref.statute} ({ref.section})</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">{ref.summary}</p>
                  </Card>
                ))}
            </div>
          )}

          {activeTab === 'history' && (
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Document Timeline</h3>
              <div className="space-y-3 text-xs text-[#475569]">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>Ingested: {new Date(selectedContract?.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#16A34A]" />
                  <span>AI Review Completed: {new Date(currentAnalysis.analyzedAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="text-center py-20 space-y-4">
          <FileText className="w-12 h-12 text-[#2563EB] mx-auto opacity-75" />
          <h3 className="text-base font-bold text-[#0F172A]">Contract Ready for Review</h3>
          <p className="text-xs text-[#475569] max-w-md mx-auto">
            Click "Start AI Analysis" to identify clauses, detect one-sided liabilities, and view recommendations.
          </p>
          <Button variant="primary" size="md" onClick={handleTriggerAnalysis}>
            <Sparkles className="w-4 h-4 mr-1.5" /> Start AI Analysis
          </Button>
        </Card>
      )}
    </div>
  );
};
