import React, { useState, useEffect, useRef } from 'react';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  BackdropOption,
  BACKDROPS,
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
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { getLookbookStory } from '../services/aiClient';
import {
  AuraLogo,
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';

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
}

export interface SavedLookbookItem {
  id: string;
  date: string;
  title: string;
  topName: string;
  bottomName: string;
  accessoryName: string;
  backdropName: string;
  score: number;
  aiStory: string;
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
}) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropOption>(BACKDROPS[0]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // AI Story state
  const [lookbookStory, setLookbookStory] = useState<{
    editionTitle: string;
    subHeadline: string;
    editorialStory: string;
    poetryCouple: string;
    photographerNote: string;
  }>({
    editionTitle: 'Bộ Đồ Đi Dạo Phố',
    subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${selectedBackdrop.name}`,
    editorialStory: `Dưới ánh hoàng hôn chiếu rọi từng bức tường vàng rêu phong, tà ${top.name} kết hợp cùng ${bottom.name} và ${accessory.name} toát lên cốt cách đoan trang, thanh nhã. Họa tiết ${top.cultureInfo.pattern} cùng chất liệu ${fabric.name} tạo nên vẻ đẹp thuần khiết nhưng đầy tính thời trang đương đại.`,
    poetryCouple: 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.',
    photographerNote: 'Ánh sáng vàng tự nhiên góc 30 độ làm nổi bật chất óng ả của tơ lụa và đường kim mũi chỉ thêu tay.',
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch or generate AI story when backdrop changes
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
        // Fallback already provided in state
      }
    };
    fetchStory();
    return () => {
      isMounted = false;
    };
  }, [selectedBackdrop, top, bottom, accessory, color, fabric]);

  // Handle Save
  const handleSave = () => {
    soundEngine.playPluck(659.25);
    const item: SavedLookbookItem = {
      id: `lb-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      title: `${top.name} tại ${selectedBackdrop.city}`,
      topName: top.name,
      bottomName: bottom.name,
      accessoryName: accessory.name,
      backdropName: selectedBackdrop.name,
      score: harmonyData?.score || 95,
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
        // Background color
        ctx.fillStyle = '#0A0E17';
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 36px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.fillText('AURA - VIỆT PHỤC REMIX', 540, 120);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '24px "Be Vietnam Pro", sans-serif';
        ctx.fillText('DI SẢN TRANG PHỤC VIỆT • BỘ SƯU TẬP 2026', 540, 170);

        // Center photo card container
        ctx.fillStyle = '#0E1526';
        ctx.fillRect(90, 240, 900, 1000);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3;
        ctx.strokeRect(90, 240, 900, 1000);

        // Photo Information
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 42px "Playfair Display", serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${top.name}`, 140, 360);

        ctx.fillStyle = '#F1F5F9';
        ctx.font = '28px "Be Vietnam Pro", sans-serif';
        ctx.fillText(`Phối cùng: ${bottom.name}`, 140, 420);
        ctx.fillText(`Phụ kiện: ${accessory.name}`, 140, 470);
        ctx.fillText(`Chất liệu: ${fabric.name} • Tông màu: ${color.name}`, 140, 520);
        ctx.fillText(`Bối cảnh: ${selectedBackdrop.name} (${selectedBackdrop.city})`, 140, 570);

        // Harmony Badge
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 32px "Be Vietnam Pro", sans-serif';
        ctx.fillText(`Đánh giá hòa hợp: ${harmonyData?.score || 95} Điểm`, 140, 650);

        // Story text
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'italic 26px "Be Vietnam Pro", sans-serif';
        const words = lookbookStory.editorialStory.split(' ');
        let line = '';
        let y = 730;
        for (const n of words) {
          const testLine = line + n + ' ';
          if (ctx.measureText(testLine).width > 800) {
            ctx.fillText(line, 140, y);
            line = n + ' ';
            y += 40;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 140, y);

        // Poetry couplet
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 32px "Playfair Display", serif';
        ctx.fillText(`“ ${lookbookStory.poetryCouple} ”`, 140, y + 90);

        // Footer note
        ctx.fillStyle = '#64748B';
        ctx.font = '22px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Được tạo bởi Aura - Việt Phục Remix AI Studio', 540, 1840);

        // Download link
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Aura_VietPhuc_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } finally {
      setIsDownloading(false);
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
      <div className="relative z-20 w-full border-b border-slate-800/80 bg-[#0C1220]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBackToFitting}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Quay lại Phòng Thử Đồ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSavedDrawer}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#141E34] hover:bg-amber-500/20 text-slate-200 border border-slate-700/60 hover:border-amber-400/50 transition-all flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Đã lưu ({savedItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN RESPONSIVE CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Scenery Selector Chips */}
        <div className="w-full mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                BỘ SƯU TẬP NGOẠI CẢNH
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-vi text-amber-200 mt-1">
              Lookbook Di Sản Cá Nhân
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
                className={`px-3 py-1 rounded-xl whitespace-nowrap text-xs font-medium transition-all shrink-0 ${
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

        {/* WORKSPACE: Consistent CSS Grid Responsive Strategy */}
        <div
          ref={cardRef}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0E1526]/85 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-4 sm:p-6 shadow-[0_16px_56px_rgba(0,0,0,0.7)]"
        >
          {/* ==========================================================
              LEFT COLUMN: Editorial Scenery Photo
              - Small screen (< md:): Stacks vertically (100% width)
              - Laptop (md: and up): Side-by-side split view (6 cols)
             ========================================================== */}
          <div className="md:col-span-6 lg:col-span-6 rounded-2xl overflow-hidden border border-amber-500/30 bg-[#090D18] relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] flex flex-col justify-between shadow-2xl group">
            {/* Real World Backdrop Photo */}
            <div className="absolute inset-0">
              <img
                src={selectedBackdrop.imageUrl}
                alt={selectedBackdrop.name}
                className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E18] via-black/25 to-black/40 pointer-events-none" />
            </div>

            {/* Model Avatar Silhouette composite positioned inside the scene */}
            <div className="absolute inset-x-0 bottom-6 top-16 flex items-center justify-center pointer-events-none">
              <div className="w-56 sm:w-64 h-[380px] sm:h-[420px] relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] opacity-95">
                <svg viewBox="0 0 400 680" className="w-full h-full drop-shadow-2xl">
                  {/* Silhouette shadow blend */}
                  <ellipse cx="200" cy="620" rx="95" ry="14" fill="#000000" opacity="0.65" />

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
                    <ellipse cx="200" cy="68" rx="36" ry="14" fill="#1A1817" stroke="#3D3634" strokeWidth="1" />
                  ) : null}

                  {/* Garment Body (Colored with user's selected palette) */}
                  <path
                    d="M150 145 L250 145 L265 480 Q200 495 135 480 Z"
                    fill={color.hex}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />

                  {/* Collar details */}
                  {top.id === 'nhat-binh' ? (
                    <rect x="185" y="145" width="30" height="130" fill="#D4AF37" stroke="#8B1E1E" strokeWidth="1" />
                  ) : (
                    <path
                      d="M188 135 Q200 138 212 135 L212 148 Q200 151 188 148 Z"
                      fill="#D4AF37"
                      stroke="#5C3B1E"
                      strokeWidth="1"
                    />
                  )}

                  {/* Bottom robe/trousers */}
                  <path
                    d="M145 420 L120 600 L188 600 L196 440 L204 440 L212 600 L280 600 L255 420 Z"
                    fill={bottom.defaultColorHex}
                    opacity="0.95"
                  />

                  {/* Hand accessory: Quạt lụa */}
                  {accessory.id === 'quat-lua' && (
                    <path d="M130 330 L100 295 Q135 270 170 295 L140 330 Z" fill="#FDFBF7" stroke="#D4AF37" strokeWidth="1.5" />
                  )}
                </svg>
              </div>
            </div>

            {/* Top Magazine Badges on the Photo */}
            <div className="relative p-5 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-2">
                <AuraLogo className="w-6 h-6" />
                <span className="text-xs font-serif-vi font-bold tracking-[0.25em] uppercase drop-shadow-md text-amber-300">
                  AURA LOOKBOOK
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#090D18]/80 backdrop-blur-md border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {harmonyData?.score || 95} ĐIỂM HÀI HÒA
              </span>
            </div>

            {/* Bottom Photo Title & Location */}
            <div className="relative p-5 text-white z-20 text-left">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block mb-2">
                {lookbookStory.editionTitle}
              </span>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold leading-tight text-amber-100 drop-shadow-md">
                {top.name} • {selectedBackdrop.city}
              </h3>
              <p className="text-xs text-slate-300 mt-1 italic drop-shadow-xs line-clamp-2">
                {lookbookStory.subHeadline}
              </p>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Cultural Narrative, Poetry & Export Actions
              - Small screen (< md:): Stacks vertically below photo
              - Laptop (md: and up): Side-by-side split view (6 cols)
             ========================================================== */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between text-left space-y-4">
            <div>
              {/* Header Box */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                    BIÊN NIÊN SỬ THỜI TRANG (AI ĐỒNG SÁNG TÁC)
                  </span>
                  <h4 className="font-serif-vi text-lg font-bold text-slate-100">
                    Hồn Cốt Di Sản & Dấu Ấn Đương Đại
                  </h4>
                </div>
              </div>

              {/* Poetic Couplet */}
              <div className="my-3.5 p-3.5 rounded-2xl bg-[#131C2E] border border-amber-500/30 flex items-start gap-3 shadow-inner">
                <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-serif-vi text-sm italic text-amber-200/95 leading-relaxed">
                  “{lookbookStory.poetryCouple}”
                </p>
              </div>

              {/* Editorial Narrative */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-vi mb-4">
                {lookbookStory.editorialStory}
              </p>

              {/* Garment Details & Culture Pillars */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                  <strong className="text-amber-400 shrink-0">Cổ áo & Phom dáng:</strong>
                  <span className="text-slate-300">{top.cultureInfo.collarType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                  <strong className="text-amber-400 shrink-0">Hoa văn & Biểu trưng:</strong>
                  <span className="text-slate-300">{top.cultureInfo.symbolism}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#131C2E] border border-slate-700/60 flex items-start gap-2">
                  <strong className="text-amber-300 shrink-0">Ghi chú nhiếp ảnh:</strong>
                  <span className="text-slate-300">{lookbookStory.photographerNote}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-2.5">
              {/* Button 1: Download High-Res PNG */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full sm:flex-1 py-3 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#131C2E] hover:bg-[#1A2640] text-slate-100 border border-slate-700 hover:border-amber-400/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>{isDownloading ? 'Đang xuất ảnh...' : 'Tải ảnh Lookbook'}</span>
              </button>

              {/* Button 2: Save to Library */}
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

              {/* Button 3: Share */}
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
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Lan tỏa vẻ đẹp của {top.name} phối tại {selectedBackdrop.name} tới bạn bè và cộng đồng yêu Việt phục!
            </p>

            <div className="p-3 bg-[#131C2E] border border-slate-700/60 rounded-2xl flex items-center justify-between text-xs text-slate-300 mb-5">
              <span className="truncate max-w-[200px] font-mono text-[11px] text-slate-400">
                {window.location.href}
              </span>
              <button
                onClick={copyShareLink}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold"
              >
                {copiedLink ? 'Đã sao chép!' : 'Sao chép'}
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
