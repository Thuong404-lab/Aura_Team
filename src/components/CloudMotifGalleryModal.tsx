import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RoyalGoldenSwirlCloud,
  CinnabarFireCloud,
  IvoryRuyiCloud,
  IndigoWaveCloud,
  StreamerWispsCloud,
  WingedImperialCloud,
} from './CloudMotifs';
import { X, Sparkles, Play, Info, Wind } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface CloudMotifGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerIntro: () => void;
}

const CLOUD_DETAILS = [
  {
    id: 'hoang-kim',
    name: 'Hoàng Kim Tường Vân',
    subtitle: 'Mây thếp vàng xoắn ốc cung đình',
    dynasty: 'Triều Nguyễn & Lê Sơ',
    description:
      'Dáng mây cuộn tròn với vân ốc xoắn đồng tâm, dát vàng rực rỡ thường thấy trên long bào, ngai vàng và phù điêu Đại Nội Huế. Tượng trưng cho phúc khí, hanh thông và uy quyền tối thượng.',
    Component: RoyalGoldenSwirlCloud,
    tag: 'Hoàng Tộc',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'chusa-hoa-van',
    name: 'Hỏa Vân Chu Sa',
    subtitle: 'Mây cuộn lửa sắc đỏ chu sa hoàng gia',
    dynasty: 'Triều Lê Trung Hưng & Nguyễn',
    description:
      'Được tạo tác với sắc đỏ chu sa rực lửa pha viền ánh vàng. Dáng mây uốn lượn hình lưỡi lửa mang năng lượng dương khí cát tường, thường thêu trên Nhật Bình và cờ ngũ hành triều đình.',
    Component: CinnabarFireCloud,
    tag: 'Cát Tường',
    color: 'from-orange-600 to-rose-700',
  },
  {
    id: 'bach-ngoc',
    name: 'Bạch Ngọc Như Ý',
    subtitle: 'Mây ngọc trắng nẹp chỉ vàng hoàng triều',
    dynasty: 'Cung Đình Huế (Pháp Phục)',
    description:
      'Tông trắng ngà bạch ngọc thanh khiết kết hợp những đường chỉ vàng uốn lượn mềm mại như gậy Như Ý. Biểu trưng cho sự trường thọ, an nhiên và cốt cách thanh cao của bậc hoàng gia.',
    Component: IvoryRuyiCloud,
    tag: 'Thanh Khiết',
    color: 'from-amber-100 to-amber-300',
  },
  {
    id: 'huyen-vu',
    name: 'Huyền Vũ Thủy Ba',
    subtitle: 'Mây lam ngọc vảy sóng trùng điệp',
    dynasty: 'Triều Lý - Trần & Nguyễn',
    description:
      'Mây xanh lam sâu thẳm với hoa văn vảy cá và lớp sóng thủy ba cổ truyền. Tượng trưng cho sông núi bền vững, cầu chúc mưa thuận gió hòa, quốc thái dân an.',
    Component: IndigoWaveCloud,
    tag: 'Thủy Ba',
    color: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'truong-van',
    name: 'Trường Vân Dải Lụa',
    subtitle: 'Dải mây lụa vàng lượn sóng chân trời',
    dynasty: 'Triều Lý (Chùa Phật Tích & Đồ gốm cổ)',
    description:
      'Những dải mây dài mềm mại như lụa là, uốn lượn bất tận vắt ngang bầu trời. Đại diện cho sự kết nối giữa đất và trời, cội nguồn văn hóa nghìn năm văn hiến.',
    Component: StreamerWispsCloud,
    tag: 'Uyển Chuyển',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'canh-en',
    name: 'Mây Cánh Én Cung Đình',
    subtitle: 'Mây đối xứng dáng chim én vờn gió',
    dynasty: 'Kiến Trúc & Điêu Khắc Cổ Việt',
    description:
      'Dáng mây đối xứng vươn sang hai bên như cánh chim én mùa xuân, đỉnh nhọn thanh thoát. Thường xuất hiện trên hoành phi, câu đối và viền trán bia đá thời xưa.',
    Component: WingedImperialCloud,
    tag: 'Cung Đình',
    color: 'from-yellow-500 to-amber-700',
  },
];

export const CloudMotifGalleryModal: React.FC<CloudMotifGalleryModalProps> = ({
  isOpen,
  onClose,
  onTriggerIntro,
}) => {
  const [paletteMode, setPaletteMode] = React.useState<'synchronized-gold' | 'original'>(
    'synchronized-gold'
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playPluck(330);
            onClose();
          }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0F172A] border border-amber-500/40 rounded-2xl shadow-2xl shadow-amber-950/50 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-amber-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-vi font-bold text-amber-200">
                  Bảo Tàng Vân Mây Cổ Phong Hoàng Triều
                </h3>
                <p className="text-xs text-slate-400">
                  Bộ sưu tập 6 mẫu vân mây truyền thống Việt Nam được số hóa theo mẫu ảnh tham khảo
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playPluck(330);
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Bar (Thử ngay hiệu ứng Vén Mây & Đổi chế độ màu) */}
          <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 font-medium">Bảng màu:</span>
              <div className="inline-flex rounded-lg bg-slate-900/80 p-0.5 border border-amber-500/30 text-xs">
                <button
                  onClick={() => {
                    soundEngine.playPluck(440);
                    setPaletteMode('synchronized-gold');
                  }}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                    paletteMode === 'synchronized-gold'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-amber-200 hover:text-white'
                  }`}
                >
                  ✨ Đồng Bộ Hoàng Kim (Mặc định)
                </button>
                <button
                  onClick={() => {
                    soundEngine.playPluck(392);
                    setPaletteMode('original');
                  }}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                    paletteMode === 'original'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎨 Ngũ Sắc Cổ Truyền
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playPluck(523.25);
                onClose();
                onTriggerIntro();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Vén Mây Chiều Sâu 3D (Cuộn Chuột)</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLOUD_DETAILS.map((cloud) => {
              const Comp = cloud.Component;
              return (
                <div
                  key={cloud.id}
                  className="group relative p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Cloud Vector Preview Canvas */}
                  <div className="relative w-full h-36 rounded-lg bg-[#070B14] border border-slate-800/80 flex items-center justify-center p-3 mb-3 overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                    <motion.div
                      whileHover={{ scale: 1.06, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex justify-center items-center"
                    >
                      <Comp
                        className="w-48 h-24 object-contain"
                        palette={paletteMode}
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-serif-vi font-bold text-amber-200 text-base">
                        {cloud.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        {cloud.tag}
                      </span>
                    </div>

                    <p className="text-xs text-amber-400/80 mb-2 font-medium">
                      {cloud.subtitle} · <span className="text-slate-400">{cloud.dynasty}</span>
                    </p>

                    <p className="text-xs text-slate-300/85 leading-relaxed">
                      {cloud.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Mỗi đám mây đều được vẽ bằng vector SVG thuần, tối ưu hóa 60fps mượt mà cho hiệu ứng bay dạt vén màn website.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CloudMotifGalleryModal;
