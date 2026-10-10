import React, { useState } from 'react';
import { AuraLogo } from './VietnameseDecorativeElements';
import { soundEngine } from '../utils/audioSynth';
import { useAppTheme } from '../context/ThemeContext';
import {
  Menu,
  X,
  Sparkles,
  Shirt,
  BookOpen,
  Home,
  Sun,
  Moon,
} from 'lucide-react';

export type ScreenType = 'home' | 'fitting' | 'lookbook';

interface AppNavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useAppTheme();

  const handleNavClick = (screen: ScreenType) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  const handleToggleTheme = () => {
    soundEngine.playSilkFlutter();
    toggleTheme();
  };

  const isCream = theme === 'cream';

  return (
    <header className="sticky top-0 z-[150] w-full transition-all">
      {/* Main Streamlined Navbar - Đơn giản, tinh tế, hòa hợp với giao diện */}
      <div className={`w-full border-b transition-colors duration-500 backdrop-blur-xl ${
        isCream
          ? 'border-amber-900/10 bg-[#FAF7F0]/92 shadow-[0_4px_20px_rgba(180,140,80,0.08)] text-slate-800'
          : 'border-amber-500/20 bg-[#080C16]/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => handleNavClick('home')}
          >
            <AuraLogo className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col text-left">
              <div className="flex items-center">
                <span className={`font-serif-vi font-bold text-lg sm:text-xl tracking-wide ${
                  isCream ? 'text-amber-700' : 'text-amber-300'
                }`}>
                  Aura
                </span>
                <span className={`text-sm sm:text-base font-medium ml-1 ${
                  isCream ? 'text-stone-700' : 'text-slate-200'
                }`}>
                  — Cung Điện Việt Phục
                </span>
              </div>
              <span className={`text-[9px] uppercase tracking-[0.2em] font-semibold hidden sm:block ${
                isCream ? 'text-amber-700/80' : 'text-amber-400/80'
              }`}>
                Di Sản Dân Tộc • Khảo Cứu Triều Đại • Phục Sức 2D
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Tinh gọn, thanh lịch */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'home'
                  ? isCream
                    ? 'text-amber-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-600 after:to-amber-700 after:rounded-full'
                    : 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : isCream
                  ? 'text-stone-600 hover:text-amber-800'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Trang chủ
            </button>

            <button
              onClick={() => handleNavClick('fitting')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'fitting'
                  ? isCream
                    ? 'text-amber-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-600 after:to-amber-700 after:rounded-full'
                    : 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : isCream
                  ? 'text-stone-600 hover:text-amber-800'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 ${isCream ? 'text-amber-600' : 'text-amber-400'}`} />
                Phòng thử phục sắc 2D
              </span>
            </button>

            <button
              onClick={() => handleNavClick('lookbook')}
              className={`text-sm font-medium transition-all relative py-2 cursor-pointer ${
                currentScreen === 'lookbook'
                  ? isCream
                    ? 'text-amber-800 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-600 after:to-amber-700 after:rounded-full'
                    : 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-amber-400 after:to-amber-500 after:rounded-full'
                  : isCream
                  ? 'text-stone-600 hover:text-amber-800'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              Lookbook cá nhân
            </button>
          </nav>

          {/* Right Action Icons: Theme Switcher & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Tone Switcher Button (Trắng Kem Ngà ⇄ Dạ Yến) */}
            <button
              onClick={handleToggleTheme}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all shadow-xs ${
                isCream
                  ? 'bg-amber-100/80 hover:bg-amber-200/80 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-[#121A2D] hover:bg-[#1A2640] border-slate-700/80 text-amber-300'
              }`}
              title={isCream ? 'Chuyển sang Tone Dạ Yến (Đêm)' : 'Chuyển sang Tone Trắng Kem Ngà (Ấm)'}
            >
              {isCream ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Trắng Kem Ngà</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Dạ Yến Đêm</span>
                </>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl border cursor-pointer ${
                isCream
                  ? 'bg-amber-50 border-amber-200 text-stone-700'
                  : 'bg-[#121A2D] border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              aria-label="Mở menu di động"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-5 py-4 flex flex-col gap-2.5 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-2xl ${
          isCream
            ? 'bg-[#FAF7F0]/98 border-amber-900/10 text-stone-800'
            : 'bg-[#090D17]/95 border-amber-500/20 text-slate-100'
        }`}>
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'home'
                ? isCream
                  ? 'bg-amber-200/60 text-amber-900 font-bold border border-amber-300'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : isCream
                ? 'text-stone-700 hover:bg-amber-100/50'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => handleNavClick('fitting')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'fitting'
                ? isCream
                  ? 'bg-amber-200/60 text-amber-900 font-bold border border-amber-300'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : isCream
                ? 'text-stone-700 hover:bg-amber-100/50'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Shirt className="w-4 h-4 text-amber-600" />
            <span>Phòng thử phục sắc 2D</span>
          </button>

          <button
            onClick={() => handleNavClick('lookbook')}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all cursor-pointer ${
              currentScreen === 'lookbook'
                ? isCream
                  ? 'bg-amber-200/60 text-amber-900 font-bold border border-amber-300'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : isCream
                ? 'text-stone-700 hover:bg-amber-100/50'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Lookbook cá nhân</span>
          </button>
        </div>
      )}
    </header>
  );
};

