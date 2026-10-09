import { WardrobeItem, TOPS, BOTTOMS, ACCESSORIES } from './vietPhucData';

export interface FashionProduct {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'accessory' | 'set';
  categoryLabel: string;
  wardrobeId: string;
  era: 'Triều Nguyễn' | 'Thời Lê' | 'Thời Lý - Trần' | 'Cách Tân 2026';
  price: number;
  originalPrice?: number;
  tag?: 'BESTSELLER' | 'MỚI' | 'LIMITED' | 'GIẢM 15%' | 'CUNG ĐÌNH' | 'MAY ĐO THỦ CÔNG';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  images: string[];
  summary: string;
  description: string;
  fabric: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  highlights: string[];
}

export interface CartItem {
  cartItemId: string;
  product: FashionProduct;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  customMeasurements?: {
    height?: string;
    weight?: string;
    chest?: string;
    waist?: string;
    notes?: string;
  };
  quantity: number;
}

export const FASHION_PRODUCTS: FashionProduct[] = [
  {
    id: 'prod-nhat-binh-cung-dinh',
    name: 'Áo Nhật Bình Hoàng Gia Phượng Vũ',
    category: 'top',
    categoryLabel: 'Áo Thượng Y Cung Đình',
    wardrobeId: 'nhat-binh',
    era: 'Triều Nguyễn',
    price: 3650000,
    originalPrice: 4290000,
    tag: 'BESTSELLER',
    rating: 4.95,
    reviewCount: 168,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Pháp phục Hậu phi triều Nguyễn với dải thêu chữ nhật hoa cúc kim tuyến và tay áo ngũ hành lộng lẫy.',
    description: 'Chế tác thủ công từ gấm tơ tằm thượng hạng dệt chìm hoa văn Bát Bửu. Cổ áo hình chữ nhật viền thêu tơ óng với chim Phượng Hoàng tung cánh giữa dải ngũ sắc mây lành. Gấu áo thêu hoa văn Thủy Ba dâng triều phúc lộc.',
    fabric: 'Gấm Tơ Tằm Cung Đình & Chỉ Kim Tuyến Cổ Phong',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Đỏ Thắm Hoàng Gia', hex: '#8B1E1E' },
      { name: 'Vàng Hoàng Yến', hex: '#D4AF37' },
      { name: 'Xanh Men Lam Cố Đô', hex: '#1B365D' },
    ],
    highlights: [
      '100% Gấm tơ tằm dệt thủ công làng nghề truyền thống',
      'Thêu tay 120 giờ bởi nghệ nhân Cố đô Huế',
      'Cổ chữ nhật chuẩn quy thức Gia Long năm thứ 6',
      'Hỗ trợ may đo theo số đo cơ thể chuẩn xác',
    ],
  },
  {
    id: 'prod-ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn Nho Nhã',
    category: 'top',
    categoryLabel: 'Áo Thượng Y',
    wardrobeId: 'ngu-than',
    era: 'Triều Nguyễn',
    price: 2450000,
    originalPrice: 2890000,
    tag: 'BESTSELLER',
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Dáng áo 5 thân kinh điển định hình phong thái thanh cao, lễ giáo khiêm cung của quý nhân kinh kỳ.',
    description: 'Cổ đứng lập lĩnh cao 2.5cm ôm gọn gáy, 5 hạt cúc cài chéo về bên phải tượng trưng cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín). Tay áo ôm chẽn gọn gàng, linh hoạt cho cả dịp lễ lẫn dạo phố văn hóa.',
    fabric: 'Lụa Tơ Tằm Vạn Phúc dệt vân mây cổ điển',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Xanh Lam Cố Đô', hex: '#1B365D' },
      { name: 'Đỏ Điều Trầm', hex: '#8B1E1E' },
      { name: 'Vàng Cát Phong Nhã', hex: '#C59B27' },
      { name: 'Đen Mực Nho Sĩ', hex: '#262423' },
    ],
    highlights: [
      'Chuẩn phom dáng Võ Vương Nguyễn Phúc Khoát 1744',
      'Vải lụa mềm rủ, thoáng mát mùa hè, ấm áp mùa đông',
      '5 hạt cúc bọc đồng thau mạ vàng hoặc xà cừ thiên nhiên',
      'Dễ phối cùng quần ống sớ hoặc quần âu cách tân',
    ],
  },
  {
    id: 'prod-ao-tac-dai-le',
    name: 'Áo Tấc Lễ Phục Tay Thụng Thượng Hạng',
    category: 'top',
    categoryLabel: 'Lễ Phục Đại Triều',
    wardrobeId: 'ao-tac',
    era: 'Triều Nguyễn',
    price: 2850000,
    originalPrice: 3300000,
    tag: 'MAY ĐO THỦ CÔNG',
    rating: 4.92,
    reviewCount: 94,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Tay thụng rộng một tấc trang nghiêm, lễ phục không thể thiếu cho lễ cưới hỏi, tế tự và nghi lễ gia tộc.',
    description: 'Khi khoanh tay hành lễ, hai tà tay thụ buông giao nhau tạo thế cung kính tuyệt đối. May vạt con bên trong kín đáo, chất liệu gấm dệt hoa văn chữ Thọ kết hợp viền kim tuyến sang trọng.',
    fabric: 'Gấm Hoa Cúc Triều Nguyễn dệt chìm ngũ phúc',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Đỏ Điều Hỷ Sự', hex: '#8B1E1E' },
      { name: 'Vàng Hoàng Kim', hex: '#D4AF37' },
      { name: 'Xanh Cổ Vịt Vương Triều', hex: '#1F4E5B' },
    ],
    highlights: [
      'Phom tay thụng tiêu chuẩn cổ lễ nghi triều Nguyễn',
      'Chất gấm đứng dáng, độ bóng satin vương giả',
      'Tặng kèm hộp gấm bảo quản và hướng dẫn mặc cổ lễ',
    ],
  },
  {
    id: 'prod-giao-linh-thoi-le',
    name: 'Áo Giao Lĩnh Cổ Chéo Hào Khí Đông A',
    category: 'top',
    categoryLabel: 'Áo Thượng Y',
    wardrobeId: 'giao-linh',
    era: 'Thời Lê',
    price: 2790000,
    originalPrice: 3190000,
    tag: 'MỚI',
    rating: 4.88,
    reviewCount: 82,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1590333746438-283450096582?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Cổ chéo giao nhau ở ngực uy nghi, dấu ấn rực rỡ của thời kỳ Lê Sơ và Lê Trung Hưng Thăng Long.',
    description: 'Vạt trái đè lên vạt phải thắt dải lụa bên hông, mang tinh thần hào sảng, khoáng đạt của văn hiến Thăng Long ngàn năm. Phù hợp cho sự kiện văn hóa, chụp ảnh nghệ thuật và lễ hội truyền thống.',
    fabric: 'Lụa Đũi Tự Nhiên dệt thoi mộc mạc',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Xanh Rêu Thăng Long', hex: '#2D5A46' },
      { name: 'Đỏ Mận Cổ Điển', hex: '#6B1F2D' },
      { name: 'Trắng Ngà Tự Nhiên', hex: '#FAF7F0' },
    ],
    highlights: [
      'Thiết kế chuẩn phom giao lĩnh thời Hậu Lê',
      'Thắt lưng lụa đính tua rua chỉ tơ tằm',
      'Thoáng mát, giữ dáng tự nhiên không gò bó',
    ],
  },
  {
    id: 'prod-ao-tu-than-kinh-bac',
    name: 'Áo Tứ Thân & Yếm Đào Kinh Bắc',
    category: 'top',
    categoryLabel: 'Dân Gian Bắc Bộ',
    wardrobeId: 'tu-than',
    era: 'Thời Lê',
    price: 1890000,
    originalPrice: 2200000,
    tag: 'GIẢM 15%',
    rating: 4.96,
    reviewCount: 173,
    inStock: true,
    images: [
      'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523488/T%E1%BB%A9_Th%C3%A2n_n%E1%BB%AF.jpg',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Áo the tứ thân bốn vạt thướt tha, thắt nút bụng duyên dáng phối cùng yếm đào và thắt lưng xanh.',
    description: 'Trang phục cổ truyền lâu đời của phụ nữ miền Bắc Việt Nam. Bốn vạt áo tượng trưng cho tứ thân phụ mẫu bao bọc chở che, toát lên nét đằm thắm dịu dàng của liền chị vùng Quan họ Kinh Bắc.',
    fabric: 'Lụa The Mỏng & Đũi Tơ Tằm Hà Đông',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Nâu Sồng Kinh Bắc', hex: '#3D342D' },
      { name: 'Hồng Sen Thắm', hex: '#B23A48' },
      { name: 'Xanh Lá Mạ', hex: '#4A7C59' },
    ],
    highlights: [
      'Bốn thân áo buông suông mềm mại đúng chuẩn tỉ lệ xưa',
      'Yếm đào đính kèm cắt may khéo léo tôn vinh nét duyên',
      'Thắt lưng lụa đào xanh biếc đi kèm nguyên set',
    ],
  },
  {
    id: 'prod-ao-doi-kham-le-trieu',
    name: 'Áo Đối Khâm Quý Tộc Thời Lê',
    category: 'top',
    categoryLabel: 'Phẩm Phục Lê Triều',
    wardrobeId: 'doi-kham',
    era: 'Thời Lê',
    price: 2490000,
    originalPrice: 2890000,
    tag: 'CUNG ĐÌNH',
    rating: 4.95,
    reviewCount: 142,
    inStock: true,
    images: [
      'https://res.cloudinary.com/f4wgawlg/image/upload/v1791523432/%C4%90%E1%BB%91i_Kh%C3%A2m.jpg',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Hai vạt áo song song buông rủ xẻ giữa ngực, khoác ngoài lộng lẫy của mệnh phụ phu nhân triều Lê.',
    description: 'Đỉnh cao phẩm phục quý tộc Đại Việt thời Lê Sơ và Lê Trung Hưng. Cổ áo mở thẳng song song buông rủ trước ngực tôn vinh sự quyền quý, tráng lệ trong các đại lễ vương triều.',
    fabric: 'Gấm Thêu Cung Đình & Lụa Sa Cao Cấp',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Đỏ Chu Sa Lê Triều', hex: '#8B1E1E' },
      { name: 'Xanh Lam Ngọc', hex: '#1F4E5B' },
      { name: 'Vàng Hoàng Kim', hex: '#D4AF37' },
    ],
    highlights: [
      'Hoa văn mây lửa và hoa dây đặc trưng mỹ thuật thời Lê',
      'Đường viền thêu kim tuyến tỉ mỉ từ vai xuống gấu áo',
      'Thích hợp cho đại lễ, chụp ảnh di sản và các sự kiện lịch sử',
    ],
  },
  {
    id: 'prod-chan-vay-thuy-ba',
    name: 'Chân Váy Xếp Ly Thêu Thủy Ba Tầng Tầng',
    category: 'bottom',
    categoryLabel: 'Chân Váy Cổ Phong',
    wardrobeId: 'vay-xep-ly',
    era: 'Thời Lê',
    price: 1450000,
    originalPrice: 1750000,
    tag: 'BESTSELLER',
    rating: 4.93,
    reviewCount: 198,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Nếp ly xếp đều tăm tắp, gấu váy thêu sóng nước và đá núi mang lại nhịp bước uyển chuyển kiều diễm.',
    description: 'Chân váy lấy cảm hứng từ trang phục phụ nữ thời Lý - Trần và Lê. Nếp ly xòe mềm mại khi di chuyển tạo cảm giác bồng bềnh thanh thoát, dễ phối cùng áo ngũ thân, áo tấc hoặc áo yếm.',
    fabric: 'Gấm Lụa Xếp Ly & Chỉ Tơ Đa Sắc',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Đỏ Điều Thủy Ba', hex: '#8B1E1E' },
      { name: 'Xanh Men Lam', hex: '#1F4E5B' },
      { name: 'Đen Huyền Bí', hex: '#262423' },
    ],
    highlights: [
      'Hơn 60 nếp gấp ly dập nhiệt vĩnh viễn không mất nếp',
      'Gấu thêu sóng nước Thủy Ba cầu tài lộc may mắn',
      'Cạp váy chun lụa co giãn thoải mái khi mặc',
    ],
  },
  {
    id: 'prod-quan-ong-so-lua-bach',
    name: 'Quần Ống Sớ Lụa Bạch Chuẩn Mực Cổ Điển',
    category: 'bottom',
    categoryLabel: 'Hạ Y Chuẩn Mực',
    wardrobeId: 'quan-ong-so',
    era: 'Triều Nguyễn',
    price: 950000,
    originalPrice: 1150000,
    tag: 'LIMITED',
    rating: 4.89,
    reviewCount: 140,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Quần lụa ống rộng màu trắng tinh tế, chuẩn mực bắt buộc khi phối cùng Áo Ngũ Thân và Áo Tấc.',
    description: 'Quy thức mặc cổ phục triều Nguyễn đòi hỏi một chiếc quần lụa trắng thanh khiết, ống rộng rủ tự nhiên che kín mũi hài khi đứng thẳng, tôn vinh dáng vẻ đoan trang nho nhã.',
    fabric: 'Lụa Hà Đông Thượng Hạng dệt trơn bóng ngọc',
    sizes: ['S', 'M', 'L', 'XL', 'May đo riêng'],
    colors: [
      { name: 'Trắng Bạch Ngọc', hex: '#FAF7F0' },
      { name: 'Xanh Men Lam', hex: '#1F4E5B' },
      { name: 'Vàng Hoàng Thổ', hex: '#D4AF37' },
    ],
    highlights: [
      'Ống sớ suông rộng 32cm chuẩn quy chuẩn Cố đô',
      'Chất lụa bay tà, tạo dáng bước đi uyển chuyển',
      'Lót hai lớp kín đáo, không lo lộ bên trong',
    ],
  },
  {
    id: 'prod-man-doi-dau-gam',
    name: 'Mấn Đội Đầu Quấn Vòng Bọc Gấm Thêu Cúc',
    category: 'accessory',
    categoryLabel: 'Phụ Kiện Hoàng Gia',
    wardrobeId: 'man-doi-dau',
    era: 'Triều Nguyễn',
    price: 680000,
    originalPrice: 850000,
    tag: 'BESTSELLER',
    rating: 4.97,
    reviewCount: 310,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Mấn tròn quấn nhiều vòng đội đầu trang nghiêm, linh hồn tạo nên diện mạo quý phái của phụ nữ Việt.',
    description: 'Được chế tác thủ công bằng cốt rơm nếp êm nhẹ, bọc gấm hoa cúc kim tuyến tỉ mỉ từng đường kim mũi chỉ. Giúp tôn vinh gương mặt phúc hậu, cao quý khi đội cùng Áo Nhật Bình hoặc Áo Tấc.',
    fabric: 'Gấm Tơ Tằm Cung Đình & Cốt Mấn Ép Nhẹ',
    sizes: ['Free Size (Co giãn êm ái)'],
    colors: [
      { name: 'Vàng Hoàng Kim', hex: '#D4AF37' },
      { name: 'Đỏ Điều Quyền Quý', hex: '#8B1E1E' },
      { name: 'Lam Ngọc Đậm', hex: '#1B365D' },
    ],
    highlights: [
      'Trọng lượng siêu nhẹ chỉ 180g, đội cả ngày êm đầu',
      'Đường quấn nếp đều tăm tắp, không xô lệch',
      'Bảo quản trong hộp gấm cứng cao cấp chống bụi',
    ],
  },
  {
    id: 'prod-ngoc-boi-hoang-cung',
    name: 'Ngọc Bội Cung Đình Khắc Song Hỷ & Lưu Ly',
    category: 'accessory',
    categoryLabel: 'Phụ Kiện Cung Đình',
    wardrobeId: 'ngoc-boi',
    era: 'Triều Nguyễn',
    price: 890000,
    originalPrice: 1050000,
    tag: 'CUNG ĐÌNH',
    rating: 4.94,
    reviewCount: 112,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Ngọc bội treo bên hông áo, phát ra âm thanh ngọc khánh thanh tao mang điềm lành và phúc khí.',
    description: 'Miếng ngọc tạc khắc tinh xảo họa tiết Song Hỷ hoặc hoa sen, kết cùng hạt lưu ly ngũ sắc và chùm tua rua chỉ tơ tằm buông rủ tha thướt theo từng bước đi.',
    fabric: 'Ngọc Bạch Thể Tự Nhiên & Tua Rua Tơ Tằm',
    sizes: ['Tiêu chuẩn (Dài 28cm)'],
    colors: [
      { name: 'Bạch Ngọc Trắng', hex: '#FAF7F0' },
      { name: 'Ngọc Bích Xanh', hex: '#4A7C59' },
    ],
    highlights: [
      'Ngọc chạm khắc hai mặt sắc sảo',
      'Móc cài đồng thau cổ điển dễ gắn vào khuy áo',
      'Ý nghĩa phong thủy bình an, chiêu tài tích lộc',
    ],
  },
  {
    id: 'prod-hai-theu-cung-dinh',
    name: 'Hài Thêu Mũi Cong Cung Đình Thêu Phụng',
    category: 'accessory',
    categoryLabel: 'Phụ Kiện Hoàng Gia',
    wardrobeId: 'hai-theu',
    era: 'Triều Nguyễn',
    price: 1150000,
    originalPrice: 1390000,
    tag: 'MAY ĐO THỦ CÔNG',
    rating: 4.98,
    reviewCount: 88,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Hài mũi cong thêu hoa cúc và chim phụng, bước đi êm ái trên nền thềm cung điện nguy nga.',
    description: 'Được đóng thủ công theo khuôn chân truyền thống, mũi hài vểnh cong duyên dáng chống quệt tà áo, thân hài bọc gấm thêu tay chỉ kim tuyến lấp lánh.',
    fabric: 'Gấm Lụa & Đế Cao Su Tự Nhiên Êm Ái',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: [
      { name: 'Đỏ Điều Hoàng Cung', hex: '#8B1E1E' },
      { name: 'Vàng Kim Quý Tộc', hex: '#D4AF37' },
      { name: 'Đen Nhung Huyền', hex: '#262423' },
    ],
    highlights: [
      'Đế êm chống trượt hiện đại kết hợp phom cổ truyền',
      'Thêu tay kim tuyến bền màu vĩnh viễn',
      'Điểm nhấn hoàn hảo nâng tầm bộ cổ phục',
    ],
  },
  {
    id: 'prod-quat-the-theu-tay',
    name: 'Quạt The Lụa Thêu Tay Hoa Sen & Khung Trúc Già',
    category: 'accessory',
    categoryLabel: 'Phụ Kiện Khuê Các',
    wardrobeId: 'quat-the',
    era: 'Triều Nguyễn',
    price: 520000,
    originalPrice: 650000,
    tag: 'BESTSELLER',
    rating: 4.96,
    reviewCount: 240,
    inStock: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800',
    ],
    summary: 'Quạt nan trúc bọc the lụa mỏng thêu đóa sen hồng e ấp, biểu trưng cho nét thẹn thùng duyên dáng.',
    description: 'Nan quạt làm từ trúc già ngâm chống mối mọt, the lụa dệt mỏng tang thoáng gió, thêu tay một cành sen thanh khiết. Phụ kiện không thể thiếu khi tạo dáng chụp ảnh cổ phục.',
    fabric: 'The Lụa Tơ Tằm & Nan Trúc Già Phơi Khô',
    sizes: ['Đường kính 24cm'],
    colors: [
      { name: 'Trắng Ngà Tinh Khiết', hex: '#FAF7F0' },
      { name: 'Hồng Sen Phấn', hex: '#B23A48' },
    ],
    highlights: [
      'Khung nan trúc nhẹ nhàng, chuốt bóng tay tỉ mỉ',
      'Kèm tua rua chuỗi ngọc bích đong đưa duyên dáng',
      'Hộp đựng lót lụa làm quà tặng sang trọng',
    ],
  },
];

export interface PromoVoucher {
  code: string;
  discountPercent: number;
  description: string;
  minOrderValue: number;
}

export const PROMO_VOUCHERS: PromoVoucher[] = [
  {
    code: 'AURA2026',
    discountPercent: 10,
    description: 'Giảm 10% mừng BST Thu Đông 2026',
    minOrderValue: 1000000,
  },
  {
    code: 'VIPHERITAGE',
    discountPercent: 15,
    description: 'Giảm 15% cho khách hàng may đo cao cấp',
    minOrderValue: 3000000,
  },
  {
    code: 'FREESHIP',
    discountPercent: 5,
    description: 'Giảm 5% + Miễn phí vận chuyển toàn quốc',
    minOrderValue: 500000,
  },
];
