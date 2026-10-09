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
  CulturalHallmark,
  DisambiguationRule,
  DynasticPeriod,
} from '../data/culturalRulesData';

interface LookbookScreenProps {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabric: FabricOption;
  color: ColorOption;
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

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  harmonyData,
  onBackToFitting,
  onSelectBottom,
}) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropOption>(BACKDROPS[0]);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Active view tab for the editorial inspector panel
  const [activeTab, setActiveTab] = useState<'story' | 'hallmarks' | 'timeline' | 'rules'>('story');

  // Authenticity and Cultural Rules Evaluation based on user's cultural text
  const evaluation = useMemo(() => {
    return evaluateOutfitAuthenticity(top, bottom, accessory);
  }, [top, bottom, accessory]);

  // AI Story state
  const [lookbookStory, setLookbookStory] = useState<{
    editionTitle: string;
    subHeadline: string;
    editorialStory: string;
    poetryCouple: string;
    photographerNote: string;
  }>({
    editionTitle: `Dáng Hoa ${top.name}`,
    subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${selectedBackdrop.name}`,
    editorialStory: `Dưới bóng tường thành rêu phong tại ${selectedBackdrop.name}, tà ${top.name} buông suông dáng chữ A đáy thúng thanh thoát, tôn vinh đường sống áo mũi gáy trung chính và năm cúc cài ngũ thường mẫu mực. Bản phối cùng ${bottom.name} và ${accessory.name} giữ vẹn nguyên quy cách quần hai ống thanh tao, hòa quyện kiêu hãnh giữa dòng chảy đương đại.`,
    poetryCouple: 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.',
    photographerNote: 'Ánh sáng vàng hoàng hôn góc 30 độ làm nổi bật chất óng ánh của tơ lụa, đường sống áo mũi gáy và hoa văn thêu tay.',
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch or generate AI story when backdrop or outfit changes
  useEffect(() => {
    let isMounted = true;
    const fetchStory = async () => {
      try {
        const generated = await getLookbookStory({
          top,
          bottom,
          accessory,
          backdropName: selectedBackdrop.name,
        });
        if (isMounted) {
          setLookbookStory(generated);
        }
      } catch {
        // Fallback provided
      }
    };
    fetchStory();
    return () => {
      isMounted = false;
    };
  }, [selectedBackdrop, top, bottom, accessory, color, fabric]);

  // High-Resolution Image Export (Canvas)
  const handleDownload = async () => {
    soundEngine.playPluck(783.99);
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Deep imperial background
        ctx.fillStyle = '#0A0E17';
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 38px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.fillText('AURA - LOOKBOOK DI SẢN VIỆT PHỤC', 540, 110);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '22px "Be Vietnam Pro", sans-serif';
        ctx.fillText('QUY CHUẨN TRANG PHỤC TRUYỀN THỐNG VIỆT NAM', 540, 155);

        // Center card container
        ctx.fillStyle = '#0E1526';
        ctx.fillRect(80, 210, 920, 1100);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 210, 920, 1100);

        // Photo Information
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 44px "Playfair Display", serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${top.name}`, 130, 310);

        ctx.fillStyle = '#F1F5F9';
        ctx.font = '26px "Be Vietnam Pro", sans-serif';
        ctx.fillText(`Phối cùng: ${bottom.name} • Phụ kiện: ${accessory.name}`, 130, 365);
        ctx.fillText(`Chất liệu: ${fabric.name} • Sắc màu: ${color.name}`, 130, 410);
        ctx.fillText(`Bối cảnh: ${selectedBackdrop.name} (${selectedBackdrop.city})`, 130, 455);
        ctx.fillText(`Niên đại: ${evaluation.matchedPeriod.eraName} (${evaluation.matchedPeriod.periodText})`, 130, 500);

        // Authenticity Status Seal
        const isAuth = evaluation.isAuthentic;
        ctx.fillStyle = isAuth ? '#10B981' : '#F59E0B';
        ctx.font = 'bold 26px "Be Vietnam Pro", sans-serif';
        ctx.fillText(
          isAuth ? '✓ ĐẠT QUY CHUẨN DI SẢN VIỆT' : '⚠ CẦN ĐIỀU CHỈNH QUẦN 2 ỐNG',
          130,
          560
        );

        // 4 Core Hallmarks bar
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
        ctx.fillText(
          'DẤU ẤN CỐT LÕI: 5 Thân Dáng Chữ A • 5 Khuy Ngũ Thường • Sống Áo Mũi Gáy • Quần 2 Ống',
          130,
          610
        );

        // Editorial Story Wrap
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'italic 25px "Be Vietnam Pro", sans-serif';
        const words = lookbookStory.editorialStory.split(' ');
        let line = '';
        let y = 680;
        for (const n of words) {
          const testLine = line + n + ' ';
          if (ctx.measureText(testLine).width > 820) {
            ctx.fillText(line, 130, y);
            line = n + ' ';
            y += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 130, y);

        // Poetic Couplet
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 30px "Playfair Display", serif';
        ctx.fillText(`“ ${lookbookStory.poetryCouple} ”`, 130, y + 80);

        // Cultural note box at bottom
        ctx.fillStyle = '#141E34';
        ctx.fillRect(130, y + 130, 820, 160);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(130, y + 130, 820, 160);

        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
        ctx.fillText('LƯU Ý VĂN HÓA & PHÂN BIỆT HÁN PHỤC:', 155, y + 175);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '19px "Be Vietnam Pro", sans-serif';
        ctx.fillText('• Thả suông tà chữ A đáy thúng tự nhiên, không dùng dải lụa to bản siết eo.', 155, y + 215);
        ctx.fillText('• Quần 2 ống bắt buộc cho dáng dài, không mặc Váy Mã Diện Hán phục.', 155, y + 245);
        ctx.fillText('• Đường sống áo mũi gáy trung chính giữa lưng tượng trưng lòng ngay thẳng.', 155, y + 275);

        // Footer note
        ctx.fillStyle = '#64748B';
        ctx.font = '22px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Aura Team • Biên Niên Sử Việt Phục AI Studio 2026', 540, 1850);

        // Download link
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Aura_Lookbook_${top.id}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
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
    <div className="min-h-screen w-full bg-[#0A0E17] text-slate-100 flex flex-col relative overflow-x-hidden font-sans-vi">
      {/* Background Ambience */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none bg-cover bg-center blur-2xl scale-110"
        style={{ backgroundImage: `url(${selectedBackdrop.imageUrl})` }}
      />

      {/* Decorative Traditional Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -bottom-36 -right-36 opacity-20">
          <DongSonDrumMandala className="w-[500px] h-[500px]" opacity={0.25} />
        </div>
        <div className="absolute top-12 right-10 opacity-25">
          <CoPhongCloud className="w-52 h-28" flipX />
        </div>
      </div>

      {/* Breadcrumb & Navigation Sub-Bar */}
      <div className="relative z-20 w-full border-b border-slate-800/80 bg-[#0C1220]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBackToFitting}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Quay lại Phòng Thử Đồ</span>
          </button>

        </div>
      </div>

      {/* MAIN RESPONSIVE CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Scenery Selector Header */}
        <div className="w-full mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                BỘ SƯU TẬP NGOẠI CẢNH & GIÁM ĐỊNH DI SẢN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-vi text-amber-200 mt-1">
              Lookbook Di Sản Chuẩn Mực
            </h1>
          </div>

          {/* Backdrop Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
            <span className="text-slate-400 text-xs whitespace-nowrap flex items-center gap-1 mr-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Chọn bối cảnh:
            </span>
            {BACKDROPS.map((bd) => (
              <button
                key={bd.id}
                onClick={() => {
                  setSelectedBackdrop(bd);
                  soundEngine.playPluck(440);
                }}
                className={`px-3 py-1 rounded-xl whitespace-nowrap text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedBackdrop.id === bd.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-md'
                    : 'bg-[#121A2C] text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {bd.name}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE: Grid Split View */}
        <div
          ref={cardRef}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0E1526]/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-4 sm:p-6 shadow-[0_16px_56px_rgba(0,0,0,0.7)]"
        >
          {/* ==========================================================
              LEFT COLUMN: Editorial Scenery Photo & High-Fidelity Silhouette
             ========================================================== */}
          <div className="md:col-span-6 lg:col-span-6 rounded-2xl overflow-hidden border border-amber-500/30 bg-[#090D18] relative min-h-[500px] sm:min-h-[560px] md:min-h-[640px] flex flex-col justify-between shadow-2xl group">
            {/* Real World Backdrop Photo */}
            <div className="absolute inset-0">
              <img
                src={selectedBackdrop.imageUrl}
                alt={selectedBackdrop.name}
                className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05] transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E18] via-black/25 to-black/45 pointer-events-none" />
            </div>

            {/* Top Magazine Badges */}
            <div className="relative p-5 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-2">
                <AuraLogo className="w-6 h-6" />
                <span className="text-xs font-serif-vi font-bold tracking-[0.25em] uppercase drop-shadow-md text-amber-300">
                  AURA LOOKBOOK
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 shadow-md ${
                  evaluation.isAuthentic
                    ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-400/50 text-amber-300'
                }`}
              >
                {evaluation.isAuthentic ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                {evaluation.isAuthentic ? 'CHUẨN MỰC DI SẢN' : 'CÓ LƯU Ý PHỐI'}
              </span>
            </div>

            {/* Model Avatar Silhouette composite strictly rendered with the 4 core hallmarks */}
            <div className="absolute inset-x-0 bottom-8 top-14 flex items-center justify-center pointer-events-none">
              <div className="w-60 sm:w-72 h-[420px] sm:h-[480px] relative drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] opacity-95">
                <svg viewBox="0 0 400 680" className="w-full h-full drop-shadow-2xl">
                  {/* Silhouette Ground Shadow */}
                  <ellipse cx="200" cy="625" rx="100" ry="14" fill="#000000" opacity="0.75" />

                  {/* Head & Hair */}
                  <ellipse cx="200" cy="80" rx="36" ry="40" fill="#1C1817" />
                  <ellipse cx="200" cy="95" rx="24" ry="28" fill="#F4D3C0" />

                  {/* Head accessory */}
                  {accessory.id === 'man-ngu-sac' ? (
                    <g>
                      <path d="M166 70 Q200 48 234 70 Q200 62 166 70 Z" fill="#D4AF37" />
                      <ellipse cx="200" cy="58" rx="34" ry="10" fill="#8B1E1E" stroke="#D4AF37" strokeWidth="1" />
                    </g>
                  ) : accessory.id === 'khan-dong' ? (
                    <ellipse cx="200" cy="68" rx="36" ry="14" fill="#1A1817" stroke="#3D3634" strokeWidth="1.5" />
                  ) : accessory.id === 'man-doi-dau' ? (
                    <ellipse cx="200" cy="68" rx="34" ry="12" fill="#2E4A62" stroke="#D4AF37" strokeWidth="1" />
                  ) : null}

                  {/* GARMENT BODY */}
                  {top.id === 'tu-than' ? (
                    <g>
                      <path d="M175 140 Q200 170 225 140 L220 280 L180 280 Z" fill="#B23A48" />
                      <path d="M150 145 L175 140 L180 320 L140 480 Z" fill={color.hex} opacity="0.95" />
                      <path d="M250 145 L225 140 L220 320 L260 480 Z" fill={color.hex} opacity="0.95" />
                      <circle cx="200" cy="315" r="9" fill="#D4AF37" />
                      <path d="M195 320 L185 410 M205 320 L215 410" stroke="#D4AF37" strokeWidth="4" />
                    </g>
                  ) : top.id === 'giao-linh' ? (
                    <g>
                      <path d="M145 145 L255 145 L275 480 Q200 495 125 480 Z" fill={color.hex} />
                      <path d="M170 135 L215 220" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
                      <path d="M230 135 L180 240" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
                    </g>
                  ) : (
                    <g>
                      <path
                        d="M145 145 L255 145 L275 485 Q200 500 125 485 Z"
                        fill={color.hex}
                        stroke="rgba(0,0,0,0.35)"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="200"
                        y1="145"
                        x2="200"
                        y2="495"
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.85"
                      />
                      <line x1="145" y1="230" x2="168" y2="235" stroke="#D4AF37" strokeWidth="1.5" opacity="0.75" />
                      <line x1="255" y1="230" x2="232" y2="235" stroke="#D4AF37" strokeWidth="1.5" opacity="0.75" />

                      {top.id !== 'nhat-binh' && (
                        <g>
                          <path d="M186 135 Q200 138 214 135 L214 148 Q200 151 186 148 Z" fill="#D4AF37" />
                          <circle cx="212" cy="142" r="3" fill="#FFFBEB" stroke="#8B1E1E" strokeWidth="1" />
                          <circle cx="218" cy="165" r="3" fill="#FFFBEB" stroke="#8B1E1E" strokeWidth="1" />
                          <circle cx="224" cy="190" r="3" fill="#FFFBEB" stroke="#8B1E1E" strokeWidth="1" />
                          <circle cx="228" cy="220" r="3" fill="#FFFBEB" stroke="#8B1E1E" strokeWidth="1" />
                          <circle cx="230" cy="250" r="3" fill="#FFFBEB" stroke="#8B1E1E" strokeWidth="1" />
                        </g>
                      )}

                      {top.id === 'nhat-binh' && (
                        <g>
                          <rect x="184" y="145" width="32" height="135" fill="#D4AF37" stroke="#8B1E1E" strokeWidth="1.5" />
                          <line x1="192" y1="280" x2="188" y2="390" stroke="#FDE68A" strokeWidth="3" />
                          <line x1="208" y1="280" x2="212" y2="390" stroke="#FDE68A" strokeWidth="3" />
                          <g transform="translate(130, 310)">
                            <rect x="0" y="0" width="8" height="20" fill="#2563EB" />
                            <rect x="0" y="4" width="8" height="4" fill="#DC2626" />
                            <rect x="0" y="8" width="8" height="4" fill="#F59E0B" />
                            <rect x="0" y="12" width="8" height="4" fill="#FFFFFF" />
                            <rect x="0" y="16" width="8" height="4" fill="#1E293B" />
                          </g>
                          <g transform="translate(262, 310)">
                            <rect x="0" y="0" width="8" height="20" fill="#2563EB" />
                            <rect x="0" y="4" width="8" height="4" fill="#DC2626" />
                            <rect x="0" y="8" width="8" height="4" fill="#F59E0B" />
                            <rect x="0" y="12" width="8" height="4" fill="#FFFFFF" />
                            <rect x="0" y="16" width="8" height="4" fill="#1E293B" />
                          </g>
                        </g>
                      )}
                    </g>
                  )}

                  {/* BOTTOM */}
                  {bottom.id === 'vay-xep-ly' ? (
                    <path
                      d="M142 420 L115 605 L285 605 L258 420 Z"
                      fill={bottom.defaultColorHex}
                      opacity="0.95"
                    />
                  ) : (
                    <g>
                      <path d="M145 420 L120 605 L192 605 L196 440 Z" fill={bottom.defaultColorHex} opacity="0.96" />
                      <path d="M255 420 L280 605 L208 605 L204 440 Z" fill={bottom.defaultColorHex} opacity="0.96" />
                      <line x1="156" y1="440" x2="156" y2="600" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                      <line x1="244" y1="440" x2="244" y2="600" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                    </g>
                  )}

                  {accessory.id === 'quat-lua' && (
                    <g>
                      <path d="M130 330 L100 295 Q135 270 170 295 L140 330 Z" fill="#FDFBF7" stroke="#D4AF37" strokeWidth="1.5" />
                      <line x1="135" y1="315" x2="110" y2="295" stroke="#D4AF37" strokeWidth="0.8" />
                      <line x1="135" y1="315" x2="135" y2="280" stroke="#D4AF37" strokeWidth="0.8" />
                      <line x1="135" y1="315" x2="160" y2="295" stroke="#D4AF37" strokeWidth="0.8" />
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Bottom Title & Badges */}
            <div className="relative p-5 text-white z-20 text-left">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {lookbookStory.editionTitle}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-900/80 border border-slate-700 text-slate-300">
                  {evaluation.matchedPeriod.eraName}
                </span>
              </div>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold leading-tight text-amber-100 drop-shadow-md">
                {top.name} • {selectedBackdrop.city}
              </h3>
              <p className="text-xs text-slate-300 mt-1 italic drop-shadow-xs line-clamp-2">
                {lookbookStory.subHeadline}
              </p>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Cultural Inspection Tabs & Actions
             ========================================================== */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between text-left space-y-3">
            <div>
              {/* Authenticity Assessment Alert Bar */}
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-md mb-3 transition-all ${
                  evaluation.isAuthentic
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                }`}
              >
                {evaluation.isAuthentic ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-serif-vi font-bold">
                      {evaluation.isAuthentic
                        ? 'Đạt Quy Chuẩn Di Sản Việt Phục'
                        : 'Lưu Ý Quy Thức Việt Phục'}
                    </strong>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/40 font-bold">
                      {evaluation.matchedPeriod.periodText}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300">
                    {evaluation.keyAdvice}
                  </p>

                  {!evaluation.isAuthentic && onSelectBottom && (
                    <button
                      onClick={handleQuickFixPants}
                      className="mt-2.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Đổi sang Quần Ống Sớ Lụa Bạch (Chuẩn 2 ống)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inspector View Navigation Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#131C2E] border border-slate-700/60 rounded-2xl mb-4 text-center">
                <button
                  onClick={() => {
                    setActiveTab('story');
                    soundEngine.playPluck(440);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'story'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lời Bình AI
                </button>
                <button
                  onClick={() => {
                    setActiveTab('hallmarks');
                    soundEngine.playPluck(493.88);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'hallmarks'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  4 Dấu Hiệu
                </button>
                <button
                  onClick={() => {
                    setActiveTab('timeline');
                    soundEngine.playPluck(523.25);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tiến Trình
                </button>
                <button
                  onClick={() => {
                    setActiveTab('rules');
                    soundEngine.playPluck(587.33);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'rules'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tránh Lệch
                </button>
              </div>

              {/* TAB CONTENT 1: Editorial Story & Poetry */}
              {activeTab === 'story' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-2xl bg-[#131C2E] border border-amber-500/30 flex items-start gap-3 shadow-inner">
                    <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="font-serif-vi text-sm italic text-amber-200/95 leading-relaxed">
                      “{lookbookStory.poetryCouple}”
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-vi">
                    {lookbookStory.editorialStory}
                  </p>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                      <strong className="text-amber-400 shrink-0">Cổ áo & Phom dáng:</strong>
                      <span className="text-slate-300">{top.cultureInfo.collarType}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                      <strong className="text-amber-400 shrink-0">Biểu trưng & Triều đại:</strong>
                      <span className="text-slate-300">
                        {top.cultureInfo.symbolism} ({evaluation.matchedPeriod.eraName})
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                      <strong className="text-amber-300 shrink-0">Ghi chú nhiếp ảnh:</strong>
                      <span className="text-slate-300">{lookbookStory.photographerNote}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: 4 Core Hallmarks */}
              {activeTab === 'hallmarks' && (
                <div className="space-y-2.5 animate-in fade-in duration-300 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar text-xs">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    4 DẤU HIỆU CỐT LÕI PHÂN BIỆT VỚI HÁN PHỤC / HANBOK
                  </div>

                  {CULTURAL_CORE_HALLMARKS.map((hm) => (
                    <div
                      key={hm.id}
                      className="p-3 rounded-2xl bg-[#131C2E] border border-slate-700/70 hover:border-amber-500/40 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="font-bold text-amber-300 font-serif-vi flex items-center gap-1.5">
                          <span>{hm.icon}</span>
                          <span>{hm.title}</span>
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                          {hm.badge}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed mb-1.5 font-medium">
                        🇻🇳 <strong className="text-amber-200">Việt Nam:</strong> {hm.vietnamTrait}
                      </p>
                      <p className="text-slate-400 leading-relaxed bg-[#0C1220] p-2 rounded-xl text-[11px] border border-slate-800">
                        ⚡ {hm.foreignContrast}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB CONTENT 3: Dynastic Timeline */}
              {activeTab === 'timeline' && (
                <div className="space-y-2.5 animate-in fade-in duration-300 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar text-xs">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    DANH MỤC VIỆT PHỤC THEO TIẾN TRÌNH LỊCH SỬ
                  </div>

                  {DYNASTIC_PERIODS.map((p) => {
                    const isCurrentPeriod = evaluation.matchedPeriod.eraId === p.eraId;
                    return (
                      <div
                        key={p.eraId}
                        className={`p-3 rounded-2xl border transition-all text-left ${
                          isCurrentPeriod
                            ? 'bg-[#18243C] border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-[#131C2E] border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-slate-100 font-serif-vi flex items-center gap-1.5">
                            <span className={isCurrentPeriod ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                              {p.eraName}
                            </span>
                            {isCurrentPeriod && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                                BỘ HIỆN TẠI
                              </span>
                            )}
                          </h5>
                          <span className="text-[10px] text-amber-300/80">{p.periodText}</span>
                        </div>
                        <div className="text-[11px] text-amber-200 mb-1 font-semibold">
                          Y phục: {p.garments.join(' • ')}
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px] mb-1">
                          {p.identity}
                        </p>
                        <div className="text-[10px] text-emerald-400 leading-relaxed bg-[#0B101D] p-1.5 rounded-lg border border-slate-800">
                          🎯 <strong>Thích hợp mặc:</strong> {p.suitableOccasions}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB CONTENT 4: Cultural Disambiguation */}
              {activeTab === 'rules' && (
                <div className="space-y-2.5 animate-in fade-in duration-300 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar text-xs">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    BẢNG QUY TẮC PHÁT HIỆN LỆCH CHUẨN VĂN HÓA
                  </div>

                  {evaluation.warnings.length > 0 && (
                    <div className="space-y-2">
                      {evaluation.warnings.map((w) => (
                        <div
                          key={w.id}
                          className={`p-3 rounded-2xl border text-left ${
                            w.severity === 'critical'
                              ? 'bg-rose-950/40 border-rose-500/60'
                              : 'bg-amber-950/40 border-amber-500/60'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <span className={w.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}>
                              {w.levelBadge}
                            </span>
                          </div>
                          <p className="text-slate-200 leading-relaxed font-semibold mb-1">
                            {w.reason}
                          </p>
                          <p className="text-xs text-amber-300 leading-relaxed bg-[#0B101D] p-2 rounded-xl">
                            💡 {w.culturalAdvice}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-2xl bg-[#131C2E] border border-slate-700/60 space-y-2 text-left">
                    <div className="border-b border-slate-700/60 pb-2">
                      <div className="font-bold text-amber-300">
                        1. Thả suông dáng chữ A (Không siết eo):
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        Áo Ngũ Thân thả suông dáng chữ A hoặc đáy thúng tự nhiên. Thắt dải lụa siết eo là phong cách Hán phục Trung Quốc.
                      </p>
                    </div>

                    <div className="border-b border-slate-700/60 pb-2">
                      <div className="font-bold text-amber-300">
                        2. Cổ áo Giao Lĩnh (Chữ Y vs Chữ Ý):
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        Bắt buộc vạt trái đè lên vạt phải (hình chữ Y - chữ Kim). Cấm kỵ: Vạt phải đè vạt trái (Ý chữ Bát) là quy cách cho người đã mất (Phục xới).
                      </p>
                    </div>

                    <div className="border-b border-slate-700/60 pb-2">
                      <div className="font-bold text-amber-300">
                        3. Áo Nhật Bình Cung Đình:
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        Cổ đóng thành khung hình chữ nhật trước ngực, có dải ngũ sắc ngũ hành ở cửa tay. Giữ thẳng nghiêm trang, không khoác lệch vai hoặc xắn tay áo.
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-amber-300">
                        4. Phụ kiện bản địa chuẩn mực:
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                        Ưu tiên Nón lá, Nón ba tầm, Khăn lươn, Mấn đội đầu, Khăn rằn, Guốc gỗ. Tránh quạt tròn cài tóc rườm rà dạng Cung đình phim Trung Quốc.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#131C2E] hover:bg-[#1A2640] text-slate-100 border border-slate-700 hover:border-amber-400/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isDownloading ? 'Đang xuất ảnh...' : 'Tải Lookbook Chuẩn'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </main>


      {/* SHARE MODAL DIALOG */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-[#0E1526] text-slate-100 p-6 shadow-2xl border border-amber-500/30 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-vi text-lg font-bold text-amber-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                Chia Sẻ Lookbook Di Sản
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Lan tỏa vẻ đẹp chuẩn mực của {top.name} phối tại {selectedBackdrop.name} tới bạn bè và cộng đồng yêu Việt phục!
            </p>

            <div className="p-3 bg-[#131C2E] border border-slate-700/60 rounded-2xl flex items-center justify-between text-xs text-slate-300 mb-5">
              <span className="truncate max-w-[200px] font-mono text-[11px] text-slate-400">
                {window.location.href}
              </span>
              <button
                onClick={copyShareLink}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold cursor-pointer"
              >
                {copiedLink ? 'Đã sao chép!' : 'Sao chép'}
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
