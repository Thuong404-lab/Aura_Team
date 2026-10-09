import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ArrowRight,
  Volume2,
  VolumeX,
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
import { CloudMotifGalleryModal } from './CloudMotifGalleryModal';
import { CulturalGarmentEncyclopedia } from './CulturalGarmentEncyclopedia';
import { RegionalFashionDiversityMap } from './RegionalFashionDiversityMap';
import { HeritageCraftsmanshipStory } from './HeritageCraftsmanshipStory';
import { CulturalInteractiveQuiz } from './CulturalInteractiveQuiz';
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
  isPlayingMusic: boolean;
  setIsPlayingMusic: (val: boolean) => void;
  onOpenSavedLibrary?: () => void;
  onOpenLoginModal?: () => void;
  savedCount?: number;
  onSelectTopItem?: (topId: string) => void;
  triggerCloudIntroCount?: number;
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
      'Cách tân phom dáng đương đại, kết hợp tà áo năm thân cùng chân váy xếp ly, chất liệu linen mát nhẹ, ứng dụng AI và 3D để đưa di sản bước ra phố phường.',
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
  onOpenSavedLibrary,
  onOpenLoginModal,
  savedCount = 0,
  onSelectTopItem,
  triggerCloudIntroCount,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiSuggestionResult | null>(null);

  // Cloud Intro Curtain overlay state (Full-screen clouds covering and parting on entrance)
  const [isCloudIntroOpen, setIsCloudIntroOpen] = useState<boolean>(true);
  const [isCloudGalleryOpen, setIsCloudGalleryOpen] = useState<boolean>(false);

  // Re-trigger cloud intro whenever requested externally
  React.useEffect(() => {
    if (triggerCloudIntroCount && triggerCloudIntroCount > 0) {
      setIsCloudIntroOpen(true);
    }
  }, [triggerCloudIntroCount]);

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
    <div className="relative min-h-screen w-full bg-[#080C16] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans-vi">
      
      {/* 0. FULL-SCREEN CLOUD CURTAIN ANIMATION (FRAMER MOTION) */}
      <CloudCurtain
        isOpen={isCloudIntroOpen}
        onRevealed={() => setIsCloudIntroOpen(false)}
        onClose={() => setIsCloudIntroOpen(false)}
      />

      {/* Cloud Motif Gallery Modal (Bảo Tàng 6 Mẫu Mây Cổ Phong) */}
      <CloudMotifGalleryModal
        isOpen={isCloudGalleryOpen}
        onClose={() => setIsCloudGalleryOpen(false)}
        onTriggerIntro={() => setIsCloudIntroOpen(true)}
      />

      {/* 1. DEDICATED ATMOSPHERIC EFFECTS OVERLAY (GOLD PARTICLES & MIST) */}
      <AtmosphericEffects positioning="fixed" intensity="mystic" />

      {/* 2. HERO 3D CLOUD DEPTH PARALLAX (CUỘN CON LĂN CHUỘT MÂY BAY RA THEO CHIỀU SÂU) */}
      <HeroCloudDepthParallax />

      {/* 3. ATMOSPHERIC GEOMETRY & TRADITIONAL MOTIFS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft imperial vignette */}
        <div className="absolute inset-0 bg-radial-at-t from-[#152238]/60 via-[#0A0F1E] to-[#050811]" />

        {/* Ambient halos */}
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-red-900/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Traditional Dong Son Drum Mandala watermarks */}
        <div className="absolute -top-24 -right-24 opacity-15">
          <DongSonDrumMandala className="w-[620px] h-[620px]" opacity={0.25} />
        </div>
        <div className="absolute -bottom-36 -left-36 opacity-20">
          <DongSonDrumMandala className="w-[520px] h-[520px]" opacity={0.3} />
        </div>

        {/* Co Phong Cloud wisps */}
        <div className="absolute top-36 left-8 opacity-25">
          <CoPhongCloud className="w-56 h-32" />
        </div>
        <div className="absolute top-96 right-12 opacity-25">
          <CoPhongCloud className="w-64 h-36" flipX />
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA: SEQUENTIAL FRAMER MOTION ENTRANCE */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-10 md:py-16 text-center max-w-6xl mx-auto w-full"
      >
        {/* 4.1 WELCOME HERO SECTION: BƯỚC VÀO THẾ GIỚI THỜI TRANG */}
        <section className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full mb-16 pt-2">
          
          {/* Editorial Kicker (Zero-Pill Discipline, Sequential Slide Up) */}
          <motion.div
            variants={slideUpFadeVariants}
            className="flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold mb-5 select-none"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span>KHAI MỞ CỔNG DI SẢN</span>
            <span className="text-amber-500/60">·</span>
            <span>THẾ GIỚI VIỆT PHỤC HOÀNG TRIỀU</span>
            <span className="text-amber-500/60">·</span>
            <span className="text-amber-300">CÔNG NGHỆ 3D & AI</span>
          </motion.div>

          {/* Majestic Hero Headline (Sequential Fade & Scale-Up) */}
          <motion.h1
            variants={heroTitleVariants}
            className="font-serif-vi text-4xl sm:text-6xl md:text-7xl font-bold text-amber-100 leading-[1.12] tracking-tight mb-6 drop-shadow-md"
          >
            Aura — Cung Điện Việt Phục
            <span className="block text-xl sm:text-3xl md:text-4xl font-normal text-slate-200 mt-3 font-serif-vi">
              Nơi Di Sản Hoàng Triều Bừng Sáng Trong{' '}
              <span className="text-amber-300 italic font-medium">Nhịp Thở Đương Đại</span>
            </span>
          </motion.h1>

          {/* Narrative Subtitle (Sequential Slide Up) */}
          <motion.p
            variants={slideUpFadeVariants}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed font-sans-vi font-light"
          >
            Bước vào không gian phục sức cung đình nghìn năm tuổi. Khám phá các bí mật triều đại,
            thử nghiệm phối phục 3D sống động và giải mã vẻ đẹp ngũ hành cùng trí tuệ nhân tạo.
          </motion.p>

          {/* Grand CTA Actions (Sequential Motion with Interactive Cultural Navigation) */}
          <motion.div
            variants={slideUpFadeVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xl mb-6"
          >
            {/* 3D Fitting Room CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playPluck(587.33);
                onStartFitting();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-[0_10px_36px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_48px_rgba(245,158,11,0.6)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer border border-amber-200/60 font-serif-vi"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>PHÒNG THỬ PHỤC SỨC 3D</span>
            </motion.button>

            {/* Encyclopedia Heritage Anchor */}
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#encyclopedia-section"
              onClick={() => soundEngine.playPluck(523.25)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase text-amber-200 bg-[#121A2D]/90 hover:bg-[#18233C] border border-amber-500/40 shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>BÁCH KHOA VIỆT PHỤC</span>
            </motion.a>

            {/* Quick sound toggle button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.toggleAmbiance((playing) => setIsPlayingMusic(playing));
              }}
              className="w-full sm:w-auto p-3.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-[#121A2D]/80 hover:bg-[#18233C] border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
              title="Nhã nhạc cung đình"
            >
              {isPlayingMusic ? (
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </motion.button>
          </motion.div>

          {/* Cloud Curtain & Motifs Action Toolbar */}
          <motion.div
            variants={slideUpFadeVariants}
            className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundEngine.playPluck(523.25);
                setIsCloudIntroOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-950/20 group"
            >
              <Wind className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Vén Mây Chiều Sâu 3D (Cuộn Chuột)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundEngine.playPluck(440);
                setIsCloudGalleryOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-amber-200 bg-slate-900/70 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bảo Tàng 6 Mẫu Mây Cổ Phong</span>
            </motion.button>
          </motion.div>

          {/* Cultural Heritage Trust Indicators (Highlighting Diversity, Authenticity, Philosophy) */}
          <motion.div
            variants={slideUpFadeVariants}
            className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-amber-500/15 text-left mb-6"
          >
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Compass className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Đa Dạng 3 Miền</span>
                <span className="text-[10px] text-slate-400">Bắc — Trung — Nam</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Layers className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Quy Thức Triều Đình</span>
                <span className="text-[10px] text-slate-400">Phục nguyên chuẩn xác</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Palette className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Tơ Lụa & Gấm Vóc</span>
                <span className="text-[10px] text-slate-400">100% Nhuộm thảo mộc</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Khảo Cứu Lịch Sử</span>
                <span className="text-[10px] text-slate-400">Di sản ngàn năm văn hiến</span>
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
          className="w-full text-left my-8 pt-8 border-t border-amber-500/15"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 block mb-1">
                KHO TÀNG CUNG ĐÌNH
              </span>
              <h2 className="font-serif-vi text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100">
                Hé Lộ Bí Mật Cổ Phục Nghìn Năm
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-light">
              Mỗi nếp áo, hạt cúc hay dải thêu đều cất giấu những mật mã văn hóa và vũ trụ quan của tiền nhân.
              Nhấp vào từng bí mật để khám phá và thử phục sức ngay.
            </p>
          </div>

          {/* 4 Interactive Secret Chambers with Staggered Entrance */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {HERITAGE_SECRETS.map((secret, index) => {
              const isRevealed = !!revealedSecrets[secret.id];

              return (
                <motion.div
                  key={secret.id}
                  variants={cardStaggerVariants}
                  className={`rounded-2xl transition-all duration-300 p-6 relative overflow-hidden backdrop-blur-md border ${
                    isRevealed
                      ? 'bg-[#10172A]/90 border-amber-400/50 shadow-[0_8px_30px_rgba(245,158,11,0.18)]'
                      : 'bg-[#0E1526]/75 hover:bg-[#121B30] border-slate-700/60 hover:border-amber-500/40'
                  }`}
                >
                  {/* Subtle top indicator */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-serif-vi text-amber-400/90 font-semibold tracking-wider">
                      Bí Mật {`0${index + 1}`} · {secret.dynasty}
                    </span>
                    <button
                      onClick={() => toggleSecret(secret.id)}
                      className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer py-0.5 px-2 rounded-md bg-amber-500/10 border border-amber-500/30"
                    >
                      {isRevealed ? 'Thu gọn' : 'Khai mở bí mật'}
                    </button>
                  </div>

                  {/* Secret Garment Name */}
                  <h3 className="font-serif-vi text-xl font-bold text-amber-200 mb-2">
                    {secret.garmentName}
                  </h3>

                  {/* Teaser Question */}
                  <div className="text-xs text-slate-300 italic mb-4 border-l-2 border-amber-500/40 pl-3 py-0.5">
                    "{secret.teaser}"
                  </div>

                  {/* Revealed Content with smooth Framer Motion AnimatePresence */}
                  <AnimatePresence>
                    {isRevealed ? (
                      <motion.div
                        key="revealed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="space-y-4 pt-1 overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans-vi">
                          {secret.revealedSecret}
                        </p>

                        <div className="text-xs text-amber-300/90 font-medium bg-amber-500/10 p-3 rounded-xl border border-amber-500/25">
                          <span className="font-semibold text-amber-200">Ý nghĩa triết lý: </span>
                          {secret.significance}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">
                            Sẵn sàng trong phòng thử đồ 3D
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => applySecretTopAndGo(secret.targetTopId)}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Thử Dáng Áo Này</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="pt-2">
                        <button
                          onClick={() => toggleSecret(secret.id)}
                          className="w-full py-2.5 rounded-xl text-xs font-semibold text-amber-300/80 hover:text-amber-200 bg-[#141E34]/60 hover:bg-[#18243E] border border-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Nhấp để hé lộ bí mật ẩn giấu</span>
                          <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* 4.3 THƯỢNG PHỤC VIỆN AI: TRỢ LÝ TƯ VẤN PHỐI ĐỒ */}
        <motion.section
          variants={slideUpFadeVariants}
          className="w-full my-12 text-left"
        >
          <div className="bg-[#0E1526]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
            {/* Background glowing halo */}
            <div className="absolute -top-16 -right-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 block mb-1">
                  THƯỢNG PHỤC VIỆN AI
                </span>
                <h3 className="font-serif-vi text-xl sm:text-2xl font-bold text-amber-200">
                  Trợ Lý Stylist Di Sản & Ngũ Hành
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-light">
                Nhập bối cảnh hoặc phong cách bạn mong muốn, AI sẽ chọn lọc cổ phục phù hợp quy chuẩn triều đại.
              </p>
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-[#090D18] p-2 rounded-2xl border border-slate-700/80 focus-within:border-amber-400/80 transition-colors">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest()}
                placeholder="Ví dụ: Gợi ý cho tôi một bộ Việt phục đi dạo phố mùa thu, thanh lịch hiện đại..."
                className="w-full bg-transparent px-4 py-2.5 text-slate-100 placeholder-slate-400 text-sm outline-none font-sans-vi"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAiSuggest()}
                disabled={isAiLoading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-tight text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Đang suy nghĩ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Nhờ AI Gợi Ý</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Clean Prompt Suggestions */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-amber-400/80 font-medium mr-1 text-[11px]">
                Gợi ý nhanh:
              </span>
              {PROMPT_SUGGESTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptInput(prompt);
                    handleAiSuggest(prompt);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#141E34] hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700/60 hover:border-amber-500/40 transition-all text-xs text-left cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Result Card Display */}
            <AnimatePresence>
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 pt-6 border-t border-slate-700/70"
                >
                  <div className="bg-[#121B30] p-6 rounded-2xl border border-amber-500/40 relative">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-0.5">
                          Bản Phối Đề Xuất
                        </span>
                        <h4 className="font-serif-vi text-xl font-bold text-amber-200">
                          {aiResult.conceptTitle}
                        </h4>
                      </div>
                      <button
                        onClick={() => setAiResult(null)}
                        className="text-slate-400 hover:text-white text-sm font-semibold p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 font-sans-vi">
                      {aiResult.aiAdvice}
                    </p>

                    {/* Character Persona quote */}
                    <div className="bg-[#0B101E] p-3 rounded-xl border border-slate-700/60 text-xs italic text-slate-300 mb-4">
                      <span className="text-amber-400 font-serif-vi font-bold mr-1.5">“</span>
                      {aiResult.characterPersona}
                    </div>

                    {/* Garment parts list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-center text-xs">
                      <div className="p-3 bg-[#0B101E] rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase block mb-1">Áo Thượng Phục</span>
                        <span className="font-bold text-amber-300 block truncate">
                          {TOPS.find((t) => t.id === aiResult.recommendedTopId)?.name || 'Áo Ngũ Thân'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#0B101E] rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase block mb-1">Quần / Chân Váy</span>
                        <span className="font-bold text-slate-200 block truncate">
                          {BOTTOMS.find((b) => b.id === aiResult.recommendedBottomId)?.name || 'Quần Ống Sớ'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#0B101E] rounded-xl border border-slate-700/60">
                        <span className="text-[10px] text-slate-400 uppercase block mb-1">Phụ Kiện</span>
                        <span className="font-bold text-slate-200 block truncate">
                          {ACCESSORIES.find((a) => a.id === aiResult.recommendedAccessoryId)?.name || 'Mấn Đội Đầu'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setAiResult(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        Đóng
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={applyAiAndGo}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        Áp Dụng Vào Phòng Thử Ngay
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* 4.4 RUNWAY PRESETS: BỘ SƯU TẬP HOÀNG GIA ĐƯƠNG ĐẠI */}
        <motion.section
          variants={slideUpFadeVariants}
          className="w-full my-8 text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 block mb-1">
                TUYỂN TẬP ĐIỂN HÌNH
              </span>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-100">
                Các Bản Phối Mẫu Kinh Điển
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-light">
              Tuyển tập đã được chuẩn hóa theo thẩm mỹ và phong cách di sản
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {PRESET_OUTFITS.map((preset) => {
              const top = TOPS.find((t) => t.id === preset.topId);
              return (
                <motion.div
                  key={preset.id}
                  variants={cardStaggerVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => onApplyPreset(preset)}
                  className="group p-6 rounded-2xl bg-[#0E1526]/85 hover:bg-[#131D33] border border-amber-500/20 hover:border-amber-400/60 shadow-lg hover:shadow-[0_10px_32px_rgba(245,158,11,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Clean top metadata: Dynasty and Score */}
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <span className="text-slate-400 font-medium">
                        {top?.era || 'Triều Nguyễn'}
                      </span>
                      <span className="font-serif-vi font-bold text-amber-400">
                        {preset.presetScore} điểm
                      </span>
                    </div>

                    <h4 className="font-serif-vi text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
                      {preset.title}
                    </h4>
                    
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light mb-4">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:text-amber-300 transition-colors">
                    <span>Thử bản phối này</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* 4.5 INTERACTIVE DYNASTY CHRONOLOGY: BIÊN NIÊN SỬ TRIỀU ĐẠI */}
        <motion.section
          variants={slideUpFadeVariants}
          className="w-full my-12 p-6 sm:p-8 rounded-3xl bg-[#0E1526]/85 border border-amber-500/25 shadow-xl text-left"
        >
          <div className="mb-6">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-400 block mb-1">
              DÒNG THỜI GIAN DI SẢN
            </span>
            <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-100">
              Biên Niên Sử Phục Sức Việt Qua Các Triều Đại
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Mỗi giai đoạn lịch sử ghi dấu một bước chuyển mình của văn hóa trang phục Việt Nam
            </p>
          </div>

          {/* Dynasty Interactive Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/60 pb-4">
            {DYNASTY_ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => {
                  soundEngine.playPluck(392);
                  setActiveDynastyId(era.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeDynastyId === era.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-xs'
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
              className="p-5 sm:p-6 rounded-2xl bg-[#121B30] border border-amber-500/20 grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              <div className="md:col-span-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <h4 className="font-serif-vi text-xl font-bold text-amber-200">
                    {activeDynasty.name}
                  </h4>
                  <span className="text-xs text-amber-400/80 font-mono">
                    ({activeDynasty.years})
                  </span>
                </div>
                <h5 className="text-sm font-semibold text-slate-200 mb-3">
                  {activeDynasty.headline}
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-4">
                  {activeDynasty.summary}
                </p>

                {/* Garments & Textures */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-amber-400 font-medium">Trang phục tiêu biểu:</span>
                  {activeDynasty.garments.map((g, i) => (
                    <span
                      key={i}
                      className="text-slate-200 bg-[#0E1526] px-2.5 py-1 rounded-md border border-slate-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-700/60 pt-4 md:pt-0 md:pl-6 text-xs">
                <div>
                  <span className="text-slate-400 block mb-2 font-medium">Bảng Sắc Màu Đặc Trưng:</span>
                  <div className="flex flex-col gap-1.5 text-slate-300">
                    {activeDynasty.palette.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60">
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

        {/* 4.6 REGIONAL TRADITIONS (BẢN ĐỒ VĂN HÓA 3 MIỀN BẮC - TRUNG - NAM) */}
        <RegionalFashionDiversityMap />

        {/* 4.7 TRADITIONAL WEAVING & DYEING CRAFTSMANSHIP (TINH HOA CHẤT LIỆU TƠ TẰM & GẤM VÓC) */}
        <HeritageCraftsmanshipStory />

        {/* 4.8 INTERACTIVE CULTURAL QUIZ (THỬ TÀI HIỂU BIẾT CỔ PHỤC) */}
        <CulturalInteractiveQuiz />

      </motion.main>

      {/* 5. CULTURAL HERITAGE EDUCATIONAL FOOTER */}
      <footer className="relative z-10 w-full bg-[#070B14] border-t border-amber-500/20 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif-vi font-bold text-xl text-amber-300">AURA — VIỆT PHỤC</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Dự án số hóa và lan tỏa vẻ đẹp cổ phục Việt Nam phi lợi nhuận. Tôn vinh bề dày văn hiến, kỹ nghệ dệt thêu cổ truyền và triết lý thẩm mỹ phương Đông qua góc nhìn công nghệ tương tác 3D.
            </p>
            <div className="flex items-center gap-3 text-amber-400 font-medium">
              <Award className="w-4 h-4" />
              <span>Bảo Tàng Số Hóa Trang Phục Dân Tộc</span>
            </div>
          </div>

          {/* Cultural Eras */}
          <div className="space-y-3">
            <h4 className="font-serif-vi font-bold text-amber-200 uppercase tracking-wider text-xs">
              Các Triều Đại Tiêu Biểu
            </h4>
            <div className="space-y-2 text-slate-400">
              <div>• <strong>Thời Lý — Trần:</strong> Hào khí Đông A, Giao Lĩnh phóng khoáng</div>
              <div>• <strong>Thời Lê Sơ & Trung Hưng:</strong> Viên Lĩnh Bổ Tử, khuôn phép lễ nghi</div>
              <div>• <strong>Triều Nguyễn:</strong> Nhật Bình, Ngũ Thân & định hình quốc phục</div>
              <div>• <strong>Dân gian Bắc Bộ:</strong> Áo Tứ Thân Kinh Bắc, nón quai thao</div>
            </div>
          </div>

          {/* Research & Sources */}
          <div className="space-y-3">
            <h4 className="font-serif-vi font-bold text-amber-200 uppercase tracking-wider text-xs">
              Tài Liệu Khảo Cứu
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Khâm Định Đại Nam Hội Điển Sự Lệ</li>
              <li>• Ngàn Năm Áo Mũ (Trần Quang Đức)</li>
              <li>• Nghiên cứu phục dựng cổ phong Việt Nam</li>
              <li>• Tư liệu Cố cung Huế & Viện Viễn Đông Bác Cổ</li>
            </ul>
          </div>

          {/* Interactive Capabilities */}
          <div className="space-y-3">
            <h4 className="font-serif-vi font-bold text-amber-200 uppercase tracking-wider text-xs">
              Không Gian Trải Nghiệm
            </h4>
            <div className="space-y-2">
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                Trang bị công nghệ mô phỏng phục trang đa lớp, phân tích ngũ hành hòa hợp và tương tác âm hưởng nhã nhạc ngũ cung thuần Việt.
              </p>
              <div className="pt-2 text-[11px] text-amber-400/90 font-medium">
                ✨ Trải nghiệm hoàn toàn phi thương mại, tôn vinh văn hóa cội nguồn
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-7xl mx-auto px-6 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>© 2026 Aura — Không Gian Văn Hóa & Tinh Hoa Việt Phục Ngàn Năm.</span>
          <span className="text-amber-400/90 font-medium">
            Tự hào lan tỏa trang phục truyền thống Việt Nam đến bạn bè năm châu
          </span>
        </div>
      </footer>
    </div>
  );
};
