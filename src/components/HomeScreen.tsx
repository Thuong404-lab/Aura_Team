import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  History,
  Shirt,
  Volume2,
  VolumeX,
  Layers,
  CheckCircle2,
  Loader2,
  Crown,
  BookOpen,
} from 'lucide-react';
import {
  PROMPT_SUGGESTIONS,
  PRESET_OUTFITS,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
  PresetOutfit,
} from '../data/vietPhucData';
import { soundEngine } from '../utils/audioSynth';
import { getAiSuggestion, AiSuggestionResult } from '../services/aiClient';
import {
  AuraLogo,
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';

interface HomeScreenProps {
  onStartFitting: () => void;
  onApplyPreset: (preset: PresetOutfit) => void;
  onApplyAiSuggestion: (suggestion: {
    topId: string;
    bottomId: string;
    accessoryId: string;
    title: string;
    advice: string;
    persona: string;
  }) => void;
  isPlayingMusic: boolean;
  setIsPlayingMusic: (val: boolean) => void;
  onOpenSavedLibrary?: () => void;
  onOpenLoginModal?: () => void;
  savedCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartFitting,
  onApplyPreset,
  onApplyAiSuggestion,
  isPlayingMusic,
  setIsPlayingMusic,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiSuggestionResult | null>(null);

  const handleAiSuggest = async (overridePrompt?: string) => {
    const text = overridePrompt || promptInput;
    if (!text.trim()) return;

    soundEngine.playPluck(440);
    setIsAiLoading(true);
    setAiResult(null);

    try {
      const result = await getAiSuggestion(text);
      setAiResult(result);
    } catch {
      // Fallback handled inside getAiSuggestion
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiAndGo = () => {
    if (!aiResult) return;
    soundEngine.playPluck(587.33);
    onApplyAiSuggestion({
      topId: aiResult.recommendedTopId,
      bottomId: aiResult.recommendedBottomId,
      accessoryId: aiResult.recommendedAccessoryId,
      title: aiResult.conceptTitle,
      advice: aiResult.aiAdvice,
      persona: aiResult.characterPersona,
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0E17] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans-vi">
      {/* Decorative Vietnamese Heritage Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1424] via-[#090D17] to-[#060910]" />
        
        {/* Bronze drum watermarks */}
        <div className="absolute -top-32 -right-32 opacity-20">
          <DongSonDrumMandala className="w-[580px] h-[580px]" opacity={0.25} />
        </div>
        <div className="absolute -bottom-36 -left-36 opacity-25">
          <DongSonDrumMandala className="w-[500px] h-[500px]" opacity={0.3} />
        </div>

        {/* Traditional Clouds */}
        <div className="absolute top-20 left-10 opacity-30">
          <CoPhongCloud className="w-52 h-28" />
        </div>
        <div className="absolute bottom-24 right-12 opacity-35">
          <CoPhongCloud className="w-60 h-32" flipX />
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 md:py-16 text-center max-w-6xl mx-auto w-full">
        {/* Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md shadow-xs mb-6 animate-in fade-in duration-500">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-300">
            DI SẢN NGHÌN NĂM • CÔNG NGHỆ THỜI TRANG AI
          </span>
          <Crown className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Big Hero Title */}
        <h1 className="font-serif-vi text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-200 leading-[1.15] tracking-tight mb-5 max-w-4xl drop-shadow-md">
          Aura - Việt Phục Remix
          <span className="block text-xl sm:text-3xl md:text-4xl font-normal text-slate-200 mt-3 font-serif-vi">
            Giao thoa giữa <span className="text-amber-400 italic font-medium">Di Sản Triều Đại</span> và{' '}
            <span className="text-amber-300 italic font-medium">Nhịp Thở Đương Đại</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed font-sans-vi">
          Trải nghiệm phòng thử đồ ảo 3D mô phỏng quy chuẩn phục sức Lý, Lê, Nguyễn.
          Hệ thống AI phân tích độ hòa hợp văn hóa và tự động tạo trang bìa Lookbook cá nhân độ phân giải cao.
        </p>

        {/* Action Button: BẮT ĐẦU PHỐI ĐỒ */}
        <div className="mb-12 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playPluck(523.25);
              onStartFitting();
            }}
            className="group relative px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-bold tracking-[0.15em] uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-[0_8px_32px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_44px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5 hover:scale-102 transition-all duration-300 flex items-center gap-3 border border-amber-200/50 cursor-pointer"
          >
            <Shirt className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>VÀO PHÒNG THỬ ĐỒ NGAY</span>
            <ArrowRight className="w-5 h-5 text-slate-950 transform group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* AI STYLIST PROMPT BAR */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-[#0E1526]/90 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-amber-500/30 relative">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 w-full sm:w-auto px-3 py-2 text-amber-400">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <span className="font-serif-vi font-bold text-sm tracking-wide hidden md:inline text-amber-200 whitespace-nowrap">
                  Trợ lý AI Stylist:
                </span>
              </div>

              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                placeholder="Gợi ý cho tôi một bộ Việt phục đi dạo phố mùa thu, năng động..."
                className="w-full flex-1 bg-transparent px-3 py-2 text-slate-100 placeholder-slate-400 text-xs sm:text-sm outline-none font-sans-vi"
              />

              <button
                onClick={() => handleAiSuggest()}
                disabled={isAiLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Đang suy nghĩ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Nhờ AI Gợi ý</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 px-2 pb-1 custom-scrollbar">
              <span className="font-semibold text-amber-400/90 whitespace-nowrap flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" /> Gợi ý nhanh:
              </span>
              {PROMPT_SUGGESTIONS.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(prompt);
                    handleAiSuggest(prompt);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#141E34] hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 transition-all whitespace-nowrap truncate max-w-[240px] text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Result Card Modal / Drawer */}
        {aiResult && (
          <div className="mt-6 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300 text-left">
            <div className="bg-[#0E1526] p-6 rounded-3xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                      Gợi Ý Hoàn Hảo Từ Trợ Lý AI
                    </span>
                    <h3 className="font-serif-vi text-xl font-bold text-amber-200">
                      {aiResult.conceptTitle}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setAiResult(null)}
                  className="text-slate-400 hover:text-white text-base font-bold p-1 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Persona Quote */}
              <div className="bg-[#131C2E] p-3 rounded-xl border border-slate-700/70 mb-4 text-xs italic text-slate-200 flex items-center gap-2">
                <span className="text-amber-400 font-bold font-serif-vi text-base">“</span>
                <span>{aiResult.characterPersona}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-sans-vi">
                {aiResult.aiAdvice}
              </p>

              {aiResult.culturalNote && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 mb-5 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">Điểm nhấn văn hóa: </strong>
                    {aiResult.culturalNote}
                  </span>
                </div>
              )}

              {/* Outfit Items Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="p-2.5 bg-[#131C2E] rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Áo</span>
                  <span className="text-xs font-bold text-amber-300 truncate block mt-0.5">
                    {TOPS.find((t) => t.id === aiResult.recommendedTopId)?.name || 'Áo Ngũ Thân'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#131C2E] rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Quần / Váy</span>
                  <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">
                    {BOTTOMS.find((b) => b.id === aiResult.recommendedBottomId)?.name || 'Quần Ống Sớ'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#131C2E] rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Phụ kiện</span>
                  <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">
                    {ACCESSORIES.find((a) => a.id === aiResult.recommendedAccessoryId)?.name || 'Mấn Đội Đầu'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setAiResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Đóng
                </button>
                <button
                  onClick={applyAiAndGo}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Áp Dụng Vào Phòng Thử Ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4 Curated Preset Cards */}
        <div className="mt-16 w-full text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
                CẢM HỨNG BỘ SƯU TẬP
              </span>
              <h3 className="font-serif-vi text-xl sm:text-2xl font-bold text-amber-200">
                Các bản phối mẫu kinh điển
              </h3>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Nhấp để đưa trực tiếp vào phòng thử đồ 3D
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_OUTFITS.map((preset) => {
              const top = TOPS.find((t) => t.id === preset.topId);
              return (
                <div
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  className="group p-5 rounded-2xl bg-[#0E1526]/85 hover:bg-[#121A2E] border border-amber-500/20 hover:border-amber-400/60 shadow-lg hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-[#141E34] group-hover:scale-110 transition-transform">
                        {top?.icon || '👘'}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {preset.presetScore} ĐIỂM
                      </span>
                    </div>
                    <h4 className="font-serif-vi text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                    <span>Thử bản phối này</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Historical Eras & Dynasty Heritage */}
        <div className="mt-16 w-full p-6 sm:p-8 rounded-3xl bg-[#0E1526]/85 border border-amber-500/20 shadow-xl text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif-vi text-lg sm:text-xl font-bold text-amber-200">
                Dòng Thời Gian Di Sản & Triết Lý Ngũ Thân
              </h4>
              <p className="text-xs text-slate-400">
                Hành trình trang phục truyền thống Việt qua các triều đại lịch sử
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#131C2E] border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <span className="font-bold text-amber-300 block mb-1 text-sm">Thời Lý - Trần</span>
              <p className="text-slate-300 leading-relaxed">
                Áo giao lĩnh, thường phục cổ tròn, nét đẹp hào sảng Đông A và tinh thần Phật giáo thanh tịnh.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#131C2E] border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <span className="font-bold text-amber-300 block mb-1 text-sm">Thời Lê Trung Hưng</span>
              <p className="text-slate-300 leading-relaxed">
                Áo giao lĩnh cổ chéo, áo viên lĩnh hoàng triều với bổ tử uy nghi, văn hiến Thăng Long ngàn năm.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#131C2E] border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <span className="font-bold text-amber-300 block mb-1 text-sm">Triều Nguyễn (1802 - 1945)</span>
              <p className="text-slate-300 leading-relaxed">
                Đỉnh cao quy chuẩn quốc phục: Áo Ngũ Thân, Áo Tấc, Áo Nhật Bình rực rỡ hoa văn Thủy Ba và Phượng Cung.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#131C2E] border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <span className="font-bold text-amber-300 block mb-1 text-sm">Hiện Đại (Neo-Heritage)</span>
              <p className="text-slate-300 leading-relaxed">
                Cách tân phom dáng đương đại, ứng dụng công nghệ 3D và AI để Việt phục bước ra đời sống thường nhật.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <span>© 2026 Aura - Việt phục Remix • Dự án bảo tồn & phát triển trang phục di sản</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Layers className="w-3.5 h-3.5" />
            Tương thích hoàn hảo: Màn hình lớn (Laptop/PC) & Màn hình nhỏ (Điện thoại)
          </span>
        </div>
      </footer>
    </div>
  );
};
