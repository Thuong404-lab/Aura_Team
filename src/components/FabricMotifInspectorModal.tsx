import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WardrobeItem,
  FabricOption,
  FABRICS,
} from '../data/vietPhucData';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sun,
  Flame,
  Compass,
  Layers,
  Scroll,
  Info,
  Check,
  Eye,
  Scan,
  RotateCcw,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export type MotifFocusArea =
  | 'embroidery_chest' // Thêu tay hoa sen / hoa cúc / chim phượng
  | 'brocade_weave' // Vân gấm nổi chữ Vạn & mây cuộn
  | 'thuy_ba_hem' // Họa tiết Thủy Ba sóng nước
  | 'jacquard_watermark' // Họa tiết chìm lụa the Vạn Phúc
  | 'micro_thread'; // Thớ dệt vi mô sợi tơ tằm

export type LightingMode = 'daylight' | 'candlelight' | 'raking';

interface FabricMotifInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFabric: FabricOption;
  onSelectFabric?: (fabric: FabricOption) => void;
  topItem: WardrobeItem | null;
  bottomItem: WardrobeItem | null;
  accessoryItem: WardrobeItem | null;
  currentColorHex: string;
}

export const FabricMotifInspectorModal: React.FC<FabricMotifInspectorModalProps> = ({
  isOpen,
  onClose,
  currentFabric,
  onSelectFabric,
  topItem,
  bottomItem,
  accessoryItem,
  currentColorHex,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(2.5); // 1x to 8x
  const [focusArea, setFocusArea] = useState<MotifFocusArea>('embroidery_chest');
  const [lightingMode, setLightingMode] = useState<LightingMode>('daylight');
  const [isLensModeActive, setIsLensModeActive] = useState<boolean>(true);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialPanX: number; initialPanY: number }>({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
  });
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Play opening chime
  useEffect(() => {
    if (isOpen) {
      soundEngine.playCloudPartChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isBrocade = currentFabric.id === 'gam-cung-dinh';
  const isSa = currentFabric.id === 'sa-nam-bo';
  const isDui = currentFabric.id === 'dui-to-tam';
  const isSilk = currentFabric.id === 'lua-ha-dong';

  // Effective colors
  const primaryColor = currentColorHex || topItem?.defaultColorHex || '#8B1E1E';
  const goldThreadColor = lightingMode === 'candlelight' ? '#FFDF78' : '#D4AF37';

  // Handle pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: panPosition.x,
      initialPanY: panPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setMousePos({ x: relX, y: relY });
    }

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      setPanPosition({
        x: Math.max(-150, Math.min(150, dragStartRef.current.initialPanX + dx)),
        y: Math.max(-150, Math.min(150, dragStartRef.current.initialPanY + dy)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset viewport
  const handleResetView = () => {
    soundEngine.playPluck(440);
    setZoomLevel(2.5);
    setPanPosition({ x: 0, y: 0 });
  };

  // Switch focus area
  const handleSwitchFocusArea = (area: MotifFocusArea) => {
    soundEngine.playPluck(523.25);
    setFocusArea(area);
  };

  // Switch fabric
  const handleSelectFabric = (fabric: FabricOption) => {
    soundEngine.playPluck(659.25);
    if (onSelectFabric) onSelectFabric(fabric);
  };

  // Determine current motif commentary
  const getMotifCommentary = () => {
    switch (focusArea) {
      case 'embroidery_chest':
        return {
          title: 'Chi Tiết Thêu Tay Chỉ Tơ Ngũ Sắc & Kim Tuyến',
          technique: 'Thêu canh vạt, đâm xô truyền thống (Làng thêu Quất Động - Thường Tín)',
          symbolism:
            topItem?.id.includes('nhat-binh')
              ? 'Họa tiết chim Phụng ngậm ngọc và mẫu đơn quấn quýt, biểu trưng cho đức hạnh vẹn toàn của bậc mẫu nghi thiên hạ.'
              : topItem?.id.includes('vien-linh')
              ? 'Bổ tử thêu chim Hạc trắng mây lành, biểu thị sự thanh liêm và trí tuệ mẫn tiệp của quan thần.'
              : 'Hoa cúc vạn thọ và liên hoa tao nhã, tượng trưng cho phúc lộc dồi dào và tâm hồn thanh tịnh.',
          weaveDetail:
            'Chỉ tơ tằm dệt se chặt, từng mũi kim gối đều tăm tắp tạo độ gồ nổi 3D tự nhiên, ánh chỉ bóng mềm khi nghiêng theo ánh sáng.',
        };
      case 'brocade_weave':
        return {
          title: 'Vân Gấm Cung Đình: Chữ Vạn & Mây Cuộn Hoàng Gia',
          technique: 'Dệt gấm nổi sợi kim ngân (Phường dệt gấm Cung đình Huế)',
          symbolism:
            'Hoa văn chữ Vạn (Vạn phúc, vạn thọ) liên hoàn cùng mây cuộn ngũ sắc, tượng trưng cho sự vững bền của xã tắc và điềm lành muôn đời.',
          weaveDetail:
            'Sợi kim tuyến vàng óng dệt nổi cao hơn thớ vải nền 0.3mm, tạo phản quang lấp lánh như vảy rồng dưới ánh đèn nến hoàng cung.',
        };
      case 'thuy_ba_hem':
        return {
          title: 'Họa Tiết Thủy Ba Sóng Nước & Đá Núi Tam Sơn',
          technique: 'Thêu chỉ ngũ sắc chuyển tầng màu (Thủy Ba Thập Nhị Thải)',
          symbolism:
            'Sóng nước trùng điệp tụ phúc kết hợp đá núi vững chãi, tượng trưng cho non sông gấm vóc ngàn năm vững bền và lời chúc vạn sự hanh thông.',
          weaveDetail:
            'Mỗi dải sóng nước là một tầng màu chỉ tơ riêng biệt, chuyển sắc từ đậm sang nhạt đòi hỏi tay nghề nghệ nhân bậc thầy.',
        };
      case 'jacquard_watermark':
        return {
          title: 'Họa Tiết Dệt Chìm Thooáng (Jacquard Damask Vạn Phúc)',
          technique: 'Dệt the hoa & sa truyền thống (Làng lụa Vạn Phúc - Hà Đông 1.000 năm)',
          symbolism:
            'Hoa cúc dây dệt chìm ẩn hiện theo góc sáng, thể hiện triết lý khiêm cung "hữu xạ tự nhiên hương" của người phụ nữ Việt xưa.',
          weaveDetail:
            'Họa tiết chìm cùng màu với nền vải nhưng khác hướng dệt sợi (đảo chiều phản quang), chỉ lộ rõ khi người mặc cử động sải bước.',
        };
      case 'micro_thread':
      default:
        return {
          title: 'Cận Cảnh Vi Thể Sợi Tơ Tằm Tự Nhiên (Microscopic Thread Weave)',
          technique: 'Ươm tơ kéo sợi thủ công từ kén tằm dâu thuần Việt',
          symbolism:
            'Sợi tơ tự nhiên giữ trọn tinh hoa đất trời, mang lại cảm giác đông ấm hè mát, dịu êm như làn da thiếu nữ kinh kỳ.',
          weaveDetail:
            'Mặt cắt sợi tơ tằm có hình tam giác tự nhiên, hoạt động như lăng kính phản chiếu ánh sáng lấp lánh óng ả độc nhất vô nhị.',
        };
    }
  };

  const commentary = getMotifCommentary();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        className="relative w-full max-w-5xl max-h-[94vh] bg-[#0E1524] border-2 border-amber-400/70 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.25)] flex flex-col overflow-hidden text-slate-100"
      >
        {/* ========================================================
            MODAL HEADER: Title, Controls, Close
           ======================================================== */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-[#172238] via-[#1A2640] to-[#172238] border-b border-amber-500/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/70 flex items-center justify-center shrink-0">
              <Scan className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-amber-200 font-serif-vi flex items-center gap-2">
                <span>KÍNH LÚP DI SẢN: SOI CẬN CẢNH HỌA TIẾT VẢI & CỔ PHỤC</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono border border-amber-400/50">
                  MACRO {zoomLevel.toFixed(1)}X
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans-vi line-clamp-1">
                Xem rõ từng đường kim mũi chỉ thêu tay, vân gấm nổi chữ Vạn và họa tiết chìm lụa tơ tằm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-200 border border-slate-700 hover:border-rose-500/50 transition-all cursor-pointer"
              title="Đóng kính lúp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================
            MAIN BODY: Left Canvas (Macro Zoom Stage) & Right Details Panel
           ======================================================== */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          {/* ================= LEFT: INTERACTIVE ZOOM CANVAS ================= */}
          <div className="flex-1 flex flex-col bg-[#070B13] border-b lg:border-b-0 lg:border-r border-slate-700/80 relative overflow-hidden">
            {/* Top Toolbar inside Canvas: Motif Focus Selector */}
            <div className="px-3 py-2 bg-[#0C1220]/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                Vùng Soi:
              </span>
              {[
                { id: 'embroidery_chest', label: '🌸 Thêu Tay Cung Đình', badge: 'Chỉ Tơ Ngũ Sắc' },
                { id: 'brocade_weave', label: '☁️ Vân Gấm & Chữ Vạn', badge: 'Kim Tuyến Nổi' },
                { id: 'thuy_ba_hem', label: '🌊 Sóng Nước Thủy Ba', badge: 'Gấu Váy Lễ Phục' },
                { id: 'jacquard_watermark', label: '🕊️ Họa Tiết Chìm', badge: 'The Lụa Vạn Phúc' },
                { id: 'micro_thread', label: '🧵 Thớ Dệt Tơ Tằm', badge: 'Microscopic' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchFocusArea(tab.id as MotifFocusArea)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    focusArea === tab.id
                      ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-400/80 shadow-xs'
                      : 'bg-[#141C30]/70 hover:bg-[#1a2540] text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Viewport Canvas */}
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex-1 relative overflow-hidden flex items-center justify-center select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Microscopic Fabric Surface Renderer */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                  transformOrigin: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
                }}
              >
                <svg
                  viewBox="0 0 500 500"
                  className="w-[420px] h-[420px] drop-shadow-2xl overflow-visible"
                >
                  <defs>
                    {/* Micro Fabric Weave Filter */}
                    <pattern id="microWeavePattern" width="6" height="6" patternUnits="userSpaceOnUse">
                      <rect width="6" height="6" fill={primaryColor} />
                      {/* Warp and weft threads */}
                      <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                      <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
                      {/* Silk Sheen diagonal thread reflections */}
                      <circle cx="1.5" cy="1.5" r="0.6" fill={lightingMode === 'candlelight' ? '#FFE8A3' : '#FFFFFF'} opacity="0.35" />
                      <circle cx="4.5" cy="4.5" r="0.6" fill={lightingMode === 'candlelight' ? '#FFE8A3' : '#FFFFFF'} opacity="0.35" />
                    </pattern>

                    {/* Brocade Swastika & Cloud Pattern */}
                    <pattern id="swastikaBrocadePattern" width="48" height="48" patternUnits="userSpaceOnUse">
                      {/* Swastika (Chữ Vạn) Weave */}
                      <path
                        d="M12 12 H24 V24 M24 24 H36 V36 M24 24 V12 H36 M24 24 V36 H12"
                        stroke={goldThreadColor}
                        strokeWidth="1.8"
                        fill="none"
                        opacity={isBrocade ? '0.85' : '0.4'}
                      />
                      {/* Traditional Cloud scroll (Vân mây) */}
                      <path
                        d="M6 38 Q12 30 18 38 Q24 30 30 38 Q20 46 6 38 Z"
                        fill="none"
                        stroke={goldThreadColor}
                        strokeWidth="1.2"
                        opacity={isBrocade ? '0.75' : '0.35'}
                      />
                      {/* Raking Light subtle thread shadow */}
                      {lightingMode === 'raking' && (
                        <path
                          d="M13 13 H25 V25 M25 25 H37 V37"
                          stroke="rgba(0,0,0,0.4)"
                          strokeWidth="1.2"
                          fill="none"
                        />
                      )}
                    </pattern>

                    {/* Watermark Damask Jacquard (Hoa Cúc Chìm Vạn Phúc) */}
                    <pattern id="watermarkJacquardPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                      <g opacity={lightingMode === 'raking' ? '0.6' : '0.28'}>
                        {/* 8-Petal Chrysanthemum */}
                        <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.4)" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                          <ellipse
                            key={i}
                            cx="30"
                            cy="20"
                            rx="3.5"
                            ry="7"
                            fill="rgba(255,255,255,0.25)"
                            stroke="rgba(0,0,0,0.15)"
                            strokeWidth="0.5"
                            transform={`rotate(${angle} 30 30)`}
                          />
                        ))}
                      </g>
                    </pattern>

                    {/* Gold Thread Glint Filter */}
                    <radialGradient id="glintLight" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.9" />
                      <stop offset="40%" stopColor={goldThreadColor} stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#8A6715" stopOpacity="0.1" />
                    </radialGradient>
                  </defs>

                  {/* Base Fabric Ground Layer */}
                  <rect
                    x="0"
                    y="0"
                    width="500"
                    height="500"
                    rx="16"
                    fill="url(#microWeavePattern)"
                    stroke="rgba(212,175,55,0.3)"
                    strokeWidth="1.5"
                  />

                  {/* Surface Sheen & Texture Overlay according to chosen fabric */}
                  {isBrocade && (
                    <rect x="0" y="0" width="500" height="500" rx="16" fill="url(#swastikaBrocadePattern)" />
                  )}

                  {isSilk && (
                    <rect x="0" y="0" width="500" height="500" rx="16" fill="url(#watermarkJacquardPattern)" />
                  )}

                  {isSa && (
                    <g opacity="0.4">
                      {/* Sheer gauze lattice */}
                      {Array.from({ length: 25 }).map((_, i) => (
                        <line
                          key={i}
                          x1={i * 20}
                          y1="0"
                          x2={i * 20}
                          y2="500"
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="0.8"
                        />
                      ))}
                    </g>
                  )}

                  {isDui && (
                    <g opacity="0.3">
                      {/* Raw raw silk slub imperfections */}
                      {[
                        [80, 120, 45],
                        [160, 260, 60],
                        [310, 140, 50],
                        [220, 380, 55],
                        [390, 320, 40],
                      ].map(([x, y, len], i) => (
                        <line
                          key={i}
                          x1={x}
                          y1={y}
                          x2={x + len}
                          y2={y + 3}
                          stroke="#EBE5D8"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                        />
                      ))}
                    </g>
                  )}

                  {/* ================= DYNAMIC MOTIF RENDERING BASED ON FOCUS AREA ================= */}
                  {focusArea === 'embroidery_chest' && (
                    <g id="macro-embroidery-phoenix-lotus" transform="translate(100, 90)">
                      {/* Central Golden Phoenix / Lotus Motif */}
                      {/* Outer Floral Radiance */}
                      <circle cx="150" cy="150" r="95" fill="none" stroke={goldThreadColor} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                      <circle cx="150" cy="150" r="80" fill="none" stroke={goldThreadColor} strokeWidth="1.8" opacity="0.8" />

                      {/* Embroidered Lotus Petals (Satin Stitch lines) */}
                      {[0, 60, 120, 180, 240, 300].map((rot, idx) => (
                        <g key={idx} transform={`rotate(${rot} 150 150)`}>
                          {/* Petal Contour */}
                          <path
                            d="M150 70 Q130 115 150 135 Q170 115 150 70 Z"
                            fill="url(#glintLight)"
                            stroke="#855B14"
                            strokeWidth="1.2"
                          />
                          {/* Individual silk satin stitches */}
                          {[-8, -4, 0, 4, 8].map((offset, sIdx) => (
                            <line
                              key={sIdx}
                              x1={150 + offset * 0.7}
                              y1={75 + Math.abs(offset) * 4}
                              x2={150 + offset * 0.3}
                              y2={130}
                              stroke={lightingMode === 'candlelight' ? '#FFF5D0' : '#D4AF37'}
                              strokeWidth="0.9"
                            />
                          ))}
                        </g>
                      ))}

                      {/* Central Pearl / Jade Jewel */}
                      <circle cx="150" cy="150" r="16" fill="#10B981" stroke="#F59E0B" strokeWidth="2.5" />
                      <circle cx="145" cy="145" r="5" fill="#A7F3D0" />

                      {/* Flying Phoenix Tail Feathers */}
                      <path
                        d="M150 150 Q190 200 230 180 Q250 160 270 210"
                        stroke={goldThreadColor}
                        strokeWidth="3.2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M150 150 Q180 220 210 240 Q230 250 250 280"
                        stroke={goldThreadColor}
                        strokeWidth="2.4"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </g>
                  )}

                  {focusArea === 'thuy_ba_hem' && (
                    <g id="macro-thuy-ba-waves" transform="translate(40, 60)">
                      {/* Multi-tier Wave Crests (Thập Nhị Thải Thủy Ba) */}
                      {[
                        { y: 60, col: '#8B1E1E', h: 35 },
                        { y: 120, col: '#1F4E5B', h: 40 },
                        { y: 180, col: '#D4AF37', h: 42 },
                        { y: 240, col: '#FAF7F0', h: 38 },
                        { y: 300, col: '#8B1E1E', h: 45 },
                      ].map((wave, wIdx) => (
                        <g key={wIdx}>
                          {/* Wave Curve */}
                          <path
                            d={`M 10 ${wave.y} Q 70 ${wave.y - wave.h} 130 ${wave.y} Q 190 ${wave.y + wave.h} 250 ${wave.y} Q 310 ${wave.y - wave.h} 370 ${wave.y} Q 410 ${wave.y + wave.h} 430 ${wave.y}`}
                            fill="none"
                            stroke={wave.col}
                            strokeWidth="3.8"
                            strokeLinecap="round"
                          />
                          {/* Parallel Gold thread border */}
                          <path
                            d={`M 10 ${wave.y + 6} Q 70 ${wave.y - wave.h + 6} 130 ${wave.y + 6} Q 190 ${wave.y + wave.h + 6} 250 ${wave.y + 6} Q 310 ${wave.y - wave.h + 6} 370 ${wave.y + 6} Q 410 ${wave.y + wave.h + 6} 430 ${wave.y + 6}`}
                            fill="none"
                            stroke={goldThreadColor}
                            strokeWidth="1.5"
                          />
                        </g>
                      ))}

                      {/* Tam Sơn (Three Sacred Mountains) rising from waves */}
                      <polygon points="210,340 230,220 250,340" fill="#2E6F56" stroke={goldThreadColor} strokeWidth="2" />
                      <polygon points="170,340 190,260 210,340" fill="#1F4E5B" stroke={goldThreadColor} strokeWidth="1.6" />
                      <polygon points="250,340 270,260 290,340" fill="#1F4E5B" stroke={goldThreadColor} strokeWidth="1.6" />
                    </g>
                  )}

                  {focusArea === 'brocade_weave' && (
                    <g id="macro-brocade-detail" transform="translate(60, 60)">
                      {/* Macro Swastika Centerpiece */}
                      <rect x="70" y="70" width="240" height="240" fill="none" stroke={goldThreadColor} strokeWidth="2.5" />
                      {/* Interlaced Brocade Filigree */}
                      <path
                        d="M 190 70 L 190 310 M 70 190 L 310 190"
                        stroke={goldThreadColor}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      {/* Cloud Scrolls around frame */}
                      {[
                        [100, 100],
                        [280, 100],
                        [100, 280],
                        [280, 280],
                      ].map(([cx, cy], i) => (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="18"
                          fill="none"
                          stroke={goldThreadColor}
                          strokeWidth="2"
                        />
                      ))}
                    </g>
                  )}

                  {focusArea === 'jacquard_watermark' && (
                    <g id="macro-watermark-detail" transform="translate(50, 50)">
                      {/* Giant Jacquard Damask Blossom */}
                      <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                      <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                      <circle cx="200" cy="200" r="28" fill="rgba(255,255,255,0.35)" />
                    </g>
                  )}

                  {focusArea === 'micro_thread' && (
                    <g id="macro-micro-thread-grid" transform="translate(20, 20)">
                      {/* Microscopic fiber bundle representation */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <g key={i}>
                          {/* Horizontal yarn bundle */}
                          <rect
                            x="20"
                            y={i * 38 + 20}
                            width="420"
                            height="24"
                            rx="12"
                            fill={primaryColor}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1.2"
                          />
                          {/* Vertical yarn bundle weaving over/under */}
                          <rect
                            x={i * 38 + 20}
                            y="20"
                            width="24"
                            height="420"
                            rx="12"
                            fill={primaryColor}
                            stroke="rgba(0,0,0,0.25)"
                            strokeWidth="1.2"
                            opacity="0.9"
                          />
                        </g>
                      ))}
                    </g>
                  )}
                </svg>
              </div>

              {/* Interactive Magnifying Glass Loupe (Follows Mouse when lens mode is on) */}
              {isLensModeActive && (
                <div
                  className="absolute pointer-events-none w-44 h-44 rounded-full border-4 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] overflow-hidden hidden sm:block"
                  style={{
                    left: `${mousePos.x * 100}%`,
                    top: `${mousePos.y * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), transparent 70%)',
                  }}
                >
                  {/* Loupe Crosshair and Reflection */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-full h-[1px] bg-amber-300" />
                    <div className="h-full w-[1px] bg-amber-300 absolute" />
                  </div>
                  <div className="absolute top-2 left-2 text-[9px] font-mono text-amber-300 bg-black/70 px-1.5 py-0.5 rounded">
                    LOUPE 4X
                  </div>
                </div>
              )}

              {/* Floating Bottom Viewport Controls */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl bg-[#090E1A]/90 border border-amber-500/40 shadow-xl flex items-center gap-3 backdrop-blur-md">
                {/* Zoom out */}
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {/* Zoom Level Slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <span className="text-[11px] font-mono font-bold text-amber-300 w-9 text-right">
                    {zoomLevel.toFixed(1)}x
                  </span>
                </div>

                {/* Zoom in */}
                <button
                  onClick={() => setZoomLevel((z) => Math.min(6, z + 0.5))}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Phóng to"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-slate-700" />

                {/* Reset View */}
                <button
                  onClick={handleResetView}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Đặt lại góc nhìn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Toggle Lens */}
                <button
                  onClick={() => setIsLensModeActive(!isLensModeActive)}
                  className={`px-2 py-0.5 rounded text-[10.5px] font-semibold cursor-pointer transition-colors ${
                    isLensModeActive ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50' : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Bật/Tắt kính lúp rê chuột"
                >
                  Kính Lúp
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: FABRIC SELECTION & CRAFTSMANSHIP DETAILS ================= */}
          <div className="w-full lg:w-[380px] bg-[#0E1524] flex flex-col overflow-y-auto custom-scrollbar p-4 sm:p-5 gap-4 text-left">
            {/* 1. LIGHTING & SHEEN TOGGLE */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-sans-vi">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Góc Chiếu Sáng & Độ Bắt Sáng:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'daylight', label: 'Tự Nhiên', desc: 'Màu thực', icon: '☀️' },
                  { id: 'candlelight', label: 'Cung Đình', desc: 'Ánh nến 2800K', icon: '🕯️' },
                  { id: 'raking', label: 'Nghiêng 30°', desc: 'Nổi khối 3D', icon: '📐' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      soundEngine.playPluck(493.88);
                      setLightingMode(mode.id as LightingMode);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      lightingMode === mode.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-[#141C2E] border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <span>{mode.icon}</span>
                      <span>{mode.label}</span>
                    </div>
                    <div className="text-[9.5px] text-slate-400 mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CHỌN NHANH CHẤT LIỆU VẢI ĐỂ SOI SÁNG */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-sans-vi">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Chất Liệu Vải Đang Soi:
                </span>
                <span className="text-[10px] text-slate-400">4 dòng dệt cổ truyền</span>
              </div>

              <div className="space-y-1.5">
                {FABRICS.map((fabric) => {
                  const isSelected = currentFabric.id === fabric.id;
                  return (
                    <button
                      key={fabric.id}
                      onClick={() => handleSelectFabric(fabric)}
                      className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/25 to-[#1A263E] border-amber-400 text-amber-100 shadow-sm'
                          : 'bg-[#131B2C] border-slate-700/70 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-serif-vi flex items-center gap-1.5">
                          <span>{fabric.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                        </div>
                        <div className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                          {fabric.textureLabel}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300/80 shrink-0 px-2 py-0.5 rounded bg-black/40 border border-amber-500/30">
                        {fabric.sheen}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. BẢNG THUYẾT MINH DI SẢN & KỸ THUẬT DỆT THÊU */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#162035] to-[#121A2C] border border-amber-500/40 shadow-inner flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 font-serif-vi pb-1.5 border-b border-amber-900/60">
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span>{commentary.title}</span>
              </div>

              {/* Kỹ thuật dệt thêu */}
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 block tracking-wider">
                  Kỹ Thuật Dệt Thêu Cổ Truyền:
                </span>
                <p className="text-[11px] text-slate-200 font-sans-vi leading-relaxed mt-0.5">
                  {commentary.technique}
                </p>
              </div>

              {/* Ý nghĩa biểu tượng */}
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 block tracking-wider">
                  Ý Nghĩa Biểu Tượng Điển Chế:
                </span>
                <p className="text-[11px] text-slate-300 font-sans-vi leading-relaxed mt-0.5">
                  {commentary.symbolism}
                </p>
              </div>

              {/* Chi tiết thớ dệt */}
              <div className="p-2 rounded-xl bg-[#090E1A]/80 border border-slate-700/80 text-[10.5px] text-slate-300">
                <span className="text-amber-300 font-semibold block mb-0.5">Đặc tính bắt sáng:</span>
                {commentary.weaveDetail}
              </div>
            </div>

            {/* Quick action button: Apply & Close */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-tight shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 mt-auto"
            >
              <Check className="w-4 h-4" />
              <span>Hoàn Tất & Áp Dụng Vải Đã Chọn</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
