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
    accentColor: '#3B82F6',
    icon: '🏛️',
    elevationBadge: 'Kinh Đô Đế Vương',
  },
  {
    id: 'kinh-bac',
    name: 'Hội Lim Kinh Bắc (Bắc Ninh)',
    historicalName: 'Xứ Kinh Bắc Cổ Kính',
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
    accentColor: '#059669',
    icon: '🏮',
    elevationBadge: 'Cái Nôi Dân Gian',
  },
  {
    id: 'tay-bac',
    name: 'Cao Nguyên Sa Pa & Tây Bắc',
    historicalName: 'Xứ Mường, Thái & Mèo Tây Bắc',
    coordinates: [103.84, 22.33],
    regionId: 'tay-bac',
    regionTitle: 'Tây Bắc — Đại Ngàn Hùng Vĩ',
    dynasties: ['Thời Lê', 'Dân Gian Bản Địa'],
    mainGarmentName: 'Thổ Cẩm Dệt Lanh Sáp Ong & Áo Chàm',
    targetTopId: 'ao-yem',
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
    accentColor: '#10B981',
    icon: '🏔️',
    elevationBadge: 'Di Sản Thổ Cẩm',
  },
  {
    id: 'hoa-lu',
    name: 'Cố Đô Hoa Lư (Ninh Bình)',
    historicalName: 'Đại Cồ Việt Kinh Đô',
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
    accentColor: '#6366F1',
    icon: '⚔️',
    elevationBadge: 'Cố Đô Khởi Nguyên',
  },
  {
    id: 'dong-son',
    name: 'Xứ Thanh & Đất Mẹ Đông Sơn',
    historicalName: 'Cái Nôi Văn Minh Sông Mã',
    coordinates: [105.78, 19.80],
    regionId: 'trung-bo',
    regionTitle: 'Bắc Trung Bộ — Văn Minh Đông Sơn',
    dynasties: ['Thời Hùng Vương - Đông Sơn', 'Thời Lê Sơ'],
    mainGarmentName: 'Y Phục Cổ Thời Trống Đồng & Lam Sơn Hào Kiệt',
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
    accentColor: '#D97706',
    icon: '🥁',
    elevationBadge: 'Nôi Văn Minh Cổ',
  },
  {
    id: 'hue',
    name: 'Cố Đô Huế (Kinh Đô Phú Xuân)',
    historicalName: 'Kinh Sư Thuận Hóa — Đại Nam Quốc',
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
  },
  {
    id: 'hoi-an',
    name: 'Phố Cổ Hội An & Xứ Quảng',
    historicalName: 'Thương Cảng Faifo — Giao Thoa Á Âu',
    coordinates: [108.33, 15.88],
    regionId: 'trung-bo',
    regionTitle: 'Trung Bộ — Thương Cảng Giao Lưu',
    dynasties: ['Triều Nguyễn', 'Cận Đại'],
    mainGarmentName: 'Lụa Tơ Tằm Mã Châu & Áo Cổ Phục Tân Thời',
    targetTopId: 'cach-tan',
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
    accentColor: '#EA580C',
    icon: '🏮',
    elevationBadge: 'Thương Cảng Di Sản',
  },
  {
    id: 'cham-pa',
    name: 'Xứ Champa Cổ (Ninh Thuận - Bình Định)',
    historicalName: 'Vương Quốc Panduranga & Vijaya',
    coordinates: [108.98, 11.58],
    regionId: 'trung-bo',
    regionTitle: 'Nam Trung Bộ — Di Sản Chăm',
    dynasties: ['Văn Hóa Chăm Pa Cổ Điển'],
    mainGarmentName: 'Thổ Cẩm Chăm Mỹ Nghiệp & Khăn Mat’ra',
    targetTopId: 'ao-yem',
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
    accentColor: '#DC2626',
    icon: '🛕',
    elevationBadge: 'Di Sản Thần Thoại',
  },
  {
    id: 'tay-nguyen',
    name: 'Đại Ngàn Tây Nguyên (Đắk Lắk - Gia Lai)',
    historicalName: 'Không Gian Văn Hóa Cồng Chiêng',
    coordinates: [108.04, 12.67],
    regionId: 'tay-nguyen',
    regionTitle: 'Tây Nguyên — Trường Sơn Hùng Vĩ',
    dynasties: ['Thời Lê', 'Dân Gian Bản Địa'],
    mainGarmentName: 'Y Phục Dệt Zèng & Váy Tấm Hoa Văn Sử Thi',
    targetTopId: 'ao-yem',
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
      'Tính cộng đồng gắn kết bền chặt, lòng tri ân Mẹ Thiên Nhiên và sức mạnh của thần rừng.',
    quote: 'Vút lên tiếng hát nhà rông / Dải thổ cẩm dệt cả vòng thời gian.',
    accentColor: '#EC4899',
    icon: '🦅',
    elevationBadge: 'Sử Thi Cồng Chiêng',
  },
  {
    id: 'sai-gon',
    name: 'Đô Thị Sài Gòn - Gia Định (TP.HCM)',
    historicalName: 'Bến Nghé — Gia Định Thành',
    coordinates: [106.66, 10.77],
    regionId: 'nam-bo',
    regionTitle: 'Nam Bộ — Tân Thời Hiện Đại',
    dynasties: ['Cận Đại & Đương Đại', 'Cách Tân'],
    mainGarmentName: 'Áo Dài Cách Tân Raglan & Lemur Sài Gòn',
    targetTopId: 'cach-tan',
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
    accentColor: '#8B5CF6',
    icon: '✨',
    elevationBadge: 'Cái Nôi Cách Tân',
  },
  {
    id: 'tan-chau',
    name: 'Xứ Lụa Tân Châu & Miệt Vườn Cửu Long',
    historicalName: 'An Giang Miệt Vườn Lục Tỉnh',
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
    craftAndFabric: 'Kỹ nghệ dệt lụa Lãnh Mỹ A tráng mủ trái mặc nưa độc nhất vô nhị chỉ có tại Tân Châu - An Giang.',
    historicalStory:
      'Tân Châu bên bờ sông Tiền trù phú đã tạo nên huyền thoại Lãnh Mỹ A. Chiếc Áo Bà Ba xẻ tà hai bên hông với hai túi phía trước ra đời từ nhu cầu lao động sông nước: gọn gàng, mau khô, thoáng mát nhưng tôn trọn nét đẹp khỏe khoắn, đôn hậu của con người phương Nam.',
    philosophicalMeaning:
      'Sự chất phác, hào sảng, trọng nghĩa khinh tài và lòng gắn bó thủy chung với đất mẹ phù sa.',
    quote: 'Chiếc áo bà ba trên dòng sông xanh thẳm / Nắng tỏa sông Tiền ngời sắc Lãnh Mỹ A.',
    accentColor: '#0EA5E9',
    icon: '🚣',
    elevationBadge: 'Huyền Thoại Vải Đen',
  },
  {
    id: 'hoang-sa-truong-sa',
    name: 'Quần Đảo Hoàng Sa & Trường Sa',
    historicalName: 'Vạn Lý Hoàng Sa & Đại Trường Sa',
    coordinates: [111.9, 16.5],
    regionId: 'trung-bo',
    regionTitle: 'Biển Đảo — Chủ Quyền Thiêng Liêng',
    dynasties: ['Triều Nguyễn'],
    mainGarmentName: 'Phục Trang Hải Đội Hoàng Sa & Ngư Dân Cổ',
    targetTopId: 'ngu-than',
    garments: [
      {
        name: 'Quân Phục Thủy Binh Hải Đội Hoàng Sa',
        type: 'Quân phục hải đội triều Nguyễn',
        significance: 'Áo chẽn nẹp đai, nón dấu hoặc nón chóp che nắng gió, mang cờ lệnh và chỉ dụ vua ban.',
      },
    ],
    craftAndFabric: 'Vải thô chịu mặn, đan mây tre kiên cố, chỉ gai bện chịu sóng gió đại dương.',
    historicalStory:
      'Từ thời các Chúa Nguyễn đến vua Gia Long và Minh Mạng, Hải Đội Hoàng Sa kiêm quản Bắc Hải hàng năm dong thuyền buồm ra đo đạc hải trình, dựng bia cắm mốc chủ quyền thiêng liêng trên hai quần đảo Hoàng Sa và Trường Sa của Tổ quốc.',
    philosophicalMeaning:
      'Ý chí kiên cường giữ gìn từng tấc biển thiêng liêng của cha ông ngàn đời truyền lại.',
    quote: 'Hoàng Sa mây nước mênh mông / Người đi canh giữ non sông muôn đời.',
    accentColor: '#38BDF8',
    icon: '⚓',
    elevationBadge: 'Cương Vực Biển Đảo',
  },
];

export const CULTURAL_MIGRATION_ROUTES: MigrationRoute[] = [
  {
    id: 'route-minh-mang-standard',
    title: 'Chiếu Dụ Chuẩn Hóa Quốc Phục (1836)',
    historicalEra: 'Triều Nguyễn (Vua Minh Mạng)',
    description:
      'Từ Cố Đô Huế, vua Minh Mạng ban hành chiếu dụ cải cách y phục trên toàn quốc, đưa Áo Ngũ Thân lan tỏa ra khắp Bắc Hà và Nam Kỳ.',
    color: '#F59E0B',
    fromLocationId: 'hue',
    toLocationId: 'thang-long',
    curveOffset: -40,
  },
  {
    id: 'route-hue-to-saigon',
    title: 'Dòng Chảy Phục Sức Mở Cõi Phương Nam',
    historicalEra: 'Triều Nguyễn & Cận Đại',
    description:
      'Sự di cư của các bậc trí thức và thợ may cung đình từ Thuận Hóa vào Sài Gòn - Gia Định, hòa nhập tạo nên phong cách phục sức miền Nam.',
    color: '#8B5CF6',
    fromLocationId: 'hue',
    toLocationId: 'sai-gon',
    curveOffset: 45,
  },
  {
    id: 'route-thang-long-kinh-bac',
    title: 'Không Gian Văn Hóa Sông Hồng',
    historicalEra: 'Thời Lý - Trần - Lê',
    description:
      'Sự giao thoa mật thiết giữa nhã nhạc triều nghi Thăng Long và văn hóa dân gian Quan họ Kinh Bắc qua tà áo Tứ Thân & Giao Lĩnh.',
    color: '#3B82F6',
    fromLocationId: 'thang-long',
    toLocationId: 'kinh-bac',
    curveOffset: -15,
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
    curveOffset: 35,
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
    curveOffset: 60,
  },
];

/**
 * GeoJSON FeatureCollection for Vietnam with mainland, zones, and sacred islands.
 * Longitude ranges approx 102° to 115°, Latitude approx 8° to 24°.
 */
export const VIETNAM_GEO_JSON: FeatureCollection<Geometry> = {
  type: 'FeatureCollection',
  features: [
    // 1. VIETNAM MAINLAND CONTOUR (Recognizable S-Shape Boundary Polygon)
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
            // Northern Border (West to East along China border)
            [102.15, 22.40], // Mường Nhé (Điện Biên)
            [102.80, 22.65], // Lai Châu
            [103.80, 22.80], // Lào Cai
            [104.90, 23.35], // Hà Giang
            [105.35, 23.38], // Lũng Cú (Northernmost tip)
            [106.10, 23.00], // Cao Bằng
            [106.80, 22.70], // Trùng Khánh
            [107.50, 22.00], // Lạng Sơn
            [108.05, 21.52], // Móng Cái (Quảng Ninh)
            
            // Northern Coastline (East to South)
            [107.60, 21.15], // Tiên Yên
            [107.05, 20.85], // Vịnh Hạ Long
            [106.70, 20.70], // Hải Phòng
            [106.35, 20.40], // Thái Bình
            [106.10, 20.05], // Nam Định
            [105.90, 19.90], // Ninh Bình / Kim Sơn
            
            // North Central Coastline
            [105.85, 19.75], // Thanh Hóa
            [105.75, 19.00], // Nghệ An
            [105.90, 18.35], // Hà Tĩnh
            [106.40, 17.80], // Đèo Ngang
            [106.65, 17.50], // Đồng Hới (Quảng Bình narrow waist)
            [107.10, 17.00], // Quảng Trị
            [107.60, 16.50], // Thừa Thiên Huế
            [108.20, 16.15], // Đà Nẵng
            
            // South Central Coastline (Bulging East)
            [108.40, 15.90], // Hội An
            [108.75, 15.20], // Quảng Ngãi
            [109.15, 14.30], // Bình Định
            [109.25, 13.75], // Quy Nhơn
            [109.35, 13.10], // Sông Cầu (Phú Yên)
            [109.47, 12.85], // Mũi Điện / Đại Lãnh (Easternmost tip)
            [109.20, 12.25], // Nha Trang (Khánh Hòa)
            [109.15, 11.90], // Cam Ranh
            [109.00, 11.55], // Phan Rang (Ninh Thuận)
            [108.30, 11.00], // Mũi Né (Bình Thuận)
            [107.80, 10.60], // Phan Thiết
            [107.10, 10.35], // Bà Rịa - Vũng Tàu
            
            // Mekong Delta Coastline (South tip)
            [106.75, 10.38], // Cần Giờ
            [106.50, 10.15], // Tiền Giang / Bến Tre
            [106.20, 9.75],  // Trà Vinh
            [105.95, 9.35],  // Sóc Trăng
            [105.65, 9.10],  // Bạc Liêu
            [105.20, 8.70],  // Đầm Dơi (Cà Mau)
            [104.75, 8.60],  // Mũi Cà Mau (Southernmost tip)
            
            // Gulf of Thailand Coastline (Southwest)
            [104.85, 9.15],  // U Minh
            [105.00, 9.80],  // Rạch Giá (Kiên Giang)
            [104.48, 10.38], // Hà Tiên
            
            // Southwest Inland Border with Cambodia & Laos
            [105.05, 10.75], // An Giang (Châu Đốc / Tân Châu)
            [105.35, 10.85], // Đồng Tháp
            [105.80, 11.00], // Long An
            [106.05, 11.45], // Tây Ninh
            [106.60, 11.85], // Bình Phước
            [107.40, 12.15], // Đắk Nông
            [107.50, 12.90], // Đắk Lắk
            [107.60, 13.80], // Gia Lai
            [107.70, 14.70], // Kon Tum (Ngã ba Đông Dương)
            
            // Truong Son Mountains Border with Laos (Heading North)
            [107.35, 15.70], // Quảng Nam
            [107.10, 16.30], // A Lưới (Thừa Thiên Huế)
            [106.70, 16.70], // Hướng Hóa (Quảng Trị)
            [106.10, 17.30], // Cha Lo (Quảng Bình)
            [105.70, 18.25], // Cầu Treo (Hà Tĩnh)
            [104.80, 19.10], // Tương Dương (Nghệ An)
            [104.40, 19.80], // Mường Lát (Thanh Hóa)
            [103.80, 20.80], // Mộc Châu (Sơn La)
            [103.00, 21.40], // Điện Biên Phủ
            [102.15, 22.40], // Return to Mường Nhé
          ],
        ],
      },
    },

    // 2. PHÚ QUỐC ISLAND (Kiên Giang)
    {
      type: 'Feature',
      id: 'island-phu-quoc',
      properties: { name: 'Đảo Phú Quốc', type: 'island' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.90, 10.15],
            [104.05, 10.10],
            [104.08, 10.35],
            [103.95, 10.45],
            [103.85, 10.30],
            [103.90, 10.15],
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
            [106.65, 8.75],
            [106.52, 8.72],
            [106.55, 8.65],
          ],
        ],
      },
    },

    // 4. QUẦN ĐẢO HOÀNG SA (Paracel Islands)
    {
      type: 'Feature',
      id: 'archipelago-hoang-sa',
      properties: { name: 'Quần đảo Hoàng Sa', type: 'archipelago' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // Đảo Hoàng Sa & Đá Lồi
          [
            [
              [111.45, 16.50],
              [111.60, 16.50],
              [111.60, 16.65],
              [111.45, 16.65],
              [111.45, 16.50],
            ],
          ],
          // Đảo Phú Lâm & Linh Côn
          [
            [
              [112.20, 16.80],
              [112.38, 16.80],
              [112.38, 16.95],
              [112.20, 16.95],
              [112.20, 16.80],
            ],
          ],
        ],
      },
    },

    // 5. QUẦN ĐẢO TRƯỜNG SA (Spratly Islands)
    {
      type: 'Feature',
      id: 'archipelago-truong-sa',
      properties: { name: 'Quần đảo Trường Sa', type: 'archipelago' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // Đảo Trường Sa Lớn & Đá Tây
          [
            [
              [111.85, 8.80],
              [112.05, 8.80],
              [112.05, 9.00],
              [111.85, 9.00],
              [111.85, 8.80],
            ],
          ],
          // Đảo Sinh Tồn & Nam Yết
          [
            [
              [114.20, 9.80],
              [114.45, 9.80],
              [114.45, 10.05],
              [114.20, 10.05],
              [114.20, 9.80],
            ],
          ],
          // Song Tử Tây & Song Tử Đông
          [
            [
              [114.30, 11.35],
              [114.50, 11.35],
              [114.50, 11.55],
              [114.30, 11.55],
              [114.30, 11.35],
            ],
          ],
        ],
      },
    },
  ],
};
