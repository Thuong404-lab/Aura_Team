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
  /** High contrast & crisp museum mode */
  crisp?: boolean;
}

/**
 * DongSonDrumMandala (Trống Đồng Đông Sơn Ngọc Lũ - Bảo Vật Quốc Gia Hoàng Triều)
 *
 * Tối ưu hóa đặc biệt cho độ sắc nét, tương phản rực rỡ và chuyển động mượt mà 120fps:
 * 1. Hoa văn chuẩn mực bảo vật Ngọc Lũ:
 *    - Tâm mặt trời 14 tia sáng dài sắc bén, nhụy tròn hoàng kim, họa tiết lông công kẽ tia
 *    - Vành 1: Vòng chấm cườm nổi và vành răng lược kép đối xứng
 *    - Vành 2: Vũ nhân hóa trang đội mũ lông chim cao múa nghi lễ cầu mùa
 *    - Vành 3: Họa tiết sóng nước hình xoắn ốc chữ S (tang cước liên hoàn)
 *    - Vành 4: Đàn 16 chim Lạc sải cánh dài, mỏ mở nhọn, mào cong vút bay ngược chiều kim đồng hồ
 *    - Vành 5 & 6: Vòng răng cưa, hạt cườm đồng tâm và vành thừng bện viền ngoài
 * 2. Hệ màu Hoàng Kim rực rỡ (Luminous Imperial Gold) có độ tương phản cao, không bị chìm hay mờ đục
 * 3. Hiệu năng cao: Sử dụng drop-shadow phần cứng và GPU transform, loại bỏ filter SVG nặng gây giật lag
 */
export const DongSonDrumMandala: React.FC<DongSonDrumProps> = ({
  className = 'w-96 h-96',
  opacity = 1,
  animated = false,
  glow = false,
  speed = 1,
  interactive = true,
  crisp = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Unique IDs for SVG gradients to prevent DOM collisions
  const uid = useId().replace(/:/g, '');
  const gradBronze = `bronzeGold_${uid}`;
  const gradSun = `sunGold_${uid}`;
  const gradLightStroke = `lightStroke_${uid}`;
  const gradDiscBg = `discBg_${uid}`;

  // Interactive mouse tracking for 3D tilt & dynamic light reflection
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D tilt transforms: subtle, elegant tilt up to +-10 degrees
  const rotateX = useTransform(smoothMouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-8, 8]);

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

  // The museum-grade ultra-sharp vector drum pattern
  const DrumSVGLayers = (
    <svg
      viewBox="0 0 600 600"
      className="w-full h-full pointer-events-none select-none overflow-visible"
      style={{ opacity, shapeRendering: 'geometricPrecision' }}
      fill="none"
    >
      <defs>
        {/* Luminous Imperial Gold Gradient - High Contrast & Vibrancy */}
        <linearGradient id={gradBronze} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF0" />
          <stop offset="20%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* High-visibility pure golden stroke gradient */}
        <linearGradient id={gradLightStroke} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Sacred Sun Core Gradient with Radiance */}
        <radialGradient id={gradSun} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFFBEB" />
          <stop offset="60%" stopColor="#FCD34D" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>

        {/* Deep Imperial Bronze Disc Background with subtle central radiance */}
        <radialGradient id={gradDiscBg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1408" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#101524" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#070A12" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      {/* Layer 0: Metallic Bronze Disc Backplate */}
      <circle
        cx="300"
        cy="300"
        r="294"
        fill={`url(#${gradDiscBg})`}
        stroke={`url(#${gradBronze})`}
        strokeWidth="2.5"
      />
      <circle
        cx="300"
        cy="300"
        r="289"
        stroke="#FDE68A"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />

      {/* =================================================================== */}
      {/* VÀNH NGOÀI CÙNG: DÂY THỪNG BỆN, VÒNG HẠT CƯỜM & RĂNG CƯA ĐỒNG TÂM   */}
      {/* =================================================================== */}
      <circle cx="300" cy="300" r="283" stroke={`url(#${gradBronze})`} strokeWidth="3" />

      {/* Vòng dây thừng bện viền ngoài */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 64 }).map((_, i) => {
          const rot = (i * 360) / 64;
          return (
            <line
              key={`rope-${i}`}
              x1="0"
              y1="-283"
              x2="3"
              y2="-277"
              stroke={`url(#${gradLightStroke})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${rot})`}
            />
          );
        })}
      </g>

      <circle cx="300" cy="300" r="277" stroke={`url(#${gradBronze})`} strokeWidth="2" />

      {/* Vành chấm nổi / hạt cườm kép */}
      <circle
        cx="300"
        cy="300"
        r="271"
        stroke={`url(#${gradLightStroke})`}
        strokeWidth="2.4"
        strokeDasharray="3 4"
      />
      <circle cx="300" cy="300" r="264" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      {/* Vành răng cưa tam giác ngoài */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 48 }).map((_, i) => {
          const rot = (i * 360) / 48;
          return (
            <polygon
              key={`outer-tooth-${i}`}
              points="-3,-264 0,-257 3,-264"
              fill={`url(#${gradBronze})`}
              transform={`rotate(${rot})`}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="256" stroke={`url(#${gradBronze})`} strokeWidth="2.2" />

      {/* =================================================================== */}
      {/* VÀNH ĐÀN CHIM LẠC SẢI CÁNH (16 CHIM LẠC BAY NGƯỢC CHIỀU KIM ĐỒNG HỒ) */}
      {/* Đặc trưng tiêu biểu nhất của Trống Đồng Ngọc Lũ                    */}
      {/* =================================================================== */}
      <circle cx="300" cy="300" r="252" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />

      <g transform="translate(300, 300)">
        {Array.from({ length: 16 }).map((_, i) => {
          const rot = (i * 360) / 16;
          return (
            <g key={`lac-bird-${i}`} transform={`rotate(${rot}) translate(0, -225)`}>
              {/* Thân chim Lạc sải dài uyển chuyển, bay ngược chiều kim đồng hồ */}
              <path
                d="M-28 1 C-18 -10, 8 -10, 30 1 C18 -4, 2 -2, -14 3 C-20 4, -25 3, -28 1 Z"
                fill={`url(#${gradLightStroke})`}
                stroke={`url(#${gradBronze})`}
                strokeWidth="0.8"
              />
              {/* Cánh trên sải rộng bay vút với gân lông vũ */}
              <path
                d="M-6 -4 L26 -17 C18 -7, 6 -4, -6 -4 Z"
                fill={`url(#${gradBronze})`}
                stroke="#FFFBEB"
                strokeWidth="0.6"
              />
              {/* Cánh dưới và lông đuôi xòe dài */}
              <path
                d="M-14 2 L-26 10 L-18 2 Z"
                fill={`url(#${gradBronze})`}
              />
              <path
                d="M-22 6 L-32 14 L-24 5 Z"
                fill={`url(#${gradLightStroke})`}
                opacity="0.85"
              />
              {/* Đầu, mỏ dài nhọn há mở và mào lông cong đặc trưng */}
              <path
                d="M28 0 Q36 -4 40 -1"
                stroke={`url(#${gradLightStroke})`}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M26 -2 Q30 -9 34 -6"
                stroke={`url(#${gradBronze})`}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* Mắt chim Lạc tinh anh chấm ngọc sáng */}
              <circle cx="28" cy="0" r="1.6" fill="#FFFFFF" />
            </g>
          );
        })}
      </g>

      <circle cx="300" cy="300" r="198" stroke={`url(#${gradBronze})`} strokeWidth="2.2" />

      {/* =================================================================== */}
      {/* VÀNH HỌA TIẾT XOẮN ỐC TIẾP TUYẾN / CHỮ S (TANG CƯỚC NỐI TIẾP)      */}
      {/* Biểu tượng sóng nước và mầm sống sinh sôi nảy nở                   */}
      {/* =================================================================== */}
      <circle
        cx="300"
        cy="300"
        r="192"
        stroke={`url(#${gradLightStroke})`}
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <g transform="translate(300, 300)">
        {Array.from({ length: 28 }).map((_, i) => {
          const rot = (i * 360) / 28;
          return (
            <g key={`tang-cuoc-${i}`} transform={`rotate(${rot}) translate(0, -185)`}>
              <path
                d="M-7 0 C-7 -4, 0 -4, 0 0 C0 4, 7 4, 7 0"
                stroke={`url(#${gradLightStroke})`}
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="-3.5" cy="-1.5" r="1.2" fill="#FDE68A" />
              <circle cx="3.5" cy="1.5" r="1.2" fill="#FDE68A" />
            </g>
          );
        })}
      </g>
      <circle cx="300" cy="300" r="176" stroke={`url(#${gradBronze})`} strokeWidth="2" />

      {/* =================================================================== */}
      {/* VÀNH VŨ NHÂN LỄ HỘI: ĐỘI MŨ LÔNG CHIM CAO VÚT MÚA CẦU MÙA           */}
      {/* =================================================================== */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`dancer-${i}`} transform={`rotate(${rot}) translate(0, -156)`}>
              {/* Mũ lông chim xòe cao quý phái */}
              <path
                d="M0 -9 L-5 -20 L0 -15 L5 -20 L0 -9 Z"
                fill={`url(#${gradLightStroke})`}
                stroke={`url(#${gradBronze})`}
                strokeWidth="0.6"
              />
              {/* Đầu vũ nhân */}
              <circle cx="0" cy="-6" r="2.6" fill="#FFFBEB" />
              {/* Thân mình và váy xòe nghi lễ */}
              <path
                d="M0 -4 L-4 5 L4 5 Z"
                fill={`url(#${gradBronze})`}
              />
              {/* Cầm nhạc khí / rìu chiến nghi thức tế trời */}
              <line
                x1="-8"
                y1="4"
                x2="8"
                y2="-4"
                stroke={`url(#${gradLightStroke})`}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Chân tư thế nhún nhảy uyển chuyển */}
              <line x1="-2" y1="5" x2="-4" y2="10" stroke={`url(#${gradBronze})`} strokeWidth="1.4" />
              <line x1="2" y1="5" x2="4" y2="10" stroke={`url(#${gradBronze})`} strokeWidth="1.4" />
            </g>
          );
        })}
      </g>

      <circle cx="300" cy="300" r="138" stroke={`url(#${gradBronze})`} strokeWidth="2.2" />

      {/* =================================================================== */}
      {/* VÀNH RĂNG LƯỢC / RĂNG CƯA KÉP & VÒNG HẠT CƯỜM TRONG                */}
      {/* =================================================================== */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 36 }).map((_, i) => {
          const rot = (i * 360) / 36;
          return (
            <polygon
              key={`inner-tooth-${i}`}
              points="-3,-138 0,-130 3,-138"
              fill={`url(#${gradLightStroke})`}
              transform={`rotate(${rot})`}
            />
          );
        })}
      </g>
      <circle cx="300" cy="300" r="128" stroke={`url(#${gradBronze})`} strokeWidth="1.6" />
      <circle
        cx="300"
        cy="300"
        r="120"
        stroke={`url(#${gradLightStroke})`}
        strokeWidth="2.2"
        strokeDasharray="4 3"
      />
      <circle cx="300" cy="300" r="112" stroke={`url(#${gradBronze})`} strokeWidth="1.8" />
      <circle cx="300" cy="300" r="102" stroke={`url(#${gradLightStroke})`} strokeWidth="2.4" strokeDasharray="3 3" />
      <circle cx="300" cy="300" r="94" stroke={`url(#${gradBronze})`} strokeWidth="2.2" />

      {/* =================================================================== */}
      {/* TÂM MẶT TRỜI ĐÔNG SƠN 14 TIA SÁNG RỰC RỠ (BIỂU TƯỢNG VŨ TRỤ)        */}
      {/* Sắc nét, rực rỡ và lấp lánh ánh hoàng kim                           */}
      {/* =================================================================== */}
      {/* Quầng sáng vầng thái dương */}
      <circle cx="300" cy="300" r="32" fill={`url(#${gradSun})`} opacity="0.8" />
      <circle cx="300" cy="300" r="22" stroke="#FFFBEB" strokeWidth="2" />
      <circle cx="300" cy="300" r="10" fill="#FFFFFF" />

      {/* 14 Tia sáng mặt trời sắc bén vươn dài */}
      <g transform="translate(300, 300)">
        {Array.from({ length: 14 }).map((_, i) => {
          const rot = (i * 360) / 14;
          return (
            <g key={`sun-ray-${i}`} transform={`rotate(${rot})`}>
              {/* Tia mặt trời tam giác nhọn vút tới R=92 */}
              <polygon
                points="0,-92 -8,-22 0,-10 8,-22"
                fill={`url(#${gradSun})`}
                stroke={`url(#${gradLightStroke})`}
                strokeWidth="1.2"
              />
              {/* Sống tia vàng trắng tạo hiệu ứng khối 3D gồ nổi */}
              <line
                x1="0"
                y1="-92"
                x2="0"
                y2="-18"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Họa tiết tam giác lông công / văn răng lược xen kẽ giữa các đầu tia */}
              <polygon
                points="-12,-65 -16,-80 -10,-74"
                fill={`url(#${gradLightStroke})`}
              />
              <circle cx="-13" cy="-73" r="1.2" fill="#FFFFFF" />
            </g>
          );
        })}
      </g>

      {/* Vòng viền bóng ngoài cùng */}
      <circle
        cx="300"
        cy="300"
        r="298"
        stroke={`url(#${gradBronze})`}
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
    </svg>
  );

  // If not animated, return clean crisp component
  if (!animated) {
    return (
      <div className={`relative ${className} select-none`}>
        {DrumSVGLayers}
      </div>
    );
  }

  // Multi-tier animated & interactive 3D drum with smooth 120fps rotation and radiant golden bloom
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
              scale: 1.03,
              transition: { duration: 0.35, ease: 'easeOut' },
            }
          : undefined
      }
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      {/* ----------------------------------------------------------------- */}
      {/* LAYER 1: AMBIENT GOLDEN BLOOM (CSS GPU-Accelerated, zero frame lag)*/}
      {/* ----------------------------------------------------------------- */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-radial from-amber-400/40 via-yellow-600/15 to-transparent blur-xl pointer-events-none -z-10 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.8 : 0.45 }}
        />
      )}

      {/* ----------------------------------------------------------------- */}
      {/* LAYER 2: ULTRA-SMOOTH CONTINUOUS ROTATION (HARDWARE ACCELERATED)  */}
      {/* ----------------------------------------------------------------- */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 90 / speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-full h-full relative"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {DrumSVGLayers}
      </motion.div>

      {/* ----------------------------------------------------------------- */}
      {/* LAYER 3: CRISP POLISHED RIM HIGHLIGHT                             */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="absolute inset-0 rounded-full border border-amber-300/40 pointer-events-none shadow-[inset_0_0_15px_rgba(245,158,11,0.25)] transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0.6 }}
      />
    </motion.div>
  );
};

export default DongSonDrumMandala;
