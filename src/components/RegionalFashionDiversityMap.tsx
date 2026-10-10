import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  ChevronRight,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useAppTheme } from '../context/ThemeContext';

interface RegionTradition {
  id: string;
  regionName: string;
  subTitle: string;
  tagline: string;
  iconSymbol: string;
  distinctiveFeatures: string[];
  keyOutfits: { name: string; eraOrPlace: string; highlight: string; color: string }[];
  climateImpact: string;
  philosophy: string;
}

const REGION_TRADITIONS: RegionTradition[] = [
  {
    id: 'bac-bo',
    regionName: 'Bắc Bộ — Kinh Bắc & Thăng Long Ngàn Năm',
    subTitle: 'Nôi văn hiến cổ kính, thanh nhã và ước lệ',
    tagline: 'Kín đáo, mộc mạc, tôn vinh nét duyên thầm qua nhiều lớp áo',
    iconSymbol: '🏛️',
    distinctiveFeatures: [
      'Áo Tứ Thân thắt bao lưng xanh lơ, buông dải yếm đào thắm',
      'Nón Quai Thao rộng vành che nghiêng câu hát quan họ trao duyên',
      'Màu sắc nhuộm thảo mộc tự nhiên: Nâu non củ nâu, Đen bùn, Vàng nghệ trầm',
      'Khăn mỏ quạ đen chít gọn khuôn mặt búp sen',
    ],
    keyOutfits: [
      { name: 'Áo Tứ Thân & Yếm Đào', eraOrPlace: 'Hội Lim Kinh Bắc', highlight: 'Duyên thầm thiếu nữ đồng bằng châu thổ', color: '#B45309' },
      { name: 'Áo Giao Lĩnh Vạt Rộng', eraOrPlace: 'Kinh đô Thăng Long (Lê - Trần)', highlight: 'Hào khí Đông A, phóng khoáng nho nhã', color: '#047857' },
      { name: 'Áo Năm Thân Mộc Mạc', eraOrPlace: 'Hà Nội xưa', highlight: 'Cốt cách thanh lịch người Tràng An', color: '#1D4ED8' },
    ],
    climateImpact:
      'Khí hậu bốn mùa rõ rệt với mùa đông giá lạnh phương Bắc thúc đẩy nghệ thuật mặc nhiều lớp áo (áo cánh lót bên trong, áo tứ thân buông tà bên ngoài), giữ ấm cơ thể mà vẫn thanh thoát.',
    philosophy:
      'Đề cao sự kín đáo, nền nã, không phô trương; cái đẹp nằm ở "duyên ngầm" và sự hòa hợp thuận thảo với đất trời nông nghiệp lúa nước.',
  },
  {
    id: 'trung-bo',
    regionName: 'Trung Bộ — Cố Đô Huế & Triều Nghi Hoàng Cung',
    subTitle: 'Đỉnh cao quy chuẩn pháp phục hoàng triều và kỹ nghệ thêu vàng',
    tagline: 'Quy củ nghiêm cẩn, gấm vóc lộng lẫy và biểu tượng quyền uy quốc gia',
    iconSymbol: '🏯',
    distinctiveFeatures: [
      'Áo Nhật Bình pháp phục thêu phượng hoàng và hoa văn Thủy Ba sóng nước',
      'Áo Ngũ Thân quy chuẩn định hình từ chiếu dụ của Võ Vương Nguyễn Phúc Khoát',
      'Nghệ thuật thêu tay kim tuyến Sa, Đoạn, Gấm Cung Đình lộng lẫy',
      'Khăn Vành Dây dát vàng và Mấn nhung quý phái',
    ],
    keyOutfits: [
      { name: 'Áo Nhật Bình Hoàng Gia', eraOrPlace: 'Đại Nội Huế', highlight: 'Pháp phục lộng lẫy nhất của cung phi hoàng tộc', color: '#D97706' },
      { name: 'Áo Tấc (Áo Lễ Tay Thụng)', eraOrPlace: 'Tế Nam Giao & Lễ Gia Tiên', highlight: 'Quốc phục đại lễ của toàn thể nhân dân', color: '#4338CA' },
      { name: 'Áo Ngũ Thân Tay Chẽn', eraOrPlace: 'Kinh đô Huế', highlight: 'Cốt cách nho phong của kẻ sĩ và mệnh phụ', color: '#B91C1C' },
    ],
    climateImpact:
      'Nắng gắt mưa dầm miền Trung nuôi dưỡng tình yêu với các chất liệu Sa, Xuyên, Lụa mỏng dệt thoáng khí mùa hè và Gấm lót kép giữ ấm khi mùa đông mưa xứ Huế ùa về.',
    philosophy:
      'Mỗi nếp áo là một lời nhắc nhở về lễ giáo, tôn ty trật tự và đạo lý Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín) cũng như triết lý hiếu thuận Tứ Thân Phụ Mẫu.',
  },
  {
    id: 'nam-bo',
    regionName: 'Nam Bộ — Miền Đất Phương Nam Phóng Khoáng',
    subTitle: 'Hào sảng, tự do, thích ứng diệu kỳ với sông nước phù sa',
    tagline: 'Gọn gàng, phóng khoáng, hòa mình cùng thiên nhiên rộng mở',
    iconSymbol: '🚣',
    distinctiveFeatures: [
      'Áo Bà Ba mềm mại xẻ tà hai bên hông với hai túi tiền tiện dụng',
      'Khăn rằn đen trắng vắt vai đặc trưng miền sông nước miệt vườn',
      'Chất liệu Lãnh Mỹ A đen huyền bí trứ danh vùng Tân Châu',
      'Mũi cúc bấm hoặc cúc ngọc cài dọc ngực áo gọn gàng',
    ],
    keyOutfits: [
      { name: 'Áo Bà Ba Lụa Tân Châu', eraOrPlace: 'Miệt vườn Lục Tỉnh', highlight: 'Tôn vinh vẻ đẹp khỏe khoắn, phóng khoáng', color: '#15803D' },
      { name: 'Áo Dài Cách Tân Sài Gòn', eraOrPlace: 'Đô thị phương Nam', highlight: 'Hơi thở thời đại giao thoa Đông Tây', color: '#C026D3' },
      { name: 'Khăn Rằn & Nón Lá Nam Bộ', eraOrPlace: 'Sông nước Cửu Long', highlight: 'Vật bất ly thân che chở người mở cõi', color: '#475569' },
    ],
    climateImpact:
      'Khí hậu nhiệt đới hai mùa mưa nắng với mạng lưới sông ngòi chằng chịt tạo nên phom áo ngắn, ống tay gọn gàng, chất vải mát nhẹ mau khô, thuận tiện cho việc chèo xuồng, thu hoạch lúa mùa.',
    philosophy:
      'Tinh thần cởi mở, chân chất, trọng tình nghĩa và sẵn sàng đón nhận những luồng văn hóa mới nhưng luôn giữ trọn cái gốc hồn hậu của người Việt.',
  },
];

export const RegionalFashionDiversityMap: React.FC = () => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  const [selectedRegionId, setSelectedRegionId] = useState<string>(REGION_TRADITIONS[1].id); // Default Hue / Trung Bo

  const currentRegion =
    REGION_TRADITIONS.find((r) => r.id === selectedRegionId) || REGION_TRADITIONS[1];

  return (
    <section className="w-full my-16 text-left relative z-10">
      {/* Section Header */}
      <div className={`border-b pb-6 mb-8 ${isCream ? 'border-amber-900/15' : 'border-amber-500/20'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className={`text-xs font-bold tracking-[0.25em] uppercase font-serif-vi ${
              isCream ? 'text-amber-800' : 'text-amber-400'
            }`}>
              BẢN ĐỒ VĂN HÓA 3 MIỀN
            </span>
          </div>
          <h2 className={`font-serif-vi text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
            isCream ? 'text-stone-900' : 'text-amber-100'
          }`}>
            Sắc Thái Trang Phục Bắc — Trung — Nam
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl font-light font-sans-vi leading-relaxed ${
            isCream ? 'text-stone-700' : 'text-slate-300'
          }`}>
            Mỗi vùng đất trên dải non sông hình chữ S lại ươm mầm một phong cách phục sức độc đáo, phản chiếu địa lý, khí hậu và tâm hồn con người nơi ấy.
          </p>
        </div>

        {/* 3 Region Selection Tabs: Single clean row, no word breaking, cohesive pill design */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-4 flex-wrap ${
          isCream ? 'border-amber-900/10' : 'border-slate-800/80'
        }`}>
          <div className={`flex items-center gap-2 p-1 rounded-xl border overflow-x-auto scrollbar-none max-w-full ${
            isCream ? 'bg-stone-100 border-stone-200' : 'bg-[#0A0F1E]/90 border-slate-800'
          }`}>
            {REGION_TRADITIONS.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  soundEngine.playPluck(520);
                  setSelectedRegionId(reg.id);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                  selectedRegionId === reg.id
                    ? isCream
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                      : 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                    : isCream
                    ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                    : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{reg.iconSymbol}</span>
                <span>{reg.regionName.split('—')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className={`text-xs font-mono hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
            isCream
              ? 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
              : 'text-amber-300/80 bg-amber-500/10 border-amber-500/20'
          }`}>
            <span>{currentRegion.iconSymbol}</span>
            <span className="font-medium">{currentRegion.subTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Feature Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRegion.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur-xl ${
            isCream
              ? 'bg-white border-amber-200/90 shadow-[0_8px_30px_rgba(180,130,60,0.08)] text-stone-900'
              : 'bg-[#0E1526]/90 border-amber-500/30 text-slate-100'
          }`}
        >
          {/* Top Banner with Region Info */}
          <div className={`border-b pb-6 mb-6 ${isCream ? 'border-stone-200' : 'border-slate-700/70'}`}>
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-2xl">{currentRegion.iconSymbol}</span>
              <h3 className={`font-serif-vi text-2xl sm:text-3xl font-bold ${
                isCream ? 'text-amber-900' : 'text-amber-200'
              }`}>
                {currentRegion.regionName}
              </h3>
            </div>
            <p className={`text-sm font-semibold mb-1 ${
              isCream ? 'text-stone-800' : 'text-amber-300/90'
            }`}>
              {currentRegion.subTitle}
            </p>
            <p className={`text-xs font-light italic ${
              isCream ? 'text-stone-600' : 'text-slate-400'
            }`}>
              "{currentRegion.tagline}"
            </p>
          </div>

          {/* Grid Split: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 6 Cols: Đặc Điểm & Triết Lý */}
            <div className="lg:col-span-6 space-y-6">
              {/* Distinctive Features */}
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  isCream ? 'text-amber-900 font-bold' : 'text-amber-400'
                }`}>
                  <Sparkles className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                  <span>Dấu Ấn Nhận Diện Nổi Bật</span>
                </h4>
                <div className="space-y-2.5">
                  {currentRegion.distinctiveFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                        isCream
                          ? 'bg-[#FFFDF9] border-stone-200 text-stone-800'
                          : 'bg-[#121B30] border-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Climate & Nature impact */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isCream
                  ? 'bg-amber-50/70 border-amber-200 text-stone-800'
                  : 'bg-[#0B101E] border-slate-800 text-slate-300'
              }`}>
                <span className={`font-bold block ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>
                  🌤️ Ảnh Hưởng Của Đất Trời & Khí Hậu:
                </span>
                <p className="leading-relaxed font-light font-sans-vi">
                  {currentRegion.climateImpact}
                </p>
              </div>

              {/* Cultural spirit */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isCream
                  ? 'bg-amber-100/60 border-amber-300 text-stone-800'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              }`}>
                <span className={`font-bold block ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>
                  🕊️ Cốt Cách & Triết Lý Vùng Miền:
                </span>
                <p className="leading-relaxed font-light font-sans-vi">
                  {currentRegion.philosophy}
                </p>
              </div>
            </div>

            {/* Right 6 Cols: Key Garment Showcase Cards */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                isCream ? 'text-amber-900 font-bold' : 'text-amber-400'
              }`}>
                <Layers className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>Thức Phục Tiêu Biểu Cho Vùng Đất</span>
              </h4>

              <div className="space-y-3">
                {currentRegion.keyOutfits.map((outfit, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-4 rounded-2xl border transition-all text-xs ${
                      isCream
                        ? 'bg-[#FFFDF9] hover:bg-amber-50/50 border-stone-200 hover:border-amber-300 text-stone-800 shadow-xs'
                        : 'bg-[#121B30] hover:bg-[#15213D] border-slate-700/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-serif-vi text-base font-bold ${
                        isCream ? 'text-amber-900' : 'text-amber-100'
                      }`}>
                        {outfit.name}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                        isCream
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-medium'
                          : 'bg-[#0B101E] text-amber-400 border-amber-500/30'
                      }`}>
                        {outfit.eraOrPlace}
                      </span>
                    </div>
                    <p className={`font-light leading-relaxed ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                      {outfit.highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cultural Quote Callout */}
              <div className={`mt-6 p-4 rounded-2xl border text-xs text-center ${
                isCream
                  ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 text-stone-800 shadow-xs'
                  : 'bg-gradient-to-r from-[#141F36] to-[#0E1526] border-amber-500/30 text-slate-300'
              }`}>
                <p className={`italic font-serif-vi text-sm ${isCream ? 'text-amber-950 font-bold' : 'text-amber-200'}`}>
                  "Ăn Bắc mặc Kinh — Dáng hình non sông đúc kết trong từng vạt áo"
                </p>
                <span className={`text-[10px] mt-1 block ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>
                  Ca dao tục ngữ lưu truyền nét đẹp phục sức người Việt
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
