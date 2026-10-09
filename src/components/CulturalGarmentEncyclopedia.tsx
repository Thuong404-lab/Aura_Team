import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
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
  Clock,
  Feather,
  LayoutGrid,
  Columns3,
  X,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

export interface GarmentShowcaseItem {
  id: string;
  name: string;
  hanTu: string;
  category: 'Áo Lễ & Thượng Phục' | 'Trang Phục Thường Nhật' | 'Cổ Phong Cách Tân';
  dynasty: string;
  period: string;
  socialRank: string;
  description: string;
  history: string; // Lịch sử ra đời & triều đại
  meaning: string; // Ý nghĩa triết lý & biểu trưng
  material: string; // Chất liệu tơ lụa & gấm vóc
  craftsmanship: string;
  culturalPhilosophy: string;
  silhouetteDescription: string;
  symbolism: string[];
  fabricMatch: string;
  colorSpirit: string;
  colorHex: string;
  imageUrl: string;
  avatarTopId?: string;
  layerStructure: { layer: number; name: string; purpose: string }[];
  funFact: string;
}

export const CULTURAL_GARMENTS: GarmentShowcaseItem[] = [
  {
    id: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    hanTu: '五身手窄',
    category: 'Trang Phục Thường Nhật',
    dynasty: 'Triều Nguyễn (Chúa Võ Vương Nguyễn Phúc Khoát định hình)',
    period: 'Năm 1744 — Thế kỷ XX',
    socialRank: 'Toàn dân (từ sĩ phu, thứ dân đến quan lại và hoàng thân)',
    description:
      'Áo ngũ thân tay chẽn là tiền thân trực tiếp của chiếc Áo Dài Việt Nam hiện đại. Áo có cổ đứng nghiêm cẩn (cổ lập), năm thân áo ghép lại kín đáo và tay áo được may ôm gọn từ khuỷu tay đến cổ tay, tiện cho sinh hoạt thường nhật mà vẫn giữ trọn phong thái thanh lịch.',
    history:
      'Được Chúa Nguyễn Phúc Khoát định hình năm 1744 ở Đàng Trong nhằm khẳng định bản sắc phục sức riêng biệt. Đến năm 1836 - 1837 dưới thời vua Minh Mạng, áo được ban hành quy chế trở thành quốc phục chính thống của toàn dân Đại Nam từ Bắc chí Nam.',
    meaning:
      'Biểu trưng cho "Tứ Thân Phụ Mẫu" qua 4 thân ngoài (cha mẹ mình và cha mẹ người phối ngẫu), thân thứ 5 bên trong chở che thân phận. 5 hạt cúc cài tượng trưng cho "Ngũ Thường": Nhân, Nghĩa, Lễ, Trí, Tín - chuẩn mực đạo đức cốt cách người quân tử.',
    material:
      'Dệt từ tơ tằm Vạn Phúc, lụa Hà Đông, gấm trơn Sa Nam hoặc vải đũi nhuộm thảo mộc tự nhiên (củ nâu, vỏ trầu, gỗ vang). Vải thoáng mát mùa hạ, giữ ấm tốt mùa đông.',
    craftsmanship:
      'Kỹ thuật may lộn mép giấu chỉ tuyệt mỹ, đường can dọc thân thẳng tắp không lộ đường kim mũi chỉ. Cổ áo lót cứng bằng vải mộc định hình cổ đứng trang nghiêm.',
    culturalPhilosophy:
      'Triết lý "Ngũ thân phụ mẫu" kết hợp đạo hiếu và nếp sống kính trên nhường dưới. Áo mang phom suông rộng rãi kín đáo, tôn vinh vẻ đẹp tự nhiên không gò bó.',
    silhouetteDescription: 'Thân áo suông nhẹ, tay ôm chẽn, tà uốn cong hình cánh cung uyển chuyển khi bước đi.',
    symbolism: ['Đạo hiếu phụ mẫu', 'Ngũ thường quân tử', 'Kín đáo đoan trang'],
    fabricMatch: 'Lụa tơ tằm Vạn Phúc, Gấm trơn Sa Nam',
    colorSpirit: 'Sắc Tía thắm / Đỏ Chu Sa / Xanh Thiên Thanh',
    colorHex: '#C53030',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600',
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
    dynasty: 'Triều Nguyễn (Hoàng Cung Cố Đô Huế)',
    period: 'Năm 1807 — 1945',
    socialRank: 'Hoàng Thái Hậu, Hoàng Hậu, Công Chúa, Phi Tần & Mệnh Phụ',
    description:
      'Áo Nhật Bình là đệ nhất pháp phục tôn quý của nữ giới hoàng tộc triều Nguyễn. Điểm nhận diện đặc trưng là cổ áo to bản hình chữ nhật đối khâm trước ngực, hai vạt áo buộc dải kết ngọc, gấu áo thêu đồ án Thủy Ba dập dờn sóng nước cát tường.',
    history:
      'Được quy định chính thức vào năm Gia Long thứ 6 (1807) trong Khâm Định Đại Nam Hội Điển Sự Lệ, phỏng dựng từ mẫu áo Phi Phong truyền thống và biến tấu thành biểu tượng độc tôn quyền quý của nữ chủ hoàng triều.',
    meaning:
      'Cổ áo hình chữ nhật (chữ Nhật - vầng thái dương) biểu trưng cho sự quang minh chính đại. Dải ngũ sắc ở tay áo tượng trưng cho thuyết Ngũ Hành (Kim - Mộc - Thủy - Hỏa - Thổ) điều hòa trời đất. Đồ án Thủy Ba cầu chúc vương triều thái bình thịnh trị.',
    material:
      'Dệt từ gấm cung đình thượng hạng, sa lụa hoàng gia, thêu thủ công bằng chỉ tơ nhuộm thảo mộc và chỉ kim tuyến (sợi dát vàng thật 24k). Đính kèm cúc ngọc bích, san hô hoặc mã não.',
    craftsmanship:
      'Thêu tay cố cung bằng chỉ vàng kim tuyến và chỉ tơ nhuộm thảo mộc tự nhiên. Đồ án phượng hoàng ngậm hoa mẫu đơn, hoa cúc vạn thọ và bát bửu cát tường.',
    culturalPhilosophy:
      'Hài hòa âm dương và trật tự thứ bậc nghiêm cẩn. Màu sắc áo thể hiện chính xác tước vị (Vàng chính sắc cho Hoàng Hậu, Đỏ cho Công Chúa, Tím tam giai phi tần).',
    silhouetteDescription: 'Dáng áo xòe rộng uy nghi, cổ đối khâm chữ nhật song song, tà áo chạm gót chân.',
    symbolism: ['Uy quyền hoàng gia', 'Ngũ hành tương sinh', 'Vạn thọ vô cương'],
    fabricMatch: 'Gấm Cung Đình dệt sợi vàng, Sa hoàng gia Huế',
    colorSpirit: 'Vàng Hoàng Yến / Cam Xích Đào / Tím Cung Đình',
    colorHex: '#D97706',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=600',
    avatarTopId: 'nhat-binh',
    layerStructure: [
      { layer: 1, name: 'Áo cánh cổ thìa bằng lụa bạch', purpose: 'Lớp lót êm ái bảo vệ làn da tôn quý' },
      { layer: 2, name: 'Áo ngũ thân chẽn lót trong', purpose: 'Tạo độ phồng nhẹ tự nhiên và giữ phom áo' },
      { layer: 3, name: 'Áo Nhật Bình đại triều khoác ngoài', purpose: 'Pháp phục lộng lẫy thêu kim tuyến triều nghi' },
      { layer: 4, name: 'Khăn vành dây quấn kim tuyến', purpose: 'Vương miện khăn lụa trác tuyệt của phụ nữ cung đình' },
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
    history:
      'Phát triển song hành cùng áo ngũ thân thời Nguyễn, quy định làm lễ phục thường dụng cho quan lại khi thính triều và cho dân chúng trong các nghi lễ gia đình trang trọng.',
    meaning:
      'Khi làm lễ, người mặc khoanh tay chắp trước ngực giấu bàn tay vào lòng ống tay thụng rộng, thể hiện đức khiêm cung, tôn kính tổ tiên trời đất, trừ bỏ tâm tư vị kỷ.',
    material:
      'Gấm dệt chữ Thọ mây cuộn, lụa the tơ tằm nguyên chất hoặc lụa đũi dệt thủ công làng nghề Nha Xá, Vạn Phúc. Thường có màu chàm, đỏ chu sa hoặc tím trầm hoàng tộc.',
    craftsmanship:
      'Được may ghép 5 thân khổ hẹp truyền thống với đường may dấu mép tinh tế. Cổ áo dựng đứng có dải khăn lụa trắng cài lót cổ áo bảo vệ tơ tằm.',
    culturalPhilosophy:
      'Đạo đức khiêm nhường và tôn kính phụ mẫu gia tiên. Thần thái uy nghiêm, khoan thai và tĩnh tại trong từng động tác hành lễ.',
    silhouetteDescription: 'Tay áo thụng buông thõng uy nghiêm, tà áo chấm mắt cá chân tạo dáng đứng trang trọng.',
    symbolism: ['Khiêm cung lễ nghi', 'Tôn kính tổ tiên', 'Hòa hợp cộng đồng'],
    fabricMatch: 'Gấm dệt chữ Thọ, Lụa tơ sống nhuộm chàm thẫm',
    colorSpirit: 'Xanh Chàm Đậm / Lam Thẫm Triều Nghi / Đỏ Huyết',
    colorHex: '#1E3A8A',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=600',
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
    period: 'Thế kỷ XI — XVIII (Hơn 700 năm lịch sử)',
    socialRank: 'Quý tộc, Hoàng thân, Sĩ phu và Thứ dân thời cổ',
    description:
      'Áo Giao Lĩnh là cội nguồn của phục sức Việt cổ xuyên suốt ngàn năm độc lập tự chủ. Cổ áo hai vạt đan chéo nhau trước ngực (hữu nhậm - vạt trái đè vạt phải), dáng áo rộng rãi thênh thang mang đậm phong thái thần tiên thoát tục.',
    history:
      'Hiện diện rực rỡ từ thời Lý - Trần và đạt đỉnh cao thẩm mỹ dưới thời Lê Sơ. Bằng chứng khảo cổ tại lăng mộ các bậc vương tôn triều Lê cho thấy kỹ nghệ dệt thêu áo Giao Lĩnh đạt trình độ siêu việt.',
    meaning:
      'Đường cổ chữ V vạt trái đè vạt phải tuân theo nguyên lý Âm Dương tương hợp: Tay áo và vạt áo vuông tròn hòa quyện ("Trời tròn Đất vuông"). Phản ánh hào khí Đông A khoáng đạt và tinh thần Thiền tông thời Lý Trần.',
    material:
      'Dệt vải khổ rộng bằng khung cửi cổ truyền từ đũi tơ tằm Nam Cao, sa lụa đũi mộc. Nhuộm thảo mộc từ vỏ cây sú vẹt, lá chàm rừng và củ nâu Đại Hoàng cho sắc màu trường tồn.',
    craftsmanship:
      'Dệt hoa văn rồng thời Lê, hoa cúc dây uốn lượn phong vị thiền định. Đai lưng bằng gấm thêu bản lớn thắt giữ vạt áo uyển chuyển.',
    culturalPhilosophy:
      'Thuận hòa cùng thiên nhiên và càn khôn vũ trụ. Thể hiện cốt cách tự do, thanh tao của bậc hiền triết phương Đông.',
    silhouetteDescription: 'Tay áo cánh dơi rộng, tà áo thướt tha buông dài, thắt đai lưng gấm mềm mại.',
    symbolism: ['Hào khí Đông A', 'Âm Dương hòa hợp', 'Khí phách ngàn năm'],
    fabricMatch: 'Đũi tơ tằm Nam Cao, Lụa chũi tự nhiên',
    colorSpirit: 'Huyền Thiên (Đen nhung) / Xanh Lục Cỏ Non / Vàng Đất',
    colorHex: '#059669',
    imageUrl: 'https://images.unsplash.com/photo-1590333746438-283450096582?auto=format&fit=crop&q=80&w=600',
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
    history:
      'Gắn liền với nền văn minh lúa nước sông Hồng và không gian diễn xướng Dân ca Quan họ Bắc Ninh. Đây là trang phục phổ biến nhất của người phụ nữ nông thôn miền Bắc qua nhiều thế kỷ.',
    meaning:
      'Bốn thân áo đại diện cho bốn đức tính tốt đẹp của người phụ nữ: "Công — Dung — Ngôn — Hạnh". Vạt áo buộc trước bụng như chiếc nút thắt tình cảm bền chặt, thủy chung son sắt.',
    material:
      'May từ đũi, lụa mộc, vải the mỏng nhuộm màu nâu non của củ nâu, màu đen bùn tự nhiên hoặc nhuộm hoa hồng hoa cho yếm đào. Chất liệu thân thiện, mộc mạc và dẻo dai.',
    craftsmanship:
      'Đường kim khâu tay đột tỉ mỉ của các cô gái vùng Kinh Bắc; nón quai thao đan bằng lá cọ mỏng manh với quai thao dệt bằng sợi tơ tằm tinh xảo.',
    culturalPhilosophy:
      'Tôn vinh nét duyên thầm, đức hy sinh tảo tần của người phụ nữ Việt Nam, hòa mình vào thiên nhiên đồng ruộng chân phương.',
    silhouetteDescription: 'Áo xẻ tà cao, buộc vạt eo thon thả, khoe khéo bờ vai thon và cổ yếm trắng hồng.',
    symbolism: ['Duyên ngầm Kinh Bắc', 'Tứ đức Công Dung Ngôn Hạnh', 'Hồn quê châu thổ'],
    fabricMatch: 'Đũi thô nhuộm nâu non, Lụa tơ Hà Đông mộc',
    colorSpirit: 'Nâu Sồng Gỗ / Đỏ Yếm Đào / Xanh Cốm',
    colorHex: '#92400E',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600',
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
      'Áo cổ tròn khép kín quanh chân cổ bằng nút gài vai phải, tay áo rộng uy nghi. Trước ngực và sau lưng đính tấm Bổ Tử (tấm gấm vuông thêu họa tiết quy chuẩn): Quan văn thêu chim muông, Quan võ thêu linh thú.',
    history:
      'Là phẩm phục đại triều chính thức của quan lại suốt các triều đại Lý, Trần, Lê, Mạc và Nguyễn. Quy chuẩn Bổ Tử được điển chế nghiêm ngặt trong triều chính nhằm phân định cấp bậc văn võ.',
    meaning:
      'Cổ áo tròn (Viên) tượng trưng cho Vòm Trời; tấm Bổ Tử vuông tượng trưng cho Mặt Đất bằng phẳng cương trực ("Trời tròn Đất vuông"). Người đại thần khoác áo Viên Lĩnh gánh vác trách nhiệm điều hòa Thiên — Địa — Nhân.',
    material:
      'Đoạn Bát Ty hoàng cung dệt vân mây, gấm lụa cao cấp; tấm Bổ Tử thêu chỉ kim hoàn (vàng, bạc) cùng chỉ tơ nhuộm ngũ sắc rực rỡ.',
    craftsmanship:
      'Thêu nổi khối kim tuyến tỉ mỉ bậc nhất. Họa tiết chim Hạc (Nhất phẩm văn), Khổng Tước (Tam phẩm), Kỳ Lân (Nhất phẩm võ) sống động như tranh vẽ.',
    culturalPhilosophy:
      'Đại diện cho kỷ cương phép nước, sự công chính liêm minh và trách nhiệm phụng sự giang sơn của bậc sĩ phu đỗ đạt.',
    silhouetteDescription: 'Thân áo thụng dài chấm gót, cổ khít tròn, hai bên hông xẻ tà có cánh áo lót che kín.',
    symbolism: ['Phẩm hàm triều chính', 'Trời tròn đất vuông', 'Cương trực thanh liêm'],
    fabricMatch: 'Đoạn Bát Ty hoàng cung, Gấm tơ thêu chỉ kim hoàn',
    colorSpirit: 'Đỏ Tía Son Triều Thần / Xanh Biển Sâu / Đen Huyền Mặc',
    colorHex: '#991B1B',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
    avatarTopId: 'vien-linh',
    layerStructure: [
      { layer: 1, name: 'Trung đơn trắng cổ tròn', purpose: 'Định hình chân cổ sạch sẽ uy nghiêm' },
      { layer: 2, name: 'Áo Viên Lĩnh thêu Bổ Tử', purpose: 'Phẩm phục đại triều bái kiến thiên tử' },
      { layer: 3, name: 'Mũ Ô Sa cánh chuồn & Đai lưng', purpose: 'Bộ lễ phục hoàn chỉnh của sĩ thứ đỗ đạt' },
    ],
    funFact: 'Nhìn vào con chim hay con thú thêu trên ngực áo Viên Lĩnh, người dân thời xưa có thể biết ngay vị quan này giữ chức phẩm hàm cấp bậc nào.',
  },
  {
    id: 'ao-yem-khue-cac',
    name: 'Áo Yếm Khuê Các (Nội Y Cổ Truyền)',
    hanTu: '掩衣 (春桃)',
    category: 'Trang Phục Thường Nhật',
    dynasty: 'Thời Lý — Trần — Lê — Nguyễn',
    period: 'Thế kỷ XI — Hiện đại',
    socialRank: 'Phụ nữ mọi tầng lớp (từ cung cấm khuê phòng đến thôn nữ bình dân)',
    description:
      'Áo Yếm là mảnh lụa hình thoi hoặc vuông che ngực, có dây buộc qua cổ và hai bên lưng. Tôn vinh nét đẹp thắt đáy lưng ong và bờ vai mềm mại thuần khiết của người phụ nữ Việt Nam.',
    history:
      'Tồn tại qua ngàn năm lịch sử, trải qua nhiều dạng cổ áo: Cổ xẻ (chữ V), Cổ tròn (cổ thìa) và Cổ khoét sâu. Trong cung đình, cung phi mặc yếm lụa thêu hoa sen, ngoài dân gian mặc yếm nâu, yếm đào dệt bằng tơ mộc.',
    meaning:
      'Biểu tượng của nét xuân thì tràn trề sức sống, sự dịu dàng kín đáo mà gợi cảm tinh tế của người phụ nữ Á Đông. Yếm đào đỏ gắn liền với câu ca dao tình tứ ngàn đời.',
    material:
      'Lụa tơ tằm mềm mại, đũi mộc hoặc lụa sa thoáng khí. Dây yếm bằng sợi tơ se tròn dẻo dai buộc sau gáy và quanh eo.',
    craftsmanship:
      'Cắt lượn hình thoi khéo léo, may viền lộn mép mềm mại tránh cọ xát làn da ngọc ngà; hoa sen và hoa cúc thêu tơ tằm tinh xảo trên ngực yếm.',
    culturalPhilosophy:
      'Nâng niu vẻ đẹp tự nhiên của thân thể người phụ nữ trong khuôn khổ mỹ học Á Đông kín đáo, e ấp mà quyến rũ.',
    silhouetteDescription: 'Mảnh lụa ôm trọn vòm ngực, khoe trọn lưng ong và cần cổ trắng ngần khi mặc kèm áo khoác sa.',
    symbolism: ['Xuân thì thiếu nữ', 'Duyên ngầm e ấp', 'Thuần khiết thanh tao'],
    fabricMatch: 'Lụa tơ tằm Hà Đông mỏng nhẹ, Đũi tơ sống',
    colorSpirit: 'Đỏ Yếm Đào / Hồng Cánh Sen / Trắng Ngà Lụa Bạch',
    colorHex: '#B23A48',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    avatarTopId: 'ao-yem',
    layerStructure: [
      { layer: 1, name: 'Yếm lụa ôm sát ngực', purpose: 'Nâng niu cơ thể và tạo điểm tựa êm ái' },
      { layer: 2, name: 'Dây lụa buộc sau gáy và lưng', purpose: 'Định hình độ ôm vừa vặn uyển chuyển' },
      { layer: 3, name: 'Áo khoác ngoài (Tứ thân hoặc Áo cánh)', purpose: 'Phối tầng lớp nửa kín nửa hở duyên dáng' },
    ],
    funFact: 'Thời xưa, màu yếm còn thể hiện tuổi tác: Thiếu nữ chưa chồng mặc yếm đỏ, yếm đào; phụ nữ đứng tuổi mặc yếm nâu, yếm sẫm.',
  },
  {
    id: 'ao-cach-tan-duong-dai',
    name: 'Áo Dài Phom Cổ Cách Tân 2026',
    hanTu: '新古風衣',
    category: 'Cổ Phong Cách Tân',
    dynasty: 'Kỷ Nguyên Hiện Đại 2026',
    period: 'Thế kỷ XXI (Đương đại)',
    socialRank: 'Giới trẻ, nghệ sĩ, tín đồ thời trang di sản & phong cách sống mới',
    description:
      'Giao thoa đỉnh cao giữa cấu trúc 5 thân cổ truyền và đường cắt may tối giản đương đại. Giữ trọn tinh thần cổ phong nhưng được may bằng kỹ thuật hiện đại, phóng khoáng và tiện dụng cho nhịp sống đô thị.',
    history:
      'Khởi nguồn từ làn sóng "Phục hưng Cổ phục Việt" của thế hệ trẻ trong thập niên 2020, kết hợp khảo cứu bảo tàng với xu hướng thời trang quốc tế đương đại.',
    meaning:
      'Tuyên ngôn về bản sắc văn hóa Việt trong thời đại toàn cầu hóa: Di sản không phải là thứ đóng khung trong viện bảo tàng, mà là nguồn cảm hứng sống động đồng hành cùng nhịp đập hiện đại.',
    material:
      'Lụa tơ sống dệt sợi bạc, sợi gai dầu sinh học cao cấp, đũi tơ tằm dệt chìm họa tiết mây hạc đương đại kết hợp khóa cài kim loại mạ vàng tinh xảo.',
    craftsmanship:
      'Đường cắt rập 3D công nghệ cao chuẩn xác kết hợp chi tiết khâu tay thủ công từ các nghệ nhân làng nghề truyền thống.',
    culturalPhilosophy:
      'Sự tiếp nối và tiến hóa không ngừng của cái đẹp. Thể hiện niềm tự hào cội nguồn của thế hệ người Việt hiện đại tự tin bước ra thế giới.',
    silhouetteDescription: 'Cổ trụ thấp thanh mảnh, phom suông tối giản, tà áo bay bổng nhẹ nhàng trên phố.',
    symbolism: ['Tiếp nối di sản', 'Hội nhập toàn cầu', 'Sáng tạo đột phá'],
    fabricMatch: 'Đũi tơ tằm pha sợi bạc, Lụa cát cao cấp',
    colorSpirit: 'Đỏ Thẫm Hiện Đại / Trắng Ngà Ánh Kim / Xanh Rêu',
    colorHex: '#8B1E1E',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
    avatarTopId: 'cach-tan',
    layerStructure: [
      { layer: 1, name: 'Lớp lót tơ lụa kháng khuẩn', purpose: 'Tạo cảm giác thông thoáng cho ngày dài' },
      { layer: 2, name: 'Phom áo 5 thân cắt rập 3D', purpose: 'Đứng phom dáng chuẩn mực mà vẫn êm ái linh hoạt' },
      { layer: 3, name: 'Phụ kiện mạ vàng đính kèm', purpose: 'Tạo điểm nhấn thời thượng đương đại' },
    ],
    funFact: 'Các mẫu áo cổ phong cách tân hiện đang được giới trẻ diện phổ biến tại các tuần lễ thời trang Paris, Seoul và các lễ hội quốc tế lớn.',
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
  const [viewMode, setViewMode] = useState<'cards' | 'studio'>('cards');
  const [modalGarment, setModalGarment] = useState<GarmentShowcaseItem | null>(null);

  const selectedGarment =
    CULTURAL_GARMENTS.find((g) => g.id === selectedGarmentId) || CULTURAL_GARMENTS[0];

  const filteredGarments = CULTURAL_GARMENTS.filter((g) => {
    if (filterCategory === 'all') return true;
    return g.category === filterCategory;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Thức Áo' },
    { id: 'Áo Lễ & Thượng Phục', label: 'Áo Lễ & Thượng Phục' },
    { id: 'Trang Phục Thường Nhật', label: 'Trang Phục Thường Nhật' },
    { id: 'Cổ Phong Cách Tân', label: 'Cổ Phong Cách Tân' },
  ];

  return (
    <section id="encyclopedia-section" className="w-full my-16 text-left relative z-10">
      {/* Decorative Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-amber-400">
              KHO TÀNG KHẢO CỨU DI SẢN
            </span>
          </div>
          <h2 className="font-serif-vi text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100">
            Bách Khoa Toàn Thư Cổ Phục Việt
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl font-light font-sans-vi leading-relaxed">
            Tra cứu toàn diện về <strong className="text-amber-300 font-semibold">Lịch sử ra đời</strong>,{' '}
            <strong className="text-amber-300 font-semibold">Ý nghĩa triết lý</strong> và{' '}
            <strong className="text-amber-300 font-semibold">Chất liệu gấm vóc</strong> của từng loại trang phục truyền thống qua các thời kỳ.
          </p>
        </div>

        {/* Action Controls: Filter & View Mode */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#10182b] p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => {
                soundEngine.playPluck(440);
                setViewMode('cards');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dạng thẻ bách khoa toàn thư"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Thẻ Thông Tin (Cards)</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playPluck(523.25);
                setViewMode('studio');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'studio'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Khảo cứu chuyên sâu 2 cột"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Bàn Khảo Cứu (Studio)</span>
            </button>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playPluck(440);
                  setFilterCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60 font-bold'
                    : 'bg-[#121A2D] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: ENCYCLOPEDIA CARDS GRID WITH SOFT HOVER ZOOM */}
      {viewMode === 'cards' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGarments.map((garment, idx) => (
            <motion.div
              key={garment.id}
              whileHover={{
                scale: 1.025,
                y: -6,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              className="group rounded-3xl bg-gradient-to-b from-[#11192e] to-[#0b101e] border border-amber-500/25 hover:border-amber-400/70 p-5 shadow-lg hover:shadow-[0_16px_36px_rgba(245,158,11,0.18)] transition-all flex flex-col justify-between relative overflow-hidden backdrop-blur-md cursor-pointer"
              onClick={() => {
                soundEngine.playPluck(523.25 + idx * 25);
                setModalGarment(garment);
              }}
            >
              {/* Top ambient color glow on hover */}
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity pointer-events-none"
                style={{ backgroundColor: garment.colorHex }}
              />

              <div>
                {/* Visual Header with Image & Zoom effect */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-900 border border-slate-700/60">
                  <img
                    src={garment.imageUrl}
                    alt={garment.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b101e] via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/40">
                      {garment.category}
                    </span>
                  </div>

                  {/* Top Right Han Tu */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-xs font-serif-vi bg-black/60 backdrop-blur-md text-amber-200 border border-amber-500/30">
                    {garment.hanTu}
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-300/90 block font-semibold">
                        {garment.period}
                      </span>
                      <h3 className="font-serif-vi text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                        {garment.name}
                      </h3>
                    </div>
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 border-white/60 shadow"
                      style={{ backgroundColor: garment.colorHex }}
                      title={`Tông màu: ${garment.colorSpirit}`}
                    />
                  </div>
                </div>

                {/* THE 3 CORE ENCYCLOPEDIA DATA BLOCKS (LỊCH SỬ - Ý NGHĨA - CHẤT LIỆU) */}
                <div className="space-y-3 mb-4">
                  {/* 1. LỊCH SỬ (HISTORY) */}
                  <div className="p-3 rounded-xl bg-[#0d1424]/90 border border-slate-800/80 group-hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Lịch Sử & Triều Đại</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans-vi line-clamp-2">
                      {garment.history}
                    </p>
                  </div>

                  {/* 2. Ý NGHĨA (MEANING & SYMBOLISM) */}
                  <div className="p-3 rounded-xl bg-[#0d1424]/90 border border-slate-800/80 group-hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ý Nghĩa & Biểu Trưng</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans-vi line-clamp-2">
                      {garment.meaning}
                    </p>
                  </div>

                  {/* 3. CHẤT LIỆU (MATERIAL & FABRIC) */}
                  <div className="p-3 rounded-xl bg-[#0d1424]/90 border border-slate-800/80 group-hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                      <Feather className="w-3.5 h-3.5 text-amber-400" />
                      <span>Chất Liệu & Gấm Vóc</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans-vi line-clamp-2">
                      {garment.material}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playPluck(493.88);
                    setModalGarment(garment);
                  }}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Đọc Khảo Cứu</span>
                </button>

                {garment.avatarTopId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playPluck(659.25);
                      onSelectGarmentForFitting(garment.avatarTopId!);
                    }}
                    className="text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 py-1.5 px-3 rounded-lg shadow flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Mặc Thử Ngay</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* VIEW MODE 2: INTERACTIVE DEEP-DIVE STUDIO (2 COLS) */}
      {viewMode === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Garment Selector List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-slate-400 px-1 mb-1 flex items-center justify-between">
              <span>DANH SÁCH THỨC ÁO TRUYỀN THỐNG</span>
              <span>{filteredGarments.length} thức áo</span>
            </div>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredGarments.map((garment, idx) => {
                const isSelected = garment.id === selectedGarment.id;
                return (
                  <motion.div
                    key={garment.id}
                    whileHover={{ x: 4, scale: 1.01 }}
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
                      <div className="flex-1">
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

          {/* Right Column: Interactive Deep-Dive Cultural Visualizer (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0E1526]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[640px]">
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
                      <span>Mặc Thử Thức Áo Này</span>
                    </motion.button>
                  )}
                </div>

                {/* Garment Quick Meta Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#121A2D]/80 border border-slate-700/60 text-xs mb-5">
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

                {/* Sub-tabs for deep dive: Lịch sử & Tổng quan / Cấu trúc nhiều lớp / Ý nghĩa triết lý / Kỹ nghệ may */}
                <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2 mb-5 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'overview', label: 'Lịch Sử & Tổng Quan' },
                    { id: 'philosophy', label: 'Ý Nghĩa & Triết Lý' },
                    { id: 'craftsmanship', label: 'Chất Liệu & Kỹ Nghệ' },
                    { id: 'layers', label: 'Cấu Trúc Lớp Áo' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundEngine.playPluck(493.88);
                        setActiveTab(tab.id as any);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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
                      {/* Detailed History Box */}
                      <div className="p-4 rounded-xl bg-[#090E1A] border border-amber-500/25">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>Lịch Sử & Bối Cảnh Thời Đại:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans-vi">
                          {selectedGarment.history}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-vi font-light">
                        {selectedGarment.description}
                      </p>

                      <div className="p-3.5 rounded-xl bg-[#121B30] border border-slate-700/70">
                        <span className="text-xs font-semibold text-amber-300 block mb-1">
                          Dáng Phục & Thần Thái Khi Mặc:
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
                          <span>Ý Nghĩa Văn Hóa & Triết Lý Sâu Xa</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                          {selectedGarment.meaning}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-700/80">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1.5">
                          Tư Tưởng Phương Đông & Đạo Học:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                      {/* Material Highlight */}
                      <div className="p-4 rounded-xl bg-[#090E1A] border border-amber-500/25">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                          <Feather className="w-4 h-4 text-amber-400" />
                          <span>Chất Liệu Tơ Lụa & Nhuộm Thảo Mộc:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans-vi">
                          {selectedGarment.material}
                        </p>
                      </div>

                      <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                        {selectedGarment.craftsmanship}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
      )}

      {/* MODAL CHI TIẾT KHẢO CỨU KHI BẤM VÀO THẺ (EXPANDED CARD DIALOG) */}
      <AnimatePresence>
        {modalGarment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0f172a] border border-amber-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalGarment(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {modalGarment.category}
                </span>
                <span className="text-xs text-slate-400">{modalGarment.dynasty}</span>
              </div>
              <h3 className="font-serif-vi text-2xl sm:text-3xl font-bold text-amber-100 flex items-center gap-3 mb-4">
                <span>{modalGarment.name}</span>
                <span className="text-xl font-normal text-amber-400/80 font-serif-vi border-l border-amber-500/40 pl-3">
                  {modalGarment.hanTu}
                </span>
              </h3>

              {/* Visual image */}
              <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={modalGarment.imageUrl}
                  alt={modalGarment.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              </div>

              {/* 3 Core Fields in Full View */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#141f38] border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>1. Lịch Sử Ra Đời & Triều Đại</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                    {modalGarment.history}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141f38] border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>2. Ý Nghĩa Triết Lý & Biểu Trưng Văn Hóa</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                    {modalGarment.meaning}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141f38] border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                    <Feather className="w-4 h-4 text-amber-400" />
                    <span>3. Chất Liệu Tơ Lụa & Kỹ Nghệ May Gấm</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans-vi">
                    {modalGarment.material}
                  </p>
                </div>
              </div>

              {/* Fun fact */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mb-6 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Bạn có biết? </strong> {modalGarment.funFact}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalGarment(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                {modalGarment.avatarTopId && (
                  <button
                    onClick={() => {
                      const id = modalGarment.avatarTopId!;
                      setModalGarment(null);
                      soundEngine.playPluck(659.25);
                      onSelectGarmentForFitting(id);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_6px_20px_rgba(245,158,11,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Mặc Thử Ngay Trong Phòng Thử Đồ</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
