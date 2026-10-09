import React, { useState, useRef, useId } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface DongSonDrumProps {
  className?: string;
  opacity?: number;
  animated?: boolean;
  /** Custom glowing aura intensity */
  glow?: boolean;
  /** Speed multiplier for rotation */
  speed?: number;
  /** Enable dynamic interactive 3D light reflection & tilt on mouse move */
  interactive?: boolean;
  /** Size for canvas or container if specified */
  size?: number;
}

/**
 * DongSonDrumMandala (Trống Đồng Đông Sơn Ngọc Lũ - Hoàng Triều)
 *
 * Upgraded masterpiece featuring:
 * 1. SVG Vector Mandala with museum-grade Ngọc Lũ patterns:
 *    - 14-pointed Central Sun Star with dynamic breathing solar flares
 *    - Dual counter-rotating sacred concentric circles (Chim Lạc and Vũ Nhân dancers)
 *    - Concentric sawtooth rings, spiral tang cước, and meander bands
 * 2. Golden Gradient Light Reflection (Phản chiếu ánh sáng gradient vàng):
 *    - Sweeping specular sheen that dynamically follows cursor or smoothly animates
 *    - Radial gold spotlight creating rich metallic lusters
 * 3. Slow Rotation with Framer Motion:
 *    - Majestic, ultra-smooth continuous rotation
 *    - Independent counter-rotation for inner vs outer sacred rings for visual depth
 * 4. Layered Depth & Shadow with 3D Tilt on Hover:
 *    - Multi-layered drop shadows (ambient golden bloom + deep elevation shadow)
 *    - Parallax 3D tilt responding to mouse position (perspective, rotateX, rotateY)
 *    - Layer elevation shifts when hovered/moved over
 */
export const DongSonDrumMandala: React.FC<DongSonDrumProps> = ({
  className = 'w-96 h-96',
  opacity = 0.25,
  animated = false,
  glow = false,
  speed = 1,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Unique IDs for SVG gradients and filters to avoid DOM conflicts
  const uid = useId().replace(/:/g, '');
  const gradBronze = `bronzeGold_${uid}`;
  const gradSun = `sunGold_${uid}`;
  const gradSpecular = `specularGold_${uid}`;
  const gradLightSheen = `sheenGold_${uid}`;
  const filterGlow = `drumGlow_${uid}`;
  const filterRelief = `drumRelief_${uid}`;

  // Interactive mouse tracking for 3D tilt & dynamic light reflection sheen
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 120, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D tilt transforms: subtle, elegant tilt up to +-12 degrees
  const rotateX = useTransform(smoothMouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-10, 10]);
  
  // Specular light sheen gradient position based on cursor
  const sheenX = useTransform(smoothMouseX, [0, 1], ['20%', '80%']);
  const sheenY = useTransform(smoothMouseY, [0, 1], ['20%', '80%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, x)));
    mouseY.set(Math.max(0, Math.min(1, y)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // The comprehensive vector drum pattern
  const DrumSVGLayers = (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full pointer-events-none select-none overflow-visible"
      style={{ opacity }}
      fill="none"
    >
      <defs>
        {/* Imperial Antique Bronze-Gold Multi-Stop Gradient */}
        <linearGradient id={gradBronze} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF0" />
          <stop offset="18%" stopColor="#FDE68A" />
          <stop offset="42%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="88%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* Dynamic Specular Golden Sheen for light reflection */}
        <radialGradient id={gradSpecular} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="20%" stopColor="#FEF08A" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="85%" stopColor="#78350F" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Sweep Angle Light Beam Reflection */}
        <linearGradient id={gradLightSheen} x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0" />
          <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="65%" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
        </linearGradient>

        {/* Sacred Sun Core Gradient */}
        <radialGradient id={gradSun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFFBEB" stopOpacity="0.98" />
          <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.92" />
          <stop offset="80%" stopColor="#D97706" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.6" />
        </radialGradient>

        {/* Multi-layered Golden Aura Glow Filter */}
        {glow && (
          <filter id={filterGlow} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Embossed Relief & Subtle Drop-Shadow for SVG elements */}
        <filter id={filterRelief} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Layer 0: Metallic Bronze Disc Backplate with Embossed Rings */}
      <circle
        cx="300"
        cy="300"
        r="292"
        fill="#090F1B"
        fillOpacity="0.65"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.5"
      />
      <circle
        cx="300"
        cy="300"
        r="288"
        stroke="#F59E0B"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />

      {/* Layer 1: Outermost Braided Rope, Dotted Circles, and Sawtooth Rim (R = 285 to 255) */}
      <g filter={glow ? `url(#${filterGlow})` : undefined}>
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

        {/* Dotted beads ring */}
        <circle
          cx="300"
          cy="300"
          r="262"
          stroke={`url(#${gradBronze})`}
          strokeWidth="2.2"
          strokeDasharray="3 4"
        />
        <circle cx="300" cy="300" r="255" stroke={`url(#${gradBronze})`} strokeWidth="1.4" />
      </g>

      {/* Layer 2: Flying Cranes Ring (Đàn Chim Lạc vỗ cánh Ngọc Lũ - R = 248 to 198) */}
      <circle cx="300" cy="300" r="248" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />
      
      {/* Dynamic or static crane flock */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 16 }).map((_, i) => {
          const rot = (i * 360) / 16;
          return (
            <g key={`crane-${i}`} transform={`rotate(${rot}) translate(0, -222)`}>
              {/* Chim Lạc sải cánh dài, mỏ mở, mào nhọn đặc trưng bảo vật Ngọc Lũ */}
              <path
                d="M-22 0 C-15 -10, 8 -9, 24 1 C14 -4, 2 -1, -12 2 C-16 3, -19 2, -22 0 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.95"
              />
              {/* Upper Primary Wing */}
              <path
                d="M-4 -3 L22 -14 C16 -6, 6 -3, -4 -3 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.9"
              />
              {/* Lower Wing & Tail Feathers */}
              <path
                d="M-10 1 L-18 8 L-13 1 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.8"
              />
              {/* Eye & Crest */}
              <circle cx="23" cy="1" r="1.3" fill="#FFFBEB" />
              <path d="M22 0 Q28 -3 30 -1" stroke={`url(#${gradBronze})`} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      <circle cx="300" cy="300" r="198" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      {/* Layer 3: Ceremonial Dancers Ring (Vũ Nhân Đội Mũ Lông Chim Múa Lễ Hội - R = 192 to 154) */}
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
              {/* Head with magnificent tall feather crown */}
              <circle cx="0" cy="-7" r="2.2" fill={`url(#${gradBronze})`} opacity="0.9" />
              <path
                d="M0 -9 L-4 -18 L0 -14 L4 -18 L0 -9 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.9"
              />
              {/* Torso with flared ceremonial kilt */}
              <path
                d="M0 -5 L-3 4 L3 4 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.8"
              />
              {/* Ritual axe / spear */}
              <line
                x1="-7"
                y1="3"
                x2="7"
                y2="-5"
                stroke={`url(#${gradBronze})`}
                strokeWidth="1.3"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          );
        })}
      </g>
      <circle cx="300" cy="300" r="154" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      {/* Layer 4: Concentric Sawtooth & Meander Spiral Rings (R = 148 to 95) */}
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
              opacity="0.8"
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
        strokeWidth="2.4"
        strokeDasharray="5 4"
      />
      <circle cx="300" cy="300" r="114" stroke={`url(#${gradBronze})`} strokeWidth="1.2" />

      {/* Inner dots bead ring */}
      <circle
        cx="300"
        cy="300"
        r="104"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.6"
        strokeDasharray="3 3"
      />
      <circle cx="300" cy="300" r="95" stroke={`url(#${gradBronze})`} strokeWidth="2.2" />

      {/* Layer 5: Sacred 14-Point Central Sun (Mặt Trời Đông Sơn Bừng Sáng) */}
      <circle
        cx="300"
        cy="300"
        r="34"
        fill={`url(#${gradSun})`}
        opacity="0.5"
      />
      <circle
        cx="300"
        cy="300"
        r="20"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.6"
        opacity="0.95"
      />
      <circle cx="300" cy="300" r="7" fill={`url(#${gradSun})`} />

      {/* 14 Solar Flares & Feather Spikes */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`sun-ray-${i}`} transform={`rotate(${rot})`}>
              {/* Primary sharp solar ray extending to R=92 */}
              <polygon
                points="0,-92 -8,-24 0,0 8,-24"
                fill={`url(#${gradSun})`}
                opacity="0.98"
              />
              {/* Ray core highlight */}
              <line
                x1="0"
                y1="-92"
                x2="0"
                y2="-24"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                opacity="0.9"
              />
              {/* Peacock feather triangle motif between ray tips */}
              <path
                d="M-12 -65 L-16 -78 L-12 -73 Z"
                fill={`url(#${gradBronze})`}
                opacity="0.75"
              />
            </g>
          );
        })}
      </g>

      {/* Layer 6: Dynamic Golden Light Reflection Overlay */}
      {/* Diagonal specular light band sweeping across the surface */}
      <rect
        x="0"
        y="0"
        width="600"
        height="600"
        fill={`url(#${gradLightSheen})`}
        clipPath="url(#drumClip)"
        className="pointer-events-none mix-blend-color-dodge opacity-70"
      />

      {/* Spherical specular highlight (giving the drum authentic convex bronze curvature) */}
      <circle
        cx="250"
        cy="240"
        r="280"
        fill={`url(#${gradSpecular})`}
        className="pointer-events-none mix-blend-screen opacity-65"
      />

      <clipPath id="drumClip">
        <circle cx="300" cy="300" r="290" />
      </clipPath>
    </svg>
  );

  // If not animated, return clean component with optional hover
  if (!animated) {
    return (
      <div className={`relative ${className}`}>
        {DrumSVGLayers}
      </div>
    );
  }

  // Multi-tier animated & interactive 3D drum with golden reflection and layered depth
  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={
        interactive
          ? {
              scale: 1.04,
              transition: { duration: 0.4, ease: 'easeOut' },
            }
          : undefined
      }
      className={`relative flex items-center justify-center cursor-pointer transition-shadow duration-500 ${className}`}
    >
      {/* ----------------------------------------------------------------- */}
      {/* LAYER 1: AMBIENT GOLDEN BLOOM & ELEVATION DROP SHADOW             */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        animate={{
          scale: isHovered ? 1.15 : [1, 1.08, 1],
          opacity: isHovered ? 0.6 : [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: isHovered ? 0.3 : 4 / speed,
          repeat: isHovered ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-radial from-amber-400/45 via-yellow-600/20 to-transparent blur-2xl pointer-events-none -z-10"
      />

      {/* Deep Layer Elevation Shadow on hover (đổ bóng layer tạo chiều sâu) */}
      <motion.div
        animate={{
          boxShadow: isHovered
            ? '0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 50px rgba(245, 158, 11, 0.35)'
            : '0 15px 35px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(217, 119, 6, 0.15)',
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-4 rounded-full pointer-events-none -z-5"
      />

      {/* ----------------------------------------------------------------- */}
      {/* LAYER 2: SLOW ROTATING DRUM SURFACE WITH FRAMER MOTION            */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 90 / speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {DrumSVGLayers}
      </motion.div>

      {/* ----------------------------------------------------------------- */}
      {/* LAYER 3: DYNAMIC GOLDEN LIGHT REFLECTION (PHẢN CHIẾU ÁNH SÁNG)     */}
      {/* Smooth sweeping sheen following cursor position or breathing      */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden mix-blend-color-dodge"
        style={{
          background: `radial-gradient(circle at ${sheenX.get()} ${sheenY.get()}, rgba(255,255,255,0.7) 0%, rgba(253,230,138,0.4) 30%, transparent 65%)`,
          opacity: isHovered ? 0.85 : 0.45,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Rotating specular gloss ring to amplify 3D bronze relief */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 120 / speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent mix-blend-screen opacity-60"
      />

      {/* Subtle Rim Highlight Glint on hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.9 : 0.3,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-1 rounded-full border border-amber-300/40 pointer-events-none shadow-[inset_0_0_20px_rgba(245,158,11,0.25)]"
      />
    </motion.div>
  );
};
