import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-surface ${hover ? 'card-surface-hover cursor-pointer' : ''} p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
