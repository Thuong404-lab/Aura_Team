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
  Bookmark,
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
  Search,
  Clock,
  X,
  RotateCcw,
  Trash2,
  ArrowRight,
  ArrowUpDown,
  Tag,
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

export interface SavedLookbookItem {
  id: string;
  date: string;
  timestamp?: number;
  category?: string;
  era?: string;
  title: string;
  topName: string;
  bottomName: string;
  accessoryName: string;
  backdropName: string;
  score: number;
  aiStory: string;
}

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
  onSaveLookbook: (item: SavedLookbookItem) => void;
  savedItems: SavedLookbookItem[];
  onOpenSavedDrawer: () => void;
  onSelectBottom?: (item: WardrobeItem) => void;
  onLoadSavedItem?: (item: SavedLookbookItem) => void;
  onLoadSavedInLookbook?: (item: SavedLookbookItem) => void;
  onDeleteSavedItem?: (id: string) => void;
}

// Helpers for timestamp and category identification
function getItemTimestamp(item: SavedLookbookItem): number {
  if (item.timestamp && item.timestamp > 0) return item.timestamp;
  try {
    const parts = item.date.split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return d.getTime();
    }
  } catch {
    // fallback
  }
  return 0;
}

function getItemCategory(item: SavedLookbookItem): string {
  if (item.category && item.category !== 'all') return item.category;
  if (item.era) return item.era;
  const name = (item.topName || '').toLowerCase();
  if (name.includes('nhật bình') || name.includes('ngũ thân') || name.includes('áo tấc') || name.includes('tấc')) {
    return 'Triều Nguyễn';
  }
  if (name.includes('đối khâm')) {
    return 'Thời Lê';
  }
  if (name.includes('giao lĩnh') || name.includes('viên lĩnh')) {
    return 'Thời Lý - Trần';
  }
  if (name.includes('tứ thân') || name.includes('bà ba') || name.includes('yếm')) {
    return 'Dân Gian';
  }
  if (name.includes('cách tân') || name.includes('hiện đại')) {
    return 'Cách Tân';
  }
  return 'Triều Nguyễn';
}

export const LookbookScreen: React.FC<LookbookScreenProps> = ({
  top,
  bottom,
  accessory,
  fabric,
  color,
  harmonyData,
  onBackToFitting,
  onSaveLookbook,
  savedItems,
  onOpenSavedDrawer,
  onSelectBottom,
  onLoadSavedItem,
  onLoadSavedInLookbook,
  onDeleteSavedItem,
}) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropOption>(BACKDROPS[0]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Active view tab for the editorial inspector panel
  const [activeTab, setActiveTab] = useState<'story' | 'hallmarks' | 'timeline' | 'rules'>('story');

  // SAVED OUTFITS DRAWER & FILTER STATES
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [savedSearchQuery, setSavedSearchQuery] = useState<string>('');
  const [savedCategoryFilter, setSavedCategoryFilter] = useState<string>('all');
  const [savedTimeFilter, setSavedTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [savedSortBy, setSavedSortBy] = useState<'newest' | 'oldest' | 'highest_score'>('newest');

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

  // Handle Save Lookbook
  const handleSave = () => {
    soundEngine.playPluck(659.25);
    const item: SavedLookbookItem = {
      id: `lb-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      timestamp: Date.now(),
      category: top.era || 'Triều Nguyễn',
      era: top.era || 'Triều Nguyễn',
      title: `${top.name} tại ${selectedBackdrop.city}`,
      topName: top.name,
      bottomName: bottom.name,
      accessoryName: accessory.name,
      backdropName: selectedBackdrop.name,
      score: (harmonyData?.score || 95) + evaluation.scoreAdjustment,
      aiStory: lookbookStory.editorialStory,
    };
    onSaveLookbook(item);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

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

  // ==========================================
  // SAVED OUTFITS FILTERING AND SORTING LOGIC
  // ==========================================
  const categoryOptions = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Triều Nguyễn', label: 'Triều Nguyễn' },
    { id: 'Thời Lê', label: 'Thời Lê' },
    { id: 'Thời Lý - Trần', label: 'Thời Lý - Trần' },
    { id: 'Dân Gian', label: 'Dân Gian' },
    { id: 'Cách Tân', label: 'Cách Tân' },
  ];

  const timeOptions = [
    { id: 'all', label: 'Toàn bộ thời gian' },
    { id: 'today', label: 'Hôm nay' },
    { id: 'week', label: '7 ngày qua' },
    { id: 'month', label: 'Tháng này' },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: savedItems.length };
    categoryOptions.forEach((opt) => {
      if (opt.id !== 'all') counts[opt.id] = 0;
    });
    savedItems.forEach((item) => {
      const cat = getItemCategory(item);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [savedItems]);

  const timeCounts = useMemo(() => {
    const now = Date.now();
    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;
    savedItems.forEach((item) => {
      const t = getItemTimestamp(item);
      if (t > 0) {
        const diff = now - t;
        const itemDate = new Date(t);
        const nowDate = new Date(now);
        if (
          itemDate.getDate() === nowDate.getDate() &&
          itemDate.getMonth() === nowDate.getMonth() &&
          itemDate.getFullYear() === nowDate.getFullYear()
        ) {
          todayCount++;
        }
        if (diff <= 7 * 24 * 60 * 60 * 1000) weekCount++;
        if (diff <= 30 * 24 * 60 * 60 * 1000) monthCount++;
      }
    });
    return { all: savedItems.length, today: todayCount, week: weekCount, month: monthCount };
  }, [savedItems]);

  const filteredSavedItems = useMemo(() => {
    const now = Date.now();
    return savedItems
      .filter((item) => {
        // 1. Search Query filter
        if (savedSearchQuery.trim()) {
          const q = savedSearchQuery.toLowerCase().trim();
          const matchTitle = (item.title || '').toLowerCase().includes(q);
          const matchTop = (item.topName || '').toLowerCase().includes(q);
          const matchBottom = (item.bottomName || '').toLowerCase().includes(q);
          const matchAcc = (item.accessoryName || '').toLowerCase().includes(q);
          const matchBackdrop = (item.backdropName || '').toLowerCase().includes(q);
          if (!matchTitle && !matchTop && !matchBottom && !matchAcc && !matchBackdrop) {
            return false;
          }
        }

        // 2. Category filter
        if (savedCategoryFilter !== 'all') {
          const cat = getItemCategory(item);
          if (cat !== savedCategoryFilter) {
            return false;
          }
        }

        // 3. Time filter
        if (savedTimeFilter !== 'all') {
          const itemTime = getItemTimestamp(item);
          if (itemTime > 0) {
            const diffMs = now - itemTime;
            if (savedTimeFilter === 'today') {
              const itemDate = new Date(itemTime);
              const nowDate = new Date(now);
              if (
                itemDate.getDate() !== nowDate.getDate() ||
                itemDate.getMonth() !== nowDate.getMonth() ||
                itemDate.getFullYear() !== nowDate.getFullYear()
              ) {
                return false;
              }
            } else if (savedTimeFilter === 'week') {
              if (diffMs > 7 * 24 * 60 * 60 * 1000) return false;
            } else if (savedTimeFilter === 'month') {
              if (diffMs > 30 * 24 * 60 * 60 * 1000) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (savedSortBy === 'highest_score') {
          return b.score - a.score;
        }
        const timeA = getItemTimestamp(a);
        const timeB = getItemTimestamp(b);
        if (savedSortBy === 'oldest') {
          return timeA - timeB;
        }
        // newest first (default)
        return timeB - timeA;
      });
  }, [savedItems, savedSearchQuery, savedCategoryFilter, savedTimeFilter, savedSortBy]);

  const hasActiveFilters =
    savedSearchQuery.trim() !== '' ||
    savedCategoryFilter !== 'all' ||
    savedTimeFilter !== 'all' ||
    savedSortBy !== 'newest';

  const handleResetFilters = () => {
    soundEngine.playPluck(440);
    setSavedSearchQuery('');
    setSavedCategoryFilter('all');
    setSavedTimeFilter('all');
    setSavedSortBy('newest');
  };

  // Actions on saved outfit items
  const handleSelectSavedInLookbook = (item: SavedLookbookItem) => {
    soundEngine.playPluck(523.25);
    const foundBd = BACKDROPS.find(
      (b) => b.name.toLowerCase() === (item.backdropName || '').toLowerCase()
    );
    if (foundBd) {
      setSelectedBackdrop(foundBd);
    }
    if (onLoadSavedInLookbook) {
      onLoadSavedInLookbook(item);
    }
    setIsSavedDrawerOpen(false);
  };

  const handleOpenInFittingRoom = (item: SavedLookbookItem) => {
    soundEngine.playPluck(587.33);
    if (onLoadSavedItem) {
      onLoadSavedItem(item);
    }
    setIsSavedDrawerOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    soundEngine.playPluck(330);
    if (onDeleteSavedItem) {
      onDeleteSavedItem(id);
    }
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

          {/* Saved Outfits Management Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playPluck(493.88);
                setIsSavedDrawerOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#141E34] hover:bg-amber-500/20 text-slate-200 border border-slate-700/60 hover:border-amber-400/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Quản lý bản phối ({savedItems.length})</span>
            </button>
          </div>
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
            <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full sm:flex-1 py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#131C2E] hover:bg-[#1A2640] text-slate-100 border border-slate-700 hover:border-amber-400/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isDownloading ? 'Đang xuất ảnh...' : 'Tải Lookbook Chuẩn'}</span>
              </button>

              <button
                onClick={handleSave}
                className={`w-full sm:flex-1 py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#131C2E] hover:bg-[#1A2640] text-slate-100 border border-slate-700 hover:border-amber-400/60'
                }`}
              >
                {isSaved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4 text-amber-400" />
                )}
                <span>{isSaved ? 'Đã lưu thành công!' : 'Lưu lại'}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full sm:flex-1 py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-105"
              >
                <Share2 className="w-4 h-4 text-slate-950" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ==========================================================
          SAVED LOOKBOOKS MANAGEMENT DRAWER (WITH FILTERS & TIME SORT)
         ========================================================== */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0E1526] text-slate-100 p-5 sm:p-6 shadow-2xl border border-amber-500/30 flex flex-col justify-between overflow-hidden text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-xs">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif-vi text-xl font-bold text-amber-300 flex items-center gap-2">
                    <span>Kho Bản Phối Di Sản</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-sans-vi font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {savedItems.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lọc theo triều đại danh mục hoặc thời gian để dễ dàng quản lý
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FILTER CONTROLS AREA */}
            <div className="pt-3 pb-2 space-y-3 border-b border-slate-800/80">
              {/* Row 1: Search & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={savedSearchQuery}
                    onChange={(e) => setSavedSearchQuery(e.target.value)}
                    placeholder="Tìm theo tên áo, bối cảnh, phụ kiện..."
                    className="w-full bg-[#131C2E] border border-slate-700/70 focus:border-amber-400/80 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
                  />
                  {savedSearchQuery && (
                    <button
                      onClick={() => setSavedSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-1.5 shrink-0 bg-[#131C2E] border border-slate-700/70 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                  <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-slate-400 hidden sm:inline">Sắp xếp:</span>
                  <select
                    value={savedSortBy}
                    onChange={(e) => setSavedSortBy(e.target.value as any)}
                    className="bg-transparent text-amber-300 font-semibold focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="newest" className="bg-[#0E1526] text-slate-200">
                      Mới nhất trước
                    </option>
                    <option value="oldest" className="bg-[#0E1526] text-slate-200">
                      Cũ nhất trước
                    </option>
                    <option value="highest_score" className="bg-[#0E1526] text-slate-200">
                      Điểm cao nhất
                    </option>
                  </select>
                </div>
              </div>

              {/* Row 2: Category Filter Pills */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1 text-amber-400/90 uppercase tracking-wider">
                    <Tag className="w-3 h-3 text-amber-400" /> Danh mục / Triều đại:
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-normal text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" /> Đặt lại bộ lọc
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {categoryOptions.map((cat) => {
                    const isSelected = savedCategoryFilter === cat.id;
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSavedCategoryFilter(cat.id);
                          soundEngine.playPluck(440);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-400/70 shadow-xs'
                            : 'bg-[#131C2E] text-slate-400 hover:text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Time Filter Pills */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-semibold uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-amber-400" /> Thời gian lưu:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {timeOptions.map((timeOpt) => {
                    const isSelected = savedTimeFilter === timeOpt.id;
                    const count = timeCounts[timeOpt.id as keyof typeof timeCounts] || 0;
                    return (
                      <button
                        key={timeOpt.id}
                        onClick={() => {
                          setSavedTimeFilter(timeOpt.id as any);
                          soundEngine.playPluck(493.88);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-400/70 shadow-xs'
                            : 'bg-[#131C2E] text-slate-400 hover:text-slate-200 border border-slate-700/60'
                        }`}
                      >
                        <span>{timeOpt.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LIST OF FILTERED SAVED OUTFITS */}
            <div className="my-3 overflow-y-auto flex-1 pr-1 space-y-2.5 custom-scrollbar min-h-[220px]">
              {filteredSavedItems.length === 0 ? (
                <div className="text-center py-10 text-slate-400 flex flex-col items-center justify-center">
                  <Bookmark className="w-10 h-10 mb-2 opacity-30 text-amber-400" />
                  <p className="font-serif-vi text-sm font-bold text-slate-200">
                    Không tìm thấy bản phối nào phù hợp
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                    {hasActiveFilters
                      ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại danh mục / thời gian.'
                      : 'Hãy lưu các bản phối yêu thích từ Lookbook để quản lý tại đây!'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-[#131C2E] hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại bộ lọc</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredSavedItems.map((item) => {
                  const itemCategory = getItemCategory(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-[#131C2E] border border-slate-700/70 hover:border-amber-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-serif-vi font-bold text-sm sm:text-base text-slate-100">
                            {item.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {itemCategory}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-emerald-400" />
                            {item.score} Điểm
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          <strong className="text-amber-400 font-semibold">{item.topName}</strong> • {item.bottomName} • {item.accessoryName}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                          </span>
                          <span>• Bối cảnh: <strong className="text-slate-300 font-normal">{item.backdropName}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                        {/* Option 1: View in Lookbook directly */}
                        <button
                          onClick={() => handleSelectSavedInLookbook(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1A2640] hover:bg-[#223356] text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                          title="Xem bản phối này ngay trong Lookbook"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem Lookbook</span>
                        </button>

                        {/* Option 2: Open in Fitting Room */}
                        <button
                          onClick={() => handleOpenInFittingRoom(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all flex items-center gap-1 shadow-md hover:brightness-105 cursor-pointer"
                          title="Chuyển vào Phòng thử đồ để phối thêm"
                        >
                          <span>Thử đồ</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {/* Option 3: Delete */}
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Xóa bản phối này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Hiển thị <strong className="text-amber-300">{filteredSavedItems.length}</strong> / {savedItems.length} bản phối
              </span>
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
