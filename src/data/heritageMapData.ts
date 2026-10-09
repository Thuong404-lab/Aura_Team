import type { FeatureCollection, Geometry } from 'geojson';

export interface GarmentOriginDetail {
  name: string;
  type: string;
  significance: string;
}

export interface HeritageLocationNode {
  id: string;
  name: string;
  historicalName?: string;
  modernLocation: string; // Modern administrative location name (e.g. Thủ đô Hà Nội)
  coordinates: [number, number]; // [longitude, latitude]
  regionId: 'bac-bo' | 'trung-bo' | 'tay-nguyen' | 'nam-bo' | 'tay-bac';
  regionTitle: string;
  dynasties: string[];
  mainGarmentName: string;
  targetTopId: string;
  targetPresetId?: string;
  garments: GarmentOriginDetail[];
  craftAndFabric: string;
  historicalStory: string;
  philosophicalMeaning: string;
  quote: string;
  accentColor: string;
  icon: string;
  elevationBadge: string;
  labelOffset?: { x: number; y: number };
  landmarkNote?: string;
}

export interface MigrationRoute {
  id: string;
  title: string;
  historicalEra: string;
  description: string;
  color: string;
  fromLocationId: string;
  toLocationId: string;
  curveOffset: number; // for arc curvature in SVG
}

export interface RegionSummary {
  id: 'bac-bo' | 'trung-bo' | 'tay-nguyen' | 'nam-bo' | 'tay-bac';
  name: string;
  title: string;
  color: string;
  fillOpacity: number;
  highlightOutfits: string[];
  culturalEssence: string;
}

export const REGIONS_META: Record<string, RegionSummary> = {
  'bac-bo': {
    id: 'bac-bo',
    name: 'Đồng Bằng Bắc Bộ & Thăng Long',
    title: 'Cái Nôi Văn Hiến & Ước Lệ Cổ Phong',
    color: '#3B82F6',
    fillOpacity: 0.18,
    highlightOutfits: ['Áo Giao Lĩnh', 'Áo Tứ Thân', 'Áo Viên Lĩnh Bổ Tử'],
    culturalEssence: 'Kín đáo, tao nhã, đề cao đạo nghĩa Tứ Thân Phụ Mẫu và cốt cách kẻ sĩ Tràng An.',
  },
  'tay-bac': {
    id: 'tay-bac',
    name: 'Tây Bắc & Núi Rừng Hoàng Liên',
    title: 'Thiên Nhiên Kỳ Vĩ & Dệt Lanh Sáp Ong',
    color: '#10B981',
    fillOpacity: 0.16,
    highlightOutfits: ['Áo Chàm Cổ Truyền', 'Thổ Cẩm H’Mông - Dao', 'Xà Tích Bạc'],
    culturalEssence: 'Hòa quyện cùng đại ngàn, kỹ nghệ nhuộm chàm và dệt lanh thủ công độc bản.',
  },
  'trung-bo': {
    id: 'trung-bo',
    name: 'Trung Bộ & Cung Đình Huế',
    title: 'Pháp Phục Hoàng Gia & Gấm Vóc Sa Đoạn',
    color: '#F59E0B',
    fillOpacity: 0.22,
    highlightOutfits: ['Áo Nhật Bình', 'Áo Ngũ Thân Tay Chẽn', 'Áo Tấc Đại Lễ'],
    culturalEssence: 'Quy củ nghiêm mật, biểu trưng cho uy quyền quốc gia và triết lý Ngũ Thường.',
  },
  'tay-nguyen': {
    id: 'tay-nguyen',
    name: 'Tây Nguyên Đại Ngàn',
    title: 'Không Gian Văn Hóa Cồng Chiêng & Dệt Zèng',
    color: '#EC4899',
    fillOpacity: 0.18,
    highlightOutfits: ['Thổ Cẩm Kơ-tu & Êđê', 'Áo Chui Đầu Khắc Hoa', 'Khố Dệt Hạt Cườm'],
    culturalEssence: 'Hào sảng, tự do, hoa văn hình học mô phỏng thiên nhiên và linh vật sử thi.',
  },
  'nam-bo': {
    id: 'nam-bo',
    name: 'Nam Bộ & Đô Thị Phương Nam',
    title: 'Phóng Khoáng Sông Nước & Tân Thời Giao Thoa',
    color: '#8B5CF6',
    fillOpacity: 0.2,
    highlightOutfits: ['Áo Bà Ba', 'Lụa Lãnh Mỹ A Tân Châu', 'Áo Dài Cách Tân Raglan'],
    culturalEssence: 'Gọn gàng, mộc mạc, thích nghi diệu kỳ với phù sa và đón nhận hơi thở đổi mới.',
  },
};

export const HERITAGE_LOCATIONS: HeritageLocationNode[] = [
  {
    id: 'thang-long',
    name: 'Kinh Đô Thăng Long (Hà Nội)',
    historicalName: 'Đông Đô — Thăng Long Văn Hiến',
    modernLocation: 'Thủ đô Hà Nội (Khu vực Ba Đình, Hoàn Kiếm)',
    coordinates: [105.85, 21.03],
    regionId: 'bac-bo',
    regionTitle: 'Bắc Bộ — Kinh Đô Ngàn Năm',
    dynasties: ['Thời Lý - Trần', 'Thời Lê'],
    mainGarmentName: 'Áo Giao Lĩnh & Áo Viên Lĩnh',
    targetTopId: 'giao-linh',
    targetPresetId: 'si-tu-thang-long',
    garments: [
      {
        name: 'Áo Giao Lĩnh Hào Khí Đông A',
        type: 'Thường phục & Lễ phục quý tộc',
        significance: 'Cổ chéo vạt rộng thanh thoát, biểu thị sự hài hòa âm dương và tinh thần tự chủ thời Lý - Trần.',
      },
      {
        name: 'Áo Viên Lĩnh (Cổ Tròn Hoàng Triều)',
        type: 'Pháp phục đại thần',
        significance: 'Cổ tròn đính ngọc, mang Bổ tử thêu hạc trắng hoặc kỳ lân đại diện cho sự minh bạch, công chính.',
      },
      {
        name: 'Áo Tứ Thân Tràng An',
        type: 'Thường phục thiếu nữ kinh kỳ',
        significance: 'Vạt trước thắt dải lụa mềm mại, tôn vinh vẻ đoan trang mực thước.',
      },
    ],
    craftAndFabric: 'Làng lụa Vạn Phúc (Hà Đông) với kỹ thuật dệt The Vân, dệt gấm hoa cúc ngàn năm tuổi.',
    historicalStory:
      'Thăng Long từ chiếu dời đô của vua Lý Thái Tổ năm 1010 là trung tâm định hình phong cách y phục chuẩn mực của người Việt. Các dạng thức Áo Giao Lĩnh vạt chéo và Viên Lĩnh cổ tròn đạt đỉnh cao nghệ thuật dưới thời Lê Sơ và Lê Trung Hưng, biểu dương độc lập văn hóa sâu sắc.',
    philosophicalMeaning:
      'Đề cao sự khiêm nhường, mực thước của Nho học phương Đông kết hợp hào khí độc lập dân tộc.',
    quote: 'Chẳng thơm cũng thể hoa nhài / Dẫu không thanh lịch cũng người Tràng An.',
    accentColor: '#38BDF8',
    icon: '🏛️',
    elevationBadge: 'Kinh Đô Đế Vương',
    labelOffset: { x: -80, y: -26 },
    landmarkNote: 'Trung tâm quyền lực và quy chế pháp phục ngàn năm',
  },
  {
    id: 'kinh-bac',
    name: 'Hội Lim Kinh Bắc (Bắc Ninh)',
    historicalName: 'Xứ Kinh Bắc Cổ Kính',
    modernLocation: 'Tỉnh Bắc Ninh (Khu vực Tiên Du, Từ Sơn, Sông Đuống)',
    coordinates: [106.07, 21.18],
    regionId: 'bac-bo',
    regionTitle: 'Bắc Bộ — Dân Gian Quan Họ',
    dynasties: ['Thời Lê', 'Dân gian'],
    mainGarmentName: 'Áo Tứ Thân & Nón Quai Thao',
    targetTopId: 'tu-than',
    targetPresetId: 'si-tu-thang-long',
    garments: [
      {
        name: 'Áo Tứ Thân Khác Màu Lót Kép',
        type: 'Phục trang lễ hội Quan họ',
        significance: 'Bốn vạt áo tượng trưng Tứ Thân Phụ Mẫu, dải yếm đào hé lộ duyên thầm.',
      },
      {
        name: 'Nón Quai Thao Thắt Tua Lụa',
        type: 'Phụ kiện nghi lễ',
        significance: 'Vành nón rộng che nghiêng nụ cười trao duyên bên câu hát giao duyên.',
      },
    ],
    craftAndFabric: 'Lụa the đen, nhuộm củ nâu bùn sông Cầu kết hợp yếm lụa nhuộm cánh sen hồng thắm.',
    historicalStory:
      'Xứ Kinh Bắc với dòng sông Đuống và những hội làng truyền thống đã nuôi dưỡng vẻ đẹp mộc mạc mà đằm thắm của chiếc Áo Tứ Thân. Hình ảnh liền chị nón thúng quai thao, thắt bao xanh lơ buông dải yếm đào là biểu tượng bất hủ của vẻ đẹp phụ nữ Bắc Bộ.',
    philosophicalMeaning:
      'Triết lý chữ Hiếu với song thân phụ mẫu, sự kín đáo duyên dáng trong đối đãi tình làng nghĩa xóm.',
    quote: 'Ai về Kinh Bắc trao duyên / Tà áo tứ thân nghiêng nón bài thơ bên đình.',
    accentColor: '#10B981',
    icon: '🏮',
    elevationBadge: 'Cái Nôi Dân Gian',
    labelOffset: { x: 22, y: -20 },
    landmarkNote: 'Cái nôi làn điệu Quan Họ & Áo Tứ Thân',
  },
  {
    id: 'tay-bac',
    name: 'Sa Pa & Đại Ngàn Hoàng Liên',
    historicalName: 'Xứ Mường, Thái & Mèo Tây Bắc',
    modernLocation: 'Thị xã Sa Pa & Dãy Hoàng Liên Sơn, Tỉnh Lào Cai',
    coordinates: [103.84, 22.33],
    regionId: 'tay-bac',
    regionTitle: 'Tây Bắc — Núi Non Kỳ Vĩ',
    dynasties: ['Thời Lê', 'Dân Gian Bản Địa'],
    mainGarmentName: 'Dệt Lanh Sáp Ong & Áo Chàm Bạc',
    targetTopId: 'tu-than',
    garments: [
      {
        name: 'Váy Xòe Thổ Cẩm Dệt Lanh',
        type: 'Lễ phục mùa xuân',
        significance: 'Họa tiết mặt trời, chim muông vẽ sáp ong tinh xảo, xòe rộng như cánh hoa rừng.',
      },
      {
        name: 'Áo Chàm Khuy Bạc Xà Tích',
        type: 'Trang phục cổ truyền',
        significance: 'Nhuộm từ lá chàm rừng thiên nhiên bền màu, điểm xuyết trang sức bạc hộ mệnh.',
      },
    ],
    craftAndFabric: 'Kỹ nghệ dệt lanh thủ công, vẽ sáp ong nóng chảy và nhuộm chàm tự nhiên nhiều tuần lễ.',
    historicalStory:
      'Vùng núi non trùng điệp Tây Bắc là nơi lưu giữ những bí quyết dệt nhuộm ngàn đời. Từng đường kim mũi chỉ thổ cẩm là sự ghi chép tâm thức của người phụ nữ vùng cao về thế giới tự nhiên, thần rừng và tổ tiên.',
    philosophicalMeaning:
      'Hòa hợp tuyệt đối với tự nhiên, lòng kiên trì và tinh thần bền bỉ bất khuất trước khắc nghiệt.',
    quote: 'Váy hoa em nở giữa sương mờ dốc núi / Màu chàm quê hương thơm ngát cả rừng mây.',
    accentColor: '#34D399',
    icon: '🏔️',
    elevationBadge: 'Di Sản Thổ Cẩm',
    labelOffset: { x: 20, y: -24 },
    landmarkNote: 'Kỹ nghệ dệt lanh thủ công & nhuộm chàm nguyên bản',
  },
  {
    id: 'hoa-lu',
    name: 'Cố Đô Hoa Lư (Ninh Bình)',
    historicalName: 'Đại Cồ Việt Kinh Đô',
    modernLocation: 'Huyện Hoa Lư & Quần thể Tràng An, Tỉnh Ninh Bình',
    coordinates: [105.90, 20.28],
    regionId: 'bac-bo',
    regionTitle: 'Bắc Bộ — Kinh Đô Đinh - Tiền Lê',
    dynasties: ['Thời Đinh - Tiền Lê'],
    mainGarmentName: 'Pháp Phục Sơ Khai & Bào Tượng Uy Dũng',
    targetTopId: 'giao-linh',
    garments: [
      {
        name: 'Áo Bào Vạt Rộng Thắt Đai Da',
        type: 'Vương phục thời Đinh - Tiền Lê',
        significance: 'Thể hiện bước đầu định hình quy chế y phục độc lập của nhà nước Đại Cồ Việt.',
      },
    ],
    craftAndFabric: 'Dệt tơ tằm cổ đại kết hợp kỹ thuật thuộc da và thêu chỉ lụa thô sơ nhưng mạnh mẽ.',
    historicalStory:
      'Hoa Lư với địa thế núi đá hiểm trở là nơi Đinh Bộ Lĩnh dẹp loạn 12 sứ quân dựng nên nền độc lập. Nơi đây khởi xướng việc định lệ triều phục riêng cho vua và bách quan, thoát khỏi sự lệ thuộc văn hóa phương Bắc.',
    philosophicalMeaning:
      'Ý chí tự chủ dân tộc và sức mạnh quật cường mở đầu kỷ nguyên độc lập phong kiến Việt Nam.',
    quote: 'Vạn Thắng Vương dựng cờ lau / Non sông Đại Cồ Việt rạng rỡ muôn thuở.',
    accentColor: '#818CF8',
    icon: '⚔️',
    elevationBadge: 'Cố Đô Khởi Nguyên',
    labelOffset: { x: -84, y: 16 },
    landmarkNote: 'Khởi đầu độc lập quy chế pháp phục Đại Cồ Việt',
  },
  {
    id: 'dong-son',
    name: 'Xứ Thanh & Đất Mẹ Đông Sơn',
    historicalName: 'Cái Nôi Văn Minh Sông Mã & Lam Kinh',
    modernLocation: 'Huyện Thọ Xuân & TP. Thanh Hóa, Tỉnh Thanh Hóa',
    coordinates: [105.78, 19.80],
    regionId: 'trung-bo',
    regionTitle: 'Bắc Trung Bộ — Văn Minh Đông Sơn',
    dynasties: ['Thời Hùng Vương - Đông Sơn', 'Thời Lê Sơ'],
    mainGarmentName: 'Y Phục Họa Tiết Chim Lạc & Chiến Bào Lam Sơn',
    targetTopId: 'giao-linh',
    garments: [
      {
        name: 'Phục Trang Họa Tiết Chim Lạc',
        type: 'Trang phục nghi lễ nông nghiệp sơ khai',
        significance: 'Váy lông chim, trâm cài tóc hình chim thần Lạc Việt khắc họa trên Trống Đồng Đông Sơn.',
      },
      {
        name: 'Trang Phục Lam Sơn Khởi Nghĩa',
        type: 'Quân phục hào kiệt',
        significance: 'Áo chẽn gọn gàng, đai lưng vải bền chắc giúp chiến binh Lê Lợi di chuyển linh hoạt.',
      },
    ],
    craftAndFabric: 'Kỹ nghệ đúc đồng trang sức kết hợp dệt sợi lanh thô và bông tự nhiên.',
    historicalStory:
      'Vùng đất Thanh Hóa là cái nôi của nền văn minh Đông Sơn huyền thoại từ thiên niên kỷ thứ nhất trước Công nguyên, lưu giữ cội nguồn biểu tượng chim Lạc trên mặt Trống Đồng. Hàng ngàn năm sau, chính đất Lam Sơn này lại phát tích phong trào khởi nghĩa đánh tan quân Minh xâm lược.',
    philosophicalMeaning:
      'Cội nguồn giống nòi Con Rồng Cháu Tiên, sự kiên trung bền bỉ của người dân xứ Thanh.',
    quote: 'Đông Sơn tiếng trống rền vang / Hào khí Lam Sơn bừng sáng giang sơn.',
    accentColor: '#FBBF24',
    icon: '🥁',
    elevationBadge: 'Nôi Văn Minh Cổ',
    labelOffset: { x: -88, y: -16 },
    landmarkNote: 'Cội nguồn hoa văn Thần Điểu trên Trống Đồng Đông Sơn',
  },
  {
    id: 'hue',
    name: 'Cố Đô Huế (Kinh Đô Phú Xuân)',
    historicalName: 'Kinh Sư Thuận Hóa — Đại Nam Quốc',
    modernLocation: 'Thành phố Huế, Tỉnh Thừa Thiên Huế (Kinh thành bên sông Hương)',
    coordinates: [107.59, 16.46],
    regionId: 'trung-bo',
    regionTitle: 'Trung Bộ — Đỉnh Cao Hoàng Triều',
    dynasties: ['Triều Nguyễn'],
    mainGarmentName: 'Áo Nhật Bình & Áo Ngũ Thân Tay Chẽn',
    targetTopId: 'nhat-binh',
    targetPresetId: 'tieu-thu-hue',
    garments: [
      {
        name: 'Áo Nhật Bình Hoàng Gia',
        type: 'Đại lễ phục Hậu phi & Công chúa',
        significance: 'Cổ hình chữ nhật đối khâm, tay dải ngũ sắc, gấu thêu hoa văn Thủy Ba sóng nước triều dâng.',
      },
      {
        name: 'Áo Ngũ Thân Tay Chẽn (Lập Quy 1744)',
        type: 'Quốc phục Đại Nam',
        significance: 'Được Võ Vương Nguyễn Phúc Khoát định hình và vua Minh Mạng phổ biến toàn quốc năm 1836.',
      },
      {
        name: 'Áo Tấc (Áo Lễ Tay Thụng)',
        type: 'Lễ phục toàn dân tế tự',
        significance: 'Tay thụng rộng một tấc trang nghiêm, khi khoanh tay tạo thành thế lễ nghi kính cẩn tuyệt đối.',
      },
    ],
    craftAndFabric: 'Gấm Cung Đình dệt chỉ kim tuyến, Sa Đoạn cung đình thêu tay, Khăn Vành Dây dát vàng lá.',
    historicalStory:
      'Huế là trung tâm hoàn thiện mỹ học trang phục truyền thống Việt Nam. Năm 1744, Võ Vương Nguyễn Phúc Khoát ban chiếu cải cách y phục, tạo nên Áo Ngũ Thân. Đến năm 1836, vua Minh Mạng chuẩn hóa quy chế phục sức trên khắp ba kỳ, đưa chiếc áo năm thân thành Quốc Phục chính thống.',
    philosophicalMeaning:
      'Triết lý Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín) gắn liền với 5 hạt cúc và đạo hiếu Tứ Thân Phụ Mẫu.',
    quote: 'Dạ thưa xứ Huế mộng mơ / Áo tà ngũ sắc nghiêng bờ sông Hương.',
    accentColor: '#F59E0B',
    icon: '👑',
    elevationBadge: 'Đỉnh Cao Hoàng Gia',
    labelOffset: { x: -84, y: -24 },
    landmarkNote: 'Trung tâm hoàn thiện Quốc phục Áo Ngũ Thân & Nhật Bình',
  },
  {
    id: 'hoi-an',
    name: 'Phố Cổ Hội An & Xứ Quảng',
    historicalName: 'Thương Cảng Faifo — Giao Thoa Á Âu',
    modernLocation: 'Thành phố Hội An & Huyện Duy Xuyên, Tỉnh Quảng Nam',
    coordinates: [108.33, 15.88],
    regionId: 'trung-bo',
    regionTitle: 'Trung Bộ — Thương Cảng Giao Lưu',
    dynasties: ['Triều Nguyễn', 'Cận Đại'],
    mainGarmentName: 'Lụa Tơ Tằm Mã Châu & Áo Cổ Phục Tân Thời',
    targetTopId: 'giao-linh-nu',
    targetPresetId: 'dao-pho-hoi-an',
    garments: [
      {
        name: 'Áo Dài Lụa Mềm Dáng Suông',
        type: 'Thường phục thị dân thương cảng',
        significance: 'Sử dụng lụa Mã Châu dệt thủ công mềm mại, thoải mái trong giao thương buôn bán.',
      },
      {
        name: 'Quạt Lụa & Nón Bài Thơ',
        type: 'Phụ kiện duyên dáng',
        significance: 'Vật bất ly thân của các thiếu nữ thương cảng bên dòng sông Hoài lung linh hoa đăng.',
      },
    ],
    craftAndFabric: 'Làng lụa Mã Châu (Duy Xuyên) nức tiếng với tơ tằm tự nhiên ươm tơ dệt lụa từ thế kỷ 15.',
    historicalStory:
      'Thương cảng Faifo - Hội An từng là trạm dừng chân sầm uất trên Con Đường Tơ Lụa trên biển. Vải vóc từ các làng nghề lân cận như Mã Châu được xuất khẩu sang Nhật Bản, châu Âu, tạo nên sự giao thoa mỹ thuật độc đáo giữa truyền thống và hơi thở quốc tế.',
    philosophicalMeaning:
      'Tinh thần cởi mở, hội nhập nhưng vẫn giữ trọn hồn cốt lụa là tinh túy của quê hương.',
    quote: 'Hội An phố cổ đèn giăng / Áo lụa Mã Châu dịu dàng bước chân.',
    accentColor: '#F97316',
    icon: '🏮',
    elevationBadge: 'Thương Cảng Di Sản',
    labelOffset: { x: 22, y: 16 },
    landmarkNote: 'Thương cảng tơ lụa quốc tế lừng danh thế kỷ 16-18',
  },
  {
    id: 'cham-pa',
    name: 'Xứ Champa Cổ (Ninh Thuận - Bình Định)',
    historicalName: 'Vương Quốc Panduranga & Vijaya',
    modernLocation: 'Huyện Ninh Phước, Tỉnh Ninh Thuận & Đô thị cổ Đồ Bàn, Bình Định',
    coordinates: [108.98, 11.58],
    regionId: 'trung-bo',
    regionTitle: 'Nam Trung Bộ — Di Sản Chăm',
    dynasties: ['Văn Hóa Chăm Pa Cổ Điển'],
    mainGarmentName: 'Thổ Cẩm Chăm Mỹ Nghiệp & Khăn Mat’ra',
    targetTopId: 'tu-than',
    garments: [
      {
        name: 'Khăn Choàng Mat’ra Thêu Hoa Chăm',
        type: 'Lễ phục thiếu nữ',
        significance: 'Hoa văn hình học sóng nước và thần Shiva cách điệu thêu chỉ vàng chỉ đỏ.',
      },
      {
        name: 'Váy Khép Dệt Tay Mỹ Nghiệp',
        type: 'Trang phục lễ hội Katê',
        significance: 'Nhuộm màu vỏ cây rừng tự nhiên, tạo âm hưởng thần thoại rực rỡ.',
      },
    ],
    craftAndFabric: 'Làng dệt thổ cẩm Mỹ Nghiệp (Ninh Thuận) với kỹ nghệ dệt khung đứng mẫu hệ cổ truyền.',
    historicalStory:
      'Di sản trang phục người Chăm với lịch sử ngàn năm bên các tháp gạch rêu phong mang bảng màu rực rỡ tượng trưng cho ánh nắng và ngọn lửa Panduranga. Kỹ thuật dệt nổi hoa văn hai mặt không dùng máy móc hiện đại là kiệt tác văn hóa sống.',
    philosophicalMeaning:
      'Sự hòa quyện giữa tín ngưỡng thờ Mẫu (Pô Nagar) và tinh thần tôn kính thiên nhiên đất trời.',
    quote: 'Tiếng trống Ginăng ngân vang / Tà khăn rực rỡ bên tháp Chàm linh thiêng.',
    accentColor: '#EF4444',
    icon: '🛕',
    elevationBadge: 'Di Sản Thần Thoại',
    labelOffset: { x: 22, y: -16 },
    landmarkNote: 'Nghề dệt mẫu hệ & hoa văn sóng nước thần thoại',
  },
  {
    id: 'tay-nguyen',
    name: 'Đại Ngàn Tây Nguyên (Đắk Lắk - Pleiku)',
    historicalName: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    modernLocation: 'TP. Buôn Ma Thuột (Đắk Lắk) & TP. Pleiku (Gia Lai)',
    coordinates: [108.04, 12.67],
    regionId: 'tay-nguyen',
    regionTitle: 'Tây Nguyên — Trường Sơn Hùng Vĩ',
    dynasties: ['Thời Lê', 'Dân Gian Bản Địa'],
    mainGarmentName: 'Y Phục Dệt Zèng & Váy Tấm Hoa Văn Sử Thi',
    targetTopId: 'dong-son',
    garments: [
      {
        name: 'Áo Chui Đầu Dệt Hạt Cườm Êđê',
        type: 'Lễ phục buôn làng',
        significance: 'Hạt cườm ngũ sắc đan cài viền cổ và vai, tượng trưng ánh sao đêm trên nóc nhà rông.',
      },
      {
        name: 'Váy Tấm Kơ-tu Hoa Văn Nhịp Điệu',
        type: 'Trang phục nhảy múa Tung tung Da dá',
        significance: 'Họa tiết chim Grư và cối giã gạo biểu thị cho sự no ấm, phồn thực.',
      },
    ],
    craftAndFabric: 'Sợi bông rừng Kơ-pă, nhuộm rễ cây Knung, đan cài hạt cườm chì và cườm đá cổ.',
    historicalStory:
      'Cao nguyên đất đỏ bazan là nơi cư ngụ của các dân tộc Êđê, Ba-na, Gia-rai, Kơ-tu. Bộ trang phục dệt tay mang đậm triết lý sử thi Đăm Săn, phản ánh sức sống mãnh liệt và tinh thần tự do phóng khoáng của những người con đại ngàn Trường Sơn.',
    philosophicalMeaning:
      'Tính cộng đồng gắn kết bền chặt, lòng triân Mẹ Thiên Nhiên và sức mạnh của thần rừng.',
    quote: 'Vút lên tiếng hát nhà rông / Dải thổ cẩm dệt cả vòng thời gian.',
    accentColor: '#F472B6',
    icon: '🦅',
    elevationBadge: 'Sử Thi Cồng Chiêng',
    labelOffset: { x: -88, y: -18 },
    landmarkNote: 'Không gian văn hóa sử thi & kỹ thuật dệt cườm đá cổ',
  },
  {
    id: 'sai-gon',
    name: 'Sài Gòn - Gia Định (TP.HCM)',
    historicalName: 'Bến Nghé — Gia Định Thành',
    modernLocation: 'Thành phố Hồ Chí Minh (Trung tâm Quận 1 & Chợ Lớn Quận 5)',
    coordinates: [106.66, 10.77],
    regionId: 'nam-bo',
    regionTitle: 'Nam Bộ — Tân Thời Hiện Đại',
    dynasties: ['Cận Đại & Đương Đại', 'Cách Tân'],
    mainGarmentName: 'Áo Dài Năm Thân & Áo Bà Ba Sài Gòn',
    targetTopId: 'ngu-than-nu',
    garments: [
      {
        name: 'Áo Dài Raglan (Thập Niên 1960)',
        type: 'Đỉnh cao cách tân tay áo',
        significance: 'Đường ráp tay xéo nối từ cổ xuống nách xóa bỏ hoàn toàn nếp nhăn, ôm khít đường cong.',
      },
      {
        name: 'Áo Dài Thắt Eo Sài Gòn Xưa',
        type: 'Thời trang đô thị thanh lịch',
        significance: 'Phom dáng thon thả, bay bổng tôn vinh vẻ đẹp tự tin, hiện đại của phụ nữ Sài Gòn.',
      },
    ],
    craftAndFabric: 'Lụa tơ tằm Bảo Lộc thượng hạng, Voan, Satin mịn màng kết hợp kỹ nghệ cắt may Tây học.',
    historicalStory:
      'Sài Gòn - Gia Định là trung tâm hội nhập và cách tân rực rỡ nhất của tà áo dài Việt Nam trong thế kỷ 20. Nhà may Dung Đakao thập niên 1960 đã tạo nên cuộc cách mạng tay Raglan, giúp áo dài ôm khít eo mà cử động vẫn tuyệt đối thoải mái, đưa tà áo vươn ra sàn diễn thời trang thế giới.',
    philosophicalMeaning:
      'Sự hòa quyện giữa căn cốt truyền thống và nhịp sống văn minh, năng động, thanh lịch.',
    quote: 'Áo dài bay trên đường Catinat xưa / Nụ cười Sài Gòn đón nắng chiều rực rỡ.',
    accentColor: '#A78BFA',
    icon: '✨',
    elevationBadge: 'Cái Nôi Cách Tân',
    labelOffset: { x: 22, y: -16 },
    landmarkNote: 'Cuộc cách mạng Áo dài Raglan đưa tà áo vươn tầm thế giới',
  },
  {
    id: 'tan-chau',
    name: 'Tân Châu & Miệt Vườn Cửu Long',
    historicalName: 'An Giang Miệt Vườn Lục Tỉnh',
    modernLocation: 'Thị xã Tân Châu & TP. Châu Đốc, Tỉnh An Giang',
    coordinates: [105.15, 10.78],
    regionId: 'nam-bo',
    regionTitle: 'Nam Bộ — Sông Nước Miệt Vườn',
    dynasties: ['Triều Nguyễn', 'Dân Gian Nam Bộ'],
    mainGarmentName: 'Áo Bà Ba & Lụa Lãnh Mỹ A Đen Tuyền',
    targetTopId: 'tu-than',
    garments: [
      {
        name: 'Áo Bà Ba Lãnh Mỹ A “Nữ Hoàng Lụa”',
        type: 'Trang phục trứ danh Lục Tỉnh',
        significance: 'Nhuộm mủ trái mặc nưa 100 lần, tạo màu đen huyền bóng mượt, càng mặc càng óng.',
      },
      {
        name: 'Khăn Rằn Sông Nước & Nón Lá',
        type: 'Vật bất ly thân người mở cõi',
        significance: 'Họa tiết ca rô đen trắng bình dị, thấm giọt mồ hôi khai hoang mở cõi phương Nam.',
      },
    ],
    craftAndFabric: 'Kỹ nghệ dệt tơ tằm tơ tằm nguyên chất nhuộm trái mặc nưa thủ công trăm công phu.',
    historicalStory:
      'Xứ lụa Tân Châu nằm bên dòng sông Tiền trù phú, nơi khai sinh ra thứ lụa Lãnh Mỹ A đen tuyền bóng bẩy nức tiếng khắp Nam Kỳ Lục Tỉnh và Đông Dương. Chiếc Áo Bà Ba kết hợp cùng khăn rằn và nón lá là biểu tượng bình dị, kiên cường của người dân phương Nam trong công cuộc khai phá ruộng đồng.',
    philosophicalMeaning:
      'Tinh thần phóng khoáng, tình nghĩa thủy chung và sự gắn bó máu thịt với sông nước phù sa.',
    quote: 'Chiếc áo bà ba trên dòng sông xanh / Lãnh Mỹ A đen óng nghĩa tình quê hương.',
    accentColor: '#06B6D4',
    icon: '🌾',
    elevationBadge: 'Nữ Hoàng Tơ Lụa',
    labelOffset: { x: -84, y: 16 },
    landmarkNote: 'Thủ phủ tơ lụa Lãnh Mỹ A trứ danh Nam Kỳ Lục Tỉnh',
  },
];

export const CULTURAL_MIGRATION_ROUTES: MigrationRoute[] = [
  {
    id: 'route-thang-long-to-hue',
    title: 'Hành Trình Chuyển Giao Quốc Phục Thăng Long — Thuận Hóa',
    historicalEra: 'Thế Kỷ 16 - 18',
    description:
      'Chúa Tiên Nguyễn Hoàng mang theo tinh hoa dệt may, nghi lễ và các nghệ nhân Thăng Long vào Nam lập nghiệp, đặt nền móng cho phục sức triều Nguyễn.',
    color: '#F59E0B',
    fromLocationId: 'thang-long',
    toLocationId: 'hue',
    curveOffset: -38,
  },
  {
    id: 'route-hue-to-saigon',
    title: 'Dòng Chảy Phục Sức Mở Cõi Phương Nam',
    historicalEra: 'Triều Nguyễn & Cận Đại',
    description:
      'Sự di cư của các bậc trí thức và thợ may cung đình từ Thuận Hóa vào Sài Gòn - Gia Định, hòa nhập tạo nên phong cách phục sức miền Nam.',
    color: '#A78BFA',
    fromLocationId: 'hue',
    toLocationId: 'sai-gon',
    curveOffset: 42,
  },
  {
    id: 'route-thang-long-kinh-bac',
    title: 'Không Gian Văn Hóa Sông Hồng',
    historicalEra: 'Thời Lý - Trần - Lê',
    description:
      'Sự giao thoa mật thiết giữa nhã nhạc triều nghi Thăng Long và văn hóa dân gian Quan họ Kinh Bắc qua tà áo Tứ Thân & Giao Lĩnh.',
    color: '#38BDF8',
    fromLocationId: 'thang-long',
    toLocationId: 'kinh-bac',
    curveOffset: -14,
  },
  {
    id: 'route-silk-trade',
    title: 'Hành Trình Tơ Lụa & Lãnh Mỹ A',
    historicalEra: 'Thế Kỷ 18 - 20',
    description:
      'Sự truyền bá kỹ nghệ nuôi tằm ươm tơ từ miền Bắc và miền Trung (Vạn Phúc, Mã Châu) vào vựa dệt Lãnh Mỹ A nức tiếng Tân Châu.',
    color: '#10B981',
    fromLocationId: 'hoi-an',
    toLocationId: 'tan-chau',
    curveOffset: 34,
  },
  {
    id: 'route-modern-expansion',
    title: 'Làn Sóng Cách Tân Áo Dài Hiện Đại',
    historicalEra: 'Thập Niên 1930 - 1960',
    description:
      'Trào lưu cách tân áo dài khởi xướng từ Hà Nội (Lemur Cát Tường) hội tụ và bùng nổ tại Sài Gòn (Áo dài Raglan), trở thành biểu tượng quốc phục đương đại.',
    color: '#EC4899',
    fromLocationId: 'sai-gon',
    toLocationId: 'thang-long',
    curveOffset: 55,
  },
];

/**
 * High-Precision GeoJSON FeatureCollection for Vietnam with natural curved contours,
 * detailed coastlines, mountainous frontiers, key bays, and sacred archipelagos.
 */
export const VIETNAM_GEO_JSON: FeatureCollection<Geometry> = {
  type: 'FeatureCollection',
  features: [
    // 1. VIETNAM MAINLAND CONTOUR (Detailed Organic S-Shape Polygon)
    {
      type: 'Feature',
      id: 'vietnam-mainland',
      properties: {
        name: 'Đất Liền Việt Nam',
        type: 'mainland',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Northern Border (West to East along frontier)
            [102.15, 22.40], // Mường Nhé (Điện Biên)
            [102.35, 22.52], // Mường Tè
            [102.80, 22.65], // Phong Thổ (Lai Châu)
            [103.30, 22.75], // Bát Xát
            [103.80, 22.82], // Lào Cai
            [104.30, 23.05], // Mường Khương
            [104.75, 23.25], // Quản Bạ (Hà Giang)
            [105.15, 23.36], // Đồng Văn
            [105.35, 23.39], // Cột cờ Lũng Cú (Điểm cực Bắc)
            [105.65, 23.22], // Mèo Vạc
            [106.10, 23.00], // Bảo Lạc (Cao Bằng)
            [106.50, 22.85], // Hà Quảng
            [106.85, 22.70], // Trùng Khánh (Thác Bản Giốc)
            [107.15, 22.38], // Phục Hòa
            [107.50, 21.95], // Chi Lăng / Lạng Sơn
            [107.80, 21.65], // Đình Lập
            [108.05, 21.52], // Mũi Sa Vĩ / Móng Cái (Quảng Ninh)

            // Northern Coastline (Vịnh Bắc Bộ)
            [107.85, 21.35], // Hải Hà
            [107.60, 21.15], // Tiên Yên
            [107.35, 20.95], // Cẩm Phả
            [107.05, 20.85], // Vịnh Hạ Long (Kỳ quan thiên nhiên)
            [106.75, 20.72], // Hải Phòng
            [106.50, 20.55], // Tiên Lãng
            [106.35, 20.40], // Thái Bình / Cửa Ba Lạt
            [106.10, 20.05], // Nam Định
            [105.95, 19.92], // Kim Sơn (Ninh Bình)

            // North Central Coastline
            [105.88, 19.80], // Sầm Sơn (Thanh Hóa)
            [105.80, 19.45], // Tĩnh Gia
            [105.75, 19.00], // Cửa Lò (Nghệ An)
            [105.85, 18.65], // Nghi Xuân
            [105.92, 18.35], // Thiên Cầm (Hà Tĩnh)
            [106.15, 18.05], // Kỳ Anh
            [106.40, 17.80], // Đèo Ngang (Ranh giới lịch sử)
            [106.55, 17.65], // Quảng Trạch
            [106.65, 17.50], // Đồng Hới (Quảng Bình - eo hẹp nhất nước)
            [106.85, 17.25], // Lệ Thủy
            [107.10, 17.00], // Vĩnh Linh / Cửa Tùng (Quảng Trị)
            [107.35, 16.75], // Quảng Trị
            [107.60, 16.50], // Cửa Thuận An (Thừa Thiên Huế)
            [107.95, 16.30], // Vịnh Lăng Cô
            [108.20, 16.15], // Bán đảo Sơn Trà / Đà Nẵng

            // South Central Coastline
            [108.40, 15.90], // Cửa Đại (Hội An)
            [108.60, 15.55], // Tam Kỳ (Quảng Nam)
            [108.75, 15.20], // Dung Quất (Quảng Ngãi)
            [108.95, 14.75], // Sa Huỳnh
            [109.15, 14.30], // Tam Quan (Bình Định)
            [109.25, 13.75], // Quy Nhơn
            [109.35, 13.10], // Sông Cầu (Phú Yên)
            [109.47, 12.85], // Mũi Điện / Đại Lãnh (Điểm cực Đông đất liền)
            [109.28, 12.55], // Vịnh Vân Phong
            [109.20, 12.25], // Vịnh Nha Trang (Khánh Hòa)
            [109.15, 11.90], // Vịnh Cam Ranh
            [109.00, 11.55], // Phan Rang - Tháp Chàm (Ninh Thuận)
            [108.75, 11.25], // Cà Ná
            [108.30, 11.00], // Mũi Né (Bình Thuận)
            [107.80, 10.60], // Phan Thiết
            [107.45, 10.45], // La Gi
            [107.10, 10.35], // Mũi Nghinh Phong (Bà Rịa - Vũng Tàu)

            // Mekong Delta Coastline (Đồng Bằng Sông Cửu Long)
            [106.85, 10.38], // Vịnh Gành Rái
            [106.75, 10.35], // Rừng ngập mặn Cần Giờ
            [106.50, 10.15], // Cửa Đại / Cửa Tiểu (Bến Tre)
            [106.35, 9.95],  // Ba Tri
            [106.20, 9.75],  // Duyên Hải (Trà Vinh)
            [105.95, 9.35],  // Vĩnh Châu (Sóc Trăng)
            [105.65, 9.10],  // Bạc Liêu
            [105.35, 8.85],  // Đầm Dơi
            [105.05, 8.68],  // Năm Căn (Cà Mau)
            [104.75, 8.60],  // Mũi Cà Mau (Điểm cực Nam)

            // Gulf of Thailand Coastline (Tây Nam Bộ)
            [104.85, 9.15],  // U Minh Hạ
            [105.00, 9.80],  // Rạch Giá (Kiên Giang)
            [104.80, 10.15], // Hòn Đất
            [104.48, 10.38], // Hà Tiên (Giáp Campuchia)

            // Southwest Inland Border with Cambodia
            [105.05, 10.75], // Tân Châu / An Giang
            [105.35, 10.85], // Hồng Ngự (Đồng Tháp)
            [105.80, 11.00], // Tân Hưng (Long An)
            [106.05, 11.45], // Mộc Bài (Tây Ninh)
            [106.35, 11.75], // Lộc Ninh (Bình Phước)
            [106.80, 11.95], // Bù Đốp
            [107.40, 12.15], // Tuy Đức (Đắk Nông)
            [107.50, 12.90], // Buôn Đôn (Đắk Lắk)
            [107.60, 13.80], // Ia Grai (Gia Lai)
            [107.70, 14.70], // Ngọc Hồi (Kon Tum - Ngã ba Đông Dương)

            // Truong Son Mountain Frontier with Laos
            [107.55, 15.20], // Đắk Glei
            [107.35, 15.70], // Nam Giang (Quảng Nam)
            [107.10, 16.30], // A Lưới (Thừa Thiên Huế)
            [106.70, 16.70], // Hướng Hóa / Lao Bảo (Quảng Trị)
            [106.10, 17.30], // Cha Lo (Quảng Bình)
            [105.70, 18.25], // Cửa khẩu Cầu Treo (Hà Tĩnh)
            [105.20, 18.75], // Thanh Thủy (Nghệ An)
            [104.60, 19.30], // Kỳ Sơn / Nậm Cắn
            [104.30, 20.00], // Mường Lát (Thanh Hóa)
            [104.00, 20.50], // Sốp Cộp (Sơn La)
            [103.60, 21.00], // Sông Mã
            [103.00, 21.40], // Điện Biên Đông / Điện Biên Phủ
            [102.50, 21.90], // Mường Chà
            [102.15, 22.40], // Trở lại Mường Nhé (Điểm cực Tây)
          ],
        ],
      },
    },

    // 2. PHÚ QUỐC ISLAND (Kiên Giang - Đảo Ngọc)
    {
      type: 'Feature',
      id: 'island-phu-quoc',
      properties: { name: 'Đảo Phú Quốc', type: 'island' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.90, 10.08],
            [104.05, 10.12],
            [104.08, 10.35],
            [103.98, 10.45],
            [103.88, 10.32],
            [103.90, 10.08],
          ],
        ],
      },
    },

    // 3. CÔN ĐẢO (Bà Rịa - Vũng Tàu)
    {
      type: 'Feature',
      id: 'island-con-dao',
      properties: { name: 'Côn Đảo', type: 'island' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [106.55, 8.65],
            [106.68, 8.68],
            [106.66, 8.76],
            [106.52, 8.72],
            [106.55, 8.65],
          ],
        ],
      },
    },

    // 4. QUẦN ĐẢO HOÀNG SA (Paracel Islands - Việt Nam)
    {
      type: 'Feature',
      id: 'archipelago-hoang-sa',
      properties: { name: 'Quần đảo Hoàng Sa', type: 'archipelago' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // Nhóm An Vĩnh & Đảo Phú Lâm
          [
            [
              [112.20, 16.80],
              [112.42, 16.80],
              [112.42, 16.98],
              [112.20, 16.98],
              [112.20, 16.80],
            ],
          ],
          // Nhóm Lưỡi Liềm & Đảo Hoàng Sa
          [
            [
              [111.45, 16.45],
              [111.70, 16.45],
              [111.70, 16.68],
              [111.45, 16.68],
              [111.45, 16.45],
            ],
          ],
          // Bãi Cát Tri Tôn
          [
            [
              [111.15, 15.75],
              [111.30, 15.75],
              [111.30, 15.88],
              [111.15, 15.88],
              [111.15, 15.75],
            ],
          ],
        ],
      },
    },

    // 5. QUẦN ĐẢO TRƯỜNG SA (Spratly Islands - Việt Nam)
    {
      type: 'Feature',
      id: 'archipelago-truong-sa',
      properties: { name: 'Quần đảo Trường Sa', type: 'archipelago' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // Đảo Song Tử Tây & Song Tử Đông
          [
            [
              [114.28, 11.35],
              [114.52, 11.35],
              [114.52, 11.58],
              [114.28, 11.58],
              [114.28, 11.35],
            ],
          ],
          // Đảo Nam Yết & Sinh Tồn
          [
            [
              [114.18, 9.75],
              [114.48, 9.75],
              [114.48, 10.08],
              [114.18, 10.08],
              [114.18, 9.75],
            ],
          ],
          // Đảo Trường Sa Lớn & Đá Tây
          [
            [
              [111.85, 8.78],
              [112.12, 8.78],
              [112.12, 9.05],
              [111.85, 9.05],
              [111.85, 8.78],
            ],
          ],
          // Đảo Thuyền Chài & An Bang
          [
            [
              [112.35, 7.85],
              [112.58, 7.85],
              [112.58, 8.15],
              [112.35, 8.15],
              [112.35, 7.85],
            ],
          ],
        ],
      },
    },
  ],
};
