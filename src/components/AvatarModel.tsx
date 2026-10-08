import React, { useState } from 'react';
import { WardrobeItem, FabricOption, ColorOption } from '../data/vietPhucData';
import { Eye, Info, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface AvatarModelProps {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabric: FabricOption;
  color: ColorOption;
  showCultureCard: boolean;
  setShowCultureCard: (show: boolean) => void;
  onSelectHotspot?: (type: 'collar' | 'sleeve' | 'fabric' | 'accessory') => void;
}

export const AvatarModel: React.FC<AvatarModelProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  showCultureCard,
  setShowCultureCard,
}) => {
  const [angle, setAngle] = useState<'front' | 'threeQuarter' | 'side'>('front');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePin, setActivePin] = useState<'collar' | 'buttons' | 'sleeve' | 'fabric' | null>('collar');

  const mainColor = color.hex;
  const accentColor = color.accentHex || '#D4AF37';

  // Sheen overlay style according to fabric
  const getFabricOpacity = () => {
    if (fabric.id === 'sa-nam-bo') return 0.88;
    return 1;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-white/80 backdrop-blur-md text-[#8B1E1E] border border-[#D4AF37]/30 shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B1E1E] animate-pulse" />
          MÔ HÌNH 3D VẬT LÝ VẢI
        </span>
        <button
          onClick={() => setShowCultureCard(!showCultureCard)}
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 border ${
            showCultureCard
              ? 'bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm'
              : 'bg-white/80 text-stone-700 hover:bg-white border-stone-200'
          }`}
          title="Bật/Tắt thẻ phân tích văn hóa"
        >
          <Info className="w-3 h-3" />
          {showCultureCard ? 'Ẩn thẻ văn hóa' : 'Xem thẻ văn hóa'}
        </button>
      </div>

      {/* Angle & Zoom toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-sm">
        <button
          onClick={() => setAngle('front')}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
            angle === 'front' ? 'bg-[#8B1E1E] text-white shadow-xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Chính diện
        </button>
        <button
          onClick={() => setAngle('threeQuarter')}
          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
            angle === 'threeQuarter' ? 'bg-[#8B1E1E] text-white shadow-xs' : 'text-stone-600 hover:text-black'
          }`}
        >
          Nghiêng 3/4
        </button>
        <div className="h-4 w-px bg-stone-200 mx-1" />
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.35))}
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
          title="Phóng to chi tiết"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
          title="Thu nhỏ"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setAngle('front');
          }}
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-100"
          title="Đặt lại góc nhìn"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Avatar Canvas Area */}
      <div
        className="relative w-full max-w-[340px] md:max-w-[420px] h-[520px] md:h-[620px] flex items-center justify-center transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${zoomLevel}) ${
            angle === 'threeQuarter'
              ? 'rotateY(-12deg) rotateX(2deg)'
              : angle === 'side'
              ? 'rotateY(-24deg)'
              : 'rotateY(0deg)'
          }`,
          perspective: '1000px',
        }}
      >
        {/* Soft Floor Shadow */}
        <div className="absolute bottom-4 w-56 h-8 bg-black/15 blur-xl rounded-full" />

        {/* Ambient Halo Behind Avatar */}
        <div
          className="absolute inset-10 rounded-full blur-3xl opacity-25 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: mainColor }}
        />

        {/* Scalable Vector Avatar Illustration */}
        <svg
          viewBox="0 0 400 680"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          style={{ opacity: getFabricOpacity() }}
        >
          <defs>
            {/* Fabric Gấm Gold Brocade Texture Pattern */}
            <pattern id="brocadePattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M12 0 L24 12 L12 24 L0 12 Z M12 6 L18 12 L12 18 L6 12 Z"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.75"
                opacity="0.35"
              />
              <circle cx="12" cy="12" r="1.5" fill={accentColor} opacity="0.4" />
            </pattern>

            {/* Cloud Wave Pattern for Nhật Bình */}
            <pattern id="cloudWavePattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M0 10 Q10 0 20 10 T40 10 M0 15 Q10 5 20 15 T40 15"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.8"
                opacity="0.5"
              />
            </pattern>

            {/* Gradients */}
            <linearGradient id="silkShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="bodySkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9E8DC" />
              <stop offset="100%" stopColor="#E5C7B4" />
            </linearGradient>

            <linearGradient id="goldCollar" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C59B27" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#B4821A" />
            </linearGradient>

            {/* Ngũ Hành Five Elements Stripe for Nhật Bình Sleeve */}
            <linearGradient id="nguHanhStripe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1F4E5B" />
              <stop offset="20%" stopColor="#8B1E1E" />
              <stop offset="40%" stopColor="#D4AF37" />
              <stop offset="60%" stopColor="#FDFBF7" />
              <stop offset="80%" stopColor="#1A1817" />
              <stop offset="100%" stopColor="#8B1E1E" />
            </linearGradient>
          </defs>

          {/* ===== 1. BASE BODY & HEAD MANNEQUIN ===== */}
          {/* Hair Bun / Cổ phục hair style */}
          <g id="hair">
            <ellipse cx="200" cy="76" rx="42" ry="46" fill="#1C1817" />
            <circle cx="200" cy="46" r="24" fill="#181514" />
            {/* Hair highlight */}
            <path d="M185 58 Q200 48 215 58" stroke="#3D3634" strokeWidth="2" fill="none" />
          </g>

          {/* Face & Neck */}
          <path d="M192 110 L192 135 L208 135 L208 110 Z" fill="url(#bodySkin)" />
          <ellipse cx="200" cy="94" rx="28" ry="34" fill="url(#bodySkin)" />
          {/* Stylized serene facial hints */}
          <path d="M188 92 Q193 94 196 92" stroke="#8A6658" strokeWidth="1.2" fill="none" />
          <path d="M204 92 Q207 94 212 92" stroke="#8A6658" strokeWidth="1.2" fill="none" />
          <path d="M198 97 L200 102 L202 97" stroke="#8A6658" strokeWidth="0.8" fill="none" opacity="0.6" />
          <path d="M195 109 Q200 112 205 109" stroke="#B04A4A" strokeWidth="1.6" fill="none" />

          {/* ===== 2. BOTTOM LAYER (QUẦN / VÁY) ===== */}
          <g id="bottomLayer">
            {bottom.id === 'vay-xep-ly' ? (
              // Pleated Skirt with Thủy Ba Hem
              <g>
                <path
                  d="M145 360 L110 590 Q200 610 290 590 L255 360 Z"
                  fill={bottom.defaultColorHex}
                  stroke="#331A1A"
                  strokeWidth="0.75"
                />
                {/* Pleat lines */}
                {[-70, -50, -30, -10, 10, 30, 50, 70].map((offset, i) => (
                  <path
                    key={i}
                    d={`M${200 + offset * 0.6} 365 L${200 + offset * 1.15} 595`}
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="1.5"
                  />
                ))}
                {/* Thủy Ba wave hem */}
                <path
                  d="M110 575 Q150 565 200 580 Q250 565 290 575 L290 590 Q200 610 110 590 Z"
                  fill="url(#goldCollar)"
                  opacity="0.85"
                />
              </g>
            ) : bottom.id === 'quan-tay-hien-dai' ? (
              // Modern Slim Pleated Trousers
              <g>
                <path d="M155 350 L140 590 L188 590 L196 420 L204 420 L212 590 L260 590 L245 350 Z" fill="#242120" />
                <path d="M165 370 L164 585 M235 370 L236 585" stroke="#3D3836" strokeWidth="1" />
              </g>
            ) : (
              // Traditional Quần Ống Sớ Lụa Bạch / Quần Cung Đình
              <g>
                <path
                  d="M150 340 L125 600 L188 600 L196 440 L204 440 L212 600 L275 600 L250 340 Z"
                  fill={bottom.defaultColorHex}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1"
                />
                {/* Soft Silk folds */}
                <path d="M155 380 Q150 490 145 595" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
                <path d="M245 380 Q250 490 255 595" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
                <path d="M185 460 Q182 530 180 595" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" fill="none" />
              </g>
            )}

            {/* Shoes / Hài */}
            {accessory.id === 'hai-theu' ? (
              <g id="haiTheu">
                <path d="M130 598 Q140 592 165 598 Q175 608 150 612 L130 606 Z" fill="#8B1E1E" />
                <path d="M128 598 Q120 592 126 586" stroke="#D4AF37" strokeWidth="2" fill="none" />
                <path d="M270 598 Q260 592 235 598 Q225 608 250 612 L270 606 Z" fill="#8B1E1E" />
                <path d="M272 598 Q280 592 274 586" stroke="#D4AF37" strokeWidth="2" fill="none" />
              </g>
            ) : (
              <g id="basicShoes">
                <path d="M136 600 Q150 596 170 600 L166 610 L134 608 Z" fill="#2C2420" />
                <path d="M264 600 Q250 596 230 600 L234 610 L266 608 Z" fill="#2C2420" />
              </g>
            )}
          </g>

          {/* ===== 3. TOP LAYER (ÁO CHÍNH) ===== */}
          <g id="topLayer">
            {/* Specific silhouette by Top Type */}
            {top.id === 'nhat-binh' ? (
              // ÁO NHẬT BÌNH
              <g id="aoNhatBinh">
                {/* Sleeves */}
                <path
                  d="M150 145 L70 230 L95 380 L145 320 L155 170 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M250 145 L330 230 L305 380 L255 320 L245 170 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* Ngũ Hành Five Elements Stripe on Sleeve Cuffs */}
                <path d="M72 235 L95 380 L115 365 L90 220 Z" fill="url(#nguHanhStripe)" />
                <path d="M328 235 L305 380 L285 365 L310 220 Z" fill="url(#nguHanhStripe)" />

                {/* Main Body Robe */}
                <path
                  d="M155 140 L245 140 L265 480 Q200 495 135 480 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.2"
                />

                {/* Brocade overlay if fabric is Gấm */}
                {fabric.id === 'gam-cung-dinh' && (
                  <path d="M155 140 L245 140 L265 480 Q200 495 135 480 Z" fill="url(#brocadePattern)" />
                )}

                {/* Rectangular Collar (Cổ Nhật Bình đặc trưng) */}
                <g id="coNhatBinh">
                  <path
                    d="M182 135 L218 135 L218 290 L206 290 L206 484 L194 484 L194 290 L182 290 Z"
                    fill="url(#goldCollar)"
                    stroke="#8B1E1E"
                    strokeWidth="1"
                  />
                  {/* Collar embroidery details */}
                  <rect x="186" y="145" width="28" height="135" fill="none" stroke="#8B1E1E" strokeWidth="1" />
                  <circle cx="200" cy="180" r="4" fill="#8B1E1E" />
                  <circle cx="200" cy="220" r="4" fill="#8B1E1E" />
                  <circle cx="200" cy="260" r="4" fill="#8B1E1E" />
                </g>

                {/* Thủy Ba Waves at hem */}
                <path
                  d="M135 450 Q165 440 200 455 Q235 440 265 450 L265 480 Q200 495 135 480 Z"
                  fill="url(#cloudWavePattern)"
                />
              </g>
            ) : top.id === 'ao-tac' ? (
              // ÁO TẤC (TAY THỤNG RỘNG)
              <g id="aoTac">
                {/* Ultra-wide ceremonious sleeves hanging down */}
                <path
                  d="M150 145 L40 260 L45 460 Q95 490 140 420 L155 200 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M250 145 L360 260 L355 460 Q305 490 260 420 L245 200 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* Main Body */}
                <path
                  d="M155 135 L245 135 L260 495 Q200 505 140 495 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.2"
                />

                {/* Fabric Brocade Pattern */}
                {fabric.id === 'gam-cung-dinh' && (
                  <path d="M155 135 L245 135 L260 495 Q200 505 140 495 Z" fill="url(#brocadePattern)" />
                )}

                {/* Cổ Đứng Lập Lĩnh (High stand collar 4cm) */}
                <path
                  d="M186 130 Q200 132 214 130 L214 146 Q200 148 186 146 Z"
                  fill={accentColor}
                  stroke="#5C3B1E"
                  strokeWidth="1"
                />

                {/* 5 Cúc cài chéo về nách phải */}
                <path d="M208 146 Q215 170 230 195 L225 380" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
                {[146, 168, 190, 215, 245].map((y, i) => (
                  <circle
                    key={i}
                    cx={208 + (i * 4.5)}
                    cy={y}
                    r="3.5"
                    fill="url(#goldCollar)"
                    stroke="#5C3B1E"
                    strokeWidth="0.8"
                  />
                ))}
              </g>
            ) : top.id === 'giao-linh' ? (
              // ÁO GIAO LĨNH (CỔ CHÉO TRỰC LĨNH)
              <g id="aoGiaoLinh">
                {/* Traditional wide flowing sleeves */}
                <path
                  d="M150 145 L60 240 L85 410 L145 350 L155 180 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M250 145 L340 240 L315 410 L255 350 L245 180 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* Body robe */}
                <path
                  d="M155 138 L245 138 L260 480 Q200 492 140 480 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1"
                />

                {/* Crossed Collars (Giao Lĩnh Hữu Nhậm - vạt trái đè vạt phải) */}
                <path d="M182 135 L235 240 L215 250 L172 145 Z" fill={accentColor} opacity="0.9" />
                <path d="M218 135 L170 230 L160 215 L208 135 Z" fill={accentColor} opacity="0.8" />

                {/* Silk Ribbon Tie at Waist */}
                <rect x="160" y="275" width="80" height="14" fill="#8B1E1E" rx="2" />
                <path d="M210 285 L225 390 L215 390 L205 285 Z" fill="#8B1E1E" />
              </g>
            ) : top.id === 'vien-linh' ? (
              // ÁO VIÊN LĨNH (CỔ TRÒN TRIỀU QUAN)
              <g id="aoVienLinh">
                <path
                  d="M150 145 L65 235 L90 380 L145 330 L155 180 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M250 145 L335 235 L310 380 L255 330 L245 180 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                <path
                  d="M155 138 L245 138 L258 485 Q200 495 142 485 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* Cổ tròn Viên Lĩnh */}
                <path
                  d="M180 135 Q200 152 220 135"
                  stroke={accentColor}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="222" cy="140" r="4" fill="#2E6F56" stroke="#D4AF37" strokeWidth="1" />

                {/* Bổ Tử (Imperial Chest Badge) */}
                <rect
                  x="180"
                  y="180"
                  width="40"
                  height="40"
                  fill="none"
                  stroke="url(#goldCollar)"
                  strokeWidth="2"
                  rx="3"
                />
                <path d="M192 195 L200 188 L208 195 L200 212 Z" fill={accentColor} opacity="0.8" />
              </g>
            ) : top.id === 'cach-tan' ? (
              // ÁO DÀI CÁCH TÂN 2026 (MODERN NEO-HERITAGE)
              <g id="aoCachTan">
                {/* Modern fitted 3/4 sleeves */}
                <path
                  d="M155 145 L110 240 L125 330 L150 280 L158 175 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M245 145 L290 240 L275 330 L250 280 L242 175 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* Slim streamlined silhouette with split vents */}
                <path
                  d="M160 140 L240 140 L252 470 Q200 480 148 470 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1.2"
                />

                {/* Modern sleek mandarin collar */}
                <path
                  d="M190 132 Q200 134 210 132 L210 142 Q200 144 190 142 Z"
                  fill={accentColor}
                  stroke="#5C3B1E"
                  strokeWidth="0.8"
                />

                {/* Minimalist gold center-line stitch */}
                <line x1="200" y1="144" x2="200" y2="475" stroke={accentColor} strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="200" cy="165" r="3" fill="#D4AF37" />
                <circle cx="200" cy="190" r="3" fill="#D4AF37" />
              </g>
            ) : (
              // ÁO NGŨ THÂN TAY CHẼN (STANDARD / DEFAULT QUỐC PHỤC)
              <g id="aoNguThan">
                {/* Tay chẽn gọn gàng thanh thoát */}
                <path
                  d="M155 145 L105 240 L118 350 L145 310 L156 175 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />
                <path
                  d="M245 145 L295 240 L282 350 L255 310 L244 175 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1"
                />

                {/* 5-panel body flowing naturally */}
                <path
                  d="M158 138 L242 138 L255 480 Q200 490 145 480 Z"
                  fill={mainColor}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="1.2"
                />

                {/* Brocade overlay if Gấm */}
                {fabric.id === 'gam-cung-dinh' && (
                  <path d="M158 138 L242 138 L255 480 Q200 490 145 480 Z" fill="url(#brocadePattern)" />
                )}

                {/* Cổ Đứng Lập Lĩnh (Mandarin collar) */}
                <path
                  d="M188 130 Q200 133 212 130 L212 144 Q200 147 188 144 Z"
                  fill={accentColor}
                  stroke="#5C3B1E"
                  strokeWidth="0.8"
                />

                {/* Đường vạt chéo & 5 Cúc cài tượng trưng cho Ngũ Thường */}
                <path d="M206 144 Q215 168 228 190 L224 380" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
                {[144, 166, 188, 212, 240].map((y, i) => (
                  <circle
                    key={i}
                    cx={206 + (i * 4)}
                    cy={y}
                    r="3.2"
                    fill="url(#goldCollar)"
                    stroke="#5C3B1E"
                    strokeWidth="0.8"
                  />
                ))}
              </g>
            )}

            {/* Silk Sheen Overlay */}
            <path
              d="M160 140 Q200 145 240 140 L248 360 Q200 370 152 360 Z"
              fill="url(#silkShine)"
              pointerEvents="none"
            />
          </g>

          {/* ===== 4. ACCESSORIES LAYER ===== */}
          <g id="accessoriesLayer">
            {/* Headgear: Mấn or Khăn Đóng */}
            {accessory.id === 'man-ngu-sac' ? (
              <g id="manNguSac">
                {/* Curved imperial mấn coronet */}
                <path
                  d="M166 70 Q200 48 234 70 Q200 62 166 70 Z"
                  fill="url(#goldCollar)"
                  stroke="#8B1E1E"
                  strokeWidth="1.2"
                />
                <ellipse cx="200" cy="58" rx="36" ry="12" fill="#8B1E1E" stroke="#D4AF37" strokeWidth="1" />
                {/* Front Jade Jewel */}
                <circle cx="200" cy="62" r="4.5" fill="#2E6F56" stroke="#D4AF37" strokeWidth="1" />
                <path d="M196 66 L200 74 L204 66" stroke="#D4AF37" strokeWidth="1" fill="none" />
              </g>
            ) : accessory.id === 'khan-dong' ? (
              <g id="khanDong">
                {/* Black Silk Turban with 8-fold texture */}
                <ellipse cx="200" cy="68" rx="38" ry="15" fill="#1A1817" stroke="#3D3634" strokeWidth="1" />
                <path d="M164 68 Q200 56 236 68" stroke="#3D3634" strokeWidth="2" fill="none" />
                <path d="M167 71 Q200 60 233 71" stroke="#2B2624" strokeWidth="1.5" fill="none" />
                {/* Subtle chữ Nhân (人) crease at center */}
                <path d="M198 64 L200 70 L202 64" stroke="#524845" strokeWidth="1.5" fill="none" />
              </g>
            ) : null}

            {/* Neck accessory: Chuỗi ngọc bích */}
            {accessory.id === 'chuoi-ngoc' && (
              <g id="chuoiNgoc">
                <path d="M185 145 Q200 170 215 145" stroke="#2E6F56" strokeWidth="3" strokeDasharray="3 2" fill="none" />
                <circle cx="200" cy="162" r="4" fill="#2E6F56" stroke="#D4AF37" strokeWidth="1" />
              </g>
            )}

            {/* Waist Accessory: Ngọc Bội */}
            {accessory.id === 'ngoc-boi' && (
              <g id="ngocBoi">
                <line x1="225" y1="280" x2="225" y2="340" stroke="#8B1E1E" strokeWidth="2" />
                <circle cx="225" cy="340" r="9" fill="#2E6F56" stroke="#D4AF37" strokeWidth="1.5" />
                <circle cx="225" cy="340" r="3.5" fill="#FAF7F2" />
                {/* Silk tassel below jade */}
                <path d="M222 349 L220 380 L230 380 L228 349 Z" fill="#8B1E1E" />
              </g>
            )}

            {/* Hand accessory: Quạt Lụa */}
            {accessory.id === 'quat-lua' && (
              <g id="quatLua">
                <path
                  d="M125 330 L95 295 Q130 270 165 295 L135 330 Z"
                  fill="#FDFBF7"
                  stroke="#D4AF37"
                  strokeWidth="1"
                />
                <path d="M130 330 L105 300 M130 330 L120 290 M130 330 L140 290 M130 330 L155 300" stroke="#C59B27" strokeWidth="0.8" />
                {/* Small landscape painted on fan */}
                <circle cx="130" cy="300" r="6" fill="#8B1E1E" opacity="0.6" />
                {/* Tassel */}
                <line x1="130" y1="330" x2="128" y2="355" stroke="#8B1E1E" strokeWidth="1.5" />
              </g>
            )}
          </g>

          {/* ===== 5. INTERACTIVE CULTURAL HOTSPOTS (GỢI Ý VĂN HÓA TRỰC QUAN) ===== */}
          {/* Collar Hotspot */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => {
              setActivePin('collar');
              setShowCultureCard(true);
            }}
          >
            <circle cx="200" cy="142" r="10" fill="#D4AF37" opacity="0.25" className="animate-ping" />
            <circle cx="200" cy="142" r="5" fill="#D4AF37" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="200" cy="142" r="2" fill="#8B1E1E" />
          </g>

          {/* 5-Buttons Hotspot */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => {
              setActivePin('buttons');
              setShowCultureCard(true);
            }}
          >
            <circle cx="220" cy="190" r="8" fill="#D4AF37" opacity="0.2" className="animate-ping" />
            <circle cx="220" cy="190" r="4.5" fill="#D4AF37" stroke="#ffffff" strokeWidth="1.2" />
          </g>

          {/* Sleeve / Element Hotspot */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            onClick={() => {
              setActivePin('sleeve');
              setShowCultureCard(true);
            }}
          >
            <circle cx="108" cy="270" r="8" fill="#D4AF37" opacity="0.2" className="animate-ping" />
            <circle cx="108" cy="270" r="4.5" fill="#D4AF37" stroke="#ffffff" strokeWidth="1.2" />
          </g>
        </svg>

        {/* Dynamic Glassmorphism Callout Line and Culture Card */}
        {showCultureCard && (
          <div className="absolute bottom-4 left-4 right-4 z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="glass-imperial p-4 rounded-3xl shadow-xl border border-[#D4AF37]/40 relative overflow-hidden">
              {/* Decorative corner motif */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-radial from-[#D4AF37]/20 to-transparent pointer-events-none" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8B1E1E] text-[#FDFBF7] flex items-center justify-center text-xs font-serif-vi shadow-xs">
                    ✦
                  </span>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#8B1E1E] uppercase block">
                      Thẻ Thông Tin Văn Hóa • {top.era}
                    </span>
                    <h4 className="font-serif-vi text-base font-bold text-stone-900 leading-tight">
                      {top.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActivePin('collar')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      activePin === 'collar' ? 'bg-[#8B1E1E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Cổ áo
                  </button>
                  <button
                    onClick={() => setActivePin('buttons')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      activePin === 'buttons' ? 'bg-[#8B1E1E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    5 Cúc
                  </button>
                  <button
                    onClick={() => setActivePin('sleeve')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                      activePin === 'sleeve' ? 'bg-[#8B1E1E] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Hoa văn
                  </button>
                  <button
                    onClick={() => setShowCultureCard(false)}
                    className="text-stone-400 hover:text-stone-700 ml-1 text-sm font-bold p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Dynamic Body content according to active pin */}
              <div className="mt-2 text-xs text-stone-700 leading-relaxed space-y-1">
                {activePin === 'collar' && (
                  <p>
                    <strong className="text-[#8B1E1E]">Dạng thức cổ: </strong>
                    {top.cultureInfo.collarType} {top.cultureInfo.origin}
                  </p>
                )}
                {activePin === 'buttons' && (
                  <p>
                    <strong className="text-[#8B1E1E]">Ý nghĩa 5 cúc: </strong>
                    Tượng trưng cho Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín) và Ngũ luân phụ tử, phu thê, huynh đệ, bằng hữu, quân thần.
                  </p>
                )}
                {activePin === 'sleeve' && (
                  <p>
                    <strong className="text-[#8B1E1E]">Hoa văn & Tay áo: </strong>
                    {top.cultureInfo.pattern} — {top.cultureInfo.symbolism}
                  </p>
                )}
                {activePin === 'fabric' && (
                  <p>
                    <strong className="text-[#8B1E1E]">Chất liệu vải: </strong>
                    {fabric.name} ({fabric.textureLabel}). Bắt sáng tự nhiên theo ánh đèn cung phủ.
                  </p>
                )}

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 text-[#8B1E1E] font-medium">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    Quy cách: {top.cultureInfo.etiquette}
                  </span>
                  <span className="italic font-serif-vi text-stone-600">
                    Phối cùng {bottom.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subtle indicator under the avatar */}
      <div className="absolute bottom-2 z-10 flex items-center gap-2 text-[11px] text-stone-500 font-medium">
        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Bấm vào các điểm tròn vàng trên áo để đọc điển tích văn hóa</span>
      </div>
    </div>
  );
};
