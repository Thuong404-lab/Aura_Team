import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WardrobeItem, FabricOption, ColorOption } from '../data/vietPhucData';
import { DongSonDrumMandala } from './VietnameseDecorativeElements';
import { CelestialSilkSash } from './SilkMotionElements';
import {
  Check,
  Camera,
  Waves,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

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
}

// Visual profile matching the 15 authentic photos
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
    | 'dong-son'
    | 'cach-tan'
    | 'ao-yem';
  sleeveType: 'tay-thung' | 'tay-chen' | 'dong-son' | 'ao-yem';
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
    | 'doi-kham-lapels'
    | 'cach-tan-minimal';
  hasFiveColorCuffs?: boolean;
  hasThuyBaHem?: boolean;
  hasChestRibbons?: boolean;
  hasKhanRan?: boolean;
}

export const GARMENT_VISUAL_PROFILES: Record<string, GarmentVisualProfile> = {
  // 1. Áo Nhật Bình Nam (Ảnh: Gấm đỏ rực rỡ, Long Vân Đại Hội thêu rồng cuộn chỉ kim, tay thụng ngũ sắc, gấu thủy ba)
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
  // 2. Áo Nhật Bình Nữ (Ảnh: Gấm đỏ son cố đô, chim Phụng ngậm ngọc, dải ngũ sắc ngũ hành, mấn vàng cung đình)
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
  // 3. Áo Tấc Nam (Ảnh: Đỏ tía sẫm vương triều, tay thụng buông qua tay trang nghiêm, chữ Thọ mây cuộn, gấu thủy ba)
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
  // 4. Áo Tấc Nữ (Ảnh: Đỏ hồng mẫu đơn quý phái, tay thụng buông rủ uy nghi, 5 cúc vàng cài chéo, mấn vàng hoàng gia)
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
  // 5. Áo Ngũ Thân Nam (Ảnh: Xanh chàm nho nhã mực thước, 5 cúc vàng cài chéo bên phải, tà đáy thúng, tay chẽn gọn gàng)
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
  // 6. Áo Ngũ Thân Nữ (Ảnh: Đỏ thắm quý phái khuê các, 5 thân kín đáo, cổ lập lĩnh 2.5cm, tay chẽn, mấn đen nhung)
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
  // 7. Áo Giao Lĩnh Nam (Ảnh: Lụa bạch ngọc ngà thanh tao, viền lục ngọc, cổ chéo chữ Y, đai ngọc thắt lưng)
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
  // 8. Áo Giao Lĩnh Nữ (Ảnh: Xanh lam ngọc cổ phong, cổ chéo chữ Y lộ yếm đào hồng, chân váy xếp ly đỏ điều thêu thủy ba)
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
  // 9. Áo Viên Lĩnh Nam (Ảnh: Xanh midnight thẫm hoàng triều, cổ tròn khum, Bổ Tử vuông thêu Hạc Trắng tung cánh mây lành)
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
  // 10. Áo Viên Lĩnh Nữ (Ảnh: Tím trầm cố đô / mận chín quý tộc, cổ tròn viền vàng, Bổ Tử thêu phượng hoàng)
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
  // 11. Áo Đối Khâm (Ảnh: Đỏ son Lê triều, 2 vạt song song buông thẳng từ vai xuống gấu viền hoa văn vàng lộng lẫy)
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
  // 12. Áo Tứ Thân Nữ (Ảnh: Áo the nâu sồng dân gian, yếm đào hồng thắm, thắt nút bụng, thắt lưng xanh, nón ba tầm quai thao)
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
  // 13. Trang Phục Đông Sơn (Ảnh: Sắc nâu đồng Văn Lang, mặt trời 14 tia sáng rực rỡ, chim Lạc bay uy dũng, đai đồng)
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
  // 14. Áo Bà Ba Nữ (Ảnh: Lụa xanh ngọc duyên dáng Nam Bộ, cúc bấm ngọc trai, xẻ tà hông, khăn rằn Nam Bộ kẻ caro)
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
  // 15. Áo Bà Ba Nam (Ảnh: Nâu sồng mộc mạc hào sảng, hai túi vuông to ở vạt trước, cúc cài dọc, quần đen, khăn rằn)
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
  // 16. Áo Dài Cách Tân
  'cach-tan': {
    baseColor: '#8B1E1E',
    accentGold: '#D4AF37',
    collarType: 'cach-tan',
    sleeveType: 'tay-chen',
    bottomColor: '#262423',
    bottomType: 'quan-tay',
    headpieceType: 'khan-dong',
    chestMotif: 'cach-tan-minimal',
  },
  // 17. Áo Yếm & Khoác Sa
  'ao-yem': {
    baseColor: '#B23A48',
    accentGold: '#F7E7CE',
    collarType: 'ao-yem',
    sleeveType: 'ao-yem',
    bottomColor: '#8B1E1E',
    bottomType: 'vay-xep-ly',
    headpieceType: 'man-den',
    chestMotif: 'yem-dao',
  },
};

export const AvatarModel: React.FC<AvatarModelProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  topCustomColor,
  bottomCustomColor,
  harmonyScore = 95,
  harmonyCritique = 'Sự kết hợp hài hòa giữa Áo ngũ thân tay chẽn truyền thống và váy xếp ly hiện đại, giữ được nét thanh lịch nhưng vẫn năng động.',
  showCulturePins = true,
  onDownloadPhoto,
  hoveredItem = null,
  isHoveringSilk = false,
}) => {
  const [hoveredPin, setHoveredPin] = useState<'accessory' | 'garment' | 'bottom' | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Active top and bottom items (accounts for real-time hover preview)
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
  const goldColor = profile.accentGold;

  // Active bottom color & type determination
  const bottomType = activeBottom
    ? activeBottom.id === 'vay-xep-ly'
      ? 'vay-xep-ly'
      : activeBottom.id === 'quan-men-lam'
      ? 'quan-men-lam'
      : activeBottom.id === 'quan-gam-vang'
      ? 'quan-gam-vang'
      : activeBottom.id === 'quan-tay-hien-dai'
      ? 'quan-tay'
      : activeBottom.id === 'vay-den'
      ? 'vay-den'
      : activeBottom.id === 'dong-son'
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

  // Trousers / Skirt color (prioritize custom bottom color, keep folds/pleats/motifs)
  const trousersColor = bottomCustomColor || defaultTrousersColor;

  // Active headpiece determination
  const headpieceType = activeAccessory
    ? activeAccessory.id === 'non-ba-tam' || activeAccessory.svgLayerType === 'non-ba-tam'
      ? 'non-ba-tam'
      : activeAccessory.id === 'khan-ran' || activeAccessory.svgLayerType === 'khan-ran'
      ? 'khan-ran'
      : activeAccessory.id === 'man-ngu-sac' || activeAccessory.id === 'man-vang'
      ? 'man-vang'
      : activeAccessory.id === 'khan-dong' || activeAccessory.svgLayerType === 'khan-dong'
      ? 'khan-dong'
      : activeAccessory.id === 'man-doi-dau'
      ? 'man-tron'
      : profile.headpieceType
    : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 1. Bronze Drum (Trống Đồng) Circular Mandala Glow in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <DongSonDrumMandala
          className="w-[380px] h-[380px] md:w-[480px] md:h-[480px]"
          opacity={0.22}
        />
        <div className="absolute w-[360px] h-[360px] rounded-full bg-radial from-amber-500/10 via-amber-900/5 to-transparent blur-3xl" />
      </div>

      {/* 2. Interactive Cultural Callout Hotspots (Ẩn mặc định, chỉ hiện khi rê chuột) */}
      {showCulturePins && (
        <>
          {/* Phụ Kiện / Mấn Đội Đầu (Top-Right) */}
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
                        'Mấn tròn quấn nhiều vòng thanh tú, tôn vinh nét đoan trang đài các của phục sức Việt.'}
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
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
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

      {/* 5. AI Harmony Evaluation Badge (Bottom-Right of Canvas) */}
      <div className="absolute bottom-16 right-2 md:right-6 z-30 max-w-[230px] hidden lg:block animate-in fade-in duration-500 pointer-events-none">
        <div className="rounded-xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-[#092018]/90 backdrop-blur-md text-left">
          <div className="bg-emerald-600/90 text-emerald-50 px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>CHUẨN BẢN VẼ 2D DI SẢN</span>
          </div>
          <div className="p-2.5 text-emerald-100">
            <div className="font-bold text-[11px] text-emerald-300 font-serif-vi mb-0.5">
              Khớp chuẩn di sản ({harmonyScore} điểm)
            </div>
            <p className="text-[10px] leading-relaxed text-emerald-100/90 font-sans-vi line-clamp-3">
              "{harmonyCritique}"
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. BẢN VẼ 2D: KHỚP 100% TỪNG PHẦN, MÀU SẮC, HỌA TIẾT & KIỂU DÁNG
         ======================================================== */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[500px] sm:h-[550px] flex items-center justify-center">
        {/* Soft Floor Shadow */}
        <div className="absolute bottom-3 w-52 h-6 bg-black/55 blur-md rounded-full pointer-events-none" />

        <svg
          viewBox="0 0 380 640"
          className="w-full h-full drop-shadow-[0_16px_44px_rgba(0,0,0,0.85)] overflow-visible"
        >
          <defs>
            {/* Skin Tone Gradient for Illustrated Model */}
            <linearGradient id="skinTone2D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDF0E6" />
              <stop offset="100%" stopColor="#E2BDAA" />
            </linearGradient>

            {/* Gold Button Radial Gradient */}
            <radialGradient id="goldButtonGrad">
              <stop offset="0%" stopColor="#FFF4B8" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6623" />
            </radialGradient>

            {/* Silk Sheen Overlay */}
            <linearGradient id="silkShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            {/* Cloud Brocade Overlay */}
            <pattern id="cloudBrocadePattern" width="36" height="36" patternUnits="userSpaceOnUse">
              <path
                d="M8 18 Q14 12 18 18 Q24 12 28 18 Q20 25 8 18 Z"
                fill="none"
                stroke={goldColor}
                strokeWidth="0.6"
                opacity="0.28"
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

            {/* Dragon Medallion Gradient */}
            <radialGradient id="dragonMedallionGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6623" />
            </radialGradient>
          </defs>

          {/* ===== 1. LOWER GARMENT (QUẦN / VÁY) & GIÀY HÀI ===== */}
          <g
            id="lower-garment-layer"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPin('bottom')}
            onMouseLeave={() => setHoveredPin(null)}
          >
            {/* Giày Hài Thêu Mũi Cong (Shoes under trousers/skirts) */}
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
                  {/* Pleats (nếp gấp xếp ly) */}
                  {[-55, -40, -25, -10, 5, 20, 35, 50].map((offset, i) => (
                    <path
                      key={i}
                      d={`M${190 + offset * 0.4} 245 L${190 + offset * 1.15} 565`}
                      stroke="rgba(0, 0, 0, 0.25)"
                      strokeWidth="1.2"
                    />
                  ))}
                  {/* Thủy Ba wave border at skirt hem */}
                  <path
                    d="M126 558 Q158 566 190 560 Q222 566 254 558"
                    stroke={goldColor}
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M127 563 Q158 571 190 565 Q222 571 253 563"
                    stroke={goldColor}
                    strokeWidth="1"
                    fill="none"
                    opacity="0.7"
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
                  {/* Vạt khố buông giữa thêu hoa văn kỷ hà */}
                  <rect x="178" y="240" width="24" height="280" fill="#522B13" stroke={goldColor} strokeWidth="1" />
                  <path d="M140 535 L240 535" stroke={goldColor} strokeWidth="2" />
                  {[-36, -18, 0, 18, 36].map((x, i) => (
                    <circle key={i} cx={190 + x} cy={535} r="2.5" fill={goldColor} />
                  ))}
                </g>
              ) : (
                /* Quần Ống Sớ Lụa Bạch / Quần Cung Đình / Quần Đen */
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
                  <path d="M166 260 L164 558" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  <path d="M214 260 L216 558" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  {/* Ankle Gold Trims */}
                  <path d="M144 562 L188 562" stroke={goldColor} strokeWidth="1.2" opacity="0.6" />
                  <path d="M192 562 L236 562" stroke={goldColor} strokeWidth="1.2" opacity="0.6" />
                </g>
              )
            ) : (
              /* Mannequin neutral under-legs when lower garment is not selected */
              <g id="unselected-legs" opacity={0.65}>
                <path
                  d="M165 240 L158 565 L186 565 L188 380 Z"
                  fill="#EDE8DF"
                  stroke="#C8BEB0"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <path
                  d="M192 380 L194 565 L222 565 L215 240 Z"
                  fill="#EDE8DF"
                  stroke="#C8BEB0"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
                <rect x="145" y="440" width="90" height="20" rx="5" fill="#0F172A" fillOpacity="0.75" stroke="#C4BBAA" strokeWidth="0.6" />
                <text x="190" y="453" textAnchor="middle" fill="#E2E8F0" fontSize="8.5" fontFamily="sans-serif">
                  (Chưa chọn quần/váy)
                </text>
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
            <path d="M178 70 Q182 68 186 70" stroke="rgba(140, 90, 65, 0.5)" strokeWidth="0.8" fill="none" />
            <path d="M194 70 Q198 68 202 70" stroke="rgba(140, 90, 65, 0.5)" strokeWidth="0.8" fill="none" />

            {/* Hands (Positioned seamlessly at wrist level Y: 305 to fingertips Y: 335) */}
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

          {/* ===== 3. UPPER GARMENT (ÁO CỔ PHỤC KHỚP TỪNG PHẦN VỚI ẢNH GỐC) ===== */}
          {activeGarment ? (
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
                {/* Left Sleeve: (142, 142) -> (82, 280) -> (82, 345) -> (156, 350) -> (162, 215) */}
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
                  opacity="0.45"
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
                    <path d="M82 280 L82 345" stroke={goldColor} strokeWidth="1.2" />

                    {/* Right Sleeve 5 Color Stripes */}
                    <path d="M298 280 L298 293 L230 293 L230 280 Z" fill="#1F5A46" />
                    <path d="M298 293 L298 306 L230 306 L230 293 Z" fill="#D4AF37" />
                    <path d="M298 306 L298 319 L230 319 L230 306 Z" fill="#FAF7F0" />
                    <path d="M298 319 L298 332 L230 332 L230 319 Z" fill="#9E1A2E" />
                    <path d="M298 332 L298 345 L224 345 L224 332 Z" fill="#1A1A1A" />
                    <path d="M298 280 L298 345" stroke={goldColor} strokeWidth="1.2" />
                  </g>
                )}

                {/* Thủy Ba (Sóng Nước Tam Sơn) ở Gấu Áo */}
                {profile.hasThuyBaHem && (
                  <g id="thuy-ba-hem">
                    <path
                      d="M144 395 Q190 405 236 395 L236 412 Q190 422 144 412 Z"
                      fill="url(#thuyBaGrad)"
                      stroke={goldColor}
                      strokeWidth="1.4"
                    />
                    {/* Tam Sơn (Núi Ba Đỉnh) giữa sóng */}
                    <path
                      d="M182 410 L190 398 L198 410 Z"
                      fill="#D4AF37"
                      stroke="#8A6623"
                      strokeWidth="0.8"
                    />
                  </g>
                )}

                {/* ===== SPECIFIC COLLARS & CHEST MOTIFS ===== */}
                {profile.collarType === 'nhat-binh' ? (
                  /* CỔ CHỮ NHẬT & LONG VÂN ĐẠI HỘI / PHỤNG HOÀNG */
                  <g id="collar-nhat-binh-authentic">
                    {/* Rectangular Collar Brocade Frame */}
                    <path
                      d="M174 124 L206 124 L208 198 L172 198 Z"
                      fill="#2A0B0E"
                      stroke={goldColor}
                      strokeWidth="2"
                    />
                    <path
                      d="M178 126 L202 126 L204 194 L176 194 Z"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="1"
                    />
                    {/* Cúc cài cổ và hoa văn cổ đồ */}
                    <circle cx="190" cy="144" r="3.5" fill="url(#goldButtonGrad)" />
                    <circle cx="190" cy="172" r="3" fill="url(#goldButtonGrad)" />

                    {/* Hai dải thắt ngực buông rủ dài xuống thân */}
                    {profile.hasChestRibbons && (
                      <g id="chest-ribbons">
                        <path d="M180 198 L178 335" stroke={goldColor} strokeWidth="1.8" />
                        <path d="M200 198 L202 335" stroke={goldColor} strokeWidth="1.8" />
                        <circle cx="178" cy="335" r="2.5" fill="url(#goldButtonGrad)" />
                        <circle cx="202" cy="335" r="2.5" fill="url(#goldButtonGrad)" />
                      </g>
                    )}

                    {/* Long Vân Đại Hội (Rồng Vàng trên Nhật Bình Nam - khớp ảnh gốc) */}
                    {profile.chestMotif === 'dragon-long-van' && (
                      <g id="dragon-chest-medallion">
                        <circle cx="190" cy="242" r="24" fill="none" stroke="#FDE68A" strokeWidth="1.6" />
                        <circle cx="190" cy="242" r="20" fill="#750C0C" stroke={goldColor} strokeWidth="1" />
                        
                        {/* Golden Coiled Dragon */}
                        <path
                          d="M184 232 Q190 226 196 232 Q200 240 192 244 Q183 244 186 250 Q192 254 198 248"
                          fill="none"
                          stroke="url(#dragonMedallionGrad)"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                        <path d="M187 230 Q190 224 193 230" stroke="#FFF" strokeWidth="1.2" fill="none" />
                        <circle cx="190" cy="242" r="3" fill="url(#goldButtonGrad)" />
                      </g>
                    )}

                    {/* Phụng Hoàng Ngậm Ngọc (Nhật Bình Nữ - khớp ảnh gốc) */}
                    {profile.chestMotif === 'phoenix-phung' && (
                      <g id="phoenix-chest-medallion">
                        <circle cx="190" cy="242" r="22" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
                        <circle cx="190" cy="242" r="18" fill="#580A10" stroke={goldColor} strokeWidth="0.8" />
                        <path d="M190 230 Q185 240 190 250 Q195 240 190 230 Z" fill="#FDE68A" />
                        <path d="M180 238 Q190 242 200 238" stroke="#FFF" strokeWidth="1.2" fill="none" />
                        <circle cx="190" cy="232" r="1.5" fill="#FFF" />
                      </g>
                    )}
                  </g>
                ) : profile.collarType === 'giao-linh' ? (
                  /* CỔ CHÉO CHỮ Y (GIAO LĨNH) */
                  <g id="collar-giao-linh-group">
                    <path d="M174 125 L190 158 L206 125" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                    <path d="M164 125 L196 178 L218 125" stroke={goldColor} strokeWidth="2.4" fill="none" />
                    <path d="M158 125 L196 188 L184 275" stroke={goldColor} strokeWidth="1.6" fill="none" />
                    {profile.chestMotif === 'yem-dao' && (
                      <path d="M178 144 L202 144 L190 162 Z" fill="#D83A56" />
                    )}
                    {/* Thắt Lưng Đai Ngọc (Áo nam) */}
                    <rect x="160" y="240" width="60" height="9" fill="#1C382B" stroke={goldColor} strokeWidth="1" />
                    <circle cx="190" cy="244.5" r="3" fill="url(#goldButtonGrad)" />
                  </g>
                ) : profile.collarType === 'vien-linh' ? (
                  /* CỔ TRÒN KHUM & BỔ TỬ VUÔNG (VIÊN LĨNH) */
                  <g id="collar-vien-linh-group">
                    <ellipse cx="190" cy="126" rx="15" ry="8" fill="none" stroke={goldColor} strokeWidth="2" />
                    <circle cx="205" cy="126" r="3" fill="url(#goldButtonGrad)" />
                    
                    {/* Bổ Tử vuông thêu Hạc Trắng / Phượng Hoàng trên ngực */}
                    <rect x="174" y="155" width="32" height="30" fill="#750C0C" stroke={goldColor} strokeWidth="1.5" rx="2" />
                    <rect x="177" y="158" width="26" height="24" fill="none" stroke="#FDE68A" strokeWidth="0.8" />
                    {/* Hạc trắng tung cánh */}
                    <path d="M190 165 L183 174 M190 165 L197 174" stroke="#FFFFFF" strokeWidth="1.8" />
                    <circle cx="190" cy="163" r="1.8" fill="#FFFFFF" />
                    {/* Mây ngũ sắc chân hạc */}
                    <path d="M182 178 Q190 174 198 178" stroke={goldColor} strokeWidth="1.2" fill="none" />
                  </g>
                ) : profile.collarType === 'doi-kham' ? (
                  /* CỔ ĐỐI KHÂM HAI VẠT SONG SONG */
                  <g id="collar-doi-kham-group">
                    {/* Lớp áo lót trong */}
                    <path d="M176 125 L190 170 L204 125" fill="#FAF7F0" opacity="0.4" />
                    {/* Hai vạt song song thêu hoa văn vàng */}
                    <path d="M174 125 L174 410" stroke={goldColor} strokeWidth="2.5" />
                    <path d="M206 125 L206 410" stroke={goldColor} strokeWidth="2.5" />
                    <path d="M178 125 L178 410" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 3" />
                    <path d="M202 125 L202 410" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 3" />
                  </g>
                ) : (
                  /* CỔ LẬP LĨNH 1 TẤC & 5 CÚC CÀI CHÉO (ÁO TẤC) */
                  <g id="collar-ao-tac-group">
                    <path
                      d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z"
                      fill={goldColor}
                      stroke="#6B2117"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M195 132 Q202 155 212 175 L210 330"
                      stroke="rgba(212, 175, 55, 0.75)"
                      strokeWidth="1.4"
                      fill="none"
                    />
                    {[132, 150, 170, 192, 218].map((y, i) => (
                      <g key={i}>
                        <circle cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#goldButtonGrad)" />
                        <circle cx={195 + i * 3.5} cy={y} r="0.9" fill="#FFFFFF" opacity="0.8" />
                      </g>
                    ))}
                  </g>
                )}
              </g>
            ) : profile.collarType === 'tu-than' ? (
              /* ========================================================
                  TYPE 2: ÁO TỨ THÂN (Áo the nâu sồng, Yếm đào hồng, thắt nút bụng)
                 ======================================================== */
              <g id="ao-tu-than-group">
                {/* Yếm Đào bên trong lộ ở cổ */}
                <path d="M172 125 L208 125 L190 178 Z" fill="#D83A56" stroke={goldColor} strokeWidth="1.2" />
                <circle cx="190" cy="148" r="2.2" fill="#FFF" />

                {/* Hai thân sau buông dài */}
                <path
                  d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 415 Q190 422 236 415 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                  fill="#423429"
                  stroke={goldColor}
                  strokeWidth="1.2"
                />

                {/* Hai vạt trước thắt nút duyên dáng trước bụng */}
                <path
                  d="M162 140 L188 238 Q190 252 182 340 L172 335 L182 232 Z"
                  fill="#544335"
                  stroke="rgba(212,175,55,0.7)"
                  strokeWidth="0.8"
                />
                <path
                  d="M218 140 L192 238 Q190 252 198 340 L208 335 L198 232 Z"
                  fill="#544335"
                  stroke="rgba(212,175,55,0.7)"
                  strokeWidth="0.8"
                />
                {/* Thắt lưng lụa xanh & nút thắt hoa */}
                <path d="M164 240 L216 240" stroke="#2A7C52" strokeWidth="5" />
                <circle cx="190" cy="240" r="5.5" fill="#2A7C52" stroke="#D4AF37" strokeWidth="1" />
              </g>
            ) : profile.collarType === 'dong-son' ? (
              /* ========================================================
                  TYPE 3: TRANG PHỤC ĐÔNG SƠN (Nâu đồng, mặt trời 14 tia, chim Lạc bay)
                 ======================================================== */
              <g id="dong-son-group">
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
                {/* Đai thắt lưng đồng bản to */}
                <rect x="160" y="244" width="60" height="12" fill="#522B13" stroke={goldColor} strokeWidth="1.4" />
                <circle cx="190" cy="250" r="3" fill={goldColor} />
              </g>
            ) : profile.collarType === 'ao-ba-ba' ? (
              /* ========================================================
                  TYPE 4: ÁO BÀ BA (Cổ tròn, cúc bấm ngọc trai, xẻ tà, khăn rằn)
                 ======================================================== */
              <g id="ao-ba-ba-group">
                {/* Thân áo bà ba & tay chẽn nối chuẩn khít cổ tay */}
                <path
                  d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L150 330 Q190 338 230 330 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                  fill={garmentColor}
                  stroke={goldColor}
                  strokeWidth="1.2"
                />
                {/* Xẻ tà hông (2 bên tà) */}
                <path d="M150 255 L150 330" stroke="#143D2E" strokeWidth="1.2" />
                <path d="M230 255 L230 330" stroke="#143D2E" strokeWidth="1.2" />

                {/* Cổ tròn xẻ giữa ngực & hàng cúc bấm ngọc trai */}
                <path d="M180 125 Q190 128 200 125" fill="none" stroke={goldColor} strokeWidth="1.4" />
                <path d="M190 127 L190 325" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                {[145, 175, 205, 235, 265, 295].map((y, i) => (
                  <circle key={i} cx="190" cy={y} r="2.2" fill="#FFFFFF" stroke="#888" strokeWidth="0.5" />
                ))}

                {/* Hai túi vuông dưới vạt áo (Áo nam) */}
                {activeGarment.gender === 'nam' && (
                  <>
                    <rect x="162" y="275" width="16" height="18" fill="none" stroke={goldColor} strokeWidth="0.9" />
                    <rect x="202" y="275" width="16" height="18" fill="none" stroke={goldColor} strokeWidth="0.9" />
                  </>
                )}

                {/* Khăn Rằn Nam Bộ kẻ caro quàng qua vai */}
                {profile.hasKhanRan && (
                  <g id="khan-ran-mesh">
                    {/* Left side scarf band */}
                    <path d="M172 125 Q160 185 164 290 L172 290 Q168 185 178 125 Z" fill="url(#khanRanPattern)" stroke="#1A1A1A" strokeWidth="0.8" />
                    {/* Right side scarf band */}
                    <path d="M208 125 Q220 185 216 290 L208 290 Q212 185 202 125 Z" fill="url(#khanRanPattern)" stroke="#1A1A1A" strokeWidth="0.8" />
                  </g>
                )}
              </g>
            ) : (
              /* ========================================================
                  TYPE 5: ÁO NGŨ THÂN TAY CHẼN (Chuẩn 5 thân, cổ lập lĩnh, 5 cúc vàng, tay chẽn khít tay)
                 ======================================================== */
              <g id="ao-ngu-than-group">
                {/* Torso & Tay Chẽn (Tapered Sleeves perfectly fitting wrists at Y: 305) */}
                <path
                  d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                  fill={garmentColor}
                  stroke={goldColor}
                  strokeWidth="1.5"
                />

                {/* Cloud Damask Pattern */}
                <path
                  d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                  fill="url(#cloudBrocadePattern)"
                  opacity="0.35"
                />

                {/* Silk Sheen Overlay */}
                <path
                  d="M180 124 L142 142 L124 220 L122 305 L134 305 L140 220 L162 185 L144 410 Q190 422 236 410 L218 185 L240 220 L246 305 L258 305 L256 220 L238 142 L200 124 Z"
                  fill="url(#silkShineGrad)"
                />

                {/* Cổ Lập Lĩnh cao 2.5cm */}
                <path
                  d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z"
                  fill={goldColor}
                  stroke="#5A1A12"
                  strokeWidth="0.8"
                />

                {/* Vạt hò cài chéo sang nách phải */}
                <path
                  d="M195 132 Q202 155 212 175 L210 330"
                  stroke="rgba(212, 175, 55, 0.75)"
                  strokeWidth="1.3"
                  fill="none"
                />

                {/* 5 Cúc Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) */}
                {[132, 150, 170, 192, 218].map((y, i) => (
                  <g key={i}>
                    <circle cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#goldButtonGrad)" />
                    <circle cx={195 + i * 3.5} cy={y} r="0.9" fill="#FFFFFF" opacity="0.8" />
                  </g>
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
        ) : (
          /* Áo lót bạch / Mannequin inner silhouette when top is unselected */
          <g id="unselected-top-garment" opacity={0.75}>
            <path
              d="M182 124 L154 140 L154 260 L146 395 Q190 405 234 395 L226 260 L226 140 L198 124 Z"
              fill="#F5F3EF"
              stroke="#D5CEBE"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <path d="M180 124 L190 148 L200 124" stroke="#C4BBAA" strokeWidth="1.2" fill="none" />
            <path d="M190 148 L190 395" stroke="#D5CEBE" strokeWidth="0.8" strokeDasharray="3 3" />
            <path d="M154 140 L132 260 L142 265 L162 165 Z" fill="#EAE5DC" stroke="#D5CEBE" strokeWidth="0.8" />
            <path d="M226 140 L248 260 L238 265 L218 165 Z" fill="#EAE5DC" stroke="#D5CEBE" strokeWidth="0.8" />
            <rect x="150" y="240" width="80" height="20" rx="5" fill="#0F172A" fillOpacity="0.75" stroke="#C4BBAA" strokeWidth="0.6" />
            <text x="190" y="253" textAnchor="middle" fill="#E2E8F0" fontSize="8.5" fontFamily="sans-serif">
              (Chưa chọn áo)
            </text>
          </g>
        )}

        {/* ===== 4. HEADPIECE (KHĂN ĐÓNG, MẤN, NÓN BA TẦM, KHĂN RẰN) ===== */}
        {activeAccessory ? (
          <g
            id="headpiece-layer"
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPin('accessory')}
            onMouseLeave={() => setHoveredPin(null)}
          >
            {headpieceType === 'non-ba-tam' ? (
              /* Nón Ba Tầm Quai Thao (Áo Tứ Thân) */
              <g id="non-ba-tam">
                <ellipse cx="190" cy="50" rx="46" ry="14" fill="#CBB693" stroke="#8A734D" strokeWidth="1" />
                <ellipse cx="190" cy="50" rx="42" ry="11" fill="none" stroke="#8A734D" strokeWidth="0.6" />
                <path d="M160 55 Q168 95 166 140" stroke="#D83A56" strokeWidth="2.2" fill="none" />
                <path d="M220 55 Q212 95 214 140" stroke="#D83A56" strokeWidth="2.2" fill="none" />
              </g>
            ) : headpieceType === 'khan-ran' ? (
              /* Khăn Rằn quấn đầu Nam Bộ */
              <g id="khan-ran-head">
                <ellipse cx="190" cy="52" rx="27" ry="12" fill="url(#khanRanPattern)" stroke="#1A1A1A" strokeWidth="1" />
                <path d="M206 50 Q218 62 214 85" stroke="#1A1A1A" strokeWidth="3" fill="none" />
              </g>
            ) : (
              /* Khăn Đóng / Mấn Tròn Cung Đình */
              <g id="man-tron">
                <ellipse cx="190" cy="52" rx="28" ry="12" fill="#1A1816" />
                <path
                  d="M162 53 Q190 42 218 53 Q190 62 162 53 Z"
                  fill={headpieceType === 'man-vang' ? '#B8860B' : '#1D2533'}
                  stroke={goldColor}
                  strokeWidth="1.4"
                />
                {/* Chevron pleat for Khăn Đóng or golden floral rim for Mấn */}
                <path
                  d="M166 50 Q190 39 214 50"
                  fill="none"
                  stroke={goldColor}
                  strokeWidth="0.9"
                  opacity="0.85"
                />
                <circle cx="190" cy="50" r="3" fill="url(#goldButtonGrad)" />
              </g>
            )}

            {/* Ngọc bội thắt lưng nếu phụ kiện là ngọc bội */}
            {activeAccessory.id === 'ngoc-boi' && (
              <g id="ngoc-boi-charm">
                <path d="M208 240 L208 310" stroke="#C82333" strokeWidth="1.4" />
                <circle cx="208" cy="270" r="6.5" fill="#50C878" stroke="#D4AF37" strokeWidth="1.2" />
                <circle cx="208" cy="270" r="2.5" fill="#2E7D46" />
                <path d="M206 278 L204 315 M208 278 L208 318 M210 278 L212 315" stroke="#C82333" strokeWidth="1.2" />
              </g>
            )}
          </g>
        ) : (
          /* Búi tóc tự nhiên của người mẫu khi không đội phụ kiện */
          <g id="natural-hair-knot" opacity={0.9}>
            <ellipse cx="190" cy="48" rx="14" ry="7" fill="#1A1816" />
            <circle cx="190" cy="44" r="5" fill="#141110" />
          </g>
        )}
        </svg>

        {/* Celestial Silk Sash Fluttering Around 2D Mannequin */}
        <CelestialSilkSash
          isHovering={isHoveringSilk}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Floating Silk Tactile Feedback on Hover */}
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
                {hoveredItem ? `Đang xem: ${hoveredItem.name}` : 'Bản vẽ 2D chuyển động lụa mềm'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Bottom Floating Action Toolbar */}
      <div className="absolute bottom-3 z-30 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onDownloadPhoto}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#131C2E]/90 hover:bg-[#1C2840] text-slate-200 border border-slate-700/80 hover:border-amber-400/50 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Xuất Lookbook</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPluck(523.25);
            setIsLightboxOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#131C2E]/90 hover:bg-[#1C2840] text-slate-200 border border-slate-700/80 hover:border-amber-400/50 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Soi Chi Tiết Cổ Phục Gốc</span>
        </button>
      </div>

      {/* ========================================================
          8. HIGH-RES LIGHTBOX MODAL: FULL RESOLUTION INSPECTION
         ======================================================== */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[92vh] bg-[#0E1526] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/70 hover:bg-black text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image in High Detail */}
              <div className="w-full md:w-3/5 bg-black/70 flex items-center justify-center p-4 relative min-h-[350px] md:min-h-[500px]">
                {(activeGarment || activeBottom || activeAccessory) ? (
                  <img
                    src={(activeGarment || activeBottom || activeAccessory)!.imageUrl}
                    alt={(activeGarment || activeBottom || activeAccessory)!.name}
                    className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">Chưa có trang phục được chọn</div>
                )}
              </div>

              {/* Right Column: Cultural Details & Historical Analysis */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] custom-scrollbar space-y-4">
                {(activeGarment || activeBottom || activeAccessory) && (() => {
                  const item = (activeGarment || activeBottom || activeAccessory)!;
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-semibold uppercase">
                          {item.era}
                        </span>
                        <span className="text-xs text-slate-400">{item.badge}</span>
                        {item.gender && (
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-md font-sans-vi border uppercase font-semibold ${
                              item.gender === 'nam'
                                ? 'bg-sky-950/80 text-sky-300 border-sky-400/50'
                                : item.gender === 'nu'
                                ? 'bg-rose-950/80 text-rose-300 border-rose-400/50'
                                : 'bg-amber-950/80 text-amber-300 border-amber-400/50'
                            }`}
                          >
                            {item.gender === 'nam'
                              ? 'Nam Phục'
                              : item.gender === 'nu'
                              ? 'Nữ Phục'
                              : 'Unisex'}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold font-serif-vi text-amber-200">
                        {item.name}
                      </h2>

                      {item.cultureInfo && (
                        <div className="mt-4 space-y-3 bg-[#131B2F] p-3.5 rounded-2xl border border-slate-700/60 text-xs">
                          {item.cultureInfo.collarType && (
                            <div>
                              <strong className="text-amber-300 text-[11px] block">
                                Cổ Áo & Đường May:
                              </strong>
                              <span className="text-slate-300 text-[11px] leading-relaxed">
                                {item.cultureInfo.collarType}
                              </span>
                            </div>
                          )}

                          {item.cultureInfo.symbolism && (
                            <div>
                              <strong className="text-amber-300 text-[11px] block">
                                Ý Nghĩa Biểu Tượng:
                              </strong>
                              <span className="text-slate-300 text-[11px] leading-relaxed">
                                {item.cultureInfo.symbolism}
                              </span>
                            </div>
                          )}

                          {item.cultureInfo.origin && (
                            <div className="pt-2 border-t border-slate-700/60">
                              <strong className="text-amber-400 text-[11px] block">
                                Nguồn Gốc Lịch Sử:
                              </strong>
                              <span className="text-slate-300 text-[11px] leading-relaxed">
                                {item.cultureInfo.origin}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="pt-2">
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-lg cursor-pointer"
                  >
                    Đóng Xem Chi Tiết
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
