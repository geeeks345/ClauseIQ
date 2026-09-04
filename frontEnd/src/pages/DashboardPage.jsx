import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  ShieldAlert,
  Sparkles,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bot,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useContracts } from '../context/ContractContext';
import { Card, Badge, Button } from '../components/common';
import { RiskBreakdownChart } from '../components/dashboard/RiskBreakdownChart';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { contracts, fetchContracts } = useContracts();

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const analyzedContracts = contracts.filter((c) => c.status === 'analyzed');
  const highRiskTotal = analyzedContracts.reduce((acc, c) => acc + (c.riskSummary?.highRiskCount || 0), 0);
  const medRiskTotal = analyzedContracts.reduce((acc, c) => acc + (c.riskSummary?.mediumRiskCount || 0), 0);
  const lowRiskTotal = analyzedContracts.reduce((acc, c) => acc + (c.riskSummary?.lowRiskCount || 0), 0);

  const avgScore = analyzedContracts.length > 0
    ? Math.round(analyzedContracts.reduce((acc, c) => acc + (c.riskSummary?.overallScore || 0), 0) / analyzedContracts.length)
    : 45;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* 1. WELCOME CARD */}
      <div className="card-surface p-8 bg-gradient-to-r from-blue-50/70 via-white to-white border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
            <Sparkles className="w-4 h-4" /> Workspace Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Welcome back, {user?.name || 'Reviewer'}
          </h1>
          <p className="text-xs text-[#475569]">
            {user?.company || 'Enterprise Team'} • Monitoring {contracts.length} contracts with automated risk detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/upload">
            <Button variant="primary" size="md">
              <UploadCloud className="w-4 h-4 mr-1.5" /> Upload Contract
            </Button>
          </Link>
          <Link to="/chat">
            <Button variant="outline" size="md">
              <Bot className="w-4 h-4 mr-1.5 text-[#2563EB]" /> AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569]">Total Contracts</span>
            <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0F172A] mt-1">{contracts.length}</h3>
          <p className="text-xs text-[#16A34A] font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Ingested & Reviewed
          </p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569]">High Risk Contracts</span>
            <div className="w-8 h-8 rounded-[10px] bg-red-50 text-[#DC2626] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#DC2626] mt-1">{highRiskTotal}</h3>
          <p className="text-xs text-red-600 font-semibold">Critical Flags Surfaced</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569]">Analyses Completed</span>
            <div className="w-8 h-8 rounded-[10px] bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0F172A] mt-1">{analyzedContracts.length}</h3>
          <p className="text-xs text-[#475569]">Verified & Explained</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#475569]">Reports Generated</span>
            <div className="w-8 h-8 rounded-[10px] bg-emerald-50 text-[#16A34A] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0F172A] mt-1">{analyzedContracts.length}</h3>
          <p className="text-xs text-[#16A34A] font-semibold">Audits Ready to Download</p>
        </Card>
      </div>

      {/* 3. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center text-center p-8">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">
            Average Portfolio Risk Score
          </span>
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="62" stroke="#E2E8F0" strokeWidth="12" fill="transparent" />
              <circle
                cx="80"
                cy="80"
                r="62"
                stroke={avgScore >= 70 ? '#DC2626' : avgScore >= 40 ? '#EA580C' : '#16A34A'}
                strokeWidth="12"
                strokeDasharray="390"
                strokeDashoffset={390 - (avgScore / 100) * 390}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#0F172A]">{avgScore}</span>
              <span className="text-[10px] uppercase font-bold text-[#475569]">Score / 100</span>
            </div>
          </div>
          <Badge variant={avgScore >= 70 ? 'high' : avgScore >= 40 ? 'medium' : 'low'}>
            {avgScore >= 70 ? 'High Risk Exposure' : avgScore >= 40 ? 'Moderate Exposure' : 'Low / Compliant'}
          </Badge>
          <p className="text-xs text-[#475569] mt-3 max-w-xs">
            Based on automated clause review and safety benchmarks.
          </p>
        </Card>

        <div className="lg:col-span-2">
          <RiskBreakdownChart
            distribution={{
              high: highRiskTotal,
              medium: medRiskTotal,
              low: lowRiskTotal,
            }}
          />
        </div>
      </div>

      {/* 4. RECENT CONTRACTS TABLE */}
      <Card className="space-y-4 p-0 overflow-hidden">
        <div className="p-6 pb-2 flex items-center justify-between border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Recent Contracts</h3>
            <p className="text-xs text-[#475569]">Latest agreements reviewed in your workspace</p>
          </div>
          <Link to="/contracts">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-12 text-[#475569] text-xs">
            No contracts found. Click "Upload Contract" to start reviewing agreements.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-[#475569] font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Contract</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Risk Rating</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {contracts.slice(0, 5).map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 pl-6 font-semibold text-[#0F172A]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-[#2563EB] flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="line-clamp-1">{c.title}</p>
                          <p className="text-[11px] text-[#475569] font-normal">{c.originalName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#475569]">{c.contractType || 'General'}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={c.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                        {c.riskSummary?.riskLevel || 'Unanalyzed'}
                        {c.riskSummary?.overallScore ? ` (${c.riskSummary.overallScore}/100)` : ''}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#475569]">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <Link to={`/analysis/${c._id}`}>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
