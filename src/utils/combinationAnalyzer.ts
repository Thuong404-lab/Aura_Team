import {
  WardrobeItem,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
} from '../data/vietPhucData';
import { evaluateCulturalRules } from './culturalRules';

export type StylingMode =
  | 'authentic_heritage' // Cổ Phong Mực Thước (Chính thống lịch sử)
  | 'modern_fusion' // Tân Thời Đương Đại (Neo-Vietnamese Streetwear/Fusion)
  | 'festive_ceremony' // Đại Lễ & Lễ Cưới (Hoàng cung, cưới hỏi sang trọng)
  | 'daily_casual' // Dạo Phố & Hàng Ngày (Thoải mái, thanh tao)
  | 'auto';

export interface CombinationAnalysis {
  synergyScore: number; // 0 - 100
  culturalSynergyTitle: string;
  culturalMeaningDetails: string;
  modernTrendDetails: string;
  colorHarmonyDetails: string;
  stylingDirection: StylingMode;
  stylingDirectionLabel: string;
  itemRoles: {
    heroPiece: { name: string; role: string; highlight: string };
    anchorPiece: { name: string; role: string; highlight: string };
    accentPiece?: { name: string; role: string; highlight: string };
  };
  modernOutfitTip: string;
}

export interface NextItemSuggestion {
  item: WardrobeItem;
  compatibilityScore: number;
  reason: string;
  matchType: 'cultural_strict' | 'modern_trend';
  trendBadge: string;
}

export interface StyleAlternative {
  title: string;
  topId: string;
  bottomId: string;
  accessoryId: string;
  colorHex?: string;
  vibe: string;
  tagline: string;
}

export interface IntelligentAiSuggestion {
  recommendedTopId: string;
  recommendedBottomId: string;
  recommendedAccessoryId: string;
  recommendedColorHex?: string;
  colorScheme: string;
  conceptTitle: string;
  characterPersona: string;
  aiAdvice: string;
  culturalNote: string;
  combinationAnalysis: CombinationAnalysis;
  alternatives: {
    classic: StyleAlternative;
    modernFusion: StyleAlternative;
  };
  nextItemSuggestions?: NextItemSuggestion[];
}

export interface AiSuggestOptions {
  prompt?: string;
  currentTop?: WardrobeItem | null;
  currentBottom?: WardrobeItem | null;
  currentAccessory?: WardrobeItem | null;
  stylingMode?: StylingMode;
  targetAction?: 'full_outfit' | 'complete_current' | 'modernize_current';
  topCustomColor?: string;
  bottomCustomColor?: string;
}

// 1. Phân Tích Sự Kết Hợp Item Cụ Thể (Combination Synergy Engine)
export function analyzeItemCombination(params: {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  accessory: WardrobeItem | null;
  stylingMode?: StylingMode;
  prompt?: string;
  topColorHex?: string;
  bottomColorHex?: string;
}): CombinationAnalysis {
  const { top, bottom, accessory, stylingMode = 'auto' } = params;

  // Run live taboo check to penalize and contextualize taboo clashes
  const tabooCheck = evaluateCulturalRules({
    top,
    bottom,
    accessory,
    topColorHex: params.topColorHex,
    bottomColorHex: params.bottomColorHex,
  });

  const hasTaboo = tabooCheck.violations.length > 0;
  const isModernPants = bottom?.id === 'quan-tay-hien-dai';

  let title = 'Bản Phối Hài Hòa Di Sản & Thẩm Mỹ Đương Đại';
  let culturalMeaning = '';
  let modernTrend = '';
  let colorHarmony = 'Sắc độ tương phản trang nhã, bảo tồn tính thuần khiết của tơ lụa tự nhiên.';
  let modernTip = 'Kết hợp giày gót thấp da thuộc hoặc guốc mộc thanh mảnh, cầm quạt xếp tạo dáng góc nghiêng 45 độ.';
  let dir: StylingMode = stylingMode === 'auto' ? 'authentic_heritage' : stylingMode;
  let dirLabel = 'Cổ Phong Mực Thước';

  let baseScore = hasTaboo ? Math.min(75, tabooCheck.totalScore) : 95;

  const topId = top?.id || '';
  const bottomId = bottom?.id || '';
  const accId = accessory?.id || '';

  // === ANALYZE TOP & BOTTOM PAIRINGS ===
  if (topId.includes('ngu-than')) {
    if (isModernPants) {
      dir = 'modern_fusion';
      dirLabel = 'Tân Thời Đương Đại (Neo-Heritage)';
      title = 'Giao Thoa Cận Đại: Áo Ngũ Thân & Quần Tây Cạp Cao';
      culturalMeaning =
        'Bản phối kế thừa tinh thần canh tân văn hóa đầu thế kỷ XX của tầng lớp trí thức thị dân Sài Gòn & Hà Nội. Tà áo năm thân lập lĩnh giữ vẹn nguyên cấu trúc đạo lý ngũ thường và đạo hiếu, đồng thời tiếp thu phom quần âu thẳng thớm tạo thế đứng khoan thai, tự tin.';
      modernTrend =
        'Xu hướng Neo-Vietnamese Smart Casual đang làm mưa làm gió trong giới trẻ sáng tạo, kiến trúc sư và nghệ sĩ indie. Phù hợp cho ngày làm việc văn phòng, dự triển lãm mỹ thuật đương đại hoặc cà phê phố cổ cuối tuần.';
      modernTip =
        'Hãy mix cùng giày loafers da tối giản hoặc sneaker trắng trơn, gài kính mắt tròn cổ điển và mang túi tote canvas thổ cẩm.';
      baseScore = 93;
    } else if (bottomId === 'quan-ong-so') {
      title = 'Thế Đứng Trực Lập: Áo Ngũ Thân & Quần Ống Sớ Lụa Bạch';
      culturalMeaning =
        'Chuẩn mực Nho phong triều Nguyễn: "Ngũ thường tại thân, tâm thanh ý bạch". Cấu trúc 5 thân áo buông dáng đáy thúng chữ A thanh tao đi cùng quần hai ống lụa trắng tạo nên phong thái ung dung, khiêm nhường nhưng kiên định của bậc sĩ phu quân tử.';
      modernTrend =
        'Minimalist Monochrome Heritage. Xu hướng chụp ảnh kỷ yếu, ảnh cưới cổ phong tối giản và du xuân thanh lịch. Không rực rỡ phô trương nhưng để lại dư âm đoan trang sâu sắc.';
      modernTip =
        'Đi cùng giày hài thêu hoặc guốc gỗ sơn then, tóc vấn gọn gàng và giữ tay cầm quạt nhẹ nhàng ngang eo.';
      baseScore = 98;
    } else {
      culturalMeaning =
        'Áo Ngũ Thân với 5 khuy cài tượng trưng ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) phối cùng hạ y hai ống buông rủ thanh lịch.';
      modernTrend =
        'Phù hợp các sự kiện văn hóa dân tộc, ngày hội di sản và các bộ ảnh nghệ thuật đương đại.';
    }
  } else if (topId.includes('nhat-binh')) {
    if (bottomId === 'quan-men-lam' || bottomId === 'quan-do-dieu-nu') {
      dir = 'festive_ceremony';
      dirLabel = 'Đại Lễ Cung Đình Hoàng Tộc';
      title = 'Vương Triều Phú Quý: Áo Nhật Bình Phẩm Phục Hoàng Cung';
      culturalMeaning =
        'Đỉnh cao mỹ học cung đình triều Nguyễn. Khung cổ hình chữ nhật tượng trưng Đất vuông chở che muôn loài, viền dải ngũ sắc cửa tay biểu thị ngũ hành tương sinh (Kim, Mộc, Thủy, Hỏa, Thổ) mang lại phúc khí dồi dào. Sắc đỏ chu sa hoặc men lam vương phủ làm nổi bật nét đài các tột bực của bậc mệnh phụ.';
      modernTrend =
        'Royal Wedding Heritage Couture. Xu hướng mặc Nhật Bình trong lễ vu quy và lễ đính hôn đang dẫn đầu thị trường cưới Việt Nam, vượt xa các mẫu váy cưới phương Tây về chiều sâu văn hóa và sự lộng lẫy uy nghiêm.';
      modernTip =
        'Đội mấn thêu ngũ sắc đính ngọc hoặc vành khăn hoàng cung, phối kiềng bạc chạm hoa mai hoặc chuỗi ngọc bích để tôn bờ cổ cao.';
      baseScore = 99;
    } else {
      culturalMeaning =
        'Áo Nhật Bình quy chế trang trọng của hoàng hậu, công chúa và mệnh phụ quý tộc thời Nguyễn.';
      modernTrend =
        'Xu hướng lễ phục cưới hỏi và biểu diễn văn hóa cố đô Huế.';
      baseScore = 94;
    }
  } else if (topId.includes('giao-linh') || topId.includes('doi-kham')) {
    if (bottomId === 'vay-xep-ly' || bottomId === 'thuong-dai-viet-nu') {
      title = 'Thanh Phong Đông A: Áo Giao Lĩnh & Chân Váy Xếp Ly Thủy Ba';
      culturalMeaning =
        'Hào khí Đại Việt thời Lý - Trần - Lê. Cổ áo giao nhau chữ Y vạt trái đè vạt phải ("hữu nhậm") đại diện cho chính đạo và sự giao hòa âm dương đất trời. Chân váy xếp ly thêu sóng nước Thủy Ba biểu trưng cho dòng chảy hanh thông, tài lộc tầng tầng lớp lớp.';
      modernTrend =
        'Ethereal & Poetic Heritage. Rất thịnh hành trong các bộ ảnh nghệ thuật phong cách thiền định, lãng mạn tại Hoàng thành Thăng Long, Cố đô Hoa Lư hay các video clip âm nhạc di sản.';
      modernTip =
        'Phối cùng quạt lụa thêu tơ tằm và ngọc bội thắt lưng, bước đi nhịp nhàng để chân váy xòe ly tự nhiên.';
      baseScore = 97;
    } else {
      culturalMeaning =
        'Áo Giao Lĩnh phom dáng rộng rãi, phóng khoáng mang đậm mỹ học cổ xưa thời Lý, Trần, Lê.';
      modernTrend =
        'Phong cách hoài niệm cổ trang Đại Việt thanh thoát.';
      baseScore = 93;
    }
  } else if (topId.includes('ao-tac')) {
    title = 'Đại Nghi Cố Đô: Áo Tấc Tay Thụng Lễ Phục';
    culturalMeaning =
      'Lễ phục bắt buộc trong quy chế triều Nguyễn: Tay áo thụng rộng đúng năm tấc ta buông dài quá đầu ngón tay. Khi hai tay chắp trước ngực hành lễ, hai tà tay thụng phủ kín đoan trang, thể hiện lòng thành kính tôn ti trật tự gia tộc và đạo hiếu vô bờ bến.';
    modernTrend =
      'Ceremonial Prestige. Lựa chọn trang trọng số 1 cho các nghi thức cưới hỏi truyền thống, lễ tế tổ tiên gia đình và các sự kiện đại lễ quốc gia.';
    modernTip =
      'Đội khăn đóng lụa đen 7 nếp hoặc mấn nhung, giữ thế chắp tay nghiêm cẩn khi chụp ảnh nghi lễ.';
    baseScore = 98;
  } else if (topId.includes('tu-than')) {
    if (bottomId === 'vay-den-kinh-bac-nu') {
      title = 'Hồn Quê Quan Họ: Áo Tứ Thân & Váy Đũi Đen Kinh Bắc';
      culturalMeaning =
        'Nét duyên thầm ngàn năm châu thổ sông Hồng. Bốn vạt áo the đen tượng trưng cho tứ thân phụ mẫu đùm bọc, yếm đào cánh sen lấp ló e ấp biểu trưng cho tâm hồn thanh bạch, thắt lưng xanh buông lơi duyên dáng trên nền váy đầm lĩnh đen nhánh mặn mà.';
      modernTrend =
        'Folk-Core Revival. Nguồn cảm hứng bất tận của các nhà thiết kế thời trang dân gian đương đại và các ca sĩ biểu diễn âm nhạc văn hóa bản địa (như Hoàng Thùy Linh, Hòa Minzy).';
      modernTip =
        'Đội nón ba tầm quai thao buông rủ ngực hoặc chít khăn mỏ quạ tôn vinh gương mặt trái xoan phúc hậu.';
      baseScore = 98;
    }
  } else if (topId.includes('ao-ba-ba')) {
    title = 'Phù Sa Nam Bộ: Áo Bà Ba & Khăn Rằn Sông Nước';
    culturalMeaning =
      'Vẻ đẹp bình dị, khỏe khoắn nhưng vô cùng thùy mị của vùng đất phương Nam. Tà áo ôm nhẹ tôn eo xẻ hông hai bên giúp vận động thoải mái, cúc bấm xà cừ và khăn rằn caro biểu trưng cho sự thủy chung, khẳng khái và chịu thương chịu khó.';
    modernTrend =
      'Eco-Heritage & Slow Living. Xu hướng thời trang lụa đũi bền vững, du lịch sinh thái miệt vườn và các chuyến dã ngoại cuối tuần hòa mình cùng thiên nhiên.';
    modernTip =
      'Vắt khăn rằn nhẹ qua vai hoặc quấn hờ quanh cổ, đội nón lá chóp truyền thống chằm 16 vành nan tre.';
    baseScore = 96;
  } else if (topId.includes('dong-son')) {
    title = 'Cội Nguồn Văn Minh: Hào Khí Trống Đồng Đông Sơn';
    culturalMeaning =
      'Bản anh hùng ca thời bình minh dựng nước của các vua Hùng. Hoa văn chim Lạc vút bay, mặt trời 14 tia và thuyền chiến Lạc Việt biểu thị tinh thần thượng võ, sự gắn kết cộng đồng sông nước và niềm tự hào nguồn cội dân tộc.';
    modernTrend =
      'Ancestral Pageantry & Runway Couture. Thường xuyên được các nhà thiết kế chọn làm trang phục dân tộc chủ đạo tại các đấu trường sắc đẹp và festival văn hóa thế giới.';
    modernTip =
      'Đội mũ lông chim Lạc vút cao và đeo vòng đồng hộ tâm chạm hoa văn bông lúa thời Âu Lạc.';
    baseScore = 97;
  } else {
    culturalMeaning =
      'Bản phối dung hòa các yếu tố phom dáng và họa tiết cổ phong truyền thống Việt Nam.';
    modernTrend =
      'Phong cách thời trang di sản ứng dụng linh hoạt trong đời sống.';
  }

  // === ANALYZE ACCESSORY SYNERGY ===
  if (accId === 'khan-dong') {
    modernTip += ' Nếp gấp chữ Nhân (人) của khăn đóng tôn vinh vầng trán sáng sủa và cốt cách Nho nhã.';
  } else if (accId === 'quat-lua') {
    modernTip += ' Quạt lụa cầm tay tạo điểm nhấn "thiện phong", che nghiêng mặt e ấp khi chụp ảnh phong cảnh.';
  } else if (accId === 'man-ngu-sac' || accId === 'khan-vanh-day-nu') {
    modernTip += ' Vành khăn/mấn đính ngọc tạo điểm nhấn vương giả đỉnh đầu, nâng tầm khí chất đài các.';
  } else if (accId === 'non-ba-tam-nu') {
    modernTip += ' Quai thao tơ tằm buông rủ ngực tạo đường chuyển động mềm mại trong từng bước đi.';
  } else if (accId === 'ngoc-boi') {
    modernTip += ' Tiếng ngọc bội va chạm êm dịu khi sải bước thể hiện cốt cách khoan thai của bậc quân tử.';
  }

  // === ANALYZE COLOR HARMONY (Ngũ Hành & Contemporary Palette) ===
  const topColor = params.topColorHex || top?.defaultColorHex || '#8B1E1E';
  const bottomColor = params.bottomColorHex || bottom?.defaultColorHex || '#FAF7F0';

  if (topColor.toLowerCase().includes('8b1e') || topColor.toLowerCase().includes('b31d')) {
    // Đỏ Chu Sa (Hỏa)
    if (bottomColor.toLowerCase().includes('faf7') || bottomColor.toLowerCase().includes('fff')) {
      colorHarmony =
        'Hỏa (Đỏ Chu Sa) phối Kim (Lụa Bạch): Tương phản kinh điển rực rỡ và thuần khiết, mang lại cảm giác tươi sáng, hoan hỷ.';
    } else if (bottomColor.toLowerCase().includes('1f4e') || bottomColor.toLowerCase().includes('1625')) {
      colorHarmony =
        'Hỏa (Đỏ Son) phối Thủy (Men Lam Cung Đình): Phối màu vương phủ quý phái, cân bằng thị giác sâu sắc như gốm sứ ký kiểu cố đô Huế.';
    } else if (bottomColor.toLowerCase().includes('d4af')) {
      colorHarmony =
        'Hỏa sinh Thổ (Đỏ Điều phối Hoàng Kim): Sắc thái đại hỷ phú quý bậc nhất trong các nghi lễ cung đình triều Nguyễn.';
    }
  } else if (topColor.toLowerCase().includes('1b36') || topColor.toLowerCase().includes('1625')) {
    // Xanh Chàm (Thủy)
    colorHarmony =
      'Thủy (Xanh Chàm Mực Thước) phối Lụa Bạch: Thể hiện trí tuệ sâu thẳm và lòng thanh bạch, phong thái nhã nhặn của bậc hiền triết.';
  } else {
    colorHarmony =
      'Bảng màu ngũ hành hòa quyện, tôn vinh độ bóng mịn tự nhiên của sợi tơ tằm dệt tay truyền thống.';
  }

  return {
    synergyScore: Math.round(baseScore),
    culturalSynergyTitle: title,
    culturalMeaningDetails: culturalMeaning,
    modernTrendDetails: modernTrend,
    colorHarmonyDetails: colorHarmony,
    stylingDirection: dir,
    stylingDirectionLabel: dirLabel,
    itemRoles: {
      heroPiece: {
        name: top?.name || 'Áo Cổ Phục',
        role: 'Trọng tâm thị giác & Điển chế lịch sử',
        highlight: top?.cultureInfo?.collarType || 'Đường may vạt áo đoan trang',
      },
      anchorPiece: {
        name: bottom?.name || 'Hạ Y / Quần',
        role: 'Cân bằng hình khối & Nhịp bước',
        highlight: bottom?.summary || 'Tạo độ rủ thanh thoát khi di chuyển',
      },
      accentPiece: accessory
        ? {
            name: accessory.name,
            role: 'Điểm xuyết tinh hoa & Khí chất',
            highlight: accessory.cultureInfo?.symbolism || 'Tôn vinh diện mạo người mặc',
          }
        : undefined,
    },
    modernOutfitTip: modernTip,
  };
}

// 2. Thuật Toán Gợi Ý Món Phối Tiếp Theo Thông Minh (Smart Next-Item Generator)
export function getSmartNextItemSuggestions(params: {
  currentTop?: WardrobeItem | null;
  currentBottom?: WardrobeItem | null;
  currentAccessory?: WardrobeItem | null;
  stylingMode?: StylingMode;
}): NextItemSuggestion[] {
  const currentTop = params.currentTop || null;
  const currentBottom = params.currentBottom || null;
  const currentAccessory = params.currentAccessory || null;
  const { stylingMode = 'auto' } = params;
  const suggestions: NextItemSuggestion[] = [];

  // If user has top but NO bottom
  if (currentTop && !currentBottom) {
    BOTTOMS.forEach((bottom) => {
      // Evaluate taboo
      const check = evaluateCulturalRules({
        top: currentTop,
        bottom,
        accessory: currentAccessory,
      });

      if (check.violations.some((v) => v.severity === 'critical')) {
        return; // Exclude critical taboos
      }

      let score = check.totalScore;
      let reason = '';
      let matchType: 'cultural_strict' | 'modern_trend' = 'cultural_strict';
      let badge = 'Hài Hòa Di Sản';

      if (bottom.id === 'quan-tay-hien-dai') {
        if (currentTop.id.includes('ngu-than')) {
          score = stylingMode === 'modern_fusion' ? 98 : 91;
          reason = 'Phối kiểu Neo-Vietnamese Smart Casual: tà áo ngũ thân buông trên quần âu cạp cao hiện đại.';
          matchType = 'modern_trend';
          badge = 'Xu Hướng Đương Đại';
        } else {
          return; // Don't recommend modern pants for ceremonial items
        }
      } else if (bottom.id === 'quan-ong-so') {
        score = 98;
        reason = 'Chuẩn mực kinh điển: Quần lụa bạch hai ống tôn vinh vẻ thanh bạch đoan trang.';
        badge = 'Chuẩn Mực Lịch Sử';
      } else if (bottom.id === 'vay-xep-ly' && currentTop.id.includes('giao-linh')) {
        score = 97;
        reason = 'Chân váy thêu Thủy Ba tạo thế uyển chuyển mây bay nước chảy cùng Áo Giao Lĩnh.';
        badge = 'Tuyệt Phẩm Cổ Phong';
      } else if (bottom.id === 'quan-men-lam' && currentTop.id.includes('nhat-binh')) {
        score = 99;
        reason = 'Màu men lam gốm sứ Cố đô tương phản vương giả tuyệt đối cùng sắc đỏ Áo Nhật Bình.';
        badge = 'Vương Triều Cung Đình';
      } else if (bottom.id === 'vay-den-kinh-bac-nu' && currentTop.id.includes('tu-than')) {
        score = 99;
        reason = 'Váy đầm lĩnh đen nhánh tôn vinh nét duyên thầm Kinh Bắc của Áo Tứ Thân.';
        badge = 'Hồn Quê Kinh Bắc';
      } else {
        reason = `Tương hợp lịch sử cùng ${currentTop.name}.`;
      }

      suggestions.push({
        item: bottom,
        compatibilityScore: score,
        reason,
        matchType,
        trendBadge: badge,
      });
    });
  }

  // If user has top & bottom but NO accessory
  if (currentTop && currentBottom && !currentAccessory) {
    ACCESSORIES.forEach((acc) => {
      const check = evaluateCulturalRules({
        top: currentTop,
        bottom: currentBottom,
        accessory: acc,
      });

      if (check.violations.some((v) => v.severity === 'critical')) {
        return;
      }

      let score = check.totalScore;
      let reason = '';
      let matchType: 'cultural_strict' | 'modern_trend' = 'cultural_strict';
      let badge = 'Điểm Xuyết Tinh Tế';

      if (currentTop.id.includes('ngu-than') && acc.id === 'khan-dong') {
        score = 98;
        reason = 'Khăn đóng 7 nếp chữ Nhân định hình chuẩn mực phong thái Nho nhã bậc sĩ phu.';
        badge = 'Kinh Điển Mực Thước';
      } else if (currentTop.id.includes('nhat-binh') && acc.id === 'man-ngu-sac') {
        score = 99;
        reason = 'Mấn ngũ sắc đính ngọc biểu trưng ngũ phúc lâm môn, phụ kiện tối thượng của Nhật Bình.';
        badge = 'Hoàng Triều Lộng Lẫy';
      } else if (acc.id === 'quat-lua') {
        score = 96;
        reason = 'Quạt lụa thêu tay tạo dáng thanh tao, phụ kiện check-in nghệ thuật số 1 cho dạo phố.';
        matchType = 'modern_trend';
        badge = 'Xu Hướng Check-in';
      } else if (acc.id === 'ngoc-boi') {
        score = 95;
        reason = 'Ngọc bội thắt lưng chạm rồng tạo âm thanh khoan thai, giữ bước chân mực thước.';
        badge = 'Quân Tử Thanh Khiết';
      } else if (currentTop.id.includes('tu-than') && acc.id === 'non-ba-tam-nu') {
        score = 99;
        reason = 'Nón ba tầm quai thao tơ tằm e ấp bên tà tứ thân Kinh Bắc.';
        badge = 'Biểu Tượng Dân Gian';
      } else if (currentTop.id.includes('ao-ba-ba') && acc.id === 'khan-ran-nam-bo') {
        score = 98;
        reason = 'Khăn rằn caro đen trắng mộc mạc làm nổi bật tính cách hào sảng Nam Bộ.';
        badge = 'Duyên Dáng Sông Nước';
      } else {
        reason = `Phụ kiện trang nhã nâng tầm bản phối cùng ${currentTop.name}.`;
      }

      suggestions.push({
        item: acc,
        compatibilityScore: score,
        reason,
        matchType,
        trendBadge: badge,
      });
    });
  }

  // Sort by compatibility score descending
  return suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 4);
}

// 3. Thuật Toán Gợi Ý Toàn Bộ Bản Phối Thông Minh (Intelligent Full Outfit Suggester)
export function generateIntelligentOutfitSuggestion(
  options: AiSuggestOptions
): IntelligentAiSuggestion {
  const {
    prompt = '',
    currentTop,
    currentBottom,
    currentAccessory,
    stylingMode = 'auto',
    targetAction = 'full_outfit',
  } = options;

  const lower = prompt.toLowerCase();

  // If user requested "complete_current" and already has top:
  if (targetAction === 'complete_current' && currentTop) {
    const nextItems = getSmartNextItemSuggestions({
      currentTop,
      currentBottom,
      currentAccessory,
      stylingMode,
    });

    const chosenBottom =
      currentBottom ||
      nextItems.find((n) => n.item.category === 'bottom')?.item ||
      BOTTOMS.find((b) => b.id === 'quan-ong-so')!;

    const chosenAccessory =
      currentAccessory ||
      nextItems.find((n) => n.item.category === 'accessory')?.item ||
      ACCESSORIES.find((a) => a.id === 'quat-lua')!;

    const analysis = analyzeItemCombination({
      top: currentTop,
      bottom: chosenBottom,
      accessory: chosenAccessory,
      stylingMode,
      prompt,
      topColorHex: options.topCustomColor,
      bottomColorHex: options.bottomCustomColor,
    });

    return {
      recommendedTopId: currentTop.id,
      recommendedBottomId: chosenBottom.id,
      recommendedAccessoryId: chosenAccessory.id,
      colorScheme: `${currentTop.name} phối cùng ${chosenBottom.name}`,
      conceptTitle: `Hoàn Thiện Phong Cách: ${currentTop.name}`,
      characterPersona: 'Người yêu di sản với gu thẩm mỹ tinh tế, đoan trang',
      aiAdvice: `Dựa trên món áo ${currentTop.name} bạn đã chọn, AI phân tích và đề xuất phối cùng ${chosenBottom.name} và ${chosenAccessory.name} để hoàn thiện tỷ lệ trang phục chuẩn mực văn hóa nhất.`,
      culturalNote: analysis.culturalMeaningDetails,
      combinationAnalysis: analysis,
      alternatives: {
        classic: {
          title: `Phong Vị Cổ Điển: ${currentTop.name}`,
          topId: currentTop.id,
          bottomId: 'quan-ong-so',
          accessoryId: 'khan-dong',
          vibe: 'Mực Thước Triều Nguyễn',
          tagline: 'Giữ trọn quy thức lễ nghi truyền đời.',
        },
        modernFusion: {
          title: `Cách Tân Đương Đại: ${currentTop.name}`,
          topId: currentTop.id,
          bottomId: currentTop.id.includes('ngu-than') ? 'quan-tay-hien-dai' : 'quan-ong-so',
          accessoryId: 'quat-lua',
          vibe: 'Neo-Heritage Dạo Phố',
          tagline: 'Phóng khoáng, tự tin giữa nhịp sống đô thị.',
        },
      },
      nextItemSuggestions: nextItems,
    };
  }

  // Determine top, bottom, accessory based on prompt & stylingMode
  let topId = 'ngu-than';
  let bottomId = 'quan-ong-so';
  let accId = 'khan-dong';
  let title = 'Thu Nhật Kinh Kỳ: Áo Ngũ Thân & Quần Ống Sớ';
  let persona = 'Nhã sĩ kinh kỳ phong thái ung dung, đĩnh đạc';
  let advice =
    'Bản phối Áo Ngũ Thân tay chẽn kết hợp quần ống sớ trắng tạo dáng vẻ tao nhã, thoải mái khi dạo bước. Phù hợp cho nhịp sống hiện đại.';
  let note =
    'Ngũ thân tượng trưng cho tứ thân phụ mẫu và đạo hiếu làm người với 5 thân áo và 5 đức tính cao đẹp.';
  let colors = 'Sắc chàm nho nhã & Lụa bạch tơ tằm';
  let colorHex = '#1B365D';

  const isFusion =
    stylingMode === 'modern_fusion' ||
    lower.includes('cách tân') ||
    lower.includes('hiện đại') ||
    lower.includes('fusion') ||
    lower.includes('streetwear') ||
    lower.includes('cà phê') ||
    lower.includes('triển lãm');

  const isCeremony =
    stylingMode === 'festive_ceremony' ||
    lower.includes('cưới') ||
    lower.includes('hôn') ||
    lower.includes('hỷ') ||
    lower.includes('ăn hỏi') ||
    lower.includes('cung đình') ||
    lower.includes('đại lễ');

  const isSacred =
    lower.includes('chùa') ||
    lower.includes('đền') ||
    lower.includes('tâm linh') ||
    lower.includes('tế lễ') ||
    lower.includes('trang nghiêm');

  const isFolk =
    lower.includes('quan họ') ||
    lower.includes('hội lim') ||
    lower.includes('bắc ninh') ||
    lower.includes('kinh bắc');

  const isSouth =
    lower.includes('miền tây') ||
    lower.includes('sông nước') ||
    lower.includes('nam bộ') ||
    lower.includes('bà ba');

  const isDongSon =
    lower.includes('đông sơn') ||
    lower.includes('hùng vương') ||
    lower.includes('cội nguồn') ||
    lower.includes('âu lạc');

  const isAncient =
    lower.includes('thăng long') ||
    lower.includes('giao lĩnh') ||
    lower.includes('lý') ||
    lower.includes('trần') ||
    lower.includes('lê') ||
    lower.includes('hoa lư');

  if (isFusion) {
    topId = 'ngu-than';
    bottomId = 'quan-tay-hien-dai';
    accId = 'quat-lua';
    title = 'Neo-Heritage Urban: Áo Ngũ Thân & Quần Tây Cách Tân';
    persona = 'Người trẻ sáng tạo yêu di sản giữa đô thị hiện đại';
    advice =
      'Bản phối dung hợp tà áo năm thân lập lĩnh cổ điển với quần tây âu cạp cao ống đứng tạo nên hình mẫu Neo-Vietnamese thanh lịch, thời thượng, phù hợp đi làm, đi cà phê và dự triển lãm nghệ thuật.';
    note =
      'Sự cách tân tôn trọng cấu trúc 5 thân nguyên bản nhưng giải phóng hạ y giúp người mặc sải bước tự tin, năng động.';
    colors = 'Chàm Đêm Than Chì & Lụa Vàng Hoàng Kim';
    colorHex = '#1B365D';
  } else if (isCeremony) {
    topId = 'nhat-binh';
    bottomId = 'quan-men-lam';
    accId = 'man-ngu-sac';
    title = 'Đại Hỷ Vương Triều: Áo Nhật Bình Sắc Đỏ Chu Sa';
    persona = 'Tân nương vương giả đoan trang ngày vu quy';
    advice =
      'Áo Nhật Bình sắc đỏ chu sa viền cổ thêu ngũ hành phối cùng mấn thêu ngũ sắc đính ngọc và quần lụa men lam tạo nên phong thái vương giả cao quý nhất cho ngày trọng đại.';
    note =
      'Khung cổ chữ nhật tượng trưng đất trời vuông tròn hòa hợp, ngũ sắc cửa tay biểu thị ngũ phúc lâm môn.';
    colors = 'Đỏ Chu Sa Cung Đình & Men Lam Cố Đô';
    colorHex = '#8B1E1E';
  } else if (isSacred) {
    topId = 'ao-tac';
    bottomId = 'quan-ong-so';
    accId = 'khan-dong';
    title = 'Nghi Lễ Tôn Nghiêm Chốn Cổ Tự';
    persona = 'Người con hiếu thảo hướng về nguồn cội tâm linh';
    advice =
      'Áo Tấc tay thụng buông dài 5 tấc kín đáo, trang trọng nhất trong quy chế lễ phục thời Nguyễn, thể hiện sự kính ngưỡng tột cùng nơi cửa Phật.';
    note =
      'Khi chắp tay hành lễ, hai vạt tay thụng phủ kín đoan trang, thể hiện tâm niệm thanh tịnh vô cầu.';
    colors = 'Xanh Chàm Mực Thước & Lụa Bạch';
    colorHex = '#162544';
  } else if (isAncient) {
    topId = 'giao-linh-nu';
    bottomId = 'vay-xep-ly';
    accId = 'tram-cai-diem-thuy-nu';
    title = 'Thanh Phong Đại Việt: Áo Giao Lĩnh & Chân Váy Thủy Ba';
    persona = 'Tiểu thư đài các phong thái nhẹ nhàng, thoát tục';
    advice =
      'Sự kết hợp giữa cổ áo chéo chữ Y giao hòa âm dương cùng chân váy xếp ly xòe sóng nước Thủy Ba tạo nên vẻ đẹp thanh tân, lãng mạn giữa rêu phong Thăng Long.';
    note =
      'Cổ áo vạt trái đè vạt phải (Hữu nhậm) là chuẩn mực cổ phong ngàn năm của người Việt, toát lên tinh thần hào sảng Đại Việt.';
    colors = 'Xanh Lam Ngọc & Chân Váy Đỏ Trầm';
    colorHex = '#1F4E5B';
  } else if (isFolk) {
    topId = 'tu-than';
    bottomId = 'vay-den-kinh-bac-nu';
    accId = 'non-ba-tam-nu';
    title = 'Hồn Quê Quan Họ Kinh Bắc';
    persona = 'Liền chị duyên dáng trẩy hội mùa xuân';
    advice =
      'Áo Tứ Thân bốn vạt lụa the đen hé lộ yếm đào cánh sen bên trong, kết hợp váy đầm lĩnh đen và nón ba tầm quai thao dệt tơ tằm buông rủ ngực.';
    note =
      'Bốn vạt áo tượng trưng cho tứ thân phụ mẫu luôn chở che đùm bọc người con gái.';
    colors = 'The Đen Kinh Bắc & Yếm Đào Cánh Sen';
    colorHex = '#3D342D';
  } else if (isSouth) {
    topId = 'ao-ba-ba-nu';
    bottomId = 'quan-ba-ba-den-nu';
    accId = 'khan-ran-nam-bo';
    title = 'Duyên Dáng Sông Nước Nam Bộ';
    persona = 'Cô gái miệt vườn mộc mạc, tươi tắn, dịu hiền';
    advice =
      'Áo Bà Ba ôm nhẹ tôn vinh nét thon thả, xẻ tà hai bên hông mềm mại, đi cùng nón lá và khăn rằn mộc mạc đậm chất phù sa châu thổ.';
    note =
      'Hàng cúc bấm xà cừ và khăn rằn caro biểu trưng cho tính cách thủy chung, kiên cường của người phương Nam.';
    colors = 'Xanh Lục Tơ Tằm & Khăn Rằn Trắng Đen';
    colorHex = '#2E6F56';
  } else if (isDongSon) {
    topId = 'dong-son';
    bottomId = 'kho-dong-son-nam';
    accId = 'mu-long-chim-dong-son';
    title = 'Hào Khí Lạc Việt Thời Văn Lang';
    persona = 'Dũng sĩ Văn Lang kiêu hãnh bên dòng sông Mẹ';
    advice =
      'Trang phục hoa văn chim Lạc, mặt trời 14 tia và mũ lông chim vút cao tái hiện trọn vẹn hào khí thời các vua Hùng dựng nước.';
    note =
      'Văn hóa Đông Sơn sùng kính thiên nhiên và thần Mặt Trời, khẳng định cội nguồn văn minh rực rỡ của dân tộc.';
    colors = 'Nâu Vỏ Cây Đất Mẹ & Vàng Đồng Cổ';
    colorHex = '#8C5835';
  }

  const topObj = TOPS.find((t) => t.id === topId) || TOPS[0];
  const bottomObj = BOTTOMS.find((b) => b.id === bottomId) || BOTTOMS[0];
  const accObj = ACCESSORIES.find((a) => a.id === accId) || ACCESSORIES[0];

  const analysis = analyzeItemCombination({
    top: topObj,
    bottom: bottomObj,
    accessory: accObj,
    stylingMode,
    prompt,
    topColorHex: colorHex,
  });

  return {
    recommendedTopId: topId,
    recommendedBottomId: bottomId,
    recommendedAccessoryId: accId,
    recommendedColorHex: colorHex,
    colorScheme: colors,
    conceptTitle: title,
    characterPersona: persona,
    aiAdvice: advice,
    culturalNote: note,
    combinationAnalysis: analysis,
    alternatives: {
      classic: {
        title: 'Bản Phối Cổ Phong Chuẩn Điển Chế',
        topId: topId === 'nhat-binh' ? 'nhat-binh' : 'ngu-than',
        bottomId: 'quan-ong-so',
        accessoryId: topId === 'nhat-binh' ? 'man-ngu-sac' : 'khan-dong',
        vibe: 'Chính Thống Hoàng Triều',
        tagline: 'Chuẩn mực lễ nghi trang nghiêm, giữ trọn điển lệ tổ tiên.',
      },
      modernFusion: {
        title: 'Bản Phối Tân Thời Đương Đại',
        topId: 'ngu-than',
        bottomId: 'quan-tay-hien-dai',
        accessoryId: 'quat-lua',
        vibe: 'Neo-Heritage Streetwear',
        tagline: 'Phóng khoáng, tự tin, ứng dụng cao trong đời sống đương đại.',
      },
    },
    nextItemSuggestions: getSmartNextItemSuggestions({
      currentTop: topObj,
      currentBottom: bottomObj,
      currentAccessory: null,
      stylingMode,
    }),
  };
}
