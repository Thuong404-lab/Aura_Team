import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  BackdropOption,
  BACKDROPS,
  BOTTOMS,
  TOPS,
  ACCESSORIES,
} from '../data/vietPhucData';
import {
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  MapPin,
  Camera,
  Check,
  Crown,
  Quote,
  Layers,
  Calendar,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Info,
  ChevronRight,
  Eye,
  Sliders,
  Compass,
  Filter,
  X,
  ArrowRight,
  Sun,
  Moon,
  Feather,
  Edit3,
  Loader2,
  Maximize2,
  HelpCircle,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { getLookbookStory } from '../services/aiClient';
import {
  AuraLogo,
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';
import {
  evaluateOutfitAuthenticity,
  CULTURAL_CORE_HALLMARKS,
  DYNASTIC_PERIODS,
} from '../data/culturalRulesData';
import { downloadLookbookPosterHD } from '../utils/lookbookPosterGenerator';
import { AvatarModel } from './AvatarModel';
import { useAppTheme } from '../context/ThemeContext';

interface LookbookScreenProps {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabric: FabricOption;
  color: ColorOption;
  topCustomColor?: string;
  bottomCustomColor?: string;
  harmonyData?: {
    score: number;
    ratingBadge: string;
    critiqueTitle: string;
    detailedCritique: string;
    culturalSecret: string;
    stylingTip: string;
  };
  onBackToFitting: () => void;
  onSelectBottom?: (item: WardrobeItem) => void;
}

const HISTORIC_POEMS = [
  'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.',
  'Năm thân gìn giữ câu nhân nghĩa / Tà rủ đoan trang bóng nguyệt cài.',
  'Sống áo mũi gáy lòng ngay thẳng / Quần lụa hai ống nét thanh tao.',
  'Nghìn năm văn hiến hồn sông núi / Tấc vải gấm hoa rạng nét xưa.',
];

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  topCustomColor,
  bottomCustomColor,
  harmonyData,
  onBackToFitting,
  onSelectBottom,
}) => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropOption>(BACKDROPS[0]);
  const posterRef = useRef<HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [showFullscreenModal, setShowFullscreenModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [aiSuccessBadge, setAiSuccessBadge] = useState<boolean>(false);

  // Chế độ hiển thị cột trái: 'poster' (Khung poster hoàn chỉnh) hoặc 'details' (Thông số phục sắc)
  const [previewMode, setPreviewMode] = useState<'poster' | 'details'>('poster');

  // Active view tab for the editorial inspector panel (Mặc định mở tab Soạn Thảo)
  const [activeTab, setActiveTab] = useState<'editor' | 'backdrop' | 'hallmarks' | 'rules'>('editor');

  // Lighting Filter Mood
  const [lightingFilter, setLightingFilter] = useState<'sunset' | 'moonlight' | 'royal' | 'vintage'>('sunset');

  // Con dấu quy chuẩn di sản
  const [showSeal, setShowSeal] = useState<boolean>(true);

  // Authenticity and Cultural Rules Evaluation based on user's cultural text
  const evaluation = useMemo(() => {
    return evaluateOutfitAuthenticity(top, bottom, accessory);
  }, [top, bottom, accessory]);

  // Editable Lookbook Content
  const [editionTitle, setEditionTitle] = useState<string>(`Dáng Hoa ${top.name}`);
  const [subHeadline, setSubHeadline] = useState<string>(
    `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${selectedBackdrop.name}`
  );
  const [poetryCouple, setPoetryCouple] = useState<string>(HISTORIC_POEMS[0]);
  const [personalNote, setPersonalNote] = useState<string>(
    harmonyData?.detailedCritique ||
      `Dưới bóng tường thành rêu phong tại ${selectedBackdrop.name}, tà ${top.name} buông suông dáng chữ A thanh thoát, giữ trọn đường sống áo mũi gáy trung chính và năm cúc ngũ thường mẫu mực.`
  );

  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Update subtitle when backdrop changes only if it still contains the template location phrase
  useEffect(() => {
    setSubHeadline((prev) => {
      if (!prev || prev.includes('tại')) {
        return `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${selectedBackdrop.name}`;
      }
      return prev;
    });
  }, [selectedBackdrop]);

  // Handle explicit AI generation for poetry and editorial story
  const handleGenerateAiStory = async () => {
    soundEngine.playPluck(659.25);
    setIsGeneratingStory(true);
    setAiSuccessBadge(false);
    try {
      const generated = await getLookbookStory({
        top,
        bottom,
        accessory,
        backdropName: selectedBackdrop.name,
      });
      if (generated.editionTitle) setEditionTitle(generated.editionTitle);
      if (generated.subHeadline) setSubHeadline(generated.subHeadline);
      if (generated.poetryCouple) setPoetryCouple(generated.poetryCouple);
      if (generated.editorialStory) setPersonalNote(generated.editorialStory);
      soundEngine.playPluck(880);
      setAiSuccessBadge(true);
      setTimeout(() => setAiSuccessBadge(false), 3500);
    } catch {
      // Keep current values on network failure
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Tải Poster Lookbook Di Sản (HD PNG) - Đảm bảo WYSWYG 100% giống hệt ảnh xem trước
  const handleDownloadPoster = async () => {
    soundEngine.playPluck(783.99);
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      // Nếu người dùng đang bật tab chi tiết thông số, chuyển nhanh về 'poster' để ảnh tải về có đầy đủ phục sắc & bối cảnh
      if (previewMode !== 'poster') {
        setPreviewMode('poster');
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      await downloadLookbookPosterHD(
        {
          top,
          bottom,
          accessory,
          fabric,
          color,
          topCustomColor,
          bottomCustomColor,
          backdrop: selectedBackdrop,
          harmonyScore: harmonyData?.score || 95,
          isAuthentic: evaluation.isAuthentic,
          editionTitle,
          subHeadline,
          poetryCouple,
          personalNote,
          lightingFilter,
          showSeal,
          element: posterRef.current,
        },
        (status) => setDownloadStatus(status)
      );

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err) {
      console.error('Lỗi khi tải Poster Lookbook HD:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Quick fix: Swap bottom to authentic 2-leg trousers
  const handleQuickFixPants = () => {
    soundEngine.playPluck(587.33);
    const authenticPants = BOTTOMS.find((b) => b.id === 'quan-ong-so') || BOTTOMS[0];
    if (onSelectBottom) {
      onSelectBottom(authenticPants);
    }
  };

  // Handle Share
  const handleShare = () => {
    soundEngine.playPluck(523.25);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col relative overflow-x-hidden font-sans-vi transition-colors duration-500 ${
        isCream ? 'bg-[#FAF7F0] text-stone-900' : 'bg-[#0A0E17] text-slate-100'
      }`}
    >
      {/* Background Ambience */}
      <div
        className={`fixed inset-0 pointer-events-none bg-cover bg-center blur-2xl scale-110 transition-opacity duration-700 ${
          isCream ? 'opacity-10 mix-blend-multiply' : 'opacity-15'
        }`}
        style={{ backgroundImage: `url(${selectedBackdrop.imageUrl})` }}
      />

      {/* Decorative Traditional Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -bottom-36 -right-36 ${isCream ? 'opacity-15 text-amber-900' : 'opacity-20 text-amber-500'}`}>
          <DongSonDrumMandala className="w-[500px] h-[500px]" opacity={isCream ? 0.2 : 0.25} />
        </div>
        <div className={`absolute top-12 right-10 ${isCream ? 'opacity-15 text-amber-900' : 'opacity-25 text-amber-500'}`}>
          <CoPhongCloud className="w-52 h-28" flipX />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <header
        className={`relative z-20 w-full border-b backdrop-blur-md sticky top-0 transition-colors ${
          isCream
            ? 'border-amber-200/90 bg-[#FAF7F0]/95 text-stone-900 shadow-xs'
            : 'border-slate-800/80 bg-[#0C1220]/90 text-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <button
            onClick={onBackToFitting}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0 ${
              isCream
                ? 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/70 border border-amber-200/60'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/80'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" />
            <span>← Quay lại Phòng Thử Đồ</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-serif-vi hidden md:inline font-medium ${
                isCream ? 'text-amber-950' : 'text-amber-300/80'
              }`}
            >
              📖 Xưởng Biên Tập & Xuất Bản Poster Lookbook
            </span>

            {/* Quick Export Button in Navbar */}
            <button
              onClick={handleDownloadPoster}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-all active:scale-95"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Đang xuất HD...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  <span>Đã tải Poster HD!</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span>Tải Poster HD (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-3 sm:p-5 md:p-6 max-w-7xl mx-auto w-full">
        {/* Workspace Title & Clarity Explanation Banner */}
        <div className="w-full mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className={`text-[11px] font-bold tracking-widest uppercase ${
                  isCream ? 'text-amber-900' : 'text-amber-400'
                }`}>
                  XƯỞNG BIÊN TẬP POSTER LOOKBOOK DI SẢN
                </span>
              </div>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-serif-vi mt-0.5 ${
                isCream ? 'text-amber-950' : 'text-amber-100'
              }`}>
                Soạn Thảo & Xuất Bản Poster Di Sản
              </h1>
            </div>

            {/* Quick Stats, Authenticity Pill & Guide Icon Button */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 shadow-xs ${
                isCream ? 'bg-amber-100/70 border-amber-200/90 text-stone-800' : 'bg-[#121A2C] border-slate-700/80 text-slate-100'
              }`}>
                <span className={`${isCream ? 'text-stone-600' : 'text-slate-400'} text-[11px]`}>Điểm Di Sản:</span>
                <span className={`font-bold font-serif-vi ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>
                  {harmonyData?.score || 95}/100
                </span>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-xs ${
                  evaluation.isAuthentic
                    ? isCream
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                    : isCream
                    ? 'bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                }`}
              >
                {evaluation.isAuthentic ? (
                  <ShieldCheck className={`w-3.5 h-3.5 ${isCream ? 'text-emerald-700' : 'text-emerald-400'}`} />
                ) : (
                  <AlertTriangle className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                )}
                <span>{evaluation.isAuthentic ? 'Đạt Quy Chuẩn' : 'Cần Lưu Ý'}</span>
              </div>

              {/* Icon hướng dẫn gọn gàng tinh tế */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(523.25);
                  setShowGuideModal(true);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isCream
                    ? 'bg-amber-100 hover:bg-amber-200/80 border-amber-300 text-amber-950'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200'
                }`}
                title="Xem hướng dẫn sử dụng tính năng Lookbook"
              >
                <HelpCircle className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>Hướng Dẫn</span>
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE: 2-Column Responsive Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ==========================================================
              LEFT COLUMN: Live Editorial Poster Preview (High Fidelity)
             ========================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* View Mode Bar on Top of Poster */}
            <div className="w-full max-w-[480px] flex items-center justify-between mb-2 px-1">
              <div className={`flex items-center gap-1.5 p-0.5 rounded-xl border text-xs ${
                isCream ? 'bg-white/95 border-amber-200/90 shadow-2xs' : 'bg-[#111827] border-slate-700/60'
              }`}>
                <button
                  type="button"
                  onClick={() => setPreviewMode('poster')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    previewMode === 'poster'
                      ? isCream
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className={`w-3.5 h-3.5 ${isCream ? 'text-amber-800' : 'text-amber-400'}`} />
                  <span>Poster Tạp Chí</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('details')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                    previewMode === 'details'
                      ? isCream
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Info className={`w-3.5 h-3.5 ${isCream ? 'text-amber-800' : 'text-amber-400'}`} />
                  <span>Chi Tiết Phối Đồ</span>
                </button>
              </div>

              {/* Fullscreen Preview Trigger */}
              <button
                type="button"
                onClick={() => setShowFullscreenModal(true)}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                  isCream
                    ? 'bg-white border-amber-200/90 text-stone-700 hover:text-amber-950 hover:border-amber-400'
                    : 'bg-[#111827] border-slate-700/60 hover:border-amber-400/50 text-slate-300 hover:text-amber-300'
                }`}
                title="Phóng to xem Poster kích thước lớn"
              >
                <Maximize2 className={`w-3.5 h-3.5 ${isCream ? 'text-amber-800' : 'text-amber-400'}`} />
                <span className="hidden sm:inline">Phóng To</span>
              </button>
            </div>

            {/* Poster Card Container with Strict Aspect Ratio - NO OVERFLOW! */}
            <div
              ref={posterRef}
              id="lookbook-poster-preview-card"
              data-poster-card="true"
              className={`relative w-full max-w-[480px] rounded-3xl overflow-hidden border-2 border-amber-500/35 bg-[#090D18] flex flex-col justify-between group h-[600px] sm:h-[650px] lg:h-[680px] ${
                isCream ? 'shadow-[0_20px_50px_rgba(180,130,60,0.18)]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
              }`}
            >
              {/* Background Photo & Ambient Lighting Filter */}
              <div className="absolute inset-0 pointer-events-none">
                <img
                  crossOrigin="anonymous"
                  src={selectedBackdrop.imageUrl}
                  alt={selectedBackdrop.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05] transition-transform duration-700 group-hover:scale-102"
                />
                {/* Lighting Filter Tint */}
                <div
                  className={`absolute inset-0 transition-colors ${
                    lightingFilter === 'sunset'
                      ? 'bg-amber-500/12'
                      : lightingFilter === 'moonlight'
                      ? 'bg-sky-500/12'
                      : lightingFilter === 'royal'
                      ? 'bg-yellow-500/12'
                      : 'bg-amber-900/15'
                  }`}
                />
                {/* Inner Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60" />

                {/* Inner Golden Border Accent */}
                <div className="absolute inset-3.5 rounded-2xl border border-amber-400/30 pointer-events-none" />
                <div className="absolute inset-4.5 rounded-2xl border border-amber-400/15 pointer-events-none" />
              </div>

              {/* POSTER HEADER (Top ~12%) */}
              <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <AuraLogo className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[11px] font-serif-vi font-bold tracking-[0.25em] uppercase drop-shadow-md text-amber-300 block leading-tight">
                      AURA LOOKBOOK
                    </span>
                    <span className="text-[9px] tracking-widest text-slate-400 uppercase block font-sans-vi">
                      VIỆT PHỤC DI SẢN
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-amber-500/40">
                    {evaluation.matchedPeriod.eraName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                      evaluation.isAuthentic
                        ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
                        : 'bg-amber-950/80 border-amber-400/50 text-amber-300'
                    }`}
                  >
                    {evaluation.isAuthentic ? 'CHUẨN MỰC' : 'CÓ LƯU Ý'}
                  </span>
                </div>
              </div>

              {/* POSTER CENTER: Full 2D Mannequin Standing Proudly Centered (Middle Area) */}
              {previewMode === 'poster' ? (
                <div className="absolute inset-x-0 top-[56px] bottom-[165px] sm:bottom-[175px] flex items-center justify-center pointer-events-none z-10 px-4">
                  <div
                    id="lookbook-mannequin-wrapper"
                    className="w-full h-full flex items-center justify-center drop-shadow-[0_18px_40px_rgba(0,0,0,0.95)]"
                  >
                    <AvatarModel
                      top={top}
                      bottom={bottom}
                      accessory={accessory}
                      fabric={fabric}
                      color={color}
                      topCustomColor={topCustomColor}
                      bottomCustomColor={bottomCustomColor}
                      harmonyScore={harmonyData?.score || 95}
                      showCulturePins={false}
                      hideOverlays={true}
                    />
                  </div>
                </div>
              ) : (
                /* Detail Specs View */
                <div
                  className={`relative z-10 mx-6 my-auto p-4 rounded-2xl border text-left space-y-2 text-xs backdrop-blur-md ${
                    isCream
                      ? 'bg-[#FFFDF9]/95 border-amber-300 text-stone-900 shadow-xl'
                      : 'bg-black/75 border-amber-500/30 text-white'
                  }`}
                >
                  <h4
                    className={`font-serif-vi font-bold text-sm border-b pb-1.5 flex items-center gap-1.5 ${
                      isCream ? 'text-amber-950 border-amber-200' : 'text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Info className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                    Thông Số Sắc Phục Phối Hợp
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div
                      className={`p-2 rounded-xl border ${
                        isCream ? 'bg-amber-50/70 border-amber-200/80' : 'bg-[#111827] border-slate-800'
                      }`}
                    >
                      <span className={`block text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        Thượng Y:
                      </span>
                      <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>{top.name}</strong>
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        isCream ? 'bg-amber-50/70 border-amber-200/80' : 'bg-[#111827] border-slate-800'
                      }`}
                    >
                      <span className={`block text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        Hạ Y:
                      </span>
                      <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>{bottom.name}</strong>
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        isCream ? 'bg-amber-50/70 border-amber-200/80' : 'bg-[#111827] border-slate-800'
                      }`}
                    >
                      <span className={`block text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        Phụ Kiện:
                      </span>
                      <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>{accessory.name}</strong>
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        isCream ? 'bg-amber-50/70 border-amber-200/80' : 'bg-[#111827] border-slate-800'
                      }`}
                    >
                      <span className={`block text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        Chất Liệu:
                      </span>
                      <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>{fabric.name}</strong>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-xl border text-[11px] ${
                      isCream ? 'bg-amber-50/70 border-amber-200/80' : 'bg-[#111827] border-slate-800'
                    }`}
                  >
                    <span className={`block text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                      Bối Cảnh Lịch Sử:
                    </span>
                    <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>
                      📍 {selectedBackdrop.name} ({selectedBackdrop.city})
                    </strong>
                  </div>
                </div>
              )}

              {/* POSTER FOOTER / EDITORIAL LOWER-THIRD (Bottom ~28%) - SLIM & ELEGANT */}
              <div className="relative p-4 sm:p-5 text-white z-20 text-left bg-gradient-to-t from-black/98 via-black/88 to-transparent pt-6 mt-auto border-t border-amber-500/30 backdrop-blur-xs">
                {/* Location & Title */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-300">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span className="truncate max-w-[240px] font-medium">
                      {selectedBackdrop.name} • {selectedBackdrop.city}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/90 font-mono">
                    {evaluation.matchedPeriod.periodText}
                  </span>
                </div>

                {/* Edition Title */}
                <h3 className="font-serif-vi text-base sm:text-lg font-bold leading-tight text-amber-100">
                  {editionTitle || `Dáng Hoa ${top.name}`}
                </h3>

                {/* Poetry Couple Quote */}
                <div className="my-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30">
                  <p className="text-[11px] sm:text-xs text-amber-200 font-serif-vi italic text-center leading-relaxed">
                    “{poetryCouple}”
                  </p>
                </div>

                {/* Personal Note & Heritage Seal Row */}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-[10px] sm:text-[10.5px] text-slate-300/90 leading-tight line-clamp-2 flex-1">
                    <span className="text-amber-400 font-semibold">Lời bình: </span>
                    {personalNote || 'Bản phối gìn giữ nguyên vẹn cốt cách đoan trang, thanh lịch của phục sức cổ truyền.'}
                  </p>

                  {/* Red Imperial Seal */}
                  {showSeal && (
                    <div className="px-2 py-1 rounded-md border border-red-500/80 bg-red-950/80 text-red-300 text-[9px] font-bold uppercase tracking-wider shrink-0 text-center shadow-xs">
                      <div>✓ DI SẢN VIỆT</div>
                      <div className="text-[8px] text-red-400 font-mono">CHUẨN MỰC</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Poster Download Status Hint */}
            <p className={`text-[11px] mt-2 text-center ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
              💡 Ảnh Poster HD xuất ra sẽ có độ phân giải lớn <strong>1200x1800 PNG</strong>, kèm viền kim hoàn và con dấu di sản.
            </p>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Lookbook Editor & Styling Workspace
             ========================================================== */}
          <div
            className={`lg:col-span-6 flex flex-col justify-between text-left rounded-3xl p-4 sm:p-5 relative overflow-hidden h-[600px] sm:h-[650px] lg:h-[680px] transition-colors ${
              isCream
                ? 'bg-[#FFFDF9]/95 border border-amber-300/80 shadow-[0_16px_45px_rgba(180,130,60,0.1)] text-stone-900'
                : 'bg-[#0E1526]/95 border border-amber-500/25 shadow-2xl text-slate-100'
            }`}
          >
            {/* Scrollable Tab Controls & Content Panel */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overscroll-contain pr-1.5 custom-scrollbar space-y-3.5">
              {/* Authenticity Assessment Notification Card */}
              <div
                className={`p-3 rounded-2xl border flex items-start gap-2.5 shadow-2xs transition-all ${
                  evaluation.isAuthentic
                    ? isCream
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : 'bg-emerald-950/35 border-emerald-500/40 text-emerald-200'
                    : isCream
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                }`}
              >
                {evaluation.isAuthentic ? (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isCream ? 'text-emerald-700' : 'text-emerald-400'}`} />
                ) : (
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                )}
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className={`text-xs font-serif-vi font-bold ${isCream ? 'text-stone-900' : ''}`}>
                      {evaluation.isAuthentic
                        ? 'Đạt Quy Chuẩn Di Sản Việt Phục'
                        : 'Lưu Ý Quy Thức Việt Phục'}
                    </strong>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
                        isCream ? 'bg-amber-100 text-amber-950 border border-amber-200' : 'bg-black/40 text-amber-300'
                      }`}
                    >
                      {evaluation.matchedPeriod.periodText}
                    </span>
                  </div>
                  <p className={`mt-0.5 leading-relaxed text-[11px] ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                    {evaluation.keyAdvice}
                  </p>

                  {!evaluation.isAuthentic && onSelectBottom && (
                    <button
                      type="button"
                      onClick={handleQuickFixPants}
                      className="mt-2 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10.5px] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Đổi sang Quần Ống Sớ Lụa Bạch (Chuẩn 2 ống)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Editorial Workspace Tabs - 4 Distinct Panels */}
              <div
                className={`grid grid-cols-4 gap-1 p-1 rounded-2xl text-center border transition-colors ${
                  isCream ? 'bg-amber-100/60 border-amber-200/90' : 'bg-[#131C2E] border-slate-700/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('editor');
                    soundEngine.playPluck(440);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'editor'
                      ? isCream
                        ? 'bg-amber-700 text-white shadow-xs font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-200/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Soạn Thảo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('backdrop');
                    soundEngine.playPluck(493.88);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'backdrop'
                      ? isCream
                        ? 'bg-amber-700 text-white shadow-xs font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-200/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Bối Cảnh</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('hallmarks');
                    soundEngine.playPluck(523.25);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'hallmarks'
                      ? isCream
                        ? 'bg-amber-700 text-white shadow-xs font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-200/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>4 Dấu Ấn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('rules');
                    soundEngine.playPluck(587.33);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'rules'
                      ? isCream
                        ? 'bg-amber-700 text-white shadow-xs font-bold'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-xs'
                      : isCream
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-amber-200/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Quy Tắc</span>
                </button>
              </div>

              {/* ========================================================
                  TAB CONTENT 1: EDITORIAL INPUT FORM (SOẠN THẢO)
                 ======================================================== */}
              {activeTab === 'editor' && (
                <div className="space-y-3 animate-in fade-in duration-300 text-xs">
                  {/* AI Quick Generator Banner with Notification */}
                  <div
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border ${
                      isCream
                        ? 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/40 border-amber-300/80 text-stone-900'
                        : 'bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border-amber-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 shrink-0 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                      <div>
                        <span
                          className={`text-[11px] font-bold block leading-tight ${
                            isCream ? 'text-amber-950' : 'text-amber-200'
                          }`}
                        >
                          Trợ Lý AI Sáng Tác Thơ & Lời Bình
                        </span>
                        <span className={`text-[10px] block ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                          Tự động sinh tiêu đề, thơ đề từ và lời bình văn hóa
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAiStory}
                      disabled={isGeneratingStory}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60 shrink-0"
                    >
                      {isGeneratingStory ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang sáng tác...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Sáng Tác</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiSuccessBadge && (
                    <div
                      className={`p-2 rounded-xl border text-[11px] flex items-center gap-2 animate-in fade-in ${
                        isCream
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isCream ? 'text-emerald-700' : 'text-emerald-400'}`} />
                      <span>Đã cập nhật Tiêu đề, Thơ đề từ và Lời bình AI lên Poster thành công!</span>
                    </div>
                  )}

                  {/* Tiêu đề ấn bản */}
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                      Tên ấn bản Lookbook:
                    </label>
                    <input
                      type="text"
                      value={editionTitle}
                      onChange={(e) => setEditionTitle(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-sans-vi focus:outline-none transition-colors border ${
                        isCream
                          ? 'bg-white border-amber-200/90 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 shadow-2xs'
                          : 'bg-[#101728] border-slate-700 focus:border-amber-400 text-slate-100'
                      }`}
                      placeholder="Ví dụ: Dáng Hoa Áo Ngũ Thân..."
                    />
                  </div>

                  {/* Phụ đề & Bối cảnh */}
                  <div>
                    <label className={`block text-[11px] font-bold mb-1 ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                      Phụ đề tác phẩm & Ý niệm:
                    </label>
                    <input
                      type="text"
                      value={subHeadline}
                      onChange={(e) => setSubHeadline(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-sans-vi focus:outline-none transition-colors border ${
                        isCream
                          ? 'bg-white border-amber-200/90 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 shadow-2xs'
                          : 'bg-[#101728] border-slate-700 focus:border-amber-400 text-slate-100'
                      }`}
                      placeholder="Mô tả ý niệm giao hòa giữa truyền thống & đương đại..."
                    />
                  </div>

                  {/* Câu thơ đề từ */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[11px] font-bold ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                        Câu thơ đề từ (In trên Poster):
                      </label>
                      <span className={`text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        Chọn nhanh bên dưới
                      </span>
                    </div>
                    <input
                      type="text"
                      value={poetryCouple}
                      onChange={(e) => setPoetryCouple(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs font-sans-vi italic focus:outline-none transition-colors mb-1.5 border ${
                        isCream
                          ? 'bg-white border-amber-200/90 focus:border-amber-600 text-amber-900 font-semibold shadow-2xs'
                          : 'bg-[#101728] border-slate-700 focus:border-amber-400 text-amber-200'
                      }`}
                    />

                    {/* Quick Poetic suggestions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {HISTORIC_POEMS.map((poem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPoetryCouple(poem);
                            soundEngine.playPluck(523.25);
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-[10.5px] transition-all cursor-pointer font-sans-vi leading-snug border ${
                            poetryCouple === poem
                              ? isCream
                                ? 'bg-amber-200/90 text-amber-950 border-amber-300 font-semibold shadow-2xs'
                                : 'bg-amber-500/25 text-amber-200 border-amber-400/50'
                              : isCream
                              ? 'bg-white text-stone-700 hover:bg-amber-50/70 border-amber-200/70'
                              : 'bg-[#101626] text-slate-400 hover:text-slate-200 border-slate-800'
                          }`}
                        >
                          “{poem}”
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lời bình & Cảm nghĩ cá nhân */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-[11px] font-bold ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                        Lời bình & Bút ký di sản (In chân poster):
                      </label>
                      <span className={`text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                        {personalNote.length}/180 ký tự
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      maxLength={180}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl text-xs leading-relaxed focus:outline-none transition-colors border ${
                        isCream
                          ? 'bg-white border-amber-200/90 focus:border-amber-600 text-stone-900 placeholder:text-stone-400 shadow-2xs'
                          : 'bg-[#101728] border-slate-700 focus:border-amber-400 text-slate-200'
                      }`}
                      placeholder="Nhập cảm nghĩ về bản phối cổ phục..."
                    />
                  </div>

                  {/* Con dấu quy chuẩn */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      isCream ? 'bg-white border-amber-200/80 text-stone-900 shadow-2xs' : 'bg-[#101728] border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                      <div>
                        <div className={`text-[11px] font-bold ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>
                          Con Dấu Triện Đỏ Di Sản Việt
                        </div>
                        <div className={`text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                          Khắc triện son chứng thực quy chuẩn phục sắc trên Poster
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSeal}
                        onChange={(e) => setShowSeal(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                    </label>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB CONTENT 2: BỐI CẢNH & ÁNH SÁNG
                 ======================================================== */}
              {activeTab === 'backdrop' && (
                <div className="space-y-3 animate-in fade-in duration-300 text-xs">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1.5 ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                      Chọn bối cảnh danh thắng di sản:
                    </label>
                    <div
                      data-lenis-prevent="true"
                      className="grid grid-cols-2 gap-2 max-h-[290px] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5"
                    >
                      {BACKDROPS.map((bd) => (
                        <button
                          key={bd.id}
                          type="button"
                          onClick={() => {
                            setSelectedBackdrop(bd);
                            soundEngine.playPluck(440);
                          }}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                            selectedBackdrop.id === bd.id
                              ? isCream
                                ? 'bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400 shadow-2xs font-semibold'
                                : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-xs'
                              : isCream
                              ? 'bg-white border-amber-200/70 text-stone-800 hover:border-amber-300'
                              : 'bg-[#101728] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={bd.imageUrl}
                            alt={bd.name}
                            className={`w-10 h-10 rounded-lg object-cover shrink-0 border ${
                              isCream ? 'border-amber-200' : 'border-slate-700'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-[11px] truncate">{bd.name}</div>
                            <div className={`text-[10px] truncate ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                              {bd.city}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold mb-1.5 ${isCream ? 'text-amber-950' : 'text-amber-400'}`}>
                      Bộ lọc ánh sáng nhiếp ảnh nghệ thuật:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'sunset', label: 'Hoàng hôn cố đô', desc: 'Sắc vàng hổ phách ấm áp' },
                        { id: 'moonlight', label: 'Dạ nguyệt thanh tao', desc: 'Ánh trăng huyền ảo lam' },
                        { id: 'royal', label: 'Kim hoàng cung đình', desc: 'Rực rỡ son vàng đế vương' },
                        { id: 'vintage', label: 'Hoài niệm cổ phong', desc: 'Nâu trầm xưa hoài niệm' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setLightingFilter(item.id as any);
                            soundEngine.playSilkFlutter();
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            lightingFilter === item.id
                              ? isCream
                                ? 'bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400 shadow-2xs font-semibold'
                                : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-xs'
                              : isCream
                              ? 'bg-white border-amber-200/70 text-stone-700 hover:border-amber-300'
                              : 'bg-[#101728] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`font-semibold text-[11.5px] ${
                              isCream ? 'text-amber-950' : 'text-amber-300'
                            }`}
                          >
                            {item.label}
                          </div>
                          <div className={`text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB CONTENT 3: 4 DẤU ẤN CỐT LÕI
                 ======================================================== */}
              {activeTab === 'hallmarks' && (
                <div className="space-y-2 animate-in fade-in duration-300 text-xs">
                  <div
                    className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                      isCream ? 'text-amber-950' : 'text-amber-400'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    4 DẤU ẤN ĐỊNH HÌNH VIỆT PHỤC CHUẨN MỰC
                  </div>

                  {CULTURAL_CORE_HALLMARKS.map((h) => (
                    <div
                      key={h.id}
                      className={`p-2.5 rounded-xl border transition-colors text-left ${
                        isCream
                          ? 'bg-white border-amber-200/80 hover:border-amber-400 text-stone-800 shadow-2xs'
                          : 'bg-[#131C2E] border-slate-700/60 hover:border-amber-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <h5
                          className={`font-bold text-xs font-serif-vi ${
                            isCream ? 'text-amber-950' : 'text-amber-200'
                          }`}
                        >
                          {h.title}
                        </h5>
                      </div>
                      <p className={`leading-relaxed text-[10.5px] mb-1 ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                        {h.vietnamTrait}
                      </p>
                      <div
                        className={`text-[10px] italic p-1.5 rounded-lg border ${
                          isCream
                            ? 'bg-amber-50/80 text-amber-950 border-amber-200'
                            : 'bg-[#0B101D] text-amber-300/90 border-slate-800'
                        }`}
                      >
                        ✨ <strong>Phân biệt:</strong> {h.foreignContrast}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ========================================================
                  TAB CONTENT 4: QUY TẮC & TRÁNH LỆCH CHUẨN
                 ======================================================== */}
              {activeTab === 'rules' && (
                <div className="space-y-2 animate-in fade-in duration-300 text-xs">
                  <div
                    className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${
                      isCream ? 'text-amber-950' : 'text-amber-400'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    BẢNG QUY TẮC PHÁT HIỆN LỆCH CHUẨN VĂN HÓA
                  </div>

                  {evaluation.warnings.length > 0 && (
                    <div className="space-y-2">
                      {evaluation.warnings.map((w) => (
                        <div
                          key={w.id}
                          className={`p-2.5 rounded-xl border text-left ${
                            w.severity === 'critical'
                              ? isCream
                                ? 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-rose-950/40 border-rose-500/60'
                              : isCream
                              ? 'bg-amber-50 border-amber-300 text-amber-950'
                              : 'bg-amber-950/40 border-amber-500/60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-0.5">
                            <span
                              className={
                                w.severity === 'critical'
                                  ? isCream
                                    ? 'text-rose-700'
                                    : 'text-rose-400'
                                  : isCream
                                  ? 'text-amber-800'
                                  : 'text-amber-400'
                              }
                            >
                              {w.levelBadge}
                            </span>
                          </div>
                          <p
                            className={`leading-relaxed text-[11px] font-semibold mb-1 ${
                              isCream ? 'text-stone-900' : 'text-slate-200'
                            }`}
                          >
                            {w.reason}
                          </p>
                          <p
                            className={`text-[10.5px] leading-relaxed p-1.5 rounded-lg ${
                              isCream
                                ? 'bg-amber-100/70 text-amber-950 border border-amber-200'
                                : 'bg-[#0B101D] text-amber-300'
                            }`}
                          >
                            💡 {w.culturalAdvice}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-xl border space-y-2 text-left ${
                      isCream ? 'bg-white border-amber-200/80 text-stone-800 shadow-2xs' : 'bg-[#131C2E] border-slate-700/60'
                    }`}
                  >
                    <div className={`border-b pb-1.5 ${isCream ? 'border-amber-200/60' : 'border-slate-700/60'}`}>
                      <div className={`font-bold text-[11px] ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                        1. Thả suông dáng chữ A (Không siết eo):
                      </div>
                      <p className={`text-[10.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                        Áo Ngũ Thân thả suông dáng chữ A hoặc đáy thúng tự nhiên. Thắt dải lụa siết eo là phong cách Hán phục Trung Quốc.
                      </p>
                    </div>

                    <div className={`border-b pb-1.5 ${isCream ? 'border-amber-200/60' : 'border-slate-700/60'}`}>
                      <div className={`font-bold text-[11px] ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                        2. Cổ áo Giao Lĩnh (Chữ Y vs Chữ Bát):
                      </div>
                      <p className={`text-[10.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                        Bắt buộc vạt trái đè lên vạt phải (hình chữ Y - chữ Kim). Cấm kỵ: Vạt phải đè vạt trái (Ý chữ Bát) là quy cách cho người đã mất.
                      </p>
                    </div>

                    <div>
                      <div className={`font-bold text-[11px] ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                        3. Áo Nhật Bình Cung Đình:
                      </div>
                      <p className={`text-[10.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                        Cổ đóng thành khung hình chữ nhật trước ngực, có dải ngũ sắc ngũ hành ở cửa tay. Giữ thẳng nghiêm trang, không xắn tay áo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons Bar */}
            <div className={`pt-2 border-t flex flex-col gap-2 ${
              isCream ? 'border-amber-200/80' : 'border-slate-700/60'
            }`}>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {/* Nút chính: Tải Poster Lookbook Di Sản (HD PNG) */}
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  disabled={isDownloading}
                  className="w-full sm:flex-1 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 disabled:opacity-60"
                  title="Tải Poster Lookbook Di Sản chất lượng cao (HD 1200x1800 PNG) về máy"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span>{downloadStatus || 'Đang kết xuất Poster HD...'}</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                      <span>Đã tải Poster HD thành công!</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-white" />
                      <span>Tải Poster Lookbook (HD PNG)</span>
                    </>
                  )}
                </button>

                {/* Nút chia sẻ */}
                <button
                  type="button"
                  onClick={handleShare}
                  className={`w-full sm:w-auto py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs shrink-0 ${
                    isCream
                      ? 'bg-white hover:bg-amber-50 text-stone-800 border-amber-200 hover:border-amber-400'
                      : 'bg-[#131C2E] hover:bg-[#1A2640] text-slate-100 border-slate-700 hover:border-amber-400/60'
                  }`}
                >
                  <Share2 className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                  <span>Chia Sẻ</span>
                </button>
              </div>

              {downloadSuccess && (
                <div
                  className={`text-[11.5px] border rounded-xl px-3 py-2 text-center animate-in fade-in flex items-center justify-center gap-2 font-medium ${
                    isCream
                      ? 'text-emerald-950 bg-emerald-50 border-emerald-300'
                      : 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50'
                  }`}
                >
                  <Check className={`w-4 h-4 ${isCream ? 'text-emerald-700' : 'text-emerald-400'} stroke-[3]`} />
                  <span>Tệp ảnh PNG HD (1200x1800) đã được tải xuống thiết bị của bạn!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FULLSCREEN POSTER PREVIEW MODAL */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-lg w-full max-h-[92vh] flex flex-col items-center">
            <button
              onClick={() => setShowFullscreenModal(false)}
              className="absolute -top-10 right-0 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Đóng</span>
            </button>

            <div className="w-full rounded-3xl overflow-hidden border-2 border-amber-500/50 bg-[#090D18] shadow-2xl relative h-[650px] flex flex-col justify-between">
              {/* Photo background */}
              <div className="absolute inset-0 pointer-events-none">
                <img
                  crossOrigin="anonymous"
                  src={selectedBackdrop.imageUrl}
                  alt={selectedBackdrop.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 ${
                    lightingFilter === 'sunset'
                      ? 'bg-amber-500/15'
                      : lightingFilter === 'moonlight'
                      ? 'bg-sky-500/15'
                      : lightingFilter === 'royal'
                      ? 'bg-yellow-500/15'
                      : 'bg-amber-900/18'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60" />
                <div className="absolute inset-4 rounded-2xl border border-amber-400/30" />
              </div>

              {/* Header */}
              <div className="relative z-20 p-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <AuraLogo className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-serif-vi font-bold tracking-[0.25em] uppercase text-amber-300">
                    AURA LOOKBOOK
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-black/60 text-amber-300 border border-amber-500/40">
                  {evaluation.matchedPeriod.eraName}
                </span>
              </div>

              {/* Mannequin Centered */}
              <div className="absolute inset-x-0 top-[56px] bottom-[165px] sm:bottom-[175px] flex items-center justify-center pointer-events-none z-10 px-4">
                <div className="w-full h-full flex items-center justify-center drop-shadow-2xl">
                  <AvatarModel
                    top={top}
                    bottom={bottom}
                    accessory={accessory}
                    fabric={fabric}
                    color={color}
                    topCustomColor={topCustomColor}
                    bottomCustomColor={bottomCustomColor}
                    harmonyScore={harmonyData?.score || 95}
                    showCulturePins={false}
                    hideOverlays={true}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="relative p-5 text-white z-20 text-left bg-gradient-to-t from-black/98 via-black/90 to-transparent pt-6 mt-auto border-t border-amber-500/30">
                <div className="flex items-center justify-between text-xs text-amber-300/80 mb-1">
                  <span>📍 {selectedBackdrop.name} • {selectedBackdrop.city}</span>
                  <span className="font-mono">{evaluation.matchedPeriod.periodText}</span>
                </div>
                <h3 className="font-serif-vi text-xl font-bold text-amber-100">
                  {editionTitle || `Dáng Hoa ${top.name}`}
                </h3>
                <div className="my-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30">
                  <p className="text-xs text-amber-200 font-serif-vi italic text-center leading-relaxed">
                    “{poetryCouple}”
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 mt-1.5">
                  <p className="text-[11px] text-slate-300 line-clamp-2 flex-1">
                    {personalNote}
                  </p>
                  {showSeal && (
                    <div className="px-2.5 py-1 rounded-md border border-red-500/80 bg-red-950/80 text-red-300 text-[10px] font-bold uppercase tracking-wider shrink-0 text-center">
                      <div>✓ DI SẢN VIỆT</div>
                      <div className="text-[9px] text-red-400 font-mono">CHUẨN MỰC</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleDownloadPoster}
                disabled={isDownloading}
                className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Camera className="w-4 h-4" />
                <span>Tải Poster HD Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL DIALOG */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border text-left transition-colors ${
              isCream
                ? 'bg-[#FFFDF9] text-stone-900 border-amber-300'
                : 'bg-[#0E1526] text-slate-100 border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`font-serif-vi text-lg font-bold flex items-center gap-2 ${
                  isCream ? 'text-amber-950' : 'text-amber-300'
                }`}
              >
                <Share2 className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                Chia Sẻ Lookbook Di Sản
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-1 rounded-lg cursor-pointer ${
                  isCream
                    ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs mb-4 leading-relaxed ${isCream ? 'text-stone-600' : 'text-slate-300'}`}>
              Lan tỏa vẻ đẹp chuẩn mực của {top.name} phối tại {selectedBackdrop.name} tới bạn bè và cộng đồng yêu Việt phục!
            </p>

            <div
              className={`p-3 border rounded-2xl flex items-center justify-between text-xs mb-5 ${
                isCream
                  ? 'bg-amber-50/70 border-amber-200 text-stone-800'
                  : 'bg-[#131C2E] border-slate-700/60 text-slate-300'
              }`}
            >
              <span
                className={`truncate max-w-[200px] font-mono text-[11px] ${
                  isCream ? 'text-stone-600' : 'text-slate-400'
                }`}
              >
                {window.location.href}
              </span>
              <button
                onClick={copyShareLink}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  isCream
                    ? 'bg-amber-200 text-amber-950 hover:bg-amber-300/80'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                {copiedLink ? 'Đã sao chép!' : 'Sao chép'}
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                isCream
                  ? 'bg-amber-100 hover:bg-amber-200/80 text-amber-950 border border-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* GUIDE MODAL DIALOG (HƯỚNG DẪN BIÊN TẬP LOOKBOOK) */}
      {showGuideModal && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border text-left relative overflow-hidden transition-colors ${
              isCream
                ? 'bg-[#FFFDF9] text-stone-900 border-amber-300'
                : 'bg-[#0E1526] text-slate-100 border-amber-500/40'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between pb-3 mb-4 border-b ${
                isCream ? 'border-amber-200/80' : 'border-amber-500/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isCream
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`font-serif-vi text-base sm:text-lg font-bold ${
                      isCream ? 'text-amber-950' : 'text-amber-200'
                    }`}
                  >
                    Hướng Dẫn Biên Tập Lookbook
                  </h3>
                  <p className={`text-[11px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                    4 bước xuất bản Poster Lookbook Nghệ Thuật (HD 1200x1800)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isCream
                    ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps list */}
            <div
              className="space-y-3 text-xs max-h-[60vh] overflow-y-auto custom-scrollbar pr-1"
              data-lenis-prevent="true"
            >
              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isCream ? 'bg-amber-50/70 border-amber-200/90 text-stone-800' : 'bg-[#131C2E] border-slate-700/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isCream
                      ? 'bg-amber-200 text-amber-950 border-amber-300'
                      : 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                  }`}
                >
                  1
                </span>
                <div>
                  <h4 className={`font-bold text-xs ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                    Chọn Thắng Cảnh & Ánh Sáng
                  </h4>
                  <p className={`text-[11.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                    Khám phá các danh thắng nổi tiếng (Hoàng thành Thăng Long, Cố đô Huế, Phố cổ Hội An...) và phối 4 bộ lọc ánh sáng hoàng kim.
                  </p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isCream ? 'bg-amber-50/70 border-amber-200/90 text-stone-800' : 'bg-[#131C2E] border-slate-700/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isCream
                      ? 'bg-amber-200 text-amber-950 border-amber-300'
                      : 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                  }`}
                >
                  2
                </span>
                <div>
                  <h4 className={`font-bold text-xs ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                    Đổi Tên, Đề Thơ & AI Sáng Tác
                  </h4>
                  <p className={`text-[11.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                    Tùy chỉnh tiêu đề ấn bản, chọn câu thơ cổ hoặc bấm <strong>✨ AI Sáng Tác</strong> để tự động tạo thơ và bút ký văn hóa.
                  </p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isCream ? 'bg-amber-50/70 border-amber-200/90 text-stone-800' : 'bg-[#131C2E] border-slate-700/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isCream
                      ? 'bg-amber-200 text-amber-950 border-amber-300'
                      : 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                  }`}
                >
                  3
                </span>
                <div>
                  <h4 className={`font-bold text-xs ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                    Khắc Triện Son Di Sản Chuẩn Mực
                  </h4>
                  <p className={`text-[11.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                    Bật con dấu triện son đỏ để chứng thực quy chuẩn phục chế cổ phục trên poster theo đúng quy chế lịch sử.
                  </p>
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border flex items-start gap-3 ${
                  isCream ? 'bg-amber-50/70 border-amber-200/90 text-stone-800' : 'bg-[#131C2E] border-slate-700/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border ${
                    isCream
                      ? 'bg-amber-200 text-amber-950 border-amber-300'
                      : 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                  }`}
                >
                  4
                </span>
                <div>
                  <h4 className={`font-bold text-xs ${isCream ? 'text-amber-950' : 'text-amber-300'}`}>
                    Tải Poster HD (PNG 1200x1800)
                  </h4>
                  <p className={`text-[11.5px] mt-0.5 leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                    Bấm <strong>Tải Poster Lookbook</strong> để kết xuất tệp ảnh chất lượng cao sắc nét, có thể in ấn hoặc chia sẻ lên mạng xã hội.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`mt-4 pt-3 border-t flex justify-end ${
                isCream ? 'border-amber-200/80' : 'border-slate-700/60'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
