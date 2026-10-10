import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WardrobeItem, FabricOption, ColorOption } from '../data/vietPhucData';
import { DongSonDrumMandala } from './VietnameseDecorativeElements';
import { CelestialSilkSash } from './SilkMotionElements';
import { Waves, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { evaluateCulturalRules } from '../utils/culturalRules';

export interface GarmentVisualProfile {
  baseColor: string;
  accentGold: string;
  collarType:
    | 'nhat-binh'
    | 'lap-linh'
    | 'giao-linh'
    | 'vien-linh'
    | 'doi-kham'
    | 'tu-than'
    | 'ao-ba-ba'
    | 'dong-son';
  sleeveType: 'tay-thung' | 'tay-chen' | 'dong-son';
  bottomColor: string;
  bottomType: 'quan-bach' | 'quan-men-lam' | 'quan-gam-vang' | 'quan-den' | 'vay-den' | 'vay-xep-ly' | 'dong-son' | 'quan-tay';
  headpieceType: 'khan-dong' | 'man-vang' | 'man-den' | 'non-ba-tam' | 'non-la' | 'khan-ran';
  chestMotif:
    | 'dragon-long-van'
    | 'phoenix-phung'
    | 'mandarin-crane'
    | 'yem-dao'
    | 'dong-son-sun'
    | 'baba-placket'
    | 'lap-linh-buttons'
    | 'doi-kham-lapels';
  hasFiveColorCuffs?: boolean;
  hasThuyBaHem?: boolean;
  hasChestRibbons?: boolean;
  hasKhanRan?: boolean;
}

export const GARMENT_VISUAL_PROFILES: Record<string, GarmentVisualProfile> = {
  'nhat-binh-nam': {
    baseColor: '#B31D28',
    accentGold: '#F59E0B',
    collarType: 'nhat-binh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'dragon-long-van',
    hasFiveColorCuffs: true,
    hasThuyBaHem: true,
    hasChestRibbons: true,
  },
  'nhat-binh': {
    baseColor: '#84161C',
    accentGold: '#D4AF37',
    collarType: 'nhat-binh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'man-vang',
    chestMotif: 'phoenix-phung',
    hasFiveColorCuffs: true,
    hasThuyBaHem: true,
    hasChestRibbons: true,
  },
  'ao-tac': {
    baseColor: '#781419',
    accentGold: '#D4AF37',
    collarType: 'lap-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'lap-linh-buttons',
    hasThuyBaHem: true,
  },
  'ao-tac-nu': {
    baseColor: '#9C1A2E',
    accentGold: '#D4AF37',
    collarType: 'lap-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'man-vang',
    chestMotif: 'lap-linh-buttons',
    hasThuyBaHem: true,
  },
  'ngu-than': {
    baseColor: '#162544',
    accentGold: '#D4AF37',
    collarType: 'lap-linh',
    sleeveType: 'tay-chen',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'lap-linh-buttons',
  },
  'ngu-than-nu': {
    baseColor: '#8C1D24',
    accentGold: '#D4AF37',
    collarType: 'lap-linh',
    sleeveType: 'tay-chen',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'man-den',
    chestMotif: 'lap-linh-buttons',
  },
  'giao-linh': {
    baseColor: '#F2EDE4',
    accentGold: '#244B3B',
    collarType: 'giao-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'lap-linh-buttons',
  },
  'giao-linh-nu': {
    baseColor: '#165566',
    accentGold: '#D4AF37',
    collarType: 'giao-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#8B1E1E',
    bottomType: 'vay-xep-ly',
    headpieceType: 'man-den',
    chestMotif: 'yem-dao',
  },
  'vien-linh': {
    baseColor: '#122036',
    accentGold: '#D4AF37',
    collarType: 'vien-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'mandarin-crane',
  },
  'vien-linh-nu': {
    baseColor: '#54254E',
    accentGold: '#D4AF37',
    collarType: 'vien-linh',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'man-vang',
    chestMotif: 'mandarin-crane',
  },
  'doi-kham': {
    baseColor: '#982121',
    accentGold: '#D4AF37',
    collarType: 'doi-kham',
    sleeveType: 'tay-thung',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'man-vang',
    chestMotif: 'doi-kham-lapels',
  },
  'tu-than': {
    baseColor: '#423429',
    accentGold: '#D83A56',
    collarType: 'tu-than',
    sleeveType: 'tay-chen',
    bottomColor: '#1D1B1A',
    bottomType: 'vay-den',
    headpieceType: 'non-ba-tam',
    chestMotif: 'yem-dao',
  },
  'dong-son': {
    baseColor: '#724122',
    accentGold: '#F59E0B',
    collarType: 'dong-son',
    sleeveType: 'dong-son',
    bottomColor: '#724122',
    bottomType: 'dong-son',
    headpieceType: 'khan-dong',
    chestMotif: 'dong-son-sun',
  },
  'ao-ba-ba-nu': {
    baseColor: '#256F52',
    accentGold: '#FAF7F0',
    collarType: 'ao-ba-ba',
    sleeveType: 'tay-chen',
    bottomColor: '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-ran',
    chestMotif: 'baba-placket',
    hasKhanRan: true,
  },
  'ao-ba-ba-nam': {
    baseColor: '#3E3129',
    accentGold: '#FAF7F0',
    collarType: 'ao-ba-ba',
    sleeveType: 'tay-chen',
    bottomColor: '#1E1C1A',
    bottomType: 'quan-den',
    headpieceType: 'khan-ran',
    chestMotif: 'baba-placket',
    hasKhanRan: true,
  },
};

interface AvatarModelProps {
  top?: WardrobeItem | null;
  bottom?: WardrobeItem | null;
  accessory?: WardrobeItem | null;
  fabric?: FabricOption;
  color?: ColorOption;
  topCustomColor?: string;
  bottomCustomColor?: string;
  harmonyScore?: number;
  harmonyBadge?: string;
  harmonyCritique?: string;
  showCulturePins?: boolean;
  onDownloadPhoto?: () => void;
  hoveredItem?: WardrobeItem | null;
  isHoveringSilk?: boolean;
  hideOverlays?: boolean;
  onViolationClick?: () => void;
}

export const AvatarModel: React.FC<AvatarModelProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  topCustomColor,
  bottomCustomColor,
  harmonyScore,
  harmonyBadge,
  harmonyCritique,
  showCulturePins = true,
  hoveredItem = null,
  isHoveringSilk = false,
  hideOverlays = false,
  onViolationClick,
}) => {
  const [hoveredPin, setHoveredPin] = useState<'accessory' | 'garment' | 'bottom' | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Active items accounting for real-time hover preview
  const activeGarment = hoveredItem && hoveredItem.category === 'top' ? hoveredItem : top;
  const activeBottom = hoveredItem && hoveredItem.category === 'bottom' ? hoveredItem : bottom;
  const activeAccessory = hoveredItem && hoveredItem.category === 'accessory' ? hoveredItem : accessory;

  // Retrieve exact visual profile matching the photo
  const profile = (activeGarment && GARMENT_VISUAL_PROFILES[activeGarment.id]) || {
    baseColor: activeGarment?.defaultColorHex || '#162544',
    accentGold: '#D4AF37',
    collarType: 'lap-linh',
    sleeveType: 'tay-chen',
    bottomColor: activeBottom?.defaultColorHex || '#FAF7F0',
    bottomType: 'quan-bach',
    headpieceType: 'khan-dong',
    chestMotif: 'lap-linh-buttons',
  };

  // Garment primary and secondary colors (prioritize custom top color, keep pattern/motifs)
  const garmentColor = topCustomColor || profile.baseColor;
  const goldColor = profile.accentGold || '#D4AF37';

  // Fabric texture visual weighting
  const brocadeOpacity =
    fabric?.id === 'gam-cung-dinh'
      ? '0.65'
      : fabric?.id === 'sa-nam-bo'
      ? '0.35'
      : fabric?.id === 'dui-to-tam'
      ? '0.2'
      : '0.45';

  // Active bottom color & type determination
  const bottomType = activeBottom
    ? activeBottom.id === 'vay-xep-ly' || activeBottom.id === 'thuong-dai-viet-nu'
      ? 'vay-xep-ly'
      : activeBottom.id === 'quan-men-lam'
      ? 'quan-men-lam'
      : activeBottom.id === 'quan-gam-vang'
      ? 'quan-gam-vang'
      : activeBottom.id === 'quan-tay-hien-dai'
      ? 'quan-tay'
      : activeBottom.id === 'vay-den' || activeBottom.id === 'vay-den-kinh-bac-nu'
      ? 'vay-den'
      : activeBottom.id === 'dong-son' || activeBottom.id.includes('dong-son')
      ? 'dong-son'
      : profile.bottomType
    : null;

  const defaultTrousersColor =
    bottomType === 'vay-xep-ly'
      ? activeBottom?.defaultColorHex || '#8B1E1E'
      : bottomType === 'quan-men-lam'
      ? '#1F4E5B'
      : bottomType === 'quan-gam-vang'
      ? '#D4AF37'
      : bottomType === 'quan-tay'
      ? '#262423'
      : bottomType === 'vay-den'
      ? '#1D1B1A'
      : bottomType === 'dong-son'
      ? '#724122'
      : (activeBottom?.defaultColorHex || profile.bottomColor);

  const trousersColor = bottomCustomColor || defaultTrousersColor;

  // Real-time cultural check for alert icon on avatar
  const culturalEvaluation = evaluateCulturalRules({
    top: activeGarment || null,
    bottom: activeBottom || null,
    accessory: activeAccessory || null,
    topColorHex: garmentColor,
    bottomColorHex: trousersColor,
  });

  const hasCriticalViolation = culturalEvaluation.violations.some((v) => v.severity === 'critical');
  const isCompletelyBare = !activeGarment && !activeBottom && !activeAccessory;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 1. Bronze Drum (Trống Đồng) Circular Mandala Glow in Background */}
      {!hideOverlays && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <DongSonDrumMandala
            className="w-[380px] h-[380px] md:w-[480px] md:h-[480px]"
            opacity={0.22}
          />
          <div className="absolute w-[360px] h-[360px] rounded-full bg-radial from-amber-500/10 via-amber-900/5 to-transparent blur-3xl" />
        </div>
      )}

      {/* 2. Bare Mannequin Status Guidance Badge */}
      {!hideOverlays && isCompletelyBare && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 z-30 px-3 py-1.5 rounded-full bg-[#0E1626]/90 border border-amber-400/50 backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-[11px] font-medium text-amber-200 font-sans-vi">
            Khung Ma Nơ Canh Mộc — Chọn y phục bên phải để bắt đầu mặc
          </span>
        </motion.div>
      )}

      {/* 3. Cultural Violation Floating Warning Badge */}
      {!hideOverlays && hasCriticalViolation && (
        <motion.button
          onClick={onViolationClick}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="absolute top-4 left-3 sm:top-5 sm:left-4 z-40 px-3 py-1.5 rounded-xl bg-rose-950/95 border border-rose-500/80 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-auto cursor-pointer hover:border-rose-400 hover:bg-rose-900/90 transition-all text-left group"
          title="Bấm để xem chi tiết điều cấm kỵ & sửa tự động"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 group-hover:scale-110 animate-pulse shrink-0" />
          <div className="text-left">
            <div className="text-[10px] font-bold text-rose-300 uppercase font-sans-vi flex items-center gap-1">
              <span>⚠️ Cảnh Báo Cấm Kỵ</span>
              <span className="text-[9px] text-rose-400 underline font-normal">Sửa ngay</span>
            </div>
            <div className="text-[11px] text-rose-100 font-sans-vi max-w-[280px] leading-tight font-medium">
              {culturalEvaluation.violations[0].title}
            </div>
          </div>
        </motion.button>
      )}

      {/* 4. Interactive Cultural Callout Hotspots */}
      {showCulturePins && !hideOverlays && (
        <>
          {/* Phụ Kiện (Top-Right) */}
          {activeAccessory && (
            <div
              className="absolute top-10 right-3 sm:right-8 z-30 flex items-center"
              onMouseEnter={() => setHoveredPin('accessory')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div
                className="group relative flex items-center gap-1.5 p-1.5 rounded-full cursor-pointer"
                title="Rê chuột để xem thông tin Phụ kiện"
              >
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#F59E0B] group-hover:scale-125 transition-transform" />
                </span>
                <span className="text-[10.5px] font-medium text-amber-300/80 group-hover:text-amber-200 transition-colors hidden sm:inline select-none">
                  {activeAccessory.name}
                </span>
              </div>

              <AnimatePresence>
                {hoveredPin === 'accessory' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-8 right-0 z-40 w-56 sm:w-64 bg-[#0E1626]/95 backdrop-blur-md border border-amber-400/50 rounded-xl p-3 shadow-2xl text-left pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                        {activeAccessory.name}
                      </h5>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans-vi">
                      {activeAccessory.cultureInfo?.origin ||
                        activeAccessory.summary ||
                        'Phụ kiện truyền thống tinh xảo, tôn vinh nét đoan trang đài các của phục sức Việt.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Cổ Phục Chuẩn Khớp (Left Side) */}
          {activeGarment && (
            <div
              className="absolute top-36 left-3 sm:left-8 z-30 flex items-center"
              onMouseEnter={() => setHoveredPin('garment')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div
                className="group relative flex items-center gap-1.5 p-1.5 rounded-full cursor-pointer"
                title="Rê chuột để xem thông tin Cổ phục"
              >
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#F59E0B] group-hover:scale-125 transition-transform" />
                </span>
                <span className="text-[10.5px] font-medium text-amber-300/80 group-hover:text-amber-200 transition-colors hidden sm:inline select-none">
                  {activeGarment.name}
                </span>
              </div>

              <AnimatePresence>
                {hoveredPin === 'garment' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-8 left-0 z-40 w-56 sm:w-64 bg-[#0E1626]/95 backdrop-blur-md border border-amber-400/50 rounded-xl p-3 shadow-2xl text-left pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                        {activeGarment.name}
                      </h5>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans-vi">
                      {activeGarment.cultureInfo?.symbolism ||
                        'Bản vẽ 2D đồng bộ hoàn hảo màu sắc, phom dáng và hoa văn thêu từ ảnh cổ phục thực tế.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Hạ Y / Quần / Váy (Bottom-Right) */}
          {activeBottom && (
            <div
              className="absolute bottom-24 right-3 sm:right-8 z-30 flex items-center"
              onMouseEnter={() => setHoveredPin('bottom')}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <div
                className="group relative flex items-center gap-1.5 p-1.5 rounded-full cursor-pointer"
                title="Rê chuột để xem thông tin Hạ y"
              >
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_8px_#F59E0B] group-hover:scale-125 transition-transform" />
                </span>
                <span className="text-[10.5px] font-medium text-amber-300/80 group-hover:text-amber-200 transition-colors hidden sm:inline select-none">
                  {activeBottom.name}
                </span>
              </div>

              <AnimatePresence>
                {hoveredPin === 'bottom' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-8 right-0 z-40 w-56 sm:w-64 bg-[#0E1626]/95 backdrop-blur-md border border-amber-400/50 rounded-xl p-3 shadow-2xl text-left pointer-events-auto"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                        {activeBottom.name}
                      </h5>
                    </div>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed font-sans-vi">
                      {activeBottom.summary ||
                        activeBottom.cultureInfo?.symbolism ||
                        'Trang phục hạ y phối hợp chuẩn mực theo quy cách di sản truyền thống.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ========================================================
          5. BẢN VẼ 2D SIÊU CHI TIẾT: HOA VĂN, NẾP GẤP, 16 PHỤ KIỆN
         ======================================================== */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[500px] sm:h-[550px] flex items-center justify-center">
        {/* Soft Floor Shadow */}
        <div className="absolute bottom-3 w-52 h-6 bg-black/60 blur-md rounded-full pointer-events-none" />

        <svg
          ref={svgRef}
          viewBox="0 0 380 640"
          className="w-full h-full drop-shadow-[0_16px_44px_rgba(0,0,0,0.85)] overflow-visible"
        >
          <defs>
            {/* Skin Tone Gradient for Illustrated Model */}
            <linearGradient id="skinTone2D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDF0E6" />
              <stop offset="100%" stopColor="#DFC0AF" />
            </linearGradient>

            {/* Subtle Base Silk Camisole / Under-garment when Bare */}
            <linearGradient id="undergarmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBF7EE" />
              <stop offset="100%" stopColor="#E2DDD2" />
            </linearGradient>

            {/* Gold Button Radial Gradient */}
            <radialGradient id="goldButtonGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF8D6" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>

            {/* Jade Stone Gradient */}
            <radialGradient id="jadeStoneGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="90%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>

            {/* Silk Sheen Overlay */}
            <linearGradient id="silkShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            {/* Cloud Brocade (Gấm Vân Mây) Pattern */}
            <pattern id="cloudBrocadePattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M8 20 Q14 12 20 20 Q26 12 32 20 Q22 28 8 20 Z M4 35 Q10 28 16 35 Q10 40 4 35 Z M24 6 Q30 0 36 6 Q30 11 24 6 Z"
                fill="none"
                stroke={goldColor}
                strokeWidth="0.75"
                opacity="0.32"
              />
            </pattern>

            {/* Khăn Rằn Checkered Pattern */}
            <pattern id="khanRanPattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="#202020" />
              <rect x="4" width="4" height="4" fill="#F8F8F8" />
              <rect y="4" width="4" height="4" fill="#F8F8F8" />
              <rect x="4" y="4" width="4" height="4" fill="#202020" />
            </pattern>

            {/* Thủy Ba (Wave Pattern) Gradient for Hem */}
            <linearGradient id="thuyBaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor={goldColor} stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B1E1E" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* ===== 1. LOWER GARMENT (QUẦN / VÁY) & GIÀY HÀI ===== */}
          <g
            id="lower-garment-layer"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPin('bottom')}
            onMouseLeave={() => setHoveredPin(null)}
          >
            {/* Giày Hài Thêu Mũi Cong (Traditional Shoes) */}
            <g id="traditional-shoes">
              {/* Left Shoe */}
              <path
                d="M156 565 L174 565 Q178 574 168 575 L154 573 Q152 568 156 565 Z"
                fill="#2A1B16"
                stroke={goldColor}
                strokeWidth="0.8"
              />
              <circle cx="170" cy="569" r="1.2" fill={goldColor} />
              {/* Right Shoe */}
              <path
                d="M206 565 L224 565 Q228 574 218 575 L204 573 Q202 568 206 565 Z"
                fill="#2A1B16"
                stroke={goldColor}
                strokeWidth="0.8"
              />
              <circle cx="220" cy="569" r="1.2" fill={goldColor} />
            </g>

            {/* Skirt or Trousers */}
            {activeBottom ? (
              bottomType === 'vay-xep-ly' ? (
                /* Chân Váy Xếp Ly Thêu Thủy Ba (Giao Lĩnh Nữ, Áo Yếm) */
                <g id="vay-xep-ly-mesh">
                  <path
                    d="M158 240 L126 565 Q190 576 254 565 L222 240 Z"
                    fill={trousersColor}
                    stroke="#4A1515"
                    strokeWidth="0.8"
                  />
                  {/* Pleats (nếp gấp xếp ly 3D) */}
                  {[-55, -40, -25, -10, 5, 20, 35, 50].map((offset, i) => (
                    <g key={i}>
                      <path
                        d={`M${190 + offset * 0.4} 245 L${190 + offset * 1.15} 565`}
                        stroke="rgba(0, 0, 0, 0.28)"
                        strokeWidth="1.4"
                      />
                      <path
                        d={`M${190 + offset * 0.4 + 1.2} 245 L${190 + offset * 1.15 + 1.2} 565`}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="0.8"
                      />
                    </g>
                  ))}
                  {/* Thủy Ba wave border at skirt hem */}
                  <path
                    d="M126 558 Q158 566 190 560 Q222 566 254 558"
                    stroke={goldColor}
                    strokeWidth="2.2"
                    fill="none"
                  />
                  <path
                    d="M127 563 Q158 571 190 565 Q222 571 253 563"
                    stroke={goldColor}
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.8"
                  />
                </g>
              ) : bottomType === 'vay-den' ? (
                /* Váy The Đen Dân Gian (Tứ Thân) */
                <g id="vay-den-tu-than">
                  <path
                    d="M158 240 L136 565 Q190 574 244 565 L222 240 Z"
                    fill="#1D1B1A"
                    stroke="#100F0E"
                    strokeWidth="1"
                  />
                  {/* Folds */}
                  <path d="M166 250 L160 562" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                  <path d="M214 250 L220 562" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                  <path d="M190 250 L190 562" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                </g>
              ) : bottomType === 'dong-son' ? (
                /* Khố / Váy Đông Sơn (Văn hóa Trống Đồng) */
                <g id="dong-son-bottom">
                  <path
                    d="M156 240 L140 545 Q190 556 240 545 L224 240 Z"
                    fill="#663617"
                    stroke={goldColor}
                    strokeWidth="1.2"
                  />
                  {/* Vạt khố buông giữa thêu hoa văn chữ S và chim Lạc */}
                  <rect x="178" y="240" width="24" height="280" fill="#522B13" stroke={goldColor} strokeWidth="1" />
                  <path d="M140 535 L240 535" stroke={goldColor} strokeWidth="2" />
                  {[-36, -18, 0, 18, 36].map((x, i) => (
                    <circle key={i} cx={190 + x} cy={535} r="2.5" fill={goldColor} />
                  ))}
                </g>
              ) : (
                /* Quần Ống Sớ Lụa Bạch / Men Lam / Cung Đình */
                <g id="quan-ong-so-standard">
                  {/* Left Leg */}
                  <path
                    d="M158 240 L144 565 L188 565 L189 380 Z"
                    fill={trousersColor}
                    stroke="rgba(85, 78, 65, 0.4)"
                    strokeWidth="0.8"
                  />
                  {/* Right Leg */}
                  <path
                    d="M191 380 L192 565 L236 565 L222 240 Z"
                    fill={trousersColor}
                    stroke="rgba(85, 78, 65, 0.4)"
                    strokeWidth="0.8"
                  />
                  {/* Vertical crease lines (đường ly ống sớ) */}
                  <path d="M166 260 L164 558" stroke="rgba(0,0,0,0.14)" strokeWidth="1.2" />
                  <path d="M214 260 L216 558" stroke="rgba(0,0,0,0.14)" strokeWidth="1.2" />
                  {/* Ankle Gold Trims */}
                  <path d="M144 562 L188 562" stroke={goldColor} strokeWidth="1.4" opacity="0.6" />
                  <path d="M192 562 L236 562" stroke={goldColor} strokeWidth="1.4" opacity="0.6" />
                </g>
              )
            ) : (
              /* Mannequin neutral bare legs when lower garment is unselected */
              <g id="mannequin-bare-legs">
                <path
                  d="M166 240 L160 565 L186 565 L188 380 Z"
                  fill="url(#skinTone2D)"
                  stroke="#C8BEB0"
                  strokeWidth="0.8"
                />
                <path
                  d="M192 380 L194 565 L220 565 L214 240 Z"
                  fill="url(#skinTone2D)"
                  stroke="#C8BEB0"
                  strokeWidth="0.8"
                />
                {/* Minimalist under-shorts */}
                <path
                  d="M166 240 L162 290 Q190 295 218 290 L214 240 Z"
                  fill="url(#undergarmentGrad)"
                  stroke="#D1C7B7"
                  strokeWidth="0.8"
                />
              </g>
            )}
          </g>

          {/* ===== 2. ILLUSTRATED MANNEQUIN BODY (HEAD, NECK, ARMS, HANDS) ===== */}
          <g id="mannequin-body-layer">
            {/* Neck (Seamlessly connects to collar at Y: 124) */}
            <path d="M183 94 L183 126 L197 126 L197 94 Z" fill="url(#skinTone2D)" />

            {/* Face Oval Silhouette */}
            <ellipse cx="190" cy="74" rx="24" ry="29" fill="url(#skinTone2D)" />
            <path
              d="M166 74 Q190 102 214 74"
              fill="none"
              stroke="rgba(180, 120, 90, 0.28)"
              strokeWidth="0.8"
            />
            {/* Subtle eyes/brow contour for artistic 2D elegance */}
            <path d="M178 70 Q182 68 186 70" stroke="rgba(140, 90, 65, 0.45)" strokeWidth="0.8" fill="none" />
            <path d="M194 70 Q198 68 202 70" stroke="rgba(140, 90, 65, 0.45)" strokeWidth="0.8" fill="none" />
            {/* Gentle smile curve */}
            <path d="M186 85 Q190 88 194 85" stroke="rgba(180, 90, 70, 0.4)" strokeWidth="0.8" fill="none" />

            {/* Bare Under-Camisole / Torso when Top is unselected */}
            {!activeGarment && (
              <g id="bare-camisole-torso">
                <path
                  d="M180 124 L154 140 L148 245 Q190 252 232 245 L226 140 L200 124 Z"
                  fill="url(#undergarmentGrad)"
                  stroke="#D1C7B7"
                  strokeWidth="0.9"
                />
                {/* Camisole delicate stitching */}
                <path d="M180 124 Q190 135 200 124" stroke="#B8AFA0" strokeWidth="0.8" fill="none" />
                <path d="M190 135 L190 248" stroke="#D1C7B7" strokeWidth="0.8" strokeDasharray="3 3" />
              </g>
            )}

            {/* Mannequin Hands (Y: 305 to 335) */}
            <g id="mannequin-hands">
              {/* Left Hand */}
              <path
                d="M123 305 Q121 324 125 334 Q128 336 131 332 L133 306 Z"
                fill="url(#skinTone2D)"
                stroke="rgba(180, 120, 90, 0.3)"
                strokeWidth="0.6"
              />
              {/* Right Hand */}
              <path
                d="M257 305 Q259 324 255 334 Q252 336 249 332 L247 306 Z"
                fill="url(#skinTone2D)"
                stroke="rgba(180, 120, 90, 0.3)"
                strokeWidth="0.6"
              />
            </g>
          </g>

          {/* ===== 3. UPPER GARMENT (ÁO CỔ PHỤC SIÊU CHI TIẾT) ===== */}
          {activeGarment && (
            <motion.g
              id="authentic-top-garment"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPin('garment')}
              onMouseLeave={() => setHoveredPin(null)}
              animate={{
                filter: isHoveringSilk
                  ? 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.5))'
                  : 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.45))',
              }}
              transition={{ duration: 0.3 }}
            >
              {/* ========================================================
                  TYPE 1: ÁO TAY THỤNG (Nhật Bình Nam/Nữ, Áo Tấc Nam/Nữ, Viên Lĩnh, Giao Lĩnh, Đối Khâm)
                 ======================================================== */}
              {profile.sleeveType === 'tay-thung' ? (
                <g id="ao-tay-thung-group">
                  {/* Main Drooping Sleeve & Torso Silhouette */}
                  <path
                    d="M180 124 L142 142 L82 280 L82 345 L156 350 L162 235 L144 412 Q190 422 236 412 L218 235 L224 350 L298 345 L298 280 L238 142 L200 124 Z"
                    fill={garmentColor}
                    stroke={goldColor}
                    strokeWidth="1.5"
                  />

                  {/* Cloud Damask Pattern */}
                  <path
                    d="M180 124 L142 142 L82 280 L82 345 L156 350 L162 235 L144 412 Q190 422 236 412 L218 235 L224 350 L298 345 L298 280 L238 142 L200 124 Z"
                    fill="url(#cloudBrocadePattern)"
                    opacity={brocadeOpacity}
                  />

                  {/* Silk Sheen Overlay */}
                  <path
                    d="M180 124 L142 142 L82 280 L82 345 L156 350 L162 235 L144 412 Q190 422 236 412 L218 235 L224 350 L298 345 L298 280 L238 142 L200 124 Z"
                    fill="url(#silkShineGrad)"
                  />

                  {/* Cửa tay phối dải ngũ sắc ngũ hành trên Nhật Bình (Kim, Mộc, Thủy, Hỏa, Thổ) */}
                  {profile.hasFiveColorCuffs && (
                    <g id="tay-ao-ngu-sac">
                      {/* Left Sleeve 5 Color Stripes */}
                      <path d="M82 280 L82 293 L150 293 L150 280 Z" fill="#1F5A46" />
                      <path d="M82 293 L82 306 L150 306 L150 293 Z" fill="#D4AF37" />
                      <path d="M82 306 L82 319 L150 319 L150 306 Z" fill="#FAF7F0" />
                      <path d="M82 319 L82 332 L150 332 L150 319 Z" fill="#9E1A2E" />
                      <path d="M82 332 L82 345 L156 345 L156 332 Z" fill="#1A1A1A" />
                      <path d="M82 280 L82 345" stroke={goldColor} strokeWidth="1.4" />

                      {/* Right Sleeve 5 Color Stripes */}
                      <path d="M298 280 L298 293 L230 293 L230 280 Z" fill="#1F5A46" />
                      <path d="M298 293 L298 306 L230 306 L230 293 Z" fill="#D4AF37" />
                      <path d="M298 306 L298 319 L230 319 L230 306 Z" fill="#FAF7F0" />
                      <path d="M298 319 L298 332 L230 332 L230 319 Z" fill="#9E1A2E" />
                      <path d="M298 332 L298 345 L224 345 L224 332 Z" fill="#1A1A1A" />
                      <path d="M298 280 L298 345" stroke={goldColor} strokeWidth="1.4" />
                    </g>
                  )}

                  {/* Thủy Ba (Sóng Nước Tam Sơn) ở Gấu Áo */}
                  {profile.hasThuyBaHem && (
                    <g id="thuy-ba-hem">
                      <path
                        d="M144 395 Q190 405 236 395 L236 412 Q190 422 144 412 Z"
                        fill="url(#thuyBaGrad)"
                        stroke={goldColor}
                        strokeWidth="1.6"
                      />
                      {/* Tam Sơn (Núi Ba Đỉnh) giữa sóng */}
                      <path
                        d="M182 410 L190 398 L198 410 Z"
                        fill="#D4AF37"
                        stroke="#8A6623"
                        strokeWidth="0.8"
                      />
                      {/* Lớp bọt sóng uốn lượn */}
                      <path
                        d="M148 404 Q168 398 190 404 Q212 398 232 404"
                        stroke="#FAF7F0"
                        strokeWidth="0.9"
                        fill="none"
                        opacity="0.85"
                      />
                    </g>
                  )}

                  {/* CỔ NHẬT BÌNH & LONG VÂN ĐẠI HỘI / PHỤNG HOÀNG */}
                  {profile.collarType === 'nhat-binh' ? (
                    <g id="collar-nhat-binh-authentic">
                      {/* Rectangular Collar Brocade Frame */}
                      <path
                        d="M174 124 L206 124 L208 198 L172 198 Z"
                        fill="#2A0B0E"
                        stroke={goldColor}
                        strokeWidth="2.2"
                      />
                      <path
                        d="M178 126 L202 126 L204 194 L176 194 Z"
                        fill="none"
                        stroke="#FDE68A"
                        strokeWidth="1"
                      />
                      {/* Cúc cài cổ và hoa văn cổ đồ */}
                      <circle cx="190" cy="144" r="3.5" fill="url(#goldButtonGrad)" />
                      <circle cx="190" cy="172" r="3.2" fill="url(#goldButtonGrad)" />

                      {/* Hai dải thắt ngực buông rủ dài xuống tận gấu */}
                      {profile.hasChestRibbons && (
                        <g id="chest-ribbons">
                          {/* Left Ribbon */}
                          <path
                            d="M176 198 L174 380 L182 380 L184 198 Z"
                            fill="#8B1E1E"
                            stroke={goldColor}
                            strokeWidth="0.9"
                          />
                          <path d="M178 380 L174 395 M180 380 L180 398 M182 380 L186 395" stroke="#C82333" strokeWidth="1.2" />
                          {/* Right Ribbon */}
                          <path
                            d="M196 198 L198 380 L206 380 L204 198 Z"
                            fill="#8B1E1E"
                            stroke={goldColor}
                            strokeWidth="0.9"
                          />
                          <path d="M200 380 L196 395 M202 380 L202 398 M204 380 L208 395" stroke="#C82333" strokeWidth="1.2" />
                        </g>
                      )}

                      {/* Phượng Hoàng hoặc Long Vân ở ngực */}
                      {profile.chestMotif === 'phoenix-phung' ? (
                        <g id="phoenix-motif">
                          <circle cx="190" cy="226" r="14" fill="#6B1419" stroke={goldColor} strokeWidth="1.2" />
                          <path d="M185 220 Q190 214 195 220 Q190 236 185 220 Z" fill={goldColor} />
                          <circle cx="190" cy="217" r="2" fill="#FAF7F0" />
                        </g>
                      ) : (
                        <g id="dragon-motif">
                          <circle cx="190" cy="226" r="14" fill="#6B1419" stroke={goldColor} strokeWidth="1.2" />
                          <path d="M184 226 Q190 216 196 226 Q190 234 184 226 Z" fill="none" stroke={goldColor} strokeWidth="1.8" />
                        </g>
                      )}
                    </g>
                  ) : profile.collarType === 'giao-linh' ? (
                    /* CỔ GIAO LĨNH (Chữ Y - Hữu nhậm: Vạt trái đè vạt phải) */
                    <g id="collar-giao-linh">
                      {/* Yếm Đào bên trong */}
                      <path d="M180 124 Q190 148 200 124" fill="#C53030" stroke="#9B2C2C" strokeWidth="0.8" />
                      <circle cx="190" cy="140" r="1.5" fill="#FAF7F0" />
                      {/* Vạt trong (dưới) */}
                      <path d="M178 124 L204 185" stroke={goldColor} strokeWidth="2.5" />
                      {/* Vạt ngoài (đè lên): Trái đè Phải chuẩn Hữu nhậm */}
                      <path d="M202 124 L176 185" stroke={goldColor} strokeWidth="2.5" />
                      <path d="M202 124 L176 185" stroke={garmentColor} strokeWidth="1.2" />
                      {/* Đai thắt lưng lụa buộc nút hoa đào */}
                      <rect x="162" y="220" width="56" height="12" fill="#1C382B" stroke={goldColor} strokeWidth="1" />
                      <circle cx="190" cy="226" r="3" fill="url(#goldButtonGrad)" />
                      {/* Dải đai buông */}
                      <path d="M188 232 L185 320 M192 232 L195 320" stroke="#1C382B" strokeWidth="2.5" />
                    </g>
                  ) : profile.collarType === 'vien-linh' ? (
                    /* CỔ VIÊN LĨNH (Cổ tròn, Bổ tử thêu hạc/kỳ lân) */
                    <g id="collar-vien-linh">
                      <path d="M176 122 Q190 127 204 122" stroke={goldColor} strokeWidth="2.2" fill="none" />
                      <circle cx="198" cy="125" r="2.5" fill="url(#goldButtonGrad)" />
                      {/* Bổ Tử vuông ở giữa ngực */}
                      <rect x="174" y="165" width="32" height="32" fill="#0E1D33" stroke={goldColor} strokeWidth="1.6" />
                      {/* Tiên Hạc tung cánh */}
                      <path d="M182 181 Q190 173 198 181 Q190 186 182 181 Z" fill="#FAF7F0" />
                      <circle cx="190" cy="177" r="1.5" fill="#C53030" />
                    </g>
                  ) : (
                    /* ÁO TẤC TAY THỤNG (Cổ Lập Lĩnh 5 cúc) */
                    <g id="collar-ao-tac">
                      <path d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z" fill={goldColor} stroke="#4A1515" strokeWidth="0.8" />
                      <path d="M195 132 Q202 155 212 175 L210 330" stroke={goldColor} strokeWidth="1.2" fill="none" />
                      {[132, 150, 170, 192, 218].map((y, i) => (
                        <circle key={i} cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#goldButtonGrad)" />
                      ))}
                    </g>
                  )}
                </g>
              ) : profile.collarType === 'tu-than' ? (
                /* ========================================================
                    TYPE 2: ÁO TỨ THÂN (4 vạt, yếm đào, thắt nút bụng, thắt lưng lụa)
                   ======================================================== */
                <g id="ao-tu-than-group">
                  {/* Yếm Đào bên trong */}
                  <path d="M176 126 L164 165 L190 220 L216 165 L204 126 Z" fill="#C53030" stroke="#9B2C2C" strokeWidth="1" />
                  <circle cx="190" cy="145" r="3" fill="#D4AF37" />
                  {/* Hai vạt áo khoác lụa the nâu sồng */}
                  <path
                    d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L164 175 L152 410 L170 410 L188 235 L190 235 L208 410 L226 410 L214 175 L238 220 L244 305 L256 305 L254 220 L238 142 L200 124 Z"
                    fill={garmentColor}
                    stroke={goldColor}
                    strokeWidth="1.4"
                  />
                  {/* Thắt lưng lụa xanh lý buộc nơ trước bụng */}
                  <path d="M174 230 Q190 236 206 230 L204 242 Q190 248 176 242 Z" fill="#2E7D46" stroke={goldColor} strokeWidth="0.8" />
                  <path d="M185 242 L180 340 M195 242 L200 340" stroke="#2E7D46" strokeWidth="2.4" />
                </g>
              ) : profile.collarType === 'ao-ba-ba' ? (
                /* ========================================================
                    TYPE 3: ÁO BÀ BA (Cổ tròn, cúc bấm ngọc trai, xẻ tà, khăn rằn)
                   ======================================================== */
                <g id="ao-ba-ba-group">
                  <path
                    d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L150 330 Q190 338 230 330 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                    fill={garmentColor}
                    stroke={goldColor}
                    strokeWidth="1.2"
                  />
                  {/* Xẻ tà hông */}
                  <path d="M150 255 L150 330" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
                  <path d="M230 255 L230 330" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
                  {/* Cổ tròn & Cúc bấm ngọc trai */}
                  <path d="M180 125 Q190 128 200 125" fill="none" stroke={goldColor} strokeWidth="1.4" />
                  <path d="M190 127 L190 325" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                  {[145, 175, 205, 235, 265, 295].map((y, i) => (
                    <circle key={i} cx="190" cy={y} r="2.4" fill="#FFFFFF" stroke="#888" strokeWidth="0.6" />
                  ))}
                  {/* Hai túi vuông nam */}
                  {activeGarment.gender === 'nam' && (
                    <>
                      <rect x="162" y="275" width="16" height="18" fill="none" stroke={goldColor} strokeWidth="0.9" />
                      <rect x="202" y="275" width="16" height="18" fill="none" stroke={goldColor} strokeWidth="0.9" />
                    </>
                  )}
                </g>
              ) : profile.collarType === 'dong-son' ? (
                /* ========================================================
                    TYPE 4: TRANG PHỤC ĐÔNG SƠN (Mặt trời 14 tia, chim Lạc)
                   ======================================================== */
                <g id="dong-son-top">
                  <path
                    d="M180 124 L142 142 L130 200 L146 205 L162 165 L148 395 Q190 405 232 395 L218 165 L234 205 L250 200 L238 142 L200 124 Z"
                    fill={garmentColor}
                    stroke={goldColor}
                    strokeWidth="1.4"
                  />
                  {/* Mặt trời 14 tia rực rỡ */}
                  <circle cx="190" cy="182" r="16" fill="none" stroke={goldColor} strokeWidth="1.5" />
                  <circle cx="190" cy="182" r="6" fill={goldColor} />
                  {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((ang, i) => (
                    <line
                      key={i}
                      x1={190 + Math.cos((ang * Math.PI) / 180) * 7}
                      y1={182 + Math.sin((ang * Math.PI) / 180) * 7}
                      x2={190 + Math.cos((ang * Math.PI) / 180) * 15}
                      y2={182 + Math.sin((ang * Math.PI) / 180) * 15}
                      stroke={goldColor}
                      strokeWidth="1.2"
                    />
                  ))}
                  {/* Chim Lạc bay uy dũng */}
                  <path d="M170 216 Q180 208 190 216 M190 216 Q200 208 210 216" stroke={goldColor} strokeWidth="1.4" fill="none" />
                  {/* Đai thắt lưng đồng */}
                  <rect x="160" y="244" width="60" height="12" fill="#522B13" stroke={goldColor} strokeWidth="1.4" />
                </g>
              ) : (
                /* ========================================================
                    TYPE 5: ÁO NGŨ THÂN TAY CHẼN (Chuẩn 5 thân, cổ lập lĩnh 2.5cm, 5 cúc vàng, tà đáy thúng)
                   ======================================================== */
                <g id="ao-ngu-than-group">
                  <path
                    d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                    fill={garmentColor}
                    stroke={goldColor}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                    fill="url(#cloudBrocadePattern)"
                    opacity="0.38"
                  />
                  <path
                    d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                    fill="url(#silkShineGrad)"
                  />
                  {/* Cổ Lập Lĩnh cao 2.5cm */}
                  <path d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z" fill={goldColor} stroke="#4A1515" strokeWidth="0.8" />
                  {/* Vạt hò cài chéo sang nách phải */}
                  <path d="M195 132 Q202 155 212 175 L210 330" stroke="rgba(212, 175, 55, 0.8)" strokeWidth="1.3" fill="none" />
                  {/* 5 Cúc Ngũ Thường 3D */}
                  {[132, 150, 170, 192, 218].map((y, i) => (
                    <circle key={i} cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#goldButtonGrad)" />
                  ))}
                </g>
              )}

              {/* Sống Áo Mũi Gáy (Vertical Seam down center) */}
              <path
                d="M190 132 L190 405"
                stroke="rgba(212, 175, 55, 0.45)"
                strokeWidth="0.8"
                strokeDasharray="4 2"
              />
            </motion.g>
          )}

          {/* ===== 4. PHỤ KIỆN (HIỂN THỊ ĐẦY ĐỦ 16 LOẠI PHỤ KIỆN VIỆT PHỤC) ===== */}
          {activeAccessory ? (
            <g id="accessory-layer">
              {/* 1. Nón Ba Tầm Quai Thao */}
              {activeAccessory.id === 'non-ba-tam-nu' || activeAccessory.id === 'non-ba-tam' ? (
                <g id="acc-non-ba-tam">
                  <ellipse cx="190" cy="50" rx="46" ry="14" fill="#CBB693" stroke="#8A734D" strokeWidth="1.2" />
                  <ellipse cx="190" cy="50" rx="41" ry="10" fill="none" stroke="#8A734D" strokeWidth="0.6" />
                  {/* Dải Quai Thao tơ tằm buông rủ dài trước ngực */}
                  <path d="M156 55 Q164 120 162 195" stroke="#D83A56" strokeWidth="2.5" fill="none" />
                  <path d="M224 55 Q216 120 218 195" stroke="#D83A56" strokeWidth="2.5" fill="none" />
                  <circle cx="162" cy="195" r="2.5" fill="#D4AF37" />
                  <circle cx="218" cy="195" r="2.5" fill="#D4AF37" />
                </g>
              ) : activeAccessory.id === 'non-la-nam-bo' ? (
                /* 2. Nón Lá Chóp Nhọn Nam Bộ */
                <g id="acc-non-la">
                  <path d="M190 28 L146 64 Q190 70 234 64 Z" fill="#D7C7A3" stroke="#8A734D" strokeWidth="1" />
                  {[36, 44, 52, 60].map((y, i) => (
                    <path key={i} d={`M${190 - (y - 28) * 1.2} ${y} Q190 ${y + 4} ${190 + (y - 28) * 1.2} ${y}`} stroke="#B3A27D" strokeWidth="0.6" fill="none" />
                  ))}
                  {/* Quai nón lụa hồng */}
                  <path d="M165 64 Q178 95 190 92 Q202 95 215 64" stroke="#F472B6" strokeWidth="1.8" fill="none" />
                </g>
              ) : activeAccessory.id === 'khan-mo-qua-nu' ? (
                /* 3. Khăn Mỏ Quạ Kinh Bắc */
                <g id="acc-khan-mo-qua">
                  <ellipse cx="190" cy="52" rx="27" ry="13" fill="#141110" />
                  {/* Mũi nhọn mỏ quạ chúc xuống trán */}
                  <path d="M164 54 Q190 40 216 54 L190 68 Z" fill="#1F1B1A" stroke={goldColor} strokeWidth="0.8" />
                </g>
              ) : activeAccessory.id === 'khan-vanh-day-nu' ? (
                /* 4. Khăn Vành Dây Hoàng Cung (Nhiều vành vàng kim lộng lẫy) */
                <g id="acc-khan-vanh-day">
                  <ellipse cx="190" cy="50" rx="36" ry="15" fill="#B8860B" stroke="#D4AF37" strokeWidth="1.8" />
                  <ellipse cx="190" cy="48" rx="32" ry="13" fill="#D4AF37" stroke="#F59E0B" strokeWidth="1.2" />
                  <ellipse cx="190" cy="46" rx="28" ry="11" fill="#F59E0B" stroke="#D4AF37" strokeWidth="1" />
                  <ellipse cx="190" cy="46" rx="20" ry="7" fill="#1A1816" />
                </g>
              ) : activeAccessory.id === 'mu-phoc-dau-nam' ? (
                /* 5. Mũ Phốc Đầu Ô Sa Quan Lại (Hai cánh chuồn ngang) */
                <g id="acc-mu-phoc-dau">
                  <ellipse cx="190" cy="50" rx="24" ry="14" fill="#111111" stroke={goldColor} strokeWidth="1" />
                  <rect x="176" y="26" width="28" height="20" rx="4" fill="#171717" stroke={goldColor} strokeWidth="1.2" />
                  {/* Cánh chuồn trái */}
                  <path d="M166 48 L104 46 Q100 48 104 54 L166 52 Z" fill="#111111" stroke={goldColor} strokeWidth="1.2" />
                  {/* Cánh chuồn phải */}
                  <path d="M214 48 L276 46 Q280 48 276 54 L214 52 Z" fill="#111111" stroke={goldColor} strokeWidth="1.2" />
                </g>
              ) : activeAccessory.id === 'mu-long-chim-dong-son' ? (
                /* 6. Mũ Lông Chim Lạc Đông Sơn */
                <g id="acc-dong-son-crown">
                  <ellipse cx="190" cy="54" rx="26" ry="10" fill="#784421" stroke="#F59E0B" strokeWidth="1.4" />
                  {/* Các nhánh lông chim vút cao */}
                  {[-18, -9, 0, 9, 18].map((offset, i) => (
                    <path
                      key={i}
                      d={`M${190 + offset} 52 Q${190 + offset * 1.5} 12 ${190 + offset * 1.8} 8`}
                      stroke="#F59E0B"
                      strokeWidth="2.2"
                      fill="none"
                    />
                  ))}
                </g>
              ) : activeAccessory.id === 'tram-cai-diem-thuy-nu' ? (
                /* 7. Trâm Cài Tóc Điểm Thúy Hoa Mai */
                <g id="acc-tram-cai">
                  <ellipse cx="190" cy="46" rx="14" ry="7" fill="#1A1816" />
                  {/* Cây trâm vàng xiên qua búi tóc */}
                  <path d="M165 42 L215 36" stroke="#D4AF37" strokeWidth="2.5" />
                  {/* Bông hoa mai vàng ngọc trai ở đầu trâm */}
                  <circle cx="166" cy="42" r="5" fill="#D4AF37" />
                  <circle cx="166" cy="42" r="2" fill="#FAF7F0" />
                  <path d="M166 47 L164 62" stroke="#D4AF37" strokeWidth="1" />
                  <circle cx="164" cy="62" r="2" fill="#10B981" />
                </g>
              ) : activeAccessory.id === 'quat-lua' ? (
                /* 8. Quạt Lụa Tơ Tằm Cầm Tay Thêu Sen */
                <g id="acc-quat-lua">
                  {/* Nan tre và cánh quạt xòe bên tay phải */}
                  <path d="M254 315 L288 280 Q305 295 296 322 Z" fill="#FAF7F0" stroke="#D4AF37" strokeWidth="1.4" />
                  {/* Hoa sen thêu trên quạt */}
                  <path d="M280 298 Q286 292 292 298 Q286 308 280 298 Z" fill="#EC4899" />
                  {/* Cán quạt nan tre */}
                  <path d="M252 318 L262 308" stroke="#854D0E" strokeWidth="2.5" />
                  {/* Dải tua rua đỏ đung đưa */}
                  <path d="M252 318 Q248 335 250 350" stroke="#DC2626" strokeWidth="1.8" fill="none" />
                  <circle cx="250" cy="350" r="2" fill="#D4AF37" />
                </g>
              ) : activeAccessory.id === 'the-bai-hoang-cung' ? (
                /* 9. Thẻ Bài Ngà & Dây Lụa Cung Đình */
                <g id="acc-the-bai">
                  <path d="M204 185 L204 220" stroke="#DC2626" strokeWidth="1.4" />
                  {/* Phiến thẻ bài ngà */}
                  <rect x="198" y="215" width="12" height="24" rx="2" fill="#FAF6ED" stroke="#8A6623" strokeWidth="1" />
                  <line x1="204" y1="219" x2="204" y2="233" stroke="#8A6623" strokeWidth="0.8" />
                  {/* Tua rua đỏ dưới thẻ bài */}
                  <path d="M204 239 L202 260 M204 239 L206 260" stroke="#DC2626" strokeWidth="1.2" />
                </g>
              ) : activeAccessory.id === 'dai-bac-khiep-nam' ? (
                /* 10. Đai Bác Khiệp & Thắt Lưng Ngọc */
                <g id="acc-dai-bac-khiep">
                  <rect x="156" y="232" width="68" height="13" rx="2" fill="#8B2222" stroke={goldColor} strokeWidth="1.4" />
                  {[-24, -12, 0, 12, 24].map((offset, i) => (
                    <rect key={i} x={186 + offset} y="234" width="8" height="9" fill="url(#jadeStoneGrad)" stroke={goldColor} strokeWidth="0.8" />
                  ))}
                </g>
              ) : activeAccessory.id === 'vong-dong-dong-son' ? (
                /* 11. Hộ Tâm Phiến & Vòng Tay Đồng */
                <g id="acc-vong-dong">
                  {/* Tấm hộ tâm phiến tròn ở ngực */}
                  <circle cx="190" cy="185" r="14" fill="#9C6938" stroke="#F59E0B" strokeWidth="1.6" />
                  <circle cx="190" cy="185" r="6" fill="#F59E0B" />
                  {/* Vòng đồng ở hai cổ tay */}
                  <rect x="121" y="300" width="13" height="6" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                  <rect x="246" y="300" width="13" height="6" rx="2" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
                </g>
              ) : activeAccessory.id === 'ngoc-boi' ? (
                /* 12. Ngọc Bội Thắt Lưng Chạm Rồng */
                <g id="acc-ngoc-boi">
                  <path d="M208 240 L208 275" stroke="#C82333" strokeWidth="1.6" />
                  <circle cx="208" cy="280" r="7.5" fill="url(#jadeStoneGrad)" stroke="#D4AF37" strokeWidth="1.4" />
                  <circle cx="208" cy="280" r="2.8" fill="#064E3B" />
                  <path d="M206 288 L204 322 M208 288 L208 325 M210 288 L212 322" stroke="#C82333" strokeWidth="1.2" />
                </g>
              ) : activeAccessory.id === 'khan-ran' || activeAccessory.id === 'khan-ran-nam-bo' ? (
                /* 13. Khăn Rằn Nam Bộ */
                <g id="acc-khan-ran">
                  <ellipse cx="190" cy="52" rx="27" ry="12" fill="url(#khanRanPattern)" stroke="#1A1A1A" strokeWidth="1" />
                  <path d="M206 50 Q218 62 214 85" stroke="#1A1A1A" strokeWidth="3" fill="none" />
                </g>
              ) : activeAccessory.id === 'khan-dong' ? (
                /* 14. Khăn Đóng Lụa Đen 7 Nếp Chữ Nhân */
                <g id="acc-khan-dong">
                  <ellipse cx="190" cy="52" rx="28" ry="12" fill="#141110" />
                  <path d="M162 53 Q190 42 218 53 Q190 62 162 53 Z" fill="#1A1817" stroke={goldColor} strokeWidth="1.2" />
                  {/* Nếp gấp chữ Nhân (人) trước trán */}
                  <path d="M182 50 L190 56 L198 50" stroke={goldColor} strokeWidth="1.4" fill="none" />
                  <path d="M166 50 Q190 39 214 50" fill="none" stroke={goldColor} strokeWidth="0.8" opacity="0.8" />
                </g>
              ) : (
                /* 15 & 16. Mấn Tròn Cung Đình / Mấn Ngũ Sắc Đính Ngọc */
                <g id="acc-man-tron">
                  <ellipse cx="190" cy="52" rx="28" ry="12" fill="#1A1816" />
                  <path
                    d="M162 53 Q190 42 218 53 Q190 62 162 53 Z"
                    fill={activeAccessory.id === 'man-ngu-sac' ? '#8B1E1E' : '#1D2533'}
                    stroke={goldColor}
                    strokeWidth="1.6"
                  />
                  {/* Viền hoa văn & ngọc bích đính chính giữa */}
                  <circle cx="190" cy="50" r="3.2" fill="url(#jadeStoneGrad)" stroke={goldColor} strokeWidth="1" />
                  <path d="M166 50 Q190 39 214 50" fill="none" stroke={goldColor} strokeWidth="0.9" opacity="0.85" />
                </g>
              )}
            </g>
          ) : (
            /* Tóc Búi Tự Nhiên khi không đội mũ/mấn */
            <g id="natural-hair-knot" opacity={0.9}>
              <ellipse cx="190" cy="48" rx="14" ry="7" fill="#1A1816" />
              <circle cx="190" cy="44" r="5" fill="#141110" />
            </g>
          )}
        </svg>

        {/* Celestial Silk Sash Fluttering Around 2D Mannequin */}
        {!hideOverlays && (
          <CelestialSilkSash
            isHovering={isHoveringSilk}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />
        )}

        {/* Floating Silk Tactile Feedback on Hover */}
        <AnimatePresence>
          {!hideOverlays && isHoveringSilk && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-16 z-30 px-3.5 py-1.5 rounded-full bg-[#0B1324]/95 backdrop-blur-md border border-amber-400/60 shadow-[0_4px_24px_rgba(245,158,11,0.25)] flex items-center gap-2 text-xs font-sans-vi text-amber-200 pointer-events-none"
            >
              <Waves className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>
                {hoveredItem ? `Đang xem: ${hoveredItem.name}` : 'Bản vẽ 2D chuyển động lụa mềm'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
