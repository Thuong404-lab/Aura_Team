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
  const [selectedRegionId, setSelectedRegionId] = useState<string>(REGION_TRADITIONS[1].id); // Default Hue / Trung Bo

  const currentRegion =
    REGION_TRADITIONS.find((r) => r.id === selectedRegionId) || REGION_TRADITIONS[1];

  return (
    <section className="w-full my-16 text-left relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-sans-vi">
              BẢN ĐỒ VĂN HÓA 3 MIỀN
            </span>
          </div>
          <h2 className="font-serif-vi text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 tracking-tight">
            Sắc Thái Trang Phục Bắc — Trung — Nam
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl font-light font-sans-vi leading-relaxed">
            Mỗi vùng đất trên dải non sông hình chữ S lại ươm mầm một phong cách phục sức độc đáo, phản chiếu địa lý, khí hậu và tâm hồn con người nơi ấy.
          </p>
        </div>

        {/* 3 Region Selection Tabs */}
        <div className="flex flex-wrap gap-2">
          {REGION_TRADITIONS.map((reg) => (
            <button
              key={reg.id}
              onClick={() => {
                soundEngine.playPluck(520);
                setSelectedRegionId(reg.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                selectedRegionId === reg.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                  : 'bg-[#121A2D] text-slate-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-500/40'
              }`}
            >
              <span>{reg.iconSymbol}</span>
              <span>{reg.regionName.split('—')[0].trim()}</span>
            </button>
          ))}
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
          className="p-6 sm:p-8 rounded-3xl bg-[#0E1526]/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Top Banner with Region Info */}
          <div className="border-b border-slate-700/70 pb-6 mb-6">
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-2xl">{currentRegion.iconSymbol}</span>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-200">
                {currentRegion.regionName}
              </h3>
            </div>
            <p className="text-sm font-medium text-amber-300/90 mb-1">
              {currentRegion.subTitle}
            </p>
            <p className="text-xs text-slate-400 font-light italic">
              "{currentRegion.tagline}"
            </p>
          </div>

          {/* Grid Split: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 6 Cols: Đặc Điểm & Triết Lý */}
            <div className="lg:col-span-6 space-y-6">
              {/* Distinctive Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Dấu Ấn Nhận Diện Nổi Bật</span>
                </h4>
                <div className="space-y-2.5">
                  {currentRegion.distinctiveFeatures.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#121B30] border border-slate-800 text-xs text-slate-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Climate & Nature impact */}
              <div className="p-4 rounded-2xl bg-[#0B101E] border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-amber-300 block">
                  🌤️ Ảnh Hưởng Của Đất Trời & Khí Hậu:
                </span>
                <p className="leading-relaxed font-light font-sans-vi">
                  {currentRegion.climateImpact}
                </p>
              </div>

              {/* Cultural spirit */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
                <span className="font-bold text-amber-300 block">
                  🕊️ Cốt Cách & Triết Lý Vùng Miền:
                </span>
                <p className="leading-relaxed font-light font-sans-vi">
                  {currentRegion.philosophy}
                </p>
              </div>
            </div>

            {/* Right 6 Cols: Key Garment Showcase Cards */}
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Thức Phục Tiêu Biểu Cho Vùng Đất</span>
              </h4>

              <div className="space-y-3">
                {currentRegion.keyOutfits.map((outfit, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-4 rounded-2xl bg-[#121B30] hover:bg-[#15213D] border border-slate-700/80 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif-vi text-base font-bold text-amber-100">
                        {outfit.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#0B101E] text-amber-400 border border-amber-500/30">
                        {outfit.eraOrPlace}
                      </span>
                    </div>
                    <p className="text-slate-300 font-light leading-relaxed">
                      {outfit.highlight}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cultural Quote Callout */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#141F36] to-[#0E1526] border border-amber-500/30 text-xs text-slate-300 text-center">
                <p className="italic font-serif-vi text-sm text-amber-200">
                  "Ăn Bắc mặc Kinh — Dáng hình non sông đúc kết trong từng vạt áo"
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
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
