import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  RotateCw,
  Eye,
  Sliders,
  Check,
  Shield,
  Palette,
  Volume2,
} from 'lucide-react';
import { WardrobeItem, TOPS, BOTTOMS, ACCESSORIES } from '../data/vietPhucData';
import { soundEngine } from '../utils/audioSynth';

export interface GarmentShowcaseItem {
  id: string;
  name: string;
  hanTu: string;
  category: 'Áo Lễ & Thượng Phục' | 'Trang Phục Thường Nhật' | 'Váy & Quần' | 'Phụ Kiện Hoàng Triều';
  dynasty: string;
  period: string;
  socialRank: string;
  description: string;
  craftsmanship: string;
  culturalPhilosophy: string;
  silhouetteDescription: string;
  symbolism: string[];
  fabricMatch: string;
  colorSpirit: string;
  colorHex: string;
  avatarTopId?: string;
  avatarBottomId?: string;
  avatarAccessoryId?: string;
  layerStructure: { layer: number; name: string; purpose: string }[];
  funFact: string;
}

export const CULTURAL_GARMENTS: GarmentShowcaseItem[] = [
  {
    id: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    hanTu: '五身手窄',
    category: 'Trang Phục Thường Nhật',
    dynasty: 'Triều Nguyễn (Vua Võ Vương Nguyễn Phúc Khoát định hình)',
    period: 'Thế kỷ XVIII — XX',
    socialRank: 'Toàn dân (từ thứ dân, sĩ phu đến quan lại, hoàng tộc)',
    description:
      'Áo ngũ thân tay chẽn là tiền thân trực tiếp của chiếc Áo Dài Việt Nam hiện đại. Áo có cổ đứng nghiêm cẩn (cổ lập), năm thân áo ghép lại kín đáo và tay áo được may ôm gọn từ khuỷu tay đến cổ tay, tiện cho sinh hoạt thường nhật mà vẫn giữ trọn phong thái thanh lịch.',
    craftsmanship:
      'Kỹ thuật may lộn mép giấu chỉ tuyệt mỹ, đường can dọc thân thẳng tắp không lộ đường kim mũi chỉ. Cổ áo lót cứng bằng vải mộc định hình cổ đứng trang nghiêm.',
    culturalPhilosophy:
      'Triết lý "Ngũ thân phụ mẫu": 4 thân ngoài tượng trưng cho Tứ Thân Phụ Mẫu (cha mẹ đẻ và cha mẹ vợ/chồng), thân thứ 5 nhỏ lót kín bên trong tượng trưng cho người mặc được chở che. 5 khuy xà cừ tượng trưng cho Ngũ Thường: Nhân — Nghĩa — Lễ — Trí — Tín.',
    silhouetteDescription: 'Thân áo suông nhẹ, tay ôm chẽn, tà uốn cong hình cánh cung uyển chuyển khi bước đi.',
    symbolism: ['Đạo hiếu phụ mẫu', 'Ngũ thường quân tử', 'Kín đáo đoan trang'],
    fabricMatch: 'Lụa tơ tằm Vạn Phúc, Gấm trơn Sa Nam',
    colorSpirit: 'Sắc Tía thắm / Đỏ Chu Sa / Xanh Thiên Thanh',
    colorHex: '#C53030',
    avatarTopId: 'ngu-than',
    layerStructure: [
      { layer: 1, name: 'Áo cánh lót trắng mỏng', purpose: 'Thấm hút mồ hôi và bảo vệ lớp lụa quý bên ngoài' },
      { layer: 2, name: 'Thân con (Thân thứ 5 bên trong)', purpose: 'Che kín ngực và giữ ấm tâm can' },
      { layer: 3, name: 'Bốn thân áo chính tay chẽn', purpose: 'Tạo dáng đứng trang nhã chuẩn mực truyền thống' },
    ],
    funFact: 'Thời Nguyễn, bất kể nam hay nữ bước ra đường mà không mặc áo ngũ thân bị xem là thất lễ và có thể bị quan nha quở trách.',
  },
  {
    id: 'nhat-binh-cung-dinh',
    name: 'Áo Nhật Bình Hoàng Gia',
    hanTu: '日平衣',
    category: 'Áo Lễ & Thượng Phục',
    dynasty: 'Triều Nguyễn (Hoàng Cung Huế)',
    period: '1802 — 1945',
    socialRank: 'Hậu phi, Công chúa, Cung tần và Mệnh phụ phu nhân triều đình',
    description:
      'Áo Nhật Bình là đệ nhất pháp phục tôn quý của nữ giới hoàng tộc triều Nguyễn. Điểm nhận diện đặc trưng là cổ áo to bản hình chữ nhật đối khâm trước ngực, hai vạt áo buộc dải kết ngọc, gấu áo thêu đồ án Thủy Ba dập dờn sóng nước.',
    craftsmanship:
      'Thêu tay cố cung bằng chỉ vàng kim tuyến và chỉ tơ nhuộm thảo mộc tự nhiên. Đồ án phượng hoàng ngậm hoa mẫu đơn, rồng mây và bát bửu cát tường.',
    culturalPhilosophy:
      'Cổ áo chữ nhật (Nhật) tượng trưng cho vầng thái dương rực rỡ và sự quang minh chính đại. Dải ngũ sắc ở cửa tay áo biểu trưng cho thuyết Ngũ Hành (Kim - Mộc - Thủy - Hỏa - Thổ) điều hòa trời đất.',
    silhouetteDescription: 'Dáng áo xòe rộng uy nghi, cổ đối khâm chữ nhật song song, tà áo chạm gót chân.',
    symbolism: ['Uy quyền hoàng gia', 'Ngũ hành tương sinh', 'Vạn thọ vô cương'],
    fabricMatch: 'Gấm Cung Đình dệt sợi vàng, Sa hoàng gia Huế',
    colorSpirit: 'Vàng Hoàng Yến (Hoàng Hậu) / Cam Xích Đào (Công Chúa)',
    colorHex: '#D97706',
    avatarTopId: 'nhat-binh',
    layerStructure: [
      { layer: 1, name: 'Áo cánh cổ thìa bằng lụa bạch', purpose: 'Lớp lót êm ái cho làn da tôn quý' },
      { layer: 2, name: 'Áo ngũ thân chẽn lót trong', purpose: 'Tạo độ phồng nhẹ tự nhiên và giữ phom áo' },
      { layer: 3, name: 'Áo Nhật Bình đại triều khoác ngoài', purpose: 'Pháp phục lộng lẫy thêu kim tuyến triều nghi' },
      { layer: 4, name: 'Khăn vành dây 30 vòng vàng', purpose: 'Vương miện khăn lụa trác tuyệt của phụ nữ cung đình' },
    ],
    funFact: 'Khăn vành dây quấn cùng áo Nhật Bình có thể dài tới 8-10 mét lụa phủ kim tuyến, quấn đều tay tỉ mỉ hàng giờ trước khi xuất hiện tại đại lễ.',
  },
  {
    id: 'ao-tac-le-phuc',
    name: 'Áo Tấc (Áo Lễ Tay Thụng)',
    hanTu: '寸衣 (廣袖)',
    category: 'Áo Lễ & Thượng Phục',
    dynasty: 'Triều Nguyễn',
    period: 'Thế kỷ XIX — XX',
    socialRank: 'Quốc phục đại lễ dùng cho mọi tầng lớp trong dịp trọng đại',
    description:
      'Áo Tấc là biến thể trang trọng nhất của áo ngũ thân, với phần tay áo may thụng rộng đúng một tấc ta (khoảng 40-50cm) và dài phủ kín bàn tay. Dành cho các dịp tế tự tổ tiên, nghênh hôn gia lễ và yết kiến đấng bề trên.',
    craftsmanship:
      'Được may ghép 5 thân khổ hẹp truyền thống với đường may dấu mép tinh tế. Cổ áo dựng đứng có dải khăn lụa trắng cài lót cổ áo bảo vệ tơ tằm.',
    culturalPhilosophy:
      'Khi hành lễ, người mặc chắp tay cung kính trước ngực giấu bàn tay vào trong ống tay thụng, tượng trưng cho đức khiêm cung, hạ mình trước tiền nhân và thần linh, dẹp bỏ tham sân si.',
    silhouetteDescription: 'Tay áo thụng buông thõng uy nghiêm, tà áo chấm mắt cá chân tạo dáng đứng trang trọng.',
    symbolism: ['Khiêm cung lễ nghi', 'Tôn kính tổ tiên', 'Hòa hợp cộng đồng'],
    fabricMatch: 'Gấm dệt chữ Thọ, Lụa tơ sống nhuộm chàm thẫm',
    colorSpirit: 'Xanh Chàm Đậm / Lam Thẫm Triều Nghi',
    colorHex: '#1E3A8A',
    avatarTopId: 'ao-tac',
    layerStructure: [
      { layer: 1, name: 'Áo lót cổ trắng', purpose: 'Tạo viền trắng thanh nhã nơi cổ áo' },
      { layer: 2, name: 'Quần lụa trắng ống sớ rộng', purpose: 'Bước đi uyển chuyển khoan thai' },
      { layer: 3, name: 'Áo Tấc tay thụng khoác ngoài', purpose: 'Chắp tay hành lễ đoan chính' },
    ],
    funFact: 'Trong đám cưới xưa, chú rể mặc áo Tấc xanh cài hoa đỏ, cô dâu mặc áo Tấc đỏ hoặc Nhật Bình bước vào lễ gia tiên trang trọng vô ngần.',
  },
  {
    id: 'ao-giao-linh-co-phong',
    name: 'Áo Giao Lĩnh (Trực Khâm Vạt Chéo)',
    hanTu: '交領衣',
    category: 'Áo Lễ & Thượng Phục',
    dynasty: 'Thời Lý — Trần — Lê Sơ — Lê Trung Hưng',
    period: 'Thế kỷ XI — XVIII (Gần 800 năm lịch sử)',
    socialRank: 'Quý tộc, Sĩ phu, Đạo sĩ và Thứ dân các triều đại cổ',
    description:
      'Áo Giao Lĩnh là cội nguồn của phục sức Việt cổ xuyên suốt ngàn năm độc lập tự chủ. Cổ áo hai vạt đan chéo nhau trước ngực (hữu nhậm - vạt trái đè vạt phải), dáng áo rộng rãi thênh thang mang đậm phong thái thần tiên thoát tục.',
    craftsmanship:
      'Dệt vải khổ rộng bằng khung cửi cổ truyền, nhuộm thảo mộc từ vỏ cây sú vẹt, lá chàm rừng và củ nâu Đại Hoàng.',
    culturalPhilosophy:
      'Đường cổ chữ V vạt trái đè vạt phải tuân theo nguyên lý Âm Dương trời đất: Tay áo và vạt áo vuông tròn hòa quyện ("Trời tròn Đất vuông"). Phản ánh hào khí Đông A khoáng đạt và tinh thần Thiền tông thời Lý Trần.',
    silhouetteDescription: 'Tay áo cánh dơi rộng, tà áo thướt tha buông dài, thắt đai lưng gấm mềm mại.',
    symbolism: ['Hào khí Đông A', 'Âm Dương hòa hợp', 'Khí phách ngàn năm'],
    fabricMatch: 'Đũi tơ tằm Nam Cao, Lụa chũi tự nhiên',
    colorSpirit: 'Huyền Thiên (Đen nhung) / Xanh Lục Cỏ Non / Vàng Đất',
    colorHex: '#059669',
    avatarTopId: 'giao-linh',
    layerStructure: [
      { layer: 1, name: 'Trung đơn lót trắng', purpose: 'Viền cổ áo trong tạo sự tương phản mỹ thuật' },
      { layer: 2, name: 'Vạt áo Giao Lĩnh đan chéo', purpose: 'Thắt đai lưng lụa thả buông hai dải ngọc' },
      { layer: 3, name: 'Thường (váy quây nhiều nếp)', purpose: 'Tạo dáng chuyển động như mây lượn' },
    ],
    funFact: 'Tranh cổ và tượng chùa Phật Tích thời Lý (1057) đã khắc họa những tiên nữ dâng hoa khoác áo Giao Lĩnh tuyệt mỹ bay lượn giữa trời mây.',
  },
  {
    id: 'ao-tu-than-kinh-bac',
    name: 'Áo Tứ Thân Bắc Bộ',
    hanTu: '四身衣',
    category: 'Trang Phục Thường Nhật',
    dynasty: 'Vùng Kinh Bắc — Đồng Bằng Sông Hồng',
    period: 'Thế kỷ XVII — XX',
    socialRank: 'Phụ nữ thôn quê, liền chị Quan họ, các hội làng xuân',
    description:
      'Áo Tứ Thân gồm 4 vạt: hai vạt sau may liền thành sống lưng, hai vạt trước buông tự do để buộc vạt trước bụng hoặc buông thõng thướt tha. Thường kết hợp cùng Yếm đào thắm đượm và Nón quai thao tráng lệ.',
    craftsmanship:
      'May từ đũi, lụa mộc nhuộm nâu non, củ nâu hoặc gỗ vang rừng; đường chỉ khâu tay tinh xảo của các cô gái vùng đồng bằng Bắc Bộ.',
    culturalPhilosophy:
      'Bốn thân áo đại diện cho bốn đức tính tốt đẹp của phụ nữ Việt Nam: Công — Dung — Ngôn — Hạnh. Màu sắc trầm ấm như màu phù sa châu thổ, tôn vinh nét duyên ngầm đằm thắm mộc mạc.',
    silhouetteDescription: 'Áo xẻ tà cao, buộc vạt eo thon thả, khoe khéo bờ vai thon và cổ yếm trắng hồng.',
    symbolism: ['Duyên ngầm Kinh Bắc', 'Tứ đức Công Dung Ngôn Hạnh', 'Hồn quê châu thổ'],
    fabricMatch: 'Đũi thô nhuộm nâu non, Lụa tơ Hà Đông mộc',
    colorSpirit: 'Nâu Sồng Gỗ / Đỏ Yếm Đào / Xanh Cốm',
    colorHex: '#92400E',
    avatarTopId: 'tu-than',
    layerStructure: [
      { layer: 1, name: 'Yếm đào lụa thắm', purpose: 'Nâng niu bờ ngực và tôn vẻ đẹp lưng ong' },
      { layer: 2, name: 'Áo cánh cộc màu nõn chuối', purpose: 'Lớp áo mỏng nhẹ tạo điểm nhấn cổ áo' },
      { layer: 3, name: 'Áo Tứ thân ngoài buông tà', purpose: 'Thắt bao lưng lụa xanh biếc quanh eo' },
      { layer: 4, name: 'Nón Quai Thao đường kính 1m', purpose: 'Vành nón che nghiêng nụ cười duyên trong câu hát quan họ' },
    ],
    funFact: 'Liền chị Quan Họ khi hát trao duyên thường có dải thắt lưng xanh buông lơi, kết hợp ruột tượng đỏ đựng trầu cau gửi trao ý nhị.',
  },
  {
    id: 'ao-vien-linh-trieu-than',
    name: 'Áo Viên Lĩnh (Cổ Tròn Hoàng Triều)',
    hanTu: '圓領衣 (補子)',
    category: 'Áo Lễ & Thượng Phục',
    dynasty: 'Triều Lý — Trần — Lê — Nguyễn',
    period: 'Thế kỷ XI — XIX',
    socialRank: 'Vua chúa, Triều thần quan văn, quan võ từ Nhất phẩm đến Cửu phẩm',
    description:
      'Áo cổ tròn khép kín quanh chân cổ bằng nút gài vai phải, tay áo rộng uy nghi. Trước ngực và sau lưng đính tấm Bổ Tử (tấm gấm vuông thêu họa tiết quy chuẩn): Quan văn thêu chim muông (Hạc, Trĩ, Khổng tước...), Quan võ thêu thú dữ (Kỳ lân, Sư tử, Hổ, Báo...).',
    craftsmanship:
      'Gấm dệt vân mây cung đình, Bổ Tử thêu kim tuyến nổi khối cầu kỳ biểu thị đẳng cấp phẩm hàm của triều đình.',
    culturalPhilosophy:
      'Cổ tròn (Viên) tượng trưng cho Vòm Trời rộng lớn bao bọc vạn vật; tấm bổ tử vuông tượng trưng cho Mặt Đất bằng phẳng cương trực. Người quan mặc áo Viên Lĩnh mang trên mình trật tự Thiên — Địa — Nhân.',
    silhouetteDescription: 'Thân áo thụng dài chấm gót, cổ khít tròn, hai bên hông xẻ tà có cánh áo lót che kín.',
    symbolism: ['Phẩm hàm triều chính', 'Trời tròn đất vuông', 'Cương trực thanh liêm'],
    fabricMatch: 'Đoạn Bát Ty hoàng cung, Gấm tơ thêu chỉ kim hoàn',
    colorSpirit: 'Đỏ Tía Son Triều Thần / Xanh Biển Sâu',
    colorHex: '#991B1B',
    avatarTopId: 'vien-linh',
    layerStructure: [
      { layer: 1, name: 'Trung đơn trắng cổ tròn', purpose: 'Định hình chân cổ sạch sẽ uy nghiêm' },
      { layer: 2, name: 'Áo Viên Lĩnh thêu Bổ Tử', purpose: 'Phẩm phục đại triều bái kiến thiên tử' },
      { layer: 3, name: 'Mũ Ô Sa cánh chuồn & Đai lưng', purpose: 'Bộ lễ phục hoàn chỉnh của sĩ thứ đỗ đạt' },
    ],
    funFact: 'Nhìn vào con chim hay con thú thêu trên ngực áo Viên Lĩnh, người dân thời xưa có thể biết ngay vị quan này giữ chức phẩm hàm cấp bậc nào.',
  },
];

interface CulturalGarmentEncyclopediaProps {
  onSelectGarmentForFitting: (topId: string) => void;
}

export const CulturalGarmentEncyclopedia: React.FC<CulturalGarmentEncyclopediaProps> = ({
  onSelectGarmentForFitting,
}) => {
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>(CULTURAL_GARMENTS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'philosophy' | 'craftsmanship'>('overview');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isRotatingEffect, setIsRotatingEffect] = useState(false);

  const selectedGarment =
    CULTURAL_GARMENTS.find((g) => g.id === selectedGarmentId) || CULTURAL_GARMENTS[0];

  const filteredGarments = CULTURAL_GARMENTS.filter((g) => {
    if (filterCategory === 'all') return true;
    return g.category === filterCategory;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Cổ Phục' },
    { id: 'Áo Lễ & Thượng Phục', label: 'Áo Lễ & Thượng Phục' },
    { id: 'Trang Phục Thường Nhật', label: 'Trang Phục Thường Nhật' },
  ];

  return (
    <section id="encyclopedia-section" className="w-full my-16 text-left relative z-10">
      {/* Decorative Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400 font-sans-vi">
              BÁCH KHOA TOÀN THƯ DI SẢN
            </span>
          </div>
          <h2 className="font-serif-vi text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 tracking-tight">
            Việt Phục Đa Dạng Qua Ngàn Năm
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl font-light font-sans-vi leading-relaxed">
            Khám phá quy chuẩn cấu tạo, chiều sâu triết lý và tay nghề thủ công của từng thức phục cổ truyền nước Việt — từ triều nghi cung đình đến hội làng thanh nhã.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playPluck(440);
                setFilterCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-[#121A2D] text-slate-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Interactive Stage: Grid 12 Cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Garment Selector List (4 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-400 px-1 mb-1 flex items-center justify-between">
            <span>DANH SÁCH THỨC ÁO TRUYỀN THỐNG</span>
            <span>{filteredGarments.length} thức áo</span>
          </div>

          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredGarments.map((garment, idx) => {
              const isSelected = garment.id === selectedGarment.id;
              return (
                <motion.div
                  key={garment.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    soundEngine.playPluck(523.25 + idx * 30);
                    setSelectedGarmentId(garment.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#17233E] to-[#121A2D] border-amber-400/80 shadow-[0_8px_24px_rgba(245,158,11,0.22)]'
                      : 'bg-[#0E1526]/75 hover:bg-[#121A2D] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {/* Left accent color bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all"
                    style={{ backgroundColor: garment.colorHex }}
                  />

                  <div className="flex items-start justify-between gap-2 pl-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono tracking-wider text-amber-400/90 font-semibold uppercase">
                          {garment.dynasty.split('(')[0].trim()}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-[11px] text-slate-400 font-serif-vi">
                          {garment.hanTu}
                        </span>
                      </div>
                      <h4
                        className={`font-serif-vi text-base sm:text-lg font-bold transition-colors ${
                          isSelected ? 'text-amber-200' : 'text-slate-100'
                        }`}
                      >
                        {garment.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">
                        {garment.description}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 flex-shrink-0 transition-transform mt-2 ${
                        isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>

                  {/* Badges strip */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] pl-2">
                    <span className="text-amber-300/80 font-medium truncate max-w-[180px]">
                      {garment.fabricMatch}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {garment.period}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Deep-Dive Cultural Visualizer & Knowledge Desk (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-[#0E1526]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[580px]">
            {/* Top Atmospheric Watermark Pattern */}
            <div
              className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: selectedGarment.colorHex }}
            />

            <div>
              {/* Header with Name, Han Tu, and Dynasty */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedGarment.category}
                    </span>
                    <span className="text-xs text-slate-400">{selectedGarment.dynasty}</span>
                  </div>
                  <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-100 flex items-center gap-3">
                    <span>{selectedGarment.name}</span>
                    <span className="text-lg font-normal text-amber-400/80 font-serif-vi border-l border-amber-500/40 pl-3">
                      {selectedGarment.hanTu}
                    </span>
                  </h3>
                </div>

                {/* Direct Action: Try This in Fitting Room */}
                {selectedGarment.avatarTopId && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      soundEngine.playPluck(659.25);
                      onSelectGarmentForFitting(selectedGarment.avatarTopId!);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_6px_20px_rgba(245,158,11,0.3)] flex items-center gap-2 cursor-pointer font-sans-vi"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Trải Nghiệm Thử Thức Áo Này</span>
                  </motion.button>
                )}
              </div>

              {/* Garment Quick Meta Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#121A2D]/80 border border-slate-700/60 text-xs mb-6">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">
                    Tầng Lớp Mặc
                  </span>
                  <span className="text-slate-200 font-medium block truncate">
                    {selectedGarment.socialRank}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">
                    Chất Liệu Truyền Thống
                  </span>
                  <span className="text-amber-300 font-medium block truncate">
                    {selectedGarment.fabricMatch}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">
                    Sắc Độ Thần Thái
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0"
                      style={{ backgroundColor: selectedGarment.colorHex }}
                    />
                    <span className="text-slate-200 font-medium truncate">
                      {selectedGarment.colorSpirit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-tabs for deep dive: Tổng quan / Cấu trúc nhiều lớp / Triết lý / Kỹ nghệ may */}
              <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2 mb-5">
                {[
                  { id: 'overview', label: 'Tổng Quan & Dáng Phục' },
                  { id: 'layers', label: 'Cấu Trúc Lớp Áo (Layering)' },
                  { id: 'philosophy', label: 'Triết Lý Văn Hóa' },
                  { id: 'craftsmanship', label: 'Kỹ Nghệ Dệt May' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playPluck(493.88);
                      setActiveTab(tab.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents with Framer Motion AnimatePresence */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-200 leading-relaxed font-sans-vi font-light">
                      {selectedGarment.description}
                    </p>

                    <div className="p-4 rounded-xl bg-[#090E1A] border border-amber-500/20">
                      <span className="text-xs font-semibold text-amber-300 block mb-1">
                        Dáng Phục & Thần Thái:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedGarment.silhouetteDescription}
                      </p>
                    </div>

                    {/* Symbolism pills */}
                    <div>
                      <span className="text-xs font-medium text-slate-400 block mb-2">
                        Ý niệm biểu trưng:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedGarment.symbolism.map((sym, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-[#141F36] text-amber-200 border border-amber-500/30 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'layers' && (
                  <motion.div
                    key="layers"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    <div className="text-xs text-slate-300 font-light mb-2">
                      Cổ phục Việt Nam nổi tiếng với nghệ thuật mặc đa lớp (layering), mỗi tầng áo mang một công năng bảo vệ và ý nghĩa thẩm mỹ riêng biệt:
                    </div>

                    <div className="space-y-2.5">
                      {selectedGarment.layerStructure.map((layer) => (
                        <div
                          key={layer.layer}
                          className="p-3.5 rounded-xl bg-[#121B30] border border-slate-700/70 flex items-start gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {layer.layer}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-amber-200 block">
                              {layer.name}
                            </span>
                            <span className="text-xs text-slate-300 font-light leading-relaxed">
                              {layer.purpose}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'philosophy' && (
                  <motion.div
                    key="philosophy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121E36] to-[#0D1526] border border-amber-500/30">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Shield className="w-4 h-4" />
                        <span>Triết Lý & Đạo Học Phương Đông</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                        {selectedGarment.culturalPhilosophy}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
                      <strong>Lưu ý di sản:</strong> Cổ phục Việt Nam không chỉ là trang phục để mặc, mà là một ngôn ngữ biểu đạt của lễ giáo, thể hiện cốt cách khiêm tốn, biết ơn nguồn cội và lòng tự tôn văn hiến.
                    </div>
                  </motion.div>
                )}

                {activeTab === 'craftsmanship' && (
                  <motion.div
                    key="craftsmanship"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                      {selectedGarment.craftsmanship}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#121B30] border border-slate-700/70">
                        <span className="text-xs font-bold text-amber-300 block mb-1">
                          Kỹ Thuật May Lộn Giấu Chỉ
                        </span>
                        <p className="text-xs text-slate-300 font-light">
                          Các thợ may cổ xưa dùng tay khâu mũi đột, mũi lộn mép sao cho hai mặt áo đều sạch bóng như một, không để lộ một vết chỉ thừa.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#121B30] border border-slate-700/70">
                        <span className="text-xs font-bold text-amber-300 block mb-1">
                          Nhuộm Thảo Mộc Tự Nhiên
                        </span>
                        <p className="text-xs text-slate-300 font-light">
                          Màu sắc được chiết xuất từ lá trầu, củ nâu, hoa hồng hoa, gỗ vang tạo nên sắc độ trầm ấm, dịu mắt và bền vững cùng thời gian.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Fun Fact Callout */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Bạn có biết? </span>
                <span className="font-light">{selectedGarment.funFact}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
