import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 44 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="circleGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        <linearGradient id="bodyGrad" x1="25" y1="30" x2="75" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Outer Enclosure Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#circleGrad)"
        strokeWidth="3"
        strokeDasharray="260"
        strokeDashoffset="10"
        className="opacity-90"
      />

      {/* Inner Accent Ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#10b981"
        strokeWidth="0.8"
        strokeOpacity="0.25"
      />

      {/* Dynamic Swoosh / Speed Silhouette */}
      <path
        d="M 56 18 
           C 51 28, 48 38, 48 48 
           C 48 54, 44 58, 38 58 
           C 32 58, 28 53, 29 46 
           C 30 39, 36 34, 43 36 
           C 35 39, 34 47, 37 51 
           C 40 55, 45 53, 47 48 
           C 50 38, 54 26, 56 18 Z"
        fill="url(#bodyGrad)"
        filter="url(#neonGlow)"
      />

      {/* Trailing Accelerator Fin */}
      <path
        d="M 64 36 
           L 58 40 
           C 56 46, 55 54, 53 58 
           L 57 58 
           C 59 52, 60 46, 64 36 Z"
        fill="#34d399"
        filter="url(#neonGlow)"
      />

      {/* Wheels */}
      <circle cx="34" cy="67" r="5.5" fill="#047857" stroke="#34d399" strokeWidth="2" />
      <circle cx="34" cy="67" r="2" fill="#a7f3d0" />

      <circle cx="56" cy="67" r="5.5" fill="#047857" stroke="#34d399" strokeWidth="2" />
      <circle cx="56" cy="67" r="2" fill="#a7f3d0" />
    </svg>
  );
}