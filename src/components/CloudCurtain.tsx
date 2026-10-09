import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Sparkles, Eye } from 'lucide-react';

export interface CloudCurtainProps {
  /** Controlled visibility of the curtain */
  isOpen?: boolean;
  /** Callback fired once exit animation finishes and website is revealed */
  onRevealed?: () => void;
  /** Callback for closing / dismissing curtain */
  onClose?: () => void;
  /** Delay in seconds before the exit sequence automatically begins (default: 1.2s) */
  initialHoldDelay?: number;
}

/**
 * Full-screen 'Cloud Curtain' animation using Framer Motion.
 * Initially renders a set of overlapping, semi-transparent cloud elements
 * that completely obscure the view, then sequences an exit animation that
 * drifts them off-screen to reveal the underlying website content when the component mounts.
 */
export const CloudCurtain: React.FC<CloudCurtainProps> = ({
  isOpen = true,
  onRevealed,
  onClose,
  initialHoldDelay = 1.2,
}) => {
  // Animation phase:
  // 'obscuring': clouds in place, completely obscuring the view
  // 'drifting': sequenced exit animation drifting clouds off-screen
  // 'revealed': completely exited, underlying website fully visible
  const [phase, setPhase] = useState<'obscuring' | 'drifting' | 'revealed'>(
    isOpen ? 'obscuring' : 'revealed'
  );

  useEffect(() => {
    if (!isOpen) {
      setPhase('revealed');
      return;
    }

    setPhase('obscuring');

    // Sequence the exit animation after the initial obscuring hold
    const holdTimer = setTimeout(() => {
      startDrifting();
    }, initialHoldDelay * 1000);

    return () => clearTimeout(holdTimer);
  }, [isOpen, initialHoldDelay]);

  const startDrifting = () => {
    setPhase((current) => {
      if (current === 'revealed' || current === 'drifting') return current;
      // Play the celestial chime as clouds part
      try {
        soundEngine.playCloudPartChime();
      } catch {
        // Audio policy fallback
      }

      // After drift animation finishes (~1.8s), mark as fully revealed
      setTimeout(() => {
        setPhase('revealed');
        onRevealed?.();
        onClose?.();
      }, 1900);

      return 'drifting';
    });
  };

  if (phase === 'revealed') {
    return null;
  }

  const isDrifting = phase === 'drifting';

  // Silk-like fluid spring-eased transition for clouds drifting off-screen
  const silkEase = [0.16, 1, 0.3, 1] as const;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Màn Mây Cổ Phong Khai Mở Giao Diện"
    >
      {/* 1. LAYER 0: BASE OBSCATION VEIL (Ensures 100% opacity coverage over entire viewport) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isDrifting ? 0 : 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
        className="absolute inset-0 bg-[#070B14] pointer-events-auto"
      >
        {/* Soft imperial silk mist gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A14] via-[#0D1527] to-[#04060C] opacity-95" />
        <div className="absolute inset-0 bg-radial from-amber-500/[0.14] via-transparent to-transparent" />

        {/* Traditional rotating mandala watermark in background mist */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-15 pointer-events-none"
        >
          <DongSonDrumMandala className="w-full h-full" opacity={0.3} />
        </motion.div>
      </motion.div>

      {/* 2. LAYER 1: FAST SKIP / INSTANT OPEN BUTTON */}
      {!isDrifting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-3"
        >
          <button
            onClick={startDrifting}
            className="group px-4 py-2 rounded-full bg-slate-900/85 hover:bg-amber-950/80 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wider uppercase border border-amber-500/40 hover:border-amber-400 backdrop-blur-md shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Khai Mở Ngay</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* 3. LAYER 2: CENTER IMPERIAL EMBLEM & INVITATION (Scales up & dissolves when drifting) */}
      <AnimatePresence>
        {!isDrifting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 1.15,
              filter: 'blur(8px)',
              transition: { duration: 0.65 },
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={startDrifting}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center flex flex-col items-center justify-center max-w-lg px-6 cursor-pointer"
          >
            {/* Imperial Seal Golden Mandala Badge */}
            <div className="relative mb-4 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/80 p-1.5 bg-[#0F172A]/90 backdrop-blur-md shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full border border-amber-500/40 flex items-center justify-center bg-gradient-to-b from-amber-500/25 to-transparent">
                  <DongSonDrumMandala className="w-14 h-14" opacity={0.85} />
                </div>
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-amber-400 text-slate-950 uppercase shadow-md">
                Đại Việt
              </span>
            </div>

            {/* Poetic Sub-title & Main Title */}
            <div className="space-y-2 mb-5">
              <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-amber-400/90 font-serif-vi">
                Khám Phá Di Sản Nghìn Năm
              </p>
              <h1 className="text-3xl sm:text-5xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-md">
                Việt Phục Hoàng Triều
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/80 max-w-sm mx-auto font-sans-vi leading-relaxed">
                Tái hiện tinh hoa y phục truyền thống Việt Nam qua các triều đại lịch sử
              </p>
            </div>

            {/* Glowing Touch to Open Indicator */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-amber-200 text-xs sm:text-sm font-semibold tracking-wide hover:scale-105 transition-all">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              <span>Chạm hoặc đợi để vén mây khai mở</span>
              <Eye className="w-4 h-4 text-amber-300 ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. OVERLAPPING, SEMI-TRANSPARENT CLOUD ELEMENTS (COMPLETELY OBSCURE VIEW) */}
      {/* ========================================================================= */}

      {/* --- CLOUD 1: TOP-LEFT MASSIVE GOLDEN SWIRL (Drifts Up & Left Northwest) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? {
                x: '-135%',
                y: '-65%',
                rotate: -20,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.7, ease: silkEase }}
        className="absolute -top-16 -left-20 sm:-top-20 sm:-left-16 z-30 pointer-events-none"
      >
        <RoyalGoldenSwirlCloud className="w-[360px] sm:w-[560px] md:w-[700px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" />
      </motion.div>

      {/* --- CLOUD 2: TOP-LEFT SECONDARY IVORY RUYI (Drifts West Northwest) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.9 }}
        animate={
          isDrifting
            ? {
                x: '-145%',
                y: '-25%',
                rotate: -14,
                scale: 1.2,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.9 }
        }
        transition={{ duration: 1.75, ease: silkEase, delay: 0.04 }}
        className="absolute top-1/4 -left-24 sm:-left-16 z-25 pointer-events-none"
      >
        <IvoryRuyiCloud className="w-[320px] sm:w-[480px] md:w-[600px] h-auto drop-shadow-xl" />
      </motion.div>

      {/* --- CLOUD 3: TOP-RIGHT CINNABAR FIRE CLOUD (Drifts Up & Right Northeast) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? {
                x: '135%',
                y: '-70%',
                rotate: 22,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.7, ease: silkEase }}
        className="absolute -top-16 -right-20 sm:-top-24 sm:-right-16 z-30 pointer-events-none"
      >
        <CinnabarFireCloud
          className="w-[360px] sm:w-[560px] md:w-[700px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
          flipX
        />
      </motion.div>

      {/* --- CLOUD 4: TOP-RIGHT WINGED IMPERIAL CLOUD (Drifts East Northeast) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.9 }}
        animate={
          isDrifting
            ? {
                x: '145%',
                y: '-20%',
                rotate: 16,
                scale: 1.15,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.9 }
        }
        transition={{ duration: 1.75, ease: silkEase, delay: 0.05 }}
        className="absolute top-1/4 -right-28 sm:-right-16 z-25 pointer-events-none"
      >
        <WingedImperialCloud className="w-[330px] sm:w-[500px] md:w-[620px] h-auto drop-shadow-xl" />
      </motion.div>

      {/* --- CLOUD 5: BOTTOM-LEFT INDIGO SAPPHIRE WAVE CLOUD (Drifts Southwest) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? {
                x: '-130%',
                y: '75%',
                rotate: -24,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.7, ease: silkEase }}
        className="absolute -bottom-16 -left-20 sm:-bottom-24 sm:-left-16 z-30 pointer-events-none"
      >
        <IndigoWaveCloud className="w-[360px] sm:w-[580px] md:w-[720px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]" />
      </motion.div>

      {/* --- CLOUD 6: BOTTOM-LEFT GOLDEN SWIRL ACCENT (Drifts South Southwest) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, opacity: 0.88 }}
        animate={
          isDrifting
            ? {
                x: '-115%',
                y: '95%',
                rotate: -12,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.88 }
        }
        transition={{ duration: 1.8, ease: silkEase, delay: 0.08 }}
        className="absolute bottom-6 left-1/4 -translate-x-1/2 z-25 pointer-events-none"
      >
        <RoyalGoldenSwirlCloud className="w-[300px] sm:w-[440px] md:w-[550px] h-auto drop-shadow-xl" />
      </motion.div>

      {/* --- CLOUD 7: BOTTOM-RIGHT ROYAL GOLDEN SWIRL (Drifts Southeast) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? {
                x: '130%',
                y: '75%',
                rotate: 24,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.7, ease: silkEase }}
        className="absolute -bottom-16 -right-20 sm:-bottom-24 sm:-right-16 z-30 pointer-events-none"
      >
        <RoyalGoldenSwirlCloud
          className="w-[370px] sm:w-[580px] md:w-[740px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
          flipX
        />
      </motion.div>

      {/* --- CLOUD 8: BOTTOM-RIGHT VERMILLION FLAME CLOUD (Drifts South Southeast) --- */}
      <motion.div
        initial={{ x: '0%', y: '0%', rotate: 0, opacity: 0.9 }}
        animate={
          isDrifting
            ? {
                x: '125%',
                y: '85%',
                rotate: 15,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.9 }
        }
        transition={{ duration: 1.8, ease: silkEase, delay: 0.07 }}
        className="absolute bottom-4 right-1/4 translate-x-1/2 z-25 pointer-events-none"
      >
        <CinnabarFireCloud className="w-[300px] sm:w-[460px] md:w-[560px] h-auto drop-shadow-xl" />
      </motion.div>

      {/* --- CLOUD 9: TOP-CENTER CLOUD VEIL (Drifts Straight Up North) --- */}
      <motion.div
        initial={{ y: '0%', scaleY: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? { y: '-135%', scaleY: 0.8, opacity: 0 }
            : { y: '0%', scaleY: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.65, ease: silkEase }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-35 pointer-events-none"
      >
        <WingedImperialCloud className="w-[360px] sm:w-[560px] md:w-[700px] h-auto drop-shadow-2xl" />
      </motion.div>

      {/* --- CLOUD 10: UPPER CENTER RIBBON STREAMERS (Drifts Westward with Stretching) --- */}
      <motion.div
        initial={{ x: '0%', opacity: 0.92, scaleX: 1 }}
        animate={
          isDrifting
            ? {
                x: '-130%',
                opacity: 0,
                scaleX: 1.45,
              }
            : { x: '0%', opacity: 0.92, scaleX: 1 }
        }
        transition={{ duration: 1.75, ease: silkEase, delay: 0.03 }}
        className="absolute top-1/3 left-0 w-full z-20 pointer-events-none flex justify-center"
      >
        <StreamerWispsCloud className="w-[125vw] max-w-[1350px] h-auto drop-shadow-xl" />
      </motion.div>

      {/* --- CLOUD 11: LOWER CENTER RIBBON STREAMERS (Drifts Eastward with Stretching) --- */}
      <motion.div
        initial={{ x: '0%', opacity: 0.9, scaleX: 1 }}
        animate={
          isDrifting
            ? {
                x: '130%',
                opacity: 0,
                scaleX: 1.45,
              }
            : { x: '0%', opacity: 0.9, scaleX: 1 }
        }
        transition={{ duration: 1.75, ease: silkEase, delay: 0.06 }}
        className="absolute bottom-1/3 left-0 w-full z-20 pointer-events-none flex justify-center"
      >
        <StreamerWispsCloud
          className="w-[125vw] max-w-[1350px] h-auto drop-shadow-xl"
          flipX
        />
      </motion.div>

      {/* --- CLOUD 12: BOTTOM-CENTER CLOUD BRIDGE (Drifts Straight Down South) --- */}
      <motion.div
        initial={{ y: '0%', scaleY: 1, opacity: 0.95 }}
        animate={
          isDrifting
            ? { y: '135%', scaleY: 0.8, opacity: 0 }
            : { y: '0%', scaleY: 1, opacity: 0.95 }
        }
        transition={{ duration: 1.65, ease: silkEase }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-35 pointer-events-none"
      >
        <IvoryRuyiCloud className="w-[380px] sm:w-[600px] md:w-[740px] h-auto drop-shadow-2xl" />
      </motion.div>
    </div>
  );
};

export default CloudCurtain;
