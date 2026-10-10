import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Layers, Info, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useAppTheme } from '../context/ThemeContext';

interface TraditionalFabric {
  id: string;
  name: string;
  origin: string;
  material: string;
  history: string;
  tactileFeel: string;
  royalUsage: string;
  colorSpirit: string;
  dyeMethod: string;
  accentColor: string;
}

const TRADITIONAL_FABRICS: TraditionalFabric[] = [
  {
    id: 'gam-cung-dinh',
    name: 'Gấm Cung Đình Huế',
    origin: 'Huế & Thăng Long Cổ',
    material: '100% Tơ tằm tự nhiên dệt sợi kim tuyến',
    history:
      'Gấm là loại vải quý tộc bậc nhất thời phong kiến, chỉ dành riêng cho Hoàng tộc, quan lại thượng phẩm và các nghi lễ tế tự quốc gia. Từng hoa văn rồng bay, mây lượn, phượng vũ được dệt nổi tinh tế trên nền lụa dày dặn.',
    tactileFeel: 'Dày dặn, đầm tay, óng ả khi bắt ánh sáng nến và mặt trời, giữ phom áo đứng uy nghiêm.',
    royalUsage: 'May áo Nhật Bình, áo Viên Lĩnh triều thần, Hoàng bào thiên tử.',
    colorSpirit: 'Vàng Hoàng Yến, Đỏ Chu Sa, Xanh Thủy Ba',
    dyeMethod: 'Dệt sợi nhuộm trước, phối sợi kim ngân dát vàng lá cổ truyền',
    accentColor: '#F59E0B',
  },
  {
    id: 'lua-van-phuc',
    name: 'Lụa Vạn Phúc (Hà Đông)',
    origin: 'Làng lụa Vạn Phúc, Hà Đông (hơn 1.000 năm tuổi)',
    material: 'Tơ nõn tằm dâu nguyên chất',
    history:
      'Được mệnh danh là "Đệ nhất tơ lụa Kinh kỳ", lụa Vạn Phúc từng theo các thuyền buôn vượt biển theo Con đường Tơ lụa hàng hải và đạt giải cao tại Đấu xảo Marseille (Pháp) năm 1931.',
    tactileFeel: 'Mịn màng như làn da thiếu nữ, đông ấm hè mát, nhẹ tênh và thoáng khí tuyệt đối.',
    royalUsage: 'Áo Ngũ thân hàng ngày, áo dài truyền thống, khăn lụa phủ đầu.',
    colorSpirit: 'Trắng Ngà mộc, Hồng Phấn, Xanh Cốm non',
    dyeMethod: 'Nấu tẩy bằng tro rơm nếp và nhuộm lá mộc thủ công',
    accentColor: '#EC4899',
  },
  {
    id: 'lanh-my-a',
    name: 'Lãnh Mỹ A Cực Phẩm',
    origin: 'Tân Châu, An Giang (Xứ lụa phương Nam)',
    material: 'Tơ tằm tự nhiên nhuộm trái mặc nưa',
    history:
      'Huyền thoại của làng dệt Nam Bộ. Lãnh Mỹ A chỉ có một màu đen tuyền huyền bí, được nhuộm hàng trăm lần bằng mủ trái Mặc Nưa trong suốt nhiều tháng ròng dưới nắng trời phương Nam.',
    tactileFeel: 'Bề mặt láng bóng như da thuộc, mềm mượt như dòng nước, càng giặt càng đen bóng kỳ diệu.',
    royalUsage: 'Quần lụa thượng lưu Sài Gòn xưa, áo bà ba quý phái của các đệ nhất phu nhân.',
    colorSpirit: 'Đen Mặc Nưa huyền bí lấp lánh ánh kim',
    dyeMethod: 'Nhúng mủ mặc nưa tươi, phơi nắng giàn, đập đá phẳng mịn',
    accentColor: '#334155',
  },
  {
    id: 'dui-to-tam',
    name: 'Đũi Tơ Tằm Tự Nhiên',
    origin: 'Nam Cao, Thái Bình & vùng châu thổ',
    material: 'Sợi phế liệu tơ tằm thô (tơ nõn ngoài kén tằm)',
    history:
      'Đũi là chất liệu mang đậm hồn cốt dân dã thanh tao của đồng bằng Bắc Bộ, gắn liền với nếp sống thanh đạm, gần gũi với thiên nhiên của cha ông.',
    tactileFeel: 'Bề mặt có vân xước thô mộc đặc trưng, thấm mồ hôi cực tốt, mang vẻ đẹp bình dị nguyên sơ.',
    royalUsage: 'Áo Giao Lĩnh đạo sĩ, Áo Tứ Thân hội làng, trang phục sĩ phu ẩn dật.',
    colorSpirit: 'Nâu Củ Nâu, Vàng Rơm khô, Tràm mộc',
    dyeMethod: 'Nhuộm vỏ vẹt sú, củ nâu ngâm nước vôi trong',
    accentColor: '#10B981',
  },
];

export const HeritageCraftsmanshipStory: React.FC = () => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  const [selectedFabricId, setSelectedFabricId] = useState<string>(TRADITIONAL_FABRICS[0].id);

  const activeFabric =
    TRADITIONAL_FABRICS.find((f) => f.id === selectedFabricId) || TRADITIONAL_FABRICS[0];

  return (
    <section className="w-full my-16 text-left relative z-10">
      {/* Section Header */}
      <div className={`border-b pb-6 mb-8 ${isCream ? 'border-stone-200' : 'border-amber-500/20'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className={`text-xs font-bold tracking-[0.25em] uppercase font-serif-vi ${
              isCream ? 'text-amber-800' : 'text-amber-400'
            }`}>
              TINH HOA CHẤT LIỆU
            </span>
          </div>
          <h2 className={`font-serif-vi text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
            isCream ? 'text-stone-900' : 'text-amber-100'
          }`}>
            Kỹ Nghệ Dệt & Nhuộm Cổ Truyền
          </h2>
          <p className={`text-xs sm:text-sm mt-2 max-w-2xl font-light font-sans-vi leading-relaxed ${
            isCream ? 'text-stone-700' : 'text-slate-300'
          }`}>
            Mỗi thước vải làm nên trang phục truyền thống là kết tinh từ kén tằm dâu, nhựa cây rừng và đôi bàn tay tài hoa của người thợ dệt Việt.
          </p>
        </div>

        {/* Fabric selector buttons: Single unified tab bar, no wrapped words */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-4 flex-wrap ${
          isCream ? 'border-stone-200' : 'border-slate-800/80'
        }`}>
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border overflow-x-auto scrollbar-none max-w-full ${
            isCream ? 'bg-stone-100 border-stone-200' : 'bg-[#0A0F1E]/90 border-slate-800'
          }`}>
            {TRADITIONAL_FABRICS.map((fabric) => (
              <button
                key={fabric.id}
                type="button"
                onClick={() => {
                  soundEngine.playPluck(587.33);
                  setSelectedFabricId(fabric.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  selectedFabricId === fabric.id
                    ? isCream
                      ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs'
                      : 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                    : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/60'
                }`}
              >
                {fabric.name}
              </button>
            ))}
          </div>

          <div className={`text-xs font-mono hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            isCream
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-300/80'
          }`}>
            <span className={isCream ? 'text-stone-600' : 'text-slate-400'}>Xuất xứ:</span>
            <span className={`font-semibold ${isCream ? 'text-amber-900' : 'text-amber-200'}`}>{activeFabric.origin}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFabric.id}
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
          {/* Header */}
          <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-6 ${
            isCream ? 'border-stone-200' : 'border-slate-700/70'
          }`}>
            <div>
              <span className={`text-xs font-mono tracking-wider block mb-1 ${
                isCream ? 'text-amber-800 font-semibold' : 'text-amber-400'
              }`}>
                LÀNG NGHỀ: {activeFabric.origin.toUpperCase()}
              </span>
              <h3 className={`font-serif-vi text-2xl sm:text-3xl font-bold ${
                isCream ? 'text-stone-900' : 'text-amber-100'
              }`}>
                {activeFabric.name}
              </h3>
            </div>
            <div className={`text-xs px-3.5 py-1.5 rounded-xl border ${
              isCream
                ? 'bg-amber-50 border-amber-200 text-stone-800'
                : 'bg-[#121B30] border-slate-700 text-slate-300'
            }`}>
              <span className={isCream ? 'text-stone-600' : 'text-slate-400'}>Thành phần: </span>
              <span className={`font-semibold ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>{activeFabric.material}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <p className={`text-sm leading-relaxed font-sans-vi font-light ${
                isCream ? 'text-stone-700' : 'text-slate-200'
              }`}>
                {activeFabric.history}
              </p>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isCream
                  ? 'bg-stone-50 border-stone-200 text-stone-800'
                  : 'bg-[#121B30] border-slate-800 text-slate-300'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  isCream ? 'text-amber-900' : 'text-amber-300'
                }`}>
                  Cảm Giác Tiếp Xúc (Tactile Experience):
                </span>
                <p className={`text-xs font-light leading-relaxed ${
                  isCream ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  {activeFabric.tactileFeel}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isCream
                  ? 'bg-stone-50 border-stone-200 text-stone-800'
                  : 'bg-[#121B30] border-slate-800 text-slate-300'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  isCream ? 'text-amber-900' : 'text-amber-300'
                }`}>
                  Quy Chuẩn Ứng Dụng Trong Triều Đình & Đời Sống:
                </span>
                <p className={`text-xs font-light leading-relaxed ${
                  isCream ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  {activeFabric.royalUsage}
                </p>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isCream
                  ? 'bg-amber-50/70 border-amber-200 text-stone-800'
                  : 'bg-[#0A101D] border-amber-500/20 text-slate-300'
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  isCream ? 'text-amber-900' : 'text-amber-400'
                }`}>
                  Bí Quyết Nhuộm Thảo Mộc Tự Nhiên:
                </span>
                <p className={`text-xs font-light leading-relaxed ${
                  isCream ? 'text-stone-700' : 'text-slate-300'
                }`}>
                  {activeFabric.dyeMethod}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-2 ${
                isCream
                  ? 'bg-amber-100/60 border-amber-300 text-stone-800'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <span className={`text-xs font-bold block ${
                  isCream ? 'text-amber-900' : 'text-amber-300'
                }`}>
                  Bảng Màu & Thần Khí:
                </span>
                <span className={`block font-serif-vi text-base ${
                  isCream ? 'text-amber-950 font-semibold' : 'text-slate-200'
                }`}>
                  {activeFabric.colorSpirit}
                </span>
              </div>

              <div className={`p-4 rounded-2xl border text-[11px] leading-relaxed ${
                isCream
                  ? 'bg-stone-50 border-stone-200 text-stone-600'
                  : 'bg-[#121B30] border-slate-800 text-slate-400'
              }`}>
                🌿 Người xưa quan niệm: Sợi tơ là sinh khí của trời đất, được hấp thụ qua lá dâu tươi. Mặc tơ lụa tự nhiên là hòa mình vào năng lượng tươi lành của thiên nhiên.
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
