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
import { DongSonDrumMandala } from './DongSonDrumMandala';
import { soundEngine } from '../utils/audioSynth';
import { Sparkles, ArrowDown, ChevronDown, Hand } from 'lucide-react';

export interface CloudCurtainProps {
  /** Controlled visibility of the curtain */
  isOpen?: boolean;
  /** Callback fired once exit animation finishes and website is revealed */
  onRevealed?: () => void;
  /** Callback for closing / dismissing curtain */
  onClose?: () => void;
  /**
   * If true, will auto-flythrough after timeout.
   * Default: false (theo yêu cầu người dùng: "khi vào đầu đám mây không tự mở ra mà mình phải cuộn chuột thì đám mây mới mở ra")
   */
  autoPart?: boolean;
  /** Auto-flythrough timeout in seconds if autoPart is enabled */
  autoFlyTimeout?: number;
}

/**
 * CloudCurtain Component (Màn Mây Chiều Sâu Hoàng Triều):
 * 1. KHÔNG TỰ ĐỘNG MỞ KHI VÀO: Phải cuộn chuột hoặc vuốt chạm để vén mở làn mây.
 * 2. MÂY DI CHUYỂN BỒNG BỀNH (LIVELY AMBIENT DRIFT & BREATHING MOTION):
 *    - Khi chưa cuộn hoặc cuộn dở, các cụm mây vẫn liên tục dập dờn, thở nhẹ, trôi nổi hữu cơ
 *    - Các dải lụa mây trôi ngang nhẹ nhàng như sương sớm chốn bồng lai
 * 3. TRỐNG ĐỒNG ĐÔNG SƠN NÂNG CẤP XỊN HƠN:
 *    - Mặt trời 14 cánh tỏa hào quang kim sắc lung linh (breathing solar pulse)
 *    - Đàn chim Lạc sải cánh bay ngược chiều kim đồng hồ sống động
 *    - Vòng vũ nhân múa lễ hội, vòng răng cưa và tang cước xoay đa chiều
 *    - Hiệu ứng phát quang hoàng kim rực rỡ
 * 4. MÀU SẮC ĐỒNG BỘ: Chuẩn hệ hoàng kim hoàng triều Đại Việt.
 */
export const CloudCurtain: React.FC<CloudCurtainProps> = ({
  isOpen = true,
  onRevealed,
  onClose,
  autoPart = false,
  autoFlyTimeout = 999999,
}) => {
  // Framer Motion Value tracking depth traversal from 0.0 to 1.0
  const scrollProgress = useMotionValue(0);

  // Buttery-smooth spring physics for mouse wheel parallax
  const smoothProgress = useSpring(scrollProgress, {
    damping: 24,
    stiffness: 130,
    mass: 0.65,
  });

  // Numeric state for UI progress gauge
  const [depthPercent, setDepthPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(!isOpen);
  const isRevealedRef = useRef(isRevealed);
  isRevealedRef.current = isRevealed;

  // Touch tracking ref
  const touchStartY = useRef<number | null>(null);
  const hasInteractedRef = useRef<boolean>(false);

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
      // Audio safe
    }
    setTimeout(() => {
      onRevealed?.();
      onClose?.();
    }, 650);
  }, [onRevealed, onClose]);

  // Smooth flythrough triggered via Click / Button
  const triggerOpenAnimation = useCallback(() => {
    if (isRevealedRef.current) return;
    hasInteractedRef.current = true;
    animate(scrollProgress, 1, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        completeEntrance();
      },
    });
  }, [scrollProgress, completeEntrance]);

  // Mount handling (Do NOT auto-open by default)
  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(true);
      return;
    }

    setIsRevealed(false);
    scrollProgress.set(0);

    // Optional timer if caller explicitly enabled autoPart
    let timerId: number | null = null;
    if (autoPart && autoFlyTimeout < 9999) {
      timerId = window.setTimeout(() => {
        if (!hasInteractedRef.current) {
          triggerOpenAnimation();
        }
      }, autoFlyTimeout * 1000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isOpen, autoPart, autoFlyTimeout, scrollProgress, triggerOpenAnimation]);

  // Parallax Scroll Wheel Event Listener
  useEffect(() => {
    if (isRevealed) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      hasInteractedRef.current = true;

      const delta = e.deltaY;
      const current = scrollProgress.get();
      // Scroll down progresses into 3D depth, scroll up allows slight reverse
      const step = Math.sign(delta) * Math.min(Math.abs(delta) * 0.0016, 0.12);
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
      hasInteractedRef.current = true;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      const step = diffY * 0.0035;
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

  // 1. Base Shroud Opacity (Stays completely opaque at start to fully hide the website)
  const veilOpacity = useTransform(smoothProgress, [0, 0.4, 0.95], [1, 0.96, 0]);

  // 2. Imperial God Rays & Aura
  const raysScale = useTransform(smoothProgress, [0, 1], [1, 3.4]);
  const raysRotate = useTransform(smoothProgress, [0, 1], [0, 60]);
  const raysOpacity = useTransform(smoothProgress, [0, 0.5, 0.9], [0.35, 0.95, 0]);

  // 3. Central Trống Đồng Mandala Transforms
  const drumScale = useTransform(smoothProgress, [0, 1], [1, 1.55]);
  const drumZ = useTransform(smoothProgress, [0, 1], [0, 320]);
  const drumRotate = useTransform(smoothProgress, [0, 1], [0, 45]);
  const drumOpacity = useTransform(smoothProgress, [0, 0.7, 0.95], [0.85, 0.95, 0]);

  // 4. Central Imperial Title & Crest
  const sealScale = useTransform(smoothProgress, [0, 1], [1, 1.45]);
  const sealZ = useTransform(smoothProgress, [0, 1], [0, 420]);
  const sealY = useTransform(smoothProgress, [0, 1], [0, -80]);
  const sealOpacity = useTransform(smoothProgress, [0, 0.65, 0.9], [1, 0.8, 0]);
  const sealBlur = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    ['blur(0px)', 'blur(3px)', 'blur(8px)']
  );

  // 5. FOREGROUND CLOUDS (PARALLAX LAYER 1 - RUSHING PAST VIEWER)
  const foreScale = useTransform(smoothProgress, [0, 1], [1, 2.5]);
  const foreZ = useTransform(smoothProgress, [0, 1], [220, 950]);
  const foreOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.98, 0.55, 0]);
  const foreBlur = useTransform(
    smoothProgress,
    [0, 0.45, 1],
    ['blur(0px)', 'blur(3px)', 'blur(7px)']
  );

  // Corner trajectories for Foreground
  const foreTL_X = useTransform(smoothProgress, [0, 1], ['0%', '-165%']);
  const foreTL_Y = useTransform(smoothProgress, [0, 1], ['0%', '-125%']);
  const foreTL_Rot = useTransform(smoothProgress, [0, 1], [0, -25]);

  const foreTR_X = useTransform(smoothProgress, [0, 1], ['0%', '165%']);
  const foreTR_Y = useTransform(smoothProgress, [0, 1], ['0%', '-125%']);
  const foreTR_Rot = useTransform(smoothProgress, [0, 1], [0, 25]);

  const foreBL_X = useTransform(smoothProgress, [0, 1], ['0%', '-165%']);
  const foreBL_Y = useTransform(smoothProgress, [0, 1], ['0%', '125%']);
  const foreBL_Rot = useTransform(smoothProgress, [0, 1], [0, -30]);

  const foreBR_X = useTransform(smoothProgress, [0, 1], ['0%', '165%']);
  const foreBR_Y = useTransform(smoothProgress, [0, 1], ['0%', '125%']);
  const foreBR_Rot = useTransform(smoothProgress, [0, 1], [0, 30]);

  // 6. MIDGROUND CLOUDS (PARALLAX LAYER 2 - LATERAL PARTING & 3D TILT)
  const midScale = useTransform(smoothProgress, [0, 1], [1, 1.45]);
  const midZ = useTransform(smoothProgress, [0, 1], [0, 380]);
  const midOpacity = useTransform(smoothProgress, [0, 0.8, 1], [0.95, 0.65, 0]);

  const midTop_Y = useTransform(smoothProgress, [0, 1], ['0%', '-105%']);
  const midTop_RotX = useTransform(smoothProgress, [0, 1], [0, 30]);

  const midBottom_Y = useTransform(smoothProgress, [0, 1], ['0%', '105%']);
  const midBottom_RotX = useTransform(smoothProgress, [0, 1], [0, -30]);

  const midLeft_X = useTransform(smoothProgress, [0, 1], ['0%', '-130%']);
  const midLeft_RotY = useTransform(smoothProgress, [0, 1], [0, -32]);

  const midRight_X = useTransform(smoothProgress, [0, 1], ['0%', '130%']);
  const midRight_RotY = useTransform(smoothProgress, [0, 1], [0, 32]);

  // 7. BACKGROUND CLOUDS (PARALLAX LAYER 3 - STREAMER WISPS)
  const backScaleX = useTransform(smoothProgress, [0, 1], [1, 1.7]);
  const backTop_Y = useTransform(smoothProgress, [0, 1], ['0%', '-65%']);
  const backBottom_Y = useTransform(smoothProgress, [0, 1], ['0%', '65%']);
  const backOpacity = useTransform(smoothProgress, [0, 0.85, 1], [0.92, 0.45, 0]);

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
        {/* Deep Imperial Silk Gradient (Kín đặc, che phủ toàn bộ website khi mới vào) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060D] via-[#0A1021] to-[#03050B] opacity-100" />
        <div className="absolute inset-0 bg-radial from-amber-500/[0.25] via-yellow-600/[0.08] to-transparent" />

        {/* Floating atmospheric gold dust particles behind clouds */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

        {/* Central Divine Sunburst / Imperial God Rays */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '1050px',
            height: '1050px',
            scale: raysScale,
            rotate: raysRotate,
            opacity: raysOpacity,
            background:
              'radial-gradient(circle, rgba(251,191,36,0.42) 0%, rgba(217,119,6,0.22) 32%, rgba(180,83,9,0.08) 55%, transparent 75%)',
          }}
        />

        {/* =================================================================== */}
        {/* TRỐNG ĐỒNG ĐÔNG SƠN NÂNG CẤP XỊN HƠN (CHI TIẾT CAO CẤP & ANIMATION) */}
        {/* =================================================================== */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] sm:w-[860px] sm:h-[860px] md:w-[980px] md:h-[980px] pointer-events-none flex items-center justify-center"
          style={{
            scale: drumScale,
            z: drumZ,
            rotate: drumRotate,
            opacity: drumOpacity,
          }}
        >
          {/* Animated high-fidelity Dong Son Bronze Drum */}
          <DongSonDrumMandala
            className="w-full h-full drop-shadow-[0_0_50px_rgba(217,119,6,0.45)]"
            opacity={0.88}
            animated={true}
            glow={true}
            speed={0.8}
          />
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. LAYER 1: FAST SKIP & CLOSE BUTTON (TOP RIGHT)                          */}
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
            title="Khai mở ngay lập tức"
          >
            <span>Khai Mở Nhanh</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. LAYER 2: 3D WORLD STAGE (PRESERVE-3D FRAMER MOTION PARALLAX)          */}
      {/*    TẤT CẢ CÁC ĐÁM MÂY ĐỀU CÓ HIỆU ỨNG DI CHUYỂN BỒNG BỀNH TỰ NHIÊN        */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 3: VIỄN CẢNH (BACKGROUND - DẢI LỤA MÂY VẮT NGANG ĐANG TRÔI CHẬM) */}
        {/* --------------------------------------------------------------------- */}
        <motion.div
          style={{
            y: backTop_Y,
            scaleX: backScaleX,
            opacity: backOpacity,
          }}
          className="absolute top-[18%] left-0 w-full flex justify-center pointer-events-none"
        >
          {/* Ambient organic drift motion */}
          <motion.div
            animate={{
              x: [-24, 24, -24],
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full flex justify-center"
          >
            <StreamerWispsCloud className="w-[140vw] max-w-[1550px] h-auto drop-shadow-md" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{
            y: backBottom_Y,
            scaleX: backScaleX,
            opacity: backOpacity,
          }}
          className="absolute bottom-[18%] left-0 w-full flex justify-center pointer-events-none"
        >
          <motion.div
            animate={{
              x: [24, -24, 24],
              y: [6, -6, 6],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full flex justify-center"
          >
            <StreamerWispsCloud className="w-[140vw] max-w-[1550px] h-auto drop-shadow-md" flipX />
          </motion.div>
        </motion.div>

        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 2: TRUNG CẢNH (MIDGROUND - CÁC CỤM MÂY UỐN LƯỢN RẼ LỐI 3D)      */}
        {/* --------------------------------------------------------------------- */}

        {/* MIDGROUND TOP: Winged Imperial Cloud with gentle breathing */}
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
          <motion.div
            animate={{
              y: [-8, 8, -8],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <WingedImperialCloud className="w-[420px] sm:w-[620px] md:w-[820px] h-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]" />
          </motion.div>
        </motion.div>

        {/* MIDGROUND BOTTOM: Ivory Ruyi Cloud */}
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
          <motion.div
            animate={{
              y: [8, -8, 8],
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <IvoryRuyiCloud className="w-[440px] sm:w-[660px] md:w-[860px] h-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]" />
          </motion.div>
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
          <motion.div
            animate={{
              x: [-10, 10, -10],
              y: [-6, 6, -6],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <IndigoWaveCloud className="w-[360px] sm:w-[520px] md:w-[680px] h-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]" />
          </motion.div>
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
          <motion.div
            animate={{
              x: [10, -10, 10],
              y: [6, -6, 6],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <CinnabarFireCloud
              className="w-[360px] sm:w-[520px] md:w-[680px] h-auto drop-shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
              flipX
            />
          </motion.div>
        </motion.div>

        {/* --------------------------------------------------------------------- */}
        {/* TẦNG 1: CẬN CẢNH (FOREGROUND - 4 ĐÁM MÂY GẦN ỐNG KÍNH BAY VỤT QUA)   */}
        {/* KHÚC ĐẦU CÓ HIỆU ỨNG DẬP DỜN TỰ NHIÊN, KHI CUỘN THÌ BAY VỤT CHIỀU SÂU */}
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
          <motion.div
            animate={{
              x: [-12, 12, -12],
              y: [-10, 10, -10],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <RoyalGoldenSwirlCloud className="w-[420px] sm:w-[640px] md:w-[820px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]" />
          </motion.div>
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
          <motion.div
            animate={{
              x: [12, -12, 12],
              y: [-10, 10, -10],
              rotate: [1.5, -1.5, 1.5],
            }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <CinnabarFireCloud
              className="w-[420px] sm:w-[640px] md:w-[820px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              flipX
            />
          </motion.div>
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
          <motion.div
            animate={{
              x: [-14, 14, -14],
              y: [10, -10, 10],
              rotate: [1.5, -1.5, 1.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <IndigoWaveCloud className="w-[430px] sm:w-[660px] md:w-[850px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]" />
          </motion.div>
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
          <motion.div
            animate={{
              x: [14, -14, 14],
              y: [10, -10, 10],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <RoyalGoldenSwirlCloud
              className="w-[430px] sm:w-[660px] md:w-[850px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              flipX
            />
          </motion.div>
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
        {/* Imperial Seal Golden Drum Emblem Badge */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 35px rgba(212,175,55,0.4)',
              '0 0 55px rgba(212,175,55,0.7)',
              '0 0 35px rgba(212,175,55,0.4)',
            ],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mb-3.5 group rounded-full"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-400 p-2 bg-[#090F1B]/95 backdrop-blur-md flex items-center justify-center shadow-xl">
            <div className="w-full h-full rounded-full border border-amber-500/50 flex items-center justify-center bg-gradient-to-b from-amber-500/30 to-amber-950/20">
              <DongSonDrumMandala className="w-16 h-16 sm:w-18 sm:h-18" opacity={0.95} animated={true} speed={1.2} />
            </div>
          </div>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-widest bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 uppercase shadow-md whitespace-nowrap font-serif-vi">
            Đại Việt Di Sản
          </span>
        </motion.div>

        {/* Poetic Sub-title & Main Title */}
        <div className="space-y-1.5 mb-2">
          <p className="text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-amber-300/90 font-serif-vi">
            Khai Mở Cánh Cổng Triều Đại
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Việt Phục Hoàng Triều
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/85 max-w-sm mx-auto font-sans-vi leading-relaxed">
            Màn mây đang che kín cổng di sản · Hãy cuộn chuột để bước vào
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. LAYER 4: INTERACTIVE MOUSE WHEEL PARALLAX GUIDE & DEPTH GAUGE          */}
      {/*    ĐƯỢC THIẾT KẾ RÕ RÀNG NHẮC NGƯỜI DÙNG CUỘN CHUỘT ĐỂ MỞ MÂY             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInteractive && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5"
          >
            {/* Interactive Depth Gauge Pill */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={triggerOpenAnimation}
              className="px-5 sm:px-6 py-3 rounded-full bg-slate-950/90 hover:bg-slate-900/95 backdrop-blur-lg border border-amber-400/50 hover:border-amber-400 shadow-[0_0_35px_rgba(217,119,6,0.4)] transition-all flex items-center gap-3.5 cursor-pointer group select-none"
            >
              {/* Animated Mouse Icon with active bouncing wheel */}
              <div className="relative w-6 h-8 rounded-full border-2 border-amber-300 flex justify-center pt-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                <motion.div
                  animate={{
                    y: [0, 8, 0],
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]"
                />
              </div>

              {/* Status Message */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100 flex items-center gap-1.5">
                  <span>Cuộn con lăn chuột để vén mở làn mây</span>
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-4 h-4 text-amber-400" />
                  </motion.span>
                </span>
                <span className="text-[11px] text-amber-400/80 flex items-center gap-1">
                  <span>Mây đang trôi bồng bềnh · Cuộn xuống để bay xuyên qua (hoặc bấm vào đây)</span>
                </span>
              </div>

              {/* Circular Depth Progress Ring */}
              <div className="relative w-8 h-8 flex items-center justify-center ml-1">
                <svg className="w-8 h-8 -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-amber-950/70"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-amber-400"
                    strokeWidth="3"
                    strokeDasharray={81.68}
                    strokeDashoffset={81.68 * (1 - depthPercent / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[9px] font-bold text-amber-300">
                  {depthPercent}%
                </span>
              </div>
            </motion.div>

            {/* Depth Progress Bar */}
            <div className="w-56 h-1.5 rounded-full bg-amber-950/70 overflow-hidden border border-amber-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-75 shadow-[0_0_10px_#F59E0B]"
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
