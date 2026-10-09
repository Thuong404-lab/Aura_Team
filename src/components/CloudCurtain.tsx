import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Sparkles, Hand } from 'lucide-react';

export interface CloudCurtainProps {
  /** Controlled visibility of the curtain */
  isOpen?: boolean;
  /** Callback fired once drum finishes spinning and website is revealed */
  onRevealed?: () => void;
  /** Callback for closing / dismissing curtain */
  onClose?: () => void;
  /** Optional auto-part flag */
  autoPart?: boolean;
  /** Optional auto-fly timeout */
  autoFlyTimeout?: number;
}

/**
 * CloudCurtain Component (Màn Mây Cổ Phong Khai Mở Di Sản Hoàng Triều):
 * 
 * 1. CHE KÍN TOÀN BỘ WEBSITE VÀ HEADER KHI MỚI VÀO:
 *    - Toàn bộ giao diện web và thanh header được ẩn kín mít, tạo cảm giác bước vào chốn bồng lai.
 * 
 * 2. ĐÁM MÂY CỔ PHONG HIỆN DIỆN PHONG PHÚ & HIỆU ỨNG MỜ ẢO SƯƠNG KHÓI:
 *    - Đầy đủ các cụm mây hoàng kim, mây lửa chu sa, mây cánh én, như ý, thủy ba bao quanh.
 *    - Các lớp sương mờ ảo (ethereal mist wisps), bụi vàng lấp lánh trôi nhẹ nhàng.
 *    - Các đám mây dập dờn thở nhẹ (ambient breathing & drifting motion) sống động như tranh thủy mặc.
 * 
 * 3. XÓA BỎ HOÀN TOÀN CON LĂN CHUỘT:
 *    - Không dùng con lăn chuột để mở màn mây.
 *    - Người dùng chỉ cần chạm / bấm vào màn hình để bắt đầu màn khai mở.
 * 
 * 4. HOẠT CẢNH KHI MÂY TAN: TRỐNG ĐỒNG TO LÊN VÀ XOAY VÒNG RỒI MỚI HIỆN WEB:
 *    - Khi bấm: Mây từ từ tản mát dạt ra hai bên và tan biến vào làn sương mờ ảo.
 *    - Đồng thời, Trống đồng Đông Sơn ở trung tâm phóng to lên (scale up 2.4x) và xoay vòng (720 độ)
 *      với mặt trời 14 tia sáng tỏa hào quang rực rỡ, đàn chim Lạc và vòng vũ nhân quay tròn uy nghi!
 *    - Sau khi trống đồng hoàn tất xoay vòng và bừng sáng hào quang, toàn bộ trang web và Header
 *      mới được khai mở tráng lệ, mượt mà 120fps.
 */
export const CloudCurtain: React.FC<CloudCurtainProps> = ({
  isOpen = true,
  onRevealed,
  onClose,
}) => {
  // Animation phases: 'idle' (waiting for click) | 'revealing' (clouds parting, drum scaling up & spinning) | 'finished'
  const [phase, setPhase] = useState<'idle' | 'revealing' | 'finished'>('idle');
  const isTriggeredRef = useRef(false);

  // Sync state if isOpen changes externally
  useEffect(() => {
    if (!isOpen) {
      setPhase('finished');
      isTriggeredRef.current = false;
    } else {
      setPhase('idle');
      isTriggeredRef.current = false;
    }
  }, [isOpen]);

  // Finish callback when animation completes
  const handleCompleteReveal = useCallback(() => {
    setPhase('finished');
    try {
      soundEngine.playPluck(659.25);
    } catch {
      // Audio safe
    }
    onRevealed?.();
    onClose?.();
  }, [onRevealed, onClose]);

  // Trigger parting & spinning drum animation on screen click/tap
  const triggerRevealAnimation = useCallback(() => {
    if (isTriggeredRef.current || phase !== 'idle') return;
    isTriggeredRef.current = true;
    setPhase('revealing');

    try {
      // Heritage chime & string pluck on unlock
      soundEngine.playCloudPartChime();
      soundEngine.playPluck(523.25);
    } catch {
      // Audio safe
    }

    // Sau khi trống đồng to lên và xoay vòng tráng lệ (khoảng 2.4s), khai mở trang web
    window.setTimeout(() => {
      handleCompleteReveal();
    }, 2400);
  }, [phase, handleCompleteReveal]);

  // Fast skip trigger
  const handleFastSkip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleCompleteReveal();
    },
    [handleCompleteReveal]
  );

  if (!isOpen || phase === 'finished') {
    return null;
  }

  const isRevealing = phase === 'revealing';

  return (
    <div
      onClick={triggerRevealAnimation}
      className="fixed inset-0 z-[250] overflow-hidden select-none bg-[#050811] cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-label="Màn Mây Cổ Phong Khai Mở Di Sản Việt Phục"
    >
      {/* ========================================================================= */}
      {/* 1. LỚP NỀN KHÔNG GIAN BỒNG LAI & SƯƠNG MỜ HUYỀN ẢO (ETHEREAL MIST & FOG)   */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isRevealing ? [1, 1, 0] : 1,
        }}
        transition={{
          duration: 2.4,
          times: [0, 0.75, 1],
          ease: 'easeInOut',
        }}
      >
        {/* Imperial Velvet Dark Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03060E] via-[#080E21] to-[#040713]" />

        {/* Lớp sương mờ ảo trung tâm (Dreamy Ethereal Mist Glow) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.55, 0.8, 0.55],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.12) 35%, rgba(180, 83, 9, 0.05) 55%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Lớp sương mù bảng lảng trôi nổi (Drifting Ambient Smoke Mist) */}
        <motion.div
          animate={{
            x: [-60, 60, -60],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-0 w-full h-[360px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(254, 243, 199, 0.12) 0%, rgba(217, 119, 6, 0.06) 45%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        <motion.div
          animate={{
            x: [60, -60, 60],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 left-0 w-full h-[360px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.12) 0%, rgba(180, 83, 9, 0.05) 50%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Floating golden dust particles / Bụi vàng thần tiên */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

        {/* Subtle royal pattern vignette */}
        <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#050811]/50 to-[#03050C]" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. NÚT KHAI MỞ NHANH (FAST SKIP BUTTON Ở GÓC TRÊN BÊN PHẢI)                */}
      {/* ========================================================================= */}
      {!isRevealing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50"
        >
          <button
            onClick={handleFastSkip}
            className="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-amber-950/90 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wider uppercase border border-amber-500/50 hover:border-amber-400 backdrop-blur-md shadow-lg shadow-amber-950/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Bỏ qua và vào trang web ngay"
          >
            <span>Khai Mở Nhanh</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3. TẦNG VIỄN CẢNH: DẢI LỤA MÂY VẮT NGANG BẦU TRỜI (STREAMER WISPS)         */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute top-[12%] left-0 w-full flex justify-center pointer-events-none"
        animate={
          isRevealing
            ? {
                y: -140,
                opacity: 0,
                scale: 1.2,
              }
            : {
                x: [-20, 20, -20],
                opacity: [0.65, 0.85, 0.65],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
            : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <StreamerWispsCloud className="w-[120vw] max-w-[1400px] h-auto drop-shadow-[0_8px_20px_rgba(245,158,11,0.2)]" />
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] left-0 w-full flex justify-center pointer-events-none"
        animate={
          isRevealing
            ? {
                y: 140,
                opacity: 0,
                scale: 1.2,
              }
            : {
                x: [20, -20, 20],
                opacity: [0.6, 0.8, 0.6],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
            : { duration: 16, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <StreamerWispsCloud className="w-[120vw] max-w-[1400px] h-auto drop-shadow-[0_8px_20px_rgba(245,158,11,0.2)]" flipX />
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. TẦNG TRUNG CẢNH: MÂY CÁNH ÉN CUNG ĐÌNH & MÂY NHƯ Ý (MIDGROUND CLOUDS)    */}
      {/* ========================================================================= */}
      {/* Mây Cánh Én Cung Đình ở đỉnh màn hình */}
      <motion.div
        className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        animate={
          isRevealing
            ? {
                y: -220,
                opacity: 0,
                scale: 1.15,
              }
            : {
                y: [-6, 6, -6],
                scale: [1, 1.025, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <WingedImperialCloud className="w-[520px] sm:w-[720px] md:w-[920px] h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]" />
      </motion.div>

      {/* Mây Như Ý Cổ Điển ở đáy màn hình */}
      <motion.div
        className="absolute -bottom-14 sm:-bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        animate={
          isRevealing
            ? {
                y: 220,
                opacity: 0,
                scale: 1.15,
              }
            : {
                y: [6, -6, 6],
                scale: [1, 1.02, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
            : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IvoryRuyiCloud className="w-[540px] sm:w-[760px] md:w-[960px] h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. TẦNG CẬN CẢNH: 4 ĐÁM MÂY LỚN BỐN GÓC (FOREGROUND IMPERIAL CORNER CLOUDS) */}
      {/* ========================================================================= */}
      {/* Top-Left: Hoàng Kim Tường Vân */}
      <motion.div
        className="absolute top-0 -left-12 sm:-left-8 md:left-2 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: -320,
                y: -180,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [-10, 10, -10],
                y: [-8, 8, -8],
                rotate: [-1, 1, -1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.9, ease: [0.22, 1, 0.36, 1] }
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <RoyalGoldenSwirlCloud className="w-[340px] sm:w-[460px] md:w-[560px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
      </motion.div>

      {/* Top-Right: Hỏa Vân Chu Sa */}
      <motion.div
        className="absolute top-0 -right-12 sm:-right-8 md:right-2 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: 320,
                y: -180,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [10, -10, 10],
                y: [-8, 8, -8],
                rotate: [1, -1, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.9, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <CinnabarFireCloud className="w-[340px] sm:w-[460px] md:w-[560px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" flipX />
      </motion.div>

      {/* Bottom-Left: Huyền Vũ Thủy Ba */}
      <motion.div
        className="absolute bottom-2 -left-12 sm:-left-8 md:left-2 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: -320,
                y: 180,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [-8, 8, -8],
                y: [8, -8, 8],
                rotate: [1, -1, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.9, ease: [0.22, 1, 0.36, 1] }
            : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IndigoWaveCloud className="w-[340px] sm:w-[460px] md:w-[560px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
      </motion.div>

      {/* Bottom-Right: Hoàng Kim Tường Vân đối xứng */}
      <motion.div
        className="absolute bottom-2 -right-12 sm:-right-8 md:right-2 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: 320,
                y: 180,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [8, -8, 8],
                y: [8, -8, 8],
                rotate: [-1, 1, -1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.9, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <RoyalGoldenSwirlCloud className="w-[340px] sm:w-[460px] md:w-[560px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" flipX />
      </motion.div>

      {/* ========================================================================= */}
      {/* 6. TÂM ĐIỂM HOÀNG TRIỀU: TRỐNG ĐỒNG ĐÔNG SƠN "TO LÊN & XOAY VÒNG" TRÁNG LỆ  */}
      {/*    Theo yêu cầu: khi mây tan thì hiện trống đồng ra to lên xoay vòng         */}
      {/* ========================================================================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-30">
        
        {/* Hào quang Thái Dương bừng sáng & lan tỏa (Divine Solar God Rays) */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          animate={
            isRevealing
              ? {
                  scale: [1, 2.2, 4.5],
                  rotate: [0, 180, 540],
                  opacity: [0.4, 0.95, 0],
                }
              : {
                  scale: [1, 1.15, 1],
                  rotate: [0, 45, 0],
                  opacity: [0.35, 0.55, 0.35],
                }
          }
          transition={
            isRevealing
              ? { duration: 2.3, ease: [0.16, 1, 0.3, 1] }
              : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            width: '650px',
            height: '650px',
            background:
              'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, rgba(217, 119, 6, 0.28) 35%, rgba(180, 83, 9, 0.1) 60%, transparent 75%)',
          }}
        />

        {/* ======================================================================= */}
        {/* CHÍNH DIỆN: TRỐNG ĐỒNG ĐÔNG SƠN (SCALE UP "TO LÊN" VÀ XOAY VÒNG 720°)   */}
        {/* ======================================================================= */}
        <motion.div
          className="relative flex items-center justify-center pointer-events-none"
          animate={
            isRevealing
              ? {
                  // TO LÊN RỰC RỠ: scale phóng to ngoạn mục từ 1.0 lên 2.45
                  scale: [1.0, 1.45, 2.45],
                  // XOAY VÒNG TRÁNG LỆ: 720 độ
                  rotate: [0, 240, 720],
                  // Tỏa sáng đỉnh điểm rồi hòa tan khai mở trang web
                  opacity: [1, 1, 0],
                }
              : {
                  scale: [1, 1.04, 1],
                  rotate: [0, 15, 0],
                  opacity: 1,
                }
          }
          transition={
            isRevealing
              ? {
                  duration: 2.35,
                  times: [0, 0.5, 1],
                  ease: [0.16, 1, 0.3, 1],
                }
              : {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          style={{
            width: '320px',
            height: '320px',
            willChange: 'transform, opacity',
          }}
        >
          {/* Vành viền kim sắc tráng lệ */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/80 shadow-[0_0_50px_rgba(245,158,11,0.6)]" />

          {/* Trống đồng Đông Sơn Ngọc Lũ siêu chi tiết & sắc nét */}
          <div className="w-full h-full rounded-full p-2 flex items-center justify-center bg-radial from-amber-950/40 via-[#0B1120] to-[#040710] overflow-hidden shadow-inner">
            <DongSonDrumMandala
              className="w-full h-full drop-shadow-[0_0_35px_rgba(245,158,11,0.7)]"
              opacity={1}
              animated={true}
              speed={isRevealing ? 3.5 : 1}
              glow={true}
              crisp={true}
            />
          </div>

          {/* Biển ngọc: ĐẠI VIỆT DI SẢN (Ẩn nhẹ khi phóng to cực đại) */}
          <motion.div
            animate={{
              opacity: isRevealing ? [1, 0.8, 0] : 1,
              y: isRevealing ? [0, 30, 60] : 0,
            }}
            transition={{ duration: 1.2 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-[0.26em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 uppercase shadow-[0_6px_22px_rgba(0,0,0,0.9)] border border-yellow-100 whitespace-nowrap font-serif-vi flex items-center gap-2 z-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
            <span>ĐẠI VIỆT DI SẢN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
          </motion.div>
        </motion.div>

        {/* Tiêu đề & Lời dẫn thơ mộng */}
        <motion.div
          animate={{
            opacity: isRevealing ? 0 : 1,
            y: isRevealing ? 40 : 0,
          }}
          transition={{ duration: 0.8 }}
          className="mt-8 text-center space-y-2 pointer-events-none"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.35em] uppercase text-amber-300/90 font-serif-vi">
            Khai Mở Cánh Cổng Triều Đại
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif-vi font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            Việt Phục Hoàng Triều
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/85 max-w-sm mx-auto font-sans-vi leading-relaxed">
            Làn mây cổ phong đang che kín cổng di sản · Chạm hoặc bấm vào màn hình để khai mở
          </p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 7. HƯỚNG DẪN TƯƠNG TÁC: CHẠM / BẤM VÀO MÀN HÌNH ĐỂ KHAI MỞ                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isRevealing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
          >
            {/* Interactive Click / Tap Anywhere Banner */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={triggerRevealAnimation}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-slate-950/90 hover:bg-slate-900/95 backdrop-blur-xl border border-amber-400/60 hover:border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all flex items-center gap-4 cursor-pointer group select-none"
            >
              {/* Luminous Pulsing Touch Icon */}
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                <Hand className="w-4 h-4 text-amber-300 animate-bounce" />
              </div>

              {/* Status Message */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100 flex items-center gap-2 font-serif-vi tracking-wide">
                  <span>Chạm hoặc bấm vào màn hình để khai mở</span>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ✦
                  </motion.span>
                </span>
                <span className="text-[11px] text-amber-300/80">
                  Mây sẽ từ từ tan đi, Trống đồng xoay vòng khai mở Cung điện Việt phục
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. LỚP HÀO QUANG VÀNG KIM BỪNG SÁNG KHI KHAI MỞ THẾ GIỚI (GOLDEN FLASH)     */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40 bg-radial from-amber-400/30 via-yellow-600/15 to-transparent"
        animate={{
          opacity: isRevealing ? [0, 0.85, 0] : 0,
        }}
        transition={{
          duration: 2.35,
          times: [0, 0.7, 1],
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default CloudCurtain;
