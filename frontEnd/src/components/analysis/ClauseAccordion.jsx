import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Scale,
  Bot,
  Copy,
  Check,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { Card, Badge, Button } from '../common';
import { Link } from 'react-router-dom';

export const RiskScoreHero = ({ analysis, contractTitle }) => {
  if (!analysis) return null;

  const score = analysis.overallRiskScore || 0;
  const level = analysis.riskLevel || 'Low';

  const getScoreTheme = (s) => {
    if (s >= 70) return { bg: 'bg-red-50/50', border: 'border-red-200', text: 'text-[#DC2626]', badge: 'critical' };
    if (s >= 40) return { bg: 'bg-orange-50/50', border: 'border-orange-200', text: 'text-[#EA580C]', badge: 'medium' };
    return { bg: 'bg-green-50/50', border: 'border-green-200', text: 'text-[#16A34A]', badge: 'low' };
  };

  const theme = getScoreTheme(score);

  return (
    <div className={`card-surface p-8 ${theme.bg} ${theme.border} space-y-6 shadow-sm`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
              AI Risk Audit
            </span>
            <Badge variant={theme.badge}>{level} Risk Rating</Badge>
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{contractTitle}</h2>
        </div>

        {/* Circular Gauge Score Container */}
        <div className="flex items-center gap-5 bg-white px-6 py-4 rounded-[16px] border border-[#E2E8F0] shadow-sm flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#475569]">Composite Risk Score</p>
            <span className={`text-3xl font-black ${theme.text}`}>{score}/100</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-xs text-[#475569] space-y-0.5">
            <p><span className="text-red-600 font-bold">{analysis.riskDistribution?.high || 0}</span> High Risks</p>
            <p><span className="text-orange-600 font-bold">{analysis.riskDistribution?.medium || 0}</span> Medium Risks</p>
          </div>
        </div>
      </div>

      {analysis.executiveSummary && (
        <div className="p-4.5 rounded-[16px] bg-white border border-[#E2E8F0] text-xs text-[#0F172A] leading-relaxed space-y-1.5 shadow-sm">
          <span className="font-bold text-[#2563EB] flex items-center gap-1.5 text-xs">
            <Sparkles className="w-4 h-4" /> Executive Legal Summary:
          </span>
          <p className="text-[#475569]">{analysis.executiveSummary}</p>
        </div>
      )}

      {analysis.criticalRedFlags && analysis.criticalRedFlags.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Flagged Critical Irregularities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {analysis.criticalRedFlags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-red-50 p-3 rounded-[12px] border border-red-200 text-red-900">
                <span className="text-red-600 font-bold">•</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ClauseAccordion = ({ clauses = [] }) => {
  const [openIds, setOpenIds] = useState([clauses[0]?.clauseId || '']);
  const [activeFilter, setActiveFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const toggleClause = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredClauses = activeFilter === 'All'
    ? clauses
    : clauses.filter((c) => c.risk.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#475569]">Filter Clauses:</span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-[10px] text-xs font-semibold transition ${
                activeFilter === tab
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-[#475569] hover:bg-slate-100 border border-[#E2E8F0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#475569]">
          Showing <strong>{filteredClauses.length}</strong> of {clauses.length} extracted clauses
        </span>
      </div>

      {/* Accordion Clauses List (Section 13 Clause Card Design) */}
      <div className="space-y-4">
        {filteredClauses.map((clause, idx) => {
          const isOpen = openIds.includes(clause.clauseId);
          return (
            <div
              key={clause.clauseId || idx}
              className="card-surface p-0 overflow-hidden"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleClause(clause.clauseId)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 cursor-pointer transition text-left"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">{clause.title}</h4>
                    <p className="text-[11px] text-[#475569] capitalize">{clause.type} Provision • Page {clause.pageNumber || 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant={clause.risk}>{clause.risk} Risk</Badge>
                  <span className="text-[11px] font-mono text-[#475569] hidden sm:inline-block bg-slate-100 px-2 py-0.5 rounded-[8px]">
                    Confidence: {Math.round((clause.confidenceScore || 0.9) * 100)}%
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Card Body (Section 13 Details) */}
              {isOpen && (
                <div className="p-6 border-t border-[#E2E8F0] bg-slate-50/50 space-y-4 text-xs animate-fade-in">
                  {/* Original Legalese */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">
                        Original Clause Language:
                      </span>
                      <button
                        onClick={() => handleCopy(clause.clauseId, clause.originalText)}
                        className="text-[11px] text-[#475569] hover:text-[#2563EB] flex items-center gap-1 transition"
                      >
                        {copiedId === clause.clauseId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Text
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 rounded-[14px] bg-white border border-[#E2E8F0] font-mono text-[11px] text-[#0F172A] leading-relaxed italic shadow-sm">
                      "{clause.originalText}"
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="p-4 rounded-[14px] bg-blue-50/70 border border-blue-100 space-y-1">
                    <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#2563EB]" /> Plain English Explanation:
                    </span>
                    <p className="text-[#0F172A] leading-relaxed">{clause.plainEnglish}</p>
                  </div>

                  {/* Real World Impact */}
                  {clause.realWorldExample && (
                    <div className="p-4 rounded-[14px] bg-amber-50/70 border border-amber-200 space-y-1">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-600" /> Real-World Liability Scenario:
                      </span>
                      <p className="text-amber-950 leading-relaxed">{clause.realWorldExample}</p>
                    </div>
                  )}

                  {/* Recommendation / Suggested Rewrite */}
                  {clause.recommendation && (
                    <div className="p-4 rounded-[14px] bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4" /> Suggested Rewrite & Negotiation Recommendation:
                      </span>
                      <p className="text-emerald-950 leading-relaxed">{clause.recommendation}</p>
                    </div>
                  )}

                  {/* Legal References (RAG) */}
                  {clause.legalReferences && clause.legalReferences.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                        Statutory Citations & Legal Precedents:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {clause.legalReferences.map((ref, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-[12px] bg-white border border-[#E2E8F0] space-y-1 shadow-sm"
                          >
                            <div className="flex items-center gap-1.5 text-[#2563EB] font-bold text-xs">
                              <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>{ref.statute} ({ref.section})</span>
                            </div>
                            <p className="text-[#475569] text-[11px] leading-relaxed">{ref.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ask AI CTA */}
                  <div className="pt-2 flex justify-end">
                    <Link to={`/chat?clause=${encodeURIComponent(clause.title)}`}>
                      <Button variant="ghost" size="sm" className="text-[#2563EB] hover:text-[#1D4ED8] text-xs">
                        <Bot className="w-3.5 h-3.5 mr-1" /> Ask AI Assistant about this clause →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
