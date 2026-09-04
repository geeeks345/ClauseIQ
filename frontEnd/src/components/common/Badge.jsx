import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    high: 'bg-red-50 text-[#DC2626] border border-red-200 font-semibold',
    critical: 'bg-red-50 text-[#DC2626] border border-red-200 font-bold',
    medium: 'bg-orange-50 text-[#EA580C] border border-orange-200 font-semibold',
    low: 'bg-green-50 text-[#16A34A] border border-green-200 font-semibold',
    info: 'bg-sky-50 text-[#0EA5E9] border border-sky-200 font-medium',
    success: 'bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
  };

  const selected = variants[variant.toLowerCase()] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs transition-colors ${selected} ${className}`}
    >
      {children}
    </span>
  );
};
