import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'full', // 'full' | 'image' | 'icon' | 'with-tagline'
  showTagline = false,
  className = '',
  to = '/',
}) => {
  const sizeClasses = {
    sm: { img: 'h-7', text: 'text-lg', icon: 'w-7 h-7' },
    md: { img: 'h-9', text: 'text-xl', icon: 'w-9 h-9' },
    lg: { img: 'h-12', text: 'text-2xl', icon: 'w-12 h-12' },
    xl: { img: 'h-16', text: 'text-3xl', icon: 'w-16 h-16' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  const content = (
    <div className={`flex flex-col ${className}`}>
      {variant === 'image' ? (
        <img
          src="/logo.png"
          alt="ClauseIQ - Understand Every Clause. Sign with Confidence."
          className={`${currentSize.img} object-contain`}
        />
      ) : (
        <div className="flex items-center gap-2.5 group">
          {/* Logo SVG Shield + Document + Magnifying Glass + AI Sparkles Emblem */}
          <div className="relative flex-shrink-0">
            <svg
              className={`${currentSize.icon} transform transition-transform group-hover:scale-105`}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="iqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Outer Shield Outline */}
              <path
                d="M50 8 L88 24 C88 58 50 88 50 88 C50 88 12 58 12 24 Z"
                stroke="url(#shieldGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Inner Contract Document */}
              <rect
                x="28"
                y="26"
                width="34"
                height="44"
                rx="4"
                fill="#FFFFFF"
                stroke="#3B82F6"
                strokeWidth="3.5"
              />
              {/* Document Fold */}
              <path d="M50 26 L62 38 L50 38 Z" fill="#93C5FD" />
              {/* Text Lines */}
              <line x1="34" y1="36" x2="46" y2="36" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="44" x2="56" y2="44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="34" y1="52" x2="54" y2="52" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="34" y1="60" x2="48" y2="60" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Magnifying Glass with Checkmark */}
              <circle cx="64" cy="62" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
              <line x1="74" y1="72" x2="84" y2="82" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
              <path
                d="M58 62 L62 66 L70 58"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* AI Sparkles */}
              <path
                d="M82 14 Q82 22 90 22 Q82 22 82 30 Q82 22 74 22 Q82 22 82 14 Z"
                fill="#00D2A0"
              />
              <path
                d="M93 30 Q93 34 97 34 Q93 34 93 38 Q93 34 89 34 Q93 34 93 30 Z"
                fill="#00D2A0"
              />
            </svg>
          </div>

          {/* Wordmark */}
          {variant !== 'icon' && (
            <div className="flex flex-col">
              <div className={`font-black tracking-tight leading-none ${currentSize.text} flex items-center`}>
                <span className="text-[#0F172A]">Clause</span>
                <span className="bg-gradient-to-r from-[#00A3FF] to-[#00D2A0] bg-clip-text text-transparent font-black ml-0.5">
                  IQ
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Tagline */}
      {(showTagline || variant === 'with-tagline') && (
        <div className="mt-1">
          <p className="text-xs font-bold text-[#0F172A]">
            Understand Every Clause. <span className="text-[#00A396]">Sign with Confidence.</span>
          </p>
          <p className="text-[10px] text-[#475569]">
            AI-Powered Contract Analysis. Clear Insights. Better Decisions.
          </p>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};
