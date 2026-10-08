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
  Heart,
  Check,
  Smartphone,
  Maximize2,
  Minimize2,
  BookOpen,
  Layers,
  Crown,
  Quote,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

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
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
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
        const res = await fetch('/api/ai/lookbook-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            top,
            bottom,
            accessory,
            backdropTitle: selectedBackdrop.name,
          }),
        });
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setLookbookStory(data.data);
        }
      } catch {
        // Keep current fallback
      }
    };
    fetchStory();
    return () => {
      isMounted = false;
    };
  }, [selectedBackdrop, top, bottom, accessory]);

  // Handle Save
  const handleSave = () => {
    soundEngine.playPluck(587.33);
    const newItem: SavedLookbookItem = {
      id: `lb-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      title: lookbookStory.editionTitle || 'Bộ đồ đi dạo phố',
      topName: top.name,
      bottomName: bottom.name,
      accessoryName: accessory.name,
      backdropName: selectedBackdrop.name,
      score: harmonyData?.score || 95,
      aiStory: lookbookStory.editorialStory,
    };
    onSaveLookbook(newItem);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Handle Download (Canvas Export / Snapshot simulation)
  const handleDownload = () => {
    soundEngine.playPluck(698.46);
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create an elegant poster background
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, '#1E1412');
        grad.addColorStop(0.5, '#421E1E');
        grad.addColorStop(1, '#0F0C0B');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Header Title
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 36px "Playfair Display", serif';
        ctx.fillText('LOOKBOOK VIỆT PHỤC DI SẢN 2026', 100, 140);

        ctx.fillStyle = '#FDFBF7';
        ctx.font = 'bold 72px "Playfair Display", serif';
        ctx.fillText(lookbookStory.editionTitle || 'Bộ Đồ Đi Dạo Phố', 100, 240);

        ctx.fillStyle = '#E5C7B4';
        ctx.font = '32px "Be Vietnam Pro", sans-serif';
        ctx.fillText(`Địa điểm: ${selectedBackdrop.name} • Điểm hài hòa: ${harmonyData?.score || 95}/100`, 100, 310);

        // Outline Box for description
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.strokeRect(100, 420, 880, 1200);

        // Garment Info
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 40px "Playfair Display", serif';
        ctx.fillText(`Trang phục: ${top.name}`, 150, 520);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '32px "Be Vietnam Pro", sans-serif';
        ctx.fillText(`Quần/Váy: ${bottom.name}`, 150, 580);
        ctx.fillText(`Phụ kiện: ${accessory.name}`, 150, 640);
        ctx.fillText(`Chất liệu: ${fabric.name} • Tông màu: ${color.name}`, 150, 700);

        // Story snippet
        ctx.fillStyle = '#F4EFE6';
        ctx.font = 'italic 30px "Be Vietnam Pro", sans-serif';
        const words = lookbookStory.editorialStory.split(' ');
        let line = '';
        let y = 820;
        for (const n of words) {
          const testLine = line + n + ' ';
          if (ctx.measureText(testLine).width > 780) {
            ctx.fillText(line, 150, y);
            line = n + ' ';
            y += 45;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 150, y);

        // Poetry couple
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 34px "Playfair Display", serif';
        ctx.fillText(`“ ${lookbookStory.poetryCouple} ”`, 150, y + 100);

        // Footer watermarks
        ctx.fillStyle = '#A38B7D';
        ctx.font = '24px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Được tạo bởi Sáng Tạo Cùng Việt Phục AI Studio', 100, 1820);

        // Trigger download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `VietPhuc_Lookbook_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-zinc-950 text-stone-100 flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* Background Ambience */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center blur-2xl scale-110"
        style={{ backgroundImage: `url(${selectedBackdrop.imageUrl})` }}
      />

      {/* Top Header Bar */}
      <header className="relative z-30 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToFitting}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Phòng Thử Đồ</span>
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div>
            <h2 className="font-serif-vi text-base font-bold text-white flex items-center gap-2">
              <span>Lookbook Cá Nhân</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black">
                GIAO DIỆN MOBILE
              </span>
            </h2>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSavedDrawer}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-stone-200 transition-all flex items-center gap-1.5 border border-white/10"
            title="Mở thư viện Lookbook đã lưu"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Đã lưu ({savedItems.length})</span>
          </button>

          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-stone-200 transition-all border border-white/10"
            title="Đổi khung hình điện thoại hoặc toàn màn hình"
          >
            {isPhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{isPhoneFrame ? 'Toàn màn hình' : 'Khung điện thoại'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Scenery Selector Pill */}
        <div className="w-full max-w-[420px] mb-4 flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
          <span className="text-stone-400 text-[11px] whitespace-nowrap flex items-center gap-1 mr-1">
            <MapPin className="w-3 h-3 text-[#D4AF37]" /> Bối cảnh:
          </span>
          {BACKDROPS.map((bd) => (
            <button
              key={bd.id}
              onClick={() => {
                setSelectedBackdrop(bd);
                soundEngine.playPluck(440);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all ${
                selectedBackdrop.id === bd.id
                  ? 'bg-[#8B1E1E] text-white border border-[#D4AF37]/50 shadow-md'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20 border border-white/5'
              }`}
            >
              {bd.name}
            </button>
          ))}
        </div>

        {/* ================= GIAO DIỆN ĐIỆN THOẠI DI ĐỘNG (MOBILE FRAME) ================= */}
        <div
          ref={cardRef}
          className={`w-full transition-all duration-500 overflow-hidden relative shadow-[0_25px_70px_rgba(0,0,0,0.85)] ${
            isPhoneFrame
              ? 'max-w-[390px] rounded-[52px] border-[10px] border-stone-800 bg-white text-stone-900 ring-1 ring-white/20'
              : 'max-w-2xl rounded-3xl bg-white text-stone-900 border border-stone-200'
          }`}
        >
          {/* Phone Top Speaker & Notch (Chỉ hiện khi ở chế độ điện thoại) */}
          {isPhoneFrame && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-stone-800 mr-2" />
              <div className="w-10 h-1 bg-stone-800 rounded-full" />
            </div>
          )}

          {/* 1. KHU VỰC ẢNH KẾT XUẤT VÀO BỐI CẢNH THỰC TẾ (FASHION MAGAZINE PHOTO) */}
          <div className="relative h-[440px] sm:h-[480px] w-full overflow-hidden bg-stone-900 select-none">
            {/* Real World Backdrop Photo (Đường phố / Cố Đô) */}
            <img
              src={selectedBackdrop.imageUrl}
              alt={selectedBackdrop.name}
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] transition-transform duration-700 hover:scale-105"
            />

            {/* Subtle Gradient Overlays for High Fashion Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

            {/* Model Avatar Silhouette composite positioned inside the scene */}
            <div className="absolute inset-x-0 bottom-4 top-12 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-[380px] relative drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] opacity-95 transform translate-y-3">
                {/* SVG Visual Model preview inside the scenery */}
                <svg viewBox="0 0 400 680" className="w-full h-full drop-shadow-2xl">
                  {/* Silhouette shadow blend */}
                  <ellipse cx="200" cy="620" rx="90" ry="14" fill="#000000" opacity="0.6" />

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
            <div className="absolute top-8 left-6 right-6 flex items-center justify-between text-white z-20">
              <span className="text-[10px] font-cinzel font-bold tracking-[0.3em] uppercase drop-shadow-md text-[#D4AF37]">
                VIET HERITAGE 2026
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-md">
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                {harmonyData?.score || 95} ĐIỂM HÀI HÒA
              </span>
            </div>

            {/* Card Tiêu Đề trên ảnh (Card giao diện ghi "Bộ đồ đi dạo phố") */}
            <div className="absolute bottom-6 left-6 right-6 text-white z-20">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B1E1E] text-white shadow-md inline-block mb-2">
                {lookbookStory.editionTitle}
              </span>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                {top.name} • {selectedBackdrop.city}
              </h3>
              <p className="text-[11px] text-stone-200 mt-1 line-clamp-1 italic font-light drop-shadow-sm">
                {lookbookStory.subHeadline}
              </p>
            </div>
          </div>

          {/* 2. PHẦN BÊN DƯỚI BỨC ẢNH LÀ "THẺ THÔNG TIN VĂN HÓA" (AI CULTURAL ANALYSIS) */}
          <div className="p-6 bg-white flex flex-col justify-between">
            <div>
              {/* Header Analysis */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1E1E] block">
                    Thẻ Thông Tin Văn Hóa (AI Phân Tích)
                  </span>
                  <h4 className="font-serif-vi text-base font-bold text-stone-900 leading-none">
                    Ý nghĩa, Hoa văn & Sự kết hợp
                  </h4>
                </div>
              </div>

              {/* Poetic Quote */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#D4AF37]/30 mb-4 flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-[#8B1E1E] shrink-0 mt-0.5" />
                <p className="font-serif-vi text-xs italic text-stone-800 leading-snug">
                  “{lookbookStory.poetryCouple}”
                </p>
              </div>

              {/* Deep Narrative Text from AI */}
              <p className="text-xs text-stone-700 leading-relaxed font-sans-vi mb-4">
                {lookbookStory.editorialStory}
              </p>

              {/* Garment Anatomy Pills */}
              <div className="space-y-2 text-[11px] mb-6">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                  <strong className="text-[#8B1E1E] shrink-0">Cổ áo & Phom dáng:</strong>
                  <span className="text-stone-600">{top.cultureInfo.collarType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                  <strong className="text-[#8B1E1E] shrink-0">Hoa văn & Biểu trưng:</strong>
                  <span className="text-stone-600">{top.cultureInfo.symbolism}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                  <strong className="text-[#B4821A] shrink-0">Ghi chú nhiếp ảnh:</strong>
                  <span className="text-stone-600">{lookbookStory.photographerNote}</span>
                </div>
              </div>
            </div>

            {/* 3. BỘ 3 NÚT THAO TÁC NHANH Ở CUỐI MÀN HÌNH THEO YÊU CẦU:
                - "Tải ảnh xuống"
                - "Lưu lại" (vào bộ sưu tập Lookbook cá nhân)
                - "Chia sẻ" */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-2.5">
              {/* Nút 1: Tải ảnh xuống */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 py-3 px-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Tải thẻ ảnh Lookbook về máy"
              >
                <Download className="w-3.5 h-3.5 text-[#8B1E1E]" />
                <span>{isDownloading ? 'Đang xuất...' : 'Tải ảnh xuống'}</span>
              </button>

              {/* Nút 2: Lưu lại */}
              <button
                onClick={handleSave}
                className={`flex-1 py-3 px-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
                title="Lưu vào bộ sưu tập cá nhân"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-[#B4821A]" />}
                <span>{isSaved ? 'Đã lưu!' : 'Lưu lại'}</span>
              </button>

              {/* Nút 3: Chia sẻ */}
              <button
                onClick={handleShare}
                className="flex-1 py-3 px-3 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#8B1E1E] hover:bg-black text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                title="Chia sẻ Lookbook"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* SHARE MODAL DIALOG */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-white text-stone-900 p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-vi text-lg font-bold text-stone-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#8B1E1E]" />
                Chia Sẻ Lookbook Di Sản
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Lan tỏa vẻ đẹp của {top.name} phối tại {selectedBackdrop.name} tới bạn bè và cộng đồng yêu Việt phục!
            </p>

            <div className="p-3 bg-stone-100 rounded-2xl flex items-center justify-between text-xs text-stone-700 mb-5">
              <span className="truncate max-w-[200px] font-mono text-[11px]">
                {window.location.href}
              </span>
              <button
                onClick={copyShareLink}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-[#8B1E1E] text-white hover:opacity-90 transition-all flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : 'Sao chép'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  );
                }}
                className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-center"
              >
                Facebook
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      `Khám phá bộ Lookbook Việt phục: ${top.name} tại ${selectedBackdrop.name}!`
                    )}&url=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  );
                }}
                className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-center"
              >
                X (Twitter)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <footer className="relative z-30 w-full px-6 py-3 border-t border-white/10 text-center text-[11px] text-stone-400 flex items-center justify-between">
        <span>Giao diện Lookbook Tạp Chí Kỹ Thuật Số (Mobile Responsive)</span>
        <button
          onClick={onBackToFitting}
          className="text-[#D4AF37] hover:underline font-medium"
        >
          ← Chỉnh sửa lại trang phục trong Phòng Thử
        </button>
      </footer>
    </div>
  );
};
