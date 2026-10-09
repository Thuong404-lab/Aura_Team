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
import { Sparkles, Eye, Volume2 } from 'lucide-react';

interface CloudIntroCurtainProps {
  /** Whether the curtain is currently active/visible */
  isOpen: boolean;
  /** Callback fired once clouds have fully parted and screen is revealed */
  onRevealed?: () => void;
  /** Allow manual dismissal or re-trigger */
  onClose?: () => void;
  /** Whether to auto-part after a short delay (default: true) */
  autoPart?: boolean;
}

export const CloudIntroCurtain: React.FC<CloudIntroCurtainProps> = ({
  isOpen,
  onRevealed,
  onClose,
  autoPart = true,
}) => {
  // State: 'covering' (fully hiding screen) -> 'parting' (clouds flying outward) -> 'hidden'
  const [stage, setStage] = useState<'covering' | 'parting' | 'hidden'>(
    isOpen ? 'covering' : 'hidden'
  );

  useEffect(() => {
    if (isOpen) {
      setStage('covering');

      // Auto part clouds after brief dramatic pause so visitor sees the royal curtain
      if (autoPart) {
        const timer = setTimeout(() => {
          handlePartClouds();
        }, 1600);
        return () => clearTimeout(timer);
      }
    } else {
      setStage('hidden');
    }
  }, [isOpen, autoPart]);

  const handlePartClouds = () => {
    if (stage !== 'covering') return;
    setStage('parting');
    soundEngine.playCloudPartChime();

    // After animation duration, notify parent and complete
    setTimeout(() => {
      setStage('hidden');
      onRevealed?.();
      onClose?.();
    }, 1800);
  };

  if (stage === 'hidden') return null;

  const isParting = stage === 'parting';

  // Smooth cinematic easing for silk-like, billowy cloud movement
  const cloudTransition = {
    duration: 1.65,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden select-none"
      aria-live="polite"
    >
      {/* 1. Deep Midnight Palace Sky Base Backdrop (Covers 100% of underlying web) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isParting ? 0 : 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.15 }}
        className="absolute inset-0 bg-[#070B14] pointer-events-auto"
      >
        {/* Subtle radial golden aura at the heart */}
        <div className="absolute inset-0 bg-radial from-amber-500/[0.12] via-[#0B1222] to-[#04060B]" />

        {/* Ambient Dong Son drum mandala rotating in twilight sky */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] opacity-15 pointer-events-none"
        >
          <DongSonDrumMandala className="w-full h-full" opacity={0.35} />
        </motion.div>
      </motion.div>

      {/* 2. Top-Right "Bỏ qua / Khai mở ngay" Quick Action Button */}
      {!isParting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 z-50 flex items-center gap-3"
        >
          <button
            onClick={handlePartClouds}
            className="group px-4 py-2 rounded-full bg-slate-900/80 hover:bg-amber-950/70 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wider uppercase border border-amber-500/40 hover:border-amber-400 backdrop-blur-md shadow-lg shadow-amber-950/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Khai Mở Ngay</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* 3. CENTER IMPERIAL SEAL & INTRO TITLE (Rộng mở khi vén mây) */}
      <AnimatePresence>
        {!isParting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(8px)', transition: { duration: 0.6 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center flex flex-col items-center justify-center max-w-lg px-6 cursor-pointer"
            onClick={handlePartClouds}
          >
            {/* Imperial Seal Golden Mandala Badge */}
            <div className="relative mb-4 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/80 p-1.5 bg-[#0F172A]/90 backdrop-blur-md shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full border border-amber-500/40 flex items-center justify-center bg-gradient-to-b from-amber-500/20 to-transparent">
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

      {/* ============================================================== */}
      {/* 4. DENSE OVERLAPPING CLOUD BANKS (CÁC TẦNG MÂY CHE KÍN TRANG WEB) */}
      {/* ============================================================== */}

      {/* --- CLOUD BANK A: TOP-LEFT QUADRANT (Bay chéo lên phía Tây Bắc) --- */}
      <motion.div
        animate={
          isParting
            ? {
                x: '-125%',
                y: '-60%',
                rotate: -18,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1 }
        }
        transition={cloudTransition}
        className="absolute -top-16 -left-20 sm:-top-20 sm:-left-16 z-30 pointer-events-none"
      >
        {/* Massive Golden Swirl Cloud (Hoàng Kim) */}
        <RoyalGoldenSwirlCloud className="w-[340px] sm:w-[540px] md:w-[680px] h-auto" />
      </motion.div>

      <motion.div
        animate={
          isParting
            ? {
                x: '-140%',
                y: '-20%',
                rotate: -12,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.95 }
        }
        transition={{ ...cloudTransition, delay: 0.05 }}
        className="absolute top-1/4 -left-24 sm:-left-16 z-25 pointer-events-none"
      >
        {/* Ivory Ruyi Pearl Cloud (Bạch Ngọc Như Ý) */}
        <IvoryRuyiCloud className="w-[300px] sm:w-[460px] md:w-[580px] h-auto" />
      </motion.div>

      {/* --- CLOUD BANK B: TOP-RIGHT QUADRANT (Bay chéo lên phía Đông Bắc) --- */}
      <motion.div
        animate={
          isParting
            ? {
                x: '125%',
                y: '-65%',
                rotate: 20,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1 }
        }
        transition={cloudTransition}
        className="absolute -top-16 -right-20 sm:-top-24 sm:-right-16 z-30 pointer-events-none"
      >
        {/* Vermillion Cinnabar Fire Cloud (Hỏa Vân Chu Sa) */}
        <CinnabarFireCloud
          className="w-[340px] sm:w-[540px] md:w-[680px] h-auto"
          flipX
        />
      </motion.div>

      <motion.div
        animate={
          isParting
            ? {
                x: '135%',
                y: '-15%',
                rotate: 15,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.9 }
        }
        transition={{ ...cloudTransition, delay: 0.06 }}
        className="absolute top-1/4 -right-28 sm:-right-16 z-25 pointer-events-none"
      >
        {/* Winged Imperial Cloud (Cánh Én Hoàng Cung) */}
        <WingedImperialCloud className="w-[320px] sm:w-[480px] md:w-[600px] h-auto" />
      </motion.div>

      {/* --- CLOUD BANK C: BOTTOM-LEFT QUADRANT (Bay cuộn xuống phía Tây Nam) --- */}
      <motion.div
        animate={
          isParting
            ? {
                x: '-120%',
                y: '70%',
                rotate: -22,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1 }
        }
        transition={cloudTransition}
        className="absolute -bottom-16 -left-20 sm:-bottom-24 sm:-left-16 z-30 pointer-events-none"
      >
        {/* Indigo Sapphire Wave Cloud (Huyền Vũ Thủy Ba) */}
        <IndigoWaveCloud className="w-[350px] sm:w-[550px] md:w-[700px] h-auto" />
      </motion.div>

      <motion.div
        animate={
          isParting
            ? {
                x: '-110%',
                y: '90%',
                rotate: -10,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.85 }
        }
        transition={{ ...cloudTransition, delay: 0.08 }}
        className="absolute bottom-6 left-1/4 -translate-x-1/2 z-25 pointer-events-none"
      >
        {/* Golden Swirl Cloud accent */}
        <RoyalGoldenSwirlCloud className="w-[280px] sm:w-[420px] md:w-[520px] h-auto" />
      </motion.div>

      {/* --- CLOUD BANK D: BOTTOM-RIGHT QUADRANT (Bay cuộn xuống phía Đông Nam) --- */}
      <motion.div
        animate={
          isParting
            ? {
                x: '120%',
                y: '70%',
                rotate: 22,
                scale: 1.25,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1 }
        }
        transition={cloudTransition}
        className="absolute -bottom-16 -right-20 sm:-bottom-24 sm:-right-16 z-30 pointer-events-none"
      >
        {/* Royal Golden Swirl Cloud (Hoàng Kim Tường Vân) */}
        <RoyalGoldenSwirlCloud
          className="w-[360px] sm:w-[560px] md:w-[720px] h-auto"
          flipX
        />
      </motion.div>

      <motion.div
        animate={
          isParting
            ? {
                x: '130%',
                y: '80%',
                rotate: 14,
                opacity: 0,
              }
            : { x: '0%', y: '0%', rotate: 0, opacity: 0.9 }
        }
        transition={{ ...cloudTransition, delay: 0.07 }}
        className="absolute bottom-4 right-1/4 translate-x-1/2 z-25 pointer-events-none"
      >
        {/* Vermillion flame cloud accent */}
        <CinnabarFireCloud className="w-[290px] sm:w-[440px] md:w-[540px] h-auto" />
      </motion.div>

      {/* --- CLOUD BANK E: HORIZONTAL GOLD STREAMERS & TOP/BOTTOM BRIDGES --- */}
      {/* Top Center Veil (Kéo lên trời) */}
      <motion.div
        animate={
          isParting
            ? { y: '-130%', scaleY: 0.8, opacity: 0 }
            : { y: '0%', scaleY: 1, opacity: 0.95 }
        }
        transition={cloudTransition}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-35 pointer-events-none"
      >
        <WingedImperialCloud className="w-[340px] sm:w-[540px] md:w-[680px] h-auto" />
      </motion.div>

      {/* Long Golden Ribbon Streamers Stretching Across Screen Center */}
      <motion.div
        animate={
          isParting
            ? {
                x: '-120%',
                opacity: 0,
                scaleX: 1.4,
              }
            : { x: '0%', opacity: 0.95, scaleX: 1 }
        }
        transition={{ ...cloudTransition, delay: 0.04 }}
        className="absolute top-1/3 left-0 w-full z-20 pointer-events-none flex justify-center"
      >
        <StreamerWispsCloud className="w-[120vw] max-w-[1300px] h-auto" />
      </motion.div>

      <motion.div
        animate={
          isParting
            ? {
                x: '120%',
                opacity: 0,
                scaleX: 1.4,
              }
            : { x: '0%', opacity: 0.9, scaleX: 1 }
        }
        transition={{ ...cloudTransition, delay: 0.08 }}
        className="absolute bottom-1/3 left-0 w-full z-20 pointer-events-none flex justify-center"
      >
        <StreamerWispsCloud
          className="w-[120vw] max-w-[1300px] h-auto"
          flipX
        />
      </motion.div>

      {/* Bottom Center Cloud Bridge (Kéo chìm xuống đất) */}
      <motion.div
        animate={
          isParting
            ? { y: '130%', scaleY: 0.8, opacity: 0 }
            : { y: '0%', scaleY: 1, opacity: 0.95 }
        }
        transition={cloudTransition}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-35 pointer-events-none"
      >
        <IvoryRuyiCloud className="w-[360px] sm:w-[580px] md:w-[720px] h-auto" />
      </motion.div>
    </div>
  );
};

export { CloudCurtain } from './CloudCurtain';
export default CloudIntroCurtain;
