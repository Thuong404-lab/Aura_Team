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

  // Snappy, silky-smooth spring physics for mouse wheel parallax (zero lag)
  const smoothProgress = useSpring(scrollProgress, {
    damping: 28,
    stiffness: 200,
    mass: 0.35,
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
    scrollProgress.set(1);
    try {
      soundEngine.playCloudPartChime();
    } catch {
      // Audio safe
    }
    setTimeout(() => {
      onRevealed?.();
      onClose?.();
    }, 450);
  }, [onRevealed, onClose, scrollProgress]);

  const [isParting, setIsParting] = useState(false);

  // Smooth cinematic cloud dissolve animation (chạm / bấm vào màn hình để mây từ từ tan đi)
  const triggerOpenAnimation = useCallback(() => {
    if (isRevealedRef.current || isParting) return;
    setIsParting(true);
    hasInteractedRef.current = true;
    try {
      soundEngine.playCloudPartChime();
    } catch {
      // Audio safe
    }
    // Mây từ từ tan biến trong 2.0 giây với chuyển động cung đình êm ái
    animate(scrollProgress, 1, {
      duration: 2.0,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        completeEntrance();
      },
    });
  }, [scrollProgress, completeEntrance, isParting]);

  // Mount handling (Do NOT auto-open by default)
  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(true);
      setIsParting(false);
      return;
    }

    setIsRevealed(false);
    setIsParting(false);
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

  // 5. FOREGROUND CLOUDS (PARALLAX LAYER 1 - RUSHING PAST VIEWER)
  const foreScale = useTransform(smoothProgress, [0, 1], [1, 2.5]);
  const foreZ = useTransform(smoothProgress, [0, 1], [220, 950]);
  const foreOpacity = useTransform(smoothProgress, [0, 0.7, 1], [0.98, 0.55, 0]);

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

  // If not open or already revealed, do NOT render anything
  if (!isOpen || isRevealed) {
    return null;
  }

  const isInteractive = isOpen && !isRevealed && depthPercent < 85;

  return (
    <div
      onClick={(e) => {
        // Clicking backdrop directly or on elements outside specific buttons opens curtain smoothly
        const target = e.target as HTMLElement;
        if (!target.closest('button')) {
          triggerOpenAnimation();
        }
      }}
      className={`fixed inset-0 z-[200] overflow-hidden select-none ${
        isInteractive ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
      }`}
      style={{
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Màn Mây Hoàng Kim Chiều Sâu 3D Khai Mở Giao Diện"
    >
      {/* ========================================================================= */}
      {/* 1. LAYER 0: IMPERIAL GOLDEN SILK VEIL (COMPLETE OBSCURATION)             */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute inset-0 bg-[#060913] pointer-events-none"
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
            className="w-full h-full drop-shadow-[0_0_40px_rgba(245,158,11,0.35)]"
            opacity={0.85}
            animated={true}
            glow={true}
            speed={0.6}
            crisp={true}
          />
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. LAYER 1: FAST SKIP & CLOSE BUTTON (BELOW TOP NAVBAR)                   */}
      {/* ========================================================================= */}
      {isInteractive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-20 right-5 sm:top-24 sm:right-8 z-50 flex items-center gap-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollProgress.set(1);
              completeEntrance();
            }}
            className="px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-amber-950/90 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wider uppercase border border-amber-500/50 hover:border-amber-400 backdrop-blur-md shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center flex flex-col items-center justify-center max-w-xl px-4 pointer-events-none"
      >
        {/* Imperial Seal Golden Drum Emblem Badge (Trống Đồng Đông Sơn Siêu Chi Tiết & Sắc Nét) */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative mb-6 group rounded-full flex flex-col items-center"
        >
          {/* Luminous Ambient Golden Bloom */}
          <div className="absolute inset-0 rounded-full bg-radial from-amber-400/40 via-yellow-600/15 to-transparent blur-2xl pointer-events-none" />

          {/* Majestic Royal Gold Medallion Outer Bezel */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full border-[3.5px] border-amber-300 p-2 sm:p-2.5 bg-[#080D1A]/95 shadow-[0_0_45px_rgba(245,158,11,0.5),0_20px_45px_rgba(0,0,0,0.85)] flex items-center justify-center">
            {/* Concentric Engraved Ring with Inner Gold Border */}
            <div className="w-full h-full rounded-full border-2 border-amber-400/70 p-1 flex items-center justify-center bg-radial from-amber-950/40 via-[#0B1120] to-[#040710] overflow-hidden shadow-inner">
              <DongSonDrumMandala
                className="w-full h-full drop-shadow-[0_0_24px_rgba(245,158,11,0.45)]"
                opacity={1}
                animated={true}
                speed={0.85}
                glow={false}
                crisp={true}
              />
            </div>
          </div>

          {/* Royal Plaque Banner: ĐẠI VIỆT DI SẢN */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold tracking-[0.24em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 uppercase shadow-[0_6px_22px_rgba(0,0,0,0.8)] border border-yellow-100/90 whitespace-nowrap font-serif-vi flex items-center gap-2 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
            <span>ĐẠI VIỆT DI SẢN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
          </div>
        </motion.div>

        {/* Poetic Sub-title & Main Title */}
        <div className="space-y-2 mb-2">
          <p className="text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-amber-300/90 font-serif-vi">
            Khai Mở Cánh Cổng Triều Đại
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Việt Phục Hoàng Triều
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/85 max-w-sm mx-auto font-sans-vi leading-relaxed">
            Màn mây đang che kín cổng di sản · Chạm hoặc bấm bất kỳ đâu để khai mở
          </p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. LAYER 4: INTERACTIVE CLICK/TAP TO DISSOLVE GUIDE PILL                  */}
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
            {/* Interactive Click / Tap Anywhere Pill */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={triggerOpenAnimation}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-slate-950/90 hover:bg-slate-900/95 backdrop-blur-lg border border-amber-400/60 hover:border-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all flex items-center gap-4 cursor-pointer group select-none"
            >
              {/* Luminous Pulsing Touch / Sparkle Emblem */}
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>

              {/* Status Message */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100 flex items-center gap-2 font-serif-vi tracking-wide">
                  <span>Chạm hoặc bấm vào màn hình để khai mở</span>
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ✦
                  </motion.span>
                </span>
                <span className="text-[11px] text-amber-300/80">
                  Làn mây cổ phong sẽ từ từ tan biến và mở ra Cung điện Việt phục
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CloudCurtain;
