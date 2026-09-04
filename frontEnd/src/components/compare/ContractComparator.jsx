import React, { useState } from 'react';
import { PlusCircle, MinusCircle, RefreshCw, ArrowRightLeft, Scale } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { Card, Badge, Button } from '../common';

export const ContractComparator = ({ contracts = [] }) => {
  const { comparisonResult, isComparing, runComparison } = useAI();

  const [contractAId, setContractAId] = useState(contracts[0]?._id || '');
  const [contractBId, setContractBId] = useState(contracts[1]?._id || '');

  const handleCompare = () => {
    if (!contractAId || !contractBId) return;
    runComparison(contractAId, contractBId);
  };

  return (
    <div className="space-y-6">
      {/* Two-Column Selection (Section 15) */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Contract Version A (Baseline Standard)
            </label>
            <select
              value={contractAId}
              onChange={(e) => setContractAId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs enterprise-input"
            >
              <option value="">Select Baseline Document</option>
              {contracts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.riskSummary?.riskLevel || 'Unanalyzed'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Contract Version B (Counterparty / Revised Draft)
            </label>
            <select
              value={contractBId}
              onChange={(e) => setContractBId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs enterprise-input"
            >
              <option value="">Select Counterparty Draft</option>
              {contracts.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.riskSummary?.riskLevel || 'Unanalyzed'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleCompare}
            disabled={!contractAId || !contractBId || contractAId === contractBId || isComparing}
            isLoading={isComparing}
          >
            <ArrowRightLeft className="w-4 h-4 mr-1.5" />
            {isComparing ? 'Comparing Clauses...' : 'Run Contract Comparison'}
          </Button>
        </div>

        {contractAId && contractBId && contractAId === contractBId && (
          <p className="text-xs text-amber-600 mt-2 font-medium">
            Please select two different contracts to compare differences.
          </p>
        )}
      </Card>

      {/* Split Comparison View & Risk Difference Summary (Section 15) */}
      {comparisonResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6 bg-gradient-to-r from-blue-50 via-white to-white border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  Risk Difference Summary
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                  {comparisonResult.titleA} vs {comparisonResult.titleB}
                </h3>
                <p className="text-xs text-[#475569] mt-1 max-w-2xl">{comparisonResult.summary}</p>
              </div>

              <div className="bg-white px-5 py-3 rounded-[16px] border border-[#E2E8F0] text-center shadow-sm flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-[#475569] block">Net Risk Delta</span>
                <span
                  className={`text-2xl font-black ${
                    comparisonResult.riskDelta > 0
                      ? 'text-[#DC2626]'
                      : comparisonResult.riskDelta < 0
                      ? 'text-[#16A34A]'
                      : 'text-[#0F172A]'
                  }`}
                >
                  {comparisonResult.riskDelta > 0 ? `+${comparisonResult.riskDelta}%` : `${comparisonResult.riskDelta}%`}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Split Highlights: Added, Removed, Modified */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="flex items-center gap-2 text-[#16A34A] font-bold text-sm">
                <PlusCircle className="w-4 h-4" /> Added Provisions ({comparisonResult.addedClauses?.length || 0})
              </div>
              <div className="space-y-2.5 text-xs">
                {comparisonResult.addedClauses?.length === 0 ? (
                  <p className="text-[#475569] italic">No new clauses added in Version B.</p>
                ) : (
                  comparisonResult.addedClauses.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-[12px] bg-white border border-emerald-200 space-y-1 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0F172A]">{c.title}</span>
                        <Badge variant={c.risk}>{c.risk}</Badge>
                      </div>
                      <p className="text-[#475569] text-[11px] leading-relaxed">{c.description}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-red-200 bg-red-50/30 space-y-3">
              <div className="flex items-center gap-2 text-[#DC2626] font-bold text-sm">
                <MinusCircle className="w-4 h-4" /> Removed Provisions ({comparisonResult.removedClauses?.length || 0})
              </div>
              <div className="space-y-2.5 text-xs">
                {comparisonResult.removedClauses?.length === 0 ? (
                  <p className="text-[#475569] italic">No clauses removed from Version A.</p>
                ) : (
                  comparisonResult.removedClauses.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-[12px] bg-white border border-red-200 space-y-1 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0F172A]">{c.title}</span>
                        <Badge variant={c.risk}>{c.risk}</Badge>
                      </div>
                      <p className="text-[#475569] text-[11px] leading-relaxed">{c.description}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center gap-2 text-[#EA580C] font-bold text-sm">
                <RefreshCw className="w-4 h-4" /> Modified Terms ({comparisonResult.modifiedClauses?.length || 0})
              </div>
              <div className="space-y-2.5 text-xs">
                {comparisonResult.modifiedClauses?.length === 0 ? (
                  <p className="text-[#475569] italic">No modified clauses detected.</p>
                ) : (
                  comparisonResult.modifiedClauses.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-[12px] bg-white border border-amber-200 space-y-1.5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0F172A]">{c.title}</span>
                        <Badge variant="medium">{c.changeType}</Badge>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <p className="text-[#475569]"><span className="text-[#0F172A] font-semibold">Baseline:</span> {c.contractAValue}</p>
                        <p className="text-[#0F172A]"><span className="text-[#2563EB] font-semibold">Counterparty:</span> {c.contractBValue}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
