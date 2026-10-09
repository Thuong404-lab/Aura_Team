import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp, BookOpen, Compass } from 'lucide-react';

interface SmoothScrollManagerProps {
  /** Optional children if used as wrapper */
  children?: React.ReactNode;
  /** Whether smooth scroll damping is enabled (default: true) */
  enabled?: boolean;
}

/**
 * SmoothScrollManager
 * Powered by Framer Motion:
 * 1. Silk-smooth momentum scrolling (inertial lerp physics) for browsing the site like a heritage royal album.
 * 2. Imperial Heritage Album reading progress bar at the top with glowing golden leaf.
 * 3. Quick-return floating imperial bookmark button to smoothly return to top.
 * 4. Respects nested scroll containers (modals, wardrobe drawers) and curtain interactions.
 */
export const SmoothScrollManager: React.FC<SmoothScrollManagerProps> = ({
  children,
  enabled = true,
}) => {
  // Framer Motion global scroll tracking
  const { scrollYProgress, scrollY } = useScroll();

  // Silk spring physics for the top album reading progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // State to show floating "Return to top of album" bookmark
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setShowScrollTop(latest > 360);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Silk momentum scrolling engine
  const targetScrollY = useRef(0);
  const isScrollingRef = useRef(false);
  const animFrameId = useRef<number | null>(null);

  // Smooth lerp function
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const smoothUpdate = useCallback(() => {
    const currentY = window.scrollY;
    const diff = targetScrollY.current - currentY;

    // If within 0.8px, snap and stop animating
    if (Math.abs(diff) < 0.8) {
      window.scrollTo(0, targetScrollY.current);
      isScrollingRef.current = false;
      return;
    }

    // Silky damping factor: 0.09 yields the luxurious feeling of gliding through heavyweight silk pages
    const nextY = lerp(currentY, targetScrollY.current, 0.09);
    window.scrollTo(0, nextY);

    animFrameId.current = requestAnimationFrame(smoothUpdate);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Initialize target scroll to current position
    targetScrollY.current = window.scrollY;

    const onWheel = (e: WheelEvent) => {
      // 1. Don't intercept if an active modal or full-screen curtain is taking over
      const isCurtainOpen = document.querySelector('[aria-label*="Màn Mây"]');
      if (isCurtainOpen) return;

      // 2. Do not intercept if interacting with interactive controls, navbar, canvas, or dialogs
      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        (targetEl.closest('header') ||
          targetEl.closest('nav') ||
          targetEl.closest('button') ||
          targetEl.closest('canvas') ||
          targetEl.closest('[role="dialog"]'))
      ) {
        return;
      }

      // 3. Check if target or any parent is an internal scrollable element (e.g. modal body, wardrobe grid)
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight
        ) {
          // If the element can still be scrolled in the direction of the wheel event, let it scroll natively
          const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
          const isAtBottom =
            el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
          if (!isAtTop && !isAtBottom) {
            return;
          }
        }
        el = el.parentElement;
      }

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      // If page doesn't have scrollable overflow (e.g. FittingRoom screen or short views), let native behaviour happen
      if (maxScroll <= 10) {
        return;
      }

      // 4. Smooth momentum scrolling on document body
      e.preventDefault();

      // Dampened delta for silky album browsing
      const delta = e.deltaY;
      const scrollStep = Math.sign(delta) * Math.min(Math.abs(delta) * 1.05, 160);

      targetScrollY.current = Math.max(
        0,
        Math.min(maxScroll, targetScrollY.current + scrollStep)
      );

      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        animFrameId.current = requestAnimationFrame(smoothUpdate);
      }
    };

    // Update target when user clicks anchor or uses keyboard scroll
    const onNativeScroll = () => {
      if (!isScrollingRef.current) {
        targetScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [enabled, smoothUpdate]);

  // Smooth scroll back to top of album
  const scrollToTop = () => {
    targetScrollY.current = 0;
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      animFrameId.current = requestAnimationFrame(smoothUpdate);
    }
  };

  return (
    <>
      {/* 1. TOP ALBUM READING PROGRESS BAR (THIẾT KẾ DẢI LỤA HOÀNG KIM) */}
      <div
        className="fixed top-0 left-0 right-0 z-[80] h-[3px] pointer-events-none select-none bg-amber-950/40"
        aria-hidden="true"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 origin-left shadow-[0_0_12px_rgba(245,158,11,0.6)] relative"
          style={{ scaleX }}
        >
          {/* Luminous pearl tip traveling along the bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
        </motion.div>
      </div>

      {/* 2. OPTIONAL CHILDREN WRAPPER */}
      {children}

      {/* 3. FLOATING HERITAGE BOOKMARK (LẬT VỀ ĐẦU ALBUM DI SẢN) */}
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
              onClick={scrollToTop}
              className="group relative p-3 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md shadow-xl shadow-amber-950/40 flex items-center justify-center cursor-pointer transition-colors"
              title="Lướt về đầu cuốn album di sản"
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
    </>
  );
};

export default SmoothScrollManager;
