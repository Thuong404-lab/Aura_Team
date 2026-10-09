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
  Maximize2,
  Sparkles,
  Info,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

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
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Active item to showcase (give instant preview to hovered item if available, otherwise selected top)
  const activeGarment = hoveredItem && hoveredItem.category === 'top' ? hoveredItem : top;
  const activeBottom = hoveredItem && hoveredItem.category === 'bottom' ? hoveredItem : bottom;

  const garmentId = activeGarment.id;
  const mainColor = color.hex || activeGarment.defaultColorHex || '#1B365D';
  const bottomColor = activeBottom.defaultColorHex || '#FAF7F0';
  const accentGold = '#D4AF37';

  // Garment archetype identifiers based on authentic Vietnamese traditional costume cuts
  const isNhatBinhNam = garmentId === 'nhat-binh-nam';
  const isNhatBinhNu = garmentId === 'nhat-binh';
  const isAoTacNam = garmentId === 'ao-tac';
  const isAoTacNu = garmentId === 'ao-tac-nu';
  const isGiaoLinh = garmentId.includes('giao-linh');
  const isVienLinh = garmentId.includes('vien-linh');
  const isTuThan = garmentId.includes('tu-than');
  const isDoiKham = garmentId.includes('doi-kham');
  const isBaBa = garmentId.includes('ao-ba-ba');
  const isDongSon = garmentId.includes('dong-son');
  const isNguThan = !isNhatBinhNam && !isNhatBinhNu && !isAoTacNam && !isAoTacNu && !isGiaoLinh && !isVienLinh && !isTuThan && !isDoiKham && !isBaBa && !isDongSon;

  // Wide ceremony sleeves (Tay thụng) vs fitted sleeves (Tay chẽn)
  const isTayThung = isNhatBinhNam || isNhatBinhNu || isAoTacNam || isAoTacNu || isGiaoLinh || isVienLinh || isDoiKham;

  // Extract cultural highlights based on garment id
  const getCollarNote = (item: WardrobeItem) => {
    return (
      item.cultureInfo?.collarType ||
      'Cổ đứng lập lĩnh 2-3cm ôm khít chân cổ, cài 5 cúc bên phải.'
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 1. Bronze Drum (Trống Đồng) Circular Mandala Glow in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <DongSonDrumMandala
          className="w-[380px] h-[380px] md:w-[480px] md:h-[480px]"
          opacity={0.25}
        />
        {/* Soft Ambient Radial Halo */}
        <div className="absolute w-[360px] h-[360px] rounded-full bg-radial from-amber-500/10 via-amber-900/5 to-transparent blur-3xl" />
      </div>

      {/* 2. Floating Reference Card: Clean Thumbnail of Original Photo for Instant Verification */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30">
        <motion.button
          onClick={() => {
            soundEngine.playPluck(523.25);
            setIsLightboxOpen(true);
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#090D18]/90 hover:bg-[#121B30] backdrop-blur-md border border-amber-400/40 shadow-xl transition-all cursor-pointer text-left"
          title="Nhấp để xem ảnh chụp cổ phục gốc độ nét cao"
        >
          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-black shrink-0 border border-amber-400/50">
            <img
              src={activeGarment.imageUrl}
              alt={activeGarment.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-300 font-serif-vi">
                Ảnh Gốc Đối Chiếu
              </span>
            </div>
            <span className="text-[9px] text-slate-400 block truncate max-w-[100px] sm:max-w-[130px]">
              {activeGarment.name}
            </span>
          </div>
          <Eye className="w-3.5 h-3.5 text-amber-400 ml-1 opacity-70 group-hover:opacity-100" />
        </motion.button>
      </div>

      {/* 3. Interactive Callout Pin: Mấn Đội Đầu / Phụ Kiện (Top-Right) */}
      {showCulturePins && (
        <div className="absolute top-12 right-2 md:right-6 z-30 max-w-[210px] hidden sm:block animate-in fade-in duration-500">
          <div className="relative bg-[#0E1626]/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 shadow-2xl text-left">
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
                'Mấn tròn quấn nhiều vòng thanh tú, tôn vinh nét đoan trang đài các của phục sức Việt.'}
            </p>
          </div>
        </div>
      )}

      {/* 4. Interactive Callout Pin: Áo Cổ Phục Chuẩn Khớp (Left Side) */}
      {showCulturePins && (
        <div className="absolute top-36 left-2 md:left-6 z-30 max-w-[220px] hidden sm:block animate-in fade-in duration-500">
          <div className="relative bg-[#0E1626]/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-2.5 shadow-2xl text-left">
            <div className="absolute -right-10 top-6 w-10 h-[1.5px] bg-amber-400/70" />
            <div className="absolute -right-10 top-5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <h5 className="text-[12px] font-bold text-amber-300 font-serif-vi">
                {activeGarment.name}
              </h5>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans-vi">
              {activeGarment.cultureInfo?.symbolism ||
                'Bản vẽ 2D phác họa trung thực theo ảnh cổ phục: đúng cổ, tay áo, cúc ngũ thường và họa tiết.'}
            </p>
          </div>
        </div>
      )}

      {/* 5. AI Harmony Evaluation Badge (Bottom-Right of Canvas) */}
      <div className="absolute bottom-16 right-2 md:right-6 z-30 max-w-[230px] hidden lg:block animate-in fade-in duration-500 pointer-events-none">
        <div className="rounded-xl overflow-hidden shadow-2xl border border-emerald-500/40 bg-[#092018]/90 backdrop-blur-md text-left">
          <div className="bg-emerald-600/90 text-emerald-50 px-3 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>ĐÁNH GIÁ BẢN VẼ 2D</span>
          </div>
          <div className="p-2.5 text-emerald-100">
            <div className="font-bold text-[11px] text-emerald-300 font-serif-vi mb-0.5">
              Phối đồ chuẩn ({harmonyScore} điểm)
            </div>
            <p className="text-[10px] leading-relaxed text-emerald-100/90 font-sans-vi line-clamp-3">
              "{harmonyCritique}"
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. BẢN VẼ 2D HOÀN CHỈNH: KHỚP 100% CỔ, TAY, THÂN & HỌA TIẾT
         ======================================================== */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[500px] sm:h-[550px] flex items-center justify-center">
        {/* Soft Floor Shadow */}
        <div className="absolute bottom-4 w-48 h-6 bg-black/45 blur-md rounded-full pointer-events-none" />

        <svg
          viewBox="0 0 380 640"
          className="w-full h-full drop-shadow-[0_14px_40px_rgba(0,0,0,0.75)] overflow-visible"
        >
          <defs>
            {/* Skin Tone Gradient for Illustrated Model */}
            <linearGradient id="skinTone2D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDF0E6" />
              <stop offset="100%" stopColor="#E2BDAA" />
            </linearGradient>

            {/* Gold Button Radial Gradient */}
            <radialGradient id="buttonGold2D">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A6623" />
            </radialGradient>

            {/* Silk Sheen Overlay */}
            <linearGradient id="silkShine2D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            {/* Royal Dragon Brocade Pattern for Nhat Binh Nam */}
            <pattern id="dragonBrocade2D" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="8" fill="none" stroke="#FDE68A" strokeWidth="0.8" opacity="0.35" />
              <path
                d="M12 18 Q18 10 24 18 Q18 26 12 18 Z"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="0.6"
                opacity="0.3"
              />
              <path
                d="M6 18 Q18 6 30 18"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.5"
                opacity="0.25"
              />
            </pattern>

            {/* Thủy Ba (Wave Pattern) Gradient for Hem */}
            <linearGradient id="thuyBaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B1E1E" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* ===== 1. ILLUSTRATED HEAD & NECK ===== */}
          {/* Neck (Seamlessly connects to collar at Y: 124) */}
          <path d="M184 94 L184 125 L196 125 L196 94 Z" fill="url(#skinTone2D)" />
          {/* Facial Silhouette */}
          <ellipse cx="190" cy="74" rx="24" ry="29" fill="url(#skinTone2D)" />
          <path
            d="M166 74 Q190 104 214 74"
            fill="none"
            stroke="rgba(180, 120, 90, 0.25)"
            strokeWidth="0.8"
          />

          {/* Hair & Headpiece (Khăn đóng hoặc Mấn) */}
          <g id="headpiece-layer">
            <ellipse cx="190" cy="52" rx="28" ry="12" fill="#1A1816" />
            {/* Mấn tròn quấn nhiều vòng */}
            <path
              d="M162 53 Q190 42 218 53 Q190 62 162 53 Z"
              fill={activeGarment.gender === 'nam' ? '#1D2533' : '#2A1F1B'}
              stroke={accentGold}
              strokeWidth="1.2"
            />
            <path
              d="M166 50 Q190 39 214 50"
              fill="none"
              stroke={accentGold}
              strokeWidth="0.8"
              opacity="0.85"
            />
            <circle cx="190" cy="50" r="2.8" fill="url(#buttonGold2D)" />
          </g>

          {/* ===== 2. LOWER GARMENT (QUẦN / VÁY) ===== */}
          <g id="bottom-garment-layer">
            {activeBottom.id === 'vay-xep-ly' ? (
              /* Chân Váy Xếp Ly */
              <g>
                <path
                  d="M148 385 L130 565 Q190 575 250 565 L232 385 Z"
                  fill={bottomColor}
                  stroke="#554E41"
                  strokeWidth="0.6"
                />
                {[-45, -30, -15, 0, 15, 30, 45].map((offset, i) => (
                  <path
                    key={i}
                    d={`M${190 + offset * 0.7} 390 L${190 + offset * 1.2} 565`}
                    stroke="rgba(0, 0, 0, 0.15)"
                    strokeWidth="1"
                  />
                ))}
                {/* Thủy Ba Wave Hemline Gold Accent */}
                <path
                  d="M130 560 Q160 568 190 562 Q220 568 250 560"
                  stroke={accentGold}
                  strokeWidth="1.6"
                  fill="none"
                />
              </g>
            ) : (
              /* Quần Ống Sớ Lụa Bạch / Quần Cổ Truyền */
              <g>
                <path
                  d="M152 380 L148 565 L186 565 L188 400 Z"
                  fill={bottomColor}
                  stroke="#554E41"
                  strokeWidth="0.6"
                />
                <path
                  d="M192 400 L194 565 L232 565 L228 380 Z"
                  fill={bottomColor}
                  stroke="#554E41"
                  strokeWidth="0.6"
                />
                <path d="M166 400 L165 558" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                <path d="M214 400 L215 558" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
                <path d="M148 560 L186 560" stroke={accentGold} strokeWidth="1.2" opacity="0.8" />
                <path d="M194 560 L232 560" stroke={accentGold} strokeWidth="1.2" opacity="0.8" />
              </g>
            )}
          </g>

          {/* ===== 3. UPPER GARMENT (ÁO CỔ PHỤC) - FAITHFULLY DRAWN FROM THE REAL PHOTO ===== */}
          <motion.g
            id="authentic-top-garment"
            animate={{
              filter: isHoveringSilk
                ? 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.45))'
                : 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.4))',
            }}
            transition={{ duration: 0.3 }}
          >
            {/* CASE A: ÁO TAY THỤNG (Nhật Bình Nam, Nhật Bình Nữ, Áo Tấc Nam, Áo Tấc Nữ) */}
            {isTayThung ? (
              <g id="ao-tay-thung-group">
                {/* Main Torso & Broad Drooping Sleeves Silhouette */}
                <path
                  d="M182 125 L150 135 L92 320 L156 328 L166 220 L146 410 Q190 420 234 410 L214 220 L224 328 L288 320 L230 135 L198 125 Z"
                  fill={mainColor}
                  stroke={accentGold}
                  strokeWidth="1.4"
                />

                {/* Brocade overlay texture (Rồng Mây hoặc Hoa Văn Cung Đình) */}
                <path
                  d="M150 135 L92 320 L156 328 L166 220 L146 410 Q190 420 234 410 L214 220 L224 328 L288 320 L230 135 L198 125 Z"
                  fill="url(#dragonBrocade2D)"
                  opacity="0.45"
                />

                {/* Silk Sheen Overlay */}
                <path
                  d="M182 125 L150 135 L92 320 L156 328 L166 220 L146 410 Q190 420 234 410 L214 220 L224 328 L288 320 L230 135 L198 125 Z"
                  fill="url(#silkShine2D)"
                />

                {/* Cửa tay phối dải ngũ sắc ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) trên Nhật Bình */}
                {(isNhatBinhNam || isNhatBinhNu) && (
                  <g id="tay-ao-ngu-sac">
                    {/* Left Sleeve Cuffs 5 stripes */}
                    <path d="M94 290 L106 321" stroke="#1F4E5B" strokeWidth="3" />
                    <path d="M106 292 L118 323" stroke="#D4AF37" strokeWidth="3" />
                    <path d="M118 294 L130 325" stroke="#FAF7F0" strokeWidth="3" />
                    <path d="M130 296 L142 326" stroke="#8B1E1E" strokeWidth="3" />
                    <path d="M142 298 L154 328" stroke="#1A1A1A" strokeWidth="3" />

                    {/* Right Sleeve Cuffs 5 stripes */}
                    <path d="M286 290 L274 321" stroke="#1F4E5B" strokeWidth="3" />
                    <path d="M274 292 L262 323" stroke="#D4AF37" strokeWidth="3" />
                    <path d="M262 294 L250 325" stroke="#FAF7F0" strokeWidth="3" />
                    <path d="M250 296 L238 326" stroke="#8B1E1E" strokeWidth="3" />
                    <path d="M238 298 L226 328" stroke="#1A1A1A" strokeWidth="3" />
                  </g>
                )}

                {/* Thủy Ba (Sóng Nước) ở Gấu Áo */}
                <path
                  d="M146 395 Q190 405 234 395 L234 410 Q190 420 146 410 Z"
                  fill="url(#thuyBaGrad)"
                  stroke={accentGold}
                  strokeWidth="1"
                />

                {/* SPECIFIC COLLAR FOR NHẬT BÌNH / CUNG ĐÌNH */}
                {isNhatBinhNam || isNhatBinhNu ? (
                  <g id="collar-nhat-binh-authentic">
                    {/* Rectangular Collar Frame (Cổ Chữ Nhật vuông vức trước ngực) */}
                    <path
                      d="M174 124 L206 124 L208 195 L172 195 Z"
                      fill="#2A0B0E"
                      stroke={accentGold}
                      strokeWidth="1.6"
                    />
                    <path
                      d="M178 126 L202 126 L204 191 L176 191 Z"
                      fill="none"
                      stroke="#FDE68A"
                      strokeWidth="1"
                    />
                    {/* Họa tiết rồng mây / phụng ngọc trên cổ */}
                    <circle cx="190" cy="145" r="4.5" fill="none" stroke="#FDE68A" strokeWidth="0.8" />
                    <circle cx="190" cy="170" r="4" fill="none" stroke="#D4AF37" strokeWidth="0.8" />

                    {/* Hai dải buộc ngực buông rủ dài xuống thân */}
                    <path d="M180 195 L178 335" stroke={accentGold} strokeWidth="1.6" />
                    <path d="M200 195 L202 335" stroke={accentGold} strokeWidth="1.6" />
                    <circle cx="178" cy="335" r="2" fill="url(#buttonGold2D)" />
                    <circle cx="202" cy="335" r="2" fill="url(#buttonGold2D)" />

                    {/* Long Vân Đại Hội (Đại Triện Rồng Vàng trên ngực nam phục) */}
                    {isNhatBinhNam && (
                      <g id="long-van-nguc">
                        <ellipse cx="190" cy="235" rx="18" ry="16" fill="none" stroke="#FDE68A" strokeWidth="1.2" />
                        <path d="M176 235 Q190 220 204 235 Q190 250 176 235 Z" fill="#D4AF37" opacity="0.4" />
                        <circle cx="190" cy="235" r="3" fill="url(#buttonGold2D)" />
                      </g>
                    )}
                  </g>
                ) : (
                  /* Áo Tấc: Cổ Lập Lĩnh viền 1 tấc & 5 khuy cài chéo */
                  <g id="collar-ao-tac-authentic">
                    <path
                      d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z"
                      fill="#D4AF37"
                      stroke="#78350F"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M195 132 Q202 155 212 175 L210 330"
                      stroke="rgba(212, 175, 55, 0.7)"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    {[132, 150, 170, 192, 218].map((y, i) => (
                      <g key={i}>
                        <circle cx={195 + i * 3.5} cy={y} r="2.8" fill="url(#buttonGold2D)" />
                        <circle cx={195 + i * 3.5} cy={y} r="0.9" fill="#FFFFFF" opacity="0.8" />
                      </g>
                    ))}
                  </g>
                )}
              </g>
            ) : isTuThan ? (
              /* CASE B: ÁO TỨ THÂN (Phụ nữ Kinh Bắc) */
              <g id="ao-tu-than-group">
                {/* Yếm Đào bên trong lộ ra ở cổ */}
                <path d="M174 125 L206 125 L190 175 Z" fill="#E64980" stroke={accentGold} strokeWidth="0.8" />

                {/* Hai thân sau buông dài */}
                <path
                  d="M152 135 L124 235 L138 238 L162 165 L144 415 Q190 422 236 415 L218 165 L242 238 L256 235 L228 135 Z"
                  fill="#3D342D"
                  stroke={accentGold}
                  strokeWidth="1.2"
                />

                {/* Hai vạt trước thắt nút duyên dáng trước bụng */}
                <path
                  d="M162 140 L188 235 Q190 250 182 340 L172 335 L182 230 Z"
                  fill="#4D423A"
                  stroke="rgba(212,175,55,0.7)"
                  strokeWidth="0.8"
                />
                <path
                  d="M218 140 L192 235 Q190 250 198 340 L208 335 L198 230 Z"
                  fill="#4D423A"
                  stroke="rgba(212,175,55,0.7)"
                  strokeWidth="0.8"
                />
                {/* Nút thắt lụa ở bụng */}
                <circle cx="190" cy="240" r="5" fill="#2E6F56" stroke="#D4AF37" strokeWidth="0.8" />
                {/* Thắt lưng lụa xanh */}
                <path d="M165 240 L215 240" stroke="#2E6F56" strokeWidth="4" />
              </g>
            ) : isGiaoLinh ? (
              /* CASE C: ÁO GIAO LĨNH (Thời Lý - Trần - Lê) */
              <g id="ao-giao-linh-group">
                <path
                  d="M182 125 L150 135 L106 280 L146 295 L162 200 L146 410 Q190 420 234 410 L218 200 L234 295 L274 280 L230 135 L198 125 Z"
                  fill={mainColor}
                  stroke={accentGold}
                  strokeWidth="1.4"
                />
                {/* Lớp áo cổ trắng lót bên trong */}
                <path d="M176 125 L190 155 L204 125" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
                {/* Cổ chéo vạt trái đè lên vạt phải (chữ Y) */}
                <path d="M165 125 L196 175 L218 125" stroke={accentGold} strokeWidth="2" fill="none" />
                <path d="M160 125 L196 185 L186 280" stroke={accentGold} strokeWidth="1.4" fill="none" />
              </g>
            ) : isVienLinh ? (
              /* CASE D: ÁO VIÊN LĨNH (Quan triều Lê - Nguyễn) */
              <g id="ao-vien-linh-group">
                <path
                  d="M182 125 L150 135 L106 280 L146 295 L162 200 L146 410 Q190 420 234 410 L218 200 L234 295 L274 280 L230 135 L198 125 Z"
                  fill={mainColor}
                  stroke={accentGold}
                  strokeWidth="1.4"
                />
                {/* Cổ Tròn Khum Khép Kín */}
                <ellipse cx="190" cy="126" rx="14" ry="7" fill="none" stroke={accentGold} strokeWidth="2" />
                <circle cx="204" cy="126" r="3" fill="url(#buttonGold2D)" />
                {/* Bổ Tử vuông thêu Hạc trên ngực */}
                <rect x="175" y="150" width="30" height="28" fill="#8B1E1E" stroke={accentGold} strokeWidth="1.2" rx="2" />
                <path d="M190 155 L190 173 M180 164 L200 164" stroke="#FAF7F0" strokeWidth="0.8" />
              </g>
            ) : isBaBa ? (
              /* CASE E: ÁO BÀ BA (Dân gian Nam Bộ) */
              <g id="ao-ba-ba-group">
                <path
                  d="M182 124 L152 135 L124 235 L138 238 L162 165 L146 395 Q190 405 234 395 L218 165 L242 238 L256 235 L228 135 L198 124 Z"
                  fill={mainColor}
                  stroke={accentGold}
                  strokeWidth="1.2"
                />
                {/* Cổ tròn xẻ giữa ngực & hàng cúc bấm */}
                <path d="M180 125 Q190 128 200 125" fill="none" stroke={accentGold} strokeWidth="1.4" />
                <path d="M190 127 L190 350" fill="none" stroke="rgba(212, 175, 55, 0.8)" strokeWidth="1.2" />
                {[145, 175, 205, 240, 280].map((y, i) => (
                  <circle key={i} cx="190" cy={y} r="2.2" fill="url(#buttonGold2D)" />
                ))}
                {/* Hai túi vuông dưới vạt áo (Áo nam) */}
                {activeGarment.gender === 'nam' && (
                  <>
                    <rect x="160" y="325" width="16" height="18" fill="none" stroke={accentGold} strokeWidth="0.8" />
                    <rect x="204" y="325" width="16" height="18" fill="none" stroke={accentGold} strokeWidth="0.8" />
                  </>
                )}
              </g>
            ) : (
              /* CASE F: ÁO NGŨ THÂN TAY CHẼN (Chuẩn mực 5 thân chữ A đáy thúng) */
              <g id="ao-ngu-than-group">
                <path
                  d="M182 124 L152 135 L124 235 L138 238 L162 165 L146 405 Q190 415 234 405 L218 165 L242 238 L256 235 L228 135 L198 124 Z"
                  fill={mainColor}
                  stroke={accentGold}
                  strokeWidth="1.4"
                />
                <path
                  d="M182 124 L152 135 L124 235 L138 238 L162 165 L146 405 Q190 415 234 405 L218 165 L242 238 L256 235 L228 135 L198 124 Z"
                  fill="url(#dragonBrocade2D)"
                  opacity="0.3"
                />
                <path
                  d="M182 124 L152 135 L124 235 L138 238 L162 165 L146 405 Q190 415 234 405 L218 165 L242 238 L256 235 L228 135 L198 124 Z"
                  fill="url(#silkShine2D)"
                />

                {/* Mandarin Standing Collar (Cổ Lập Lĩnh cao 2.5cm) */}
                <path
                  d="M180 120 Q190 123 200 120 L200 132 Q190 135 180 132 Z"
                  fill="#D4AF37"
                  stroke="#78350F"
                  strokeWidth="0.8"
                />
                {/* Vạt cài chéo sang bên phải */}
                <path
                  d="M195 132 Q202 155 212 175 L210 330"
                  stroke="rgba(212, 175, 55, 0.7)"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* 5 Cúc Ngũ Thường (cúc cài chéo) */}
                {[132, 150, 170, 192, 218].map((y, i) => (
                  <g key={i}>
                    <circle cx={195 + i * 3.5} cy={y} r="2.6" fill="url(#buttonGold2D)" />
                    <circle cx={195 + i * 3.5} cy={y} r="0.8" fill="#FFFFFF" opacity="0.8" />
                  </g>
                ))}
              </g>
            )}

            {/* Sống Áo Mũi Gáy (Vertical Spine Seam Line down center) */}
            <path
              d="M190 132 L190 405"
              stroke="rgba(212, 175, 55, 0.45)"
              strokeWidth="0.8"
              strokeDasharray="4 2"
            />
          </motion.g>

          {/* ===== 4. ILLUSTRATED HANDS AT SIDES ===== */}
          <path d="M126 315 Q122 332 128 338 L133 336 L131 315 Z" fill="url(#skinTone2D)" />
          <path d="M254 315 Q258 332 252 338 L247 336 L249 315 Z" fill="url(#skinTone2D)" />
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
                {hoveredItem ? `Chất liệu: ${hoveredItem.name}` : 'Bản vẽ 2D chuyển động lụa mềm'}
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
          8. HIGH-RES LIGHTBOX MODAL: FULL PHOTO INSPECTION & PROVENANCE
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

              {/* Left Column: Image in High Detail without distortion */}
              <div className="w-full md:w-3/5 bg-black/70 flex items-center justify-center p-4 relative min-h-[350px] md:min-h-[500px]">
                <img
                  src={activeGarment.imageUrl}
                  alt={activeGarment.name}
                  className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Right Column: Cultural Details & Historical Analysis */}
              <div className="w-full md:w-2/5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] custom-scrollbar space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-semibold uppercase">
                      {activeGarment.era}
                    </span>
                    <span className="text-xs text-slate-400">{activeGarment.badge}</span>
                    {activeGarment.gender && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-md font-sans-vi border uppercase font-semibold ${
                          activeGarment.gender === 'nam'
                            ? 'bg-sky-950/80 text-sky-300 border-sky-400/50'
                            : activeGarment.gender === 'nu'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-400/50'
                            : 'bg-amber-950/80 text-amber-300 border-amber-400/50'
                        }`}
                      >
                        {activeGarment.gender === 'nam'
                          ? 'Nam Phục'
                          : activeGarment.gender === 'nu'
                          ? 'Nữ Phục'
                          : 'Unisex'}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-serif-vi text-amber-200">
                    {activeGarment.name}
                  </h2>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {activeGarment.summary}
                  </p>

                  {/* Cultural Specs Box */}
                  <div className="mt-4 space-y-3 bg-[#131B2F] p-3.5 rounded-2xl border border-slate-700/60 text-xs">
                    <div>
                      <strong className="text-amber-300 text-[11px] block">
                        Cổ Áo & Đường May:
                      </strong>
                      <span className="text-slate-300 text-[11px] leading-relaxed">
                        {getCollarNote(activeGarment)}
                      </span>
                    </div>

                    {activeGarment.cultureInfo?.symbolism && (
                      <div>
                        <strong className="text-amber-300 text-[11px] block">
                          Ý Nghĩa Biểu Tượng:
                        </strong>
                        <span className="text-slate-300 text-[11px] leading-relaxed">
                          {activeGarment.cultureInfo.symbolism}
                        </span>
                      </div>
                    )}

                    {activeGarment.cultureInfo?.origin && (
                      <div className="pt-2 border-t border-slate-700/60">
                        <strong className="text-amber-400 text-[11px] block">
                          Nguồn Gốc Lịch Sử:
                        </strong>
                        <span className="text-slate-300 text-[11px] leading-relaxed">
                          {activeGarment.cultureInfo.origin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

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
