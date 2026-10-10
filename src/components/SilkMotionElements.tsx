import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audioSynth';

/**
 * Animated SVG Silk Wave Path that ripples softly on hover or loop
 */
export const SilkWaveRibbon: React.FC<{
  isHovered?: boolean;
  isActive?: boolean;
  className?: string;
  color?: string;
}> = ({ isHovered = false, isActive = false, className = '', color = '#F59E0B' }) => {
  return (
    <div className={`overflow-hidden pointer-events-none relative ${className}`}>
      <motion.svg
        viewBox="0 0 160 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial={false}
      >
        <defs>
          <linearGradient id={`silkGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="35%" stopColor={color} stopOpacity={isActive ? "0.85" : "0.55"} />
            <stop offset="70%" stopColor="#FDE68A" stopOpacity={isActive ? "0.95" : "0.7"} />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="silkSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Primary flowing silk ribbon wave */}
        <motion.path
          d="M0,12 C40,4 60,20 100,10 C130,2 145,18 160,12 L160,24 L0,24 Z"
          fill={`url(#silkGrad-${color.replace('#', '')})`}
          animate={
            isHovered || isActive
              ? {
                  d: [
                    'M0,12 C35,6 65,18 100,8 C135,2 145,18 160,11 L160,24 L0,24 Z',
                    'M0,10 C45,18 70,6 105,14 C130,20 150,8 160,13 L160,24 L0,24 Z',
                    'M0,13 C30,4 60,20 95,9 C130,3 148,16 160,10 L160,24 L0,24 Z',
                    'M0,12 C35,6 65,18 100,8 C135,2 145,18 160,11 L160,24 L0,24 Z',
                  ],
                }
              : {
                  d: 'M0,14 C40,11 80,16 120,12 C140,10 150,14 160,13 L160,24 L0,24 Z',
                }
          }
          transition={{
            duration: isHovered ? 2.4 : 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Delicate crest highlight thread (Sợi tơ óng ả) */}
        <motion.path
          d="M0,12 C40,4 60,20 100,10 C130,2 145,18 160,12"
          stroke="rgba(253, 230, 138, 0.75)"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
          animate={
            isHovered || isActive
              ? {
                  d: [
                    'M0,12 C35,6 65,18 100,8 C135,2 145,18 160,11',
                    'M0,10 C45,18 70,6 105,14 C130,20 150,8 160,13',
                    'M0,13 C30,4 60,20 95,9 C130,3 148,16 160,10',
                    'M0,12 C35,6 65,18 100,8 C135,2 145,18 160,11',
                  ],
                }
              : {
                  d: 'M0,14 C40,11 80,16 120,12 C140,10 150,14 160,13',
                }
          }
          transition={{
            duration: isHovered ? 2.4 : 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
};

/**
 * Silken light sheen reflection passing smoothly across the surface
 */
export const SilkSheenSweep: React.FC<{
  isHovered: boolean;
}> = ({ isHovered }) => {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          key="sheen"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '180%', opacity: [0, 0.45, 0.25, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 pointer-events-none z-10 w-1/2 bg-gradient-to-r from-transparent via-amber-200/25 to-transparent skew-x-[-22deg]"
        />
      )}
    </AnimatePresence>
  );
};

/**
 * Interactive Category Tab with Silk Drape Motion
 */
export interface SilkTabItem {
  id: string;
  label: string;
  subLabel?: string;
  count: number;
  icon: React.ReactNode;
}

interface SilkCategoryTabsProps {
  items: SilkTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onHoverTab?: (id: string | null) => void;
}

export const SilkCategoryTabs: React.FC<SilkCategoryTabsProps> = ({
  items,
  activeId,
  onSelect,
  onHoverTab,
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className="relative w-full border-b border-amber-500/20 pb-2">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar py-1">
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          const isHovered = hoveredTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                soundEngine.playPluck(523.25);
                onSelect(tab.id);
              }}
              onMouseEnter={() => {
                setHoveredTab(tab.id);
                onHoverTab?.(tab.id);
                soundEngine.playSilkFlutter();
              }}
              onMouseLeave={() => {
                setHoveredTab(null);
                onHoverTab?.(null);
              }}
              whileHover={{
                y: -2.5,
                scale: 1.025,
                transition: { type: 'spring', stiffness: 380, damping: 22 },
              }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer select-none shrink-0 ${
                isActive
                  ? 'text-amber-200'
                  : 'text-slate-400 hover:text-amber-100 bg-[#0E1526]/60 border border-slate-800/80 hover:border-amber-500/30'
              }`}
            >
              {/* Active Silk Sash Glider (Framer Motion layoutId) */}
              {isActive && (
                <motion.div
                  layoutId="activeSilkTabGlider"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-amber-500/25 via-amber-600/15 to-[#0F172A] border border-amber-400/60 shadow-[0_4px_20px_rgba(245,158,11,0.22)]"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 28,
                  }}
                />
              )}

              {/* Silk Ripple Sheen on Hover */}
              <SilkSheenSweep isHovered={isHovered} />

              {/* Tab Icon with soft floating motion */}
              <motion.span
                animate={
                  isHovered
                    ? {
                        rotate: [-3, 3, -2, 0],
                        y: [-1, 1, 0],
                      }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0 }}
                className={`relative z-10 shrink-0 ${
                  isActive ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : 'text-slate-400'
                }`}
              >
                {tab.icon}
              </motion.span>

              {/* Label and Count */}
              <span className="relative z-10 tracking-wide font-sans-vi whitespace-nowrap">
                {tab.label}
              </span>

              <span
                className={`relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-amber-400/25 border-amber-400/50 text-amber-200'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
                }`}
              >
                {tab.count}
              </span>

              {/* Dynamic Silk Wave Ribbon at bottom of tab button */}
              {(isActive || isHovered) && (
                <div className="absolute -bottom-1 left-0 right-0 h-3 z-10">
                  <SilkWaveRibbon
                    isHovered={isHovered}
                    isActive={isActive}
                    className="w-full h-full"
                    color={isActive ? '#F59E0B' : '#D97706'}
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Celestial Silk Sash (Dải lụa bay lượn mềm mại quanh hình mẫu)
 * Renders undulating organic silk ribbon loops using Framer Motion
 */
export const CelestialSilkSash: React.FC<{
  isHovering?: boolean;
  className?: string;
  color?: string;
}> = ({ isHovering = false, className = '' }) => {
  return (
    <div className={`pointer-events-none overflow-visible ${className}`}>
      <motion.svg
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="celestialSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="25%" stopColor="#FCD34D" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#FDE68A" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 20,120 Q 90,40 180,95 T 320,80 T 390,140"
          stroke="url(#celestialSilkGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: isHovering
              ? [
                  'M 20,120 Q 90,30 180,105 T 320,60 T 390,130',
                  'M 20,100 Q 100,60 190,80 T 310,110 T 390,120',
                  'M 20,130 Q 80,40 170,110 T 330,70 T 390,140',
                  'M 20,120 Q 90,30 180,105 T 320,60 T 390,130',
                ]
              : [
                  'M 20,120 Q 90,40 180,95 T 320,80 T 390,140',
                  'M 20,110 Q 100,50 190,90 T 310,95 T 390,135',
                  'M 20,120 Q 90,40 180,95 T 320,80 T 390,140',
                ],
            opacity: isHovering ? [0.6, 0.95, 0.7] : [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: isHovering ? 2.5 : 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Fine gold embroidery line on the sash edge */}
        <motion.path
          d="M 20,120 Q 90,40 180,95 T 320,80 T 390,140"
          stroke="#FFFBEB"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
          animate={{
            d: isHovering
              ? [
                  'M 20,120 Q 90,30 180,105 T 320,60 T 390,130',
                  'M 20,100 Q 100,60 190,80 T 310,110 T 390,120',
                  'M 20,130 Q 80,40 170,110 T 330,70 T 390,140',
                  'M 20,120 Q 90,30 180,105 T 320,60 T 390,130',
                ]
              : [
                  'M 20,120 Q 90,40 180,95 T 320,80 T 390,140',
                  'M 20,110 Q 100,50 190,90 T 310,95 T 390,135',
                  'M 20,120 Q 90,40 180,95 T 320,80 T 390,140',
                ],
          }}
          transition={{
            duration: isHovering ? 2.5 : 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
    </div>
  );
};
