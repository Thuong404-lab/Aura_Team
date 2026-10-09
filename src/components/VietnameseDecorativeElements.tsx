import React from 'react';
export { DongSonDrumMandala } from './DongSonDrumMandala';
export type { DongSonDrumProps } from './DongSonDrumMandala';

// Stylized Golden Aura Logo Emblem
export const AuraLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
    </defs>
    {/* Stylized golden letter A with classical flourish */}
    <path
      d="M50 12 L78 84 L64 84 L57 66 L43 66 L36 84 L22 84 Z M50 30 L46 54 L54 54 Z"
      fill="url(#goldGradient)"
      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
    />
    <path
      d="M30 50 Q50 38 70 50"
      stroke="#FDE68A"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.85"
    />
    <circle cx="50" cy="18" r="3" fill="#FDE68A" />
  </svg>
);

// Traditional Vietnamese Golden Clouds (Mây Cổ Phong)
export const CoPhongCloud: React.FC<{
  className?: string;
  flipX?: boolean;
  scale?: number;
}> = ({ className = 'w-32 h-20', flipX = false, scale = 1 }) => (
  <svg
    viewBox="0 0 160 100"
    className={`pointer-events-none select-none ${className}`}
    style={{
      transform: `${flipX ? 'scaleX(-1)' : ''} scale(${scale})`,
    }}
    fill="none"
  >
    <defs>
      <linearGradient id="cloudGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#996515" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    {/* Swirling classical Vietnamese cloud outlines */}
    <path
      d="M20 70 Q10 70 8 60 Q6 50 18 45 Q16 30 32 25 Q45 20 55 30 Q65 18 85 18 Q105 18 115 32 Q130 25 142 38 Q152 48 145 62 Q140 70 125 70 Q118 70 115 65 Q105 75 85 75 Q70 75 62 68 Q50 72 38 72 Z"
      stroke="url(#cloudGold)"
      strokeWidth="2"
      fill="none"
    />
    {/* Inner spirals */}
    <path
      d="M32 58 Q40 50 48 55 Q56 60 50 66 Q44 70 38 64"
      stroke="url(#cloudGold)"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M85 35 Q95 28 105 34 Q112 40 106 48 Q100 52 92 46"
      stroke="url(#cloudGold)"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M120 54 Q128 48 134 52 Q138 56 132 60"
      stroke="url(#cloudGold)"
      strokeWidth="1.2"
      fill="none"
    />
    {/* Trailing wisps */}
    <path
      d="M15 75 Q35 85 65 80 Q95 75 125 82"
      stroke="url(#cloudGold)"
      strokeWidth="1.2"
      strokeDasharray="4 3"
      opacity="0.6"
    />
  </svg>
);
