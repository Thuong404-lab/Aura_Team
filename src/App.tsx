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
import { soundEngine } from './utils/audioSynth';

export default function App() {
  // Navigation state (Default to 'fitting' as shown in the user's mockup)
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('fitting');

  // Outfit state - Defaults exactly to the mockup: Áo ngũ thân tay chẽn + Váy xếp ly + Mấn đội đầu
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

  // Save lookbook handler
  const handleSaveLookbook = (item: SavedLookbookItem) => {
    setSavedLookbooks((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem('vietphuc_saved_lookbooks', JSON.stringify(updated));
      } catch {
        // Storage full or disabled
      }
      return updated;
    });
  };

  // Delete saved lookbook
  const handleDeleteSaved = (id: string) => {
    setSavedLookbooks((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('vietphuc_saved_lookbooks', JSON.stringify(updated));
      } catch {
        // Storage full or disabled
      }
      return updated;
    });
  };

  // Load a saved lookbook into workspace
  const handleLoadSaved = (item: SavedLookbookItem) => {
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
    setCurrentScreen('fitting');
  };

  // Apply preset outfit
  const handleApplyPreset = (preset: PresetOutfit) => {
    soundEngine.playPluck(523.25);
    const top = TOPS.find((t) => t.id === preset.topId) || TOPS[0];
    const bottom = BOTTOMS.find((b) => b.id === preset.bottomId) || BOTTOMS[0];
    const acc = ACCESSORIES.find((a) => a.id === preset.accessoryId) || ACCESSORIES[0];
    const fab = FABRICS.find((f) => f.id === preset.fabricId) || FABRICS[0];
    const col = COLOR_PALETTES.find((c) => c.id === preset.colorId) || COLOR_PALETTES[0];

    setCurrentTop(top);
    setCurrentBottom(bottom);
    setCurrentAccessory(acc);
    setCurrentFabric(fab);
    setCurrentColor(col);
    setHarmonyData((prev) => ({
      ...prev,
      score: preset.presetScore,
      critiqueTitle: `Bản Phối ${preset.title}`,
      detailedCritique: preset.subtitle,
    }));
    setCurrentScreen('fitting');
  };

  // Apply AI Suggestion
  const handleApplyAiSuggestion = (suggestion: {
    topId: string;
    bottomId: string;
    accessoryId: string;
    title: string;
    advice: string;
    persona: string;
  }) => {
    const top = TOPS.find((t) => t.id === suggestion.topId) || TOPS[0];
    const bottom = BOTTOMS.find((b) => b.id === suggestion.bottomId) || BOTTOMS[0];
    const acc = ACCESSORIES.find((a) => a.id === suggestion.accessoryId) || ACCESSORIES[0];

    setCurrentTop(top);
    setCurrentBottom(bottom);
    setCurrentAccessory(acc);
    setHarmonyData((prev) => ({
      ...prev,
      score: 96,
      critiqueTitle: suggestion.title,
      detailedCritique: `${suggestion.advice} (Hình mẫu: ${suggestion.persona})`,
    }));
    setCurrentScreen('fitting');
  };

  // Navigation handlers
  const handleStartFitting = () => {
    soundEngine.playPluck(440);
    setCurrentScreen('fitting');
  };

  const handleGoHome = () => {
    soundEngine.playPluck(392);
    setCurrentScreen('home');
  };

  const handleGoLookbook = (harmony?: HarmonyResult) => {
    soundEngine.playPluck(587.33);
    if (harmony) setHarmonyData(harmony);
    setCurrentScreen('lookbook');
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0E17] text-slate-100 font-sans-vi flex flex-col justify-start">
      {/* Unified Global Navigation Bar across all screens */}
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
      />

      {/* Active Screen Rendering */}
      {currentScreen === 'home' && (
        <HomeScreen
          onStartFitting={handleStartFitting}
          onApplyPreset={handleApplyPreset}
          onApplyAiSuggestion={handleApplyAiSuggestion}
          isPlayingMusic={isPlayingMusic}
          setIsPlayingMusic={setIsPlayingMusic}
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
  );
}
