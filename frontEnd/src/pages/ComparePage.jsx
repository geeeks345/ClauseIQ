import React, { useEffect } from 'react';
import { useContracts } from '../context/ContractContext';
import { ContractComparator } from '../components/compare/ContractComparator';
import { GitCompare } from 'lucide-react';

export const ComparePage = () => {
  const { contracts, fetchContracts } = useContracts();

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
          Compare Contracts & Version Diff
        </h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Upload or select two contract versions to isolate added liabilities, deleted protections, and net risk shift.
        </p>
      </div>

      <ContractComparator contracts={contracts} />
    </div>
  );
};
