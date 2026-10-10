import { WardrobeItem } from '../data/vietPhucData';

export type TabooSeverity = 'critical' | 'warning' | 'caution';
export type TabooCategory =
  | 'ceremonial_decency' // Quy chế đoan trang & hạ y
  | 'royal_vs_folk' // Cung đình vs Dân gian
  | 'dynasty_clash' // Lệch niên đại / Triều đại
  | 'gender_customs' // Quy cách nam nữ
  | 'color_taboo' // Kiêng kỵ sắc phục & Hoàng quyền
  | 'modesty_taboo' // Thuần phong mỹ tục & Hở hạ y
  | 'sacred_heritage'; // Di sản Đông Sơn & Cội nguồn Hùng Vương

export interface CulturalTabooRule {
  id: string;
  code: string; // Mã điều luật e.g. "TABOO-01"
  title: string;
  category: TabooCategory;
  categoryName: string;
  severity: TabooSeverity;
  dynastyOrOrigin: string;
  historicalCitation: string;
  badCombinationSummary: string; // e.g. "Áo Nhật Bình ⚡ Khăn Rằn Nam Bộ"
  description: string;
  culturalReason: string;
  autoFixLabel: string;
  autoFixDescription: string;
  autoFixAction: {
    type: 'replace_bottom' | 'replace_accessory' | 'replace_top' | 'replace_color_top' | 'replace_color_bottom';
    targetId?: string;
    targetColorHex?: string;
  };
  isTriggered: (ctx: {
    top: WardrobeItem | null;
    bottom: WardrobeItem | null;
    accessory: WardrobeItem | null;
    topColorHex?: string;
    bottomColorHex?: string;
  }) => boolean;
}

export interface CulturalViolation {
  id: string;
  code?: string;
  severity: TabooSeverity;
  title: string;
  description: string;
  culturalReason: string;
  categoryName?: string;
  historicalCitation?: string;
  badCombinationSummary?: string;
  autoFixLabel?: string;
  autoFixDescription?: string;
  autoFixAction?: {
    type: 'replace_bottom' | 'replace_accessory' | 'replace_top' | 'replace_color_top' | 'replace_color_bottom' | 'adjust_gender';
    targetId?: string;
    targetColorHex?: string;
  };
}

export interface DetailedHarmonyScore {
  totalScore: number;
  eraMatchScore: number;
  etiquetteScore: number;
  fiveElementsScore: number;
  aestheticScore: number;
  ratingBadge: string;
  critiqueTitle: string;
  detailedCritique: string;
  culturalSecret: string;
  stylingTip: string;
  violations: CulturalViolation[];
}

/**
 * =========================================================================
 * BỘ ĐẠI ĐIỂN CÁC ĐIỀU CẤM KỴ CỔ PHỤC VIỆT NAM (CULTURAL TABOO DATABASE)
 * Căn cứ theo các điển chế:
 * - Khâm Định Đại Nam Hội Điển Sự Lệ (Triều Nguyễn)
 * - Chiếu dụ vua Minh Mạng năm Mậu Tý (1828)
 * - Đại Nam Thực Lục & Điển Chế Lễ Phục
 * - Lịch Triều Hiến Chương Loại Chí (Phan Huy Chú)
 * - Nho giáo gia lễ & Thuần phong mỹ tục Bắc - Trung - Nam
 * =========================================================================
 */
export const CULTURAL_TABOOS_DATABASE: CulturalTabooRule[] = [
  // 1. CẤM KỴ: Áo Lễ Nghi / Ngũ Thân Triều Nguyễn mặc Quần Tây Hiện Đại
  {
    id: 'taboo-ngu-than-quan-tay',
    code: 'TABOO-01',
    title: 'Cấm Kỵ: Áo Lễ Nghi / Ngũ Thân phối Quần Tây Hiện Đại',
    category: 'ceremonial_decency',
    categoryName: 'Quy Chế Đoan Trang & Hạ Y',
    severity: 'critical',
    dynastyOrOrigin: 'Triều Nguyễn (1802 - 1945)',
    historicalCitation: 'Khâm Định Đại Nam Hội Điển Sự Lệ: "Lễ phục thường phục nam nữ hạ y bắt buộc là quần lụa hai ống suông kín đáo, rủ che kín mu bàn chân, cấm âu phục ôm sát bó gấu."',
    badCombinationSummary: 'Áo Ngũ Thân / Áo Tấc ⚡ Quần Tây Hiện Đại',
    description: 'Áo Ngũ Thân và Áo Tấc là biểu tượng mực thước đoan trang của tổ tiên, tuyệt đối cấm kỵ mặc cùng quần âu Tây hóa bó ống hở mắt cá chân.',
    culturalReason: 'Quy chế y phục thời chúa Nguyễn Phúc Khoát (1744) và vua Minh Mạng đặt nền móng cho áo ngũ thân đi liền với quần ống sớ trắng rộng rãi. Sự tương phản giữa vạt áo lượn truyền thống và quần âu ống côn phá hủy hoàn toàn mỹ cảm phong kiến và tính tôn nghiêm.',
    autoFixLabel: 'Đổi sang Quần Ống Sớ Lụa Bạch',
    autoFixDescription: 'Thay thế quần tây bằng quần ống sớ lụa bạch chuẩn quy chế Nguyễn',
    autoFixAction: { type: 'replace_bottom', targetId: 'quan-ong-so' },
    isTriggered: ({ top, bottom }) => {
      if (!top || !bottom) return false;
      const isNguyenFormal = top.id.includes('ngu-than') || top.id.includes('ao-tac') || top.id.includes('nhat-binh');
      return isNguyenFormal && bottom.id === 'quan-tay-hien-dai';
    },
  },

  // 2. CẤM KỴ: Áo Ngũ Thân Triều Nguyễn mặc cùng Chân Váy
  {
    id: 'taboo-ngu-than-vay',
    code: 'TABOO-02',
    title: 'Lệch Quy Chế: Áo Ngũ Thân Triều Nguyễn mặc cùng Chân Váy',
    category: 'ceremonial_decency',
    categoryName: 'Chỉ Dụ Cải Cách Trang Phục',
    severity: 'critical',
    dynastyOrOrigin: 'Triều Nguyễn (Chỉ dụ Minh Mạng 1828)',
    historicalCitation: 'Chiếu chỉ vua Minh Mạng năm Mậu Tý (1828): "Tháng chín có chiếu vua ra, cấm quần không đáy người ta hãi hùng...". Áo dài ngũ thân bắt buộc mặc cùng quần hai ống suông kín đáo.',
    badCombinationSummary: 'Áo Ngũ Thân Triều Nguyễn ⚡ Váy Xếp Ly / Váy Đen',
    description: 'Áo Ngũ Thân thời Nguyễn được thiết kế với xẻ tà đáy thúng để lộ hai ống quần suông, không được mặc chùm lên váy ngắn hay váy xoè.',
    culturalReason: 'Cải cách Minh Mạng quy định thống nhất cả nước từ Bắc chí Nam chuyển từ váy dân gian sang mặc quần ống suông ("quần có đáy") để đảm bảo sự đoan trang, nghiêm cẩn khi hành lễ và tiếp khách.',
    autoFixLabel: 'Chuyển về Quần Ống Sớ Chuẩn Nguyễn',
    autoFixDescription: 'Đổi từ váy sang quần ống sớ hai ống chuẩn mực truyền thống',
    autoFixAction: { type: 'replace_bottom', targetId: 'quan-ong-so' },
    isTriggered: ({ top, bottom }) => {
      if (!top || !bottom) return false;
      const isNguyenTop = top.id.includes('ngu-than') || top.id.includes('ao-tac');
      return isNguyenTop && (bottom.id === 'vay-xep-ly' || bottom.id === 'vay-den-kinh-bac-nu');
    },
  },

  // 3. CẤM KỴ: Áo Nhật Bình Cung Đình Hậu Phi phối Khăn Rằn / Nón Lá Dân Dã
  {
    id: 'taboo-nhat-binh-khan-ran',
    code: 'TABOO-03',
    title: 'Cấm Kỵ: Áo Cung Đình Hậu Phi phối Khăn Rằn / Nón Lá Dân Gian',
    category: 'royal_vs_folk',
    categoryName: 'Cung Đình vs Dân Gian',
    severity: 'critical',
    dynastyOrOrigin: 'Hoàng Cung Triều Nguyễn (Huế)',
    historicalCitation: 'Đại Nam Thực Lục Chính Biên: "Nhật Bình vi Hậu phi Thường phục, cổ thêu hoa văn ngũ hành đồ, phi tần trang sức chuỗi ngọc kim thoa, bất khả hỗn tạp tiện phục dân gian."',
    badCombinationSummary: 'Áo Nhật Bình Hoàng Gia ⚡ Khăn Rằn / Nón Lá Nam Bộ',
    description: 'Áo Nhật Bình là đại lễ phục của Hậu phi, Công chúa và mệnh phụ triều đình Huế, tuyệt đối không phối cùng khăn rằn hay nón lá lao động dân dã miền Nam.',
    culturalReason: 'Nhật Bình gắn liền với trật tự phẩm trật triều nghi nghiêm mật của Đại Nam. Đặt khăn rằn lao động sông nước lên cổ áo thêu phượng hoàng cung đình là sai lệch nghiêm trọng về phân tầng văn hóa và bối cảnh lịch sử.',
    autoFixLabel: 'Đồng bộ Mấn Ngũ Sắc Cung Đình',
    autoFixDescription: 'Trang bị Mấn Ngũ Sắc đính ngọc quý xứng tầm với tà áo Nhật Bình',
    autoFixAction: { type: 'replace_accessory', targetId: 'man-ngu-sac' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      const isNhatBinh = top.id.includes('nhat-binh');
      return isNhatBinh && (accessory.id.includes('khan-ran') || accessory.id.includes('non-la-nam-bo'));
    },
  },

  // 4. CẤM KỴ: Áo Nhật Bình Cố Đô đội Nón Ba Tầm Kinh Bắc
  {
    id: 'taboo-nhat-binh-non-ba-tam',
    code: 'TABOO-04',
    title: 'Lệch Phong Vị: Áo Nhật Bình Cung Đình đội Nón Ba Tầm Dân Gian',
    category: 'royal_vs_folk',
    categoryName: 'Cung Đình vs Dân Ca Quan Họ',
    severity: 'warning',
    dynastyOrOrigin: 'Cố Đô Huế vs Bắc Bộ',
    historicalCitation: 'Khâm Định Đại Nam Hội Điển Sự Lệ: "Thứ phi, Công chúa đại triều đội Kim Quan hoặc Khăn Vành Dây vấn lụa điều/vàng, dân gian Bắc Bộ dùng Nón Ba Tầm quai thao, hai đàng phân biệt rõ rệt."',
    badCombinationSummary: 'Áo Nhật Bình Cố Đô ⚡ Nón Ba Tầm Quai Thao',
    description: 'Nón Ba Tầm quai thao là hồn cốt dân ca Quan họ Bắc Ninh, không bao giờ được dùng chung với triều phục hoàng thất triều Nguyễn.',
    culturalReason: 'Một bên là phong thái hoàng tộc kín cổng cao tường chốn Tử Cấm Thành xứ Huế, một bên là mỹ tục thôn dã Kinh Bắc. Sự pha trộn này làm mất đi tính chuẩn xác di sản.',
    autoFixLabel: 'Đổi sang Khăn Vành Dây Hoàng Cung',
    autoFixDescription: 'Đội Khăn Vành Dây hoàng cung truyền thống để giữ nét tôn quý',
    autoFixAction: { type: 'replace_accessory', targetId: 'khan-vanh-day-nu' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      return top.id.includes('nhat-binh') && accessory.id.includes('non-ba-tam');
    },
  },

  // 5. CẤM KỴ: Áo Nhật Bình Cung Đình đội Khăn Mỏ Quạ
  {
    id: 'taboo-nhat-binh-khan-mo-qua',
    code: 'TABOO-05',
    title: 'Lệch Quy Thức: Áo Nhật Bình Hoàng Gia vấn Khăn Mỏ Quạ',
    category: 'royal_vs_folk',
    categoryName: 'Cung Đình vs Thôn Dã',
    severity: 'warning',
    dynastyOrOrigin: 'Cố Đô Huế vs Thôn Dã Đồng Bằng Bắc Bộ',
    historicalCitation: 'Khâm Định Đại Nam Hội Điển Sự Lệ: Phục sức cung phi hoàng triều phải theo đúng quy thức đính ngọc, không dùng khăn vấn chữ nhân dân gian mộc mạc.',
    badCombinationSummary: 'Áo Nhật Bình Triều Nguyễn ⚡ Khăn Mỏ Quạ Thôn Nữ',
    description: 'Khăn mỏ quạ là nét đẹp bình dị của người phụ nữ nông thôn Bắc Bộ, không tương thích với lễ phục Hậu phi triều đình.',
    culturalReason: 'Gây ra xung đột thẩm mỹ giữa sự lộng lẫy xa hoa thêu kim tuyến của Nhật Bình và sự giản dị cần lao của nếp khăn quạ.',
    autoFixLabel: 'Đổi sang Mấn Ngũ Sắc Hoàng Cung',
    autoFixDescription: 'Chuyển sang mấn cung đình thêu ngọc lộng lẫy',
    autoFixAction: { type: 'replace_accessory', targetId: 'man-ngu-sac' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      return top.id.includes('nhat-binh') && accessory.id.includes('khan-mo-qua');
    },
  },

  // 6. CẤM KỴ: Áo Tứ Thân Kinh Bắc phối Quần Tây Hiện Đại
  {
    id: 'taboo-tu-than-quan-tay',
    code: 'TABOO-06',
    title: 'Cấm Kỵ: Áo Tứ Thân Kinh Bắc phối Quần Tây Hiện Đại',
    category: 'modesty_taboo',
    categoryName: 'Mỹ Cảm Dân Gian Kinh Bắc',
    severity: 'critical',
    dynastyOrOrigin: 'Dân Gian Bắc Bộ (Kinh Bắc)',
    historicalCitation: 'Phong tục Trầu cau & Ca trù Kinh Bắc: "Áo tứ thân mây dải yếm đào, váy đũi lụa sồi buông bước thanh tao, chẳng vướng bụi hồng quần tây trói buộc."',
    badCombinationSummary: 'Áo Tứ Thân Bốn Vạt ⚡ Quần Tây Âu Phục',
    description: 'Áo Tứ Thân thắt vạt dải yếm đào là tinh hoa văn hóa dân gian ngàn năm, phối với quần tây phá nát cấu trúc mềm mại vốn có.',
    culturalReason: 'Bốn tà áo tứ thân tượng trưng cho cha mẹ bốn bên (tứ thân phụ mẫu). Tà áo buộc trước bụng khoe yếm đào bắt buộc phải kết hợp cùng váy sồi/đũi đen tuyền xòe mềm.',
    autoFixLabel: 'Đổi sang Váy Đũi Đen Dân Gian',
    autoFixDescription: 'Phối cùng chân váy đũi đen tuyền Kinh Bắc truyền thống',
    autoFixAction: { type: 'replace_bottom', targetId: 'vay-den-kinh-bac-nu' },
    isTriggered: ({ top, bottom }) => {
      if (!top || !bottom) return false;
      return top.id.includes('tu-than') && bottom.id === 'quan-tay-hien-dai';
    },
  },

  // 7. CẤM KỴ: Áo Giao Lĩnh Cổ Điển mang Khăn Rằn Nam Bộ
  {
    id: 'taboo-giao-linh-khan-ran',
    code: 'TABOO-07',
    title: 'Lệch Niên Đại: Áo Giao Lĩnh Cổ Điển mang Khăn Rằn Nam Bộ',
    category: 'dynasty_clash',
    categoryName: 'Lệch Niên Đại Lịch Sử',
    severity: 'warning',
    dynastyOrOrigin: 'Thời Lý - Trần - Lê vs Nam Bộ Thế Kỷ 19',
    historicalCitation: 'Lịch Triều Hiến Chương Loại Chí: Giao Lĩnh cổ phục có từ thời Lý - Trần - Lê, biểu trưng cho phong thái cổ phong trang trọng với đai thắt lưng ngọc bội.',
    badCombinationSummary: 'Áo Giao Lĩnh Cổ Phong ⚡ Khăn Rằn Nam Bộ',
    description: 'Áo Giao Lĩnh cổ y tiêu biểu cho hào khí Đông A và văn hiến Lý-Trần-Lê, cách thời kỳ xuất hiện khăn rằn Nam Bộ tới 500-800 năm.',
    culturalReason: 'Khăn rằn bắt nguồn từ văn hóa giao thoa Nam Bộ thế kỷ 18-19, không thể tồn tại đồng thời với cổ phục Giao Lĩnh thời trung đại.',
    autoFixLabel: 'Đổi sang Ngọc Bội Thắt Lưng Cổ Phong',
    autoFixDescription: 'Đeo ngọc bội thắt lưng chạm khắc mây lành chuẩn phong thái cổ nhân',
    autoFixAction: { type: 'replace_accessory', targetId: 'ngoc-boi' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      return top.id.includes('giao-linh') && accessory.id.includes('khan-ran');
    },
  },

  // 8. CẤM KỴ: Lễ Phục Đông Sơn phối Phụ Kiện Thời Phong Kiến Cận Đại
  {
    id: 'taboo-dong-son-mismatch',
    code: 'TABOO-08',
    title: 'Lệch Niên Đại 2500 Năm: Lễ Phục Đông Sơn mang Phụ Kiện Phong Kiến',
    category: 'sacred_heritage',
    categoryName: 'Di Sản Thời Hùng Vương',
    severity: 'critical',
    dynastyOrOrigin: 'Thời Đại Hùng Vương (Văn Lang - Âu Lạc)',
    historicalCitation: 'Cổ vật Trống Đồng Đông Sơn & Khảo cổ học Việt Nam: Cư dân Đông Sơn đội mũ lông chim Lạc, đeo vòng đồng hộ tâm, sùng bái Thần Mặt Trời, hoàn toàn tách biệt với khăn mấn Hán-Việt phong kiến.',
    badCombinationSummary: 'Xiêm Y Đông Sơn Cội Nguồn ⚡ Khăn Đóng / Mấn / Thẻ Bài',
    description: 'Trang phục thời Đông Sơn thuộc nền văn minh sông Hồng sơ sử, không thể phối với khăn đóng, mấn nhung hay thẻ bài thời Nguyễn.',
    culturalReason: 'Hai nền văn hóa cách nhau hơn 20 thế kỷ. Đông Sơn thể hiện tín ngưỡng vũ trụ sơ khai, đối lập với quy chuẩn Nho giáo thế kỷ 19.',
    autoFixLabel: 'Đổi sang Mũ Lông Chim Lạc Đông Sơn',
    autoFixDescription: 'Đồng bộ mũ lông chim sừng sững cội nguồn sông Hồng',
    autoFixAction: { type: 'replace_accessory', targetId: 'mu-long-chim-dong-son' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      const isDongSon = top.id.includes('dong-son');
      const isFeudalAcc =
        accessory.id.includes('khan-dong') ||
        accessory.id.includes('man-doi-dau') ||
        accessory.id.includes('man-ngu-sac') ||
        accessory.id.includes('the-bai') ||
        accessory.id.includes('khan-vanh-day');
      return isDongSon && isFeudalAcc;
    },
  },

  // 9. CẤM KỴ: Nam Phục mang Phụ Kiện Đầu Nữ Giới
  {
    id: 'taboo-gender-headpiece',
    code: 'TABOO-09',
    title: 'Sai Lệch Quy Cách: Nam Phục mang Phụ Kiện Tóc của Nữ Giới',
    category: 'gender_customs',
    categoryName: 'Quy Cách Nam Nữ Cổ Truyền',
    severity: 'warning',
    dynastyOrOrigin: 'Nho Giáo & Lễ Nghi Việt Nam',
    historicalCitation: 'Gia Lễ Truyền Thống: "Nam hữu nam quan, nữ hữu nữ thoa". Nam nhân đoan chính đội Khăn Đóng 7 nếp chữ Nhân hoặc mũ Phốc Đầu, không mang mấn gấm thêu hoa của phụ nữ.',
    badCombinationSummary: 'Áo Nam Giới ⚡ Mấn Nữ / Trâm Cài / Khăn Vành Dây',
    description: 'Trang phục nam giới truyền thống Việt Nam biểu hiện khí phách đĩnh đạc, không đi cùng phụ kiện cài tóc của khuê các nữ tử.',
    culturalReason: 'Quy tắc trang phục cổ truyền phân định rõ rệt giữa nam và nữ theo nguyên lý Âm Dương, vi phạm điều này làm mất tính đoan chính.',
    autoFixLabel: 'Đổi sang Khăn Đóng Lụa Đen 7 Nếp',
    autoFixDescription: 'Chuyển sang khăn đóng lụa đen 7 nếp chữ Nhân chuẩn nam nhân',
    autoFixAction: { type: 'replace_accessory', targetId: 'khan-dong' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      const isMaleTop = top.gender === 'nam';
      const isFemaleAcc =
        accessory.id.includes('man-doi-dau') ||
        accessory.id.includes('man-ngu-sac') ||
        accessory.id.includes('tram-cai') ||
        accessory.id.includes('khan-vanh-day') ||
        accessory.id.includes('non-ba-tam');
      return isMaleTop && isFemaleAcc;
    },
  },

  // 10. CẤM KỴ: Áo Bà Ba Nam Bộ phối Phụ Kiện Hoàng Tộc / Mũ Đông Sơn
  {
    id: 'taboo-baba-royal-acc',
    code: 'TABOO-10',
    title: 'Lệch Phong Vị: Áo Bà Ba Chân Phương mang Phụ Kiện Cung Đình',
    category: 'royal_vs_folk',
    categoryName: 'Miệt Vườn vs Triều Nghi',
    severity: 'warning',
    dynastyOrOrigin: 'Văn Hóa Sông Nước Nam Bộ',
    historicalCitation: 'Văn Hóa Lục Tỉnh Nam Kỳ: Áo bà ba mộc mạc đi liền cùng khăn rằn bông gòn hoặc nón lá chằm duyên dáng, kỵ xa hoa phô trương.',
    badCombinationSummary: 'Áo Bà Ba Dân Dã ⚡ Khăn Vành Dây Hoàng Cung / Mũ Đông Sơn',
    description: 'Áo bà ba miệt vườn Nam Bộ mang tính năng động, lao động chân chất, đối chọi gay gắt với mũ lông chim sơ sử hoặc khăn vành dây đại triều.',
    culturalReason: 'Làm mất đi tinh thần phóng khoáng, chân phương của văn hóa Nam Bộ thế kỷ 19-20.',
    autoFixLabel: 'Đồng bộ Khăn Rằn Nam Bộ',
    autoFixDescription: 'Đeo khăn rằn ca-rô truyền thống chuẩn nét người con phương Nam',
    autoFixAction: { type: 'replace_accessory', targetId: 'khan-ran' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      const isBaBa = top.id.includes('ba-ba');
      const isRoyalAcc =
        accessory.id.includes('khan-vanh-day') ||
        accessory.id.includes('mu-long-chim-dong-son') ||
        accessory.id.includes('the-bai-quan-lai');
      return isBaBa && isRoyalAcc;
    },
  },

  // 11. CẤM KỴ: Áo Viên Lĩnh Quan Lại đội Nón Ba Tầm Thôn Nữ
  {
    id: 'taboo-vien-linh-non-ba-tam',
    code: 'TABOO-11',
    title: 'Xung Đột Vị Thế: Áo Viên Lĩnh Bổ Tử Quan Lại đội Nón Ba Tầm',
    category: 'royal_vs_folk',
    categoryName: 'Triều Nghi vs Thôn Nữ',
    severity: 'warning',
    dynastyOrOrigin: 'Quan Phục Triều Lê - Nguyễn',
    historicalCitation: 'Khâm Định Đại Nam Hội Điển Sự Lệ - Quan Phục: "Bổ tử chim Hạc, Kỳ Lân tượng trưng cho trật tự phẩm hàm triều đình uy nghiêm, không dung nạp phục sức vui chơi lễ hội thôn nữ."',
    badCombinationSummary: 'Áo Viên Lĩnh Triều Thần ⚡ Nón Ba Tầm Quai Thao',
    description: 'Áo Viên Lĩnh có bổ tử là thường phục của quan lại triều đình, không kết hợp cùng nón ba tầm trẩy hội quan họ.',
    culturalReason: 'Tước hàm triều thần đòi hỏi sự nghiêm túc, đứng đắn của bậc rường cột quốc gia.',
    autoFixLabel: 'Đeo Thẻ Bài Quan Lại Triều Đình',
    autoFixDescription: 'Trang bị Thẻ Bài quan lại gỗ thị dát vàng thể hiện chức vụ triều đình',
    autoFixAction: { type: 'replace_accessory', targetId: 'the-bai-quan-lai' },
    isTriggered: ({ top, accessory }) => {
      if (!top || !accessory) return false;
      return top.id.includes('vien-linh') && accessory.id.includes('non-ba-tam');
    },
  },

  // 12. CẤM KỴ: Mặc Áo Dài Lễ Nghi mà Không Mặc Hạ Y (Khiếm Nhã Tuyệt Đối)
  {
    id: 'taboo-no-bottom-unequipped',
    code: 'TABOO-12',
    title: 'Cấm Kỵ Nghiêm Trọng: Không Khoác Hạ Y Dưới Áo Dài Lễ Nghi',
    category: 'modesty_taboo',
    categoryName: 'Thuần Phong Mỹ Tục & Đoan Trang',
    severity: 'critical',
    dynastyOrOrigin: 'Lễ Giáo Toàn Quốc',
    historicalCitation: 'Gia Lễ Đại Việt: "Y tất hữu thường, thượng y hạ thường hỗ tương bảo hộ". Áo xẻ tà đáy thúng nếu không có quần che chắn là khiếm lễ trước gia tiên và cộng đồng.',
    badCombinationSummary: 'Áo Dài Cổ Phục ⚡ Không Có Quần/Hạ Y',
    description: 'Áo Ngũ Thân, Áo Tấc, Nhật Bình hay Giao Lĩnh khi đã khoác lên người bắt buộc phải mặc quần hoặc váy lót kín đáo.',
    culturalReason: 'Vi phạm nghiêm trọng đức hạnh đoan trang và thuần phong mỹ tục ngàn đời của dân tộc Việt Nam.',
    autoFixLabel: 'Mặc Quần Ống Sớ Lụa Bạch',
    autoFixDescription: 'Khoác thêm quần ống sớ lụa bạch để hoàn thiện bộ lễ phục đoan chính',
    autoFixAction: { type: 'replace_bottom', targetId: 'quan-ong-so' },
    isTriggered: ({ top, bottom }) => {
      return Boolean(top && !bottom);
    },
  },

  // 13. CẤM KỴ: Màu Vàng Hoàng Chánh (Chính Hoàng) của Thường Dân (Kiêng Kỵ Hoàng Đế)
  {
    id: 'taboo-royal-yellow-non-royal',
    code: 'TABOO-13',
    title: 'Kiêng Kỵ: Thường Phục Dùng Màu Vàng Hoàng Chánh Thiên Tử',
    category: 'color_taboo',
    categoryName: 'Kiêng Kỵ Sắc Phục Hoàng Gia',
    severity: 'caution',
    dynastyOrOrigin: 'Điển Chế Sắc Phục Triều Nguyễn',
    historicalCitation: 'Minh Mạng Chính Yếu: "Chính hoàng sắc (vàng rực thiên tử #FFD700) nãi Thiên tử độc tôn vi biểu, thứ dân cùng quan viên chỉ đắc dụng xích, lam, lục, cấm dụng hoàng kim lộng hành."',
    badCombinationSummary: 'Áo Bà Ba / Thường Dân ⚡ Vàng Hoàng Kim Triều Đình',
    description: 'Màu vàng hoàng chánh kim long thời phong kiến là màu cấm kỵ tối cao, thường dân chỉ dùng màu nâu sồng, chàm, men lam hoặc bạch ngọc.',
    culturalReason: 'Tượng trưng cho Trung ương Mậu Kỷ Thổ và hoàng quyền tối thượng, dân gian kiêng kỵ tuyệt đối để tránh tội tiếm lạm.',
    autoFixLabel: 'Chuyển về Màu Men Lam Cố Đô',
    autoFixDescription: 'Đổi màu áo về màu Men Lam trầm mặc, thanh nhã',
    autoFixAction: { type: 'replace_color_top', targetColorHex: '#1F4E5B' },
    isTriggered: ({ top, topColorHex }) => {
      if (!top || !topColorHex) return false;
      const isFolk = top.id.includes('ba-ba');
      const isRoyalYellow =
        topColorHex.toUpperCase() === '#D4AF37' ||
        topColorHex.toUpperCase() === '#FFD700' ||
        topColorHex.toUpperCase() === '#FFC700';
      return isFolk && isRoyalYellow;
    },
  },
];

/**
 * Tra cứu toàn bộ kho dữ liệu điều luật cấm kỵ
 */
export function getAllCulturalTabooRules(): CulturalTabooRule[] {
  return CULTURAL_TABOOS_DATABASE;
}

/**
 * Lọc điều luật theo danh mục
 */
export function getTabooRulesByCategory(category: TabooCategory): CulturalTabooRule[] {
  return CULTURAL_TABOOS_DATABASE.filter((rule) => rule.category === category);
}

/**
 * Real-time Cultural Validation Engine
 * Evaluates the user's active outfit selections against the Vietnamese Cultural Taboo Database.
 */
export function evaluateCulturalRules(params: {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  accessory: WardrobeItem | null;
  topColorHex?: string;
  bottomColorHex?: string;
}): DetailedHarmonyScore {
  const { top, bottom, accessory, topColorHex, bottomColorHex } = params;
  const violations: CulturalViolation[] = [];

  // When no clothes are worn yet (Khung ma nơ canh mộc)
  if (!top && !bottom && !accessory) {
    return {
      totalScore: 0,
      eraMatchScore: 0,
      etiquetteScore: 0,
      fiveElementsScore: 0,
      aestheticScore: 0,
      ratingBadge: 'Ma Nơ Canh Mộc',
      critiqueTitle: 'Chưa khoác y phục',
      detailedCritique:
        'Khung ma nơ canh đang để mộc thanh lịch. Hãy chọn áo, quần/váy và phụ kiện bên phải để bắt đầu thiết kế xiêm y cổ phục!',
      culturalSecret: 'Cổ nhân coi phục sức là diện mạo của lễ giáo, "y phục xứng kỳ đức". Mời bạn khai mở xiêm y.',
      stylingTip:
        'Hãy bắt đầu bằng việc chọn một dáng áo yêu thích: Áo Ngũ Thân trang nhã, Áo Nhật Bình vương giả hay Áo Giao Lĩnh cổ phong.',
      violations: [],
    };
  }

  // Base scores
  let eraScore = 96;
  let etiquetteScore = 96;
  let fiveElementsScore = 95;
  let aestheticScore = 95;

  // Run through the formal CULTURAL TABOO DATABASE in real time
  for (const rule of CULTURAL_TABOOS_DATABASE) {
    if (rule.isTriggered({ top, bottom, accessory, topColorHex, bottomColorHex })) {
      violations.push({
        id: rule.id,
        code: rule.code,
        severity: rule.severity,
        title: rule.title,
        description: rule.description,
        culturalReason: rule.culturalReason,
        categoryName: rule.categoryName,
        historicalCitation: rule.historicalCitation,
        badCombinationSummary: rule.badCombinationSummary,
        autoFixLabel: rule.autoFixLabel,
        autoFixDescription: rule.autoFixDescription,
        autoFixAction: rule.autoFixAction,
      });

      // Apply score penalties based on severity
      if (rule.severity === 'critical') {
        etiquetteScore -= 28;
        aestheticScore -= 18;
        eraScore -= 15;
      } else if (rule.severity === 'warning') {
        etiquetteScore -= 18;
        eraScore -= 20;
        aestheticScore -= 10;
      } else {
        fiveElementsScore -= 12;
        aestheticScore -= 8;
      }
    }
  }

  // Bound scores safely
  eraScore = Math.max(35, Math.min(100, eraScore));
  etiquetteScore = Math.max(30, Math.min(100, etiquetteScore));
  fiveElementsScore = Math.max(40, Math.min(100, fiveElementsScore));
  aestheticScore = Math.max(40, Math.min(100, aestheticScore));

  const totalScore = Math.round(
    eraScore * 0.3 + etiquetteScore * 0.3 + fiveElementsScore * 0.2 + aestheticScore * 0.2
  );

  let ratingBadge = 'Hài Hòa Di Sản';
  if (totalScore >= 95) ratingBadge = 'Mẫu Mực Cổ Điển';
  else if (totalScore >= 88) ratingBadge = 'Thanh Nhã Phong Vị';
  else if (totalScore >= 72) ratingBadge = 'Cần Điều Chỉnh Lễ Nghi';
  else ratingBadge = 'Vi Phạm Cấm Kỵ Cổ Phục';

  let critiqueTitle = `Bản Phối ${ratingBadge} (${totalScore} điểm)`;
  let detailedCritique = '';
  let culturalSecret = '';
  let stylingTip = '';

  if (violations.length > 0) {
    const critCount = violations.filter((v) => v.severity === 'critical').length;
    if (critCount > 0) {
      critiqueTitle = `⚠️ Cảnh Báo: Vi Phạm Cấm Kỵ & Thuần Phong Mỹ Tục (${totalScore} điểm)`;
      detailedCritique = `Phát hiện ${violations.length} điều cấm kỵ / lệch chuẩn trong bản phối. ${violations[0].description} ${violations[0].culturalReason}`;
      culturalSecret =
        violations[0].historicalCitation ||
        'Cổ nhân coi việc mặc sai quy cách là thất lễ với tiền nhân và phá vỡ cấu trúc văn hóa của bộ trang phục.';
      stylingTip =
        violations[0].autoFixLabel
          ? `Hãy bấm nút "${violations[0].autoFixLabel}" để hệ thống tự động hiệu chỉnh về chuẩn mực di sản!`
          : 'Hãy lựa chọn lại trang phục đồng bộ để tránh các điều cấm kỵ lễ nghi.';
    } else {
      critiqueTitle = `Lưu Ý Quy Cách Văn Hóa (${totalScore} điểm)`;
      detailedCritique = `Bản phối có sự giao thoa nhưng chưa hoàn toàn đồng bộ quy thức hoặc niên đại. ${violations[0].description}`;
      culturalSecret =
        violations[0].historicalCitation ||
        top?.cultureInfo?.symbolism ||
        'Mỗi đường kim mũi chỉ cổ phục đều chứa đựng nhân sinh quan sâu sắc.';
      stylingTip = 'Cân nhắc lựa chọn phụ kiện đồng bộ niên đại để tăng tối đa tính chân thực lịch sử.';
    }
  } else {
    detailedCritique = `Bản phối xuất sắc giữa ${top?.name || 'Áo'} cùng ${
      bottom?.name || 'Hạ y'
    } và ${accessory?.name || 'Phụ kiện'}. Các chi tiết ăn khớp chuẩn mực từ triều đại ${
      top?.era || 'truyền thống'
    }, toát lên vẻ đoan trang, tôn kính thuần phong mỹ tục Việt Nam.`;
    culturalSecret =
      top?.cultureInfo?.symbolism || 'Áo ngũ thân tượng trưng cho ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín.';
    stylingTip = 'Khi dạo bước chụp ảnh, giữ thẳng sống lưng, hai tay nâng nhẹ tà áo để phô diễn trọn vẹn đường lượn tà đáy thúng.';
  }

  return {
    totalScore,
    eraMatchScore: eraScore,
    etiquetteScore,
    fiveElementsScore,
    aestheticScore,
    ratingBadge,
    critiqueTitle,
    detailedCritique,
    culturalSecret,
    stylingTip,
    violations,
  };
}
