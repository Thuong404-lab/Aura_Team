import React from 'react';

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

// Trống Đồng Đông Sơn (Bronze Drum Mandala)
export const DongSonDrumMandala: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-96 h-96',
  opacity = 0.25,
}) => (
  <svg
    viewBox="0 0 400 400"
    className={`pointer-events-none select-none ${className}`}
    style={{ opacity }}
    fill="none"
  >
    <defs>
      <linearGradient id="bronzeGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8A6623" />
      </linearGradient>
    </defs>

    {/* Concentric rings */}
    <circle cx="200" cy="200" r="190" stroke="url(#bronzeGold)" strokeWidth="2.5" strokeDasharray="6 4" />
    <circle cx="200" cy="200" r="180" stroke="url(#bronzeGold)" strokeWidth="1" />
    <circle cx="200" cy="200" r="165" stroke="url(#bronzeGold)" strokeWidth="1.5" />
    <circle cx="200" cy="200" r="150" stroke="url(#bronzeGold)" strokeWidth="2" strokeDasharray="3 3" />
    <circle cx="200" cy="200" r="130" stroke="url(#bronzeGold)" strokeWidth="1" />
    <circle cx="200" cy="200" r="110" stroke="url(#bronzeGold)" strokeWidth="1.5" />
    <circle cx="200" cy="200" r="90" stroke="url(#bronzeGold)" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="200" cy="200" r="68" stroke="url(#bronzeGold)" strokeWidth="1" />
    <circle cx="200" cy="200" r="48" stroke="url(#bronzeGold)" strokeWidth="1.5" />

    {/* Center 14-point Sun Star (Mặt Trời 14 cánh) */}
    <g transform="translate(200, 200)">
      {Array.from({ length: 14 }).map((_, i) => {
        const rot = (i * 360) / 14;
        return (
          <polygon
            key={i}
            points="0,-45 -7,-12 0,0 7,-12"
            fill="url(#bronzeGold)"
            opacity="0.85"
            transform={`rotate(${rot})`}
          />
        );
      })}
    </g>

    {/* Flying Cranes (Chim Lạc bay ngược chiều kim đồng hồ) */}
    <g transform="translate(200, 200)">
      {Array.from({ length: 8 }).map((_, i) => {
        const rot = (i * 360) / 8;
        return (
          <g key={i} transform={`rotate(${rot}) translate(0, -140)`}>
            {/* Stylized flying crane path */}
            <path
              d="M-15 0 C-10 -8, 10 -8, 20 0 C12 -2, 0 3, -15 0 Z M5 -4 L25 -10 L15 0 Z M0 0 L-10 8 L-5 2 Z"
              fill="url(#bronzeGold)"
              opacity="0.75"
            />
          </g>
        );
      })}
    </g>

    {/* Geometric Sawtooth / Meander ring */}
    <g transform="translate(200, 200)">
      {Array.from({ length: 28 }).map((_, i) => {
        const rot = (i * 360) / 28;
        return (
          <path
            key={i}
            d="M-3 -100 L0 -107 L3 -100 Z"
            fill="url(#bronzeGold)"
            opacity="0.6"
            transform={`rotate(${rot})`}
          />
        );
      })}
    </g>
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
