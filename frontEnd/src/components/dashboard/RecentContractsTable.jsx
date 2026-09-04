import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Eye, Shield } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const RecentContractsTable = ({ contracts = [] }) => {
  return (
    <Card className="border-slate-800/80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Recent Contracts</h4>
          <p className="text-xs text-slate-500">Latest uploaded & analyzed documents</p>
        </div>
        <Link to="/contracts">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs">
          No contracts uploaded yet. Click "Upload Contract" to begin.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Risk Rating</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {contracts.slice(0, 5).map((contract) => (
                <tr key={contract._id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 pr-3 font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="truncate max-w-[180px] sm:max-w-[260px]">{contract.title}</span>
                  </td>
                  <td className="py-3 text-slate-400">{contract.contractType || 'General'}</td>
                  <td className="py-3">
                    <Badge variant={contract.riskSummary?.riskLevel?.toLowerCase() || 'neutral'}>
                      {contract.riskSummary?.riskLevel || 'Unanalyzed'}
                      {contract.riskSummary?.overallScore ? ` (${contract.riskSummary.overallScore}/100)` : ''}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        contract.status === 'analyzed'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : contract.status === 'processing'
                          ? 'text-cyan-400 bg-cyan-500/10 animate-pulse'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link to={`/analysis/${contract._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Analysis
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
  );
};
