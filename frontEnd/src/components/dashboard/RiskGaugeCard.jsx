import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, FileText, Activity } from 'lucide-react';
import { Card } from '../common/Card';

export const AnalyticsStats = ({ stats, contractsCount, analysesCount }) => {
  const cards = [
    {
      title: 'Total Ingested Contracts',
      value: contractsCount || 0,
      icon: FileText,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      change: '+100% Ingestion Rate',
    },
    {
      title: 'AI Analyses Completed',
      value: analysesCount || 0,
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      change: 'Deep Clause NLP',
    },
    {
      title: 'High Risk Flags',
      value: stats?.highRiskClausesFlagged || 0,
      icon: ShieldAlert,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      change: 'Requires Attention',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="flex items-center justify-between border-slate-800/80">
            <div>
              <p className="text-xs font-medium text-slate-400">{c.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{c.value}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{c.change}</p>
            </div>
            <div className={`p-3 rounded-xl border ${c.bg}`}>
              <Icon className={`w-5 h-5 ${c.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const RiskGaugeCard = ({ overallScore = 0, riskLevel = 'Low' }) => {
  const getColor = (score) => {
    if (score >= 70) return { stroke: '#ef4444', text: 'text-rose-400', label: 'Critical Risk' };
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Moderate Risk' };
    return { stroke: '#10b981', text: 'text-emerald-400', label: 'Low Risk' };
  };

  const status = getColor(overallScore);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center p-6 text-center border-slate-800/80">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">Overall Contract Risk Rating</h4>
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={status.stroke}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-extrabold text-white">{overallScore}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">out of 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 ${status.text}`}>
        {riskLevel} Risk Profile
      </span>
    </Card>
  );
};
