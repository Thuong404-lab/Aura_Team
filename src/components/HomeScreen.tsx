import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  ChevronDown,
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
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';
import { AtmosphericEffects } from './AtmosphericEffects';
import { CloudCurtain } from './CloudCurtain';
import { HeroCloudDepthParallax } from './HeroCloudDepthParallax';
import { CulturalGarmentEncyclopedia } from './CulturalGarmentEncyclopedia';
import { HeritageMapSection } from './HeritageMapSection';
import { RegionalFashionDiversityMap } from './RegionalFashionDiversityMap';
import { HeritageCraftsmanshipStory } from './HeritageCraftsmanshipStory';
import { CulturalInteractiveQuiz } from './CulturalInteractiveQuiz';
import { useAppTheme } from '../context/ThemeContext';
import {
  BookOpen,
  Award,
  Compass,
  Layers,
  Heart,
  Palette,
  Eye,
  Info,
  Wind,
} from 'lucide-react';

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
  isPlayingMusic?: boolean;
  setIsPlayingMusic?: (val: boolean) => void;
  onSelectTopItem?: (topId: string) => void;
  isCloudCurtainActive?: boolean;
  onCloudCurtainChange?: (active: boolean) => void;
}

// 4 Ancient Imperial Secrets with interactive revelation
interface HeritageSecret {
  id: string;
  mysteryTitle: string;
  garmentName: string;
  dynasty: string;
  teaser: string;
  revealedSecret: string;
  significance: string;
  targetTopId: string;
  accentColor: string;
}

const HERITAGE_SECRETS: HeritageSecret[] = [
  {
    id: 'secret-ngu-than',
    mysteryTitle: 'Bí Mật Tà Áo Ngũ Thân & Đạo Nghĩa Ngũ Thường',
    garmentName: 'Áo Ngũ Thân Tay Chẽn',
    dynasty: 'Triều Nguyễn (1744 - 1945)',
    teaser: 'Vì sao chiếc áo lại được tạo tác từ 5 thân vải riêng biệt và 5 hạt cúc cài?',
    revealedSecret:
      '4 thân ngoài tượng trưng cho Tứ Thân Phụ Mẫu (cha mẹ mình và cha mẹ người phối ngẫu), thân thứ 5 lót kín bên trong tượng trưng cho chính bản thân người mặc được nâng niu. 5 hạt cúc xà cừ cài dọc sườn phải biểu trưng cho Ngũ Thường: Nhân, Nghĩa, Lễ, Trí, Tín - chuẩn mực cốt cách đạo đức người Việt.',
    significance: 'Thể hiện trọn vẹn chữ Hiếu với song thân và chữ Lễ trong đối nhân xử thế.',
    targetTopId: 'ngu-than',
    accentColor: '#D4AF37',
  },
  {
    id: 'secret-nhat-binh',
    mysteryTitle: 'Bí Mật Áo Nhật Bình & Hoa Văn Thủy Ba Hoàng Cung',
    garmentName: 'Áo Nhật Bình Hoàng Gia',
    dynasty: 'Triều Nguyễn (Cung Đình Huế)',
    teaser: 'Dải thêu chữ nhật trước ngực và dải tay ngũ sắc ẩn chứa mật mã quyền uy nào?',
    revealedSecret:
      'Áo Nhật Bình là pháp phục cao quý của Hoàng Thái Hậu, Hoàng Hậu, Công Chúa và phi tần. Cổ áo hình chữ nhật đối khâm thêu hoa cúc, phượng hoàng lộng lẫy. Dải tay áo ngũ hành (vàng, lục, lam, đỏ, trắng) đại diện cho đất trời vũ trụ. Dưới gấu áo là hoa văn Thủy Ba (sóng triều dâng) cầu chúc đất nước muôn năm thái bình, phúc trạch vô biên.',
    significance: 'Đỉnh cao của nghệ thuật thêu kim tuyến và nghi thức trang phục phụ nữ cung đình.',
    targetTopId: 'nhat-binh',
    accentColor: '#E65100',
  },
  {
    id: 'secret-ao-tac',
    mysteryTitle: 'Bí Mật Tay Thụ Áo Tấc & Nghi Lễ Quốc Gia',
    garmentName: 'Áo Tấc (Áo Lễ Tay Thụng)',
    dynasty: 'Triều Nguyễn',
    teaser: 'Tại sao tay áo phải may rộng đúng một tấc ta và rủ dài che kín đầu ngón tay?',
    revealedSecret:
      'Viền cổ áo rộng đúng một tấc (4cm), tay áo hình chữ nhật dài quá đầu ngón tay. Khi hành lễ tế trời đất, tổ tiên hay lễ nghi đại triều, người mặc khoanh tay trước ngực tạo thế đoan trang, khép kín, biểu trưng cho sự khiêm cung, kìm nén cái tôi cá nhân để hướng về cộng đồng và tổ tiên.',
    significance: 'Lễ phục trang trọng nhất dành cho các dịp đại lễ tế tự và hôn lễ truyền thống.',
    targetTopId: 'ao-tac',
    accentColor: '#C2185B',
  },
  {
    id: 'secret-giao-linh',
    mysteryTitle: 'Bí Mật Cổ Áo Giao Lĩnh & Hào Khí Đông A',
    garmentName: 'Áo Giao Lĩnh Thời Lê - Trần',
    dynasty: 'Thời Lý - Trần - Lê',
    teaser: 'Triết lý âm dương và tinh thần tự chủ ẩn sau đường vạt chéo tả hữu?',
    revealedSecret:
      'Vạt áo bên trái đè lên vạt bên phải (hữu nhậm) tạo thành chữ V cân đối trước ngực, biểu trưng cho nguyên lý Dương thuận Âm hòa của đất trời. Dáng áo rộng phóng khoáng, tà áo thướt tha phản ánh trọn vẹn hào khí độc lập, phóng khoáng của thời đại Đông A và văn hiến Thăng Long ngàn năm rực rỡ.',
    significance: 'Minh chứng cho nền văn minh phục sức tự chủ độc lập của các triều đại hưng thịnh.',
    targetTopId: 'giao-linh',
    accentColor: '#1976D2',
  },
];

// Interactive Dynasty Timeline Showcase
const DYNASTY_ERAS = [
  {
    id: 'ly-tran',
    name: 'Thời Lý - Trần',
    years: '1009 — 1400',
    headline: 'Hào Khí Đông A & Phật Giáo Hưng Thịnh',
    summary:
      'Áo giao lĩnh vạt chéo, thường phục cổ tròn, nét đẹp hào sảng khoáng đạt, ảnh hưởng tư tưởng Thiền tông thanh tịnh và tinh thần quật cường chống ngoại xâm.',
    garments: ['Áo Giao Lĩnh vạt rộng', 'Viên Lĩnh cổ tròn', 'Khăn quấn hoa sen'],
    palette: ['Chàm thẫm', 'Vàng hoàng thổ', 'Nâu sồng thanh tịnh'],
  },
  {
    id: 'le-trung-hung',
    name: 'Thời Lê Sơ & Trung Hưng',
    years: '1428 — 1789',
    headline: 'Khuôn Phép Lễ Nghi & Văn Hiến Thăng Long',
    summary:
      'Hệ thống phẩm phục chặt chẽ với Bổ tử thêu chim muông muông thú, áo viên lĩnh hoàng triều uy nghi, thể hiện sự định hình vững chắc của Nho học và thể chế cung đình.',
    garments: ['Áo Viên Lĩnh Bổ Tử', 'Giao Lĩnh quý tộc', 'Mũ Ô Sa triều thần'],
    palette: ['Đỏ thắm son', 'Xanh lam bích', 'Tím thược dược'],
  },
  {
    id: 'trieu-nguyen',
    name: 'Triều Nguyễn',
    years: '1802 — 1945',
    headline: 'Đỉnh Cao Quy Chuẩn & Định Hình Quốc Phục',
    summary:
      'Vua Minh Mạng thống nhất y phục toàn quốc năm 1836. Áo Ngũ Thân tay chẽn, Áo Tấc và Áo Nhật Bình trở thành biểu tượng bản sắc dân tộc không thể trộn lẫn.',
    garments: ['Áo Ngũ Thân tay chẽn', 'Áo Nhật Bình', 'Áo Tấc đại lễ', 'Khăn đóng/Mấn'],
    palette: ['Hoàng yến', 'Đỏ điều', 'Xanh ngọc bảo', 'Tím hoa cà'],
  },
  {
    id: 'neo-heritage',
    name: 'Việt Phục Đương Đại',
    years: 'Thế kỷ XXI',
    headline: 'Giao Thoa Di Sản & Nhịp Sống Hiện Đại',
    summary:
      'Cách tân phom dáng đương đại, kết hợp tà áo năm thân cùng chân váy xếp ly, chất liệu linen mát nhẹ, ứng dụng AI để đưa di sản bước ra phố phường.',
    garments: ['Ngũ Thân phối Chân váy', 'Nhật Bình cách tân', 'Phụ kiện tối giản'],
    palette: ['Vàng cát ánh kim', 'Xanh ngọc đương đại', 'Đen huyền bí'],
  },
];

// Framer Motion Animation Variants for Sequential Fade-in & Slide-up
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const slideUpFadeVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardStaggerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartFitting,
  onApplyPreset,
  onApplyAiSuggestion,
  isPlayingMusic,
  setIsPlayingMusic,
  onSelectTopItem,
  isCloudCurtainActive,
  onCloudCurtainChange,
}) => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  const [promptInput, setPromptInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiSuggestionResult | null>(null);

  // Cloud Intro Curtain overlay state (Full-screen clouds covering and parting on entrance)
  const isCloudIntroOpen = isCloudCurtainActive !== undefined ? isCloudCurtainActive : true;
  const setCloudIntroOpen = (val: boolean) => {
    onCloudCurtainChange?.(val);
  };

  // Active revealed secrets (set of secret IDs)
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({
    'secret-ngu-than': true, // Open the first secret by default to immediately hook the user
  });

  // Active Dynasty Tab
  const [activeDynastyId, setActiveDynastyId] = useState<string>('trieu-nguyen');

  const toggleSecret = (secretId: string) => {
    soundEngine.playPluck(440);
    setRevealedSecrets((prev) => ({
      ...prev,
      [secretId]: !prev[secretId],
    }));
  };

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

  const applySecretTopAndGo = (topId: string) => {
    soundEngine.playPluck(523.25);
    const matchingPreset =
      PRESET_OUTFITS.find((p) => p.topId === topId) || PRESET_OUTFITS[0];
    onApplyPreset(matchingPreset);
  };

  const activeDynasty =
    DYNASTY_ERAS.find((d) => d.id === activeDynastyId) || DYNASTY_ERAS[2];

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans-vi transition-colors duration-300 ${
      isCream ? 'bg-[#FAF7F0] text-stone-900' : 'bg-[#080C16] text-slate-100'
    }`}>
      
      {/* 0. FULL-SCREEN CLOUD CURTAIN ANIMATION (FRAMER MOTION) */}
      <CloudCurtain
        isOpen={isCloudIntroOpen}
        onRevealed={() => setCloudIntroOpen(false)}
        onClose={() => setCloudIntroOpen(false)}
      />

      {/* 1. DEDICATED ATMOSPHERIC EFFECTS OVERLAY (GOLD PARTICLES & MIST) */}
      <AtmosphericEffects positioning="fixed" intensity="mystic" />

      {/* 2. HERO CLOUD DEPTH PARALLAX (CUỘN CON LĂN CHUỘT MÂY BAY RA THEO CHIỀU SÂU) */}
      <HeroCloudDepthParallax />

      {/* 3. ATMOSPHERIC GEOMETRY & TRADITIONAL MOTIFS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft imperial vignette */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isCream ? 'opacity-0' : 'bg-radial-at-t from-[#152238]/60 via-[#0A0F1E] to-[#050811]'
        }`} />

        {/* Ambient halos */}
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Traditional Dong Son Drum Mandala watermarks with slow rotational grandeur */}
        <div className="absolute -top-24 -right-24 opacity-25">
          <DongSonDrumMandala className="w-[620px] h-[620px]" opacity={0.3} animated={true} glow={true} speed={0.4} />
        </div>
        <div className="absolute -bottom-36 -left-36 opacity-25">
          <DongSonDrumMandala className="w-[520px] h-[520px]" opacity={0.3} animated={true} glow={true} speed={0.3} />
        </div>

        {/* Co Phong Cloud wisps (Hiện rõ bồng bềnh, mờ ảo) */}
        <div className="absolute top-28 left-6 opacity-60">
          <CoPhongCloud className="w-72 h-40 drop-shadow-[0_8px_20px_rgba(245,158,11,0.25)]" />
        </div>
        <div className="absolute top-80 right-8 opacity-65">
          <CoPhongCloud className="w-80 h-44 drop-shadow-[0_8px_20px_rgba(245,158,11,0.25)]" flipX />
        </div>
        <div className="absolute bottom-96 left-12 opacity-50">
          <CoPhongCloud className="w-64 h-36 drop-shadow-[0_8px_20px_rgba(245,158,11,0.2)]" />
        </div>
        <div className="absolute bottom-40 right-16 opacity-55">
          <CoPhongCloud className="w-72 h-40 drop-shadow-[0_8px_20px_rgba(245,158,11,0.2)]" flipX />
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA: SEQUENTIAL FRAMER MOTION ENTRANCE */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={isCloudIntroOpen ? 'hidden' : 'visible'}
        className={`relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10 md:py-16 text-center max-w-6xl mx-auto w-full will-change-transform transition-opacity duration-1000 ${
          isCloudIntroOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* 4.1 WELCOME HERO SECTION: BƯỚC VÀO THẾ GIỚI THỜI TRANG */}
        <section className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full mb-16 pt-2">
          
          {/* Editorial Kicker (Zero-Pill Discipline, Sequential Slide Up) */}
          <motion.div
            variants={slideUpFadeVariants}
            className={`flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase font-semibold mb-5 select-none ${
              isCream ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full animate-ping inline-block ${
              isCream ? 'bg-amber-600' : 'bg-amber-400'
            }`} />
            <span>KHAI MỞ CỔNG DI SẢN</span>
            <span className={isCream ? 'text-amber-700/60' : 'text-amber-500/60'}>·</span>
            <span>AURA — CUNG ĐIỆN VIỆT PHỤC</span>
            <span className={isCream ? 'text-amber-700/60' : 'text-amber-500/60'}>·</span>
            <span className={isCream ? 'text-amber-900 font-bold' : 'text-amber-300'}>CÔNG NGHỆ 2D & AI</span>
          </motion.div>

          {/* Majestic Hero Headline (Sequential Fade & Scale-Up) */}
          <motion.h1
            variants={heroTitleVariants}
            className={`font-serif-vi text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.12] tracking-tight mb-6 drop-shadow-md ${
              isCream ? 'text-amber-950' : 'text-amber-100'
            }`}
          >
            Aura — Cung Điện Việt Phục
            <span className={`block text-xl sm:text-3xl md:text-4xl font-normal mt-3 font-serif-vi ${
              isCream ? 'text-stone-800' : 'text-slate-200'
            }`}>
              Nơi Di Sản Hoàng Triều Bừng Sáng Trong{' '}
              <span className={`${isCream ? 'text-amber-800 font-bold' : 'text-amber-300'} italic font-medium`}>Nhịp Thở Đương Đại</span>
            </span>
          </motion.h1>

          {/* Narrative Subtitle (Sequential Slide Up) */}
          <motion.p
            variants={slideUpFadeVariants}
            className={`text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-sans-vi ${
              isCream ? 'text-stone-700 font-normal' : 'text-slate-300 font-light'
            }`}
          >
            Bước vào không gian phục sức cung đình nghìn năm tuổi. Khám phá các bí mật triều đại,
            thử nghiệm phối phục 2D sống động và giải mã vẻ đẹp ngũ hành cùng trí tuệ nhân tạo.
          </motion.p>

          {/* Grand CTA Actions (Sequential Motion with Interactive Cultural Navigation) */}
          <motion.div
            variants={slideUpFadeVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mb-8"
          >
            {/* 2D Fitting Room CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playPluck(587.33);
                onStartFitting();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-[0_10px_36px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_48px_rgba(245,158,11,0.6)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-amber-200/60 font-sans-vi"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>PHÒNG THỬ PHỤC SỨC 2D</span>
            </motion.button>

            {/* Encyclopedia Heritage Anchor */}
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#encyclopedia-section"
              onClick={() => soundEngine.playPluck(523.25)}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md ${
                isCream
                  ? 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300/80 shadow-sm'
                  : 'text-amber-200 bg-[#121A2D]/90 hover:bg-[#18233C] border border-amber-500/40'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
              <span>BÁCH KHOA VIỆT PHỤC</span>
            </motion.a>
          </motion.div>

          {/* Quick feature pill linking to the 2 primary actions */}
          <motion.div
            variants={slideUpFadeVariants}
            className={`flex items-center gap-2 mb-8 text-xs px-4 py-1.5 rounded-full border shadow-xs ${
              isCream
                ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300/90'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Không gian 2D: Chấm điểm & Đánh giá (AI) • Soạn thảo & Tải Poster Lookbook HD</span>
          </motion.div>
          {/* Cultural Heritage Trust Indicators (Highlighting Diversity, Authenticity, Philosophy) */}
          <motion.div
            variants={slideUpFadeVariants}
            className={`w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t text-left mb-6 ${
              isCream ? 'border-amber-900/10' : 'border-amber-500/15'
            }`}
          >
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
              isCream ? 'bg-white/95 border-amber-200/90 shadow-xs' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <Compass className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className={`text-xs font-bold block ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>Đa Dạng 3 Miền</span>
                <span className={`text-[10px] ${isCream ? 'text-stone-600 font-medium' : 'text-slate-400'}`}>Bắc — Trung — Nam</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
              isCream ? 'bg-white/95 border-amber-200/90 shadow-xs' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <Layers className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className={`text-xs font-bold block ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>Quy Thức Triều Đình</span>
                <span className={`text-[10px] ${isCream ? 'text-stone-600 font-medium' : 'text-slate-400'}`}>Phục nguyên chuẩn xác</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
              isCream ? 'bg-white/95 border-amber-200/90 shadow-xs' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <Palette className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className={`text-xs font-bold block ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>Tơ Lụa & Gấm Vóc</span>
                <span className={`text-[10px] ${isCream ? 'text-stone-600 font-medium' : 'text-slate-400'}`}>100% Nhuộm thảo mộc</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
              isCream ? 'bg-white/95 border-amber-200/90 shadow-xs' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <span className={`text-xs font-bold block ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>Khảo Cứu Lịch Sử</span>
                <span className={`text-[10px] ${isCream ? 'text-stone-600 font-medium' : 'text-slate-400'}`}>Di sản ngàn năm văn hiến</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4.2 INTERACTIVE ENCYCLOPEDIA OF CULTURAL GARMENTS (BÁCH KHOA TOÀN THƯ VIỆT PHỤC) */}
        <CulturalGarmentEncyclopedia
          onSelectGarmentForFitting={(topId) => {
            if (onSelectTopItem) {
              onSelectTopItem(topId);
            } else {
              applySecretTopAndGo(topId);
            }
          }}
        />

        {/* 4.3 THE SECRET DISCOVERY REALM: HÉ LỘ NHIỀU BÍ MẬT DI SẢN */}
        <motion.section
          variants={slideUpFadeVariants}
          id="secrets-section"
          className="w-full text-left my-10 pt-10 border-t border-amber-500/20"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className={`text-xs font-bold tracking-[0.25em] uppercase font-serif-vi ${
                  isCream ? 'text-amber-800' : 'text-amber-400/90'
                }`}>
                  KHO TÀNG CUNG ĐÌNH
                </span>
              </div>
              <h2 className={`font-serif-vi text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
                isCream ? 'text-stone-900' : 'text-amber-100'
              }`}>
                Hé Lộ Bí Mật Cổ Phục Nghìn Năm
              </h2>
            </div>
            <p className={`text-xs sm:text-sm max-w-md leading-relaxed ${
              isCream ? 'text-stone-700 font-normal' : 'text-slate-300/85 font-light'
            }`}>
              Mỗi nếp áo, hạt cúc hay dải thêu đều cất giấu những mật mã văn hóa và vũ trụ quan của tiền nhân.
              Nhấp để mở từng hộp điển tịch và trải nghiệm phục sức ngay.
            </p>
          </div>

          {/* 4 Interactive Imperial Secret Cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {HERITAGE_SECRETS.map((secret, index) => {
              const isRevealed = !!revealedSecrets[secret.id];
              const garment = TOPS.find((t) => t.id === secret.targetTopId);

              return (
                <motion.div
                  key={secret.id}
                  variants={cardStaggerVariants}
                  className={`group rounded-2xl transition-all duration-300 relative overflow-hidden backdrop-blur-xl border flex flex-col ${
                    isRevealed
                      ? isCream
                        ? 'bg-white border-amber-300 shadow-[0_12px_40px_rgba(180,130,60,0.12)]'
                        : 'bg-gradient-to-b from-[#11192E] via-[#0E1528] to-[#0A0F1E] border-amber-400/50 shadow-[0_12px_40px_rgba(245,158,11,0.16)]'
                      : isCream
                        ? 'bg-white hover:bg-[#FFFDF8] border-stone-200 hover:border-amber-400/60 shadow-xs hover:shadow-md'
                        : 'bg-gradient-to-b from-[#0D1424]/90 to-[#090E1A]/95 hover:bg-[#11192E] border-slate-700/60 hover:border-amber-400/40 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Subtle top ambient glow */}
                  <div
                    className="absolute top-0 right-0 w-48 h-32 opacity-20 pointer-events-none rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-35"
                    style={{ background: secret.accentColor }}
                  />

                  {/* Header Bar: Number + Dynasty + Toggle */}
                  <div
                    onClick={() => toggleSecret(secret.id)}
                    className="p-5 sm:p-6 pb-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-serif-vi font-bold text-sm ${isCream ? 'text-amber-800' : 'text-amber-400'}`}>
                          {`0${index + 1}`}
                        </span>
                        <span className={isCream ? 'text-stone-300' : 'text-slate-600'}>/</span>
                        <span className={`tracking-wide font-medium ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                          {secret.dynasty}
                        </span>
                      </div>

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSecret(secret.id);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                          isRevealed
                            ? isCream
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-amber-400/15 text-amber-300 border border-amber-400/40 hover:bg-amber-400/25'
                            : isCream
                              ? 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-amber-50 hover:text-amber-900'
                              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:text-amber-300 hover:border-amber-400/50'
                        }`}
                      >
                        <span>{isRevealed ? 'Thu gọn' : 'Khai mở bí mật'}</span>
                        <motion.span
                          animate={{ rotate: isRevealed ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="inline-block"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </button>
                    </div>

                    {/* Main Title & Garment Thumbnail */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-serif-vi text-xl sm:text-2xl font-bold transition-colors ${
                          isCream ? 'text-stone-900 group-hover:text-amber-800' : 'text-amber-100 group-hover:text-amber-200'
                        }`}>
                          {secret.garmentName}
                        </h3>
                        <p className={`text-xs font-semibold mt-0.5 tracking-wide ${
                          isCream ? 'text-amber-800' : 'text-amber-300/80'
                        }`}>
                          {secret.mysteryTitle}
                        </p>
                      </div>

                      {/* Garment Image Thumbnail with Fallback Icon */}
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border flex-shrink-0 shadow-md relative group/img flex items-center justify-center ${
                        isCream ? 'bg-amber-50 border-amber-300' : 'bg-slate-900 border-amber-500/30'
                      }`}>
                        {garment?.imageUrl && (
                          <img
                            src={garment.imageUrl}
                            alt={secret.garmentName}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 z-10"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-2xl select-none absolute z-0 opacity-80">
                          {garment?.icon || '👘'}
                        </span>
                      </div>
                    </div>

                    {/* Teaser Question in Quote Style with High Contrast */}
                    <div className={`mt-3.5 text-xs italic pl-3 py-1.5 rounded-r-lg border-l-3 ${
                      isCream
                        ? 'text-stone-800 bg-amber-50/90 border-amber-500 font-medium'
                        : 'text-slate-300/90 border-amber-400/50 bg-amber-500/5'
                    }`}>
                      "{secret.teaser}"
                    </div>
                  </div>

                  {/* Revealed Content Drawer */}
                  <AnimatePresence initial={false}>
                    {isRevealed && (
                      <motion.div
                        key="revealed-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className={`overflow-hidden border-t ${isCream ? 'border-amber-200' : 'border-amber-500/20'}`}
                      >
                        <div className={`p-5 sm:p-6 pt-4 space-y-4 ${isCream ? 'bg-[#FFFDF9]' : 'bg-slate-950/40'}`}>
                          {/* Secret Explanation */}
                          <div className="space-y-1.5">
                            <span className={`text-[11px] font-bold tracking-wider uppercase block font-serif-vi ${
                              isCream ? 'text-amber-800' : 'text-amber-400'
                            }`}>
                              Hé lộ mật mã
                            </span>
                            <p className={`text-xs sm:text-sm leading-relaxed font-sans-vi ${
                              isCream ? 'text-stone-800' : 'text-slate-200'
                            }`}>
                              {secret.revealedSecret}
                            </p>
                          </div>

                          {/* Philosophical Significance Card */}
                          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                            isCream
                              ? 'bg-amber-50 border-amber-200 text-stone-800'
                              : 'bg-amber-500/10 border-amber-500/25 text-amber-200/95'
                          }`}>
                            <span className={`text-base leading-none mt-0.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`}>✦</span>
                            <div className={`text-xs leading-relaxed ${isCream ? 'text-stone-800' : 'text-amber-200/95'}`}>
                              <strong className={`font-semibold font-serif-vi mr-1 ${isCream ? 'text-amber-900 font-bold' : 'text-amber-100'}`}>
                                Ý nghĩa triết lý:
                              </strong>
                              {secret.significance}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer Action Bar */}
                  <div className={`p-4 sm:p-5 pt-3 border-t flex items-center justify-between gap-3 mt-auto ${
                    isCream ? 'bg-[#FAF7F0] border-stone-200' : 'border-slate-800/80 bg-slate-950/30'
                  }`}>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Phòng thử phục sắc 2D
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        applySecretTopAndGo(secret.targetTopId);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-[0_4px_14px_rgba(245,158,11,0.3)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all"
                    >
                      <span>Thử Dáng Áo Này</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>



        {/* 4.5 INTERACTIVE DYNASTY CHRONOLOGY: BIÊN NIÊN SỬ TRIỀU ĐẠI */}
        <motion.section
          variants={slideUpFadeVariants}
          className={`w-full my-12 p-6 sm:p-8 rounded-3xl border shadow-xl text-left ${
            isCream ? 'bg-white border-amber-200/90 shadow-[0_4px_24px_rgba(180,130,60,0.08)]' : 'bg-[#0E1526]/85 border-amber-500/25'
          }`}
        >
          <div className="mb-6">
            <span className={`text-xs font-bold tracking-[0.2em] uppercase block mb-1 ${
              isCream ? 'text-amber-800' : 'text-amber-400'
            }`}>
              DÒNG THỜI GIAN DI SẢN
            </span>
            <h3 className={`font-serif-vi text-2xl sm:text-3xl font-bold ${
              isCream ? 'text-stone-900' : 'text-amber-100'
            }`}>
              Biên Niên Sử Phục Sức Việt Qua Các Triều Đại
            </h3>
            <p className={`text-xs mt-1 font-light ${
              isCream ? 'text-stone-600' : 'text-slate-400'
            }`}>
              Mỗi giai đoạn lịch sử ghi dấu một bước chuyển mình của văn hóa trang phục Việt Nam
            </p>
          </div>

          {/* Dynasty Interactive Tabs */}
          <div className={`flex flex-wrap gap-2 mb-6 border-b pb-4 ${
            isCream ? 'border-stone-200' : 'border-slate-700/60'
          }`}>
            {DYNASTY_ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  soundEngine.playPluck(392);
                  setActiveDynastyId(era.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDynastyId === era.id
                    ? isCream
                      ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
                    : isCream
                    ? 'bg-stone-50 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                    : 'bg-[#121A2E] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {era.name}
              </button>
            ))}
          </div>

          {/* Active Dynasty Spotlight Detail with Smooth Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDynasty.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className={`p-5 sm:p-6 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-6 ${
                isCream ? 'bg-[#FFFDF9] border-amber-200/90 shadow-xs' : 'bg-[#121B30] border-amber-500/20'
              }`}
            >
              <div className="md:col-span-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 className={`font-serif-vi text-xl font-bold ${
                    isCream ? 'text-amber-900' : 'text-amber-200'
                  }`}>
                    {activeDynasty.name}
                  </h4>
                  <span className={`text-xs font-mono ${
                    isCream ? 'text-amber-800' : 'text-amber-400/80'
                  }`}>
                    ({activeDynasty.years})
                  </span>
                </div>
                <h5 className={`text-sm font-semibold mb-3 ${
                  isCream ? 'text-stone-800' : 'text-slate-200'
                }`}>
                  {activeDynasty.headline}
                </h5>
                <p className={`text-xs sm:text-sm leading-relaxed font-light mb-4 ${
                  isCream ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  {activeDynasty.summary}
                </p>

                {/* Garments & Textures */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`font-medium ${isCream ? 'text-amber-900' : 'text-amber-400'}`}>Trang phục tiêu biểu:</span>
                  {activeDynasty.garments.map((g, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md border ${
                        isCream
                          ? 'bg-amber-50/80 text-stone-800 border-amber-200'
                          : 'text-slate-200 bg-[#0E1526] border-slate-700'
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 text-xs ${
                isCream ? 'border-stone-200' : 'border-slate-700/60'
              }`}>
                <div>
                  <span className={`block mb-2 font-medium ${isCream ? 'text-stone-700' : 'text-slate-400'}`}>Bảng Sắc Màu Đặc Trưng:</span>
                  <div className={`flex flex-col gap-1.5 ${isCream ? 'text-stone-800' : 'text-slate-300'}`}>
                    {activeDynasty.palette.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${isCream ? 'border-stone-200' : 'border-slate-700/60'}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playPluck(523.25);
                      onStartFitting();
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Khám phá trong phòng thử</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* 4.6 INTERACTIVE HERITAGE MAP (BẢN ĐỒ DI SẢN KHỞI NGUYÊN) */}
        <HeritageMapSection
          onStartFitting={onStartFitting}
          onSelectTopItem={onSelectTopItem}
          onApplyPreset={onApplyPreset}
        />

        {/* REGIONAL TRADITIONS (BẢN ĐỒ VĂN HÓA 3 MIỀN BẮC - TRUNG - NAM) */}
        <RegionalFashionDiversityMap />

        {/* 4.7 TRADITIONAL WEAVING & DYEING CRAFTSMANSHIP (TINH HOA CHẤT LIỆU TƠ TẰM & GẤM VÓC) */}
        <HeritageCraftsmanshipStory />

        {/* 4.8 INTERACTIVE CULTURAL QUIZ (THỬ TÀI HIỂU BIẾT CỔ PHỤC) */}
        <CulturalInteractiveQuiz />

      </motion.main>

      {/* 5. CULTURAL HERITAGE EDUCATIONAL FOOTER */}
      <footer className={`relative z-10 w-full border-t text-xs transition-colors ${
        isCream ? 'bg-[#F4EFE6] border-amber-900/10 text-stone-700' : 'bg-[#070B14] border-amber-500/20 text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`font-serif-vi font-bold text-xl ${isCream ? 'text-amber-800' : 'text-amber-300'}`}>
                AURA — CUNG ĐIỆN VIỆT PHỤC
              </span>
            </div>
            <p className={`text-xs leading-relaxed font-light ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
              Dự án số hóa và lan tỏa vẻ đẹp cổ phục Việt Nam phi lợi nhuận. Tôn vinh bề dày văn hiến, kỹ nghệ dệt thêu cổ truyền và triết lý thẩm mỹ phương Đông qua góc nhìn công nghệ tương tác 2D.
            </p>
            <div className={`flex items-center gap-3 font-medium ${isCream ? 'text-amber-800' : 'text-amber-400'}`}>
              <Award className="w-4 h-4" />
              <span>Bảo Tàng Số Hóa Trang Phục Dân Tộc</span>
            </div>
          </div>

          {/* Cultural Eras */}
          <div className="space-y-3">
            <h4 className={`font-serif-vi font-bold uppercase tracking-wider text-xs ${isCream ? 'text-amber-900' : 'text-amber-200'}`}>
              Các Triều Đại Tiêu Biểu
            </h4>
            <div className={`space-y-2 ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
              <div>• <strong>Thời Lý — Trần:</strong> Hào khí Đông A, Giao Lĩnh phóng khoáng</div>
              <div>• <strong>Thời Lê Sơ & Trung Hưng:</strong> Viên Lĩnh Bổ Tử, khuôn phép lễ nghi</div>
              <div>• <strong>Triều Nguyễn:</strong> Nhật Bình, Ngũ Thân & định hình quốc phục</div>
              <div>• <strong>Dân gian Bắc Bộ:</strong> Áo Tứ Thân Kinh Bắc, nón quai thao</div>
            </div>
          </div>

          {/* Research & Sources */}
          <div className="space-y-3">
            <h4 className={`font-serif-vi font-bold uppercase tracking-wider text-xs ${isCream ? 'text-amber-900' : 'text-amber-200'}`}>
              Tài Liệu Khảo Cứu
            </h4>
            <ul className={`space-y-1.5 ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
              <li>• Khâm Định Đại Nam Hội Điển Sự Lệ</li>
              <li>• Ngàn Năm Áo Mũ (Trần Quang Đức)</li>
              <li>• Nghiên cứu phục dựng cổ phong Việt Nam</li>
              <li>• Tư liệu Cố cung Huế & Viện Viễn Đông Bác Cổ</li>
            </ul>
          </div>

          {/* Interactive Capabilities */}
          <div className="space-y-3">
            <h4 className={`font-serif-vi font-bold uppercase tracking-wider text-xs ${isCream ? 'text-amber-900' : 'text-amber-200'}`}>
              Không Gian Trải Nghiệm
            </h4>
            <div className="space-y-2">
              <p className={`text-xs leading-relaxed font-light ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                Trang bị công nghệ mô phỏng phục trang đa lớp, phân tích ngũ hành hòa hợp và tôn vinh bản sắc di sản văn hóa thuần Việt.
              </p>
              <div className={`pt-2 text-[11px] font-medium ${isCream ? 'text-amber-800' : 'text-amber-400/90'}`}>
                ✨ Trải nghiệm hoàn toàn phi thương mại, tôn vinh văn hóa cội nguồn
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={`max-w-7xl mx-auto px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
          isCream ? 'border-amber-900/10 text-stone-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <span>© 2026 Aura — Cung Điện Việt Phục. Tinh hoa di sản hoàng triều ngàn năm.</span>
          <span className={`font-medium ${isCream ? 'text-amber-800' : 'text-amber-400/90'}`}>
            Tự hào lan tỏa trang phục truyền thống Việt Nam đến bạn bè năm châu
          </span>
        </div>
      </footer>
    </div>
  );
};
