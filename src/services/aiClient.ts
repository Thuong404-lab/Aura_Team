import {
  WardrobeItem,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
} from '../data/vietPhucData';

export interface AiSuggestionResult {
  recommendedTopId: string;
  recommendedBottomId: string;
  recommendedAccessoryId: string;
  colorScheme: string;
  conceptTitle: string;
  characterPersona: string;
  aiAdvice: string;
  culturalNote: string;
}

export interface HarmonyEvaluationResult {
  score: number;
  ratingBadge: string;
  historicalMatchPercent: number;
  colorHarmonyPercent: number;
  contextAestheticPercent: number;
  critiqueTitle: string;
  detailedCritique: string;
  culturalSecret: string;
  stylingTip: string;
}

export interface LookbookStoryResult {
  editionTitle: string;
  subHeadline: string;
  editorialStory: string;
  poetryCouple: string;
  photographerNote: string;
}

// 1. Suggest Outfit (API with immediate intelligent fallback)
export async function getAiSuggestion(prompt: string): Promise<AiSuggestionResult> {
  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.recommendedTopId) {
        return data.data;
      }
    }
  } catch {
    // Non-blocking fallback for static hosting / Vercel static deployments
  }

  // Authoritative Cultural Fallback Logic
  const lower = prompt.toLowerCase();
  let topId = 'ngu-than';
  let bottomId = 'quan-ong-so';
  let accId = 'khan-dong';
  let title = 'Thu Nhật Dạo Phố';
  let persona = 'Nhã sĩ kinh kỳ phong thái ung dung';
  let advice = `Bản phối Áo Ngũ Thân tay chẽn kết hợp quần ống sớ trắng tạo dáng vẻ tao nhã, thoải mái khi dạo bước. Phù hợp cho yêu cầu: "${prompt}".`;
  let note = 'Ngũ thân tượng trưng cho tứ thân phụ mẫu và đạo hiếu làm người với 5 thân áo và 5 đức tính cao đẹp.';

  if (lower.includes('cưới') || lower.includes('hôn') || lower.includes('sang') || lower.includes('cung đình')) {
    topId = 'nhat-binh';
    bottomId = 'quan-men-lam';
    accId = 'man-ngu-sac';
    title = 'Hôn Lễ Vương Triều';
    persona = 'Nữ tử hoàng tộc uy nghi trong ngày đại lễ';
    advice = 'Áo Nhật Bình sắc đỏ chu sa viền cổ thêu ngũ hành kết hợp mấn ngũ sắc tôn vinh tối đa nét đài các trong lễ trọng.';
    note = 'Họa tiết cổ áo hình chữ nhật tượng trưng cho trời đất hòa quyện, gắn liền với chúc phúc trăm năm viên mãn.';
  } else if (lower.includes('lễ') || lower.includes('trang trọng') || lower.includes('chùa') || lower.includes('đền')) {
    topId = 'ao-tac';
    bottomId = 'quan-ong-so';
    accId = 'khan-dong';
    title = 'Nghi Lễ Tôn Nghiêm';
    persona = 'Trưởng tử gia tộc trong tuần tế lễ tổ tiên';
    advice = 'Áo Tấc với tay áo thụ rộng thênh thang mang tính nghi lễ cao nhất của triều Nguyễn, thể hiện sự kính trọng tuyệt đối.';
    note = 'Khi khoanh tay hành lễ, hai vạt tay thụ phủ kín trước ngực biểu trưng cho lòng thành kính vô lượng.';
  } else if (lower.includes('cách tân') || lower.includes('hiện đại') || lower.includes('trẻ') || lower.includes('street')) {
    topId = 'cach-tan';
    bottomId = 'vay-xep-ly';
    accId = 'quat-lua';
    title = 'Tân Phong Giao Hòa';
    persona = 'Nhà thiết kế trẻ phong cách Modern Heritage 2026';
    advice = 'Sự kết hợp giữa phom áo cách tân cùng chân váy dập ly mang lại luồng sinh khí hiện đại nhưng vẫn lưu giữ trọn vẹn hồn cốt cổ phong.';
    note = 'Đường cắt may tối giản tôn vinh đường nét cơ thể mà vẫn giữ kín đáo ý nhị.';
  }

  return {
    recommendedTopId: topId,
    recommendedBottomId: bottomId,
    recommendedAccessoryId: accId,
    colorScheme: 'Sắc thắm Cung đình & Lụa bạch tơ tằm',
    conceptTitle: title,
    characterPersona: persona,
    aiAdvice: advice,
    culturalNote: note,
  };
}

// 2. Harmony Check (API with intelligent fallback)
export async function checkAiHarmony(params: {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  fabricName: string;
  colorName: string;
}): Promise<HarmonyEvaluationResult> {
  const { top, bottom, accessory, fabricName, colorName } = params;

  try {
    const res = await fetch('/api/ai/harmony', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top,
        bottom,
        accessory,
        fabric: fabricName,
        color: colorName,
        era: top.era,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.score) {
        return data.data;
      }
    }
  } catch {
    // Non-blocking fallback
  }

  // Intelligent fallback calculation
  let baseScore = 94;
  if (top.era === bottom.era) baseScore += 2;
  if (top.id === 'nhat-binh' && accessory.id === 'man-ngu-sac') baseScore = 98;
  if (top.id === 'ngu-than' && bottom.id === 'quan-ong-so') baseScore = 97;
  if (top.id === 'cach-tan') baseScore = 93;

  return {
    score: baseScore,
    ratingBadge: baseScore >= 95 ? 'Xuất sắc' : 'Hài Hòa Tinh Tế',
    historicalMatchPercent: baseScore >= 95 ? 97 : 92,
    colorHarmonyPercent: 95,
    contextAestheticPercent: 94,
    critiqueTitle: 'Bản Phối Chuẩn Mực Văn Hóa & Thẩm Mỹ Cổ Phong',
    detailedCritique: `Sự kết hợp giữa ${top.name} cùng ${bottom.name} và ${accessory.name} tạo nên dáng dấp thanh cao, chuẩn mực lễ giáo cổ phong. Màu ${colorName} trên chất liệu ${fabricName} giúp tà áo có độ rủ tự nhiên, tôn vinh vóc dáng.`,
    culturalSecret: top.cultureInfo.symbolism,
    stylingTip: 'Khi tạo dáng, hãy nhẹ nhàng nâng tà áo hoặc cầm quạt lụa nghiêng 45 độ ngang ngực để khoe trọn hoa văn viền cổ áo.',
  };
}

// 3. Lookbook Story (API with intelligent fallback)
export async function getLookbookStory(params: {
  top: WardrobeItem;
  bottom: WardrobeItem;
  accessory: WardrobeItem;
  backdropName: string;
}): Promise<LookbookStoryResult> {
  const { top, bottom, accessory, backdropName } = params;

  try {
    const res = await fetch('/api/ai/lookbook-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top,
        bottom,
        accessory,
        backdropTitle: backdropName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.editionTitle) {
        return data.data;
      }
    }
  } catch {
    // Non-blocking fallback
  }

  return {
    editionTitle: `Dáng Hoa ${top.name}`,
    subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${backdropName}`,
    editorialStory: `Dưới ánh chiều tà phủ bóng trên từng lớp rêu phong, tà ${top.name} phối cùng ${bottom.name} và ${accessory.name} nhẹ lay trong gió như đánh thức ký ức vàng son một thuở. Bản phối không đơn thuần là trang phục, mà là tuyên ngôn của người trẻ tìm về căn cước văn hóa với lòng tự hào kiêu hãnh.`,
    poetryCouple: 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.',
    photographerNote: 'Ánh sáng vàng hoàng hôn góc 30 độ làm nổi bật chất óng ánh của tơ lụa và đường kim mũi chỉ thêu tay.',
  };
}
