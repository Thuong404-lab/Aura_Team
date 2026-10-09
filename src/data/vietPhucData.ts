export interface WardrobeItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'accessory';
  era: 'Triều Nguyễn' | 'Thời Lê' | 'Thời Lý - Trần' | 'Cách Tân' | 'Thời Đông Sơn' | 'Dân Gian' | string;
  gender?: 'nam' | 'nu' | 'unisex';
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
  // 1. Áo Ngũ Thân (Nam)
  {
    id: 'ngu-than',
    name: 'Áo Ngũ Thân Tay Chẽn (Nam)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nam',
    icon: '🧥',
    badge: 'Sĩ Phu Mực Thước',
    summary: 'Dáng áo 5 thân thanh thoát, tay áo ôm gọn gàng, thể hiện cốt cách Nho nhã, lễ giáo khiêm cung.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523453/Ng%C5%A9_Th%C3%A2n_nam.jpg',
    cultureInfo: {
      origin: 'Được Võ Vương Nguyễn Phúc Khoát định hình năm 1744 và vua Minh Mạng phổ biến toàn quốc năm 1836.',
      collarType: 'Cổ đứng lập lĩnh cao 2-3cm ôm khít gáy, 5 chiếc cúc cài chéo về bên phải.',
      symbolism: 'Áo ngũ thân tượng trưng cho tứ thân phụ mẫu và đạo hiếu làm người, đường sống áo mũi gáy thẳng đắn.',
      etiquette: 'Trang phục thường nhật của sĩ phu, quan lại và dân chúng kinh kỳ, dùng linh hoạt từ công sở đến dạ tiệc.',
      pattern: 'Gấm dệt chìm hoa cúc hoặc lụa tơ tằm dệt vân mây cổ điển.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#1B365D',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ngu-than',
  },

  // 2. Áo Ngũ Thân (Nữ)
  {
    id: 'ngu-than-nu',
    name: 'Áo Ngũ Thân Tay Chẽn (Nữ)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👘',
    badge: 'Quý Phái Khuê Các',
    summary: 'Phom dáng 5 thân kín đáo, tà áo lượn cong đáy thúng chữ A thanh tao, tôn vinh nét đoan trang thục nữ.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523459/Ng%C5%A9_Th%C3%A2n_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Mẫu mực thường phục phụ nữ quý tộc và thị dân triều Nguyễn, tiền thân trực tiếp của Áo Dài.',
      collarType: 'Cổ đứng lập lĩnh khép kín, 5 khuy cài bên phải, vạt con bên trong che ngực ý nhị.',
      symbolism: 'Ngũ thân tượng trưng ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) và tứ thân phụ mẫu che chở.',
      etiquette: 'Đi làm, dạo phố, lễ Tết, hội họp gia tộc, chụp ảnh cổ phong.',
      pattern: 'Lụa the hoa, lụa Hà Đông dệt hoa sen hoặc hoa cúc.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ngu-than',
  },

  // 3. Áo Tấc (Nam)
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Nam - Lễ Phục Cung Đình)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nam',
    icon: '🥻',
    badge: 'Đại Lễ Trang Nghiêm',
    summary: 'Áo ngũ thân với tay thụng rộng thênh thang trang nghiêm, lễ phục bắt buộc trong các nghi lễ trang trọng.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523420/%C3%81o_T%E1%BA%A5c_nam.jpg',
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

  // 4. Áo Tấc (Nữ)
  {
    id: 'ao-tac-nu',
    name: 'Áo Tấc (Nữ - Đại Lễ Cố Đô)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '🥻',
    badge: 'Vương Giả Cố Đô',
    summary: 'Lễ phục trang trọng bậc nhất của phụ nữ thời Nguyễn, tay thụng buông rủ uy nghi đài các.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523426/%C3%81o_T%E1%BA%A5c_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Quy chế lễ phục triều Nguyễn cho các dịp cúng tế, hôn lễ và khánh tiết hoàng gia lẫn dân gian.',
      collarType: 'Cổ lập lĩnh truyền thống, cài 5 cúc bên phải, tay thụng chữ nhật buông thướt tha.',
      symbolism: 'Đại diện cho đạo hiếu và sự trang trọng tuyệt đối khi hướng về tiên tổ.',
      etiquette: 'Lễ cưới truyền thống, dâng hương đền chùa, lễ tốt nghiệp, Tết cổ truyền.',
      pattern: 'Gấm cung đình thêu phụng, hoa mẫu đơn và sóng nước Thủy Ba.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#B23A48',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ao-tac',
  },

  // 5. Áo Nhật Bình (Nữ)
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình (Nữ - Hậu Phi Cung Đình)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👘',
    badge: 'Quý Tộc Hoàng Triều',
    summary: 'Cổ áo hình chữ nhật viền thêu hoa văn ngũ hành rực rỡ, trang phục của Hậu phi và Công chúa triều Nguyễn.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523470/Nh%E1%BA%ADt_B%C3%ACnh_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Quy chế trang phục năm Gia Long thứ 6 (1807), đỉnh cao nghệ thuật thêu thùa cung đình Huế.',
      collarType: 'Cổ đóng thành khung hình chữ nhật vuông vức trước ngực (chữ Nhật - 日), 2 dải buộc ngực buông rủ.',
      symbolism: 'Hoa văn Thủy Ba ở gấu áo và dải ngũ sắc ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) ở cửa tay biểu trưng phúc lộc uy nghi.',
      etiquette: 'Dùng cho dịp Khánh tiết, Tế lễ, Hôn lễ cung đình. Bắt buộc giữ tà áo thẳng nghiêm trang.',
      pattern: 'Thêu chim Phụng ngậm ngọc, hoa sen, mây ngũ sắc và dải cúc chữ vạn.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'nhat-binh',
  },

  // 6. Áo Nhật Bình / Cung Đình (Nam)
  {
    id: 'nhat-binh-nam',
    name: 'Áo Nhật Bình / Cung Đình (Nam)',
    category: 'top',
    era: 'Triều Nguyễn',
    gender: 'nam',
    icon: '👑',
    badge: 'Vương Triều Uy Nghi',
    summary: 'Lễ phục cung đình nam giới thời Nguyễn với hoa văn thêu rồng phượng và sắc chỉ hoàng tộc lộng lẫy.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523465/Nh%E1%BA%ADt_B%C3%ACnh_nam.jpg',
    cultureInfo: {
      origin: 'Trang phục triều nghi cung đình Huế dành cho tôn thất và quan lại trong các đại lễ tế tự.',
      collarType: 'Cổ chữ nhật vuông vức viền thêu kim tuyến, viền tay áo phối dải màu ngũ hành.',
      symbolism: 'Đại diện cho quyền uy vương giả, tinh thần trung quân ái quốc và trật tự lễ nghi cung đình.',
      etiquette: 'Các nghi lễ cung đình tái hiện, chụp ảnh cưới hoàng gia, sự kiện văn hóa lịch sử.',
      pattern: 'Long vân đại hội, hoa văn Thủy Ba sóng nước và chữ Thọ đỉnh cao.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#C82333',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'nhat-binh',
  },

  // 7. Áo Giao Lĩnh (Nam)
  {
    id: 'giao-linh',
    name: 'Áo Giao Lĩnh (Nam - Hào Khí Đông A)',
    category: 'top',
    era: 'Thời Lý - Trần',
    gender: 'nam',
    icon: '🥋',
    badge: 'Hào Khí Thăng Long',
    summary: 'Dạng thức cổ áo chéo giao nhau ở ngực uy nghi, dấu ấn rực rỡ của thời kỳ Lý - Trần và Lê Sơ.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523442/Giao_L%C4%A9nh_nam.jpg',
    cultureInfo: {
      origin: 'Xuất hiện từ thời Lý - Trần và phổ biến rộng rãi trong cung đình lẫn dân gian qua nhiều thế kỷ.',
      collarType: 'Cổ chéo vạt trái đè lên vạt phải (hình chữ Y - chữ Kim), dây buộc ẩn bên trong hông.',
      symbolism: 'Tượng trưng cho sự hài hòa âm dương, dáng dấp hào sảng tự do của tinh thần Thăng Long văn hiến.',
      etiquette: 'Thường phục lẫn triều phục của tầng lớp quý tộc, học sĩ thời Hậu Lê.',
      pattern: 'Họa tiết rồng thời Lê, hoa cúc dây uốn lượn phong vị thiền định.',
      notableDynasty: 'Thời Lý - Trần & Lê',
    },
    defaultColorHex: '#F2EDE4',
    secondaryColorHex: '#2D5A46',
    svgLayerType: 'giao-linh',
  },

  // 8. Áo Giao Lĩnh (Nữ)
  {
    id: 'giao-linh-nu',
    name: 'Áo Giao Lĩnh (Nữ - Tràng Vạt Cổ Điển)',
    category: 'top',
    era: 'Thời Lý - Trần',
    gender: 'nu',
    icon: '🥋',
    badge: 'Cổ Phong Thanh Nhã',
    summary: 'Tràng vạt cổ chéo chữ Y buông lơi thênh thang, bên trong dắt yếm đào, toát lên vẻ đẹp thuần khiết Á Đông.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523448/Giao_L%C4%A9nh_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Trang phục phổ biến của phụ nữ Đại Việt thời Lý, Trần, Lê từ dân gian đến cung phủ.',
      collarType: 'Cổ chéo chữ Y (vạt trái đè vạt phải). Cấm kỵ: không cài ngược vạt phải đè vạt trái (Ý chữ Bát).',
      symbolism: 'Ảnh hưởng từ mỹ học Phật giáo thời Lý và khí thế Đông A, nhẹ nhàng thanh thoát.',
      etiquette: 'Đi chùa, lễ hội truyền thống, chụp ảnh cổ phong, sự kiện di sản.',
      pattern: 'Lụa the mỏng nhẹ, dệt hoa cúc thiền hoặc lá bồ đề thanh tịnh.',
      notableDynasty: 'Thời Lý - Trần',
    },
    defaultColorHex: '#1F4E5B',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'giao-linh',
  },

  // 9. Áo Viên Lĩnh (Nam)
  {
    id: 'vien-linh',
    name: 'Áo Viên Lĩnh (Nam - Cổ Tròn Hoàng Triều)',
    category: 'top',
    era: 'Thời Lê',
    gender: 'nam',
    icon: '🏛️',
    badge: 'Quan Triều Bác Học',
    summary: 'Dáng áo cổ tròn cài khuy lệch bên vai phải, trang phục đại thần và nho sĩ học vị cao thời Lê - Nguyễn.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523496/Vi%C3%AAn_L%C4%A9nh_nam.jpg',
    cultureInfo: {
      origin: 'Trang phục triều nghi phổ biến từ triều Lý, Trần đến Lê Trung Hưng.',
      collarType: 'Viên Lĩnh - Cổ tròn bo sát vòng cổ trang nhã, khuy cài ngọc bích lệch bờ vai phải.',
      symbolism: 'Tròn đại diện cho Trời (Trời tròn đất vuông), thể hiện sự công chính minh bạch của người giữ trọng trách.',
      etiquette: 'Dành cho văn quan, tiến sĩ, hội thi đình hoặc nghi thức quốc gia.',
      pattern: 'Bổ tử thêu hạc trắng, mây trời hoặc kỳ lân.',
      notableDynasty: 'Lê Sơ & Lê Trung Hưng',
    },
    defaultColorHex: '#1B2A4A',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vien-linh',
  },

  // 10. Áo Viên Lĩnh (Nữ)
  {
    id: 'vien-linh-nu',
    name: 'Áo Viên Lĩnh (Nữ - Cổ Tròn Khuê Các)',
    category: 'top',
    era: 'Thời Lê',
    gender: 'nu',
    icon: '🏛️',
    badge: 'Khuê Các Đoan Trang',
    summary: 'Cổ tròn khum nhẹ thanh nhã, tôn vinh bờ cổ cao và gương mặt phúc hậu của thiếu nữ quý tộc Thăng Long.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523502/Vi%C3%AAn_L%C4%A9nh_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Trang phục nữ giới cung đình và con cái gia đình danh gia vọng tộc thời Lê.',
      collarType: 'Cổ tròn ôm khít chân cổ, cài khuy ngọc lệch bên phải, đường sống lưng rõ rệt.',
      symbolism: 'Biểu trưng cho nết na thục hạnh, khuôn phép gia giáo lễ nghi.',
      etiquette: 'Yến tiệc trang trọng, lễ nghi ngoại giao cổ, biểu diễn nghệ thuật cổ phong.',
      pattern: 'Gấm dệt vân mây hoa cúc, thêu chỉ tơ óng ả.',
      notableDynasty: 'Thời Lê',
    },
    defaultColorHex: '#582B57',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vien-linh',
  },

  // 11. Áo Đối Khâm
  {
    id: 'doi-kham',
    name: 'Áo Đối Khâm (Nữ Quý Tộc Thời Lê)',
    category: 'top',
    era: 'Thời Lê',
    gender: 'nu',
    icon: '✨',
    badge: 'Phẩm Phục Lê Triều',
    summary: 'Hai vạt áo song song buông rủ xẻ giữa ngực, khoác ngoài lộng lẫy của mệnh phụ phu nhân thời Lê.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523432/%C4%90%E1%BB%91i_Kh%C3%A2m.jpg',
    cultureInfo: {
      origin: 'Quy chuẩn lễ nghi Nho giáo thời Lê Sơ và Lê Trung Hưng đạt tới đỉnh cao phẩm phục.',
      collarType: 'Cổ đối khâm xẻ dọc song song buông rủ trước ngực, vạt áo ngắn gọn hơn áo Phi Phong Minh.',
      symbolism: 'Đại diện cho trật tự lễ giáo Nho gia, địa vị quyền quý của nữ chủ vương gia.',
      etiquette: 'Các đại lễ quốc gia, phục dựng lịch sử, lễ hội văn hóa Thăng Long.',
      pattern: 'Hoa văn mây lửa đặc trưng thời Lê, hoa dây và rồng phượng uyển chuyển.',
      notableDynasty: 'Thời Lê',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'doi-kham',
  },

  // 12. Áo Tứ Thân (Nữ)
  {
    id: 'tu-than',
    name: 'Áo Tứ Thân (Nữ - Dân Gian Kinh Bắc)',
    category: 'top',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '👘',
    badge: 'Dân Gian Kinh Bắc',
    summary: 'Bốn vạt áo thướt tha mềm mại, hai vạt trước buộc nút duyên dáng phối cùng yếm đào và nón ba tầm.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523488/T%E1%BB%A9_Th%C3%A2n_n%E1%BB%AF.jpg',
    cultureInfo: {
      origin: 'Trang phục cổ truyền lâu đời của phụ nữ miền Bắc Việt Nam từ thời Lý - Trần qua thời Lê và Nguyễn.',
      collarType: 'Cổ mở không khuy để lộ yếm đào bên trong, hai vạt trước thắt nút duyên dáng trước bụng.',
      symbolism: 'Bốn vạt tượng trưng cho tứ thân phụ mẫu luôn che chở, đùm bọc người phụ nữ.',
      etiquette: 'Lễ hội làng, hát Quan họ Bắc Ninh, hội Lim, du xuân truyền thống.',
      pattern: 'Lụa the đen khoác ngoài yếm cánh sen đào, thắt lưng lụa xanh.',
      notableDynasty: 'Dân gian miền Bắc',
    },
    defaultColorHex: '#3D342D',
    secondaryColorHex: '#C59B27',
    svgLayerType: 'tu-than',
  },

  // 13. Trang Phục Đông Sơn
  {
    id: 'dong-son',
    name: 'Trang Phục Đông Sơn (Thời Văn Lang - Âu Lạc)',
    category: 'top',
    era: 'Thời Đông Sơn',
    gender: 'unisex',
    icon: '🥁',
    badge: 'Cội Nguồn Văn Minh',
    summary: 'Họa tiết trên trống đồng Đông Sơn, thích nghi khí hậu nhiệt đới sông nước văn minh lúa nước sơ khai.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523437/%C4%90%C3%B4ng_s%C6%A1n.jpg',
    cultureInfo: {
      origin: 'Văn hóa Đông Sơn thiên niên kỷ thứ nhất trước Công nguyên thời các vua Hùng dựng nước.',
      collarType: 'Áo cánh ngắn chui đầu hoặc cài khuy hở ngực vai, thắt lưng bản to, thắt khăn lông chim.',
      symbolism: 'Biểu trưng cho tinh thần bất khuất, sự gắn kết cộng đồng sông nước và tín ngưỡng thờ Thần Mặt Trời.',
      etiquette: 'Giỗ Tổ Hùng Vương, sân khấu lịch sử cội nguồn, biểu diễn văn hóa Đông Sơn.',
      pattern: 'Chim Lạc bay, vòng xoáy mặt trời, người chèo thuyền và hươu sao Đông Sơn.',
      notableDynasty: 'Thời Văn Lang – Âu Lạc',
    },
    defaultColorHex: '#8C5835',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'dong-son',
  },

  // 14. Áo Bà Ba (Nữ)
  {
    id: 'ao-ba-ba-nu',
    name: 'Áo Bà Ba (Nữ - Duyên Dáng Nam Bộ)',
    category: 'top',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '🌾',
    badge: 'Hồn Quê Nam Bộ',
    summary: 'Áo xẻ tà 2 bên hông duyên dáng, cúc bấm ôm nhẹ eo, đi cùng nón lá và khăn rằn mộc mạc sông nước.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523413/%C3%81o_b%C3%A0_ba_n%E1%BB%AF.png',
    cultureInfo: {
      origin: 'Xuất hiện từ thế kỷ 19 ở Nam Bộ, gắn liền với công cuộc khai phá miền sông nước đồng bằng.',
      collarType: 'Cổ tròn xẻ giữa ngực, cài hàng cúc bấm dọc thân trước, xẻ tà hai bên hông.',
      symbolism: 'Nét đẹp bình dị, khỏe khoắn nhưng duyên dáng dịu dàng của người phụ nữ phương Nam.',
      etiquette: 'Sinh hoạt đời thường, du lịch miền Tây sông nước, lễ hội văn hóa dân gian.',
      pattern: 'Lụa tơ sống, gấm trơn hoặc vải ú hoa nhã nhặn.',
      notableDynasty: 'Dân gian Nam Bộ thế kỷ XIX - XX',
    },
    defaultColorHex: '#2E6F56',
    secondaryColorHex: '#FAF7F0',
    svgLayerType: 'ao-ba-ba',
  },

  // 15. Áo Bà Ba (Nam)
  {
    id: 'ao-ba-ba-nam',
    name: 'Áo Bà Ba (Nam - Hào Sảng Nam Bộ)',
    category: 'top',
    era: 'Dân Gian',
    gender: 'nam',
    icon: '🌾',
    badge: 'Hào Sảng Sông Nước',
    summary: 'Thân áo suông thoải mái, hai túi vuông phía trước tiện dụng, biểu tượng tính cách hào sảng trượng nghĩa.',
    imageUrl: 'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523407/%C3%81o_B%C3%A0_Ba_nam.jpg',
    cultureInfo: {
      origin: 'Trang phục gắn liền với đời sống lao động và tính cách phóng khoáng của nam giới Nam Bộ.',
      collarType: 'Cổ tròn đơn giản xẻ giữa ngực, cúc bấm hoặc cúc cài khuy vải, hai túi vuông dưới vạt.',
      symbolism: 'Sự chân chất, khẳng khái, cần cù và hòa hợp với thiên nhiên sông nước.',
      etiquette: 'Hội hè miền sông nước, du lịch sinh thái, nghệ thuật đờn ca tài tử.',
      pattern: 'Vải đũi đen, nâu sồng hoặc lụa trơn màu trầm ấm.',
      notableDynasty: 'Dân gian Nam Bộ',
    },
    defaultColorHex: '#3D342D',
    secondaryColorHex: '#FAF7F0',
    svgLayerType: 'ao-ba-ba',
  },
];

export const BOTTOMS: WardrobeItem[] = [
  // 1. Quần Ống Sớ Lụa Bạch (Unisex - Triều Nguyễn)
  {
    id: 'quan-ong-so',
    name: 'Quần Ống Sớ Lụa Bạch',
    category: 'bottom',
    era: 'Triều Nguyễn',
    gender: 'unisex',
    icon: '👖',
    badge: 'Chuẩn Mực Cổ Điển',
    summary: 'Quần lụa ống rộng màu trắng tinh tế, chuẩn mực không thể thiếu khi kết hợp cùng áo ngũ thân và áo tấc.',
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy thức mặc Việt phục triều Nguyễn: Quần trắng hoặc quần cùng màu áo.',
      collarType: 'Cạp quần luồn dải rút lụa rộng rãi.',
      symbolism: 'Màu trắng biểu tượng cho sự thanh bạch, trong sáng và giữ gìn nếp nhà gia phong.',
      etiquette: 'Phù hợp mọi nghi lễ trang nghiêm từ dân sự đến cung phủ, dùng chung cho cả nam lẫn nữ.',
      pattern: 'Vải lụa Hà Đông dệt vân mây hoặc lụa đũi mờ.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#FAF7F0',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-ong-so',
  },

  // 2. Quần Men Lam Cung Đình (Unisex - Triều Nguyễn)
  {
    id: 'quan-men-lam',
    name: 'Quần Lụa Men Lam Cung Đình',
    category: 'bottom',
    era: 'Triều Nguyễn',
    gender: 'unisex',
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

  // 3. Chân Váy Xếp Ly Thêu Thủy Ba (Nữ - Thời Lý/Trần/Lê)
  {
    id: 'vay-xep-ly',
    name: 'Chân Váy Xếp Ly Thêu Thủy Ba (Nữ)',
    category: 'bottom',
    era: 'Thời Lê',
    gender: 'nu',
    icon: '👗',
    badge: 'Cổ Phong Yêu Kiều',
    summary: 'Váy xếp nhiều nếp ly xòe mềm mại, gấu thêu sóng nước và đá núi mang đậm mỹ học cổ xưa của nữ giới.',
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Phổ biến thời Lý - Trần và Lê khi phụ nữ thường mặc váy quây xếp ly ngoài quần.',
      collarType: 'Cạp váy buộc nơ lụa thêu tơ.',
      symbolism: 'Thủy Ba (sóng nước tầng tầng) mang lời chúc may mắn dồi dào, vạn sự hanh thông.',
      etiquette: 'Phối cùng Áo Giao Lĩnh nữ, Áo Viên Lĩnh nữ hoặc Áo Đối Khâm.',
      pattern: 'Họa tiết Thủy Ba Cổ Điển thêu chỉ ngũ sắc.',
      notableDynasty: 'Thời Lý - Trần & Lê',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vay-xep-ly',
  },

  // 4. Quần Gấm Vàng Hoàng Kim (Unisex - Triều Nguyễn)
  {
    id: 'quan-gam-vang',
    name: 'Quần Gấm Vàng Hoàng Kim',
    category: 'bottom',
    era: 'Triều Nguyễn',
    gender: 'unisex',
    icon: '✨',
    badge: 'Quang Vinh Quyền Quý',
    summary: 'Sắc vàng hoàng thổ rực rỡ dệt hoa văn chữ Vạn chìm, mang lại khí chất vương tộc uy nghi.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Sắc phục dành riêng cho tôn thất hoàng triều triều Nguyễn.',
      collarType: 'Dáng ống sớ suông rộng.',
      symbolism: 'Hoàng thổ trung ương ngũ hành, tượng trưng cho sự vững chãi và phú quý trọn vẹn.',
      etiquette: 'Lễ cưới cung đình, đại lễ thăng tiến của cả nam và nữ quý tộc.',
      pattern: 'Dệt chìm chữ Vạn hoặc Bát Bửu.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#D4AF37',
    secondaryColorHex: '#8B1E1E',
    svgLayerType: 'quan-gam-vang',
  },

  // 5. Quần Lụa Đỏ Điều Cung Đình (Nữ - Triều Nguyễn)
  {
    id: 'quan-do-dieu-nu',
    name: 'Quần Lụa Đỏ Điều Cung Đình (Nữ)',
    category: 'bottom',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👖',
    badge: 'Đại Hỷ Cung Đình',
    summary: 'Quần lụa sắc đỏ chu sa may ống rộng, phối hợp hoàn mỹ cùng Áo Nhật Bình và Áo Tấc nữ trong đại lễ cưới.',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy chế lễ phục đại hỷ của công chúa và mệnh phụ triều Nguyễn.',
      collarType: 'Ống sớ suông rộng may kép 2 lớp lụa tơ sống.',
      symbolism: 'Màu đỏ chu sa tượng trưng cho sự may mắn, son sắt và hân hoan hỷ sự.',
      etiquette: 'Phối cùng Áo Nhật Bình nữ hoặc Áo Tấc nữ trong lễ thành hôn và khánh tiết.',
      pattern: 'Lụa the hoa dệt chìm hoa cúc hoặc hạt cườm.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-ong-so',
  },

  // 6. Váy Đũi Đen Dân Gian (Nữ - Kinh Bắc Áo Tứ Thân)
  {
    id: 'vay-den-kinh-bac-nu',
    name: 'Váy Đũi Đen Dân Gian (Nữ)',
    category: 'bottom',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '👗',
    badge: 'Kinh Bắc Chuẩn Mực',
    summary: 'Váy đầm lĩnh/đũi đen tuyền buông suông mộc mạc, hạ y kinh điển đi cùng Áo Tứ Thân liền chị Kinh Bắc.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục hạ y cổ truyền ngàn năm của phụ nữ đồng bằng Bắc Bộ từ thời Trần qua Lê đến Nguyễn.',
      collarType: 'Cạp váy quấn thắt lưng dải lụa xanh hoặc hồng đào.',
      symbolism: 'Màu đen đầm lĩnh biểu trưng cho sự kín đáo, đức hy sinh và nét mặn mà đằm thắm của người phụ nữ.',
      etiquette: 'Bắt buộc khi mặc Áo Tứ Thân trong hội Lim, hát Quan họ, du xuân trẩy hội.',
      pattern: 'Vải đầm lĩnh đen nhánh hoặc đũi mộc nhuộm củ nâu.',
      notableDynasty: 'Dân gian miền Bắc',
    },
    defaultColorHex: '#1D1B1A',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vay-den',
  },

  // 7. Quần Bà Ba Lụa Đen (Nữ - Nam Bộ)
  {
    id: 'quan-ba-ba-den-nu',
    name: 'Quần Bà Ba Lụa Đen (Nữ)',
    category: 'bottom',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '👖',
    badge: 'Duyên Dáng Nam Bộ',
    summary: 'Quần lụa đen ống suông rủ mềm mại, cạp chun thoải mái, nét đẹp thùy mị đi kèm Áo Bà Ba nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục phổ biến của phụ nữ Nam Bộ từ thế kỷ XIX gắn liền với vẻ đẹp chân chất sông nước.',
      collarType: 'Cạp chun may khéo léo, ống suông rộng thoải mái khi di chuyển trên thuyền ghe.',
      symbolism: 'Sự tháo vát, nết na và tươi tắn của cô gái miệt vườn phương Nam.',
      etiquette: 'Đi kèm Áo Bà Ba nữ trong các dịp dạo chơi, biểu diễn đờn ca tài tử, lễ hội dân gian.',
      pattern: 'Lụa satin đen mờ hoặc vải ú đen tuyền.',
      notableDynasty: 'Dân gian Nam Bộ',
    },
    defaultColorHex: '#1B1A19',
    secondaryColorHex: '#FAF7F0',
    svgLayerType: 'quan-ba-ba',
  },

  // 8. Quần Bà Ba Đũi Đen (Nam - Nam Bộ)
  {
    id: 'quan-ba-ba-den-nam',
    name: 'Quần Bà Ba Đũi Đen (Nam)',
    category: 'bottom',
    era: 'Dân Gian',
    gender: 'nam',
    icon: '👖',
    badge: 'Hào Sảng Nam Bộ',
    summary: 'Quần đũi đen ống suông bền chắc, mộc mạc, biểu tượng lao động và đời sống hào sảng của nam giới Nam Bộ.',
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang phục lao động và sinh hoạt cổ truyền của đàn ông phương Nam qua nhiều thế hệ.',
      collarType: 'Ống suông thẳng may rộng rãi, đũng quần thoải mái vận động.',
      symbolism: 'Tinh thần khẩn hoang, trượng nghĩa, phóng khoáng và cần cù.',
      etiquette: 'Đi cùng Áo Bà Ba nam trong các lễ hội sông nước, biểu diễn văn hóa Nam Bộ.',
      pattern: 'Vải đũi đen hoặc sợi bông thô dệt thủ công.',
      notableDynasty: 'Dân gian Nam Bộ',
    },
    defaultColorHex: '#211F1D',
    secondaryColorHex: '#FAF7F0',
    svgLayerType: 'quan-ba-ba',
  },

  // 9. Quần Lĩnh Đen Đại Việt (Nam - Lý/Trần/Lê)
  {
    id: 'quan-linh-dai-viet-nam',
    name: 'Quần Lĩnh Đen Đại Việt (Nam)',
    category: 'bottom',
    era: 'Thời Lê',
    gender: 'nam',
    icon: '👖',
    badge: 'Quan Triều Mực Thước',
    summary: 'Quần lĩnh tía/đen ống rộng thụng mực thước thời Lý - Trần - Lê, đi cùng Áo Giao Lĩnh và Áo Viên Lĩnh nam.',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy thức hạ y dành cho quan viên, sĩ tử và nam giới quý tộc Đại Việt thời Lê.',
      collarType: 'Ống thụng rộng rãi, dải rút lụa bản to buộc giấu nếp áo.',
      symbolism: 'Phong thái đĩnh đạc, khoan thai, tôn nghiêm của bậc trượng phu.',
      etiquette: 'Phối cùng Áo Giao Lĩnh nam, Áo Viên Lĩnh nam trong triều nghi và tế lễ.',
      pattern: 'Lĩnh Bưởi dệt hoa chìm hoặc lụa đen tuyết nhung.',
      notableDynasty: 'Thời Lý - Trần & Lê',
    },
    defaultColorHex: '#181E29',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'quan-ong-so',
  },

  // 10. Thường Xếp Tầng Cung Đình (Nữ - Lý/Trần/Lê)
  {
    id: 'thuong-dai-viet-nu',
    name: 'Thường Xếp Tầng Cung Đình (Nữ)',
    category: 'bottom',
    era: 'Thời Lý - Trần',
    gender: 'nu',
    icon: '👗',
    badge: 'Đài Các Cổ Phong',
    summary: 'Thường quấn nhiều lớp bồng bềnh bằng lụa quý viền hoa cúc, hạ y quý phái của mệnh phụ phu nhân thời Lý - Lê.',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy chế trang phục quý tộc thời Lý - Trần: Phụ nữ mặc thường xếp nếp ngoài quần lụa mỏng.',
      collarType: 'Dải thắt lưng đai gấm thắt nơ buông dài phía trước bụng.',
      symbolism: 'Nét thướt tha uyển chuyển như mây trời, vẻ tôn nghiêm quyền quý chốn cung phủ.',
      etiquette: 'Phối cùng Áo Giao Lĩnh nữ, Áo Đối Khâm hoặc Áo Viên Lĩnh nữ.',
      pattern: 'Lụa the thêu hoa cúc thiền và hoa sen uốn lượn.',
      notableDynasty: 'Thời Lý - Trần',
    },
    defaultColorHex: '#8C2738',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'vay-xep-ly',
  },

  // 11. Khố Thổ Cẩm Đông Sơn (Nam - Thời Đông Sơn)
  {
    id: 'kho-dong-son-nam',
    name: 'Khố Thổ Cẩm Đông Sơn (Nam)',
    category: 'bottom',
    era: 'Thời Đông Sơn',
    gender: 'nam',
    icon: '🥁',
    badge: 'Chiến Binh Văn Lang',
    summary: 'Khố dệt thổ cẩm thêu hoa văn hình học, sóng nước và chim Lạc cổ sơ của nam giới Lạc Việt.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Ghi nhận trên hoa văn chạm khắc trống đồng Đông Sơn thiên niên kỷ thứ nhất trước Công nguyên.',
      collarType: 'Khố quấn ngang hông có dải buông dài trước và sau chạm hoa văn chữ S và răng cưa.',
      symbolism: 'Ý chí kiên cường, sức mạnh hòa hợp thiên nhiên của cư dân sông nước thời các vua Hùng.',
      etiquette: 'Mặc cùng Trang Phục Đông Sơn trong các lễ hội Giỗ Tổ Hùng Vương, sân khấu lịch sử cội nguồn.',
      pattern: 'Hoa văn chim Lạc bay, vòng tròn tiếp tuyến và sóng nước Đông Sơn.',
      notableDynasty: 'Thời Văn Lang – Âu Lạc',
    },
    defaultColorHex: '#724122',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'dong-son',
  },

  // 12. Váy Quấn Thổ Cẩm Đông Sơn (Nữ - Thời Đông Sơn)
  {
    id: 'vay-quan-dong-son-nu',
    name: 'Váy Quấn Thổ Cẩm Đông Sơn (Nữ)',
    category: 'bottom',
    era: 'Thời Đông Sơn',
    gender: 'nu',
    icon: '👗',
    badge: 'Thiếu Nữ Âu Lạc',
    summary: 'Váy quấn thổ cẩm dệt chỉ mộc hoa văn chim Lạc và vòng xoáy mặt trời trên trống đồng của phụ nữ Âu Lạc.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Hình ảnh phụ nữ giã gạo và múa hát khắc họa trên thạp đồng Đào Thịnh và trống đồng Ngọc Lũ.',
      collarType: 'Váy quấn ngang eo dài ngang bắp chân, thắt dây thổ cẩm đính chuông đồng.',
      symbolism: 'Sự thuần hậu, gắn kết gia đình và tinh thần lao động cần cù thời bình minh lịch sử dân tộc.',
      etiquette: 'Đi kèm Trang phục Đông Sơn trong các dịp tái hiện văn hóa cội nguồn.',
      pattern: 'Họa tiết hươu sao, chim Lạc và mặt trời 14 tia.',
      notableDynasty: 'Thời Văn Lang – Âu Lạc',
    },
    defaultColorHex: '#804928',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'dong-son',
  },

  // 13. Quần Tây Cắt May Cách Tân (Unisex)
  {
    id: 'quan-tay-hien-dai',
    name: 'Quần Tây Cắt May Cách Tân',
    category: 'bottom',
    era: 'Cách Tân',
    gender: 'unisex',
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
  // 1. Mấn đội đầu (Nữ - Triều Nguyễn)
  {
    id: 'man-doi-dau',
    name: 'Mấn Đội Đầu Cung Đình (Nữ)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👑',
    badge: 'Quý Phái Cổ Phong',
    summary: 'Mấn đội đầu truyền thống quấn nhiều vòng thanh tú, biểu tượng của sự đoan trang, đài các.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Áo ngũ thân quy chuẩn đi kèm mấn tròn quấn nhiều vòng, tạo nét trang trọng cho diện mạo.',
      collarType: 'Mấn tròn vấn tóc ôm sát vầng trán.',
      symbolism: 'Tôn vinh gương mặt phúc hậu, nết na và cốt cách lễ giáo của người phụ nữ Việt xưa.',
      etiquette: 'Đi kèm áo ngũ thân tay chẽn nữ, áo tấc nữ trong mọi dịp hội lễ hoặc chụp ảnh kỷ niệm.',
      pattern: 'Gấm trơn dệt tuyết nhung hoặc lụa đen huyền bí.',
      notableDynasty: 'Nhà Nguyễn',
    },
    defaultColorHex: '#1B2A4A',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'man-ngu-sac',
  },

  // 2. Mấn Thêu Ngũ Sắc Đính Ngọc (Nữ - Triều Nguyễn)
  {
    id: 'man-ngu-sac',
    name: 'Mấn Thêu Ngũ Sắc Đính Ngọc (Nữ)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👑',
    badge: 'Vương Giả Cung Đình',
    summary: 'Mấn quấn bằng lụa ngũ sắc thêu phụng lượn hoa sen, đỉnh đính ngọc bích, kết hợp hoàn mỹ cùng Áo Nhật Bình.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trâm cài và khăn vành dây/mấn phát triển từ quy chế trang phục hoàng tộc triều Nguyễn.',
      collarType: 'Đội ngay ngắn trên đỉnh đầu, ôm nhẹ vầng trán.',
      symbolism: 'Ngũ sắc tương ứng 5 phương trời đất ban phước, ngọc bích biểu trưng cho đức hạnh vẹn toàn.',
      etiquette: 'Bắt buộc khi diện Áo Nhật Bình nữ trong đại lễ cưới hoặc khánh tiết.',
      pattern: 'Thêu chim phượng ngậm ngọc và hoa mẫu đơn.',
      notableDynasty: 'Triều Nguyễn (Nội cung)',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'man-ngu-sac',
  },

  // 3. Khăn Đóng Lụa Đen (Nam - Triều Nguyễn)
  {
    id: 'khan-dong',
    name: 'Khăn Đóng Lụa Đen 7 Nếp (Nam)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nam',
    icon: '🎩',
    badge: 'Sĩ Phu Nho Nhã',
    summary: 'Khăn xếp quấn hình chữ Nhân trước trán, nét đẹp mực thước kinh điển của nam giới Việt xưa.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Vật bất ly thân khi ra ngoài của nam nhân Việt từ thời chúa Nguyễn Phúc Khoát.',
      collarType: 'Vành khăn quấn 7 vòng xếp nếp đều tăm tắp tạo hình chữ Nhân (人).',
      symbolism: 'Nếp xếp chữ Nhân trước trán nhắc nhở người đội luôn lấy chữ Nhân làm đầu trong xử thế.',
      etiquette: 'Đi kèm Áo Ngũ Thân nam, Áo Tấc nam và Áo Nhật Bình nam trong mọi nghi lễ.',
      pattern: 'Lụa the đen hoặc gấm the thêu hoa cúc.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#1A1817',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'khan-dong',
  },

  // 4. Khăn Vành Dây Hoàng Cung (Nữ - Triều Nguyễn)
  {
    id: 'khan-vanh-day-nu',
    name: 'Khăn Vành Dây Hoàng Cung (Nữ)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👑',
    badge: 'Chính Cung Vương Hậu',
    summary: 'Khăn gấm tơ dài quấn thành vành tròn đều đặn trên đỉnh đầu, lễ phục tối thượng cùng Áo Nhật Bình triều Nguyễn.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy chế lễ phục hoàng hậu, công chúa và mệnh phụ phu nhân triều Nguyễn.',
      collarType: 'Dải lụa dài hơn 8m quấn nhiều vòng khít khao tạo thành vành mũ trang trọng.',
      symbolism: 'Đại diện cho vị thế mẫu nghi thiên hạ, đức hạnh cao quý nhất trong nội cung.',
      etiquette: 'Chuyên dùng cho đại lễ Hôn phối hoàng tộc, Tế lễ miếu đường.',
      pattern: 'Gấm vàng hoàng kim dệt hoa dây hoặc lụa điều dệt chữ Thọ.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#B8860B',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'man-ngu-sac',
  },

  // 5. Thẻ Bài Ngà & Dây Lụa Cung Đình (Nam - Triều Nguyễn)
  {
    id: 'the-bai-hoang-cung',
    name: 'Thẻ Bài Ngà & Dây Lụa Cung Đình (Nam)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nam',
    icon: '📜',
    badge: 'Phẩm Hàm Triều Đình',
    summary: 'Thẻ bài chạm khắc phẩm hàm quan lại kèm dải tua rua ngũ sắc buông bên hông khi diện Áo Tấc / Nhật Bình nam.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Quy định phẩm phục triều đình Huế: Quan lại văn võ khi vào chầu phải đeo thẻ bài chỉ định phẩm trật.',
      collarType: 'Đeo bên hông ngực áo hoặc đính cùng thắt lưng lụa.',
      symbolism: 'Đại diện cho tinh thần phụng sự triều đình, trách nhiệm và liêm chính của quan lại.',
      etiquette: 'Phối cùng Áo Tấc nam hoặc Áo Nhật Bình nam đại lễ.',
      pattern: 'Chạm khắc hoa văn rồng mây và triện chữ Hán.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#FAF6ED',
    secondaryColorHex: '#8B1E1E',
    svgLayerType: 'ngoc-boi',
  },

  // 6. Ngọc Bội Thắt Lưng Chạm Rồng (Unisex - Thời Lê & Nguyễn)
  {
    id: 'ngoc-boi',
    name: 'Ngọc Bội Thắt Lưng Chạm Rồng (Unisex)',
    category: 'accessory',
    era: 'Thời Lê',
    gender: 'unisex',
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

  // 7. Mũ Phốc Đầu / Ô Sa Quan Lại (Nam - Thời Lê)
  {
    id: 'mu-phoc-dau-nam',
    name: 'Mũ Phốc Đầu Ô Sa Quan Lại (Nam)',
    category: 'accessory',
    era: 'Thời Lê',
    gender: 'nam',
    icon: '🎩',
    badge: 'Triều Nghi Bác Học',
    summary: 'Mũ cánh chuồn sơn then đen bọc lụa kết cấu nghiêm trang, trang phục đầu bắt buộc khi mặc Áo Viên Lĩnh nam.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Phẩm phục quan lại triều Lý, Trần và đạt đến quy chế nghiêm cẩn nhất thời Lê Sơ.',
      collarType: 'Thân mũ ôm khít búi tóc, phía sau có hai cánh chuồn ngang hoặc vút cong biểu thị phẩm hàm.',
      symbolism: 'Trí tuệ minh triết, kỷ cương phép nước và phẩm cách công chính của đại thần.',
      etiquette: 'Bắt buộc khi diện Áo Viên Lĩnh nam trong các nghi lễ quốc gia hoặc sân khấu phục dựng.',
      pattern: 'Lụa the đen đan sợi mây hoặc phết sơn then bóng nhẹ.',
      notableDynasty: 'Thời Lê Sơ & Lê Trung Hưng',
    },
    defaultColorHex: '#141312',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'khan-dong',
  },

  // 8. Đai Bác Khiệp & Thắt Lưng Ngọc (Nam - Thời Lê)
  {
    id: 'dai-bac-khiep-nam',
    name: 'Đai Bác Khiệp & Thắt Lưng Ngọc (Nam)',
    category: 'accessory',
    era: 'Thời Lê',
    gender: 'nam',
    icon: '🥋',
    badge: 'Vương Giả Uy Nghi',
    summary: 'Đai lụa cứng bọc gấm nẹp bản đồng hoặc ngọc quý thắt ngang eo, tăng thêm vẻ uy dũng đĩnh đạc khi diện Áo Giao Lĩnh / Viên Lĩnh.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Đai triều phục thời Lý - Trần - Lê dùng để cố định thân áo dài rộng và biểu thị cấp bậc quan chế.',
      collarType: 'Đai tròn cứng quây ngang hông dưới ngực, đính các phiến ngọc hoặc đồng mạ vàng.',
      symbolism: 'Đại diện cho uy quyền quân vương và trật tự kỷ cương tôn nghiêm của vương triều.',
      etiquette: 'Phối cùng Áo Giao Lĩnh nam và Áo Viên Lĩnh nam.',
      pattern: 'Hoa văn mây lửa chạm khắc tinh xảo trên phiến đai.',
      notableDynasty: 'Thời Lê',
    },
    defaultColorHex: '#8B2222',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'ngoc-boi',
  },

  // 9. Trâm Cài Tóc Điểm Thúy & Hoa Mai (Nữ - Thời Lý/Trần/Lê)
  {
    id: 'tram-cai-diem-thuy-nu',
    name: 'Trâm Cài Tóc Điểm Thúy & Hoa Mai (Nữ)',
    category: 'accessory',
    era: 'Thời Lý - Trần',
    gender: 'nu',
    icon: '✨',
    badge: 'Khuê Các Quý Tộc',
    summary: 'Trâm bạc mạ vàng gắn ngọc trai và hoa mai, phụ kiện cài tóc búi cao đi kèm Áo Giao Lĩnh & Áo Đối Khâm nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Trang sức kim hoàn cung đình thời Lý - Trần được tìm thấy nhiều tại Hoàng thành Thăng Long.',
      collarType: 'Cài vào búi tóc bới cao thanh nhã của thiếu nữ quý tộc.',
      symbolism: 'Hoa mai tượng trưng cho khí tiết thanh cao, ngọc trai mang lại sự bình an tinh khiết.',
      etiquette: 'Phối cùng Áo Giao Lĩnh nữ, Áo Đối Khâm và Áo Viên Lĩnh nữ.',
      pattern: 'Chạm lộng hình chim phượng ngậm hoa mai uốn lượn.',
      notableDynasty: 'Thời Lý - Trần',
    },
    defaultColorHex: '#D4AF37',
    secondaryColorHex: '#1F4E5B',
    svgLayerType: 'ngoc-boi',
  },

  // 10. Nón Ba Tầm Quai Thao (Nữ - Dân Gian Kinh Bắc)
  {
    id: 'non-ba-tam-nu',
    name: 'Nón Ba Tầm Quai Thao (Nữ)',
    category: 'accessory',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '👒',
    badge: 'Hồn Quê Quan Họ',
    summary: 'Nón lá gồi tròn dẹt và quai thao dệt bằng sợi tơ tằm buông rủ ngực, phụ kiện bất ly thân của Áo Tứ Thân Kinh Bắc.',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Chiếc nón truyền thống đặc trưng của phụ nữ miền Bắc Việt Nam qua hàng trăm năm lịch sử.',
      collarType: 'Mặt nón phẳng tròn rộng che bóng mát, hai dải quai thao bằng sợi tơ tằm buông dài trước ngực.',
      symbolism: 'Nét duyên dáng, e ấp nhưng đầy tình tứ của người con gái Quan họ xứ Kinh Bắc.',
      etiquette: 'Bắt buộc khi diện Áo Tứ Thân trong hội Lim, ngày hội văn hóa truyền thống.',
      pattern: 'Lá gồi trắng muốt khâu chỉ guột tinh xảo, quai thao tết nút hoa sen.',
      notableDynasty: 'Dân gian miền Bắc',
    },
    defaultColorHex: '#CBB693',
    secondaryColorHex: '#D83A56',
    svgLayerType: 'non-ba-tam',
  },

  // 11. Khăn Mỏ Quạ & Yếm Đào (Nữ - Dân Gian Kinh Bắc)
  {
    id: 'khan-mo-qua-nu',
    name: 'Khăn Mỏ Quạ & Yếm Đào (Nữ)',
    category: 'accessory',
    era: 'Dân Gian',
    gender: 'nu',
    icon: '🧣',
    badge: 'Nét Duyên Bắc Bộ',
    summary: 'Khăn the đen gập hình chóp nhọn mỏ quạ ôm quanh trán, tôn nét duyên thùy mị phúc hậu của phụ nữ Kinh Bắc.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Lối vấn tóc và chít khăn mỏ quạ truyền đời của phụ nữ nông thôn và thị dân miền Bắc.',
      collarType: 'Gập chéo chiếc khăn vuông màu đen tạo mũi nhọn hình mỏ chim quạ ngay chính giữa trán.',
      symbolism: 'Làm nổi bật khuôn mặt trái xoan phúc hậu, nụ cười chúm chím và nét đoan trang thùy mị.',
      etiquette: 'Phối hoàn hảo cùng Áo Tứ Thân nữ trong mọi sinh hoạt hội hè dân gian.',
      pattern: 'Vải the đen hoặc lụa đen mềm mại.',
      notableDynasty: 'Dân gian miền Bắc',
    },
    defaultColorHex: '#1A1816',
    secondaryColorHex: '#D83A56',
    svgLayerType: 'man-ngu-sac',
  },

  // 12. Khăn Rằn Nam Bộ (Unisex - Dân Gian Nam Bộ)
  {
    id: 'khan-ran-nam-bo',
    name: 'Khăn Rằn Nam Bộ (Unisex)',
    category: 'accessory',
    era: 'Dân Gian',
    gender: 'unisex',
    icon: '🧣',
    badge: 'Mộc Mạc Sông Nước',
    summary: 'Khăn rằn dệt caro đen trắng mộc mạc quấn cổ hoặc vắt vai, phụ kiện biểu tượng của Áo Bà Ba cả nam lẫn nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Gắn bó keo sơn với người dân Nam Bộ từ thời kỳ mở cõi đồng bằng sông Cửu Long.',
      collarType: 'Quấn nhẹ quanh cổ, vắt qua vai hoặc quấn gọn gàng trên đầu.',
      symbolism: 'Sự kiên cường, bất khuất, chân chất và tình nghĩa thủy chung của con người phương Nam.',
      etiquette: 'Phối cùng Áo Bà Ba nam và Áo Bà Ba nữ trong mọi dịp sinh hoạt và lễ hội.',
      pattern: 'Dệt sợi bông kẻ ô vuông caro đen trắng hoặc đỏ trắng truyền thống.',
      notableDynasty: 'Dân gian Nam Bộ',
    },
    defaultColorHex: '#252525',
    secondaryColorHex: '#FAF7F0',
    svgLayerType: 'khan-ran',
  },

  // 13. Nón Lá Chóp Truyền Thống (Unisex - Dân Gian Nam Bộ)
  {
    id: 'non-la-nam-bo',
    name: 'Nón Lá Chóp Truyền Thống (Unisex)',
    category: 'accessory',
    era: 'Dân Gian',
    gender: 'unisex',
    icon: '👒',
    badge: 'Biểu Tượng Xứ Sở',
    summary: 'Nón lá chóp nhọn đan nan tre chuốt mỏng chằm chỉ tơ, che nắng che mưa duyên dáng đi cùng Áo Bà Ba.',
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Chiếc nón lá che mưa nắng thân thương của người Việt từ Bắc chí Nam.',
      collarType: 'Chóp nhọn thanh thoát, quai nón bằng lụa mềm thắt nơ dưới cằm.',
      symbolism: 'Vẻ đẹp thuần hậu, bình dị, kiên trì của hồn quê đất Việt.',
      etiquette: 'Phối cùng Áo Bà Ba nam hoặc nữ khi dạo bước ngắm cảnh sông nước.',
      pattern: 'Lá buông hoặc lá cọ trắng sáng chằm 16 vành nan tre chuẩn mực.',
      notableDynasty: 'Dân gian Việt Nam',
    },
    defaultColorHex: '#D7C7A3',
    secondaryColorHex: '#8A734D',
    svgLayerType: 'non-ba-tam',
  },

  // 14. Mũ Lông Chim Lạc Đông Sơn (Unisex - Thời Đông Sơn)
  {
    id: 'mu-long-chim-dong-son',
    name: 'Mũ Lông Chim Lạc Đông Sơn (Unisex)',
    category: 'accessory',
    era: 'Thời Đông Sơn',
    gender: 'unisex',
    icon: '🪶',
    badge: 'Hào Khí Lạc Việt',
    summary: 'Vành mũ bện sợi vỏ cây cắm hàng lông chim Lạc vươn cao, biểu tượng tín ngưỡng sùng bái thần Mặt Trời thời Văn Lang.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Hình ảnh cư dân nhảy múa và chèo thuyền đội mũ lông chim khắc trên tang trống đồng Ngọc Lũ và Hoàng Hạ.',
      collarType: 'Vòng đai ôm sát trán, cắm các nhánh lông chim Lạc vút cao kiêu hãnh.',
      symbolism: 'Ước vọng vươn lên bầu trời, hòa nhập với vũ trụ và thần Mặt Trời của tổ tiên Âu Lạc.',
      etiquette: 'Đi kèm Trang phục Đông Sơn nam hoặc nữ trong các đại lễ lịch sử cội nguồn.',
      pattern: 'Chạm khắc hoa văn vạch chéo và mắt chim Lạc.',
      notableDynasty: 'Thời Văn Lang – Âu Lạc',
    },
    defaultColorHex: '#784421',
    secondaryColorHex: '#F59E0B',
    svgLayerType: 'khan-dong',
  },

  // 15. Vòng Tay Đồng & Hộ Tâm Phiến (Unisex - Thời Đông Sơn)
  {
    id: 'vong-dong-dong-son',
    name: 'Vòng Tay Đồng & Hộ Tâm Phiến (Unisex)',
    category: 'accessory',
    era: 'Thời Đông Sơn',
    gender: 'unisex',
    icon: '🛡️',
    badge: 'Cổ Vật Cội Nguồn',
    summary: 'Vòng đeo tay và tấm hộ tâm đúc bằng đồng chạm khắc hoa văn sóng nước và mặt trời, bảo hộ khí tiết Âu Lạc.',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Hiện vật đồng thau đỉnh cao của văn hóa Đông Sơn khai quật tại Thanh Hóa và Phú Thọ.',
      collarType: 'Đeo ở cổ tay và thắt đai trước ngực che chắn tim.',
      symbolism: 'Khí phách dũng cảm, hộ mệnh xua đuổi tà khí và tôn vinh bàn tay khéo léo của nghệ nhân đúc đồng.',
      etiquette: 'Phối cùng Trang phục Đông Sơn cho cả nam và nữ.',
      pattern: 'Hoa văn bông lúa, hươu sao và vòng xoáy kép.',
      notableDynasty: 'Thời Văn Lang – Âu Lạc',
    },
    defaultColorHex: '#9C6938',
    secondaryColorHex: '#F59E0B',
    svgLayerType: 'ngoc-boi',
  },

  // 16. Quạt Lụa Tơ Tằm Thêu Tay Cố Đô (Unisex - Lê & Nguyễn)
  {
    id: 'quat-lua',
    name: 'Quạt Lụa Tơ Tằm Thêu Tay (Unisex)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'unisex',
    icon: '🪭',
    badge: 'Duyên Dáng Phong Nhã',
    summary: 'Quạt xếp bằng nan tre già phủ lụa tơ tằm thêu cảnh sông Hương núi Ngự, phụ kiện tạo dáng tao nhã cho cả nam lẫn nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Nghề làm quạt Chàng Sơn (Hà Nội) và quạt cung đình Huế nổi tiếng hàng trăm năm.',
      collarType: 'Cầm tay nhẹ nhàng hoặc giắt nhẹ tà áo.',
      symbolism: 'Gió lành (Thiện phong) xua tan ưu phiền, mang lại bình an tĩnh tại.',
      etiquette: 'Thích hợp cho mọi buổi dạo phố, chụp ảnh hoặc dạ hội ngoài trời của cả nam và nữ.',
      pattern: 'Thêu chữ Thơ, hoa sen hồ Tịnh Tâm hoặc phong cảnh kinh thành.',
      notableDynasty: 'Lê - Nguyễn',
    },
    defaultColorHex: '#D4AF37',
    secondaryColorHex: '#8B1E1E',
    svgLayerType: 'quat-lua',
  },

  // 17. Hài Thêu Mũi Cong Hoàng Cung (Nữ - Triều Nguyễn)
  {
    id: 'hai-theu',
    name: 'Hài Thêu Mũi Cong Hoàng Cung (Nữ)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '👠',
    badge: 'Gót Sen Đài Các',
    summary: 'Đôi hài nhung đỏ thêu mũi cong vút, chỉ vàng dệt họa tiết mây lượn, bảo chứng cho bước chân vương giả của nữ quý tộc.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Hài cung đình thời Nguyễn chế tác bởi tượng cục chuyên trách Nội tạo trang phục.',
      collarType: 'Mũi hài cong nhẹ che kín bàn chân duyên dáng.',
      symbolism: 'Mũi cong hướng lên trên tượng trưng cho sự thăng tiến, gót son giữ vững nền phúc đức.',
      etiquette: 'Đi kèm trang phục dạ tiệc cung đình và lễ hội truyền thống của phụ nữ.',
      pattern: 'Chỉ kim tuyến thêu hoa lá cách điệu.',
      notableDynasty: 'Triều Nguyễn',
    },
    defaultColorHex: '#8B1E1E',
    secondaryColorHex: '#D4AF37',
    svgLayerType: 'hai-theu',
  },

  // 18. Chuỗi Ngọc Bích & Kiềng Bạc Cổ (Nữ - Nguyễn & Dân gian)
  {
    id: 'chuoi-ngoc',
    name: 'Chuỗi Ngọc Bích & Kiềng Bạc (Nữ)',
    category: 'accessory',
    era: 'Triều Nguyễn',
    gender: 'nu',
    icon: '📿',
    badge: 'Thơ Mộng Xứ Kinh Kỳ',
    summary: 'Kiềng bạc chạm hoa mai hoặc chuỗi ngọc bích đeo cổ, tôn vinh bờ cổ cao thanh mảnh của người phụ nữ.',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=400',
    cultureInfo: {
      origin: 'Kiềng bạc và chuỗi hạt là trang sức truyền thống của phụ nữ Việt qua nhiều thế kỷ.',
      collarType: 'Đeo vừa vặn bên ngoài cổ áo ngũ thân hoặc áp sát xương quai xanh.',
      symbolism: 'Bảo vệ bình an, xua đuổi tà khí và tôn vinh nét đoan trang thục nữ.',
      etiquette: 'Rất hợp khi diện Áo Ngũ Thân nữ hoặc Áo Tấc nữ.',
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
    hex: '#FAF7F0',
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
  {
    id: 'xanh-cham-dan-gian',
    name: 'Xanh Chàm Mực Thước',
    hex: '#162544',
    accentHex: '#D4AF37',
    meaning: 'Màu chàm nhuộm lá truyền thống, biểu tượng cốt cách nho nhã, mực thước của nam nhân xưa.',
  },
  {
    id: 'do-tia-vuong-trieu',
    name: 'Đỏ Tía Vương Triều',
    hex: '#781419',
    accentHex: '#D4AF37',
    meaning: 'Sắc đỏ tía sẫm sang trọng của quan lại và đại lễ triều Nguyễn.',
  },
  {
    id: 'hong-dao-khue-cac',
    name: 'Hồng Đào Khuê Các',
    hex: '#C84B66',
    accentHex: '#FAF7F0',
    meaning: 'Sắc hồng hoa đào trang nhã, ngọt ngào của tiểu thư chốn cung đình xưa.',
  },
  {
    id: 'den-tuyen-nhung',
    name: 'Đen Tuyền Nhung The',
    hex: '#1C1A19',
    accentHex: '#D4AF37',
    meaning: 'Màu đen vải the huyền bí, tạo phom dáng vững chãi và chiều sâu quyền quý.',
  },
  {
    id: 'vang-mo-hoang-cung',
    name: 'Vàng Mơ Lụa Tằm',
    hex: '#E5B842',
    accentHex: '#781419',
    meaning: 'Sắc vàng óng ả như kén tằm mới nhả tơ, tươi sáng và quý phái.',
  },
  {
    id: 'xanh-com-ha-thanh',
    name: 'Xanh Cốm Hà Thành',
    hex: '#3D7A58',
    accentHex: '#FAF7F0',
    meaning: 'Màu xanh non dịu mát của lúa mới, mang lại vẻ tươi trẻ và thanh tao.',
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
    subtitle: 'Nhẹ nhàng bay bổng cùng Áo Giao Lĩnh cổ phong và Quạt lụa tơ tằm',
    topId: 'giao-linh-nu',
    bottomId: 'vay-xep-ly',
    accessoryId: 'quat-lua',
    fabricId: 'lua-ha-dong',
    colorId: 'xanh-men-lam',
    backdropId: 'hoi-an',
    presetScore: 96,
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
