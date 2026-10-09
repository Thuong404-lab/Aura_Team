import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';

interface LenisContextType {
  lenis: Lenis | null;
  scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
}

export const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollManagerProps {
  /** Children to wrap with smooth scrolling and hardware acceleration */
  children?: React.ReactNode;
}

/**
 * SmoothScrollManager (Powered by Studio Freight / Lenis Engine)
 *
 * Tối ưu hóa chuyển động cuộn không độ trễ, đạt chuẩn 60fps/120fps:
 * 1. Tích hợp thư viện 'lenis' chuẩn mực cho Web & Mobile với phương trình giảm tốc mũ mượt mà
 * 2. Vòng lặp requestAnimationFrame liên tục đồng bộ hóa hoàn hảo với màn hình tần số quét cao (ProMotion 120Hz)
 * 3. Không ép đặt transform: translateZ(0) lên wrapper toàn cục để tránh làm hỏng các phần tử position: fixed (màn mây, hạt bụi vàng, sương mù)
 * 4. Thanh tiến trình dải lụa hoàng kim cập nhật tức thì theo lenis.progress (0.0 -> 1.0)
 * 5. Nút 'Lướt về đầu album di sản' điều khiển lenis.scrollTo(0) với gia tốc êm ái
 */
export const SmoothScrollManager: React.FC<SmoothScrollManagerProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Khởi tạo Lenis với cấu hình tối ưu độ trễ thấp & quán tính mượt mà
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.3,
      wheelMultiplier: 1.0,
      infinite: false,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return Boolean(
          node.hasAttribute('data-lenis-prevent') ||
          node.classList.contains('custom-scrollbar') ||
          node.classList.contains('scrollbar-heritage') ||
          node.closest('[data-lenis-prevent]') ||
          node.closest('.custom-scrollbar') ||
          node.closest('.scrollbar-heritage')
        );
      },
    });

    lenisRef.current = lenis;

    // Cho phép truy cập toàn cục nếu cần
    if (typeof window !== 'undefined') {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // 2. Lắng nghe sự kiện cuộn từ Lenis
    lenis.on('scroll', (e: { scroll: number; limit: number; progress: number; velocity: number }) => {
      setScrollProgress(e.progress);
      setShowScrollTop(e.scroll > 320);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 350);
    });

    // 3. Vòng lặp requestAnimationFrame tối ưu hóa
    let animId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    };
    animId = requestAnimationFrame(raf);

    // 4. Chỉ tạm dừng Lenis cho các modal/drawer phụ (không chặn màn mây mở đầu)
    const observer = new MutationObserver(() => {
      const hasModalOpen = document.querySelector(
        '[role="dialog"]:not([aria-label*="Màn Mây"]):not([aria-label*="Curtain"]), [aria-modal="true"]:not([aria-label*="Màn Mây"])'
      );
      if (hasModalOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role', 'aria-modal'],
    });

    return () => {
      cancelAnimationFrame(animId);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: number | string | HTMLElement, options?: { offset?: number; duration?: number; immediate?: boolean }) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  };

  const handleScrollToTop = () => {
    try {
      soundEngine.playPluck(523.25);
    } catch {
      // Safe audio
    }
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {/* 1. TOP ALBUM READING PROGRESS BAR (THIẾT KẾ DẢI LỤA HOÀNG KIM) */}
      <div
        className="fixed top-0 left-0 right-0 z-[80] h-[3px] pointer-events-none select-none bg-amber-950/40"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 origin-left shadow-[0_0_12px_rgba(245,158,11,0.6)] relative transition-transform duration-75 ease-out"
          style={{
            transform: `scaleX(${Math.max(0, Math.min(1, scrollProgress))})`,
            willChange: 'transform',
          }}
        >
          {/* Luminous pearl tip traveling along the bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
        </div>
      </div>

      {/* 2. SCROLLABLE CONTENT WRAPPER (Không dùng transform trên container này để bảo toàn position: fixed) */}
      <div
        className="lenis-scroll-container w-full min-h-screen relative"
        style={{
          willChange: isScrolling ? 'contents' : 'auto',
        }}
      >
        {children}
      </div>

      {/* 3. FLOATING HERITAGE BOOKMARK (LẬT VỀ ĐẦU ALBUM DI SẢN BẰNG LENIS) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToTop}
              className="group relative p-3 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md shadow-xl shadow-amber-950/40 flex items-center justify-center cursor-pointer transition-colors"
              title="Lướt về đầu cuốn album di sản (Lenis)"
              aria-label="Cuộn về đầu trang"
            >
              {/* Pulsing ambient halo */}
              <div className="absolute inset-0 rounded-full bg-amber-400/10 group-hover:bg-amber-400/20 animate-pulse pointer-events-none" />

              <ArrowUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />

              {/* Tooltip on hover */}
              <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-slate-900/95 border border-amber-500/30 text-[11px] font-medium text-amber-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                Đầu Album Di Sản
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </LenisContext.Provider>
  );
};

export default SmoothScrollManager;
