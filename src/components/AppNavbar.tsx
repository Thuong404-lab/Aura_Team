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
  Compass,
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
    <header className="sticky top-0 z-40 w-full transition-all flex flex-col">
      {/* Top Cultural Heritage Ribbon */}
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 border-b border-amber-500/25 text-amber-200 py-1.5 px-4 text-[11px] font-medium tracking-wide flex items-center justify-between shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="truncate">
              🇻🇳 <strong>Di Sản Việt Phục Ngàn Năm</strong> • Khám phá tinh hoa trang phục truyền thống qua công nghệ 3D & AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[10px] text-amber-300/80 flex-shrink-0">
            <span>✨ Bảo tàng số hóa văn hóa phi lợi nhuận</span>
            <span>📜 Khảo cứu chuẩn mực lịch sử</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full border-b border-amber-500/20 bg-[#0C1220]/95 backdrop-blur-md">
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
                  — Cung Điện Việt Phục
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 font-semibold hidden sm:block">
                Di Sản Dân Tộc • Khảo Cứu Triều Đại • Phục Sức 3D
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-colors relative py-1.5 cursor-pointer ${
                currentScreen === 'home'
                  ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Trang chủ
            </button>

            <button
              onClick={() => handleNavClick('fitting')}
              className={`text-sm font-medium transition-colors relative py-1.5 cursor-pointer ${
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
              className={`text-sm font-medium transition-colors relative py-1.5 cursor-pointer ${
                currentScreen === 'lookbook'
                  ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Lookbook cá nhân
            </button>

            <button
              onClick={onOpenSavedLibrary}
              className="text-sm font-medium text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Đã lưu ({savedCount})</span>
            </button>
          </nav>

          {/* Right Action Icons (Music & User) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Audio Synthesizer Toggle */}
            <button
              onClick={onToggleMusic}
              className={`p-2 sm:px-2.5 sm:py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingMusic
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-[#121A2D] border-slate-700/70 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              title={isPlayingMusic ? 'Tắt nhã nhạc cung đình' : 'Bật nhã nhạc cung đình'}
            >
              {isPlayingMusic ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="hidden lg:inline">
                {isPlayingMusic ? 'Nhã nhạc: Bật' : 'Nhã nhạc'}
              </span>
            </button>

            {/* Desktop Login Button */}
            <button
              onClick={onOpenLoginModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Tài khoản</span>
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0E18]/95 border-b border-amber-500/20 px-5 py-4 flex flex-col gap-3 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
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

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenLoginModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
