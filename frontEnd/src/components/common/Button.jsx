import React from 'react';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-[14px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm hover:shadow-md focus:ring-[#2563EB]/40 font-semibold',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 focus:ring-slate-300 font-semibold',
    outline:
      'border border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm focus:ring-slate-200',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
    danger:
      'bg-[#DC2626] hover:bg-red-700 text-white shadow-sm focus:ring-red-500/40 font-semibold',
    emerald:
      'bg-[#16A34A] hover:bg-green-700 text-white shadow-sm focus:ring-green-500/40 font-semibold',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-[10px]',
    md: 'h-12 px-5 text-sm gap-2 rounded-[14px]',
    lg: 'h-14 px-7 text-base gap-2.5 rounded-[16px]',
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};
