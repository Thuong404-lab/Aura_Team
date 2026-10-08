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
import { FittingRoomScreen } from './components/FittingRoomScreen';
import { LookbookScreen, SavedLookbookItem } from './components/LookbookScreen';
import { SavedLibraryModal } from './components/SavedLibraryModal';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Bookmark,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';
import { soundEngine } from './utils/audioSynth';

export type ScreenType = 'home' | 'fitting' | 'lookbook';
export type DeviceFrameType = 'responsive' | 'laptop' | 'tablet' | 'mobile';

export default function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameType>('responsive');

  // Outfit state
  const [currentTop, setCurrentTop] = useState<WardrobeItem>(TOPS[0]); // Áo Nhật Bình
  const [currentBottom, setCurrentBottom] = useState<WardrobeItem>(BOTTOMS[1]); // Quần Lụa Men Lam
  const [currentAccessory, setCurrentAccessory] = useState<WardrobeItem>(ACCESSORIES[0]); // Mấn Ngũ Sắc
  const [currentFabric, setCurrentFabric] = useState<FabricOption>(FABRICS[1]); // Gấm Cung Đình
  const [currentColor, setCurrentColor] = useState<ColorOption>(COLOR_PALETTES[0]); // Đỏ Điều

  // Harmony analysis data passed from Fitting room to Lookbook
  const [harmonyData, setHarmonyData] = useState<{
    score: number;
    ratingBadge: string;
    critiqueTitle: string;
    detailedCritique: string;
    culturalSecret: string;
    stylingTip: string;
  }>({
    score: 98,
    ratingBadge: 'Xuất sắc',
    critiqueTitle: 'Bản Phối Chuẩn Mực Cung Đình Triều Nguyễn',
    detailedCritique: 'Áo Nhật Bình kết hợp mấn ngũ sắc và quần lụa men lam tạo nên sắc thái vương giả, uy nghiêm của bậc nữ chủ hoàng gia.',
    culturalSecret: 'Cổ áo hình chữ nhật đại diện cho chữ Nhật (Mặt trời), viền ngũ sắc tượng trưng ngũ hành giao hòa.',
    stylingTip: 'Hãy hướng nhẹ ánh mắt nghiêng 30 độ và cầm quạt lụa ngang ngực để toát lên phong thái đài các.',
  });

  // Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Saved Lookbooks collection (LocalStorage)
  const [savedLookbooks, setSavedLookbooks] = useState<SavedLookbookItem[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // Initialize saved lookbooks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vietphuc_saved_lookbooks');
      if (stored) {
        setSavedLookbooks(JSON.parse(stored));
      } else {
        // Sample starter lookbook
        const initialSample: SavedLookbookItem = {
          id: 'sample-1',
          date: new Date().toLocaleDateString('vi-VN'),
          title: 'Nét Cố Đô Thu Sắc',
          topName: 'Áo Nhật Bình',
          bottomName: 'Quần Lụa Men Lam',
          accessoryName: 'Mấn Thêu Ngũ Sắc',
          backdropName: 'Đại Nội Hoàng Thành Huế',
          score: 98,
          aiStory: 'Bản phối vương giả tôn vinh vẻ đài các của phụ nữ quý tộc thời Nguyễn, giao hòa tuyệt mỹ cùng rêu phong Đại Nội.',
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
    setCurrentScreen('lookbook');
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

  const handleGoLookbook = (harmony?: typeof harmonyData) => {
    soundEngine.playPluck(587.33);
    if (harmony) setHarmonyData(harmony);
    setCurrentScreen('lookbook');
  };

  // Render current screen content
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onStartFitting={handleStartFitting}
            onApplyPreset={handleApplyPreset}
            onApplyAiSuggestion={handleApplyAiSuggestion}
            isPlayingMusic={isPlayingMusic}
            setIsPlayingMusic={setIsPlayingMusic}
          />
        );
      case 'fitting':
        return (
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
          />
        );
      case 'lookbook':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 font-sans-vi flex flex-col items-center justify-start">
      {/* Top Global Control Toolbar */}
      <nav className="w-full bg-[#1A1210] border-b border-[#D4AF37]/30 px-4 py-2 flex items-center justify-between text-xs text-[#FDFBF7] z-50">
        {/* Left: Screen switcher buttons as requested in user's prompt */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => {
              soundEngine.playPluck(392);
              setCurrentScreen('home');
            }}
            className={`px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-[#8B1E1E] text-white shadow-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏠 1. Trang Chủ (Laptop)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPluck(440);
              setCurrentScreen('fitting');
            }}
            className={`px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === 'fitting'
                ? 'bg-[#8B1E1E] text-white shadow-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🪞 2. Phòng Thử Đồ (Tablet)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPluck(523.25);
              setCurrentScreen('lookbook');
            }}
            className={`px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentScreen === 'lookbook'
                ? 'bg-[#8B1E1E] text-white shadow-sm font-bold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>📖 3. Lookbook (Mobile)</span>
          </button>
        </div>

        {/* Right: Device simulation frame selector & music toggle */}
        <div className="flex items-center gap-2">
          {/* Saved library shortcut */}
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 text-[11px] transition-all"
            title="Mở thư viện đã lưu"
          >
            <Bookmark className="w-3 h-3 text-[#D4AF37]" />
            <span>Đã lưu ({savedLookbooks.length})</span>
          </button>

          {/* Music ambiance toggle */}
          <button
            onClick={() => {
              soundEngine.toggleAmbiance((playing) => setIsPlayingMusic(playing));
            }}
            className={`p-1.5 rounded-full transition-all ${
              isPlayingMusic ? 'bg-[#8B1E1E] text-white' : 'bg-white/10 text-stone-300 hover:text-white'
            }`}
            title="Bật/Tắt nhạc đàn tranh truyền thống"
          >
            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Device Frame Viewport Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10 text-[11px]">
            <button
              onClick={() => setDeviceFrame('responsive')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                deviceFrame === 'responsive' ? 'bg-[#8B1E1E] text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Khung nhìn toàn màn hình tự do"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDeviceFrame('laptop')}
              className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                deviceFrame === 'laptop' ? 'bg-[#8B1E1E] text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Mô phỏng Laptop"
            >
              <Monitor className="w-3 h-3" />
              <span>Laptop</span>
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                deviceFrame === 'tablet' ? 'bg-[#8B1E1E] text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Mô phỏng iPad / Tablet"
            >
              <Tablet className="w-3 h-3" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                deviceFrame === 'mobile' ? 'bg-[#8B1E1E] text-white' : 'text-stone-400 hover:text-white'
              }`}
              title="Mô phỏng Điện thoại"
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Display Area (With Optional Device Mock Frame) */}
      <div className="w-full flex-1 flex items-center justify-center overflow-x-hidden">
        {deviceFrame === 'responsive' ? (
          <div className="w-full h-full min-h-[calc(100vh-42px)]">{renderScreenContent()}</div>
        ) : deviceFrame === 'laptop' ? (
          // LAPTOP FRAME SIMULATION
          <div className="my-6 w-full max-w-6xl p-4">
            <div className="rounded-3xl border-4 border-stone-700 bg-stone-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Browser bar */}
              <div className="bg-stone-800 px-4 py-2.5 flex items-center justify-between border-b border-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-stone-900 text-stone-400 text-xs px-6 py-1 rounded-full font-mono flex items-center gap-1.5 border border-stone-700">
                  <span>https://sangtaocungvietphuc.vn</span>
                </div>
                <div className="w-12" />
              </div>
              <div className="max-h-[85vh] overflow-y-auto">{renderScreenContent()}</div>
            </div>
            {/* Laptop base */}
            <div className="w-48 h-2 bg-stone-700 mx-auto rounded-b-xl" />
          </div>
        ) : deviceFrame === 'tablet' ? (
          // TABLET / IPAD FRAME SIMULATION
          <div className="my-6 p-4">
            <div className="w-[840px] max-w-[95vw] rounded-[48px] border-[14px] border-stone-800 bg-stone-900 shadow-2xl overflow-hidden ring-1 ring-white/20">
              {/* Camera dot */}
              <div className="h-4 bg-stone-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              </div>
              <div className="h-[750px] overflow-y-auto bg-stone-100">{renderScreenContent()}</div>
            </div>
          </div>
        ) : (
          // MOBILE PHONE FRAME SIMULATION
          <div className="my-6 p-4">
            <div className="w-[410px] max-w-[95vw] rounded-[56px] border-[12px] border-stone-800 bg-stone-900 shadow-2xl overflow-hidden ring-1 ring-white/20">
              {/* Dynamic Island / Notch */}
              <div className="h-6 bg-stone-900 flex items-center justify-center">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
              <div className="h-[760px] overflow-y-auto bg-stone-100">{renderScreenContent()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Saved Lookbook Library Modal */}
      <SavedLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedItems={savedLookbooks}
        onDelete={handleDeleteSaved}
        onLoadItem={handleLoadSaved}
      />
    </div>
  );
}
