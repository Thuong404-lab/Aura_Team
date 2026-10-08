import React, { useState } from 'react';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
  FABRICS,
  COLOR_PALETTES,
} from '../data/vietPhucData';
import { AvatarModel } from './AvatarModel';
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
} from 'lucide-react';
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
  currentTop: WardrobeItem;
  currentBottom: WardrobeItem;
  currentAccessory: WardrobeItem;
  currentFabric: FabricOption;
  currentColor: ColorOption;
  onSelectTop: (item: WardrobeItem) => void;
  onSelectBottom: (item: WardrobeItem) => void;
  onSelectAccessory: (item: WardrobeItem) => void;
  onSelectFabric: (fabric: FabricOption) => void;
  onSelectColor: (color: ColorOption) => void;
  onGoHome: () => void;
  onGoLookbook: (harmonyData?: HarmonyResult) => void;
  onOpenLoginModal?: () => void;
}

export const FittingRoomScreen: React.FC<FittingRoomScreenProps> = ({
  currentTop,
  currentBottom,
  currentAccessory,
  currentFabric,
  currentColor,
  onSelectTop,
  onSelectBottom,
  onSelectAccessory,
  onSelectFabric,
  onSelectColor,
  onGoHome,
  onGoLookbook,
}) => {
  // Wardrobe Navigation Tabs
  const [activeTab, setActiveTab] = useState<'top' | 'bottom' | 'accessory' | 'fabric' | 'color'>('top');

  // Dynasty Era Filter
  const [eraFilter, setEraFilter] = useState<string>('all');

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

  // Filter items by era
  const getFilteredItems = (items: WardrobeItem[]) => {
    if (eraFilter === 'all') return items;
    if (eraFilter === 'nguyen') {
      return items.filter(
        (i) => i.era.toLowerCase().includes('nguyễn') || i.id.includes('ngu-than') || i.id.includes('tac') || i.id.includes('nhat-binh')
      );
    }
    if (eraFilter === 'le') {
      return items.filter(
        (i) => i.era.toLowerCase().includes('lê') || i.id.includes('giao-linh') || i.id.includes('vien-linh')
      );
    }
    if (eraFilter === 'tran') {
      return items.filter(
        (i) => i.era.toLowerCase().includes('trần') || i.era.toLowerCase().includes('lý') || i.id.includes('doi-chan')
      );
    }
    return items;
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
        top: currentTop,
        bottom: currentBottom,
        accessory: currentAccessory,
        fabricName: currentFabric.name,
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

  // Save Lookbook action
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
              Phòng Thử Đồ Ảo 3D
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Đang phối: <strong className="text-amber-300 font-medium">{currentTop.name}</strong> • {currentBottom.name}
            </span>
          </div>
        </div>

        {/* WORKSPACE CONTAINER: Fully Responsive Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 bg-[#0E1526]/85 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
          {/* ==========================================================
              LEFT COLUMN: 3D Avatar Workspace
              (Desktop: 7 cols wide | Mobile: 100% full width naturally)
             ========================================================== */}
          <div className="lg:col-span-7 bg-[#090D18]/95 border border-slate-800 rounded-2xl relative min-h-[440px] sm:min-h-[520px] lg:min-h-[640px] flex items-center justify-center overflow-hidden shadow-inner flex-col">
            {/* Top Score Badge inside Canvas */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{harmonyResult.score} Điểm</span>
                <span className="text-slate-400 font-normal hidden sm:inline">• {harmonyResult.ratingBadge}</span>
              </div>
            </div>

            {/* Avatar Component */}
            <div className="w-full h-full flex items-center justify-center p-2">
              <AvatarModel
                top={currentTop}
                bottom={currentBottom}
                accessory={currentAccessory}
                fabric={currentFabric}
                color={currentColor}
                harmonyScore={harmonyResult.score}
                harmonyCritique={harmonyResult.detailedCritique}
                showCulturePins={true}
                onDownloadPhoto={() => onGoLookbook(harmonyResult)}
              />
            </div>

            {/* Garment Quick Badges Bar at Canvas Bottom */}
            <div className="w-full p-2.5 sm:p-3 bg-[#0C1220]/90 border-t border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-400 font-semibold truncate">{currentTop.name}</span>
                <span className="text-slate-500">+</span>
                <span className="text-slate-300 truncate">{currentBottom.name}</span>
                <span className="text-slate-500">+</span>
                <span className="text-slate-400 truncate">{currentAccessory.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 text-[10px] font-medium border border-amber-500/30">
                  {currentFabric.name}
                </span>
                <div
                  className="w-4 h-4 rounded-full border border-white/40 shadow-xs shrink-0"
                  style={{ backgroundColor: currentColor.hex }}
                  title={currentColor.name}
                />
              </div>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Wardrobe & AI Tools
              (Desktop: 5 cols wide | Mobile: 100% full width below avatar)
             ========================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4 text-left">
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

            {/* 2. Category Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-700/60 pb-1 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('top')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'top'
                    ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Áo ({TOPS.length})
              </button>
              <button
                onClick={() => setActiveTab('bottom')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'bottom'
                    ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quần / Váy ({BOTTOMS.length})
              </button>
              <button
                onClick={() => setActiveTab('accessory')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'accessory'
                    ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phụ kiện ({ACCESSORIES.length})
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'fabric'
                    ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Chất liệu ({FABRICS.length})
              </button>
              <button
                onClick={() => setActiveTab('color')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'color'
                    ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Màu sắc ({COLOR_PALETTES.length})
              </button>
            </div>

            {/* 3. Dynasty Filters (Visible for clothing items) */}
            {(activeTab === 'top' || activeTab === 'bottom' || activeTab === 'accessory') && (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] text-slate-400 font-medium shrink-0">Triều đại:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'nguyen', label: 'Triều Nguyễn' },
                    { id: 'le', label: 'Triều Lê' },
                    { id: 'tran', label: 'Lý - Trần' },
                  ].map((era) => (
                    <button
                      key={era.id}
                      onClick={() => setEraFilter(era.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                        eraFilter === era.id
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                          : 'bg-[#121A2C] text-slate-400 hover:text-slate-200 border border-slate-700/50'
                      }`}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Wardrobe Item List Grid */}
            <div className="flex-1 min-h-[240px] max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {/* TOPS TAB */}
              {activeTab === 'top' &&
                getFilteredItems(TOPS).map((item) => {
                  const isSelected = currentTop.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundEngine.playPluck(523.25);
                        onSelectTop(item);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-400/80 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                          : 'bg-[#101728]/90 border-slate-800 hover:border-slate-700 hover:bg-[#141C30]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 font-serif-vi">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-400/90 font-medium">
                            {item.era} • {item.badge}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-400 border-amber-300 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}

              {/* BOTTOMS TAB */}
              {activeTab === 'bottom' &&
                getFilteredItems(BOTTOMS).map((item) => {
                  const isSelected = currentBottom.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundEngine.playPluck(587.33);
                        onSelectBottom(item);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-400/80 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                          : 'bg-[#101728]/90 border-slate-800 hover:border-slate-700 hover:bg-[#141C30]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 font-serif-vi">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-400/90 font-medium">
                            {item.era} • {item.badge}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-400 border-amber-300 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}

              {/* ACCESSORIES TAB */}
              {activeTab === 'accessory' &&
                getFilteredItems(ACCESSORIES).map((item) => {
                  const isSelected = currentAccessory.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundEngine.playPluck(659.25);
                        onSelectAccessory(item);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-400/80 shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                          : 'bg-[#101728]/90 border-slate-800 hover:border-slate-700 hover:bg-[#141C30]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 font-serif-vi">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-amber-400/90 font-medium">
                            {item.era} • {item.badge}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-400 border-amber-300 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}

              {/* FABRICS TAB */}
              {activeTab === 'fabric' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {FABRICS.map((fab) => {
                    const isSelected = currentFabric.id === fab.id;
                    return (
                      <div
                        key={fab.id}
                        onClick={() => {
                          soundEngine.playPluck(523.25);
                          onSelectFabric(fab);
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-sm'
                            : 'bg-[#101728] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-100 font-serif-vi">
                            {fab.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {fab.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* COLORS TAB */}
              {activeTab === 'color' && (
                <div className="space-y-2.5 pt-1">
                  <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bảng màu Ngũ Hành truyền thống:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((palette) => {
                      const isSelected = currentColor.id === palette.id;
                      return (
                        <div
                          key={palette.id}
                          onClick={() => {
                            soundEngine.playPluck(523.25);
                            onSelectColor(palette);
                          }}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-400 shadow-sm'
                              : 'bg-[#101728] border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-white/30 shrink-0 shadow-sm"
                            style={{ backgroundColor: palette.hex }}
                          />
                          <div className="text-left overflow-hidden">
                            <div className="text-xs font-medium text-slate-100 truncate">
                              {palette.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {palette.meaning}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

              {/* Chuyển sang Lookbook */}
              <button
                onClick={handleSaveToLookbook}
                className="w-full py-2.5 rounded-2xl bg-[#121A2C] hover:bg-[#18233C] text-slate-200 border border-slate-700/80 hover:border-amber-400/60 text-xs font-semibold shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Xuất Trang Bìa Lookbook Cá Nhân</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
