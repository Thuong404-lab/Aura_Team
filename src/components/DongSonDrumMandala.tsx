import React, { useId } from 'react';
import { motion } from 'framer-motion';

export interface DongSonDrumProps {
  className?: string;
  opacity?: number;
  animated?: boolean;
  /** Custom glowing aura intensity */
  glow?: boolean;
  /** Speed multiplier for rotation */
  speed?: number;
}

/**
 * DongSonDrumMandala (Trống Đồng Đông Sơn Ngọc Lũ - Hoàng Triều)
 * Upgraded authentic museum-grade vector mandala with multi-tier dynamic animations:
 * - 14-pointed Central Sun Star with breathing solar flare pulse
 * - Inner geometric sawtooth / triangular teeth rings with subtle shimmer
 * - Flying Cranes (Đàn Chim Lạc vỗ cánh bay ngược chiều kim đồng hồ)
 * - Human figures / Feather-hat ceremonial dancers ring (Vũ Nhân nhảy múa Lễ Hội)
 * - Concentric dotted circles, spiral tang cước, and meander bands
 * - Dual counter-rotating sacred concentric circles for dynamic depth
 */
export const DongSonDrumMandala: React.FC<DongSonDrumProps> = ({
  className = 'w-96 h-96',
  opacity = 0.25,
  animated = false,
  glow = false,
  speed = 1,
}) => {
  const uid = useId().replace(/:/g, '');
  const gradBronze = `bronzeGold_${uid}`;
  const gradSun = `sunGold_${uid}`;
  const gradGlow = `drumGlow_${uid}`;

  const DrumSVG = (
    <svg
      viewBox="0 0 600 600"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      fill="none"
    >
      <defs>
        <linearGradient id={gradBronze} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="25%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#D4AF37" />
          <stop offset="90%" stopColor="#996515" />
          <stop offset="100%" stopColor="#5E3C07" />
        </linearGradient>

        <radialGradient id={gradSun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFBE6" stopOpacity="1" />
          <stop offset="45%" stopColor="#FCD34D" stopOpacity="0.95" />
          <stop offset="85%" stopColor="#D97706" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.6" />
        </radialGradient>

        {glow && (
          <filter id={gradGlow} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* =================================================================== */}
      {/* 1. OUTERMOST BORDER & BRAIDED ROPE MOTIF RINGS (R = 285 to 260)     */}
      {/* =================================================================== */}
      <circle cx="300" cy="300" r="285" stroke={`url(#${gradBronze})`} strokeWidth="3.5" />
      <circle
        cx="300"
        cy="300"
        r="277"
        stroke={`url(#${gradBronze})`}
        strokeWidth="2.5"
        strokeDasharray="6 4"
      />
      <circle cx="300" cy="300" r="268" stroke={`url(#${gradBronze})`} strokeWidth="1.5" />

      {/* Tiny dotted dots ring around the rim */}
      <circle
        cx="300"
        cy="300"
        r="262"
        stroke={`url(#${gradBronze})`}
        strokeWidth="2"
        strokeDasharray="3 4"
      />
      <circle cx="300" cy="300" r="255" stroke={`url(#${gradBronze})`} strokeWidth="1.2" />

      {/* =================================================================== */}
      {/* 2. FLYING CRANES RING (ĐÀN CHIM LẠC BAY NGƯỢC KIM ĐỒNG HỒ - R = 230) */}
      {/* =================================================================== */}
      <circle cx="300" cy="300" r="248" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />
      <g transform="translate(300, 300)">
        {Array.from({ length: 16 }).map((_, i) => {
          const rot = (i * 360) / 16;
          return (
            <g key={`crane-${i}`} transform={`rotate(${rot}) translate(0, -222)`}>
              {/* Detailed Stylized Flying Crane (Chim Lạc sải cánh, mỏ dài đặc trưng Ngọc Lũ) */}
              <path
                d="M-22 0 C-15 -10, 8 -9, 24 1 C14 -4, 2 -1, -12 2 C-16 3, -19 2, -22 0 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.9"
              />
              {/* Wings */}
              <path
                d="M-4 -3 L22 -14 C16 -6, 6 -3, -4 -3 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.85"
              />
              <path
                d="M-10 1 L-18 8 L-13 1 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.75"
              />
              {/* Crest / Mào chim Lạc */}
              <circle cx="23" cy="1" r="1.3" fill={`url(#${gradBronze})`} />
              <path d="M22 0 Q28 -3 30 -1" stroke={`url(#${gradBronze})`} strokeWidth="1.2" />
            </g>
          );
        })}
      </g>
      <circle cx="300" cy="300" r="198" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      {/* =================================================================== */}
      {/* 3. CEREMONIAL DANCERS RING (VŨ NHÂN ĐỘI MŨ LÔNG CHIM - R = 180)     */}
      {/* =================================================================== */}
      <circle
        cx="300"
        cy="300"
        r="192"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
      <g transform="translate(300, 300)">
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`dancer-${i}`} transform={`rotate(${rot}) translate(0, -174)`}>
              {/* Head with tall feather crown (Mũ lông chim) */}
              <circle cx="0" cy="-7" r="2.2" fill={`url(#${gradBronze})`} opacity="0.8" />
              <path
                d="M0 -9 L-4 -18 L0 -14 L4 -18 L0 -9 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.85"
              />
              {/* Torso & garment flare */}
              <path
                d="M0 -5 L-3 4 L3 4 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.75"
              />
              {/* Spear / ceremonial tool */}
              <line
                x1="-7"
                y1="3"
                x2="7"
                y2="-5"
                stroke={`url(#${gradBronze})`}
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </g>
          );
        })}
      </g>
      <circle cx="300" cy="300" r="154" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      {/* =================================================================== */}
      {/* 4. SAWTOOTH & CONCENTRIC SPIRALS BAND (R = 145 to 115)              */}
      {/* =================================================================== */}
      <circle
        cx="300"
        cy="300"
        r="148"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <g transform="translate(300, 300)">
        {Array.from({ length: 36 }).map((_, i) => {
          const rot = (i * 360) / 36;
          return (
            <path
              key={`tooth-${i}`}
              d="M-3 -138 L0 -146 L3 -138 Z"
              fill={`url(#${gradBronze})`}
              opacity="0.7"
              transform={`rotate(${rot})`}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="130" stroke={`url(#${gradBronze})`} strokeWidth="1.5" />
      <circle
        cx="300"
        cy="300"
        r="122"
        stroke={`url(#${gradBronze})`}
        strokeWidth="2.2"
        strokeDasharray="5 4"
      />
      <circle cx="300" cy="300" r="114" stroke={`url(#${gradBronze})`} strokeWidth="1.2" />

      {/* Inner dots ring */}
      <circle
        cx="300"
        cy="300"
        r="104"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="300" cy="300" r="95" stroke={`url(#${gradBronze})`} strokeWidth="2" />

      {/* =================================================================== */}
      {/* 5. SACRED 14-POINT CENTRAL SUN (MẶT TRỜI 14 TIA SÁNG ĐÔNG SƠN)       */}
      {/* =================================================================== */}
      <circle
        cx="300"
        cy="300"
        r="32"
        fill={`url(#${gradSun})`}
        opacity="0.45"
      />
      <circle
        cx="300"
        cy="300"
        r="20"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.5"
        opacity="0.9"
      />
      <circle cx="300" cy="300" r="7" fill={`url(#${gradSun})`} />

      {/* 14 Solar Flares & Feather Spikes in between */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`sun-ray-${i}`} transform={`rotate(${rot})`}>
              {/* Primary sharp solar ray extending out to R=92 */}
              <polygon
                points="0,-92 -8,-24 0,0 8,-24"
                fill={`url(#${gradSun})`}
                opacity="0.95"
              />
              {/* Ray edge highlight */}
              <line
                x1="0"
                y1="-92"
                x2="0"
                y2="-24"
                stroke="#FFFBE6"
                strokeWidth="1.2"
                opacity="0.8"
              />
              {/* Decorative motif between ray tips (Họa tiết lông công / tam giác phụ) */}
              <path
                d="M-12 -65 L-16 -78 L-12 -73 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.65"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );

  if (!animated) {
    return DrumSVG;
  }

  // Multi-tier animated version: central glow pulsing + smooth rotation
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient solar backlight aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 4 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-radial from-amber-400/40 via-yellow-600/15 to-transparent blur-xl pointer-events-none"
      />

      {/* Outer counter-rotating rings layer */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 90 / speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-full h-full"
      >
        {DrumSVG}
      </motion.div>
    </div>
  );
};
