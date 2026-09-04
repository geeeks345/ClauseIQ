import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Card } from '../common/Card';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const RiskBreakdownChart = ({ distribution = { high: 0, medium: 0, low: 0 } }) => {
  const data = {
    labels: ['High / Critical Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [distribution.high || 0, distribution.medium || 0, distribution.low || 0],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: ['#0f172a', '#0f172a', '#0f172a'],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };

  const total = (distribution.high || 0) + (distribution.medium || 0) + (distribution.low || 0);

  return (
    <Card className="flex flex-col h-full border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Risk Severity Distribution</h4>
          <p className="text-xs text-slate-500">Categorized detected clauses</p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          {total} Clauses
        </span>
      </div>
      <div className="relative flex-1 min-h-[200px] flex items-center justify-center">
        {total === 0 ? (
          <p className="text-xs text-slate-500 italic">No clause risk data available yet</p>
        ) : (
          <Doughnut data={data} options={options} />
        )}
      </div>
    </Card>
  );
};
