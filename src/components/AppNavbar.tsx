import React, { useState } from 'react';
import { AuraLogo } from './VietnameseDecorativeElements';
import { soundEngine } from '../utils/audioSynth';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Bookmark,
  Sparkles,
  Shirt,
  BookOpen,
  Home,
  Wind,
} from 'lucide-react';

export type ScreenType = 'home' | 'fitting' | 'lookbook';

interface AppNavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenSavedLibrary: () => void;
  savedCount: number;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onTriggerCloudIntro?: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSavedLibrary,
  savedCount,
  isPlayingMusic,
  onToggleMusic,
  onTriggerCloudIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[150] w-full transition-all">
      {/* Main Streamlined Navbar - Đơn giản, tinh tế, hòa hợp với giao diện Cung Điện */}
      <div className="w-full border-b border-amber-500/20 bg-[#080C16]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => handleNavClick('home')}
          >
            <AuraLogo className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <div className="flex items-center">
                <span className="font-serif-vi font-bold text-lg sm:text-xl text-amber-300 tracking-wide">
                  Aura
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium ml-1">
                  — Cung Điện Việt Phục
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 font-semibold hidden sm:block">
                Di Sản Dân Tộc • Khảo Cứu Triều Đại • Phục Sức 3D
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Tinh gọn, thanh lịch */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'home'
                  ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Trang chủ
            </button>

            <button
              onClick={() => handleNavClick('fitting')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'fitting'
                  ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Phòng thử phục sắc 3D
              </span>
            </button>

            <button
              onClick={() => handleNavClick('lookbook')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'lookbook'
                  ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Lookbook cá nhân
            </button>

            <button
              onClick={onOpenSavedLibrary}
              className="text-sm font-medium text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer py-2"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Đã lưu ({savedCount})</span>
            </button>
          </nav>

          {/* Right Action Icons (Vén Mây & Nhã Nhạc) - Không còn Đăng Nhập / Tài Khoản */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Trigger for Cloud Parting Animation */}
            {onTriggerCloudIntro && (
              <button
                onClick={onTriggerCloudIntro}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 text-xs font-medium transition-all cursor-pointer group shadow-sm"
                title="Vén Mây Khai Mở Di Sản"
              >
                <Wind className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="hidden xl:inline">Vén Mây 3D</span>
              </button>
            )}

            {/* Audio Synthesizer Toggle */}
            <button
              onClick={onToggleMusic}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.25)]'
                  : 'bg-[#121A2D]/80 border-slate-700/70 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              title={
                isPlayingMusic
                  ? `Đang phát: ${soundEngine.getThemeName(currentScreen)} (Nhấp để tắt)`
                  : 'Bật nhã nhạc cung đình'
              }
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  {/* Equalizer Wave Bars */}
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-amber-400 animate-pulse rounded-full" />
                    <span
                      className="w-0.5 h-2/3 bg-amber-300 animate-pulse rounded-full"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-0.5 h-4/5 bg-amber-400 animate-pulse rounded-full"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </span>
                  <span className="hidden lg:inline truncate max-w-[120px]">
                    {soundEngine.getThemeName(currentScreen)}
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden lg:inline">Nhã nhạc</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#121A2D] border border-slate-700/80 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Mở menu di động"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Đơn giản, không có đăng nhập */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090D17]/95 border-b border-amber-500/20 px-5 py-4 flex flex-col gap-2.5 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => handleNavClick('fitting')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'fitting'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Phòng thử phục sắc 3D</span>
          </button>

          <button
            onClick={() => handleNavClick('lookbook')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'lookbook'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Lookbook cá nhân</span>
          </button>

          <button
            onClick={() => {
              onOpenSavedLibrary();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Bộ sưu tập đã lưu ({savedCount})</span>
          </button>

          {onTriggerCloudIntro && (
            <button
              onClick={() => {
                onTriggerCloudIntro();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 transition-all cursor-pointer"
            >
              <Wind className="w-4 h-4 text-amber-400" />
              <span>Hiệu ứng Vén Mây Cổ Phong</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
