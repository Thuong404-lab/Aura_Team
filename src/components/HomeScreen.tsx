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
  BookOpen
} from 'lucide-react';
import { PROMPT_SUGGESTIONS, PRESET_OUTFITS, TOPS, BOTTOMS, ACCESSORIES, PresetOutfit } from '../data/vietPhucData';
import { soundEngine } from '../utils/audioSynth';

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
  const [aiResult, setAiResult] = useState<{
    recommendedTopId: string;
    recommendedBottomId: string;
    recommendedAccessoryId: string;
    conceptTitle: string;
    characterPersona: string;
    aiAdvice: string;
    culturalNote: string;
    colorScheme?: string;
  } | null>(null);

  const handleAiSuggest = async (overridePrompt?: string) => {
    const text = overridePrompt || promptInput;
    if (!text.trim()) return;

    soundEngine.playPluck(440);
    setIsAiLoading(true);
    setAiResult(null);

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResult(data.data);
      } else {
        throw new Error('Fallback suggestion');
      }
    } catch {
      // Graceful instant fallback
      setAiResult({
        recommendedTopId: 'ngu-than',
        recommendedBottomId: 'quan-ong-so',
        recommendedAccessoryId: 'khan-dong',
        conceptTitle: 'Thu Nhật Kinh Kỳ',
        characterPersona: 'Sĩ tử Thăng Long thanh nhã ung dung',
        aiAdvice: `Bản phối Áo Ngũ Thân kết hợp Quần Lụa Bạch và Khăn Đóng rất thích hợp cho yêu cầu "${text}". Phom dáng gọn gàng, kín đáo, đậm đà phong vị văn hiến.`,
        culturalNote: 'Ngũ thân tượng trưng cho đạo làm người với 5 thân áo và 5 đức tính cao đẹp.',
        colorScheme: 'Men lam phối lụa bạch tơ tằm',
      });
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

  const toggleSound = () => {
    soundEngine.toggleAmbiance((playing) => setIsPlayingMusic(playing));
  };

  return (
    <div className="relative min-h-screen bg-parchment flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Traditional Patterns & Corner Flourishes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8B1E1E]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#1F4E5B]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B1E1E] to-[#5C1414] text-[#FDFBF7] flex items-center justify-center font-cinzel text-xl font-bold shadow-md border border-[#D4AF37]/40">
            VP
          </div>
          <div>
            <span className="font-serif-vi text-xl font-bold text-[#8B1E1E] tracking-wide block leading-none">
              Sáng Tạo Cùng Việt Phục
            </span>
            <span className="text-[10px] tracking-[0.25em] text-stone-500 uppercase font-medium mt-1 block">
              Heritage • AI Styling • Digital Lookbook
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
              isPlayingMusic
                ? 'bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm'
                : 'bg-white/80 text-stone-700 hover:bg-white border-stone-200'
            }`}
            title="Bật/Tắt âm hưởng Đàn Tranh"
          >
            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isPlayingMusic ? 'Nhã nhạc: Bật' : 'Nhã nhạc: Tắt'}</span>
          </button>

          <button
            onClick={onStartFitting}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#8B1E1E] to-[#6A1616] hover:from-black hover:to-[#2A1616] transition-all shadow-md hover:scale-105"
          >
            Vào Phòng Thử
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION (Trung Tâm - Giao Diện Laptop) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center max-w-5xl mx-auto w-full">
        {/* Heritage Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-xs mb-6 animate-in fade-in duration-700">
          <span className="w-2 h-2 rounded-full bg-[#8B1E1E]" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8B1E1E]">
            DI SẢN NGHÌN NĂM THĂNG LONG - CỐ ĐÔ HUẾ
          </span>
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
        </div>

        {/* Tiêu đề lớn theo yêu cầu */}
        <h1 className="font-serif-vi text-4xl sm:text-6xl md:text-7xl font-bold text-[#8B1E1E] leading-[1.12] tracking-tight mb-6 max-w-4xl drop-shadow-xs">
          Sáng tạo cùng Việt phục
          <span className="block text-2xl sm:text-4xl md:text-5xl font-normal text-stone-800 mt-3 font-serif-vi">
            Giao thoa giữa <span className="text-[#8B1E1E] italic font-medium">Truyền thống</span> và{' '}
            <span className="text-[#B4821A] italic font-medium">Hiện đại</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-stone-600 max-w-2xl mb-10 leading-relaxed font-sans-vi">
          Khám phá tinh hoa trang phục các triều đại Lý, Lê, Nguyễn qua mô hình ảo 3D,
          nhận đánh giá chuẩn mực văn hóa từ Trợ lý AI và tạo ảnh Lookbook cá nhân phong cách tạp chí thời trang.
        </p>

        {/* Nút hành động nổi bật "BẮT ĐẦU PHỐI ĐỒ" */}
        <div className="mb-14 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => {
              soundEngine.playPluck(523.25);
              onStartFitting();
            }}
            className="group relative px-12 py-5 rounded-full text-base sm:text-lg font-bold tracking-[0.2em] uppercase text-white bg-gradient-to-r from-[#8B1E1E] via-[#A32222] to-[#B4821A] shadow-2xl hover:shadow-[#8B1E1E]/30 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-[#FDE68A]/30 cursor-pointer"
          >
            <Shirt className="w-5 h-5 text-[#FDE68A] group-hover:rotate-12 transition-transform" />
            <span>BẮT ĐẦU PHỐI ĐỒ</span>
            <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* THANH CÔNG CỤ: "TRỢ LÝ AI PHỐI ĐỒ" */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="glass-imperial p-2.5 sm:p-3 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/35 relative">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 w-full sm:w-auto px-3 py-2 text-[#8B1E1E]">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B4821A] text-white flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-serif-vi font-bold text-sm tracking-wide hidden md:inline text-stone-900 whitespace-nowrap">
                  Trợ lý AI phối đồ:
                </span>
              </div>

              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                placeholder="Gợi ý cho tôi một bộ Việt phục đi dạo phố mùa thu..."
                className="w-full flex-1 bg-transparent px-3 py-2 text-stone-800 placeholder-stone-400 text-sm sm:text-base outline-none italic font-sans-vi"
              />

              <button
                onClick={() => handleAiSuggest()}
                disabled={isAiLoading}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#2C2420] to-[#8B1E1E] hover:from-[#8B1E1E] hover:to-[#A32222] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                    <span>AI đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Nhờ AI Gợi ý</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center gap-2 overflow-x-auto text-[11px] text-stone-600 px-2 pb-1">
              <span className="font-semibold text-stone-400 whitespace-nowrap flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#D4AF37]" /> Ý tưởng nhanh:
              </span>
              {PROMPT_SUGGESTIONS.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(prompt);
                    handleAiSuggest(prompt);
                  }}
                  className="px-2.5 py-1 rounded-full bg-stone-100/90 hover:bg-[#8B1E1E]/10 hover:text-[#8B1E1E] transition-all whitespace-nowrap truncate max-w-[240px] text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Result Card Modal / Drawer (Khi AI phản hồi) */}
        {aiResult && (
          <div className="mt-6 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-400 text-left">
            <div className="glass-imperial p-6 rounded-3xl border border-[#8B1E1E]/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B1E1E] block">
                      Gợi Ý Hoàn Hảo Từ Trợ Lý AI
                    </span>
                    <h3 className="font-serif-vi text-xl font-bold text-stone-900">
                      {aiResult.conceptTitle}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setAiResult(null)}
                  className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Persona Quote */}
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200 mb-4 text-xs italic text-stone-700 flex items-center gap-2">
                <span className="text-[#8B1E1E] font-bold font-serif-vi text-base">“</span>
                <span>{aiResult.characterPersona}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4 font-sans-vi">
                {aiResult.aiAdvice}
              </p>

              {aiResult.culturalNote && (
                <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-stone-800 mb-5 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-[#B4821A] shrink-0 mt-0.5" />
                  <span>
                    <strong>Điểm nhấn văn hóa: </strong>
                    {aiResult.culturalNote}
                  </span>
                </div>
              )}

              {/* Outfit Items Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="p-2.5 bg-white rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-medium block">Áo</span>
                  <span className="text-xs font-bold text-[#8B1E1E] truncate block mt-0.5">
                    {TOPS.find((t) => t.id === aiResult.recommendedTopId)?.name || 'Áo Ngũ Thân'}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-medium block">Quần / Váy</span>
                  <span className="text-xs font-bold text-stone-800 truncate block mt-0.5">
                    {BOTTOMS.find((b) => b.id === aiResult.recommendedBottomId)?.name || 'Quần Ống Sớ'}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 uppercase font-medium block">Phụ kiện</span>
                  <span className="text-xs font-bold text-stone-800 truncate block mt-0.5">
                    {ACCESSORIES.find((a) => a.id === aiResult.recommendedAccessoryId)?.name || 'Khăn Đóng'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setAiResult(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Đóng
                </button>
                <button
                  onClick={applyAiAndGo}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#8B1E1E] to-[#B4821A] hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Áp Dụng Vào Phòng Thử Ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4 Curated Preset Cards (Bộ sưu tập phối sẵn tiêu biểu) */}
        <div className="mt-16 w-full text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B1E1E]">
                CẢM HỨNG BỘ SƯU TẬP
              </span>
              <h3 className="font-serif-vi text-xl sm:text-2xl font-bold text-stone-900">
                Các bản phối mẫu kinh điển
              </h3>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Chọn một bộ để đưa trực tiếp vào phòng thử 3D
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_OUTFITS.map((preset) => {
              const top = TOPS.find((t) => t.id === preset.topId);
              return (
                <div
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  className="group p-5 rounded-3xl bg-white/80 hover:bg-white border border-stone-200 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-[#FAF7F2] group-hover:scale-110 transition-transform">
                        {top?.icon || '👘'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E]">
                        {preset.presetScore} ĐIỂM
                      </span>
                    </div>
                    <h4 className="font-serif-vi text-base font-bold text-stone-900 group-hover:text-[#8B1E1E] transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#8B1E1E] font-semibold">
                    <span>Thử bản phối này</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cultural Dynasty & Philosophy Section */}
        <div className="mt-16 w-full p-8 rounded-3xl bg-white/70 border border-stone-200/80 shadow-sm text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#B4821A]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif-vi text-lg font-bold text-stone-900">
                Dòng Thời Gian Di Sản & Triết Lý Ngũ Thân
              </h4>
              <p className="text-xs text-stone-500">
                Hành trình trang phục truyền thống Việt qua các triều đại lịch sử
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
              <span className="font-bold text-[#8B1E1E] block mb-1">Thời Lý - Trần</span>
              <p className="text-stone-600 leading-relaxed">
                Áo giao lĩnh, thường phục cổ tròn, nét đẹp hào sảng Đông A và tinh thần Phật giáo thanh tịnh.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
              <span className="font-bold text-[#8B1E1E] block mb-1">Thời Lê Trung Hưng</span>
              <p className="text-stone-600 leading-relaxed">
                Áo giao lĩnh cổ chéo, áo viên lĩnh hoàng triều với bổ tử uy nghi, văn hiến Thăng Long ngàn năm.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
              <span className="font-bold text-[#8B1E1E] block mb-1">Triều Nguyễn (1802 - 1945)</span>
              <p className="text-stone-600 leading-relaxed">
                Đỉnh cao quy chuẩn quốc phục: Áo Ngũ Thân, Áo Tấc, Áo Nhật Bình rực rỡ hoa văn Thủy Ba và Phượng Cung.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/60">
              <span className="font-bold text-[#B4821A] block mb-1">Hiện Đại (Neo-Heritage 2026)</span>
              <p className="text-stone-600 leading-relaxed">
                Cách tân phom dáng tối giản, ứng dụng công nghệ 3D và AI để Việt phục bước ra đời sống thường nhật.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-stone-200/70 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
        <span>© 2026 Sáng Tạo Cùng Việt Phục • Dự án bảo tồn & phát triển thời trang di sản</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#8B1E1E] font-medium">
            <Layers className="w-3.5 h-3.5" />
            3 Trải Nghiệm: Laptop • Tablet • Mobile Lookbook
          </span>
        </div>
      </footer>
    </div>
  );
};
