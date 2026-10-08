import React, { useState } from 'react';
import { AuraLogo } from './VietnameseDecorativeElements';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Bookmark,
  User,
  Sparkles,
  Shirt,
  BookOpen,
  Home,
} from 'lucide-react';

export type ScreenType = 'home' | 'fitting' | 'lookbook';

interface AppNavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenSavedLibrary: () => void;
  onOpenLoginModal: () => void;
  savedCount: number;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenSavedLibrary,
  onOpenLoginModal,
  savedCount,
  isPlayingMusic,
  onToggleMusic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#0C1220]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <AuraLogo className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col text-left">
            <div className="flex items-center">
              <span className="font-serif-vi font-bold text-lg sm:text-xl text-amber-300 tracking-wide">
                Aura
              </span>
              <span className="text-slate-200 text-sm sm:text-base font-medium ml-1">
                -Việt phục Remix
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/70 font-semibold hidden sm:block">
              Di Sản • Trợ Lý AI • Digital Lookbook
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium transition-colors relative py-1.5 ${
              currentScreen === 'home'
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                : 'text-slate-300 hover:text-amber-300'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => handleNavClick('fitting')}
            className={`text-sm font-medium transition-colors relative py-1.5 ${
              currentScreen === 'fitting'
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                : 'text-slate-300 hover:text-amber-300'
            }`}
          >
            Phòng thử đồ
          </button>

          <button
            onClick={() => handleNavClick('lookbook')}
            className={`text-sm font-medium transition-colors relative py-1.5 ${
              currentScreen === 'lookbook'
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                : 'text-slate-300 hover:text-amber-300'
            }`}
          >
            Lookbook cá nhân
          </button>

          <button
            onClick={onOpenSavedLibrary}
            className="text-sm font-medium text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Đã lưu ({savedCount})</span>
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleMusic}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isPlayingMusic
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#121A2C] border-slate-700/70 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={isPlayingMusic ? 'Tắt âm nhạc cung đình' : 'Bật âm nhạc cung đình'}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isPlayingMusic ? 'Nhã nhạc: Bật' : 'Nhã nhạc: Tắt'}
            </span>
          </button>

          {/* Desktop Login Button */}
          <button
            onClick={onOpenLoginModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-xs hover:border-amber-400 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#121A2C] border border-slate-700/80 text-slate-300 hover:text-white"
            aria-label="Mở menu di động"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Fluid & Responsive on phone screens) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0E18]/95 border-b border-amber-500/20 px-5 py-4 flex flex-col gap-3 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
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
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
              currentScreen === 'fitting'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Phòng thử đồ</span>
          </button>

          <button
            onClick={() => handleNavClick('lookbook')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
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
            className="w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition-all"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Bộ sưu tập đã lưu ({savedCount})</span>
          </button>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenLoginModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập tài khoản</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
