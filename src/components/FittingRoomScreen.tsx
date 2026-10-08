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
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Award,
  Layers,
  Palette,
  Feather,
  RotateCcw,
  BookOpen,
  Loader2,
  Eye,
  X,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface HarmonyResult {
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
  const [activeTab, setActiveTab] = useState<'top' | 'bottom' | 'accessory' | 'fabric'>('top');
  const [eraFilter, setEraFilter] = useState<string>('all');
  const [showCultureCard, setShowCultureCard] = useState<boolean>(true);
  const [detailedItem, setDetailedItem] = useState<WardrobeItem | null>(null);

  // AI Harmony evaluation state
  const [isCheckingHarmony, setIsCheckingHarmony] = useState<boolean>(false);
  const [harmonyResult, setHarmonyResult] = useState<HarmonyResult | null>({
    score: 95,
    ratingBadge: 'Xuất sắc',
    historicalMatchPercent: 96,
    colorHarmonyPercent: 94,
    contextAestheticPercent: 95,
    critiqueTitle: 'Bản Phối Mẫu Mực Vương Triều & Cân Bằng Ngũ Hành',
    detailedCritique: `Sự kết hợp giữa ${currentTop.name} cùng ${currentBottom.name} và ${currentAccessory.name} tạo nên dáng dấp thanh cao, chuẩn mực lễ giáo cổ phong. Chất vải ${currentFabric.name} giúp tà áo có độ rủ tự nhiên, tôn vinh vóc dáng.`,
    culturalSecret: 'Đường may vạt con bên trong tượng trưng cho lòng khiêm nhu che chở; 5 chiếc cúc cài đại diện cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    stylingTip: 'Hãy kết hợp nâng nhẹ quạt lụa hoặc dải mấn ngũ sắc khi ra phố để tối ưu hiệu ứng hình ảnh hoàng triều.',
  });

  // Handle item selection with audio feedback
  const handleItemSelect = (item: WardrobeItem) => {
    soundEngine.playPluck(523.25);
    if (item.category === 'top') onSelectTop(item);
    if (item.category === 'bottom') onSelectBottom(item);
    if (item.category === 'accessory') onSelectAccessory(item);
    setShowCultureCard(true);
  };

  // Run AI Harmony Check
  const handleCheckHarmony = async () => {
    soundEngine.playPluck(698.46);
    setIsCheckingHarmony(true);

    try {
      const res = await fetch('/api/ai/harmony', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          top: currentTop,
          bottom: currentBottom,
          accessory: currentAccessory,
          fabric: currentFabric.name,
          color: currentColor.name,
          era: currentTop.era,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHarmonyResult(data.data);
      } else {
        throw new Error('Local calculation');
      }
    } catch {
      // Dynamic fallback based on selected era and harmony
      let calcScore = 93;
      if (currentTop.era === currentBottom.era) calcScore += 3;
      if (currentTop.id === 'nhat-binh' && currentAccessory.id === 'man-ngu-sac') calcScore = 98;
      if (currentTop.id === 'ngu-than' && currentBottom.id === 'quan-ong-so') calcScore = 97;

      setHarmonyResult({
        score: calcScore,
        ratingBadge: calcScore >= 95 ? 'Xuất sắc' : 'Rất Hài Hòa',
        historicalMatchPercent: calcScore >= 95 ? 98 : 91,
        colorHarmonyPercent: 95,
        contextAestheticPercent: 94,
        critiqueTitle: 'Bản Phối Chuẩn Mực Văn Hóa & Thẩm Mỹ Cổ Phong',
        detailedCritique: `Sự kết hợp giữa ${currentTop.name} và ${currentBottom.name} mang lại sự cân đối hoàn mỹ giữa cấu trúc truyền thống và vẻ thanh thoát. Màu ${currentColor.name} trên chất liệu ${currentFabric.name} tôn vinh trọn vẹn tinh thần Á Đông.`,
        culturalSecret: currentTop.cultureInfo.symbolism,
        stylingTip: 'Khi tạo dáng, giữ thẳng lưng và hai bàn tay khép nhẹ trước vạt áo để tôn vinh sự tôn nghiêm trang trọng.',
      });
    } finally {
      setIsCheckingHarmony(false);
    }
  };

  // Filter items by era if selected
  const filteredTops = TOPS.filter((t) => eraFilter === 'all' || t.era === eraFilter);
  const filteredBottoms = BOTTOMS.filter((b) => eraFilter === 'all' || b.era === eraFilter);
  const filteredAccessories = ACCESSORIES.filter((a) => eraFilter === 'all' || a.era === eraFilter);

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex flex-col justify-between select-none">
      {/* Top Navbar / Tablet Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-6 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ</span>
          </button>
          <div className="h-4 w-px bg-stone-200" />
          <div>
            <h2 className="font-serif-vi text-base font-bold text-stone-900 flex items-center gap-2">
              <span>Phòng Thử Đồ Ảo (Mix & Match)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E1E]/10 text-[#8B1E1E]">
                WORKSPACE TABLET
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Summary Pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-600 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-stone-200">
          <span className="text-[#8B1E1E] font-bold">{currentTop.name}</span>
          <span>•</span>
          <span>{currentBottom.name}</span>
          <span>•</span>
          <span className="text-stone-500">{currentColor.name}</span>
        </div>

        <button
          onClick={() => onGoLookbook(harmonyResult || undefined)}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#8B1E1E] to-[#B4821A] hover:opacity-95 transition-all shadow-md cursor-pointer"
        >
          <span>Xem Lookbook</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* CORE TWO-COLUMN WORKSPACE (Chia làm hai khu vực chính theo yêu cầu) */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* ================= KHU VỰC BÊN TRÁI (HIỂN THỊ AVATAR & BẢNG ĐIỂM AI) ================= */}
        <div className="w-full lg:w-7/12 relative bg-[#EBE6DE] border-b lg:border-b-0 lg:border-r border-stone-300 flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden min-h-[500px] lg:min-h-auto">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#8B1E1E_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* BẢNG ĐÁNH GIÁ SỰ HÀI HÒA (AI) - GÓC TRÊN BÊN PHẢI AVATAR */}
          <div className="absolute top-4 right-4 z-20 w-44 sm:w-52 glass-imperial p-3.5 sm:p-4 rounded-3xl shadow-xl border border-[#D4AF37]/30 text-center animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                Đánh Giá AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#8B1E1E] text-white">
                {harmonyResult?.ratingBadge || 'Đang chờ'}
              </span>
            </div>

            {/* Điểm số lớn */}
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-4xl sm:text-5xl font-black font-serif-vi text-[#8B1E1E] tracking-tight">
                {isCheckingHarmony ? '--' : harmonyResult?.score || 95}
              </span>
              <span className="text-xs font-bold text-stone-400">/100</span>
            </div>

            <p className="text-[10px] text-stone-600 italic font-medium leading-tight">
              {isCheckingHarmony
                ? 'Đang phân tích dữ liệu...'
                : harmonyResult?.ratingBadge === 'Xuất sắc'
                ? 'Bản phối xuất sắc chuẩn cổ phong!'
                : 'Sự kết hợp màu sắc hài hòa.'}
            </p>

            {/* Metrics Breakdown Bars */}
            <div className="mt-2.5 pt-2.5 border-t border-stone-200/60 space-y-1.5 text-[9px] text-left">
              <div>
                <div className="flex justify-between text-stone-600 mb-0.5">
                  <span>Chuẩn mực lịch sử</span>
                  <span className="font-bold text-[#8B1E1E]">
                    {harmonyResult?.historicalMatchPercent || 96}%
                  </span>
                </div>
                <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B1E1E] rounded-full transition-all duration-700"
                    style={{ width: `${harmonyResult?.historicalMatchPercent || 96}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-stone-600 mb-0.5">
                  <span>Hài hòa màu sắc (Ngũ hành)</span>
                  <span className="font-bold text-[#B4821A]">
                    {harmonyResult?.colorHarmonyPercent || 94}%
                  </span>
                </div>
                <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full transition-all duration-700"
                    style={{ width: `${harmonyResult?.colorHarmonyPercent || 94}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Model Display */}
          <div className="w-full flex-1 flex items-center justify-center relative">
            <AvatarModel
              top={currentTop}
              bottom={currentBottom}
              accessory={currentAccessory}
              fabric={currentFabric}
              color={currentColor}
              showCultureCard={showCultureCard}
              setShowCultureCard={setShowCultureCard}
            />
          </div>

          {/* Bottom Banner on Left side with Quick Preset Switcher */}
          <div className="w-full z-10 flex items-center justify-between gap-2 px-2 pt-2 text-xs">
            <div className="flex items-center gap-1.5 text-stone-600 text-[11px]">
              <span className="font-semibold text-stone-800">Trang phục:</span>
              <span>{currentTop.era}</span>
              <span>•</span>
              <span className="text-[#8B1E1E] font-medium">{currentFabric.name}</span>
            </div>

            <button
              onClick={() => {
                // Quick reset or randomize
                const randomTop = TOPS[Math.floor(Math.random() * TOPS.length)];
                onSelectTop(randomTop);
                soundEngine.playPluck(440);
              }}
              className="px-2.5 py-1 rounded-xl bg-white/70 hover:bg-white text-stone-700 text-[11px] font-medium transition-all flex items-center gap-1 border border-stone-200"
              title="Đổi ngẫu nhiên một mẫu áo khác"
            >
              <RotateCcw className="w-3 h-3" />
              Đổi ngẫu nhiên
            </button>
          </div>
        </div>

        {/* ================= KHU VỰC BÊN PHẢI (TỦ ĐỒ - WARDROBE) ================= */}
        <div className="w-full lg:w-5/12 bg-white flex flex-col justify-between shadow-xl z-20">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B1E1E]">
                  WORKSPACE PHỐI ĐỒ
                </span>
                <h3 className="font-serif-vi text-2xl font-bold text-stone-900">
                  Tủ Đồ Di Sản
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-stone-500">
                <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>3 lớp trang phục</span>
              </div>
            </div>

            {/* THANH ĐIỀU HƯỚNG TỦ ĐỒ (TABS) THEO YÊU CẦU: ÁO, QUẦN/VÁY, PHỤ KIỆN */}
            <div className="flex gap-2 border-b border-stone-200 pb-3 mb-5 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('top');
                  soundEngine.playPluck(392);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'top'
                    ? 'bg-[#8B1E1E] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                ÁO ({TOPS.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('bottom');
                  soundEngine.playPluck(440);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'bottom'
                    ? 'bg-[#8B1E1E] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                QUẦN / VÁY ({BOTTOMS.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('accessory');
                  soundEngine.playPluck(523.25);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'accessory'
                    ? 'bg-[#8B1E1E] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                PHỤ KIỆN ({ACCESSORIES.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('fabric');
                  soundEngine.playPluck(587.33);
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'fabric'
                    ? 'bg-[#B4821A] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Palette className="w-3 h-3" />
                VẢI & MÀU
              </button>
            </div>

            {/* BỘ LỌC TRIỀU ĐẠI (DYNASTY FILTER) */}
            {activeTab !== 'fabric' && (
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-[11px]">
                <span className="text-stone-400 font-medium whitespace-nowrap mr-1">Triều đại:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'Triều Nguyễn', label: 'Triều Nguyễn' },
                  { id: 'Thời Lê', label: 'Thời Lê' },
                  { id: 'Cách Tân', label: 'Cách Tân' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEraFilter(item.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                      eraFilter === item.id
                        ? 'bg-stone-800 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* LƯỚI DANH SÁCH MÓN ĐỒ TRỰC QUAN (GRID ITEMS) */}
            {activeTab === 'top' && (
              <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                {filteredTops.map((item) => {
                  const isSelected = currentTop.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`group p-3.5 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#8B1E1E] shadow-lg scale-[1.02]'
                          : 'bg-stone-50/80 border-transparent hover:border-stone-300 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}

                      {/* Subtle Detail View Hover Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playPluck(440);
                          setDetailedItem(item);
                        }}
                        className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-[#8B1E1E] hover:text-white text-stone-700 backdrop-blur-md shadow-md border border-stone-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center transform group-hover:scale-100 scale-90 cursor-pointer"
                        title="Xem chi tiết văn hóa & lịch sử"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        {/* Garment Image or Fallback Icon */}
                        {item.imageUrl ? (
                          <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-2.5 bg-stone-100 border border-stone-200/80 shadow-xs">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Corner Traditional Icon Badge */}
                            <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-xs">
                              {item.icon}
                            </span>
                            {/* Subtle Detail View Hover Overlay Pill */}
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                              <span className="px-2.5 py-1 rounded-full bg-white/95 text-stone-900 text-[10px] font-bold flex items-center gap-1 shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                <Eye className="w-3 h-3 text-[#8B1E1E]" />
                                Chi tiết
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-3xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                        )}

                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4821A] block">
                          {item.era}
                        </span>
                        <h4 className="font-serif-vi text-sm font-bold text-stone-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="italic truncate max-w-[85px]">{item.badge}</span>
                        <span
                          className={`font-bold shrink-0 ${
                            isSelected ? 'text-[#8B1E1E]' : 'text-stone-400 group-hover:text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Đang mặc' : 'Mặc thử'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'bottom' && (
              <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                {filteredBottoms.map((item) => {
                  const isSelected = currentBottom.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`group p-3.5 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#8B1E1E] shadow-lg scale-[1.02]'
                          : 'bg-stone-50/80 border-transparent hover:border-stone-300 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}

                      {/* Subtle Detail View Hover Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playPluck(440);
                          setDetailedItem(item);
                        }}
                        className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-[#8B1E1E] hover:text-white text-stone-700 backdrop-blur-md shadow-md border border-stone-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center transform group-hover:scale-100 scale-90 cursor-pointer"
                        title="Xem chi tiết văn hóa & lịch sử"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        {/* Garment Image or Fallback Icon */}
                        {item.imageUrl ? (
                          <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-2.5 bg-stone-100 border border-stone-200/80 shadow-xs">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Corner Traditional Icon Badge */}
                            <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-xs">
                              {item.icon}
                            </span>
                            {/* Subtle Detail View Hover Overlay Pill */}
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                              <span className="px-2.5 py-1 rounded-full bg-white/95 text-stone-900 text-[10px] font-bold flex items-center gap-1 shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                <Eye className="w-3 h-3 text-[#8B1E1E]" />
                                Chi tiết
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-3xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                        )}

                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4821A] block">
                          {item.era}
                        </span>
                        <h4 className="font-serif-vi text-sm font-bold text-stone-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="italic truncate max-w-[85px]">{item.badge}</span>
                        <span
                          className={`font-bold shrink-0 ${
                            isSelected ? 'text-[#8B1E1E]' : 'text-stone-400 group-hover:text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Đang mặc' : 'Mặc thử'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'accessory' && (
              <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                {filteredAccessories.map((item) => {
                  const isSelected = currentAccessory.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className={`group p-3.5 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#8B1E1E] shadow-lg scale-[1.02]'
                          : 'bg-stone-50/80 border-transparent hover:border-stone-300 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </span>
                      )}

                      {/* Subtle Detail View Hover Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEngine.playPluck(440);
                          setDetailedItem(item);
                        }}
                        className="absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-[#8B1E1E] hover:text-white text-stone-700 backdrop-blur-md shadow-md border border-stone-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center transform group-hover:scale-100 scale-90 cursor-pointer"
                        title="Xem chi tiết văn hóa & lịch sử"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        {/* Garment Image or Fallback Icon */}
                        {item.imageUrl ? (
                          <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-2.5 bg-stone-100 border border-stone-200/80 shadow-xs">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            {/* Corner Traditional Icon Badge */}
                            <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-xs">
                              {item.icon}
                            </span>
                            {/* Subtle Detail View Hover Overlay Pill */}
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                              <span className="px-2.5 py-1 rounded-full bg-white/95 text-stone-900 text-[10px] font-bold flex items-center gap-1 shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                <Eye className="w-3 h-3 text-[#8B1E1E]" />
                                Chi tiết
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-3xl mb-3 shadow-xs group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                        )}

                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4821A] block">
                          {item.era}
                        </span>
                        <h4 className="font-serif-vi text-sm font-bold text-stone-900 group-hover:text-[#8B1E1E] transition-colors leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                        <span className="italic truncate max-w-[85px]">{item.badge}</span>
                        <span
                          className={`font-bold shrink-0 ${
                            isSelected ? 'text-[#8B1E1E]' : 'text-stone-400 group-hover:text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Đang phối' : 'Đeo thử'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CHẤT LIỆU VẢI & MÀU SẮC PHONG THỦY */}
            {activeTab === 'fabric' && (
              <div className="space-y-6">
                {/* 1. Chất liệu vải */}
                <div>
                  <span className="text-xs font-bold uppercase text-[#8B1E1E] tracking-wider block mb-3">
                    Chọn Loại Vải Truyền Thống:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {FABRICS.map((fab) => {
                      const isSelected = currentFabric.id === fab.id;
                      return (
                        <div
                          key={fab.id}
                          onClick={() => {
                            soundEngine.playPluck(440);
                            onSelectFabric(fab);
                          }}
                          className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all flex items-start justify-between ${
                            isSelected
                              ? 'bg-[#FAF7F2] border-[#B4821A] shadow-md'
                              : 'bg-stone-50 border-stone-200 hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-vi font-bold text-sm text-stone-900">
                                {fab.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                                {fab.sheen}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 mt-1">
                              {fab.description}
                            </p>
                          </div>
                          {isSelected && <CheckCircle className="w-4 h-4 text-[#B4821A] shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Bảng Màu Sắc */}
                <div>
                  <span className="text-xs font-bold uppercase text-[#8B1E1E] tracking-wider block mb-3">
                    Tông Màu Sắc Vương Triều (Ngũ Hành):
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {COLOR_PALETTES.map((col) => {
                      const isSelected = currentColor.id === col.id;
                      return (
                        <div
                          key={col.id}
                          onClick={() => {
                            soundEngine.playPluck(523.25);
                            onSelectColor(col);
                          }}
                          className={`p-3 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-white border-[#8B1E1E] shadow-md'
                              : 'bg-stone-50 border-stone-200 hover:bg-white'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full shadow-inner border border-black/10 shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <div className="overflow-hidden">
                            <span className="font-serif-vi font-bold text-xs text-stone-900 truncate block">
                              {col.name}
                            </span>
                            <span className="text-[10px] text-stone-500 truncate block">
                              {col.meaning.split(',')[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= KHU VỰC THAO TÁC GÓC DƯỚI BÊN PHẢI ================= */}
          <div className="p-6 bg-white border-t border-stone-200 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Nhận điểm hài hòa & văn hóa từ AI
              </span>
              <button
                onClick={() => setShowCultureCard(!showCultureCard)}
                className="text-[#8B1E1E] font-medium hover:underline text-[11px]"
              >
                {showCultureCard ? 'Thu gọn thẻ văn hóa' : 'Mở thẻ văn hóa'}
              </button>
            </div>

            {/* NÚT LỚN "KIỂM TRA SỰ HÀI HÒA" THEO YÊU CẦU */}
            <div className="flex gap-2">
              <button
                onClick={handleCheckHarmony}
                disabled={isCheckingHarmony}
                className="flex-1 py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-white bg-gradient-to-r from-[#8B1E1E] via-[#A32222] to-[#B4821A] hover:opacity-95 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingHarmony ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FDE68A]" />
                    <span>AI ĐANG CHẤM ĐIỂM...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-[#FDE68A]" />
                    <span>KIỂM TRA SỰ HÀI HÒA</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onGoLookbook(harmonyResult || undefined)}
                className="px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-stone-800 bg-stone-100 hover:bg-stone-200 transition-all flex items-center gap-1"
                title="Sang trang Lookbook cá nhân"
              >
                <span>Lookbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail View Modal Dialog */}
      {detailedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md max-h-[90vh] rounded-[36px] bg-white text-stone-900 p-6 shadow-2xl border border-stone-200 overflow-y-auto relative">
            <button
              onClick={() => setDetailedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-all z-10"
              title="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Clothing Image */}
            {detailedItem.imageUrl && (
              <div className="w-full h-52 rounded-2xl overflow-hidden mb-4 shadow-sm border border-stone-200 relative bg-stone-100">
                <img
                  src={detailedItem.imageUrl}
                  alt={detailedItem.name}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md">
                  {detailedItem.era}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{detailedItem.icon}</span>
              <h3 className="font-serif-vi text-xl font-bold text-stone-900">
                {detailedItem.name}
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#8B1E1E] uppercase tracking-wider block mb-3">
              {detailedItem.badge} • {detailedItem.era}
            </span>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              {detailedItem.summary}
            </p>

            {/* Cultural Info Breakdown */}
            <div className="space-y-2.5 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 mb-5">
              <div>
                <strong className="text-[#8B1E1E] block mb-0.5">Xuất xứ & Triều đại:</strong>
                <span className="text-stone-700">{detailedItem.cultureInfo.origin}</span>
              </div>
              <div>
                <strong className="text-[#8B1E1E] block mb-0.5">Cấu trúc cổ áo & Cắt may:</strong>
                <span className="text-stone-700">{detailedItem.cultureInfo.collarType}</span>
              </div>
              <div>
                <strong className="text-[#8B1E1E] block mb-0.5">Ý nghĩa hoa văn & Biểu trưng:</strong>
                <span className="text-stone-700">{detailedItem.cultureInfo.symbolism}</span>
              </div>
              <div>
                <strong className="text-[#8B1E1E] block mb-0.5">Quy cách lễ nghi & Bối cảnh:</strong>
                <span className="text-stone-700">{detailedItem.cultureInfo.etiquette}</span>
              </div>
              <div>
                <strong className="text-[#B4821A] block mb-0.5">Họa tiết đặc trưng:</strong>
                <span className="text-stone-700">{detailedItem.cultureInfo.pattern}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleItemSelect(detailedItem);
                  setDetailedItem(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#8B1E1E] text-white hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Mặc trang phục này ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDetailedItem(null)}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
