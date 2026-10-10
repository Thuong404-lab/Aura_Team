import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WardrobeItem,
  FabricOption,
  ColorOption,
  PresetOutfit,
  TOPS,
  BOTTOMS,
  ACCESSORIES,
  FABRICS,
  COLOR_PALETTES,
} from './data/vietPhucData';
import { HomeScreen } from './components/HomeScreen';
import { FittingRoomScreen, HarmonyResult } from './components/FittingRoomScreen';
import { LookbookScreen } from './components/LookbookScreen';
import { AppNavbar, ScreenType } from './components/AppNavbar';
import { SmoothScrollManager } from './components/SmoothScrollManager';
import { soundEngine } from './utils/audioSynth';

export default function App() {
  // Navigation state (Default to 'home' for welcoming entrance into the fashion realm)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Outfit state - Initially bare mannequin as requested ("bản vẽ 2D mới đầu sẽ không có mặc trang phục gì khi người cho mặc mới có trang phục")
  const [currentTop, setCurrentTop] = useState<WardrobeItem | null>(null);
  const [currentBottom, setCurrentBottom] = useState<WardrobeItem | null>(null);
  const [currentAccessory, setCurrentAccessory] = useState<WardrobeItem | null>(null);
  const [currentFabric, setCurrentFabric] = useState<FabricOption>(FABRICS[1]); // Gấm Cung Đình
  const [currentColor, setCurrentColor] = useState<ColorOption>(COLOR_PALETTES[0]); // Đỏ Điều / Sắc thắm
  const [topCustomColor, setTopCustomColor] = useState<string | undefined>(undefined);
  const [bottomCustomColor, setBottomCustomColor] = useState<string | undefined>(undefined);

  // Harmony analysis data passed between screens
  const [harmonyData, setHarmonyData] = useState<HarmonyResult>({
    score: 0,
    ratingBadge: 'Khung Ma Nơ Canh Mộc',
    historicalMatchPercent: 0,
    colorHarmonyPercent: 0,
    contextAestheticPercent: 0,
    critiqueTitle: 'Chưa khoác y phục',
    detailedCritique:
      'Khung ma nơ canh đang để mộc thanh lịch. Hãy chọn áo, quần/váy và phụ kiện bên phải để bắt đầu thiết kế xiêm y cổ phục!',
    culturalSecret:
      'Cổ nhân coi phục sức là diện mạo của lễ giáo, "y phục xứng kỳ đức". Mời bạn khai mở xiêm y.',
    stylingTip:
      'Hãy bắt đầu bằng việc chọn một dáng áo yêu thích: Áo Ngũ Thân trang nhã, Áo Nhật Bình vương giả hay Áo Giao Lĩnh cổ phong.',
  });

  // Cloud Curtain visibility state
  const [isCloudCurtainActive, setIsCloudCurtainActive] = useState<boolean>(true);

  const handleStartFitting = () => {
    soundEngine.playPluck(523.25);
    setCurrentScreen('fitting');
  };

  const handleApplyPreset = (preset: PresetOutfit) => {
    soundEngine.playPluck(587.33);
    const topItem = TOPS.find((t) => t.id === preset.topId) || TOPS[0];
    const bottomItem = BOTTOMS.find((b) => b.id === preset.bottomId) || BOTTOMS[0];
    const accessoryItem = ACCESSORIES.find((a) => a.id === preset.accessoryId) || ACCESSORIES[0];
    const colorItem = COLOR_PALETTES.find((c) => c.id === preset.colorId) || COLOR_PALETTES[0];
    const fabricItem = FABRICS.find((f) => f.id === preset.fabricId) || FABRICS[0];

    setCurrentTop(topItem);
    setCurrentBottom(bottomItem);
    setCurrentAccessory(accessoryItem);
    setCurrentColor(colorItem);
    setCurrentFabric(fabricItem);
    setTopCustomColor(undefined);
    setBottomCustomColor(undefined);

    setHarmonyData({
      score: preset.presetScore,
      ratingBadge: 'Bản Phối Điển Hình',
      historicalMatchPercent: 96,
      colorHarmonyPercent: 95,
      contextAestheticPercent: 94,
      critiqueTitle: `${preset.title} (${preset.presetScore} điểm)`,
      detailedCritique: preset.subtitle,
      culturalSecret: topItem.cultureInfo.symbolism,
      stylingTip:
        'Thần thái tự tin, đoan trang là chìa khóa tôn vinh trọn vẹn nét đẹp cổ phục.',
    });

    setCurrentScreen('fitting');
  };

  const handleSelectTopItemFromEncyclopedia = (topId: string) => {
    soundEngine.playPluck(587.33);
    const foundTop = TOPS.find((t) => t.id === topId);
    if (foundTop) {
      setCurrentTop(foundTop);
      setTopCustomColor(undefined);
    }
    setCurrentScreen('fitting');
  };

  const handleApplyAiSuggestion = (suggestion: {
    topId: string;
    bottomId: string;
    accessoryId: string;
    title: string;
    advice: string;
    persona: string;
  }) => {
    soundEngine.playPluck(659.25);
    const topItem = TOPS.find((t) => t.id === suggestion.topId) || TOPS[0];
    const bottomItem = BOTTOMS.find((b) => b.id === suggestion.bottomId) || BOTTOMS[0];
    const accessoryItem = ACCESSORIES.find((a) => a.id === suggestion.accessoryId) || ACCESSORIES[0];

    setCurrentTop(topItem);
    setCurrentBottom(bottomItem);
    setCurrentAccessory(accessoryItem);
    setTopCustomColor(undefined);
    setBottomCustomColor(undefined);

    setHarmonyData({
      score: 93,
      ratingBadge: 'Đề xuất AI Khuyên Dùng',
      historicalMatchPercent: 94,
      colorHarmonyPercent: 92,
      contextAestheticPercent: 95,
      critiqueTitle: `${suggestion.title} (93 điểm)`,
      detailedCritique: suggestion.advice,
      culturalSecret: `Bản phối hướng đến nhân vật: ${suggestion.persona}`,
      stylingTip: 'Hãy phối hợp ánh mắt và tư thế khoan thai để toát lên thần thái di sản.',
    });

    setCurrentScreen('fitting');
  };

  const handleGoHome = () => {
    soundEngine.playPluck(440);
    setCurrentScreen('home');
  };

  const handleGoLookbook = (harmony?: HarmonyResult) => {
    soundEngine.playPluck(587.33);
    if (harmony) setHarmonyData(harmony);
    setCurrentScreen('lookbook');
  };

  return (
    <SmoothScrollManager>
      <div className="min-h-screen w-full bg-[#0A0E17] text-slate-100 font-sans-vi flex flex-col justify-start">
        {/* Unified Global Navigation Bar across all screens - Hoàn toàn ẩn khi màn mây đang mở, chỉ hiện khi mây tan & trống đồng hoàn tất xoay vòng */}
        {(!isCloudCurtainActive || currentScreen !== 'home') && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="z-[150] sticky top-0 w-full"
          >
            <AppNavbar
              currentScreen={currentScreen}
              onNavigate={(screen) => {
                soundEngine.playPluck(440);
                setCurrentScreen(screen);
              }}
            />
          </motion.div>
        )}

        {/* Active Screen Rendering */}
        {currentScreen === 'home' && (
          <HomeScreen
            onStartFitting={handleStartFitting}
            onApplyPreset={handleApplyPreset}
            onApplyAiSuggestion={handleApplyAiSuggestion}
            onSelectTopItem={handleSelectTopItemFromEncyclopedia}
            isCloudCurtainActive={isCloudCurtainActive}
            onCloudCurtainChange={setIsCloudCurtainActive}
          />
        )}

        {currentScreen === 'fitting' && (
          <FittingRoomScreen
            currentTop={currentTop}
            currentBottom={currentBottom}
            currentAccessory={currentAccessory}
            currentFabric={currentFabric}
            currentColor={currentColor}
            topCustomColor={topCustomColor}
            bottomCustomColor={bottomCustomColor}
            onSelectTop={(item) => {
              setCurrentTop(item);
              setTopCustomColor(undefined);
            }}
            onSelectBottom={(item) => {
              setCurrentBottom(item);
              setBottomCustomColor(undefined);
            }}
            onSelectAccessory={setCurrentAccessory}
            onSelectFabric={setCurrentFabric}
            onSelectColor={setCurrentColor}
            onSelectTopColor={(hex) => setTopCustomColor(hex || undefined)}
            onSelectBottomColor={(hex) => setBottomCustomColor(hex || undefined)}
            onGoHome={handleGoHome}
            onGoLookbook={handleGoLookbook}
          />
        )}

        {currentScreen === 'lookbook' && (
          <LookbookScreen
            top={currentTop || TOPS[0]}
            bottom={currentBottom || BOTTOMS[0]}
            accessory={currentAccessory || ACCESSORIES[0]}
            fabric={currentFabric}
            color={currentColor}
            topCustomColor={topCustomColor}
            bottomCustomColor={bottomCustomColor}
            harmonyData={harmonyData}
            onBackToFitting={() => setCurrentScreen('fitting')}
            onSelectBottom={setCurrentBottom}
          />
        )}
      </div>
    </SmoothScrollManager>
  );
}
