import { WardrobeItem } from './vietPhucData';

export interface CulturalHallmark {
  id: string;
  title: string;
  vietnamTrait: string;
  foreignContrast: string;
  badge: string;
  icon: string;
}

export interface DynasticPeriod {
  eraId: string;
  eraName: string;
  periodText: string;
  garments: string[];
  identity: string;
  suitableOccasions: string;
  taboosAndNotes: string;
  foreignDisambiguation: string;
}

export interface DisambiguationRule {
  id: string;
  scenario: string;
  severity: 'warning' | 'critical' | 'verified';
  levelBadge: string;
  reason: string;
  culturalAdvice: string;
}

export const CULTURAL_CORE_HALLMARKS: CulturalHallmark[] = [
  {
    id: 'ngu-than-chu-a',
    title: 'Cấu trúc Thân áo Ngũ Thân & Tà áo hình chữ A',
    vietnamTrait:
      'Gồm 5 thân (2 thân trước, 2 thân sau, 1 thân con bên trong che ngực kín đáo). Tà áo lượn cong nhẹ dáng "đáy thúng" hoặc dáng chữ A xòe nhẹ, độ dài vừa phải, xẻ tà từ dưới nách giúp bước đi gọn gàng, uyển chuyển.',
    foreignContrast:
      'Khác biệt: Hán phục Trung Quốc thường mang cấu trúc 2 vạt đè xô lệch, vạt áo dài quét đất hoặc xếp ly rất sâu, rộng nhiều mét vải.',
    badge: 'Cấu Trúc 5 Thân',
    icon: '📐',
  },
  {
    id: 'he-thong-5-cuc',
    title: 'Hệ thống Khuy cài 5 Cúc (Lập Lĩnh)',
    vietnamTrait:
      'Cổ đứng (Lập Lĩnh) cố định bằng đúng 5 chiếc khuy (tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín hoặc Ngũ hành). Sử dụng cúc bấm, cúc ngọc, cúc kim loại hoặc cúc tết bằng vải ngắn.',
    foreignContrast:
      'Khác biệt: Hán phục chủ yếu dùng dải dây buộc ruy-băng dài rủ bên hông/trước ngực hoặc khuy thắt nút tết hoa rườm rà (Bàn khấu) phong cách Mãn Thanh.',
    badge: '5 Khuy Ngũ Thường',
    icon: '✨',
  },
  {
    id: 'duong-may-mui-gay',
    title: 'Kỹ thuật may "Mũi gáy" & "Tay may nối"',
    vietnamTrait:
      'Do khổ vải dệt thủ công xưa hẹp (35–40cm), áo Việt phục cổ luôn có đường sống áo (đường may nối) chính giữa lưng (đại diện cho sự trung chính, thẳng đắn) và đường may nối ngang ống tay.',
    foreignContrast:
      'Khác biệt: Hán phục hiện đại thường bỏ đường sống lưng để tiết kiệm công dệt/cắt.',
    badge: 'Sống Áo Trung Chính',
    icon: '🧵',
  },
  {
    id: 'phuc-trang-quan-2-ong',
    title: 'Phục trang đi kèm: Bắt buộc Quần 2 Ống',
    vietnamTrait:
      'Trang phục dáng dài nam/nữ bắt buộc mặc cùng quần 2 ống (trắng hoặc đen). Phụ kiện đặc trưng: Mấn/Khăn xếp, Khăn mỏ quạ, Khăn lươn, Nón lá, Nón ba tầm, Guốc gỗ, Yếm, Khăn rằn.',
    foreignContrast:
      'Khác biệt: Không đi kèm Váy Mã Diện, thắt lưng siết eo to bản, quạt tròn cài tóc rườm rà dạng phim cổ trang Trung Quốc.',
    badge: 'Quần 2 Ống Chuẩn Mực',
    icon: '👖',
  },
];

export const DYNASTIC_PERIODS: DynasticPeriod[] = [
  {
    eraId: 'dong-son',
    eraName: 'Thời Văn Lang – Âu Lạc',
    periodText: 'Sơ Khai & Văn Hóa Đông Sơn',
    garments: ['Trang phục Đông Sơn', 'Y phục sơ khai'],
    identity:
      'Thể hiện qua hoa văn trên trống đồng Đông Sơn. Phụ nữ mặc áo cánh ngắn chui đầu hoặc cài khuy hở ngực/vai kết hợp váy quấn dài; nam giới cởi trần đóng khố. Đeo vòng ống tay/chân bằng đồng.',
    suitableOccasions: 'Lễ hội văn hóa lịch sử, sân khấu phục dựng thời Hùng Vương, giỗ Tổ Hùng Vương.',
    taboosAndNotes:
      'Không tự ý phối trang sức/hoa văn thời sau (như chữ Hán, rồng thời Nguyễn) vào trang phục Đông Sơn vì lệch niên đại hàng nghìn năm.',
    foreignDisambiguation:
      'Mang đậm tính bản địa Đông Nam Á (đóng khố, váy quấn, trang sức đồng bản to), hoàn toàn khác biệt với y phục Hoa Hạ phương Bắc cùng thời.',
  },
  {
    eraId: 'ly-tran',
    eraName: 'Thời Lý – Trần',
    periodText: 'Thế kỷ XI – XIV',
    garments: ['Áo Giao Lĩnh (Tràng Vạt/Cổ Chéo)', 'Áo Viên Lĩnh (Cổ Tròn)'],
    identity:
      'Ảnh hưởng mạnh mẽ từ Phật giáo (thời Lý) và Hào khí Đông A (thời Trần). Áo Giao Lĩnh vạt trái đè vạt phải tạo hình chữ Y, buông lơi tự do qua gối hoặc chấm gót, bên trong mặc yếm và váy quấn/váy xòe nhẹ.',
    suitableOccasions: 'Sự kiện văn hóa, đi chùa, lễ hội truyền thống, chụp ảnh cổ phong.',
    taboosAndNotes:
      'Bắt buộc vạt trái phải đè lên vạt phải (Y chữ Kim). Cấm kỵ: Nếu vạt phải đè vạt trái (Ý chữ Bát) là quy cách mặc cho người đã mất (Phục xới) theo quan niệm Á Đông.',
    foreignDisambiguation:
      'Mặc thả vạt buông lơi tự do qua gối, không siết thắt lưng to bản ôm chặt eo, không dùng Váy Mã Diện hay Trùng Ký của Hán phục Đường/Tống/Minh.',
  },
  {
    eraId: 'le',
    eraName: 'Thời Lê Sơ – Lê Trung Hưng',
    periodText: 'Thế kỷ XV – XVIII',
    garments: ['Áo Đối Khâm', 'Áo Giao Lĩnh Quan Chế', 'Áo Viên Lĩnh'],
    identity:
      'Thời kỳ quy định phẩm phục lễ nghi Nho giáo lên đỉnh cao. Áo Đối Khâm có 2 vạt song song buông rủ xẻ chính giữa ngực, khoác ngoài cho nữ giới quý tộc/mệnh phụ.',
    suitableOccasions: 'Đại lễ, tái hiện sự kiện lịch sử, biểu diễn nghệ thuật cổ phong.',
    taboosAndNotes: 'Tuân thủ quy thức màu sắc và bố cục hoa văn theo phẩm cấp triều đình.',
    foreignDisambiguation:
      'Áo Đối Khâm thời Lê ngắn và gọn hơn so với áo Phi Phong hay Áo Cánh thời Minh; hoa văn thêu mang mỹ thuật thời Lê (mây lửa, hoa dây).',
  },
  {
    eraId: 'nguyen',
    eraName: 'Thời Nguyễn',
    periodText: 'Thế kỷ XIX – Đầu thế kỷ XX',
    garments: ['Áo Nhật Bình', 'Áo Tấc (Áo Ngũ Thân Tay Thụng)', 'Áo Ngũ Thân Tay Chẽn'],
    identity:
      'Giai đoạn định hình khung chuẩn của Quốc phục Việt Nam nhờ sắc lệnh của Võ Vương Nguyễn Phúc Khoát và Vua Minh Mạng. Cấu trúc 5 thân, cổ đứng lập lĩnh cài 5 cúc.',
    suitableOccasions: 'Cưới hỏi, lễ Tết, cúng tế tổ tiên, dạo phố văn hóa, sự kiện ngoại giao.',
    taboosAndNotes:
      'Áo Nhật Bình có dải ngũ hành ở cửa tay, không khoác lệch vai/xắn tay. Áo Tấc hai tay chắp trước ngực/bụng tạo hình chữ nhật. Áo Ngũ Thân không xẻ vạt quá cao, không thắt dải lụa siết eo.',
    foreignDisambiguation:
      'Bắt buộc mặc cùng quần 2 ống rộng, tuyệt đối không phối cùng Váy Mã Diện Hán phục. Áo Trường Sam Trung Quốc xẻ tà rất cao và dùng khuy bện rườm rà.',
  },
  {
    eraId: 'dan-gian',
    eraName: 'Dân Gian & Vùng Miền',
    periodText: 'Song Hành Cùng Lịch Sử',
    garments: ['Áo Tứ Thân (Kinh Bắc)', 'Áo Bà Ba (Nam Bộ)'],
    identity:
      'Áo Tứ Thân: 4 vạt (2 vạt sau may liền, 2 vạt trước buộc nút trước bụng), yếm đào, váy đút, khăn mỏ quạ, nón ba tầm. Áo Bà Ba: xẻ tà 2 bên hông, cúc bấm, quần đen, khăn rằn.',
    suitableOccasions: 'Hội Lim, hát Quan họ, du lịch sông nước Nam Bộ, biểu diễn dân gian.',
    taboosAndNotes:
      'Áo Tứ Thân không cởi bỏ áo khoác chỉ mặc yếm dạo phố. Áo Bà Ba không đi cùng giày cao gót nhọn lệch tông hoặc cắt xẻ táo bạo sai phom dáng giản dị.',
    foreignDisambiguation:
      'Áo Tứ Thân khác hoàn toàn Váy Tề Ngực thời Đường (không có vạt buộc trước bụng). Áo Bà Ba mang dấu ấn sông nước phương Nam.',
  },
  {
    eraId: 'hien-dai',
    eraName: 'Áo Dài Hiện Đại',
    periodText: 'Thế Kỷ XX – Nay',
    garments: ['Áo Dài Lemur (1930)', 'Áo Dài Lê Phổ', 'Áo Dài Chít Eo', 'Áo Dài Tân Thời'],
    identity:
      'Phát triển từ Áo Ngũ Thân Tay Chẽn. Quốc phục tôn vinh nét kín đáo nhưng quyến rũ thanh lịch của người phụ nữ Việt Nam.',
    suitableOccasions: 'Quốc lễ, cưới hỏi, đồng phục học đường, Tết cổ truyền, sự kiện quốc tế.',
    taboosAndNotes: 'Tránh vải xuyên thấu lộ đồ lót phản cảm; không mặc cùng quần đùi/quần bó sát quá ngắn.',
    foreignDisambiguation:
      'Đường nét thắt đáy lưng ong mềm mại, tà trước tà sau bay bổng trên nền quần ống rộng thướt tha.',
  },
];

export interface EvaluationResult {
  isAuthentic: boolean;
  scoreAdjustment: number;
  warnings: DisambiguationRule[];
  verifiedHallmarks: CulturalHallmark[];
  matchedPeriod: DynasticPeriod;
  keyAdvice: string;
}

export function evaluateOutfitAuthenticity(
  top: WardrobeItem,
  bottom: WardrobeItem,
  accessory: WardrobeItem
): EvaluationResult {
  const warnings: DisambiguationRule[] = [];
  const verifiedHallmarks: CulturalHallmark[] = [];

  // Determine period
  let matchedPeriod = DYNASTIC_PERIODS[3]; // Default Nguyen
  if (top.id === 'dong-son') {
    matchedPeriod = DYNASTIC_PERIODS[0]; // Dong Son
  } else if (top.id.startsWith('giao-linh') || top.id.startsWith('vien-linh')) {
    matchedPeriod = DYNASTIC_PERIODS[1]; // Ly Tran
  } else if (top.id === 'doi-kham' || top.era === 'Thời Lê') {
    matchedPeriod = DYNASTIC_PERIODS[2]; // Le
  } else if (top.id.startsWith('tu-than') || top.id.startsWith('ao-ba-ba')) {
    matchedPeriod = DYNASTIC_PERIODS[4]; // Dan Gian
  }

  // RULE 1: Áo Ngũ Thân / Áo Tấc phối cùng Váy (như Váy xếp ly / Váy Mã Diện)
  const isNguyenLongRobe = top.id.startsWith('ngu-than') || top.id.startsWith('ao-tac');
  const isWearingSkirt = bottom.id === 'vay-xep-ly';

  if (isNguyenLongRobe && isWearingSkirt) {
    warnings.push({
      id: 'rule-skirt-madian-warning',
      scenario: 'Phối Áo Tấc / Ngũ Thân cùng Chân Váy',
      severity: 'critical',
      levelBadge: '❌ Cảnh báo nhầm lẫn nghiêm trọng',
      reason:
        'Váy Mã Diện (Madian Skirt) thuộc Hán phục Minh/Thanh. Việt phục dáng dài nam/nữ (Áo Tấc & Ngũ Thân) bắt buộc mặc cùng quần 2 ống (trắng hoặc đen).',
      culturalAdvice:
        'Khuyên dùng: Đổi sang "Quần Ống Sớ Lụa Bạch" hoặc "Quần Lụa Men Lam" để chuẩn quy thức trang phục cung đình và dân gian triều Nguyễn.',
    });
  } else {
    verifiedHallmarks.push(CULTURAL_CORE_HALLMARKS[3]); // Quần 2 ống
  }

  // RULE 2: Cấu trúc 5 thân & dáng chữ A thả suông (không siết eo)
  if (top.id.startsWith('ngu-than') || top.id.startsWith('ao-tac')) {
    verifiedHallmarks.push(CULTURAL_CORE_HALLMARKS[0]); // 5 thân & dáng chữ A
    verifiedHallmarks.push(CULTURAL_CORE_HALLMARKS[1]); // 5 cúc lập lĩnh
    verifiedHallmarks.push(CULTURAL_CORE_HALLMARKS[2]); // Mũi gáy sống áo
  }

  // RULE 3: Áo Giao Lĩnh (Vạt chữ Y đè vạt phải)
  if (top.id.startsWith('giao-linh')) {
    verifiedHallmarks.push({
      id: 'giao-linh-y-kim',
      title: 'Quy cách Cổ áo Giao Lĩnh (Chữ Y - Hữu Nhậm)',
      vietnamTrait:
        'Vạt trái đè lên vạt phải (hình chữ Y - chữ Kim) mang sinh khí hài hòa âm dương. Dây buộc hoặc khuy cài ẩn bên trong hông, tà áo buông lơi tự do qua gối.',
      foreignContrast:
        'Cấm kỵ: Tuyệt đối không cài vạt phải đè vạt trái (Ý chữ Bát) vì là quy cách cho người đã mất (Phục xới). Không có dải ruy-băng trang trí dày đặc rủ trước ngực.',
      badge: 'Cổ Chữ Y Chuẩn Mực',
      icon: '🥋',
    });
  }

  // RULE 4: Áo Nhật Bình
  if (top.id.startsWith('nhat-binh')) {
    verifiedHallmarks.push({
      id: 'nhat-binh-cung-dinh',
      title: 'Quy cách Áo Nhật Bình Cung Đình Huế',
      vietnamTrait:
        'Cổ áo đóng khung hình chữ nhật (chữ Nhật - 日) vuông vức trước ngực, 2 dải buộc ngực buông rủ, viền cửa tay có dải ngũ sắc ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ).',
      foreignContrast:
        'Phân biệt với Áo Phi Phong Trung Quốc (cổ vát tròn/chéo nhẹ và không có dải ngũ sắc cửa tay). Khi mặc giữ tà thẳng nghiêm trang, không khoác lệch vai hoặc xắn tay áo.',
      badge: 'Cung Đình Ngũ Hành',
      icon: '👑',
    });
  }

  // RULE 5: Phụ kiện (Quạt tròn phim Trung Quốc vs Phụ kiện Việt)
  if (accessory.id === 'quat-lua') {
    warnings.push({
      id: 'accessory-fan-note',
      scenario: 'Lưu ý phụ kiện cầm tay',
      severity: 'warning',
      levelBadge: '⚠️ Lưu ý tạo hình phụ kiện',
      reason:
        'Việt phục ưu tiên quạt xếp nan tre/trúc bọc lụa thêu tay truyền thống (làng Chàng Sơn, quạt Huế). Tránh dùng quạt tròn cài tóc rườm rà dạng Cung đình phim cổ trang Trung Quốc.',
      culturalAdvice:
        'Khi tạo dáng, cầm quạt xếp nghiêng nhẹ 45 độ ngang ngực hoặc cài nhẹ cạnh tà áo, kết hợp cùng Mấn đội đầu hoặc Khăn đóng để toát trọn thần thái.',
    });
  }

  const isAuthentic = warnings.filter((w) => w.severity === 'critical').length === 0;
  const scoreAdjustment = isAuthentic ? 0 : -8;

  let keyAdvice =
    'Bộ trang phục đáp ứng chuẩn mực Việt phục với cấu trúc thân áo và phục trang đi kèm hài hòa.';
  if (!isAuthentic) {
    keyAdvice =
      'Phát hiện điểm chưa chuẩn: Áo dáng dài ngũ thân/áo tấc cần đi cùng quần 2 ống thay vì chân váy để đảm bảo chuẩn mực di sản.';
  }

  return {
    isAuthentic,
    scoreAdjustment,
    warnings,
    verifiedHallmarks,
    matchedPeriod,
    keyAdvice,
  };
}
