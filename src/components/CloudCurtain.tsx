import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import {
  RoyalGoldenSwirlCloud,
  CinnabarFireCloud,
  IvoryRuyiCloud,
  IndigoWaveCloud,
  StreamerWispsCloud,
  WingedImperialCloud,
} from './CloudMotifs';
import { DongSonDrumMandala } from './VietnameseDecorativeElements';
import { soundEngine } from '../utils/audioSynth';
import { Sparkles, ArrowDown } from 'lucide-react';

export interface CloudCurtainProps {
  /** Controlled visibility of the curtain */
  isOpen?: boolean;
  /** Callback fired once exit animation finishes and website is revealed */
  onRevealed?: () => void;
  /** Callback for closing / dismissing curtain */
  onClose?: () => void;
  /** Auto-flythrough timeout in seconds if no scroll interaction occurs (default: 2.8s) */
  autoFlyTimeout?: number;
}

/**
 * CloudCurtain Component powered by Framer Motion:
 * - Synchronized 'Imperial' Royal Gold gradient palette across all cloud elements and atmospheric veils.
 * - Multi-layer 3D depth parallax driven by mouse wheel scroll events:
 *   * Foreground clouds fly outward past the camera with 3D scale and motion depth blur
 *   * Midground clouds part laterally with 3D perspective rotation (rotateY, rotateX)
 *   * Background silk streamers drift into deep horizon
 *   * Central imperial emblem beams golden light rays as the website is revealed
 */
export const CloudCurtain: React.FC<CloudCurtainProps> = ({
  isOpen = true,
  onRevealed,
  onClose,
  autoFlyTimeout = 2.8,
}) => {
  // Framer Motion Value tracking depth traversal from 0.0 to 1.0
  const scrollProgress = useMotionValue(0);

  // Buttery-smooth spring physics for mouse wheel parallax
  const smoothProgress = useSpring(scrollProgress, {
    damping: 26,
    stiffness: 140,
    mass: 0.6,
  });

  // Numeric state for UI progress gauge
  const [depthPercent, setDepthPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(!isOpen);
  const isRevealedRef = useRef(isRevealed);
  isRevealedRef.current = isRevealed;

  // Touch tracking ref
  const touchStartY = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  // Sync motion value to percentage for UI display
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      setDepthPercent(Math.round(Math.min(100, Math.max(0, latest * 100))));
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Complete entrance callback
  const completeEntrance = useCallback(() => {
    if (isRevealedRef.current) return;
    setIsRevealed(true);
    try {
      soundEngine.playCloudPartChime();
    } catch {
      // Audio policy safe
    }
    setTimeout(() => {
      onRevealed?.();
      onClose?.();
    }, 650);
  }, [onRevealed, onClose]);

  // Framer Motion smooth auto-flythrough
  const triggerAutoFlythrough = useCallback(() => {
    if (isRevealedRef.current) return;
    const current = scrollProgress.get();
    animate(scrollProgress, 1, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        completeEntrance();
      },
    });
  }, [scrollProgress, completeEntrance]);

  // Mount & Auto-timer handling
  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    scrollProgress.set(0);

    // Auto-progress if user doesn't scroll within autoFlyTimeout seconds
    autoTimerRef.current = window.setTimeout(() => {
      triggerAutoFlythrough();
    }, autoFlyTimeout * 1000);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isOpen, autoFlyTimeout, scrollProgress, triggerAutoFlythrough]);

  // Parallax Scroll Wheel Event Listener
  useEffect(() => {
    if (isRevealed) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }

      const delta = e.deltaY;
      const current = scrollProgress.get();
      // Scroll down progresses into 3D depth, scroll up allows slight reverse
      const step = Math.sign(delta) * Math.min(Math.abs(delta) * 0.0018, 0.14);
      const next = Math.max(0, Math.min(1, current + step));
      scrollProgress.set(next);

      if (next >= 0.88) {
        completeEntrance();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }

      const step = diffY * 0.0032;
      const current = scrollProgress.get();
      const next = Math.max(0, Math.min(1, current + step));
      scrollProgress.set(next);

      if (next >= 0.88) {
        completeEntrance();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isRevealed, scrollProgress, completeEntrance]);

  // =========================================================================
  // FRAMER MOTION PARALLAX TRANSFORMS (DRIVEN BY MOUSE WHEEL SCROLL EVENT)
  // =========================================================================

  // 1. Base Shroud Opacity (Stays opaque for obscuration, fades out smoothly as clouds part)
  const veilOpacity = useTransform(smoothProgress, [0, 0.35, 0.95], [1, 0.95, 0]);

  // 2. Imperial God Rays & Aura
  const raysScale = useTransform(smoothProgress, [0, 1], [1, 3.2]);
  const raysRotate = useTransform(smoothProgress, [0, 1], [0, 50]);
  const raysOpacity = useTransform(smoothProgress, [0, 0.5, 0.9], [0, 0.85, 0]);

  // 3. Central Mandala Watermark
  const mandalaScale = useTransform(smoothProgress, [0, 1], [1, 1.4]);
  const mandalaRotate = useTransform(smoothProgress, [0, 1], [0, 40]);

  // 4. Central Imperial Seal & Title
  const sealScale = useTransform(smoothProgress, [0, 1], [1, 1.45]);
  const sealZ = useTransform(smoothProgress, [0, 1], [0, 380]);
  const sealY = useTransform(smoothProgress, [0, 1], [0, -70]);
  const sealOpacity = useTransform(smoothProgress, [0, 0.65, 0.9], [1, 0.8, 0]);
  const sealBlur = useTransform(smoothProgress, [0, 0.5, 1], ['blur(0px)', 'blur(3px)', 'blur(8px)']);

  // 5. FOREGROUND CLOUDS (PARALLAX LAYER 1 - RUSHING PAST VIEWER)
  // Scaling up to 2.4x and flying out past the screen corners with depth blur
  const foreScale = useTransform(smoothProgress, [0, 1], [1, 2.45]);
  const foreZ = useTransform(smoothProgress, [0, 1], [200, 900]);
  const foreOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.98, 0.55, 0]);
  const foreBlur = useTransform(smoothProgress, [0, 0.45, 1], ['blur(0px)', 'blur(3px)', 'blur(7px)']);

  // Corner trajectories for Foreground
  const foreTL_X = useTransform(smoothProgress, [0, 1], ['0%', '-160%']);
  const foreTL_Y = useTransform(smoothProgress, [0, 1], ['0%', '-120%']);
  const foreTL_Rot = useTransform(smoothProgress, [0, 1], [0, -24]);

  const foreTR_X = useTransform(smoothProgress, [0, 1], ['0%', '160%']);
  const foreTR_Y = useTransform(smoothProgress, [0, 1], ['0%', '-120%']);
  const foreTR_Rot = useTransform(smoothProgress, [0, 1], [0, 24]);

  const foreBL_X = useTransform(smoothProgress, [0, 1], ['0%', '-160%']);
  const foreBL_Y = useTransform(smoothProgress, [0, 1], ['0%', '120%']);
  const foreBL_Rot = useTransform(smoothProgress, [0, 1], [0, -28]);

  const foreBR_X = useTransform(smoothProgress, [0, 1], ['0%', '160%']);
  const foreBR_Y = useTransform(smoothProgress, [0, 1], ['0%', '120%']);
  const foreBR_Rot = useTransform(smoothProgress, [0, 1], [0, 28]);

  // 6. MIDGROUND CLOUDS (PARALLAX LAYER 2 - LATERAL PARTING & 3D TILT)
  const midScale = useTransform(smoothProgress, [0, 1], [1, 1.45]);
  const midZ = useTransform(smoothProgress, [0, 1], [0, 360]);
  const midOpacity = useTransform(smoothProgress, [0, 0.8, 1], [0.95, 0.65, 0]);

  const midTop_Y = useTransform(smoothProgress, [0, 1], ['0%', '-100%']);
  const midTop_RotX = useTransform(smoothProgress, [0, 1], [0, 28]);

  const midBottom_Y = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const midBottom_RotX = useTransform(smoothProgress, [0, 1], [0, -28]);

  const midLeft_X = useTransform(smoothProgress, [0, 1], ['0%', '-125%']);
  const midLeft_RotY = useTransform(smoothProgress, [0, 1], [0, -32]);

  const midRight_X = useTransform(smoothProgress, [0, 1], ['0%', '125%']);
  const midRight_RotY = useTransform(smoothProgress, [0, 1], [0, 32]);

  // 7. BACKGROUND CLOUDS (PARALLAX LAYER 3 - STREAMER WISPS)
  const backScaleX = useTransform(smoothProgress, [0, 1], [1, 1.65]);
  const backTop_Y = useTransform(smoothProgress, [0, 1], ['0%', '-60%']);
  const backBottom_Y = useTransform(smoothProgress, [0, 1], ['0%', '60%']);
  const backOpacity = useTransform(smoothProgress, [0, 0.85, 1], [0.9, 0.45, 0]);

  if (isRevealed && depthPercent >= 100) {
    return null;
  }

  const isInteractive = depthPercent < 88;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden select-none ${
        isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Màn Mây Hoàng Kim Chiều Sâu 3D Khai Mở Giao Diện"
    >
      {/* ========================================================================= */}
      {/* 1. LAYER 0: IMPERIAL GOLDEN SILK VEIL (COMPLETE OBSCURATION)             */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute inset-0 bg-[#060913] pointer-events-auto"
        style={{ opacity: veilOpacity }}
      >
        {/* Imperial Golden Gradient & Deep Velvet Silk Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-[#0E1629] to-[#04060E] opacity-98" />
        <div className="absolute inset-0 bg-radial from-amber-500/[0.22] via-yellow-600/[0.08] to-transparent" />

        {/* Central Divine Sunburst / Imperial God Rays piercing the veil */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '950px',
            height: '950px',
            scale: raysScale,
            rotate: raysRotate,
            opacity: raysOpacity,
            background:
              'radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(217,119,6,0.18) 35%, rgba(180,83,9,0.06) 55%, transparent 75%)',
          }}
        />

        {/* Traditional Dong Son Drum Mandala Watermark spinning in deep space */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-25 pointer-events-none"
          style={{
            scale: mandalaScale,
            rotate: mandalaRotate,
          }}
        >
          <DongSonDrumMandala className="w-full h-full" opacity={0.35} />
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. LAYER 1: FAST SKIP BUTTON (TOP RIGHT)                                 */}
      {/* ========================================================================= */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-2"
        >
          <button
            onClick={() => {
              scrollProgress.set(1);
              completeEntrance();
            }}
            className="px-4 py-2 rounded-full bg-slate-900/85 hover:bg-amber-950/85 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wider uppercase border border-amber-500/40 hover:border-amber-400 backdrop-blur-md shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Khai Mở Ngay</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. LAYER 2: 3D WORLD STAGE (PRESERVE-3D FRAMER MOTION PARALLAX)          */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 3: VIỄN CẢNH (BACKGROUND - DẢI LỤA MÂY VẮT NGANG)               */}
        {/* --------------------------------------------------------------------- */}
        <motion.div
          style={{
            y: backTop_Y,
            scaleX: backScaleX,
            opacity: backOpacity,
          }}
          className="absolute top-1/4 left-0 w-full flex justify-center pointer-events-none"
        >
          <StreamerWispsCloud className="w-[130vw] max-w-[1450px] h-auto drop-shadow-md" />
        </motion.div>

        <motion.div
          style={{
            y: backBottom_Y,
            scaleX: backScaleX,
            opacity: backOpacity,
          }}
          className="absolute bottom-1/4 left-0 w-full flex justify-center pointer-events-none"
        >
          <StreamerWispsCloud className="w-[130vw] max-w-[1450px] h-auto drop-shadow-md" flipX />
        </motion.div>

        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 2: TRUNG CẢNH (MIDGROUND - CÁC CỤM MÂY UỐN LƯỢN RẼ LỐI 3D)      */}
        {/* --------------------------------------------------------------------- */}

        {/* MIDGROUND TOP: Winged Pagoda Cloud */}
        <motion.div
          style={{
            y: midTop_Y,
            scale: midScale,
            z: midZ,
            rotateX: midTop_RotX,
            opacity: midOpacity,
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <WingedImperialCloud className="w-[360px] sm:w-[560px] md:w-[720px] h-auto" />
        </motion.div>

        {/* MIDGROUND BOTTOM: Ivory Ruyi Cloud (Synchronized Imperial Gold) */}
        <motion.div
          style={{
            y: midBottom_Y,
            scale: midScale,
            z: midZ,
            rotateX: midBottom_RotX,
            opacity: midOpacity,
          }}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <IvoryRuyiCloud className="w-[380px] sm:w-[600px] md:w-[760px] h-auto" />
        </motion.div>

        {/* MIDGROUND LEFT: Wave Scallop Cloud */}
        <motion.div
          style={{
            x: midLeft_X,
            scale: midScale,
            z: midZ,
            rotateY: midLeft_RotY,
            opacity: midOpacity,
          }}
          className="absolute top-1/3 -left-16 sm:-left-12 pointer-events-none"
        >
          <IndigoWaveCloud className="w-[320px] sm:w-[480px] md:w-[620px] h-auto" />
        </motion.div>

        {/* MIDGROUND RIGHT: Harmonized Flame Cloud */}
        <motion.div
          style={{
            x: midRight_X,
            scale: midScale,
            z: midZ,
            rotateY: midRight_RotY,
            opacity: midOpacity,
          }}
          className="absolute top-1/3 -right-16 sm:-right-12 pointer-events-none"
        >
          <CinnabarFireCloud className="w-[320px] sm:w-[480px] md:w-[620px] h-auto" flipX />
        </motion.div>

        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 1: CẬN CẢNH (FOREGROUND - 4 ĐÁM MÂY GẦN ỐNG KÍNH BAY VỤT QUA)   */}
        {/* HIỆU ỨNG CHIỀU SÂU PARALLAX ĐỈNH CAO: SCALE 2.45x & DEPTH BLUR       */}
        {/* --------------------------------------------------------------------- */}

        {/* FOREGROUND TOP-LEFT: Royal Golden Swirl Cloud */}
        <motion.div
          style={{
            x: foreTL_X,
            y: foreTL_Y,
            scale: foreScale,
            z: foreZ,
            rotate: foreTL_Rot,
            opacity: foreOpacity,
            filter: foreBlur,
          }}
          className="absolute -top-16 -left-20 sm:-top-24 sm:-left-16 pointer-events-none"
        >
          <RoyalGoldenSwirlCloud className="w-[380px] sm:w-[580px] md:w-[750px] h-auto" />
        </motion.div>

        {/* FOREGROUND TOP-RIGHT: Harmonized Flame Swirl */}
        <motion.div
          style={{
            x: foreTR_X,
            y: foreTR_Y,
            scale: foreScale,
            z: foreZ,
            rotate: foreTR_Rot,
            opacity: foreOpacity,
            filter: foreBlur,
          }}
          className="absolute -top-16 -right-20 sm:-top-24 sm:-right-16 pointer-events-none"
        >
          <CinnabarFireCloud className="w-[380px] sm:w-[580px] md:w-[750px] h-auto" flipX />
        </motion.div>

        {/* FOREGROUND BOTTOM-LEFT: Royal Scallop Wave */}
        <motion.div
          style={{
            x: foreBL_X,
            y: foreBL_Y,
            scale: foreScale,
            z: foreZ,
            rotate: foreBL_Rot,
            opacity: foreOpacity,
            filter: foreBlur,
          }}
          className="absolute -bottom-20 -left-20 sm:-bottom-28 sm:-left-16 pointer-events-none"
        >
          <IndigoWaveCloud className="w-[390px] sm:w-[600px] md:w-[780px] h-auto" />
        </motion.div>

        {/* FOREGROUND BOTTOM-RIGHT: Royal Golden Swirl */}
        <motion.div
          style={{
            x: foreBR_X,
            y: foreBR_Y,
            scale: foreScale,
            z: foreZ,
            rotate: foreBR_Rot,
            opacity: foreOpacity,
            filter: foreBlur,
          }}
          className="absolute -bottom-20 -right-20 sm:-bottom-28 sm:-right-16 pointer-events-none"
        >
          <RoyalGoldenSwirlCloud className="w-[390px] sm:w-[600px] md:w-[780px] h-auto" flipX />
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LAYER 3: CENTER IMPERIAL EMBLEM & PORTAL (ZOOMS FORWARD ALONG Z)       */}
      {/* ========================================================================= */}
      <motion.div
        style={{
          y: sealY,
          scale: sealScale,
          z: sealZ,
          opacity: sealOpacity,
          filter: sealBlur,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center flex flex-col items-center justify-center max-w-lg px-6 pointer-events-none"
      >
        {/* Imperial Seal Golden Mandala Badge */}
        <div className="relative mb-3 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/90 p-1.5 bg-[#090F1B]/90 backdrop-blur-md shadow-[0_0_35px_rgba(212,175,55,0.45)] flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-amber-500/40 flex items-center justify-center bg-gradient-to-b from-amber-500/25 to-transparent">
              <DongSonDrumMandala className="w-14 h-14" opacity={0.9} />
            </div>
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-amber-400 text-slate-950 uppercase shadow-md whitespace-nowrap">
            Đại Việt
          </span>
        </div>

        {/* Poetic Sub-title & Main Title */}
        <div className="space-y-1.5 mb-3">
          <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-amber-400/90 font-serif-vi">
            Khám Phá Di Sản Nghìn Năm
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-md">
            Việt Phục Hoàng Triều
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 max-w-sm mx-auto font-sans-vi leading-relaxed">
            Hòa quyện tinh hoa cổ phong và công nghệ thị giác đa chiều
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. LAYER 4: INTERACTIVE MOUSE WHEEL PARALLAX GUIDE & DEPTH GAUGE          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInteractive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            onClick={triggerAutoFlythrough}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 cursor-pointer group"
          >
            {/* Interactive Depth Gauge Pill */}
            <div className="px-5 py-2.5 rounded-full bg-slate-950/85 hover:bg-slate-900/95 backdrop-blur-md border border-amber-400/40 group-hover:border-amber-400 shadow-[0_0_25px_rgba(217,119,6,0.3)] transition-all flex items-center gap-3">
              {/* Animated Mouse Icon with moving scroll wheel */}
              <div className="relative w-5 h-7 rounded-full border-2 border-amber-300 flex justify-center pt-1 shadow-inner">
                <motion.div
                  animate={{
                    y: [0, 6, 0],
                    opacity: [1, 0.4, 1],
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1 h-2 rounded-full bg-amber-400"
                />
              </div>

              {/* Status Message */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-semibold text-amber-200 group-hover:text-amber-100 flex items-center gap-1.5">
                  <span>Cuộn con lăn chuột để bay qua làn mây</span>
                  <ArrowDown className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-amber-400/70">
                  Hiệu ứng Parallax 3D · Hoặc chạm để mở tự động
                </span>
              </div>

              {/* Circular Depth Progress */}
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90">
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    className="stroke-amber-950/60"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    className="stroke-amber-400"
                    strokeWidth="2.5"
                    strokeDasharray={69.1}
                    strokeDashoffset={69.1 * (1 - depthPercent / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[8px] font-bold text-amber-300">
                  {depthPercent}%
                </span>
              </div>
            </div>

            {/* Depth Progress Bar */}
            <div className="w-48 h-1 rounded-full bg-amber-950/60 overflow-hidden border border-amber-500/20">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-75"
                style={{ width: `${depthPercent}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CloudCurtain;
