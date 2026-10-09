import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
  FABRICS,
  COLOR_PALETTES,
  BACKDROPS,
} from '../data/vietPhucData';
import { AvatarModel, GARMENT_VISUAL_PROFILES } from './AvatarModel';
import {
  AuraLogo,
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';
import {
  Sparkles,
  Check,
  Bookmark,
  Loader2,
  Palette,
  Layers,
  Info,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Shirt,
  Crown,
  Feather,
  Waves,
  Maximize2,
  X,
  Download,
  Camera,
} from 'lucide-react';
import {
  SilkCategoryTabs,
  SilkWaveRibbon,
  SilkSheenSweep,
  SilkTabItem,
} from './SilkMotionElements';
import { soundEngine } from '../utils/audioSynth';
import { checkAiHarmony, getAiSuggestion } from '../services/aiClient';

export interface HarmonyResult {
  score: number;
  ratingBadge: string;
  historicalMatchPercent: number;
  colorHarmonyPercent: number;
  contextAestheticPercent: number;
  critiqueTitle: string;
  detailedCritique: string;
  culturalSecret: string;
  stylingTip: string;
}

interface FittingRoomScreenProps {
  currentTop: WardrobeItem | null;
  currentBottom: WardrobeItem | null;
  currentAccessory: WardrobeItem | null;
  currentFabric?: FabricOption;
  currentColor: ColorOption;
  topCustomColor?: string;
  bottomCustomColor?: string;
  onSelectTop: (item: WardrobeItem | null) => void;
  onSelectBottom: (item: WardrobeItem | null) => void;
  onSelectAccessory: (item: WardrobeItem | null) => void;
  onSelectFabric?: (fabric: FabricOption) => void;
  onSelectColor: (color: ColorOption) => void;
  onSelectTopColor: (colorHex: string) => void;
  onSelectBottomColor: (colorHex: string) => void;
  onGoHome: () => void;
  onGoLookbook: (harmonyData?: HarmonyResult) => void;
}

export const FittingRoomScreen: React.FC<FittingRoomScreenProps> = ({
  currentTop,
  currentBottom,
  currentAccessory,
  currentFabric,
  currentColor,
  topCustomColor,
  bottomCustomColor,
  onSelectTop,
  onSelectBottom,
  onSelectAccessory,
  onSelectFabric,
  onSelectColor,
  onSelectTopColor,
  onSelectBottomColor,
  onGoHome,
  onGoLookbook,
}) => {
  // Wardrobe Navigation Tabs (Đã bỏ tab Chất liệu theo yêu cầu)
  const [activeTab, setActiveTab] = useState<'top' | 'bottom' | 'accessory' | 'color'>('top');

  // Color Target state: Đổi màu cho Áo hay Quần / Váy
  const [colorTarget, setColorTarget] = useState<'top' | 'bottom'>('top');

  // Compute active colors for preview and status
  const defaultTopHex = currentTop
    ? (GARMENT_VISUAL_PROFILES[currentTop.id]?.baseColor || currentTop.defaultColorHex || '#162544')
    : '#888888';

  const defaultBottomHex = currentBottom
    ? (currentBottom.id === 'vay-xep-ly'
      ? currentBottom.defaultColorHex || '#8B1E1E'
      : currentBottom.id === 'quan-men-lam'
      ? '#1F4E5B'
      : currentBottom.id === 'quan-gam-vang'
      ? '#D4AF37'
      : currentBottom.id === 'quan-tay-hien-dai'
      ? '#262423'
      : currentBottom.id === 'vay-den'
      ? '#1D1B1A'
      : (currentTop ? GARMENT_VISUAL_PROFILES[currentTop.id]?.bottomColor : '#FAF7F0') || '#FAF7F0')
    : '#888888';

  const activeTopHex = topCustomColor || defaultTopHex;
  const activeBottomHex = bottomCustomColor || defaultBottomHex;

  // Silk Category Tabs configuration (Chỉ giữ Áo, Quần/Váy, Phụ kiện, Màu sắc)
  const categoryTabs: SilkTabItem[] = [
    {
      id: 'top',
      label: 'Áo',
      count: TOPS.length,
      icon: <Shirt className="w-4 h-4" />,
    },
    {
      id: 'bottom',
      label: 'Quần / Váy',
      count: BOTTOMS.length,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'accessory',
      label: 'Phụ kiện',
      count: ACCESSORIES.length,
      icon: <Crown className="w-4 h-4" />,
    },
    {
      id: 'color',
      label: 'Màu sắc',
      count: COLOR_PALETTES.length,
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  // Dynasty Era Filter & Gender Filter
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'nam' | 'nu'>(
    currentTop?.gender === 'nu' ? 'nu' : 'nam'
  );

  // Sync gender filter with current garment when changed from preset or suggestion
  React.useEffect(() => {
    if (currentTop?.gender && (currentTop.gender === 'nam' || currentTop.gender === 'nu')) {
      setGenderFilter(currentTop.gender);
    }
  }, [currentTop?.id]);

  // Real-time Hovered Garment & Category for Silk Drape physics
  const [hoveredItem, setHoveredItem] = useState<WardrobeItem | null>(null);
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  // AI Assistant prompt bar state
  const [aiPrompt, setAiPrompt] = useState<string>(
    'Gợi ý cho tôi một bộ đi dạo phố mùa thu, thanh lịch...'
  );
  const [isAiSuggesting, setIsAiSuggesting] = useState<boolean>(false);

  // Harmony Evaluation State
  const [isCheckingHarmony, setIsCheckingHarmony] = useState<boolean>(false);
  const [harmonyResult, setHarmonyResult] = useState<HarmonyResult>({
    score: 95,
    ratingBadge: 'Phối đồ xuất sắc',
    historicalMatchPercent: 96,
    colorHarmonyPercent: 95,
    contextAestheticPercent: 95,
    critiqueTitle: 'Phối đồ xuất sắc (95 điểm)',
    detailedCritique:
      'Sự kết hợp hài hòa giữa Áo ngũ thân tay chẽn truyền thống và váy xếp ly hiện đại, giữ được nét thanh lịch nhưng vẫn năng động.',
    culturalSecret:
      'Áo ngũ thân quy chuẩn đi kèm mấn tròn quấn nhiều vòng, tạo nét trang trọng, đài các cho diện mạo.',
    stylingTip:
      'Khi tạo dáng, hãy đứng thẳng người thanh thoát, tay giữ nhẹ tà áo để tôn trọn phom áo năm thân.',
  });

  // Filter items by era and gender
  const getFilteredItems = (items: WardrobeItem[]) => {
    let list = items;
    if (eraFilter !== 'all') {
      if (eraFilter === 'nguyen') {
        list = list.filter(
          (i) => i.era.toLowerCase().includes('nguyễn') || i.id.includes('ngu-than') || i.id.includes('tac') || i.id.includes('nhat-binh')
        );
      } else if (eraFilter === 'le') {
        list = list.filter(
          (i) => i.era.toLowerCase().includes('lê') || i.id.includes('giao-linh') || i.id.includes('vien-linh') || i.id.includes('doi-kham')
        );
      } else if (eraFilter === 'tran') {
        list = list.filter(
          (i) => i.era.toLowerCase().includes('trần') || i.era.toLowerCase().includes('lý') || i.id.includes('dong-son')
        );
      }
    }
    if (genderFilter) {
      list = list.filter((i) => !i.gender || i.gender === genderFilter || i.gender === 'unisex');
    }
    return list;
  };

  // Run AI Suggestion
  const handleAiSuggest = async () => {
    if (!aiPrompt.trim()) return;
    soundEngine.playPluck(587.33);
    setIsAiSuggesting(true);

    try {
      const res = await getAiSuggestion(aiPrompt);
      const top = TOPS.find((t) => t.id === res.recommendedTopId);
      const bottom = BOTTOMS.find((b) => b.id === res.recommendedBottomId);
      const acc = ACCESSORIES.find((a) => a.id === res.recommendedAccessoryId);

      if (top) onSelectTop(top);
      if (bottom) onSelectBottom(bottom);
      if (acc) onSelectAccessory(acc);

      setHarmonyResult((prev) => ({
        ...prev,
        score: 96,
        critiqueTitle: `${res.conceptTitle} (96 điểm)`,
        detailedCritique: res.aiAdvice,
        culturalSecret: res.culturalNote,
      }));
    } finally {
      setIsAiSuggesting(false);
    }
  };

  // Run Harmony Check
  const handleCheckHarmony = async () => {
    soundEngine.playPluck(783.99);
    setIsCheckingHarmony(true);

    try {
      const evaluation = await checkAiHarmony({
        top: currentTop || TOPS[0],
        bottom: currentBottom || BOTTOMS[2],
        accessory: currentAccessory || ACCESSORIES[0],
        fabricName: currentFabric?.name || 'Gấm Cung Đình',
        colorName: currentColor.name,
      });

      setHarmonyResult({
        ...evaluation,
        critiqueTitle: `Phối đồ xuất sắc (${evaluation.score} điểm)`,
      });
    } finally {
      setIsCheckingHarmony(false);
    }
  };

  // Save Lookbook action (📖 Mở Trang Soạn Thảo Lookbook)
  const handleSaveToLookbook = () => {
    soundEngine.playPluck(523.25);
    onGoLookbook(harmonyResult);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0E17] text-slate-100 flex flex-col relative overflow-x-hidden font-sans-vi">
      {/* Decorative Traditional Motifs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1424] via-[#090D17] to-[#060910]" />
        
        {/* Bronze drum watermark */}
        <div className="absolute -bottom-36 -left-36 opacity-25">
          <DongSonDrumMandala className="w-[520px] h-[520px]" opacity={0.3} />
        </div>

        {/* Traditional Clouds */}
        <div className="absolute top-12 left-8 opacity-30">
          <CoPhongCloud className="w-48 h-28" />
        </div>
        <div className="absolute top-16 right-12 opacity-25">
          <CoPhongCloud className="w-56 h-32" flipX />
        </div>
      </div>

      {/* Main Responsive Workspace */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header Breadcrumbs / Title */}
        <div className="w-full mb-4 md:mb-6 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                KHÔNG GIAN PHỤC SỨC DI SẢN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-vi text-amber-200 tracking-wide mt-1">
              Phòng Thử Đồ Bản Vẽ 2D
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Đang phối:{' '}
              <strong className="text-amber-300 font-medium">
                {currentTop ? currentTop.name : 'Chưa chọn áo'}
              </strong>{' '}
              • {currentBottom ? currentBottom.name : 'Chưa chọn quần/váy'}
              {currentAccessory ? ` • ${currentAccessory.name}` : ''}
            </span>
          </div>
        </div>

        {/* WORKSPACE CONTAINER: Dynamic CSS Grid (Single-column mobile, Side-by-side md:grid-cols-2 laptop) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0E1526]/85 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          {/* ==========================================================
              LEFT COLUMN (Visualizer):
              - Mobile: Full width single column stacked on top
              - Laptop (md:): Left column in md:grid-cols-2 side-by-side
             ========================================================== */}
          <div className="w-full bg-[#090D18]/95 border border-slate-800 rounded-2xl relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden shadow-inner flex-col">
            {/* Top Score Badge inside Canvas */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{harmonyResult.score} Điểm</span>
                <span className="text-slate-400 font-normal hidden sm:inline">• {harmonyResult.ratingBadge}</span>
              </div>
            </div>

            {/* Top 2D Simulation Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs shadow-lg">
              <Waves className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-semibold">Bản vẽ 2D Chuẩn Xác</span>
              <span className="text-slate-400 font-normal hidden sm:inline">• Chuyển động lụa mềm</span>
            </div>

            {/* Avatar Component */}
            <div className="w-full h-full flex items-center justify-center p-2">
              <AvatarModel
                top={currentTop}
                bottom={currentBottom}
                accessory={currentAccessory}
                fabric={currentFabric}
                color={currentColor}
                topCustomColor={topCustomColor}
                bottomCustomColor={bottomCustomColor}
                harmonyScore={harmonyResult.score}
                harmonyCritique={harmonyResult.detailedCritique}
                showCulturePins={false}
                onDownloadPhoto={() => onGoLookbook(harmonyResult)}
                hoveredItem={hoveredItem}
                isHoveringSilk={Boolean(hoveredItem || hoveredTabId)}
              />
            </div>

            {/* Garment Quick Badges Bar at Canvas Bottom with Images & Active Colors */}
            <div className="w-full p-2 sm:p-2.5 bg-[#0C1220]/95 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] text-slate-300 custom-scrollbar">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Top preview */}
                {currentTop ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 shrink-0 shadow-xs"
                  >
                    <img
                      src={currentTop.imageUrl}
                      alt={currentTop.name}
                      className="w-5 h-5 rounded-md object-cover border border-amber-400/50"
                    />
                    <span className="text-amber-300 font-semibold truncate max-w-[120px] sm:max-w-none">
                      {currentTop.name}
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-slate-900/60 border border-dashed border-slate-700/80 text-slate-500 text-[10.5px]">
                    Chưa chọn áo
                  </span>
                )}

                <span className="text-slate-600 font-bold">+</span>

                {/* Bottom preview */}
                {currentBottom ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 shrink-0 shadow-xs"
                  >
                    <img
                      src={currentBottom.imageUrl}
                      alt={currentBottom.name}
                      className="w-5 h-5 rounded-md object-cover border border-slate-600"
                    />
                    <span className="text-slate-200 truncate max-w-[110px] sm:max-w-none">
                      {currentBottom.name}
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-slate-900/60 border border-dashed border-slate-700/80 text-slate-500 text-[10.5px]">
                    Chưa chọn quần/váy
                  </span>
                )}

                <span className="text-slate-600 font-bold">+</span>

                {/* Accessory preview */}
                {currentAccessory ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 shrink-0 shadow-xs"
                  >
                    <img
                      src={currentAccessory.imageUrl}
                      alt={currentAccessory.name}
                      className="w-5 h-5 rounded-md object-cover border border-slate-600"
                    />
                    <span className="text-slate-300 truncate max-w-[100px] sm:max-w-none">
                      {currentAccessory.name}
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-1 rounded-lg bg-slate-900/60 border border-dashed border-slate-700/80 text-slate-500 text-[10.5px]">
                    Chưa chọn phụ kiện
                  </span>
                )}
              </div>

              {/* Active Colors Swatches Bar */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[10.5px]">
                  <div className="flex items-center gap-1.5" title={`Màu Áo: ${activeTopHex}`}>
                    <span className="text-slate-400 text-[10px]">Màu Áo:</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0 shadow-xs"
                      style={{ backgroundColor: activeTopHex }}
                    />
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="flex items-center gap-1.5" title={`Màu Quần/Váy: ${activeBottomHex}`}>
                    <span className="text-slate-400 text-[10px]">Quần/Váy:</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0 shadow-xs"
                      style={{ backgroundColor: activeBottomHex }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN (Interactive Controls & Wardrobe):
              - Mobile: Full width single column stacked below visualizer
              - Laptop (md:): Right column in md:grid-cols-2 side-by-side
             ========================================================== */}
          <div className="w-full flex flex-col gap-4 text-left">
            {/* 1. Trợ Lý AI Prompt Bar */}
            <div className="bg-[#121A2C] border border-amber-400/30 rounded-2xl p-2.5 flex items-center gap-2 shadow-lg">
              <div className="pl-1.5 text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                placeholder="Trợ lý AI: Gợi ý cho tôi một bộ đi dạo phố, chụp ảnh..."
                className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-400 focus:outline-none font-sans-vi"
              />
              <button
                onClick={handleAiSuggest}
                disabled={isAiSuggesting}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-tight shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 shrink-0"
              >
                {isAiSuggesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang nghĩ...</span>
                  </>
                ) : (
                  <span>Nhờ AI</span>
                )}
              </button>
            </div>

            {/* 2. Silk Category Navigation Tabs (Framer Motion Silk Ribbon Glide) */}
            <SilkCategoryTabs
              items={categoryTabs}
              activeId={activeTab}
              onSelect={(id) => setActiveTab(id as any)}
              onHoverTab={(id) => setHoveredTabId(id)}
            />

            {/* Silk Sensation & Fabric Tactile Banner */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90">
              <div className="flex items-center gap-1.5 truncate">
                <Waves className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                <span className="font-medium truncate">
                  {activeTab === 'top' && 'Áo Cổ Phục: Bấm lần 1 để chọn, bấm lần 2 vào áo đang chọn để gỡ bỏ. Rê chuột để xem trước phom dáng.'}
                  {activeTab === 'bottom' && 'Quần / Váy: Bấm lần 1 để chọn, bấm lần 2 vào quần/váy đang chọn để gỡ bỏ. Rê chuột để xem trước nếp rủ.'}
                  {activeTab === 'accessory' && 'Phụ Kiện: Bấm lần 1 để chọn, bấm lần 2 vào phụ kiện đang chọn để gỡ bỏ.'}
                  {activeTab === 'color' && 'Màu Sắc Cổ Phục: Tùy biến đổi màu riêng biệt cho Áo hoặc Quần/Váy, giữ trọn hoa văn.'}
                </span>
              </div>
              <span className="text-[10px] text-amber-400/80 font-mono shrink-0 pl-2 hidden sm:inline">
                Bấm 2 lần = Bỏ chọn
              </span>
            </div>

            {/* 3. Dynasty & Gender Filters with Framer Motion interactive feedback */}
            {(activeTab === 'top' || activeTab === 'bottom' || activeTab === 'accessory') && (
              <div className="flex flex-col gap-1.5 pt-0.5">
                {/* Era filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">Triều đại:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'nguyen', label: 'Triều Nguyễn' },
                      { id: 'le', label: 'Triều Lê' },
                      { id: 'tran', label: 'Lý - Trần' },
                    ].map((era) => (
                      <motion.button
                        key={era.id}
                        onClick={() => {
                          soundEngine.playSilkFlutter();
                          setEraFilter(era.id);
                        }}
                        whileHover={{ y: -1.5, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                          eraFilter === era.id
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs font-semibold'
                            : 'bg-[#121A2C] text-slate-400 hover:text-slate-200 border border-slate-700/50'
                        }`}
                      >
                        {era.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Gender filter for tops */}
                {activeTab === 'top' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">Giới tính:</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                      {[
                        { id: 'nam', label: 'Nam Phục' },
                        { id: 'nu', label: 'Nữ Phục' },
                      ].map((gen) => (
                        <button
                          key={gen.id}
                          onClick={() => {
                            soundEngine.playSilkFlutter();
                            setGenderFilter(gen.id as 'nam' | 'nu');
                          }}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                            genderFilter === gen.id
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                              : 'bg-[#0F1626] text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {gen.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Wardrobe Item List Grid with Framer Motion Silk Drape Transitions */}
            <div
              data-lenis-prevent="true"
              tabIndex={0}
              className="flex-1 min-h-[260px] max-h-[320px] md:max-h-[380px] lg:max-h-[420px] overflow-y-auto overscroll-contain space-y-2 pr-1.5 custom-scrollbar scrollbar-heritage touch-pan-y focus:outline-none"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${eraFilter}-${genderFilter}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2"
                >
                  {/* TOPS TAB */}
                  {activeTab === 'top' &&
                    getFilteredItems(TOPS).map((item) => {
                      const isSelected = currentTop?.id === item.id;
                      return (
                        <motion.div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              soundEngine.playPluck(440);
                              onSelectTop(null);
                            } else {
                              soundEngine.playPluck(523.25);
                              onSelectTop(item);
                            }
                          }}
                          onMouseEnter={() => {
                            setHoveredItem(item);
                            soundEngine.playSilkFlutter();
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                          whileHover={{
                            y: -3,
                            scale: 1.015,
                            boxShadow: '0 10px 28px -4px rgba(245, 158, 11, 0.22)',
                            transition: { type: 'spring', stiffness: 350, damping: 22 },
                          }}
                          whileTap={{ scale: 0.985 }}
                          className={`group relative p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors overflow-hidden ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-400/90 shadow-[0_0_18px_rgba(212,175,55,0.25)]'
                              : 'bg-[#101728]/95 border-slate-800 hover:border-amber-500/40 hover:bg-[#141C30]'
                          }`}
                        >
                          {/* Silk light sheen pass on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                          {/* Mini Silk Drape Wave Ribbon on Hover */}
                          <div className="absolute top-1/2 -translate-y-1/2 right-12 w-20 h-5 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity">
                            <SilkWaveRibbon isHovered={true} className="w-full h-full" color="#F59E0B" />
                          </div>

                          {/* Hover Silk Wave Accent line at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400/70 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                            {/* Rich Thumbnail */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/80 group-hover:border-amber-400/80 transition-all shadow-md">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs sm:text-[13px] font-semibold text-slate-100 font-serif-vi group-hover:text-amber-200 transition-colors truncate">
                                  {item.name}
                                </h4>
                                {isSelected && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-sans-vi border border-amber-400/40 font-medium">
                                    Đang chọn • Bấm để gỡ
                                  </span>
                                )}
                                {item.gender && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-sans-vi border uppercase font-medium ${
                                      item.gender === 'nam'
                                        ? 'bg-sky-950/70 text-sky-300 border-sky-400/40'
                                        : item.gender === 'nu'
                                        ? 'bg-rose-950/70 text-rose-300 border-rose-400/40'
                                        : 'bg-amber-950/70 text-amber-300 border-amber-400/40'
                                    }`}
                                  >
                                    {item.gender === 'nam' ? 'Nam' : item.gender === 'nu' ? 'Nữ' : 'Unisex'}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-amber-400/90 font-medium block truncate mt-0.5">
                                {item.era} • {item.badge}
                              </span>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans-vi">
                                {item.summary}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ml-2 ${
                              isSelected
                                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'border-slate-600 group-hover:border-amber-400/60'
                            }`}
                            title={isSelected ? 'Đang chọn (Nhấp lần nữa để bỏ chọn)' : 'Nhấp để chọn'}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </motion.div>
                      );
                    })}

                  {/* BOTTOMS TAB */}
                  {activeTab === 'bottom' &&
                    getFilteredItems(BOTTOMS).map((item) => {
                      const isSelected = currentBottom?.id === item.id;
                      return (
                        <motion.div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              soundEngine.playPluck(440);
                              onSelectBottom(null);
                            } else {
                              soundEngine.playPluck(587.33);
                              onSelectBottom(item);
                            }
                          }}
                          onMouseEnter={() => {
                            setHoveredItem(item);
                            soundEngine.playSilkFlutter();
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                          whileHover={{
                            y: -3,
                            scale: 1.015,
                            boxShadow: '0 10px 28px -4px rgba(245, 158, 11, 0.22)',
                            transition: { type: 'spring', stiffness: 350, damping: 22 },
                          }}
                          whileTap={{ scale: 0.985 }}
                          className={`group relative p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors overflow-hidden ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-400/90 shadow-[0_0_18px_rgba(212,175,55,0.25)]'
                              : 'bg-[#101728]/95 border-slate-800 hover:border-amber-500/40 hover:bg-[#141C30]'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                          {/* Mini Silk Drape Wave Ribbon on Hover */}
                          <div className="absolute top-1/2 -translate-y-1/2 right-12 w-20 h-5 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity">
                            <SilkWaveRibbon isHovered={true} className="w-full h-full" color="#F59E0B" />
                          </div>

                          <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/80 group-hover:border-amber-400/80 transition-all shadow-md">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs sm:text-[13px] font-semibold text-slate-100 font-serif-vi group-hover:text-amber-200 transition-colors truncate">
                                  {item.name}
                                </h4>
                                {isSelected && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-sans-vi border border-amber-400/40 font-medium">
                                    Đang chọn • Bấm để gỡ
                                  </span>
                                )}
                                {item.gender && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-sans-vi border uppercase font-medium ${
                                      item.gender === 'nam'
                                        ? 'bg-sky-950/70 text-sky-300 border-sky-400/40'
                                        : item.gender === 'nu'
                                        ? 'bg-rose-950/70 text-rose-300 border-rose-400/40'
                                        : 'bg-amber-950/70 text-amber-300 border-amber-400/40'
                                    }`}
                                  >
                                    {item.gender === 'nam' ? 'Nam' : item.gender === 'nu' ? 'Nữ' : 'Unisex'}
                                  </span>
                                )}
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans-vi border border-amber-400/30">
                                  Nếp rủ
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-400/90 font-medium block truncate mt-0.5">
                                {item.era} • {item.badge}
                              </span>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans-vi">
                                {item.summary}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ml-2 ${
                              isSelected
                                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'border-slate-600 group-hover:border-amber-400/60'
                            }`}
                            title={isSelected ? 'Đang chọn (Nhấp lần nữa để bỏ chọn)' : 'Nhấp để chọn'}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </motion.div>
                      );
                    })}

                  {/* ACCESSORIES TAB */}
                  {activeTab === 'accessory' &&
                    getFilteredItems(ACCESSORIES).map((item) => {
                      const isSelected = currentAccessory?.id === item.id;
                      return (
                        <motion.div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              soundEngine.playPluck(440);
                              onSelectAccessory(null);
                            } else {
                              soundEngine.playPluck(659.25);
                              onSelectAccessory(item);
                            }
                          }}
                          onMouseEnter={() => {
                            setHoveredItem(item);
                            soundEngine.playSilkFlutter();
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                          whileHover={{
                            y: -3,
                            scale: 1.015,
                            boxShadow: '0 10px 28px -4px rgba(245, 158, 11, 0.22)',
                            transition: { type: 'spring', stiffness: 350, damping: 22 },
                          }}
                          whileTap={{ scale: 0.985 }}
                          className={`group relative p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors overflow-hidden ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-400/90 shadow-[0_0_18px_rgba(212,175,55,0.25)]'
                              : 'bg-[#101728]/95 border-slate-800 hover:border-amber-500/40 hover:bg-[#141C30]'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

                          {/* Mini Silk Drape Wave Ribbon on Hover */}
                          <div className="absolute top-1/2 -translate-y-1/2 right-12 w-20 h-5 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity">
                            <SilkWaveRibbon isHovered={true} className="w-full h-full" color="#F59E0B" />
                          </div>

                          <div className="flex items-center gap-3 relative z-10 flex-1 min-w-0">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/80 group-hover:border-amber-400/80 transition-all shadow-md">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs sm:text-[13px] font-semibold text-slate-100 font-serif-vi group-hover:text-amber-200 transition-colors truncate">
                                  {item.name}
                                </h4>
                                {isSelected && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-sans-vi border border-amber-400/40 font-medium">
                                    Đang chọn • Bấm để gỡ
                                  </span>
                                )}
                                {item.gender && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-sans-vi border uppercase font-medium ${
                                      item.gender === 'nam'
                                        ? 'bg-sky-950/70 text-sky-300 border-sky-400/40'
                                        : item.gender === 'nu'
                                        ? 'bg-rose-950/70 text-rose-300 border-rose-400/40'
                                        : 'bg-amber-950/70 text-amber-300 border-amber-400/40'
                                    }`}
                                  >
                                    {item.gender === 'nam' ? 'Nam' : item.gender === 'nu' ? 'Nữ' : 'Unisex'}
                                  </span>
                                )}
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans-vi border border-amber-400/30">
                                  Thêu tơ
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-400/90 font-medium block truncate mt-0.5">
                                {item.era} • {item.badge}
                              </span>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans-vi">
                                {item.summary}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ml-2 ${
                              isSelected
                                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                : 'border-slate-600 group-hover:border-amber-400/60'
                            }`}
                            title={isSelected ? 'Đang chọn (Nhấp lần nữa để bỏ chọn)' : 'Nhấp để chọn'}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </motion.div>
                      );
                    })}

                  {/* COLORS TAB (Đổi màu độc lập cho Áo hoặc Quần/Váy, giữ trọn vẹn hoa văn & kiểu dáng) */}
                  {activeTab === 'color' && (
                    <div className="space-y-3 pt-1">
                      {/* 1. Target Selector: Áo vs Quần/Váy */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-amber-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-amber-400" />
                            <span>Chọn phần trang phục muốn đổi màu:</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                            Họa tiết & phom dáng giữ nguyên
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
                          {/* Button Đổi màu Áo */}
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPluck(523.25);
                              setColorTarget('top');
                            }}
                            className={`p-2.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer ${
                              colorTarget === 'top'
                                ? 'bg-amber-950/70 border border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                                : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                                <Shirt className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">Đổi màu Áo</div>
                                <div className="text-[10px] text-slate-400 truncate">{currentTop?.name || 'Chưa chọn'}</div>
                              </div>
                            </div>
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white/60 shrink-0 shadow-sm ml-1.5"
                              style={{ backgroundColor: activeTopHex }}
                              title={`Màu áo: ${activeTopHex}`}
                            />
                          </button>

                          {/* Button Đổi màu Quần / Váy */}
                          <button
                            type="button"
                            onClick={() => {
                              soundEngine.playPluck(587.33);
                              setColorTarget('bottom');
                            }}
                            className={`p-2.5 rounded-lg flex items-center justify-between text-left transition-all cursor-pointer ${
                              colorTarget === 'bottom'
                                ? 'bg-amber-950/70 border border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/50'
                                : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">Đổi màu Quần / Váy</div>
                                <div className="text-[10px] text-slate-400 truncate">{currentBottom?.name || 'Chưa chọn'}</div>
                              </div>
                            </div>
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white/60 shrink-0 shadow-sm ml-1.5"
                              style={{ backgroundColor: activeBottomHex }}
                              title={`Màu quần/váy: ${activeBottomHex}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 2. Target info & quick actions toolbar */}
                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#131C2E] border border-amber-500/20 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate-400 text-[11px] shrink-0">Đang chọn cho:</span>
                          <span className="font-semibold text-amber-300 truncate">
                            {colorTarget === 'top' ? `Áo (${currentTop?.name || 'Chưa chọn'})` : `Quần / Váy (${currentBottom?.name || 'Chưa chọn'})`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Custom Color input */}
                          <label
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10.5px] text-slate-200 cursor-pointer shadow-xs transition-colors"
                            title="Chọn mã màu tùy biến bất kỳ"
                          >
                            <span>Màu tự do</span>
                            <input
                              type="color"
                              value={colorTarget === 'top' ? activeTopHex : activeBottomHex}
                              onChange={(e) => {
                                const newHex = e.target.value;
                                if (colorTarget === 'top') {
                                  onSelectTopColor(newHex);
                                } else {
                                  onSelectBottomColor(newHex);
                                }
                              }}
                              className="w-4 h-4 p-0 border-0 rounded cursor-pointer bg-transparent"
                            />
                          </label>

                          {/* Reset to authentic photo color */}
                          {((colorTarget === 'top' && topCustomColor) ||
                            (colorTarget === 'bottom' && bottomCustomColor)) && (
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playPluck(440);
                                if (colorTarget === 'top') {
                                  onSelectTopColor('');
                                } else {
                                  onSelectBottomColor('');
                                }
                              }}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10.5px] font-medium transition-colors cursor-pointer"
                              title="Khôi phục màu nguyên bản đối chiếu ảnh gốc"
                            >
                              Khôi phục màu gốc
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 3. Heritage 12-Color Palette Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {COLOR_PALETTES.map((palette) => {
                          const currentTargetHex = colorTarget === 'top' ? activeTopHex : activeBottomHex;
                          const isSelected = currentTargetHex.toLowerCase() === palette.hex.toLowerCase();

                          return (
                            <motion.div
                              key={palette.id}
                              onClick={() => {
                                soundEngine.playPluck(523.25);
                                if (colorTarget === 'top') {
                                  onSelectTopColor(palette.hex);
                                } else {
                                  onSelectBottomColor(palette.hex);
                                }
                                onSelectColor(palette);
                              }}
                              onMouseEnter={() => {
                                setHoveredItem(palette as any);
                                soundEngine.playSilkFlutter();
                              }}
                              onMouseLeave={() => setHoveredItem(null)}
                              whileHover={{
                                y: -2.5,
                                scale: 1.02,
                                boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.25)',
                                transition: { type: 'spring', stiffness: 350, damping: 22 },
                              }}
                              whileTap={{ scale: 0.98 }}
                              className={`group relative p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-colors overflow-hidden ${
                                isSelected
                                  ? 'bg-amber-950/50 border-amber-400 shadow-sm ring-1 ring-amber-400/40'
                                  : 'bg-[#101728] border-slate-800 hover:border-amber-500/40 hover:bg-[#141C30]'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                              <div
                                className="w-8 h-8 rounded-full border-2 border-white/40 shrink-0 shadow-sm group-hover:scale-110 transition-transform relative"
                                style={{ backgroundColor: palette.hex }}
                              >
                                {isSelected && (
                                  <div className="absolute inset-0 rounded-full flex items-center justify-center text-white drop-shadow">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div className="text-left overflow-hidden relative z-10 flex-1 min-w-0">
                                <div className="text-xs font-semibold text-slate-100 truncate group-hover:text-amber-200 transition-colors">
                                  {palette.name}
                                </div>
                                <div className="text-[10px] text-slate-400 line-clamp-1">
                                  {palette.meaning}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* 4. Heritage Note */}
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[10.5px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Quy chuẩn bảo tồn:</strong> Khi đổi màu cho áo hoặc quần/váy, các họa tiết rồng/phụng, cúc ngũ thường, nếp gấp xếp ly và kiểu dáng 2D truyền thống vẫn được giữ nguyên vẹn 100%.
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 5. Harmony Assessment Breakdown Box */}
            <div className="p-3.5 rounded-2xl bg-[#131C2E] border border-amber-500/20 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif-vi font-bold text-amber-200">
                  {harmonyResult.critiqueTitle}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  {harmonyResult.ratingBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {harmonyResult.detailedCritique}
              </p>
              {harmonyResult.culturalSecret && (
                <div className="text-[10px] text-amber-300/90 flex items-start gap-1 pt-1 border-t border-slate-700/60">
                  <Info className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span>{harmonyResult.culturalSecret}</span>
                </div>
              )}
            </div>

            {/* 6. Action Buttons */}
            <div className="pt-1 flex flex-col gap-2.5">
              {/* KIỂM TRA SỰ HÀI HÒA (AI) */}
              <button
                onClick={handleCheckHarmony}
                disabled={isCheckingHarmony}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCheckingHarmony ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>ĐANG PHÂN TÍCH VĂN HÓA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>KIỂM TRA SỰ HÀI HÒA (AI)</span>
                  </>
                )}
              </button>

              <div className="pt-1">
                {/* 📖 Mở Trang Soạn Thảo & Tải Poster Lookbook */}
                <button
                  onClick={handleSaveToLookbook}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#121A2C] via-[#1A2640] to-[#121A2C] hover:from-[#18233C] hover:to-[#223254] text-amber-200 hover:text-amber-100 border border-amber-400/60 hover:border-amber-300 text-xs font-bold shadow-lg active:scale-[0.99] transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  title="Mở Trang Soạn Thảo Lookbook để tùy biến bối cảnh, tiêu đề, thơ đề từ và tải Poster HD"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span>📖 Mở Trang Soạn Thảo & Tải Poster Lookbook</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
