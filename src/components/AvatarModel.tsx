import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WardrobeItem, FabricOption, ColorOption } from '../data/vietPhucData';
import { DongSonDrumMandala } from './VietnameseDecorativeElements';
import { CelestialSilkSash } from './SilkMotionElements';
import { Check, Camera, Box, Sparkles, Waves } from 'lucide-react';

interface AvatarModelProps {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabric: FabricOption;
  color: ColorOption;
  harmonyScore?: number;
  harmonyBadge?: string;
  harmonyCritique?: string;
  showCulturePins?: boolean;
  onDownloadPhoto?: () => void;
  hoveredItem?: WardrobeItem | null;
  isHoveringSilk?: boolean;
}

export const AvatarModel: React.FC<AvatarModelProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  harmonyScore = 95,
  harmonyCritique = 'Sự kết hợp hài hòa giữa Áo ngũ thân tay chẽn truyền thống và váy xếp ly hiện đại, giữ được nét thanh lịch nhưng vẫn năng động.',
  showCulturePins = true,
  onDownloadPhoto,
  hoveredItem = null,
  isHoveringSilk = false,
}) => {
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [activePin, setActivePin] = useState<'top' | 'accessory' | null>('top');

  const mainColor = color.hex || top.defaultColorHex || '#1B365D';
  const accentGold = '#D4AF37';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 1. Bronze Drum (Trống Đồng) Circular Mandala Glow in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <DongSonDrumMandala className="w-[380px] h-[380px] md:w-[480px] md:h-[480px]" opacity={0.35} />
        {/* Soft Ambient Radial Halo */}
        <div className="absolute w-[320px] h-[320px] rounded-full bg-radial from-amber-500/10 via-amber-900/5 to-transparent blur-2xl" />
      </div>

      {/* 2. Interactive Callout Pin: Mấn Đội Đầu (Top-Right) */}
      {showCulturePins && (
        <div className="absolute top-12 right-2 md:right-6 z-30 max-w-[210px] hidden sm:block animate-in fade-in duration-500">
          <div className="relative bg-[#0E1626]/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 shadow-2xl text-left">
            {/* Fine Golden Pointer Line to head */}
            <div className="absolute -left-10 top-5 w-10 h-[1.5px] bg-amber-400/70" />
            <div className="absolute -left-10 top-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                {accessory.name || 'Mấn đội đầu'}
              </h5>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans-vi">
              {accessory.cultureInfo?.origin ||
                'Áo ngũ thân quy chuẩn đi kèm mấn tròn quấn nhiều vòng, tạo nét trang trọng, đài các cho diện mạo.'}
            </p>
          </div>
        </div>
      )}

      {/* 3. Interactive Callout Pin: Áo Ngũ Thân (Left Side) */}
      {showCulturePins && (
        <div className="absolute top-36 left-2 md:left-6 z-30 max-w-[220px] hidden sm:block animate-in fade-in duration-500">
          <div className="relative bg-[#0E1626]/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 shadow-2xl text-left">
            {/* Fine Golden Pointer Line to chest */}
            <div className="absolute -right-10 top-6 w-10 h-[1.5px] bg-amber-400/70" />
            <div className="absolute -right-10 top-5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                {top.name}
              </h5>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans-vi">
              {top.cultureInfo?.symbolism ||
                'Áo ngũ thân tay chẽn tôn nét đẹp đoan trang, kín đáo với 5 thân áo tượng trưng cho tứ thân phụ mẫu và bản thân.'}
            </p>
          </div>
        </div>
      )}

      {/* 4. AI Harmony Badge & Critique Box (Bottom-Right of Avatar) */}
      <div className="absolute bottom-14 right-2 md:right-8 z-30 max-w-[240px] hidden sm:block animate-in fade-in duration-500">
        <div className="rounded-xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-[#092018]/85 backdrop-blur-md text-left">
          {/* Header pill */}
          <div className="bg-emerald-600/90 text-emerald-50 px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÁNH GIÁ SỰ HÀI HÒA</span>
          </div>
          {/* Content */}
          <div className="p-2.5 text-emerald-100">
            <div className="font-bold text-[12px] text-emerald-300 font-serif-vi mb-1">
              Phối đồ xuất sắc ({harmonyScore} điểm)
            </div>
            <p className="text-[10px] leading-relaxed text-emerald-100/90 font-sans-vi">
              "{harmonyCritique}"
            </p>
          </div>
        </div>
      </div>

      {/* 5. Main Character 3D-styled SVG Mannequin */}
      <div
        className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[480px] sm:h-[530px] flex items-center justify-center transition-all duration-500"
        style={{
          transform: viewMode === '3D' ? 'perspective(900px) rotateY(-4deg)' : 'none',
        }}
      >
        {/* Soft Shadow on Floor */}
        <div className="absolute bottom-4 w-44 h-6 bg-black/40 blur-md rounded-full pointer-events-none" />

        <svg viewBox="0 0 380 640" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            {/* Brocade Fabric Texture */}
            <pattern id="avatarBrocade" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.2" fill={accentGold} opacity="0.35" />
              <path
                d="M10 2 L18 10 L10 18 L2 10 Z"
                fill="none"
                stroke={accentGold}
                strokeWidth="0.6"
                opacity="0.25"
              />
            </pattern>

            {/* Skirt Pleat Texture */}
            <linearGradient id="pleatShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EDE6D6" />
              <stop offset="50%" stopColor="#FAF7F0" />
              <stop offset="100%" stopColor="#DFD6C2" />
            </linearGradient>

            {/* Skin Tone Gradient */}
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9E6DA" />
              <stop offset="100%" stopColor="#E2C2AE" />
            </linearGradient>

            {/* Gold Button Glow */}
            <radialGradient id="buttonGold">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6623" />
            </radialGradient>
          </defs>

          {/* ===== BASE BODY & HEAD ===== */}
          {/* Neck */}
          <path d="M184 95 L184 125 L196 125 L196 95 Z" fill="url(#skinTone)" />

          {/* Serene Vietnamese Face */}
          <ellipse cx="190" cy="85" rx="22" ry="26" fill="url(#skinTone)" />
          {/* Eyes & Eyebrows */}
          <path d="M178 82 Q183 80 186 82" stroke="#4A342B" strokeWidth="1.2" fill="none" />
          <path d="M194 82 Q197 80 202 82" stroke="#4A342B" strokeWidth="1.2" fill="none" />
          <path d="M179 85 Q183 87 186 85" stroke="#2B1D16" strokeWidth="1.5" fill="none" />
          <path d="M194 85 Q197 87 201 85" stroke="#2B1D16" strokeWidth="1.5" fill="none" />
          {/* Gentle Smile */}
          <path d="M187 98 Q190 101 193 98" stroke="#A84848" strokeWidth="1.4" fill="none" />

          {/* Hair Base */}
          <ellipse cx="190" cy="72" rx="30" ry="24" fill="#171514" />

          {/* ===== HEADGEAR: MẤN ĐỘI ĐẦU ===== */}
          <g id="manDoiDau">
            {/* Classical round wrapped mấn coronet */}
            <ellipse cx="190" cy="66" rx="34" ry="16" fill="#142136" stroke="#D4AF37" strokeWidth="1.2" />
            <ellipse cx="190" cy="62" rx="32" ry="14" fill="#1C2D47" />
            {/* Wrapped silk bands */}
            <path d="M160 66 Q190 52 220 66" stroke="#D4AF37" strokeWidth="1" opacity="0.6" fill="none" />
            <path d="M164 68 Q190 56 216 68" stroke="#0F172A" strokeWidth="1.5" fill="none" />
            {/* Center pearl / gold jewel */}
            <circle cx="190" cy="74" r="2.5" fill="#FDE68A" stroke="#B45309" strokeWidth="0.8" />
          </g>

          {/* ===== BOTTOM LAYER: PLEATED SKIRT (VÁY XẾP LY) OR PANTS ===== */}
          <motion.g
            id="skirtOrPants"
            animate={
              isHoveringSilk
                ? {
                    rotate: [-1.2, 1.2, -1.2],
                    skewX: [-1.4, 1.4, -1.4],
                    y: [0, -3.5, 0],
                  }
                : {
                    rotate: [-0.3, 0.3, -0.3],
                    y: [0, -1, 0],
                  }
            }
            transition={{
              duration: isHoveringSilk ? 2.2 : 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {bottom.id === 'vay-xep-ly' ? (
              // Cream / Ivory Pleated Midi Skirt as shown in mockup
              <g id="pleatedSkirt">
                <path
                  d="M152 320 L130 520 Q190 530 250 520 L228 320 Z"
                  fill="url(#pleatShade)"
                  stroke="#C7BC9F"
                  strokeWidth="0.8"
                />
                {/* Crisp Vertical Pleats */}
                {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((offset, i) => (
                  <line
                    key={i}
                    x1={190 + offset * 0.75}
                    y1={322}
                    x2={190 + offset * 1.25}
                    y2={520}
                    stroke="rgba(160, 140, 110, 0.35)"
                    strokeWidth="1.2"
                  />
                ))}
                {/* Hemline shadow */}
                <path d="M130 520 Q190 530 250 520" stroke="#B0A282" strokeWidth="1.5" fill="none" />
              </g>
            ) : (
              // Silk Wide Pants (Quần Ống Sớ)
              <g id="silkPants">
                <path
                  d="M150 310 L132 530 L185 530 L190 380 L195 380 L200 530 L248 530 L230 310 Z"
                  fill={bottom.defaultColorHex || '#FAF7F0'}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1"
                />
                <path d="M155 350 Q152 450 148 525" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
                <path d="M225 350 Q228 450 232 525" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {/* Legs & Black Pumps / Shoes (Giày Cao Gót / Hài Đen) */}
            <g id="shoesAndLegs">
              {/* Lower Legs */}
              <rect x="168" y="520" width="10" height="42" rx="4" fill="url(#skinTone)" />
              <rect x="202" y="520" width="10" height="42" rx="4" fill="url(#skinTone)" />
              {/* Black Shoes */}
              <path d="M165 560 Q173 558 184 562 L182 570 L163 568 Z" fill="#1C1917" />
              <path d="M215 560 Q207 558 196 562 L198 570 L217 568 Z" fill="#1C1917" />
            </g>
          </motion.g>

          {/* ===== TOP LAYER: ÁO NGŨ THÂN TAY CHẼN (XANH THẪM GẤM) ===== */}
          <motion.g
            id="aoNguthantaychen"
            animate={
              isHoveringSilk
                ? {
                    rotate: [0.8, -0.8, 0.8],
                    skewX: [1, -1, 1],
                    y: [-1, 2, -1],
                  }
                : {
                    rotate: [0.2, -0.2, 0.2],
                    y: [0, 0.5, 0],
                  }
            }
            transition={{
              duration: isHoveringSilk ? 2.6 : 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Left & Right Fitted Sleeves (Tay Chẽn) */}
            <path
              d="M156 130 L120 220 L132 320 L152 280 L160 160 Z"
              fill={mainColor}
              stroke="#0D1B2A"
              strokeWidth="0.8"
            />
            <path
              d="M224 130 L260 220 L248 320 L228 280 L220 160 Z"
              fill={mainColor}
              stroke="#0D1B2A"
              strokeWidth="0.8"
            />

            {/* Main Robe Body */}
            <path
              d="M158 126 L222 126 L232 400 Q190 408 148 400 Z"
              fill={mainColor}
              stroke="#0D1B2A"
              strokeWidth="1"
            />

            {/* Brocade overlay texture */}
            <path
              d="M158 126 L222 126 L232 400 Q190 408 148 400 Z"
              fill="url(#avatarBrocade)"
            />

            {/* Mandarin Standing Collar (Cổ Đứng Lập Lĩnh) */}
            <path
              d="M182 120 Q190 123 198 120 L198 132 Q190 135 182 132 Z"
              fill="#D4AF37"
              stroke="#78350F"
              strokeWidth="0.8"
            />

            {/* Diagonal Opening Placket & 5 Frog Buttons (Cúc Cài Chéo) */}
            <path
              d="M195 132 Q202 155 212 175 L210 330"
              stroke="rgba(212, 175, 55, 0.6)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* The 5 Gold Buttons */}
            {[132, 150, 170, 192, 218].map((y, i) => (
              <g key={i}>
                <circle cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#buttonGold)" />
                <circle cx={195 + i * 3.5} cy={y} r="1" fill="#FFFFFF" opacity="0.6" />
              </g>
            ))}

            {/* Subtle Silk Highlight on Chest */}
            <path
              d="M165 136 Q190 142 215 136 L218 260 Q190 270 162 260 Z"
              fill="white"
              opacity="0.05"
            />
          </motion.g>

          {/* Serene Hands Resting at Sides */}
          <path d="M129 320 Q126 335 131 340 L135 338 L133 320 Z" fill="url(#skinTone)" />
          <path d="M251 320 Q254 335 249 340 L245 338 L247 320 Z" fill="url(#skinTone)" />
        </svg>

        {/* Celestial Silk Sash Fluttering Around Avatar */}
        <CelestialSilkSash
          isHovering={isHoveringSilk}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Floating Silk Tactile Toast Feedback on Hover */}
        <AnimatePresence>
          {isHoveringSilk && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-16 z-30 px-3.5 py-1.5 rounded-full bg-[#0B1324]/95 backdrop-blur-md border border-amber-400/60 shadow-[0_4px_24px_rgba(245,158,11,0.25)] flex items-center gap-2 text-xs font-serif-vi text-amber-200 pointer-events-none"
            >
              <Waves className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>
                {hoveredItem ? `Độ rủ lụa: ${hoveredItem.name}` : 'Cảm nhận độ rủ tơ lụa mềm mại'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Bottom Floating Toolbar (Tải ảnh cả chân & Xem 2D/3D) */}
      <div className="absolute bottom-3 z-30 flex items-center gap-3">
        <button
          onClick={onDownloadPhoto}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#131C2E]/90 hover:bg-[#1C2840] text-slate-200 border border-slate-700/80 hover:border-amber-400/50 shadow-lg flex items-center gap-1.5 transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Tải ảnh cả chân</span>
        </button>

        <button
          onClick={() => setViewMode(viewMode === '3D' ? '2D' : '3D')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#131C2E]/90 hover:bg-[#1C2840] text-slate-200 border border-slate-700/80 hover:border-amber-400/50 shadow-lg flex items-center gap-1.5 transition-all"
        >
          <Box className="w-3.5 h-3.5 text-amber-400" />
          <span>Xem {viewMode === '3D' ? '3D' : '2D'}</span>
        </button>
      </div>
    </div>
  );
};
