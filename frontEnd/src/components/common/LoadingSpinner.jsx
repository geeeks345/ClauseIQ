import React from 'react';
import { cn } from './Button';

export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex justify-center items-center py-6', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400',
          sizes[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
