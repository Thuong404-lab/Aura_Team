import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
  COLOR_PALETTES,
  FABRICS,
} from '../data/vietPhucData';
import { AvatarModel } from './AvatarModel';
import { FabricMotifInspectorModal } from './FabricMotifInspectorModal';
import { useAppTheme } from '../context/ThemeContext';
import {
  SilkCategoryTabs,
  SilkTabItem,
  SilkWaveRibbon,
} from './SilkMotionElements';
import {
  DongSonDrumMandala,
  CoPhongCloud,
} from './VietnameseDecorativeElements';
import {
  Sparkles,
  Info,
  Check,
  Palette,
  Shirt,
  Layers,
  Crown,
  BookOpen,
  ArrowRight,
  Loader2,
  Waves,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  X,
  Wand2,
  Zap,
  CheckCircle2,
  Search,
  Scroll,
  TrendingUp,
  Compass,
  ChevronDown,
  ChevronUp,
  Scan,
  ZoomIn,
} from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import {
  checkAiHarmony,
  getAiSuggestion,
  HarmonyEvaluationResult,
  AiSuggestionResult,
  StylingMode,
} from '../services/aiClient';
import {
  analyzeItemCombination,
  getSmartNextItemSuggestions,
  CombinationAnalysis,
  NextItemSuggestion,
} from '../utils/combinationAnalyzer';
import {
  evaluateCulturalRules,
  CulturalViolation,
  CULTURAL_TABOOS_DATABASE,
  CulturalTabooRule,
  TabooCategory,
  getAllCulturalTabooRules,
} from '../utils/culturalRules';

export type HarmonyResult = HarmonyEvaluationResult;

interface FittingRoomScreenProps {
  currentTop: WardrobeItem | null;
  currentBottom: WardrobeItem | null;
  currentAccessory: WardrobeItem | null;
  currentFabric?: FabricOption;
  currentColor: ColorOption;
  topCustomColor?: string;
  bottomCustomColor?: string;
  onSelectTop: (item: WardrobeItem | null) => void;
  onSelectBottom: (item: WardrobeItem | null) => void;
  onSelectAccessory: (item: WardrobeItem | null) => void;
  onSelectFabric?: (fabric: FabricOption) => void;
  onSelectColor: (color: ColorOption) => void;
  onSelectTopColor: (colorHex: string) => void;
  onSelectBottomColor: (colorHex: string) => void;
  onGoHome: () => void;
  onGoLookbook: (harmonyData?: HarmonyResult) => void;
}

// Quick Heritage Color Swatches for instant recoloring
const QUICK_HERITAGE_SWATCHES = [
  { name: 'Đỏ Chu Sa', hex: '#B31D28' },
  { name: 'Xanh Chàm', hex: '#162544' },
  { name: 'Vàng Hoàng Kim', hex: '#D4AF37' },
  { name: 'Lụa Bạch', hex: '#FAF7F0' },
  { name: 'Men Lam Cố Đô', hex: '#1F4E5B' },
  { name: 'Tím Hoàng Gia', hex: '#54254E' },
  { name: 'The Đen', hex: '#1A1817' },
  { name: 'Hồng Sen Đào', hex: '#C53030' },
];

// Real-World Practical Scenarios for AI Suggestions
const REAL_WORLD_SCENARIOS = [
  { label: '🌸 Đám Cưới / Ăn Hỏi', query: 'Gợi ý lễ phục đám cưới truyền thống trang trọng, rạng rỡ' },
  { label: '🛕 Đi Lễ Chùa / Đền Phủ', query: 'Gợi ý trang phục đi lễ chùa, đền phủ kín đáo, thanh tịnh, tôn nghiêm' },
  { label: '🏮 Dạo Phố Cổ Hội An & Hà Nội', query: 'Gợi ý bộ cổ phục thanh tao, nhẹ nhàng để dạo phố cổ chụp ảnh' },
  { label: '🌾 Hội Lim / Dân Gian Quan Họ', query: 'Gợi ý trang phục hát Quan họ Kinh Bắc trẩy hội mùa xuân' },
  { label: '🏛️ Đại Triều Cung Đình Huế', query: 'Gợi ý trang phục hoàng tộc, đại triều cung đình triều Nguyễn' },
  { label: '🥥 Duyên Dáng Sông Nước', query: 'Gợi ý áo bà ba Nam Bộ duyên dáng, mộc mạc sông nước' },
  { label: '🥁 Hào Khí Cội Nguồn Đền Hùng', query: 'Gợi ý trang phục Đông Sơn cội nguồn thời Văn Lang' },
];

export const FittingRoomScreen: React.FC<FittingRoomScreenProps> = ({
  currentTop,
  currentBottom,
  currentAccessory,
  currentFabric = FABRICS[1],
  currentColor,
  topCustomColor,
  bottomCustomColor,
  onSelectTop,
  onSelectBottom,
  onSelectAccessory,
  onSelectFabric,
  onSelectColor,
  onSelectTopColor,
  onSelectBottomColor,
  onGoHome,
  onGoLookbook,
}) => {
  const { theme } = useAppTheme();
  const isCream = theme === 'cream';

  // Navigation Tabs for Wardrobe
  const [activeTab, setActiveTab] = useState<'top' | 'bottom' | 'accessory' | 'color' | 'fabric'>('top');

  // Fabric Motif & Texture Inspector modal state
  const [showFabricInspector, setShowFabricInspector] = useState<boolean>(false);

  // Filters for Era and Gender
  const [eraFilter, setEraFilter] = useState<'all' | 'nguyen' | 'le' | 'tran'>('all');
  const [genderFilter, setGenderFilter] = useState<'nam' | 'nu' | 'unisex' | undefined>(undefined);

  // Auto-sync gender filter when top is chosen
  useEffect(() => {
    if (currentTop?.gender && currentTop.gender !== 'unisex') {
      setGenderFilter(currentTop.gender);
    }
  }, [currentTop?.id]);

  const [hoveredItem, setHoveredItem] = useState<WardrobeItem | null>(null);

  // AI Assistant prompt bar state
  const [aiPrompt, setAiPrompt] = useState<string>('Gợi ý cho tôi một bộ đi dạo phố mùa thu, thanh lịch...');
  const [isAiSuggesting, setIsAiSuggesting] = useState<boolean>(false);
  const [isCheckingHarmony, setIsCheckingHarmony] = useState<boolean>(false);

  // Cultural Taboo Database modal & filters
  const [showTabooDatabaseModal, setShowTabooDatabaseModal] = useState<boolean>(false);
  const [tabooCategoryFilter, setTabooCategoryFilter] = useState<string>('all');
  const [tabooSearchQuery, setTabooSearchQuery] = useState<string>('');

  // Toast feedback state for Auto-Fix actions
  const [fixToastMessage, setFixToastMessage] = useState<string | null>(null);

  // Workspace View Mode: 'wardrobe' | 'ai_stylist' | 'taboo_audit'
  const [workspaceView, setWorkspaceView] = useState<'wardrobe' | 'ai_stylist' | 'taboo_audit'>('wardrobe');

  // Dynamic AI Combination Analysis State & Styling Mode
  const [stylingMode, setStylingMode] = useState<StylingMode>('auto');
  const [latestAiAnalysis, setLatestAiAnalysis] = useState<AiSuggestionResult | null>(null);
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState<boolean>(true);

  // Active color values
  const activeTopHex = topCustomColor || currentTop?.defaultColorHex || currentColor.hex;
  const activeBottomHex = bottomCustomColor || currentBottom?.defaultColorHex || '#FAF7F0';

  // Dynamic Combination Analysis derived from current items or latest AI run
  const dynamicCombinationAnalysis: CombinationAnalysis =
    latestAiAnalysis?.combinationAnalysis ||
    analyzeItemCombination({
      top: currentTop,
      bottom: currentBottom,
      accessory: currentAccessory,
      stylingMode,
      topColorHex: activeTopHex,
      bottomColorHex: activeBottomHex,
    });

  // Next-Item recommendations for completing current look
  const smartNextItems: NextItemSuggestion[] = getSmartNextItemSuggestions({
    currentTop,
    currentBottom,
    currentAccessory,
    stylingMode,
  });

  // Live Cultural Rules Evaluation (Continuous real-time comparison with Cultural Taboo Database)
  const culturalRulesData = evaluateCulturalRules({
    top: currentTop,
    bottom: currentBottom,
    accessory: currentAccessory,
    topColorHex: activeTopHex,
    bottomColorHex: activeBottomHex,
  });

  // Harmony Evaluation State
  const [harmonyResult, setHarmonyResult] = useState<HarmonyResult>({
    score: culturalRulesData.totalScore || 95,
    ratingBadge: culturalRulesData.ratingBadge || 'Hài Hòa Di Sản',
    historicalMatchPercent: culturalRulesData.eraMatchScore || 95,
    colorHarmonyPercent: culturalRulesData.fiveElementsScore || 94,
    contextAestheticPercent: culturalRulesData.aestheticScore || 95,
    critiqueTitle: culturalRulesData.critiqueTitle,
    detailedCritique: culturalRulesData.detailedCritique,
    culturalSecret: culturalRulesData.culturalSecret,
    stylingTip: culturalRulesData.stylingTip,
    violations: culturalRulesData.violations,
  });

  // Update harmony score when wardrobe changes
  useEffect(() => {
    setHarmonyResult((prev) => ({
      ...prev,
      score: culturalRulesData.totalScore,
      ratingBadge: culturalRulesData.ratingBadge,
      historicalMatchPercent: culturalRulesData.eraMatchScore,
      colorHarmonyPercent: culturalRulesData.fiveElementsScore,
      contextAestheticPercent: culturalRulesData.aestheticScore,
      critiqueTitle: culturalRulesData.critiqueTitle,
      detailedCritique: culturalRulesData.detailedCritique,
      culturalSecret: culturalRulesData.culturalSecret,
      stylingTip: culturalRulesData.stylingTip,
      violations: culturalRulesData.violations,
    }));
  }, [
    currentTop?.id,
    currentBottom?.id,
    currentAccessory?.id,
    topCustomColor,
    bottomCustomColor,
  ]);

  // Scroll smoothly to warning panel when clicking avatar alert badge
  const scrollToTabooWarning = () => {
    setWorkspaceView('wardrobe');
    setTimeout(() => {
      const el = document.getElementById('cultural-taboo-warning-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-rose-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-rose-500'), 1500);
      }
    }, 100);
  };

  // Filter wardrobe items by era and gender
  const getFilteredItems = (items: WardrobeItem[]) => {
    let list = items;
    if (eraFilter !== 'all') {
      if (eraFilter === 'nguyen') {
        list = list.filter(
          (i) =>
            i.era.toLowerCase().includes('nguyễn') ||
            i.id.includes('ngu-than') ||
            i.id.includes('tac') ||
            i.id.includes('nhat-binh')
        );
      } else if (eraFilter === 'le') {
        list = list.filter(
          (i) =>
            i.era.toLowerCase().includes('lê') ||
            i.id.includes('giao-linh') ||
            i.id.includes('vien-linh') ||
            i.id.includes('doi-kham')
        );
      } else if (eraFilter === 'tran') {
        list = list.filter(
          (i) =>
            i.era.toLowerCase().includes('trần') ||
            i.era.toLowerCase().includes('lý') ||
            i.id.includes('dong-son')
        );
      }
    }
    if (genderFilter) {
      list = list.filter((i) => !i.gender || i.gender === genderFilter || i.gender === 'unisex');
    }
    return list;
  };

  // Run AI Suggestion with full dynamic combination analysis
  const handleAiSuggest = async (
    customPrompt?: string,
    mode?: StylingMode,
    action: 'full_outfit' | 'complete_current' | 'modernize_current' = 'full_outfit'
  ) => {
    const textToRun = customPrompt !== undefined ? customPrompt : aiPrompt;
    const activeMode = mode !== undefined ? mode : stylingMode;
    soundEngine.playPluck(587.33);
    setIsAiSuggesting(true);

    try {
      const res = await getAiSuggestion({
        prompt: textToRun,
        currentTop,
        currentBottom,
        currentAccessory,
        stylingMode: activeMode,
        targetAction: action,
        topCustomColor,
        bottomCustomColor,
      });

      setLatestAiAnalysis(res);

      const topItem = TOPS.find((t) => t.id === res.recommendedTopId);
      const bottomItem = BOTTOMS.find((b) => b.id === res.recommendedBottomId);
      const accItem = ACCESSORIES.find((a) => a.id === res.recommendedAccessoryId);

      // If action is complete_current and user already has a top, keep it
      if (action !== 'complete_current' || !currentTop) {
        if (topItem) onSelectTop(topItem);
      }
      if (bottomItem) onSelectBottom(bottomItem);
      if (accItem) onSelectAccessory(accItem);

      if (res.recommendedColorHex) {
        onSelectTopColor(res.recommendedColorHex);
      }

      // Re-evaluate cultural rules for recommended set
      const evalRules = evaluateCulturalRules({
        top: action === 'complete_current' && currentTop ? currentTop : topItem || null,
        bottom: bottomItem || null,
        accessory: accItem || null,
        topColorHex: res.recommendedColorHex || activeTopHex,
        bottomColorHex: activeBottomHex,
      });

      setHarmonyResult({
        score: evalRules.totalScore,
        ratingBadge: evalRules.ratingBadge,
        historicalMatchPercent: evalRules.eraMatchScore,
        colorHarmonyPercent: evalRules.fiveElementsScore,
        contextAestheticPercent: evalRules.aestheticScore,
        critiqueTitle: `${res.conceptTitle} (${evalRules.totalScore} điểm)`,
        detailedCritique: res.aiAdvice,
        culturalSecret: res.culturalNote,
        stylingTip: evalRules.stylingTip,
        violations: evalRules.violations,
      });

      setFixToastMessage(`✨ Đã phân tích & áp dụng: ${res.conceptTitle}`);
      setTimeout(() => setFixToastMessage(null), 3500);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  // 1-Click apply alternative look (Classic vs Modern Fusion)
  const handleApplyAlternative = (alt: {
    topId: string;
    bottomId: string;
    accessoryId: string;
    title: string;
  }) => {
    soundEngine.playCloudPartChime();
    const t = TOPS.find((i) => i.id === alt.topId);
    const b = BOTTOMS.find((i) => i.id === alt.bottomId);
    const a = ACCESSORIES.find((i) => i.id === alt.accessoryId);
    if (t) onSelectTop(t);
    if (b) onSelectBottom(b);
    if (a) onSelectAccessory(a);
    setFixToastMessage(`✨ Đã chuyển sang bản phối: ${alt.title}`);
    setTimeout(() => setFixToastMessage(null), 3000);
  };

  // 1-Click equip smart next item
  const handleEquipNextItem = (item: WardrobeItem) => {
    soundEngine.playPluck(659.25);
    if (item.category === 'top') onSelectTop(item);
    if (item.category === 'bottom') onSelectBottom(item);
    if (item.category === 'accessory') onSelectAccessory(item);
    setFixToastMessage(`✨ Đã trang bị thêm: ${item.name}`);
    setTimeout(() => setFixToastMessage(null), 2500);
  };

  // Auto-Fix Cultural Violation with 1-touch
  const handleAutoFixViolation = (violation: CulturalViolation) => {
    soundEngine.playCloudPartChime();
    if (!violation.autoFixAction) return;

    if (violation.autoFixAction.type === 'replace_bottom' && violation.autoFixAction.targetId) {
      const replacement = BOTTOMS.find((b) => b.id === violation.autoFixAction?.targetId);
      if (replacement) onSelectBottom(replacement);
    } else if (violation.autoFixAction.type === 'replace_accessory' && violation.autoFixAction.targetId) {
      const replacement = ACCESSORIES.find((a) => a.id === violation.autoFixAction?.targetId);
      if (replacement) onSelectAccessory(replacement);
    } else if (violation.autoFixAction.type === 'replace_top' && violation.autoFixAction.targetId) {
      const replacement = TOPS.find((t) => t.id === violation.autoFixAction?.targetId);
      if (replacement) onSelectTop(replacement);
    } else if (violation.autoFixAction.type === 'replace_color_top' && violation.autoFixAction.targetColorHex) {
      onSelectTopColor(violation.autoFixAction.targetColorHex);
    } else if (violation.autoFixAction.type === 'replace_color_bottom' && violation.autoFixAction.targetColorHex) {
      onSelectBottomColor(violation.autoFixAction.targetColorHex);
    }

    const msg =
      violation.autoFixDescription ||
      violation.autoFixLabel ||
      'Đã tự động hiệu chỉnh y phục chuẩn mực di sản!';
    setFixToastMessage(msg);
    setTimeout(() => setFixToastMessage(null), 3500);
  };

  // Auto-Fix all violations at once
  const handleAutoFixAll = () => {
    if (culturalRulesData.violations.length === 0) return;
    soundEngine.playCloudPartChime();

    culturalRulesData.violations.forEach((violation) => {
      if (!violation.autoFixAction) return;
      if (violation.autoFixAction.type === 'replace_bottom' && violation.autoFixAction.targetId) {
        const replacement = BOTTOMS.find((b) => b.id === violation.autoFixAction?.targetId);
        if (replacement) onSelectBottom(replacement);
      } else if (violation.autoFixAction.type === 'replace_accessory' && violation.autoFixAction.targetId) {
        const replacement = ACCESSORIES.find((a) => a.id === violation.autoFixAction?.targetId);
        if (replacement) onSelectAccessory(replacement);
      } else if (violation.autoFixAction.type === 'replace_top' && violation.autoFixAction.targetId) {
        const replacement = TOPS.find((t) => t.id === violation.autoFixAction?.targetId);
        if (replacement) onSelectTop(replacement);
      } else if (violation.autoFixAction.type === 'replace_color_top' && violation.autoFixAction.targetColorHex) {
        onSelectTopColor(violation.autoFixAction.targetColorHex);
      } else if (violation.autoFixAction.type === 'replace_color_bottom' && violation.autoFixAction.targetColorHex) {
        onSelectBottomColor(violation.autoFixAction.targetColorHex);
      }
    });

    setFixToastMessage(`Đã chuẩn hóa toàn bộ ${culturalRulesData.violations.length} quy tắc cấm kỵ!`);
    setTimeout(() => setFixToastMessage(null), 3500);
  };

  // Test a specific taboo rule (for educational experimentation)
  const handleTestTaboo = (rule: CulturalTabooRule) => {
    soundEngine.playPluck(440);
    // Preset outfits that trigger this taboo
    if (rule.id === 'taboo-ngu-than-quan-tay') {
      const top = TOPS.find((t) => t.id === 'ngu-than');
      const bot = BOTTOMS.find((b) => b.id === 'quan-tay-hien-dai');
      if (top) onSelectTop(top);
      if (bot) onSelectBottom(bot);
    } else if (rule.id === 'taboo-nhat-binh-khan-ran') {
      const top = TOPS.find((t) => t.id === 'nhat-binh-cung-dinh');
      const acc = ACCESSORIES.find((a) => a.id === 'khan-ran-nam-bo');
      if (top) onSelectTop(top);
      if (acc) onSelectAccessory(acc);
    } else if (rule.id === 'taboo-nhat-binh-non-ba-tam') {
      const top = TOPS.find((t) => t.id === 'nhat-binh-cung-dinh');
      const acc = ACCESSORIES.find((a) => a.id === 'non-ba-tam');
      if (top) onSelectTop(top);
      if (acc) onSelectAccessory(acc);
    } else if (rule.id === 'taboo-tu-than-quan-tay') {
      const top = TOPS.find((t) => t.id === 'tu-than');
      const bot = BOTTOMS.find((b) => b.id === 'quan-tay-hien-dai');
      if (top) onSelectTop(top);
      if (bot) onSelectBottom(bot);
    } else if (rule.id === 'taboo-dong-son-mismatch') {
      const top = TOPS.find((t) => t.id === 'le-phuc-dong-son');
      const acc = ACCESSORIES.find((a) => a.id === 'khan-dong');
      if (top) onSelectTop(top);
      if (acc) onSelectAccessory(acc);
    } else if (rule.id === 'taboo-no-bottom-unequipped') {
      const top = TOPS.find((t) => t.id === 'ngu-than');
      if (top) onSelectTop(top);
      onSelectBottom(null);
    }
    setShowTabooDatabaseModal(false);
  };

  // Clear all garments (Return to Bare Mannequin)
  const handleClearAll = () => {
    soundEngine.playPluck(392);
    onSelectTop(null);
    onSelectBottom(null);
    onSelectAccessory(null);
    onSelectTopColor('');
    onSelectBottomColor('');
    setFixToastMessage('Đã chuyển về khung ma nơ canh mộc.');
    setTimeout(() => setFixToastMessage(null), 2500);
  };

  // Run AI Harmony Check
  const handleCheckHarmony = async () => {
    soundEngine.playPluck(783.99);
    setIsCheckingHarmony(true);
    setWorkspaceView('ai_stylist');

    try {
      const evaluation = await checkAiHarmony({
        top: currentTop,
        bottom: currentBottom,
        accessory: currentAccessory,
        colorName: currentColor.name,
        topCustomColor,
        bottomCustomColor,
      });

      setHarmonyResult(evaluation);
      setFixToastMessage(`✨ Đã chấm điểm AI: ${evaluation.score}/100 - ${evaluation.ratingBadge}`);
      setTimeout(() => setFixToastMessage(null), 3000);
    } finally {
      setIsCheckingHarmony(false);
    }
  };

  const handleSaveToLookbook = () => {
    soundEngine.playPluck(523.25);
    onGoLookbook(harmonyResult);
  };

  // Filtered Cultural Taboo Rules for the Database Modal
  const allTabooRules = getAllCulturalTabooRules();
  const filteredTabooRules = allTabooRules.filter((rule) => {
    if (tabooCategoryFilter !== 'all' && rule.category !== tabooCategoryFilter) return false;
    if (tabooSearchQuery.trim()) {
      const query = tabooSearchQuery.toLowerCase();
      const match =
        rule.title.toLowerCase().includes(query) ||
        rule.code.toLowerCase().includes(query) ||
        rule.description.toLowerCase().includes(query) ||
        rule.historicalCitation.toLowerCase().includes(query) ||
        rule.badCombinationSummary.toLowerCase().includes(query) ||
        rule.categoryName.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const categoryTabs: SilkTabItem[] = [
    {
      id: 'top',
      label: 'Áo Cổ Phục',
      icon: <Shirt className="w-4 h-4" />,
      count: TOPS.length,
    },
    {
      id: 'bottom',
      label: 'Quần & Váy',
      icon: <Layers className="w-4 h-4" />,
      count: BOTTOMS.length,
    },
    {
      id: 'accessory',
      label: 'Phụ Kiện',
      icon: <Crown className="w-4 h-4" />,
      count: ACCESSORIES.length,
    },
    {
      id: 'color',
      label: 'Bảng Màu Ngũ Hành',
      icon: <Palette className="w-4 h-4" />,
      count: COLOR_PALETTES.length,
    },
    {
      id: 'fabric',
      label: 'Chất Liệu Gấm Lụa',
      icon: <Waves className="w-4 h-4" />,
      count: FABRICS.length,
    },
  ];

  const hasCriticalViolations = culturalRulesData.violations.some((v) => v.severity === 'critical');

  return (
    <div className={`min-h-screen w-full flex flex-col relative overflow-x-hidden font-sans-vi transition-colors duration-300 ${
      isCream ? 'bg-[#FAF7F0] text-stone-900' : 'bg-[#0A0E17] text-slate-100'
    }`}>
      {/* Toast Notification upon Auto-Fix */}
      <AnimatePresence>
        {fixToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-2xl flex items-center gap-2.5 backdrop-blur-md ${
              isCream
                ? 'bg-white/95 border-amber-400 text-amber-900 shadow-[0_10px_30px_rgba(180,130,60,0.15)]'
                : 'bg-[#140D14]/95 border border-amber-400 text-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>{fixToastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Traditional Motifs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isCream ? 'opacity-0' : 'bg-gradient-to-b from-[#0D1424] via-[#090D17] to-[#060910]'
        }`} />
        <div className="absolute -bottom-36 -left-36 opacity-25">
          <DongSonDrumMandala className="w-[520px] h-[520px]" opacity={isCream ? 0.45 : 0.3} />
        </div>
        <div className="absolute top-12 left-8 opacity-30">
          <CoPhongCloud className="w-48 h-28" />
        </div>
        <div className="absolute top-16 right-12 opacity-25">
          <CoPhongCloud className="w-56 h-32" flipX />
        </div>
      </div>

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header Breadcrumbs & Action Bar */}
        <div className="w-full mb-3 md:mb-5 text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                KHÔNG GIAN THỬ ĐỒ DI SẢN 2D
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-vi text-amber-200 tracking-wide mt-1">
              Phòng Thử Cổ Phục & Kiểm Tra Quy Chuẩn
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Taboo Database Modal Trigger Button */}
            <button
              onClick={() => {
                soundEngine.playPluck(440);
                setShowTabooDatabaseModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-[#1C1625] to-amber-950/70 hover:from-amber-900/90 hover:to-amber-950/90 text-amber-300 hover:text-amber-100 border border-amber-400/50 hover:border-amber-300 text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Mở Đại Điển Cấm Kỵ Cổ Phục để xem toàn bộ 13 quy chuẩn lịch sử"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              <span>Đại Điển Cấm Kỵ (13 Quy Tắc)</span>
            </button>

            {/* Clear All / Bare Mannequin Button */}
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-400/60 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Tháo hết y phục về trạng thái ma nơ canh mộc để mặc lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              <span>Cởi Hết (Khung Mộc)</span>
            </button>

            {/* Back Home */}
            <button
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>

        {/* Workspace 2-Column Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 items-start">
          {/* ==========================================================
              LEFT COLUMN: Live 2D Mannequin Visualizer & Quick Wardrobe Bar
             ========================================================== */}
          <div className="w-full lg:sticky lg:top-20 flex flex-col gap-3.5 self-start">
            <div className={`relative w-full aspect-4/5 sm:aspect-3/4 max-h-[580px] rounded-3xl border p-2 sm:p-4 flex items-center justify-center shadow-2xl overflow-hidden group transition-all duration-300 ${
              isCream
                ? 'bg-radial from-[#FFFDF9] via-[#F8F3E8] to-[#EFE5D0] border-amber-400/50 shadow-[0_16px_45px_rgba(180,130,60,0.12)]'
                : 'bg-radial from-[#121A2C] via-[#0D1322] to-[#080C16] border-amber-500/30'
            }`}>
              <AvatarModel
                top={currentTop}
                bottom={currentBottom}
                accessory={currentAccessory}
                fabric={currentFabric}
                topCustomColor={activeTopHex}
                bottomCustomColor={activeBottomHex}
                harmonyScore={harmonyResult.score}
                harmonyBadge={harmonyResult.ratingBadge}
                harmonyCritique={harmonyResult.detailedCritique}
                hoveredItem={hoveredItem}
                onViolationClick={scrollToTabooWarning}
              />

              {/* Floating Macro Fabric & Motif Inspector Trigger Button */}
              <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
                <button
                  onClick={() => {
                    soundEngine.playPluck(523.25);
                    setShowFabricInspector(true);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    isCream
                      ? 'bg-white hover:bg-amber-50 border-amber-400 text-amber-900 shadow-[0_4px_16px_rgba(180,130,60,0.15)]'
                      : 'bg-[#162035]/90 hover:bg-[#1E2D4A] border-amber-400/80 hover:border-amber-300 text-amber-200'
                  }`}
                  title="Phóng to xem cận cảnh chi tiết thêu tay, vân gấm và họa tiết chìm"
                >
                  <Scan className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} animate-pulse`} />
                  <span>Soi Cận Cảnh Vải (1x - 8x)</span>
                </button>
                <div className={`px-2 py-0.5 rounded-md border text-[9.5px] backdrop-blur-xs font-mono ${
                  isCream ? 'bg-amber-50 border-amber-200 text-stone-700' : 'bg-black/60 border-slate-700/60 text-slate-300'
                }`}>
                  {currentFabric?.name || FABRICS[1].name}
                </div>
              </div>
            </div>

            {/* Currently Equipped Slots Summary */}
            <div className={`w-full p-2.5 rounded-2xl border flex items-center justify-between gap-2 flex-wrap text-xs transition-colors ${
              isCream ? 'bg-white border-amber-200/90 shadow-sm' : 'bg-[#0F1626]/90 border border-slate-800'
            }`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-medium ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>Đang mặc:</span>
                {/* Top slot */}
                {currentTop ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isCream
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}>
                    <span className="font-serif-vi font-semibold text-xs leading-tight">{currentTop.name}</span>
                    <button
                      onClick={() => onSelectTop(null)}
                      className={`cursor-pointer p-0.5 rounded-full ${
                        isCream ? 'text-amber-800 hover:bg-amber-200' : 'text-amber-400/70 hover:text-amber-200 hover:bg-amber-400/20'
                      }`}
                      title="Cởi áo này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-lg border border-dashed text-[11px] ${
                    isCream ? 'bg-stone-100/70 border-stone-300 text-stone-500' : 'bg-slate-900/60 border-slate-700 text-slate-500'
                  }`}>
                    Chưa mặc áo
                  </span>
                )}

                {/* Bottom slot */}
                {currentBottom ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isCream
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}>
                    <span className="font-serif-vi font-semibold text-xs leading-tight">{currentBottom.name}</span>
                    <button
                      onClick={() => onSelectBottom(null)}
                      className={`cursor-pointer p-0.5 rounded-full ${
                        isCream ? 'text-amber-800 hover:bg-amber-200' : 'text-amber-400/70 hover:text-amber-200 hover:bg-amber-400/20'
                      }`}
                      title="Cởi quần/váy này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-lg border border-dashed text-[11px] ${
                    isCream ? 'bg-stone-100/70 border-stone-300 text-stone-500' : 'bg-slate-900/60 border-slate-700 text-slate-500'
                  }`}>
                    Chưa mặc hạ y
                  </span>
                )}

                {/* Accessory slot */}
                {currentAccessory ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                    isCream
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}>
                    <span className="font-serif-vi font-semibold text-xs leading-tight">{currentAccessory.name}</span>
                    <button
                      onClick={() => onSelectAccessory(null)}
                      className={`cursor-pointer p-0.5 rounded-full ${
                        isCream ? 'text-amber-800 hover:bg-amber-200' : 'text-amber-400/70 hover:text-amber-200 hover:bg-amber-400/20'
                      }`}
                      title="Gỡ phụ kiện này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 rounded-lg border border-dashed text-[11px] ${
                    isCream ? 'bg-stone-100/70 border-stone-300 text-stone-500' : 'bg-slate-900/60 border-slate-700 text-slate-500'
                  }`}>
                    Chưa đeo phụ kiện
                  </span>
                )}
              </div>

              {/* Color Indicators */}
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                  style={{ backgroundColor: activeTopHex }}
                  title={`Màu áo: ${activeTopHex}`}
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                  style={{ backgroundColor: activeBottomHex }}
                  title={`Màu hạ y: ${activeBottomHex}`}
                />
              </div>
            </div>
          </div>

          {/* ==========================================================
              RIGHT COLUMN: Controls, AI Real-World Suggester, Rules & Wardrobe
             ========================================================== */}
          <div className="w-full flex flex-col gap-3.5 text-left">
            {/* 1. WORKSPACE VIEW SWITCHER TABS: Tủ Đồ vs Trợ Lý AI */}
            <div className={`flex items-center justify-between p-1.5 rounded-2xl gap-1.5 shadow-md shrink-0 border ${
              isCream ? 'bg-amber-100/70 border-amber-300/80 shadow-xs' : 'bg-[#0D1525] border-amber-500/30'
            }`}>
              <button
                onClick={() => {
                  soundEngine.playPluck(523.25);
                  setWorkspaceView('wardrobe');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  workspaceView === 'wardrobe'
                    ? isCream
                      ? 'bg-white text-amber-950 border border-amber-400 shadow-sm'
                      : 'bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-600/30 text-amber-200 border border-amber-400/70 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shirt className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>👘 1. Tủ Đồ & Thử Cổ Phục</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playPluck(587.33);
                  setWorkspaceView('ai_stylist');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 relative ${
                  workspaceView === 'ai_stylist'
                    ? isCream
                      ? 'bg-white text-amber-950 border border-amber-400 shadow-sm'
                      : 'bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-600/30 text-amber-200 border border-amber-400/70 shadow-sm'
                    : isCream
                    ? 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                <span>✨ 2. Trợ Lý AI & Đánh Giá</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </button>
            </div>

            {/* 2. AUTOMATIC VISUAL WARNING UI (CULTURAL TABOO REAL-TIME CHECKER) */}
            <div id="cultural-taboo-warning-panel" className="transition-all duration-300">
              {culturalRulesData.violations.length > 0 ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#1C0D15] via-[#140A10] to-[#170912] border-2 border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.25)] text-left space-y-3">
                  {/* Warning Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-900/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/60 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-200 font-serif-vi flex items-center gap-1.5">
                          <span>CẢNH BÁO: PHÁT HIỆN ĐIỀU CẤM KỴ CỔ PHỤC</span>
                          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        </div>
                        <div className="text-[10px] text-rose-300/80">
                          Đối chiếu thời gian thực với Đại điển Quy chế & Thuần phong mỹ tục Việt Nam
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] font-bold border border-rose-400/60">
                        {culturalRulesData.violations.length} Cấm Kỵ
                      </span>
                      {hasCriticalViolations && (
                        <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[9.5px] font-mono border border-red-500/50">
                          NGHIÊM TRỌNG
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multiple Violations Batch Action */}
                  {culturalRulesData.violations.length > 1 && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs">
                      <span className="text-[11px] text-rose-200">
                        Có {culturalRulesData.violations.length} điều cấm kỵ cùng xảy ra trên bản phối này:
                      </span>
                      <button
                        onClick={handleAutoFixAll}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-[11px] shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Sửa Hết Tất Cả Lỗi ({culturalRulesData.violations.length})</span>
                      </button>
                    </div>
                  )}

                  {/* List of Detected Taboos with Citations & Instant Auto-Fix */}
                  <div className="space-y-2.5">
                    {culturalRulesData.violations.map((violation) => (
                      <div
                        key={violation.id}
                        className="p-3 rounded-xl bg-[#180F16]/95 border border-rose-500/40 shadow-sm flex flex-col gap-2 relative overflow-hidden"
                      >
                        {/* Taboo Bad Combination Headline */}
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            {violation.code && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 font-mono text-[9.5px] font-bold border border-rose-600/40">
                                {violation.code}
                              </span>
                            )}
                            {violation.categoryName && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-950/50 text-amber-300 text-[9.5px] font-medium border border-amber-500/30">
                                {violation.categoryName}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-200 text-[9.5px] font-bold uppercase tracking-tight">
                              {violation.severity === 'critical' ? '🔴 Cấm Kỵ Tuyệt Đối' : '🟠 Lệch Quy Thức'}
                            </span>
                          </div>

                          {/* Quick Conflict Pill */}
                          {violation.badCombinationSummary && (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-[10.5px] font-mono text-rose-200">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="font-semibold">{violation.badCombinationSummary}</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-xs font-bold text-rose-200 font-serif-vi flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{violation.title}</span>
                          </h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                            {violation.description}
                          </p>
                          <p className="text-[11px] text-rose-300/90 leading-relaxed mt-0.5">
                            {violation.culturalReason}
                          </p>
                        </div>

                        {/* Historical Citation / Ancient Decree Parchment Box */}
                        {violation.historicalCitation && (
                          <div className="p-2.5 rounded-xl bg-[#221811]/90 border border-amber-600/40 text-[11px] text-amber-100 font-serif-vi flex items-start gap-2 shadow-inner">
                            <Scroll className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-amber-300 not-italic font-sans-vi text-[9.5px] uppercase block tracking-wider mb-0.5">
                                📜 Trích Dẫn Điển Chế Lịch Sử & Chiếu Chỉ Triều Đình:
                              </span>
                              "{violation.historicalCitation}"
                            </div>
                          </div>
                        )}

                        {/* Action Bar: 1-Click Auto-Fix */}
                        {violation.autoFixAction && (
                          <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10.5px] text-slate-400">
                              Khắc phục chuẩn mực: <strong className="text-amber-300">{violation.autoFixDescription || violation.autoFixLabel}</strong>
                            </span>
                            <button
                              onClick={() => handleAutoFixViolation(violation)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                              title="Tự động áp dụng món đồ chuẩn quy chế di sản"
                            >
                              <Zap className="w-3.5 h-3.5 fill-slate-950" />
                              <span>{violation.autoFixLabel || 'Sửa Nhanh'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : currentTop || currentBottom || currentAccessory ? (
                /* Compliant Outfit Status (No Taboos Triggered) */
                <div className={`p-3 rounded-2xl border shadow-md flex items-center justify-between text-xs flex-wrap gap-2 ${
                  isCream
                    ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                    : 'bg-gradient-to-r from-emerald-950/40 via-[#0C1A1E] to-emerald-950/40 border-emerald-500/50 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <span className={`font-bold font-serif-vi block text-xs ${
                        isCream ? 'text-emerald-950' : 'text-emerald-300'
                      }`}>
                        Bản Phối Đoan Trang & Chuẩn Mực Thuần Phong Mỹ Tục
                      </span>
                      <span className={`text-[10.5px] ${
                        isCream ? 'text-emerald-800' : 'text-emerald-400/80'
                      }`}>
                        Đã đối chiếu 13 điều cấm kỵ cổ phục: 100% hợp lệ, không xung đột niên đại hay quy chế.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTabooDatabaseModal(true)}
                    className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-semibold cursor-pointer transition-colors shrink-0 ${
                      isCream
                        ? 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                        : 'bg-emerald-900/50 hover:bg-emerald-800/70 border-emerald-500/40 text-emerald-200'
                    }`}
                  >
                    Xem 13 Điều Cấm Kỵ
                  </button>
                </div>
              ) : (
                /* Bare Mannequin Status */
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs flex-wrap gap-2 ${
                  isCream
                    ? 'bg-white border-amber-200/90 text-stone-700 shadow-xs'
                    : 'bg-[#0F1626]/80 border-slate-700/60 text-slate-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <Shirt className={`w-4 h-4 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                    <span className={`text-xs ${isCream ? 'text-stone-800' : 'text-slate-300'}`}>
                      Khung ma nơ canh đang để mộc. Chọn áo, hạ y và phụ kiện bên dưới để bắt đầu thử đồ!
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTabooDatabaseModal(true)}
                    className={`text-[11px] underline cursor-pointer shrink-0 font-medium ${
                      isCream ? 'text-amber-900 hover:text-amber-700' : 'text-amber-300 hover:text-amber-200'
                    }`}
                  >
                    Tra cứu 13 điều cấm kỵ
                  </button>
                </div>
              )}
            </div>

            {/* CONDITIONAL WORKSPACE VIEWS */}
            {workspaceView === 'wardrobe' ? (
              <>
                {/* Quick AI suggestion assistant hint bar */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                  isCream
                    ? 'bg-amber-50/90 border-amber-300 text-stone-800 shadow-xs'
                    : 'bg-gradient-to-r from-amber-500/10 via-[#162035] to-amber-500/10 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} shrink-0`} />
                    <span className={`text-[11.5px] ${isCream ? 'text-stone-800 font-medium' : 'text-slate-300'}`}>
                      Cần AI gợi ý phối đồ theo bối cảnh hoặc phong cách?
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playPluck(523.25);
                      setWorkspaceView('ai_stylist');
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer shrink-0 transition-all flex items-center gap-1 ${
                      isCream
                        ? 'bg-amber-100/90 hover:bg-amber-200 text-amber-950 border-amber-300'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/50'
                    }`}
                  >
                    <span>Mở Trợ Lý AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3. Silk Category Navigation Tabs */}
                <SilkCategoryTabs
                  items={categoryTabs}
                  activeId={activeTab}
                  onSelect={(id) => setActiveTab(id as any)}
                />

                {/* 4. INLINE QUICK COLOR PICKER SWATCHES (TIỆN LỢI ĐỔI MÀU TRỰC TIẾP KHI CHỌN ĐỒ) */}
                <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 flex-wrap ${
                  isCream ? 'bg-white border-amber-200/90 shadow-xs' : 'bg-[#121A2C] border-amber-500/30'
                }`}>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${
                    isCream ? 'text-amber-900' : 'text-amber-300'
                  }`}>
                    <Palette className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                    <span>
                      Đổi màu nhanh cho {activeTab === 'bottom' ? 'Quần / Váy' : 'Áo'}:
                    </span>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {QUICK_HERITAGE_SWATCHES.map((swatch, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEngine.playPluck(523.25 + idx * 25);
                          if (activeTab === 'bottom') {
                            onSelectBottomColor(swatch.hex);
                          } else {
                            onSelectTopColor(swatch.hex);
                          }
                        }}
                        className="group relative w-6 h-6 rounded-full border border-white/60 shadow-xs hover:scale-115 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      >
                        {((activeTab === 'bottom' && activeBottomHex === swatch.hex) ||
                          (activeTab !== 'bottom' && activeTopHex === swatch.hex)) && (
                          <Check className="w-3 h-3 text-white drop-shadow stroke-[3]" />
                        )}
                      </button>
                    ))}

                    {/* Custom Color Input */}
                    <label
                      className={`w-6 h-6 rounded-full border border-dashed flex items-center justify-center cursor-pointer text-[10px] hover:scale-105 transition-transform ${
                        isCream
                          ? 'border-amber-500 text-amber-800 hover:border-amber-700'
                          : 'border-amber-400/80 hover:border-amber-300 text-amber-300'
                      }`}
                      title="Chọn mã màu tùy biến hex"
                    >
                      <input
                        type="color"
                        className="sr-only"
                        value={activeTab === 'bottom' ? activeBottomHex : activeTopHex}
                        onChange={(e) => {
                          if (activeTab === 'bottom') {
                            onSelectBottomColor(e.target.value);
                          } else {
                            onSelectTopColor(e.target.value);
                          }
                        }}
                      />
                      <span>+</span>
                    </label>
                  </div>
                </div>

                {/* 5. Era & Gender Filter Pills */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  {/* Era selector */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                    isCream ? 'bg-stone-100 border-stone-200' : 'bg-[#090E1A] border-slate-800'
                  }`}>
                    <span className={`text-[10px] px-1 font-medium ${isCream ? 'text-stone-700' : 'text-slate-400'}`}>Niên đại:</span>
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: 'nguyen', label: 'Nguyễn' },
                      { id: 'le', label: 'Hậu Lê' },
                      { id: 'tran', label: 'Trần - Lý' },
                    ].map((era) => (
                      <button
                        key={era.id}
                        onClick={() => setEraFilter(era.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-[10.5px] transition-all cursor-pointer ${
                          eraFilter === era.id
                            ? isCream
                              ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                              : 'bg-amber-500 text-slate-950 font-bold'
                            : isCream
                            ? 'text-stone-700 hover:text-stone-900'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {era.label}
                      </button>
                    ))}
                  </div>

                  {/* Gender selector */}
                  <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                    isCream ? 'bg-stone-100 border-stone-200' : 'bg-[#090E1A] border-slate-800'
                  }`}>
                    <span className={`text-[10px] px-1 font-medium ${isCream ? 'text-stone-700' : 'text-slate-400'}`}>Quy cách:</span>
                    {[
                      { id: undefined, label: 'Tất cả' },
                      { id: 'nam', label: 'Nam' },
                      { id: 'nu', label: 'Nữ' },
                    ].map((g, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGenderFilter(g.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-[10.5px] transition-all cursor-pointer ${
                          genderFilter === g.id
                            ? isCream
                              ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                              : 'bg-amber-500 text-slate-950 font-bold'
                            : isCream
                            ? 'text-stone-700 hover:text-stone-900'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Wardrobe Cards Grid */}
                <div className="min-h-[380px] max-h-[520px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {/* TAB 1: Áo Cổ Phục (TOPS) */}
                  {activeTab === 'top' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getFilteredItems(TOPS).map((item) => {
                        const isSelected = currentTop?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                              soundEngine.playPluck(659.25);
                              if (isSelected) {
                                onSelectTop(null); // Deselect on second click
                              } else {
                                onSelectTop(item);
                              }
                            }}
                            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group ${
                              isSelected
                                ? isCream
                                  ? 'bg-amber-100/80 border-amber-400 shadow-sm'
                                  : 'bg-[#18233C] border-amber-400 shadow-md'
                                : isCream
                                ? 'bg-white hover:bg-amber-50/50 border-stone-200 hover:border-amber-300 shadow-xs'
                                : 'bg-[#0E1524] hover:bg-[#141C30] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[10px] font-bold tracking-wide uppercase ${
                                    isCream ? 'text-amber-800' : 'text-amber-400/90'
                                  }`}>
                                    {item.era}
                                  </span>
                                  {item.gender && (
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-medium ${
                                      isCream
                                        ? 'bg-stone-100 text-stone-700'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}>
                                      {item.gender === 'nam' ? 'Nam' : item.gender === 'nu' ? 'Nữ' : 'Unisex'}
                                    </span>
                                  )}
                                </div>
                                <h3 className={`text-xs sm:text-[13px] font-bold font-serif-vi mt-0.5 leading-snug transition-colors ${
                                  isCream
                                    ? 'text-stone-900 group-hover:text-amber-800'
                                    : 'text-slate-100 group-hover:text-amber-200'
                                }`}>
                                  {item.name}
                                </h3>
                              </div>

                              {/* Selected Checkmark or Equip Pill */}
                              {isSelected ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                                  Đang Mặc
                                </span>
                              ) : (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                  isCream ? 'text-stone-600 group-hover:text-amber-800' : 'text-slate-400 group-hover:text-amber-300'
                                }`}>
                                  Thử áo
                                </span>
                              )}
                            </div>

                            <p className={`text-[11px] leading-relaxed ${
                              isCream ? 'text-stone-700 font-normal' : 'text-slate-300'
                            }`}>
                              {item.summary}
                            </p>

                            {/* Culture Note Pill */}
                            {item.cultureInfo && (
                              <div className={`text-[10px] px-2 py-1 rounded-lg border leading-snug ${
                                isCream
                                  ? 'text-amber-900 bg-amber-50 border-amber-200'
                                  : 'text-amber-300/80 bg-amber-950/20 border-amber-500/20'
                              }`}>
                                ⚜️ {item.cultureInfo.notableDynasty} • {item.cultureInfo.origin}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB 2: Hạ Y (Quần / Váy) */}
                  {activeTab === 'bottom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BOTTOMS.map((item) => {
                        const isSelected = currentBottom?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                              soundEngine.playPluck(587.33);
                              if (isSelected) {
                                onSelectBottom(null);
                              } else {
                                onSelectBottom(item);
                              }
                            }}
                            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group ${
                              isSelected
                                ? isCream
                                  ? 'bg-amber-100/80 border-amber-400 shadow-sm'
                                  : 'bg-[#18233C] border-amber-400 shadow-md'
                                : isCream
                                ? 'bg-white hover:bg-amber-50/50 border-stone-200 hover:border-amber-300 shadow-xs'
                                : 'bg-[#0E1524] hover:bg-[#141C30] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className={`text-[10px] font-bold tracking-wide uppercase ${
                                  isCream ? 'text-amber-800' : 'text-amber-400/90'
                                }`}>
                                  {item.era}
                                </span>
                                <h3 className={`text-xs sm:text-[13px] font-bold font-serif-vi mt-0.5 leading-snug ${
                                  isCream
                                    ? 'text-stone-900 group-hover:text-amber-800'
                                    : 'text-slate-100 group-hover:text-amber-200'
                                }`}>
                                  {item.name}
                                </h3>
                              </div>
                              {isSelected ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                                  Đang Mặc
                                </span>
                              ) : (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                  isCream ? 'text-stone-600 group-hover:text-amber-800' : 'text-slate-400 group-hover:text-amber-300'
                                }`}>
                                  Thử hạ y
                                </span>
                              )}
                            </div>

                            <p className={`text-[11px] leading-relaxed ${
                              isCream ? 'text-stone-700 font-normal' : 'text-slate-300'
                            }`}>
                              {item.summary}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB 3: Phụ Kiện (ACCESSORIES) */}
                  {activeTab === 'accessory' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ACCESSORIES.map((item) => {
                        const isSelected = currentAccessory?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredItem(item)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                              soundEngine.playPluck(783.99);
                              if (isSelected) {
                                onSelectAccessory(null);
                              } else {
                                onSelectAccessory(item);
                              }
                            }}
                            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group ${
                              isSelected
                                ? isCream
                                  ? 'bg-amber-100/80 border-amber-400 shadow-sm'
                                  : 'bg-[#18233C] border-amber-400 shadow-md'
                                : isCream
                                ? 'bg-white hover:bg-amber-50/50 border-stone-200 hover:border-amber-300 shadow-xs'
                                : 'bg-[#0E1524] hover:bg-[#141C30] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className={`text-[10px] font-bold tracking-wide uppercase ${
                                  isCream ? 'text-amber-800' : 'text-amber-400/90'
                                }`}>
                                  {item.era}
                                </span>
                                <h3 className={`text-xs sm:text-[13px] font-bold font-serif-vi mt-0.5 leading-snug ${
                                  isCream
                                    ? 'text-stone-900 group-hover:text-amber-800'
                                    : 'text-slate-100 group-hover:text-amber-200'
                                }`}>
                                  {item.name}
                                </h3>
                              </div>
                              {isSelected ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                                  Đang Đeo
                                </span>
                              ) : (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                  isCream ? 'text-stone-600 group-hover:text-amber-800' : 'text-slate-400 group-hover:text-amber-300'
                                }`}>
                                  Đeo thử
                                </span>
                              )}
                            </div>

                            <p className={`text-[11px] leading-relaxed ${
                              isCream ? 'text-stone-700 font-normal' : 'text-slate-300'
                            }`}>
                              {item.summary}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB 4: Ngũ Hành & Bảng Màu Toàn Diện */}
                  {activeTab === 'color' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {COLOR_PALETTES.map((palette) => {
                          const isSelected = currentColor.name === palette.name;
                          return (
                            <div
                              key={palette.name}
                              onClick={() => {
                                soundEngine.playPluck(523.25);
                                onSelectColor(palette);
                                onSelectTopColor(palette.hex);
                              }}
                              className={`p-2.5 rounded-2xl border transition-all text-left flex items-center gap-2.5 cursor-pointer ${
                                isSelected
                                  ? isCream
                                    ? 'bg-amber-100/90 border-amber-400 shadow-sm'
                                    : 'bg-[#18233C] border-amber-400 shadow-md'
                                  : isCream
                                  ? 'bg-white hover:bg-amber-50/60 border-stone-200 hover:border-amber-300 shadow-xs'
                                  : 'bg-[#0E1524] hover:bg-[#141C30] border-slate-800'
                              }`}
                            >
                              <div
                                className="w-7 h-7 rounded-full border border-white/60 shadow-xs shrink-0 flex items-center justify-center"
                                style={{ backgroundColor: palette.hex }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                              </div>
                              <div>
                                <h4 className={`text-xs font-bold font-serif-vi ${
                                  isCream ? 'text-stone-900' : 'text-slate-100'
                                }`}>
                                  {palette.name}
                                </h4>
                                <span className={`text-[10px] block ${
                                  isCream ? 'text-stone-600' : 'text-slate-400'
                                }`}>
                                  {palette.meaning}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Chất Liệu Vải & Vân Gấm (FABRICS) */}
                  {activeTab === 'fabric' && (
                    <div className="space-y-3">
                      {/* Banner trigger for Magnifying Glass Inspector */}
                      <div className={`p-3.5 rounded-2xl border shadow-lg flex items-center justify-between gap-3 flex-wrap ${
                        isCream
                          ? 'bg-amber-50/90 border-amber-300/80 shadow-xs'
                          : 'bg-gradient-to-r from-amber-500/20 via-[#1C263C] to-amber-500/20 border-amber-400/60'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                            isCream ? 'bg-amber-100 border-amber-400/80' : 'bg-amber-500/20 border-amber-400/80'
                          }`}>
                            <Scan className={`w-5 h-5 ${isCream ? 'text-amber-800' : 'text-amber-400'} animate-pulse`} />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold font-serif-vi flex items-center gap-2 ${
                              isCream ? 'text-amber-950' : 'text-amber-200'
                            }`}>
                              <span>KÍNH LÚP SOI CẬN CẢNH HỌA TIẾT & THỚ DỆT</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                                isCream ? 'bg-amber-200 text-amber-950' : 'bg-amber-400/20 text-amber-300'
                              }`}>
                                MACRO 1X - 8X
                              </span>
                            </h4>
                            <p className={`text-[11px] ${isCream ? 'text-stone-700' : 'text-slate-300'}`}>
                              Phóng to xem chi tiết thêu tay, vân gấm nổi chữ Vạn, họa tiết Thủy Ba & hoa cúc chìm
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            soundEngine.playPluck(587.33);
                            setShowFabricInspector(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-tight shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <ZoomIn className="w-4 h-4" />
                          <span>Mở Kính Lúp Soi Cận Cảnh</span>
                        </button>
                      </div>

                      {/* 4 Fabric Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {FABRICS.map((fabric) => {
                          const isSelected = (currentFabric?.id || FABRICS[1].id) === fabric.id;
                          return (
                            <div
                              key={fabric.id}
                              onClick={() => {
                                soundEngine.playPluck(659.25);
                                if (onSelectFabric) onSelectFabric(fabric);
                              }}
                              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group ${
                                isSelected
                                  ? isCream
                                    ? 'bg-amber-100/90 border-amber-400 shadow-sm ring-1 ring-amber-400/50'
                                    : 'bg-[#18233C] border-amber-400 shadow-md ring-1 ring-amber-400/50'
                                  : isCream
                                  ? 'bg-white hover:bg-amber-50/60 border-stone-200 hover:border-amber-300 shadow-xs'
                                  : 'bg-[#0E1524] hover:bg-[#141C30] border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h3 className={`text-xs font-bold font-serif-vi ${
                                      isCream
                                        ? 'text-stone-900 group-hover:text-amber-800'
                                        : 'text-slate-100 group-hover:text-amber-200'
                                    }`}>
                                      {fabric.name}
                                    </h3>
                                    {isSelected && <Check className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />}
                                  </div>
                                  <span className={`text-[10px] font-mono mt-0.5 block ${
                                    isCream ? 'text-amber-800 font-semibold' : 'text-amber-300/80'
                                  }`}>
                                    {fabric.sheen}
                                  </span>
                                </div>
                                {isSelected ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                                    Đang Chọn
                                  </span>
                                ) : (
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                                    isCream ? 'text-stone-600 group-hover:text-amber-800' : 'text-slate-400 group-hover:text-amber-300'
                                  }`}>
                                    Chọn vải
                                  </span>
                                )}
                              </div>

                              <p className={`text-[11px] leading-relaxed ${
                                isCream ? 'text-stone-700 font-normal' : 'text-slate-300'
                              }`}>
                                {fabric.description}
                              </p>

                              <div className={`flex items-center justify-between pt-1 border-t text-[10px] ${
                                isCream ? 'border-stone-200' : 'border-slate-800'
                              }`}>
                                <span className={isCream ? 'text-stone-600' : 'text-slate-400'}>{fabric.textureLabel}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectFabric) onSelectFabric(fabric);
                                    setShowFabricInspector(true);
                                  }}
                                  className={`font-semibold flex items-center gap-1 cursor-pointer ${
                                    isCream ? 'text-amber-800 hover:text-amber-950' : 'text-amber-400 hover:text-amber-200'
                                  }`}
                                >
                                  <Scan className="w-3 h-3" />
                                  <span>Soi cận cảnh</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* AI STYLIST & EVALUATION VIEW */
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => {
                      soundEngine.playPluck(440);
                      setWorkspaceView('wardrobe');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>← Quay lại Tủ Đồ Cổ Phục</span>
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    CHẾ ĐỘ TRỢ LÝ THỜI TRANG AI
                  </span>
                </div>

                {/* 1. Trợ Lý AI: Phân Tích Sự Kết Hợp Cụ Thể & Gợi Ý Đương Đại */}
                <div className={`border rounded-2xl p-3.5 shadow-lg flex flex-col gap-3 ${
                  isCream ? 'bg-white border-amber-300/80 shadow-[0_4px_20px_rgba(180,130,60,0.08)]' : 'bg-[#121A2C] border-amber-400/40'
                }`}>
                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                        isCream ? 'bg-amber-100 border-amber-400/80' : 'bg-amber-500/20 border-amber-400/60'
                      }`}>
                        <Wand2 className={`w-4 h-4 ${isCream ? 'text-amber-800' : 'text-amber-400'} animate-pulse`} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold font-serif-vi flex items-center gap-1.5 ${
                          isCream ? 'text-amber-950' : 'text-amber-300'
                        }`}>
                          <span>TRỢ LÝ AI: PHÂN TÍCH BẢN PHỐI & GỢI Ý ĐƯƠNG ĐẠI</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                            isCream ? 'bg-amber-100 border-amber-400 text-amber-900' : 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                          }`}>
                            DI SẢN & TÂN THỜI
                          </span>
                        </div>
                        <div className={`text-[10px] ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                          Phân tích tương hỗ văn hóa giữa các item & xu hướng phối đồ hiện đại
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10.5px] cursor-pointer transition-colors ${
                          isCream
                            ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 font-medium'
                            : 'bg-[#18233C] border-slate-700 text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        <span>{isAnalysisExpanded ? 'Thu gọn' : 'Xem phân tích'}</span>
                        {isAnalysisExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* STYLING MODE SELECTOR (4 Chế độ định hướng) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
                    {[
                      { id: 'auto', label: 'Tự Động Cân Bằng', icon: '✨' },
                      { id: 'authentic_heritage', label: 'Cổ Phong Mực Thước', icon: '🏛️' },
                      { id: 'modern_fusion', label: 'Tân Thời Đương Đại', icon: '⚡' },
                      { id: 'festive_ceremony', label: 'Đại Lễ & Lễ Cưới', icon: '🌸' },
                      { id: 'daily_casual', label: 'Dạo Phố & Hàng Ngày', icon: '☕' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setStylingMode(mode.id as StylingMode);
                          soundEngine.playPluck(440);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                          stylingMode === mode.id
                            ? isCream
                              ? 'bg-amber-200/90 text-amber-950 border border-amber-400 font-bold shadow-xs'
                              : 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-400/80 shadow-sm'
                            : isCream
                            ? 'bg-stone-50 hover:bg-amber-50 text-stone-700 border border-stone-200'
                            : 'bg-[#18233C]/70 hover:bg-[#1f2d4d] text-slate-300 border border-slate-700/70'
                        }`}
                      >
                        <span>{mode.icon}</span>
                        <span>{mode.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Prompt Input & Multi-Actions Bar */}
                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 border ${
                      isCream ? 'bg-stone-50 border-stone-200' : 'bg-[#090E1A] border-slate-700/80'
                    }`}>
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSuggest(undefined, stylingMode, 'full_outfit')}
                        placeholder="Nhập bối cảnh: Đi cưới bạn thân, đi cà phê triển lãm, dạo phố cổ, lễ chùa..."
                        className={`flex-1 bg-transparent text-xs focus:outline-none font-sans-vi ${
                          isCream ? 'text-stone-900 placeholder:text-stone-400' : 'text-slate-200 placeholder-slate-400'
                        }`}
                      />
                      <button
                        onClick={() => handleAiSuggest(undefined, stylingMode, 'full_outfit')}
                        disabled={isAiSuggesting}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-tight shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {isAiSuggesting ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Đang phân tích...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 fill-slate-950" />
                            <span>Gợi Ý Toàn Bộ</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Smart Action Buttons (Phối tiếp món đang chọn / Chuyển sang cách tân) */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {currentTop && (
                        <button
                          onClick={() => handleAiSuggest(undefined, stylingMode, 'complete_current')}
                          disabled={isAiSuggesting}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isCream
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                              : 'bg-emerald-950/60 hover:bg-emerald-900/70 border-emerald-500/50 text-emerald-200'
                          }`}
                          title={`Giữ ${currentTop.name} và để AI gợi ý hạ y & phụ kiện phối hoàn hảo`}
                        >
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span>Phối tiếp cho áo "{currentTop.name}"</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setStylingMode('modern_fusion');
                          handleAiSuggest('Phối phong cách tân thời hiện đại Neo-Vietnamese dạo phố', 'modern_fusion', 'full_outfit');
                        }}
                        disabled={isAiSuggesting}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isCream
                            ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-950'
                            : 'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-400/50 text-indigo-200'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3 text-indigo-500" />
                        <span>Xu hướng Tân Thời (Neo-Streetwear)</span>
                      </button>

                      <button
                        onClick={() => {
                          setStylingMode('authentic_heritage');
                          handleAiSuggest('Phối chuẩn mực cổ phong triều đình mực thước', 'authentic_heritage', 'full_outfit');
                        }}
                        disabled={isAiSuggesting}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isCream
                            ? 'bg-amber-100/80 hover:bg-amber-200/80 border-amber-300 text-amber-950'
                            : 'bg-amber-950/50 hover:bg-amber-900/60 border-amber-500/50 text-amber-200'
                        }`}
                      >
                        <Crown className="w-3 h-3 text-amber-500" />
                        <span>Chuẩn Cổ Phong Mực Thước</span>
                      </button>
                    </div>
                  </div>

                  {/* Contextual Preset Scenarios */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {REAL_WORLD_SCENARIOS.map((scenario, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiPrompt(scenario.query);
                          handleAiSuggest(scenario.query);
                        }}
                        className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                          isCream
                            ? 'bg-stone-50 hover:bg-amber-50 border-stone-200 text-stone-700 hover:text-amber-900'
                            : 'bg-[#18233C] hover:bg-amber-950/60 hover:text-amber-200 border-slate-700 text-slate-300'
                        }`}
                      >
                        {scenario.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Combination Analysis Card */}
                  <AnimatePresence>
                    {isAnalysisExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`pt-2 border-t flex flex-col gap-3 ${
                          isCream ? 'border-amber-200' : 'border-slate-700/80'
                        }`}
                      >
                        {/* Combination Title & Score Bar */}
                        <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                          isCream
                            ? 'bg-amber-50/70 border-amber-300/80'
                            : 'bg-gradient-to-r from-[#172036] via-[#1A253F] to-[#172036] border-amber-500/30'
                        }`}>
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  isCream
                                    ? 'bg-amber-200 text-amber-950 border-amber-400'
                                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                }`}>
                                  {dynamicCombinationAnalysis.stylingDirectionLabel}
                                </span>
                                <span className={`text-xs font-bold font-serif-vi ${
                                  isCream ? 'text-amber-950' : 'text-amber-200'
                                }`}>
                                  {dynamicCombinationAnalysis.culturalSynergyTitle}
                                </span>
                              </div>
                              {latestAiAnalysis?.characterPersona && (
                                <div className={`text-[10.5px] mt-0.5 italic ${
                                  isCream ? 'text-stone-700' : 'text-slate-300'
                                }`}>
                                  Hình tượng: {latestAiAnalysis.characterPersona}
                                </div>
                              )}
                            </div>

                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${
                              isCream
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                            }`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{dynamicCombinationAnalysis.synergyScore}% Tương Hợp</span>
                            </div>
                          </div>

                          {/* 3 Detail Boxes: Cultural Meaning, Modern Trend, Color Harmony */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                            {/* Cultural Meaning */}
                            <div className={`p-2.5 rounded-lg border text-left ${
                              isCream ? 'bg-white border-amber-200' : 'bg-[#0F1626]/90 border-amber-600/30'
                            }`}>
                              <div className={`flex items-center gap-1.5 text-[10.5px] font-bold font-serif-vi mb-1 ${
                                isCream ? 'text-amber-900' : 'text-amber-300'
                              }`}>
                                <Scroll className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} shrink-0`} />
                                <span>Ý NGHĨA VĂN HÓA & TRIẾT LÝ TƯƠNG HỖ:</span>
                              </div>
                              <p className={`text-[11px] leading-relaxed font-sans-vi ${
                                isCream ? 'text-stone-700' : 'text-slate-300'
                              }`}>
                                {dynamicCombinationAnalysis.culturalMeaningDetails ||
                                  'Bản phối thể hiện cốt cách Nho phong mực thước và sự giao hòa âm dương đất trời Đại Việt.'}
                              </p>
                            </div>

                            {/* Modern Trend Factor */}
                            <div className={`p-2.5 rounded-lg border text-left ${
                              isCream ? 'bg-white border-indigo-200' : 'bg-[#0F1626]/90 border-indigo-500/30'
                            }`}>
                              <div className={`flex items-center gap-1.5 text-[10.5px] font-bold font-serif-vi mb-1 ${
                                isCream ? 'text-indigo-900' : 'text-indigo-300'
                              }`}>
                                <TrendingUp className={`w-3.5 h-3.5 ${isCream ? 'text-indigo-600' : 'text-indigo-400'} shrink-0`} />
                                <span>XU HƯỚNG PHỐI ĐỒ HIỆN ĐẠI & ỨNG DỤNG:</span>
                              </div>
                              <p className={`text-[11px] leading-relaxed font-sans-vi ${
                                isCream ? 'text-stone-700' : 'text-slate-300'
                              }`}>
                                {dynamicCombinationAnalysis.modernTrendDetails ||
                                  'Phong cách Neo-Vietnamese Heritage đang dẫn đầu xu hướng thời trang trẻ và các bộ ảnh nghệ thuật.'}
                              </p>
                            </div>
                          </div>

                          {/* Color & Modern Styling Tip */}
                          <div className={`p-2 rounded-lg border text-[11px] flex items-start gap-2 ${
                            isCream ? 'bg-amber-50/80 border-amber-200 text-stone-800' : 'bg-[#0A0F1C]/80 border-slate-700/60 text-slate-300'
                          }`}>
                            <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'} shrink-0 mt-0.5`} />
                            <div>
                              <span className={`font-semibold ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>Gợi ý cách phối hiện đại: </span>
                              <span>{dynamicCombinationAnalysis.modernOutfitTip}</span>
                              <span className={`block text-[10px] mt-0.5 ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                                🎨 Hòa sắc: {dynamicCombinationAnalysis.colorHarmonyDetails}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* DUAL STYLE ALTERNATIVES */}
                        {latestAiAnalysis?.alternatives && (
                          <div className={`p-2.5 rounded-xl border flex flex-col gap-2 ${
                            isCream ? 'bg-white border-stone-200' : 'bg-[#0F1728] border-slate-700/80'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-[11px] font-bold font-serif-vi flex items-center gap-1 ${
                                isCream ? 'text-stone-800' : 'text-slate-300'
                              }`}>
                                <Compass className={`w-3.5 h-3.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                                <span>SO SÁNH 2 BIẾN THỂ PHONG CÁCH:</span>
                              </span>
                              <span className={`text-[10px] ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>1 chạm để chuyển đổi</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {/* Classic */}
                              <div className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 ${
                                isCream ? 'bg-amber-50/70 border-amber-300' : 'bg-[#151F35] border-amber-500/40'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                      isCream ? 'bg-amber-200 text-amber-950' : 'bg-amber-950 text-amber-300'
                                    }`}>
                                      🏛️ CỔ PHONG CHUẨN ĐIỂN CHẾ
                                    </span>
                                    <span className={`text-[9.5px] font-mono ${isCream ? 'text-amber-800' : 'text-amber-400/80'}`}>100% Cổ Điển</span>
                                  </div>
                                  <div className={`text-xs font-bold mt-1 ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>
                                    {latestAiAnalysis.alternatives.classic.title}
                                  </div>
                                  <div className={`text-[10px] mt-0.5 ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                                    {latestAiAnalysis.alternatives.classic.tagline}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleApplyAlternative(latestAiAnalysis!.alternatives!.classic)}
                                  className={`w-full py-1 rounded border text-[10.5px] font-bold transition-all cursor-pointer ${
                                    isCream
                                      ? 'bg-amber-200/90 hover:bg-amber-300 border-amber-400 text-amber-950'
                                      : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/50 text-amber-200'
                                  }`}
                                >
                                  Áp Dụng Bản Phối Này
                                </button>
                              </div>

                              {/* Modern Fusion */}
                              <div className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 ${
                                isCream ? 'bg-indigo-50/70 border-indigo-200' : 'bg-[#151F35] border-indigo-500/40'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                      isCream ? 'bg-indigo-100 text-indigo-950' : 'bg-indigo-950 text-indigo-300'
                                    }`}>
                                      ✨ TÂN THỜI ĐƯƠNG ĐẠI
                                    </span>
                                    <span className={`text-[9.5px] font-mono ${isCream ? 'text-indigo-700' : 'text-indigo-400/80'}`}>Neo-Heritage</span>
                                  </div>
                                  <div className={`text-xs font-bold mt-1 ${isCream ? 'text-stone-900' : 'text-slate-200'}`}>
                                    {latestAiAnalysis.alternatives.modernFusion.title}
                                  </div>
                                  <div className={`text-[10px] mt-0.5 ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                                    {latestAiAnalysis.alternatives.modernFusion.tagline}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleApplyAlternative(latestAiAnalysis!.alternatives!.modernFusion)}
                                  className={`w-full py-1 rounded border text-[10.5px] font-bold transition-all cursor-pointer ${
                                    isCream
                                      ? 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300 text-indigo-950'
                                      : 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-400/50 text-indigo-200'
                                  }`}
                                >
                                  Áp Dụng Bản Phối Này
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SMART NEXT-ITEM QUICK PICKS */}
                        {smartNextItems.length > 0 && (!currentBottom || !currentAccessory) && (
                          <div className="p-2.5 rounded-xl bg-[#0E1524] border border-emerald-500/30 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-300 font-serif-vi flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                <span>GỢI Ý MÓN PHỐI TIẾP THEO TƯƠNG THÍCH NHẤT:</span>
                              </span>
                              <span className="text-[10px] text-slate-400">Dựa trên item hiện tại</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {smartNextItems.slice(0, 2).map((sugg) => (
                                <div
                                  key={sugg.item.id}
                                  className="p-2.5 rounded-xl bg-[#141C30] border border-slate-700/80 hover:border-emerald-500/50 flex items-center justify-between gap-2.5 transition-all"
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="text-xl shrink-0">{sugg.item.icon}</span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-bold text-slate-200 font-serif-vi leading-tight">
                                          {sugg.item.name}
                                        </span>
                                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-mono shrink-0">
                                          {sugg.compatibilityScore}%
                                        </span>
                                      </div>
                                      <p className="text-[10.5px] text-slate-300 mt-0.5 leading-snug">
                                        {sugg.reason}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleEquipNextItem(sugg.item)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10.5px] font-bold shrink-0 cursor-pointer"
                                  >
                                    + Mặc
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 7. Comprehensive Cultural & Aesthetic Harmony Analysis Report */}
                <div className={`p-3.5 rounded-2xl border text-left space-y-2.5 shadow-md ${
                  isCream
                    ? 'bg-white border-amber-300 shadow-[0_4px_20px_rgba(180,130,60,0.08)]'
                    : 'bg-[#0F1626]/90 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-[11px] font-medium ${isCream ? 'text-stone-600' : 'text-slate-400'}`}>
                        BÁO CÁO ĐÁNH GIÁ ĐA TIÊU CHÍ (AI)
                      </div>
                      <h3 className={`text-sm font-bold font-serif-vi ${isCream ? 'text-amber-950' : 'text-amber-200'}`}>
                        {harmonyResult.critiqueTitle}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold font-mono leading-none ${isCream ? 'text-amber-800' : 'text-amber-400'}`}>
                        {harmonyResult.score}
                        <span className={`text-xs font-normal ${isCream ? 'text-stone-500' : 'text-slate-400'}`}>/100</span>
                      </div>
                      <span className={`text-[10px] font-medium font-sans-vi ${isCream ? 'text-amber-900' : 'text-amber-300/80'}`}>
                        {harmonyResult.ratingBadge}
                      </span>
                    </div>
                  </div>

                  {/* Progress bars for 3 Pillars */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10.5px]">
                    <div className={`p-2 rounded-xl border ${isCream ? 'bg-amber-50/70 border-amber-200' : 'bg-[#090E1A] border-slate-800'}`}>
                      <div className={`flex justify-between ${isCream ? 'text-stone-700 font-medium' : 'text-slate-400'}`}>
                        <span>Niên đại</span>
                        <span className={`font-bold ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>{harmonyResult.historicalMatchPercent}%</span>
                      </div>
                      <div className={`w-full h-1 rounded-full mt-1 overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${harmonyResult.historicalMatchPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-2 rounded-xl border ${isCream ? 'bg-amber-50/70 border-amber-200' : 'bg-[#090E1A] border-slate-800'}`}>
                      <div className={`flex justify-between ${isCream ? 'text-stone-700 font-medium' : 'text-slate-400'}`}>
                        <span>Ngũ hành</span>
                        <span className={`font-bold ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>{harmonyResult.colorHarmonyPercent}%</span>
                      </div>
                      <div className={`w-full h-1 rounded-full mt-1 overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${harmonyResult.colorHarmonyPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-2 rounded-xl border ${isCream ? 'bg-amber-50/70 border-amber-200' : 'bg-[#090E1A] border-slate-800'}`}>
                      <div className={`flex justify-between ${isCream ? 'text-stone-700 font-medium' : 'text-slate-400'}`}>
                        <span>Mỹ cảm</span>
                        <span className={`font-bold ${isCream ? 'text-amber-900' : 'text-amber-300'}`}>{harmonyResult.contextAestheticPercent}%</span>
                      </div>
                      <div className={`w-full h-1 rounded-full mt-1 overflow-hidden ${isCream ? 'bg-stone-200' : 'bg-slate-800'}`}>
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${harmonyResult.contextAestheticPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detailed AI Critique Text */}
                  <p className={`text-xs leading-relaxed pt-1 ${isCream ? 'text-stone-800 font-normal' : 'text-slate-300'}`}>
                    {harmonyResult.detailedCritique}
                  </p>

                  {/* Styling Tip */}
                  {harmonyResult.stylingTip && (
                    <div className={`text-[11px] p-2 rounded-xl border flex items-start gap-1.5 ${
                      isCream
                        ? 'bg-amber-50 border-amber-300 text-stone-900'
                        : 'text-amber-300 bg-amber-950/30 border-amber-500/20'
                    }`}>
                      <Sparkles className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCream ? 'text-amber-700' : 'text-amber-400'}`} />
                      <span>
                        <strong className={isCream ? 'text-amber-950' : 'text-amber-200'}>Mẹo tạo dáng & phối đồ:</strong> {harmonyResult.stylingTip}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 8. Bottom Action Buttons: Always accessible */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleCheckHarmony}
                disabled={isCheckingHarmony}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_24px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCheckingHarmony ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>ĐANG CHẤM ĐIỂM QUY CHUẨN...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>CHẤM ĐIỂM & ĐÁNH GIÁ (AI)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveToLookbook}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#121A2C] via-[#1A2640] to-[#121A2C] hover:from-[#18233C] hover:to-[#223254] text-amber-200 hover:text-amber-100 border border-amber-400/60 hover:border-amber-300 text-xs sm:text-sm font-bold shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                title="Mở Trang Soạn Thảo Lookbook để tùy biến bối cảnh, tiêu đề, thơ đề từ và tải Poster HD"
              >
                <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>Soạn Thảo & Tải Poster</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ==========================================================
          CULTURAL TABOO DATABASE MODAL (ĐẠI ĐIỂN CẤM KỴ CỔ PHỤC)
          Full interactive encyclopedia of Vietnamese cultural taboos
         ========================================================== */}
      <AnimatePresence>
        {showTabooDatabaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0D1424] border-2 border-amber-400/70 rounded-3xl shadow-2xl text-left overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-amber-500/30 bg-[#121A2C] flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-sans-vi">
                      ĐẠI ĐIỂN QUY CHẾ & CẤM KỴ CỔ PHỤC
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-vi text-amber-200 mt-1">
                    Cẩm Nang Điều Cấm Kỵ & Quy Chuẩn Việt Phục
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Hệ thống dữ liệu chuẩn mực đối chiếu quy chế triều đình, chỉ dụ lịch sử và thuần phong mỹ tục Việt Nam.
                  </p>
                </div>

                <button
                  onClick={() => setShowTabooDatabaseModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-700 cursor-pointer shrink-0 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="p-3 sm:p-4 bg-[#0A0F1D] border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tabooSearchQuery}
                    onChange={(e) => setTabooSearchQuery(e.target.value)}
                    placeholder="Tìm theo từ khóa (Nhật Bình, Quần tây, Minh Mạng...)"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121A2C] border border-slate-700 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
                  {[
                    { id: 'all', label: `Tất cả (${allTabooRules.length})` },
                    { id: 'ceremonial_decency', label: 'Đoan Trang & Hạ Y' },
                    { id: 'royal_vs_folk', label: 'Cung Đình vs Dân Gian' },
                    { id: 'dynasty_clash', label: 'Lệch Niên Đại' },
                    { id: 'gender_customs', label: 'Quy Cách Nam Nữ' },
                    { id: 'color_taboo', label: 'Sắc Phục Hoàng Gia' },
                    { id: 'sacred_heritage', label: 'Đông Sơn Cội Nguồn' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTabooCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                        tabooCategoryFilter === cat.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-[#141C30] text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Rules List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                {filteredTabooRules.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    Không tìm thấy điều cấm kỵ nào phù hợp với từ khóa "{tabooSearchQuery}".
                  </div>
                ) : (
                  filteredTabooRules.map((rule) => {
                    const isTriggeredByCurrentOutfit = rule.isTriggered({
                      top: currentTop,
                      bottom: currentBottom,
                      accessory: currentAccessory,
                      topColorHex: activeTopHex,
                      bottomColorHex: activeBottomHex,
                    });

                    return (
                      <div
                        key={rule.id}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2.5 ${
                          isTriggeredByCurrentOutfit
                            ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/60'
                            : 'bg-[#121A2C]/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 font-mono text-[10px] font-bold border border-amber-600/40">
                              {rule.code}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                              {rule.categoryName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Niên đại: {rule.dynastyOrOrigin}
                            </span>
                          </div>

                          {/* Live Status Badge on Current Outfit */}
                          {isTriggeredByCurrentOutfit ? (
                            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-500/60 text-rose-200 text-[10px] font-bold animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>ĐANG BỊ VI PHẠM TRÊN BẢN PHỐI HIỆN TẠI</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Đang tuân thủ tốt</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Offending Combination Example */}
                        <div>
                          <h3 className="text-sm font-bold font-serif-vi text-amber-200">
                            {rule.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            <span className="text-[10.5px] text-slate-400">Tình huống kiêng kỵ:</span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-600/40 text-[11px] font-mono text-rose-200 font-medium">
                              {rule.badCombinationSummary}
                            </span>
                          </div>
                        </div>

                        {/* Description & Cultural Reason */}
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rule.description}
                        </p>
                        <p className="text-xs text-amber-200/90 leading-relaxed bg-[#0A0F1D]/80 p-2.5 rounded-xl border border-slate-800">
                          <strong>Ý nghĩa văn hóa:</strong> {rule.culturalReason}
                        </p>

                        {/* Historical Citation Parchment Box */}
                        <div className="p-2.5 rounded-xl bg-[#221912]/80 border border-amber-600/40 text-xs text-amber-100 font-serif-vi flex items-start gap-2 italic">
                          <Scroll className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-300 not-italic font-sans-vi text-[10px] uppercase block tracking-wider mb-0.5">
                              📜 Trích Dẫn Điển Chế & Chiếu Dụ Lịch Sử:
                            </span>
                            "{rule.historicalCitation}"
                          </div>
                        </div>

                        {/* Direct Action: Sửa Ngay (nếu đang bị vi phạm) hoặc Thử Phối (để học hỏi) */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-400">
                            Quy chuẩn đề xuất: <strong className="text-amber-300">{rule.autoFixDescription}</strong>
                          </span>

                          <div className="flex items-center gap-2">
                            {isTriggeredByCurrentOutfit ? (
                              <button
                                onClick={() => {
                                  handleAutoFixViolation({
                                    id: rule.id,
                                    title: rule.title,
                                    description: rule.description,
                                    culturalReason: rule.culturalReason,
                                    severity: rule.severity,
                                    autoFixLabel: rule.autoFixLabel,
                                    autoFixDescription: rule.autoFixDescription,
                                    autoFixAction: rule.autoFixAction,
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                              >
                                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                                <span>{rule.autoFixLabel}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTestTaboo(rule)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10.5px] cursor-pointer transition-colors"
                                title="Thử phối lỗi này để xem cơ chế phát hiện tự động hoạt động"
                              >
                                Thử Phối Lỗi Này
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-[#0A0F1D] flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Tổng cộng: <strong className="text-amber-300">{allTabooRules.length}</strong> quy tắc cấm kỵ được tích hợp.
                </span>
                <button
                  onClick={() => setShowTabooDatabaseModal(false)}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer shadow-md transition-colors"
                >
                  Đóng Cẩm Nang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          8. KÍNH LÚP DI SẢN: SOI CẬN CẢNH HỌA TIẾT VẢI & CỔ PHỤC (1x - 8x)
         ======================================================== */}
      <FabricMotifInspectorModal
        isOpen={showFabricInspector}
        onClose={() => setShowFabricInspector(false)}
        currentFabric={currentFabric || FABRICS[1]}
        onSelectFabric={onSelectFabric}
        topItem={currentTop}
        bottomItem={currentBottom}
        accessoryItem={currentAccessory}
        currentColorHex={activeTopHex}
      />
    </div>
  );
};
