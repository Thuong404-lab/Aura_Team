import {
  WardrobeItem,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
} from '../data/vietPhucData';
import { evaluateCulturalRules, CulturalViolation } from '../utils/culturalRules';
import {
  CombinationAnalysis,
  NextItemSuggestion,
  AiSuggestOptions,
  StylingMode,
  StyleAlternative,
  generateIntelligentOutfitSuggestion,
  analyzeItemCombination,
  getSmartNextItemSuggestions,
} from '../utils/combinationAnalyzer';

export type {
  CombinationAnalysis,
  NextItemSuggestion,
  AiSuggestOptions,
  StylingMode,
  StyleAlternative,
};

export interface AiSuggestionResult {
  recommendedTopId: string;
  recommendedBottomId: string;
  recommendedAccessoryId: string;
  recommendedColorHex?: string;
  colorScheme: string;
  conceptTitle: string;
  characterPersona: string;
  aiAdvice: string;
  culturalNote: string;
  combinationAnalysis?: CombinationAnalysis;
  alternatives?: {
    classic: StyleAlternative;
    modernFusion: StyleAlternative;
  };
  nextItemSuggestions?: NextItemSuggestion[];
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
  violations?: CulturalViolation[];
}

export interface LookbookStoryResult {
  editionTitle: string;
  subHeadline: string;
  editorialStory: string;
  poetryCouple: string;
  photographerNote: string;
}

// 1. Suggest Outfit (API with combination analysis based on cultural meaning and modern trends)
export async function getAiSuggestion(
  promptOrOptions: string | AiSuggestOptions,
  maybeOptions?: AiSuggestOptions
): Promise<AiSuggestionResult> {
  const options: AiSuggestOptions =
    typeof promptOrOptions === 'string'
      ? { prompt: promptOrOptions, ...(maybeOptions || {}) }
      : promptOrOptions;

  const promptText = options.prompt || '';

  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptText,
        currentTop: options.currentTop,
        currentBottom: options.currentBottom,
        currentAccessory: options.currentAccessory,
        stylingMode: options.stylingMode || 'auto',
        targetAction: options.targetAction || 'full_outfit',
        topCustomColor: options.topCustomColor,
        bottomCustomColor: options.bottomCustomColor,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.recommendedTopId) {
        // Ensure combinationAnalysis is present even if remote model only returned basic fields
        const result = data.data;
        if (!result.combinationAnalysis) {
          const topObj = TOPS.find((t) => t.id === result.recommendedTopId) || null;
          const bottomObj = BOTTOMS.find((b) => b.id === result.recommendedBottomId) || null;
          const accObj = ACCESSORIES.find((a) => a.id === result.recommendedAccessoryId) || null;
          result.combinationAnalysis = analyzeItemCombination({
            top: topObj,
            bottom: bottomObj,
            accessory: accObj,
            stylingMode: options.stylingMode,
            prompt: promptText,
          });
        }
        if (!result.nextItemSuggestions) {
          const topObj = TOPS.find((t) => t.id === result.recommendedTopId) || null;
          result.nextItemSuggestions = getSmartNextItemSuggestions({
            currentTop: topObj,
            currentBottom: null,
            currentAccessory: null,
            stylingMode: options.stylingMode,
          });
        }
        return result;
      }
    }
  } catch {
    // Non-blocking fallback for preview / offline
  }

  // Fallback to high-fidelity dynamic algorithmic combination analyzer
  return generateIntelligentOutfitSuggestion(options);
}

// 2. Harmony Check (API with comprehensive Cultural Rules Engine integration)
export async function checkAiHarmony(params: {
  top: WardrobeItem | null;
  bottom: WardrobeItem | null;
  accessory: WardrobeItem | null;
  fabricName?: string;
  colorName?: string;
  topCustomColor?: string;
  bottomCustomColor?: string;
}): Promise<HarmonyEvaluationResult> {
  const { top, bottom, accessory, topCustomColor, bottomCustomColor } = params;

  // Run comprehensive Cultural Rules Evaluator
  const evaluated = evaluateCulturalRules({
    top,
    bottom,
    accessory,
    topColorHex: topCustomColor,
    bottomColorHex: bottomCustomColor,
  });

  try {
    const res = await fetch('/api/ai/harmony', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top,
        bottom,
        accessory,
        fabric: params.fabricName,
        color: params.colorName,
        era: top?.era,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.score) {
        // If there are cultural violations, penalize the external score
        const finalScore = evaluated.violations.length > 0
          ? Math.min(data.data.score, evaluated.totalScore)
          : data.data.score;
        return {
          ...data.data,
          score: finalScore,
          violations: evaluated.violations,
        };
      }
    }
  } catch {
    // Fallback to local evaluated results
  }

  return {
    score: evaluated.totalScore,
    ratingBadge: evaluated.ratingBadge,
    historicalMatchPercent: evaluated.eraMatchScore,
    colorHarmonyPercent: evaluated.fiveElementsScore,
    contextAestheticPercent: evaluated.aestheticScore,
    critiqueTitle: evaluated.critiqueTitle,
    detailedCritique: evaluated.detailedCritique,
    culturalSecret: evaluated.culturalSecret,
    stylingTip: evaluated.stylingTip,
    violations: evaluated.violations,
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

  // Cultural fallback reflecting exact historical hallmarks
  const isNhatBinh = top.id === 'nhat-binh';
  const isGiaoLinh = top.id === 'giao-linh';
  const isAoTac = top.id === 'ao-tac';

  let customStory = `Dưới bóng tường thành rêu phong tại ${backdropName}, tà ${top.name} buông suông dáng chữ A đáy thúng thanh thoát, tôn vinh đường sống áo mũi gáy trung chính và năm cúc cài ngũ thường mẫu mực. Bản phối cùng ${bottom.name} và ${accessory.name} giữ vẹn nguyên quy cách quần hai ống thanh tao, hòa quyện kiêu hãnh giữa dòng chảy đương đại.`;
  let customCouplet = 'Áo xưa khép vạt mây hồng lượn / Bước khẽ nghiêng chào bóng cố đô.';

  if (isNhatBinh) {
    customStory = `Áo Nhật Bình sắc son quyền quý với khung cổ chữ nhật uy nghi và dải ngũ sắc ngũ hành rực rỡ nơi cửa tay bừng sáng tại ${backdropName}. Từng đường kim mũi chỉ thêu phượng hoàng và hoa sen tái hiện đỉnh cao phẩm phục cung đình triều Nguyễn.`;
    customCouplet = 'Cổ Nhật đóng khung nghìn thu sáng / Tay dải ngũ hành rực bóng hoa.';
  } else if (isGiaoLinh) {
    customStory = `Áo Giao Lĩnh với vạt trái đè vạt phải kết chữ Y tự nhiên, tà áo buông lơi thênh thang mang đậm hào khí Đông A và phong vị thiền định thời Lý - Trần. Bản phối mộc mạc kín đáo, hoàn toàn thoát khỏi sự gò bó siết eo ngoại lai.`;
    customCouplet = 'Cổ chéo chữ Y khai chính đạo / Tà buông lơi gió thoảng kinh kỳ.';
  } else if (isAoTac) {
    customStory = `Áo Tấc tay thụng rộng thênh thang biểu trưng cho đạo lý Tứ thân phụ mẫu che chở vạt con khiêm nhu. Khi hai tay chắp trang nghiêm trước ngực, hai tà tay thụng phủ kín đoan trang, thể hiện trọn vẹn lòng thành kính tôn ti trật tự gia tộc.`;
    customCouplet = 'Tay thụng nâng tà nghiêng kính tổ / Ngũ thân trọn vẹn đức khiêm cung.';
  }

  return {
    editionTitle: `Dáng Hoa ${top.name}`,
    subHeadline: `Bản giao hưởng giữa ngàn năm di sản và nhịp thở đương đại tại ${backdropName}`,
    editorialStory: customStory,
    poetryCouple: customCouplet,
    photographerNote: 'Ánh sáng vàng hoàng hôn góc 30 độ làm nổi bật chất óng ánh của tơ lụa, đường sống áo mũi gáy và hoa văn thêu tay.',
  };
}
