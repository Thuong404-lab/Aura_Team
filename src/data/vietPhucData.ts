export interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'accessory';
  era: 'Triều Nguyễn' | 'Thời Lê' | 'Thời Lý - Trần' | 'Cách Tân';
  icon: string;
  badge: string;
  summary: string;
  imageUrl?: string;
  cultureInfo: {
    origin: string;
    collarType: string;
    symbolism: string;
    etiquette: string;
    pattern: string;
    notableDynasty: string;
  };
  defaultColorHex: string;
  secondaryColorHex: string;
  svgLayerType: string;
}

export interface FabricOption {
  id: string;
  name: string;
  description: string;
  textureLabel: string;
  sheen: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  meaning: string;
}

export interface BackdropOption {
  id: string;
  name: string;
  tagline: string;
  city: string;
  bgGradient: string;
  imageUrl: string;
  lightingDescription: string;
  badge: string;
}

export interface PresetOutfit {
  id: string;
  title: string;
  subtitle: string;
  topId: string;
  bottomId: string;
  accessoryId: string;
  fabricId: string;
  colorId: string;
  backdropId: string;
  presetScore: number;
}

export const TOPS: WardrobeItem[] = [
  {
    id: 'ngu-than',
    name: 'Áo ngũ thân tay chẽn',
    category: 'top',
    era: 'Triều Nguyễn',
    icon: '🧥',
    badge: 'Quốc Phục Cố Đô',
    summary: 'Dáng áo 5 thân thanh thoát, tay áo ôm gọn gàng, thể hiện cốt cách Nho nhã, lễ giáo khiêm cung.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Được Võ Vương Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng phổ biến toàn quốc năm 1836.',
      collarType: 'Cổ đứng (cổ lập) cao 2-3cm ôm khít gáy, 5 chiếc cúc cài chéo về bên phải.',
      symbolism: 'Áo ngũ thân tay chẽn tôn nét đẹp đoan trang, kín đáo với 5 thân áo tượng trưng cho tứ thân phụ mẫu và đạo hiếu làm người.',
      etiquette: 'Trang phục thường nhật của sĩ phu, quan lại và dân chúng kinh kỳ, dùng linh hoạt từ công sở xưa đến dạ tiệc.',
      pattern: 'Gấm dệt chìm hoa cúc hoặc lụa Hà Đông dệt vân mây cổ điển.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#1B365D',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ngu-than',
  },
  {
    id: 'ao-tac',
    name: 'Áo tấc',
    category: 'top',
    era: 'Triều Nguyễn',
    icon: '🥻',
    badge: 'Đại Lễ Cung Đình',
    summary: 'Áo ngũ thân với tay thụ thụng rộng thênh thang trang nghiêm, lễ phục bắt buộc trong các nghi lễ trang trọng.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Tên gọi "Áo Tấc" bắt nguồn từ viền cổ áo rộng đúng một tấc ta (khoảng 4cm).',
      collarType: 'Cổ đứng lập lĩnh, may vạt con che ngực bên trong kín đáo, tay áo vuông dài buông qua đầu ngón tay.',
      symbolism: 'Khi hành lễ khoanh tay trước ngực, hai tà tay thụ buông giao nhau tạo thế nghiêm cẩn, kính thiên ái nhân.',
      etiquette: 'Mặc vào dịp Tế Nam Giao, Lễ Đính Hôn, Tế Tổ Tiên, lễ Thượng Thọ.',
      pattern: 'Gấm dệt chữ Thọ mây cuộn hoặc lụa màu tía vương giả.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ao-tac',
  },
  {
    id: 'tu-than',
    name: 'Áo tứ thân',
    category: 'top',
    era: 'Thời Lê',
    icon: '👘',
    badge: 'Dân Gian Kinh Bắc',
    summary: 'Bốn vạt áo thướt tha mềm mại, hai vạt trước buộc nút duyên dáng phối cùng yếm đào và thắt lưng lụa.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục cổ truyền lâu đời của phụ nữ miền Bắc Việt Nam từ thời Lý - Trần qua thời Lê.',
      collarType: 'Cổ mở không khuy để lộ yếm đào bên trong, vạt trước thắt nút buông rủ.',
      symbolism: 'Bốn vạt tượng trưng cho tứ thân phụ mẫu luôn chở che, đùm bọc người con gái.',
      etiquette: 'Lễ hội làng, hát Quan họ, dạo phố du xuân, hội hè truyền thống.',
      pattern: 'Lụa the đen khoác ngoài yếm cánh sen hoặc gấm mộc.',
      notableDynasty: 'Nhà Lê & Nhà Trần',
    },
    defaultColorHex: '#3D342D',
    secondaryColorHex: '#C59B27',
    svgLayerType: 'tu-than',
  },
  {
    id: 'ao-yem',
    name: 'Áo yếm',
    category: 'top',
    era: 'Thời Lý - Trần',
    icon: '🌸',
    badge: 'Khuê Các Duyên Dáng',
    summary: 'Yếm lụa cổ tròn hoặc xẻ chữ V yêu kiều, biểu tượng thuần khiết của trang phục nữ tính truyền thống Việt.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục nội y truyền thống của phụ nữ Việt từ thời Lý - Trần được nâng cấp thành thời trang dạ hội cao cấp.',
      collarType: 'Cổ yếm tròn thắt dây lụa sau gáy, khoác sa bên ngoài bay bổng.',
      symbolism: 'Tôn vinh bờ vai thon và nét duyên dáng thầm kín thuần khiết của người con gái Á Đông.',
      etiquette: 'Dạ tiệc mùa hạ, biểu diễn nghệ thuật, chụp ảnh lookbook phong cách thơ mộng.',
      pattern: 'Hoa sen nở bung thêu tơ óng và lá bồ đề bình an.',
      notableDynasty: 'Nhà Trần & Dân gian',
    },
    defaultColorHex: '#B23A48',
    secondaryColorHex: '#F7E7CE',
    svgLayerType: 'ao-yem',
  },
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình',
    category: 'top',
    era: 'Triều Nguyễn',
    icon: '👘',
    badge: 'Quý Tộc Hoàng Triều',
    summary: 'Cổ áo hình chữ nhật viền thêu hoa văn ngũ hành rực rỡ, trang phục của Hậu phi và Công chúa triều Nguyễn.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy chế trang phục năm Gia Long thứ 6 (1807), cải cách từ áo Phi Phong thời Minh.',
      collarType: 'Cổ xẻ vạt trước ngực, tạo thành hình chữ nhật đặc trưng (Nhật - 日).',
      symbolism: 'Hoa văn Thủy Ba (sóng nước) ở gấu áo và chim Phụng tượng trưng cho phước lộc, quyền uy và nét đài các của bậc nữ chủ.',
      etiquette: 'Dùng cho dịp Khánh tiết, Tế lễ, Hôn lễ cung đình. Tay áo có dải ngũ sắc (Ngũ hành Kim - Mộc - Thủy - Hỏa - Thổ).',
      pattern: 'Thêu chim Phụng, hoa sen, mây ngũ sắc và dải cúc chữ vạn.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'nhat-binh',
  },
  {
    id: 'giao-linh',
    name: 'Áo Giao Lĩnh',
    category: 'top',
    era: 'Thời Lê',
    icon: '🥋',
    badge: 'Cổ Phong Uy Nghi',
    summary: 'Dạng thức cổ áo chéo giao nhau ở ngực uy nghi, dấu ấn rực rỡ của thời kỳ Lê Sơ và Lê Trung Hưng.',
    imageUrl: 'https://images.unsplash.com/photo-1590333746438-283450096582?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Xuất hiện từ thời Lý - Trần và đạt đỉnh cao thẩm mỹ triều Lê (thế kỷ 15 - 18).',
      collarType: 'Cổ chéo vạt trái đè lên vạt phải (Giao lĩnh hữu nhậm), buộc thắt lưng lụa bên hông.',
      symbolism: 'Tượng trưng cho sự hài hòa âm dương, dáng dấp hào sảng tự do của tinh thần Thăng Long văn hiến.',
      etiquette: 'Thường phục lẫn triều phục của tầng lớp quý tộc, học sĩ thời Hậu Lê.',
      pattern: 'Họa tiết rồng thời Lê, hoa cúc dây uốn lượn phong vị thiền định.',
      notableDynasty: 'Nhà Lê',
    },
    defaultColorHex: '#2D5A46',
    secondaryColorHex: '#C59B27',
    svgLayerType: 'giao-linh',
  },
  {
    id: 'vien-linh',
    name: 'Áo Viên Lĩnh (Cổ Tròn Hoàng Triều)',
    category: 'top',
    era: 'Thời Lê',
    icon: '🏛️',
    badge: 'Quan Triều Bác Học',
    summary: 'Dáng áo cổ tròn cài khuy lệch bên vai phải, trang phục đại thần và nho sĩ học vị cao thời Lê - Nguyễn.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục triều nghi phổ biến từ triều Lý, Trần đến Lê Trung Hưng.',
      collarType: 'Viên Lĩnh - Cổ tròn bo sát vòng cổ trang nhã, khuy cài ngọc bích lệch bờ vai.',
      symbolism: 'Tròn đại diện cho Trời (Trời tròn đất vuông), thể hiện sự công chính minh bạch của người giữ trọng trách.',
      etiquette: 'Dành cho văn quan, tiến sĩ, hội thi đình hoặc nghi thức quốc gia.',
      pattern: 'Bổ tử thêu hạc trắng, mây trời hoặc kỳ lân.',
      notableDynasty: 'Lê Sơ & Lê Trung Hưng',
    },
    defaultColorHex: '#1B2A4A',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vien-linh',
  },
  {
    id: 'cach-tan',
    name: 'Áo Dài Phom Cổ Cách Tân 2026',
    category: 'top',
    era: 'Cách Tân',
    icon: '✨',
    badge: 'Modern Heritage 2026',
    summary: 'Giao thoa giữa cấu trúc 5 thân cổ truyền và đường cắt may tối giản đương đại, linh hoạt xuống phố.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trào lưu Cổ phong Hiện đại (Neo-Traditional Vietnamese Fashion) của các nhà thiết kế trẻ thế hệ mới.',
      collarType: 'Cổ trụ thấp 1.5cm thanh mảnh, khóa cài giấu kim loại mạ vàng cao cấp.',
      symbolism: 'Tôn vinh cội nguồn di sản trong đời sống nhịp đập thế kỷ 21, phá bỏ định kiến cổ phục cồng kềnh.',
      etiquette: 'Dạo phố, triển lãm nghệ thuật, gặp gỡ đối tác quốc tế, tuần lễ thời trang.',
      pattern: 'Họa tiết mây Hạc được vector hóa hiện đại dệt chìm vi tế trên nền vải đũi tơ sống.',
      notableDynasty: 'Cách Tân Đương Đại',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#FDFBF7',
    svgLayerType: 'cach-tan',
  },
  {
    id: 'ao-yem',
    name: 'Áo Yếm & Khoác Sa Cung Đình',
    category: 'top',
    era: 'Cách Tân',
    icon: '🌸',
    badge: 'Yểu Điệu Nữ Tính',
    summary: 'Áo yếm thêu hoa sen cổ truyền kết hợp áo khoác sa mỏng mờ ảo khoác hờ bờ vai kiêu sa.',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục nội y truyền thống của phụ nữ Việt từ thời Lý - Trần được nâng cấp thành thời trang dạ hội cao cấp.',
      collarType: 'Cổ yếm tròn thắt dây lụa sau gáy, khoác sa bên ngoài bay bổng.',
      symbolism: 'Tôn vinh bờ vai thon và nét duyên dáng thầm kín thuần khiết của người con gái Á Đông.',
      etiquette: 'Dạ tiệc mùa hạ, biểu diễn nghệ thuật, chụp ảnh lookbook phong cách thơ mộng.',
      pattern: 'Hoa sen nở bung thêu tơ óng và lá bồ đề bình an.',
      notableDynasty: 'Dân gian & Cách tân Cố phong',
    },
    defaultColorHex: '#B23A48',
    secondaryColorHex: '#F7E7CE',
    svgLayerType: 'ao-yem',
  },
];

export const BOTTOMS: WardrobeItem[] = [
  {
    id: 'quan-ong-so',
    name: 'Quần Ống Sớ Lụa Bạch',
    category: 'bottom',
    era: 'Triều Nguyễn',
    icon: '👖',
    badge: 'Chuẩn Mực Cổ Điển',
    summary: 'Quần lụa ống rộng màu trắng tinh tế, chuẩn mực không thể thiếu khi kết hợp cùng áo ngũ thân và áo tấc.',
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy thức mặc Việt phục triều Nguyễn: Quần trắng hoặc quần cùng màu áo.',
      collarType: 'Cạp quần luồn dải rút lụa rộng rãi.',
      symbolism: 'Màu trắng biểu tượng cho sự thanh bạch, trong sáng và giữ gìn nếp nhà gia phong.',
      etiquette: 'Phù hợp mọi nghi lễ trang nghiêm từ dân sự đến cung phủ.',
      pattern: 'Vải lụa Hà Đông dệt vân mây hoặc lụa đũi mờ.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#FAF7F0',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-ong-so',
  },
  {
    id: 'quan-men-lam',
    name: 'Quần Lụa Men Lam Cung Đình',
    category: 'bottom',
    era: 'Triều Nguyễn',
    icon: '🌊',
    badge: 'Thanh Nhã Cố Đô',
    summary: 'Sắc xanh men lam sâu thẳm của gốm sứ Cố đô Huế, tạo độ tương phản vương giả khi phối cùng áo đỏ hoặc vàng.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Lấy cảm hứng từ màu men lam ngọc trong gốm sứ ký kiểu thời Lê - Trịnh và triều Nguyễn.',
      collarType: 'Ống thụng rủ mềm mại.',
      symbolism: 'Sự tĩnh tại, an nhiên và tri thức sâu rộng như nước sông Hương mùa thu.',
      etiquette: 'Mặc phối cùng Áo Nhật Bình hoặc Áo Ngũ Thân dạ tiệc.',
      pattern: 'Gấm trơn bóng nhẹ.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#1F4E5B',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-men-lam',
  },
  {
    id: 'vay-xep-ly',
    name: 'Chân Váy Xếp Ly Thêu Thủy Ba',
    category: 'bottom',
    era: 'Thời Lê',
    icon: '👗',
    badge: 'Cổ Phong Yêu Kiều',
    summary: 'Váy xếp nhiều nếp ly xòe mềm mại, gấu thêu sóng nước và đá núi mang đậm mỹ học cổ xưa.',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Phổ biến thời Lý - Trần và Lê khi phụ nữ thường mặc váy quây xếp ly ngoài quần.',
      collarType: 'Cạp váy buộc nơ lụa thêu tơ.',
      symbolism: 'Thủy Ba (sóng nước tầng tầng) mang lời chúc may mắn dồi dào, vạn sự hanh thông.',
      etiquette: 'Phối cùng Áo Giao Lĩnh, Áo Yếm hoặc Áo Cách Tân trẻ trung.',
      pattern: 'Họa tiết Thủy Ba Cổ Điển thêu chỉ ngũ sắc.',
      notableDynasty: 'Thời Lê & Cách Tân',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vay-xep-ly',
  },
  {
    id: 'quan-gam-vang',
    name: 'Quần Gấm Vàng Hoàng Kim',
    category: 'bottom',
    era: 'Triều Nguyễn',
    icon: '✨',
    badge: 'Quang Vinh Quyền Quý',
    summary: 'Sắc vàng hoàng thổ rực rỡ dệt hoa văn chữ Vạn chìm, mang lại khí chất vương tộc uy nghi.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Sắc phục dành riêng cho tôn thất hoàng triều triều Nguyễn.',
      collarType: 'Dáng ống sớ suông rộng.',
      symbolism: 'Hoàng thổ trung ương ngũ hành, tượng trưng cho sự vững chãi và phú quý trọn vẹn.',
      etiquette: 'Lễ cưới cung đình, đại lễ thăng tiến.',
      pattern: 'Dệt chìm chữ Vạn hoặc Bát Bửu.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#D4AF37',
    secondaryColorHex: '#8B1E1E',
    svgLayerType: 'quan-gam-vang',
  },
  {
    id: 'quan-tay-hien-dai',
    name: 'Quần Tây Cắt May Cách Tân',
    category: 'bottom',
    era: 'Cách Tân',
    icon: '🏙️',
    badge: 'Fusion Dạo Phố',
    summary: 'Đường xếp ly cạp cao hiện đại, kết hợp phá cách cùng Áo Ngũ Thân tạo nên phong cách dạo phố cá tính.',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Phong cách Neo-Vietnamese Streetwear thịnh hành tại Sài Gòn & Hà Nội.',
      collarType: 'Cạp cao tối giản, ống đứng suông gọn.',
      symbolism: 'Sự tự tin bứt phá của giới trẻ, khẳng định Việt phục có thể sống động giữa phố thị.',
      etiquette: 'Đi cà phê, đi làm sáng tạo, sự kiện văn hóa nghệ thuật.',
      pattern: 'Vải len pha lụa đanh mịn màu than chì.',
      notableDynasty: 'Cách Tân Hiện Đại 2026',
    },
    defaultColorHex: '#262423',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-tay-hien-dai',
  },
];

export const ACCESSORIES: WardrobeItem[] = [
  {
    id: 'man-doi-dau',
    name: 'Mấn đội đầu',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '👑',
    badge: 'Quý Phái Cổ Phong',
    summary: 'Mấn đội đầu truyền thống quấn nhiều vòng thanh tú, biểu tượng của sự đoan trang, đài các.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Áo ngũ thân quy chuẩn đi kèm mấn tròn quấn nhiều vòng, tạo nét trang trọng cho diện mạo.',
      collarType: 'Mấn tròn vấn tóc ôm sát vầng trán.',
      symbolism: 'Tôn vinh gương mặt phúc hậu, nết na và cốt cách lễ giáo của người phụ nữ Việt xưa.',
      etiquette: 'Đi kèm áo ngũ thân tay chẽn, áo tấc trong mọi dịp hội lễ hoặc chụp ảnh kỷ niệm.',
      pattern: 'Gấm trơn dệt tuyết nhung hoặc lụa đen huyền bí.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#1B2A4A',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'man-ngu-sac',
  },
  {
    id: 'man-ngu-sac',
    name: 'Mấn Thêu Ngũ Sắc Đính Ngọc',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '👑',
    badge: 'Vương Giả Cung Đình',
    summary: 'Mấn quấn bằng lụa ngũ sắc thêu phụng lượn hoa sen, đỉnh đính ngọc bích, kết hợp hoàn mỹ cùng Áo Nhật Bình.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trâm cài và khăn vành dây/mấn phát triển từ quy chế trang phục hoàng tộc triều Nguyễn.',
      collarType: 'Đội ngay ngắn trên đỉnh đầu, ôm nhẹ vầng trán.',
      symbolism: 'Ngũ sắc tương ứng 5 phương trời đất ban phước, ngọc bích biểu trưng cho đức hạnh vẹn toàn.',
      etiquette: 'Bắt buộc khi diện Áo Nhật Bình trong đại lễ cưới hoặc khánh tiết.',
      pattern: 'Thêu chim phượng ngậm ngọc và hoa mẫu đơn.',
      notableDynasty: 'Triều Nguyễn (Nội cung)',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'man-ngu-sac',
  },
  {
    id: 'khan-dong',
    name: 'Khăn Đóng Lụa Đen (Khăn Xếp)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '🎩',
    badge: 'Sĩ Phu Nho Nhã',
    summary: 'Khăn xếp quấn hình chữ Nhân hoặc chữ Nhất phía trước, nét đẹp mực thước kinh điển của nam giới và phụ nữ xưa.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Vật bất ly thân khi ra ngoài của người Việt từ thời chúa Nguyễn Phúc Khoát.',
      collarType: 'Vành khăn quấn 7 hoặc 8 vòng xếp nếp đều tăm tắp.',
      symbolism: 'Nếp xếp chữ Nhân (人) trước trán nhắc nhở người đội luôn lấy chữ Nhân làm đầu trong xử thế.',
      etiquette: 'Đi kèm Áo Ngũ Thân tay chẽn hoặc Áo Tấc trong mọi nghi lễ gia đình và xã hội.',
      pattern: 'Lụa the đen hoặc gấm the thêu hoa cúc.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#1A1817',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'khan-dong',
  },
  {
    id: 'ngoc-boi',
    name: 'Ngọc Bội Thắt Lưng Chạm Rồng',
    category: 'accessory',
    era: 'Thời Lê',
    icon: '🟢',
    badge: 'Quân Tử Thanh Khiết',
    summary: 'Ngọc bội treo bên hông thắt lưng lụa, khi bước đi va chạm phát ra âm thanh thanh tao, giữ bước chân mực thước.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Phong tục đeo ngọc bội có từ thời Lý - Trần và quy định chặt chẽ thời Lê.',
      collarType: 'Treo bằng dây tơ hồng tết nút cát tường bên hông trái hoặc phải.',
      symbolism: '"Quân tử vô cố, ngọc bất ly thân" - Viên ngọc nhắc nhở tâm hồn luôn trong sáng, đi đứng đĩnh đạc.',
      etiquette: 'Phối cùng Áo Giao Lĩnh, Áo Viên Lĩnh hoặc Áo Tấc.',
      pattern: 'Khắc song long chầu ngọc hoặc hoa sen ngậm châu.',
      notableDynasty: 'Thời Lê & Nguyễn',
    },
    defaultColorHex: '#2E6F56',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ngoc-boi',
  },
  {
    id: 'quat-lua',
    name: 'Quạt Lụa Tơ Tằm Thêu Tay Cố Đô',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '🪭',
    badge: 'Duyên Dáng Phong Nhã',
    summary: 'Quạt xếp bằng nan tre già phủ lụa tơ tằm thêu cảnh sông Hương núi Ngự, phụ kiện tạo dáng tao nhã.',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Nghề làm quạt Chàng Sơn (Hà Nội) và quạt cung đình Huế nổi tiếng hàng trăm năm.',
      collarType: 'Cầm tay nhẹ nhàng hoặc giắt nhẹ tà áo.',
      symbolism: 'Gió lành (Thiện phong) xua tan ưu phiền, mang lại bình an tĩnh tại.',
      etiquette: 'Thích hợp cho mọi buổi dạo phố, chụp ảnh hoặc dạ hội ngoài trời.',
      pattern: 'Thêu chữ Thơ, hoa sen hồ Tịnh Tâm hoặc phong cảnh kinh thành.',
      notableDynasty: 'Lê - Nguyễn',
    },
    defaultColorHex: '#D4AF37',
    secondaryColorHex: '#8B1E1E',
    svgLayerType: 'quat-lua',
  },
  {
    id: 'hai-theu',
    name: 'Hài Thêu Mũi Cong Hoàng Cung',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '👠',
    badge: 'Gót Sen Đài Các',
    summary: 'Đôi hài nhung đỏ thêu mũi cong vút, chỉ vàng dệt họa tiết mây lượn, bảo chứng cho bước chân vương giả.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Hài cung đình thời Nguyễn chế tác bởi tượng cục chuyên trách Nội tạo trang phục.',
      collarType: 'Mũi hài cong nhẹ che kín bàn chân duyên dáng.',
      symbolism: 'Mũi cong hướng lên trên tượng trưng cho sự thăng tiến, gót son giữ vững nền phúc đức.',
      etiquette: 'Đi kèm trang phục dạ tiệc cung đình và lễ hội truyền thống.',
      pattern: 'Chỉ kim tuyến thêu hoa lá cách điệu.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'hai-theu',
  },
  {
    id: 'chuoi-ngoc',
    name: 'Chuỗi Ngọc Bích & Kiềng Bạc Cổ',
    category: 'accessory',
    era: 'Triều Nguyễn',
    icon: '📿',
    badge: 'Thơ Mộng Xứ Kinh Kỳ',
    summary: 'Kiềng bạc chạm hoa mai hoặc chuỗi ngọc bích đeo cổ, tôn vinh bờ cổ cao thanh mảnh của người phụ nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Kiềng bạc và chuỗi hạt là trang sức truyền thống của phụ nữ Việt qua nhiều thế kỷ.',
      collarType: 'Đeo vừa vặn bên ngoài cổ áo ngũ thân hoặc áp sát xương quai xanh.',
      symbolism: 'Bảo vệ bình an, xua đuổi tà khí và tôn vinh nét đoan trang thục nữ.',
      etiquette: 'Rất hợp khi diện Áo Ngũ Thân hoặc Áo Tấc màu trầm.',
      pattern: 'Chạm khắc hoa mai nở sớm và đàn én mùa xuân.',
      notableDynasty: 'Nguyễn & Dân gian',
    },
    defaultColorHex: '#C0C0C0',
    secondaryColorHex: '#2E6F56',
    svgLayerType: 'chuoi-ngoc',
  },
];

export const FABRICS: FabricOption[] = [
  {
    id: 'lua-ha-dong',
    name: 'Lụa Tơ Tằm Hà Đông',
    description: 'Dệt thủ công từ tơ tằm Vạn Phúc tự nhiên, mềm rủ nhẹ như mây, bắt sáng ấm áp dịu dàng.',
    textureLabel: 'Mềm mại • Thoáng khí • Rủ tự nhiên',
    sheen: 'Óng ả lụa tự nhiên',
  },
  {
    id: 'gam-cung-dinh',
    name: 'Gấm Thêu Cung Đình',
    description: 'Chất vải dày dặn đứng phom với hoa văn dệt nổi bằng chỉ kim tuyến vàng, biểu tượng vương giả tối cao.',
    textureLabel: 'Đứng phom • Sang trọng • Chi tiết thêu nổi',
    sheen: 'Ánh kim hoàng gia',
  },
  {
    id: 'sa-nam-bo',
    name: 'Sa Lam Cổ Truyền',
    description: 'Vải sa mỏng nhẹ xuyên thấu huyền ảo, thích hợp cho tà áo tấc mùa hè hoặc áo khoác ngoài quý tộc.',
    textureLabel: 'Xuyên thấu nhẹ • Bay bổng • Cổ kính',
    sheen: 'Mờ sương mộng mơ',
  },
  {
    id: 'dui-to-tam',
    name: 'Đũi Tơ Sống Mộc Mạc',
    description: 'Vải đũi giữ nguyên hạt tơ tự nhiên, mộc mạc nhưng cá tính, hoàn hảo cho phong cách phối đồ cách tân.',
    textureLabel: 'Mộc mạc • Cá tính • Thoải mái',
    sheen: 'Nhám mờ tự nhiên',
  },
];

export const COLOR_PALETTES: ColorOption[] = [
  {
    id: 'do-dieu',
    name: 'Đỏ Điều (Chu Sa)',
    hex: '#8B1E1E',
    accentHex: '#D4AF37',
    meaning: 'Sắc đỏ may mắn, đại diện cho Hỏa đức và niềm hân hoan hỷ sự Cung đình.',
  },
  {
    id: 'vang-hoang-tho',
    name: 'Vàng Hoàng Thổ',
    hex: '#D4AF37',
    accentHex: '#8B1E1E',
    meaning: 'Sắc vàng đại diện cho Thổ đức trung ương, vinh hoa phú quý và ánh sáng tri thức.',
  },
  {
    id: 'xanh-men-lam',
    name: 'Xanh Men Lam Cố Đô',
    hex: '#1F4E5B',
    accentHex: '#F4EFE6',
    meaning: 'Màu men lam gốm cổ, thanh tịnh trầm lắng như dòng sông Hương mùa thu.',
  },
  {
    id: 'tim-hue',
    name: 'Tím Trầm Cố Đô',
    hex: '#582B57',
    accentHex: '#D4AF37',
    meaning: 'Sắc tím đặc trưng của thiếu nữ Huế, kín đáo, sâu lắng và thủy chung son sắt.',
  },
  {
    id: 'trang-nga',
    name: 'Trắng Ngà Tơ Bạch',
    hex: '#FDFBF7',
    accentHex: '#8B1E1E',
    meaning: 'Màu của tơ tằm nguyên bản, biểu trưng cho sự thanh cao, lễ nghi và thuần khiết.',
  },
  {
    id: 'xanh-ngoc-thach',
    name: 'Xanh Ngọc Thạch',
    hex: '#2E6F56',
    accentHex: '#D4AF37',
    meaning: 'Sắc xanh ngọc bích đại diện cho Mộc đức sinh sôi, hiền hòa và trường tồn.',
  },
];

export const BACKDROPS: BackdropOption[] = [
  {
    id: 'hoi-an',
    name: 'Phố Cổ Hội An',
    tagline: 'Đêm Hoa Đăng Lung Linh Bên Dòng Sông Hoài',
    city: 'Quảng Nam',
    bgGradient: 'from-[#1A120B] via-[#3C2A21] to-[#141E27]',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1200',
    lightingDescription: 'Ánh đèn lồng ấm áp soi rọi tà lụa, phảng phất hoài niệm thương cảng thế kỷ 17.',
    badge: 'Di Sản Thế Giới UNESCO',
  },
  {
    id: 'hoang-thanh-hue',
    name: 'Đại Nội Hoàng Thành Huế',
    tagline: 'Ngọ Môn Cổ Kính Rêu Phong Bóng Cố Đô',
    city: 'Thừa Thiên Huế',
    bgGradient: 'from-[#2B1B17] via-[#4A2E2B] to-[#1E232A]',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1200',
    lightingDescription: 'Ánh nắng vàng hoàng hôn chiếu xiên qua tường thành, tạo hiệu ứng vương giả trầm mặc.',
    badge: 'Kinh Đô Cung Đình',
  },
  {
    id: 'van-mieu',
    name: 'Văn Miếu - Quốc Tử Giám',
    tagline: 'Khuê Văn Các Ngàn Năm Văn Hiến Thăng Long',
    city: 'Hà Nội',
    bgGradient: 'from-[#1F2421] via-[#334237] to-[#1B2A4A]',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1200',
    lightingDescription: 'Bóng râm cổ thụ và giếng Thiên Quang phẳng lặng tôn vinh phong thái nho nhã.',
    badge: 'Đạo Học Ngàn Năm',
  },
  {
    id: 'ho-hoan-kiem',
    name: 'Cầu Thê Húc - Hồ Gươm',
    tagline: 'Sắc Đỏ Son Uốn Lượn Giữa Lòng Thủ Đô',
    city: 'Hà Nội',
    bgGradient: 'from-[#3B1E1E] via-[#5C2B2B] to-[#1E2E38]',
    imageUrl: 'https://images.unsplash.com/photo-1590333746438-283450096582?auto=format&fit=crop&q=80&w=1200',
    lightingDescription: 'Mặt nước hồ xanh biếc phản chiếu tà áo và cầu son cong cong như tôm nõn.',
    badge: 'Trái Tim Thăng Long',
  },
  {
    id: 'studio-co-phong',
    name: 'Studio Nghệ Thuật Cổ Điển',
    tagline: 'Bối Cảnh Ánh Sáng Tạp Chí Thời Trang Cao Cấp',
    city: 'Fashion Studio',
    bgGradient: 'from-[#1E1B18] via-[#2E2823] to-[#161412]',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    lightingDescription: 'Ánh sáng đèn rọi Rembrandt kịch tính làm nổi bật từng sợi dệt kim tuyến gấm.',
    badge: 'Editorial High Fashion',
  },
];

export const PRESET_OUTFITS: PresetOutfit[] = [
  {
    id: 'tieu-thu-hue',
    title: 'Tiểu Thư Kinh Thành Huế',
    subtitle: 'Nét đài các vương giả với Áo Nhật Bình và Mấn ngũ sắc',
    topId: 'nhat-binh',
    bottomId: 'quan-men-lam',
    accessoryId: 'man-ngu-sac',
    fabricId: 'gam-cung-dinh',
    colorId: 'do-dieu',
    backdropId: 'hoang-thanh-hue',
    presetScore: 98,
  },
  {
    id: 'si-tu-thang-long',
    title: 'Nho Sĩ Thăng Long',
    subtitle: 'Mực thước tao nhã cùng Áo Ngũ Thân tay chẽn và Khăn đóng',
    topId: 'ngu-than',
    bottomId: 'quan-ong-so',
    accessoryId: 'khan-dong',
    fabricId: 'lua-ha-dong',
    colorId: 'xanh-men-lam',
    backdropId: 'van-mieu',
    presetScore: 96,
  },
  {
    id: 'dao-pho-hoi-an',
    title: 'Dạo Phố Thu Hội An',
    subtitle: 'Nhẹ nhàng bay bổng cùng Áo Cách Tân 2026 và Quạt lụa',
    topId: 'cach-tan',
    bottomId: 'vay-xep-ly',
    accessoryId: 'quat-lua',
    fabricId: 'dui-to-tam',
    colorId: 'vang-hoang-tho',
    backdropId: 'hoi-an',
    presetScore: 94,
  },
  {
    id: 'dai-le-te-giao',
    title: 'Lễ Phục Vương Triều',
    subtitle: 'Trang nghiêm uy nghi với Áo Tấc tay thụng và Hài thêu hoàng cung',
    topId: 'ao-tac',
    bottomId: 'quan-ong-so',
    accessoryId: 'hai-theu',
    fabricId: 'gam-cung-dinh',
    colorId: 'tim-hue',
    backdropId: 'hoang-thanh-hue',
    presetScore: 97,
  },
];

export const PROMPT_SUGGESTIONS = [
  'Gợi ý cho tôi một bộ Việt phục đi dạo phố mùa thu lãng mạn tại phố cổ Hội An...',
  'Tôi muốn một bộ trang phục chuẩn nghi lễ cưới cung đình triều Nguyễn sang trọng...',
  'Phối một bộ Áo Ngũ Thân trẻ trung hiện đại để tham gia triển lãm nghệ thuật...',
  'Bộ Việt phục cổ phong thời Lê uy nghi với áo Giao Lĩnh và ngọc bội thắt lưng...',
  'Gợi ý phong cách tiểu thư đài các chụp ảnh tạp chí thời trang tại Hoàng thành Huế...',
];
