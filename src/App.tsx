import React, { useState, useEffect } from 'react';
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
import { LookbookScreen, SavedLookbookItem } from './components/LookbookScreen';
import { SavedLibraryModal } from './components/SavedLibraryModal';
import { LoginModal } from './components/LoginModal';
import { AppNavbar, ScreenType } from './components/AppNavbar';
import { SmoothScrollManager } from './components/SmoothScrollManager';
import { soundEngine } from './utils/audioSynth';

export default function App() {
  //ghjghghkhkj
  // Navigation state (Default to 'home' for welcoming entrance into the fashion realm)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Outfit state - Defaults to Áo ngũ thân tay chẽn + Váy xếp ly + Mấn đội đầu
  const [currentTop, setCurrentTop] = useState<WardrobeItem>(TOPS[0]); // Áo ngũ thân tay chẽn
  const [currentBottom, setCurrentBottom] = useState<WardrobeItem>(
    BOTTOMS.find((b) => b.id === 'vay-xep-ly') || BOTTOMS[0]
  ); // Váy xếp ly
  const [currentAccessory, setCurrentAccessory] = useState<WardrobeItem>(ACCESSORIES[0]); // Mấn đội đầu
  const [currentFabric, setCurrentFabric] = useState<FabricOption>(FABRICS[1]); // Gấm Cung Đình
  const [currentColor, setCurrentColor] = useState<ColorOption>(COLOR_PALETTES[0]); // Đỏ Điều / Sắc thắm

  // Harmony analysis data passed between screens
  const [harmonyData, setHarmonyData] = useState<HarmonyResult>({
    score: 95,
    ratingBadge: 'Phối đồ xuất sắc',
    historicalMatchPercent: 96,
    colorHarmonyPercent: 95,
    contextAestheticPercent: 95,
    critiqueTitle: 'Phối đồ xuất sắc (95 điểm)',
    detailedCritique:
      'Sự kết hợp hài hòa giữa Áo ngũ thân tay chẽn truyền thống và váy xếp ly hiện đại, giữ được nét thanh lịch nhưng vẫn năng động.',
    culturalSecret:
      'Áo ngũ thân quy chuẩn đi kèm mấn tròn quấn nhiều vòng, tạo nét trang trọng, đài các cho diện mạo.',
    stylingTip:
      'Khi tạo dáng, hãy đứng thẳng người thanh thoát, tay giữ nhẹ tà áo để tôn trọn phom áo năm thân.',
  });

  // Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Cloud Intro trigger count (to re-run from navbar)
  const [cloudIntroCount, setCloudIntroCount] = useState<number>(0);
  const [isCloudCurtainActive, setIsCloudCurtainActive] = useState<boolean>(true);

  // Saved Lookbooks collection (LocalStorage)
  const [savedLookbooks, setSavedLookbooks] = useState<SavedLookbookItem[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Initialize saved lookbooks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vietphuc_saved_lookbooks');
      if (stored) {
        setSavedLookbooks(JSON.parse(stored));
      } else {
        const initialSample: SavedLookbookItem = {
          id: 'sample-1',
          date: new Date().toLocaleDateString('vi-VN'),
          title: 'Phối đồ xuất sắc (95 điểm)',
          topName: 'Áo ngũ thân tay chẽn',
          bottomName: 'Chân Váy Xếp Ly',
          accessoryName: 'Mấn đội đầu',
          backdropName: 'Phố Cổ Hội An',
          score: 95,
          aiStory:
            'Sự kết hợp hài hòa giữa Áo ngũ thân tay chẽn truyền thống và váy xếp ly hiện đại, giữ được nét thanh lịch nhưng vẫn năng động.',
        };
        setSavedLookbooks([initialSample]);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Screen transition background music crossfade (Web Audio API fade-in/out)
  useEffect(() => {
    soundEngine.transitionToScreen(currentScreen, 1.2);
  }, [currentScreen]);

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

  const handleSaveLookbook = (item: SavedLookbookItem) => {
    soundEngine.playPluck(783.99);
    const updated = [item, ...savedLookbooks];
    setSavedLookbooks(updated);
    try {
      localStorage.setItem('vietphuc_saved_lookbooks', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleDeleteSaved = (id: string) => {
    soundEngine.playPluck(330);
    const updated = savedLookbooks.filter((item) => item.id !== id);
    setSavedLookbooks(updated);
    try {
      localStorage.setItem('vietphuc_saved_lookbooks', JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleLoadSaved = (item: SavedLookbookItem) => {
    soundEngine.playPluck(523.25);
    const foundTop = TOPS.find((t) => t.name === item.topName) || TOPS[0];
    const foundBottom = BOTTOMS.find((b) => b.name === item.bottomName) || BOTTOMS[0];
    const foundAcc = ACCESSORIES.find((a) => a.name === item.accessoryName) || ACCESSORIES[0];

    setCurrentTop(foundTop);
    setCurrentBottom(foundBottom);
    setCurrentAccessory(foundAcc);

    setHarmonyData((prev) => ({
      ...prev,
      score: item.score,
      critiqueTitle: item.title,
      detailedCritique: item.aiStory,
    }));

    setIsLibraryOpen(false);
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
        {/* Unified Global Navigation Bar across all screens - Ẩn hoàn toàn khi màn mây đang mở */}
        <div
          className={`transition-all duration-700 ease-out z-[150] sticky top-0 ${
            isCloudCurtainActive && currentScreen === 'home'
              ? 'opacity-0 pointer-events-none -translate-y-full h-0 overflow-hidden'
              : 'opacity-100 pointer-events-auto translate-y-0 h-auto'
          }`}
        >
          <AppNavbar
            currentScreen={currentScreen}
            onNavigate={(screen) => {
              soundEngine.playPluck(440);
              setCurrentScreen(screen);
            }}
            onOpenSavedLibrary={() => setIsLibraryOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            savedCount={savedLookbooks.length}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={() => {
              soundEngine.toggleAmbiance((playing) => setIsPlayingMusic(playing));
            }}
            onTriggerCloudIntro={() => {
              soundEngine.playPluck(523.25);
              setCurrentScreen('home');
              setIsCloudCurtainActive(true);
              setCloudIntroCount((prev) => prev + 1);
            }}
          />
        </div>

        {/* Active Screen Rendering */}
        {currentScreen === 'home' && (
          <HomeScreen
            onStartFitting={handleStartFitting}
            onApplyPreset={handleApplyPreset}
            onApplyAiSuggestion={handleApplyAiSuggestion}
            isPlayingMusic={isPlayingMusic}
            setIsPlayingMusic={setIsPlayingMusic}
            onOpenSavedLibrary={() => setIsLibraryOpen(true)}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            savedCount={savedLookbooks.length}
            onSelectTopItem={handleSelectTopItemFromEncyclopedia}
            triggerCloudIntroCount={cloudIntroCount}
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
            onSelectTop={setCurrentTop}
            onSelectBottom={setCurrentBottom}
            onSelectAccessory={setCurrentAccessory}
            onSelectFabric={setCurrentFabric}
            onSelectColor={setCurrentColor}
            onGoHome={handleGoHome}
            onGoLookbook={handleGoLookbook}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {currentScreen === 'lookbook' && (
          <LookbookScreen
            top={currentTop}
            bottom={currentBottom}
            accessory={currentAccessory}
            fabric={currentFabric}
            color={currentColor}
            harmonyData={harmonyData}
            onBackToFitting={() => setCurrentScreen('fitting')}
            onSaveLookbook={handleSaveLookbook}
            savedItems={savedLookbooks}
            onOpenSavedDrawer={() => setIsLibraryOpen(true)}
          />
        )}

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        {/* Saved Lookbook Library Modal */}
        <SavedLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          savedItems={savedLookbooks}
          onLoadItem={handleLoadSaved}
          onDelete={handleDeleteSaved}
        />
      </div>
    </SmoothScrollManager>
  );
}
