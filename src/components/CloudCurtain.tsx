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
 * 1. TẢN MÂY RA BỐN PHƯƠNG TÁM HƯỚNG, KHÔNG GÔM MỘT CỤC:
 *    - Các cụm mây được phân bổ đều ra 4 góc, mép sườn trái/phải, viền nóc trên và viền chân dưới.
 *    - Khoảng không gian trung tâm hoàn toàn thoáng đãng, tôn vinh Trống Đồng Đông Sơn uy nghiêm sắc nét.
 * 
 * 2. ĐA DẠNG HÌNH THÁI MÂY CỔ PHONG ("KIỂU NÀY KIỂU KIA SINH ĐỘNG"):
 *    - Hoàng Kim Tường Vân (mây cuộn tròn cát tường) ở góc Tây Bắc & Đông Nam.
 *    - Hỏa Vân Chu Sa (mây ngọn lửa vươn bốc thanh thoát) ở góc Đông Bắc.
 *    - Mây Cánh Én Cung Đình (dáng phượng dực đối xứng) trang nghiêm ở viền nóc trời.
 *    - Mây Bạch Ngọc Như Ý (dáng nấm linh chi mềm mại) ở sườn Tây và viền đáy.
 *    - Huyền Vũ Thủy Ba (mây sóng nước uốn lượn) ở sườn Đông và góc Tây Nam.
 *    - Dải lụa mây tơ vắt ngang bồng bềnh viễn cảnh (Streamer Wisps) mờ ảo làm nền sâu.
 * 
 * 3. CHUYỂN ĐỘNG BỒNG BỀNH & TAN MÂY NGOẠN MỤC:
 *    - Mỗi cụm mây trôi lượn theo chu kỳ thời gian và quỹ đạo khác nhau, không trùng lặp.
 *    - Khi chạm vào màn hình: Toàn bộ mây tản đều ra 8 hướng (radial outward blast),
 *      Trống đồng ở tâm điểm phóng to ngoạn mục (scale 1.0 -> 2.45), xoay 720 độ hoàng kim,
 *      sau đó tan vào ánh sáng bừng rực rỡ và khai mở trang web cùng thanh Header!
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

    // Sau khi trống đồng to lên và xoay vòng tráng lệ (2.4s), khai mở trang web
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
      className="fixed inset-0 z-[250] overflow-hidden select-none bg-[#04060E] cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-label="Màn Mây Cổ Phong Khai Mở Di Sản Việt Phục"
    >
      {/* ========================================================================= */}
      {/* 1. NỀN KHÔNG GIAN BỒNG LAI & SƯƠNG MỜ HUYỀN ẢO (MIST & FOG NEBULA)         */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#02040A] via-[#070D1D] to-[#03050E]" />

        {/* Lớp sương mờ ảo trung tâm (Ethereal Mist Glow) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(217, 119, 6, 0.16) 0%, rgba(180, 83, 9, 0.08) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Floating golden dust particles / Bụi vàng thần tiên */}
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1.5px,transparent_1.5px)] [background-size:36px_36px] opacity-20 pointer-events-none" />

        {/* Subtle royal pattern vignette */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#03050C]/40 to-[#02040A]" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. NÚT KHAI MỞ NHANH (FAST SKIP BUTTON)                                    */}
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
      {/* 3. TẦNG VIỄN CẢNH: DẢI LỤA MÂY TƠ THOÁNG ĐÃNG (BACKGROUND STREAMER WISPS)  */}
      {/*    Được làm thanh thoát, mờ nhẹ, không chắn tầm nhìn trống đồng             */}
      {/* ========================================================================= */}
      <motion.div
        className="absolute top-[8%] left-0 w-full flex justify-center pointer-events-none opacity-40"
        animate={
          isRevealing
            ? {
                y: -180,
                opacity: 0,
                scale: 1.15,
              }
            : {
                x: [-25, 25, -25],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
            : { duration: 18, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <StreamerWispsCloud className="w-[100vw] max-w-[1200px] h-auto drop-shadow-[0_4px_16px_rgba(245,158,11,0.15)]" />
      </motion.div>

      <motion.div
        className="absolute bottom-[8%] left-0 w-full flex justify-center pointer-events-none opacity-40"
        animate={
          isRevealing
            ? {
                y: 180,
                opacity: 0,
                scale: 1.15,
              }
            : {
                x: [25, -25, 25],
                opacity: [0.35, 0.5, 0.35],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
            : { duration: 20, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <StreamerWispsCloud className="w-[100vw] max-w-[1200px] h-auto drop-shadow-[0_4px_16px_rgba(245,158,11,0.15)]" flipX />
      </motion.div>

      {/* ========================================================================= */}
      {/* 4. TẢN MÂY RA CÁC MÉP & GÓC: ĐA DẠNG KIỂU DÁNG (KIỂU NÀY KIỂU KIA)         */}
      {/*    Tuyệt đối KHÔNG gôm vào 1 cục, mỗi góc 1 dáng mây đặc sắc riêng biệt    */}
      {/* ========================================================================= */}

      {/* 4.1. GÓC TRÊN BÊN TRÁI: HOÀNG KIM TƯỜNG VÂN (Cuộn xoáy tròn cát tường) */}
      <motion.div
        className="absolute top-0 left-0 -translate-x-4 -translate-y-4 sm:translate-x-0 sm:translate-y-0 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: -420,
                y: -260,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [-8, 8, -8],
                y: [-6, 6, -6],
                rotate: [-1.5, 1.5, -1.5],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.85, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <RoyalGoldenSwirlCloud className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_18px_38px_rgba(0,0,0,0.85)]" />
      </motion.div>

      {/* 4.2. GÓC TRÊN BÊN PHẢI: HỎA VÂN CHU SA (Dáng ngọn lửa vươn bốc thanh thoát) */}
      <motion.div
        className="absolute top-0 right-0 translate-x-4 -translate-y-4 sm:translate-x-0 sm:translate-y-0 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: 420,
                y: -260,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [8, -8, 8],
                y: [-8, 8, -8],
                rotate: [1.5, -1.5, 1.5],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.85, ease: [0.22, 1, 0.36, 1] }
            : { duration: 9.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <CinnabarFireCloud className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_18px_38px_rgba(0,0,0,0.85)]" flipX />
      </motion.div>

      {/* 4.3. ĐỈNH VÒM TRỜI Ở GIỮA: MÂY CÁNH ÉN CUNG ĐÌNH (Dáng phượng dực che nóc) */}
      <motion.div
        className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 pointer-events-none z-15"
        animate={
          isRevealing
            ? {
                y: -260,
                opacity: 0,
                scale: 1.15,
              }
            : {
                y: [-5, 5, -5],
                scale: [1, 1.025, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.75, ease: [0.22, 1, 0.36, 1] }
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <WingedImperialCloud className="w-44 sm:w-60 md:w-72 lg:w-80 h-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.75)]" />
      </motion.div>

      {/* 4.4. SƯỜN MÉP BÊN TRÁI: BẠCH NGỌC NHƯ Ý (Mềm mại lơ lửng sườn trái) */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -left-8 sm:-left-4 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: -360,
                opacity: 0,
                scale: 1.2,
              }
            : {
                x: [-10, 10, -10],
                y: [6, -6, 6],
                rotate: [-1, 1, -1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
            : { duration: 11, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IvoryRuyiCloud className="w-36 sm:w-48 md:w-56 lg:w-64 h-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)]" />
      </motion.div>

      {/* 4.5. SƯỜN MÉP BÊN PHẢI: HUYỀN VŨ THỦY BA (Uốn lượn lơ lửng sườn phải) */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -right-8 sm:-right-4 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: 360,
                opacity: 0,
                scale: 1.2,
              }
            : {
                x: [10, -10, 10],
                y: [-6, 6, -6],
                rotate: [1, -1, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
            : { duration: 10.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IndigoWaveCloud className="w-36 sm:w-48 md:w-56 lg:w-64 h-auto drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)]" flipX />
      </motion.div>

      {/* 4.6. GÓC DƯỚI BÊN TRÁI: HUYỀN VŨ THỦY BA (Dáng sóng nước nâng đỡ chân trời) */}
      <motion.div
        className="absolute bottom-0 left-0 -translate-x-4 translate-y-4 sm:translate-x-0 sm:translate-y-0 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: -420,
                y: 260,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [-7, 7, -7],
                y: [7, -7, 7],
                rotate: [1, -1, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.85, ease: [0.22, 1, 0.36, 1] }
            : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IndigoWaveCloud className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_18px_38px_rgba(0,0,0,0.85)]" />
      </motion.div>

      {/* 4.7. GÓC DƯỚI BÊN PHẢI: HOÀNG KIM TƯỜNG VÂN (Đối xứng vững chãi) */}
      <motion.div
        className="absolute bottom-0 right-0 translate-x-4 translate-y-4 sm:translate-x-0 sm:translate-y-0 pointer-events-none z-20"
        animate={
          isRevealing
            ? {
                x: 420,
                y: 260,
                opacity: 0,
                scale: 1.25,
              }
            : {
                x: [7, -7, 7],
                y: [6, -6, 6],
                rotate: [-1, 1, -1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.85, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <RoyalGoldenSwirlCloud className="w-48 sm:w-64 md:w-80 lg:w-96 h-auto drop-shadow-[0_18px_38px_rgba(0,0,0,0.85)]" flipX />
      </motion.div>

      {/* 4.8. VIỀN CHÂN DƯỚI CÙNG: BẠCH NGỌC NHƯ Ý (Mềm mại viền chân trời) */}
      <motion.div
        className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-15"
        animate={
          isRevealing
            ? {
                y: 260,
                opacity: 0,
                scale: 1.15,
              }
            : {
                y: [5, -5, 5],
                scale: [1, 1.02, 1],
              }
        }
        transition={
          isRevealing
            ? { duration: 1.75, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <IvoryRuyiCloud className="w-44 sm:w-60 md:w-72 lg:w-80 h-auto drop-shadow-[0_14px_30px_rgba(0,0,0,0.75)]" />
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. TÂM ĐIỂM HOÀNG TRIỀU: TRỐNG ĐỒNG ĐÔNG SƠN "TO LÊN & XOAY VÒNG" TRÁNG LỆ  */}
      {/*    Được giải phóng không gian, không bị mây che đè hay dồn cục              */}
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
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(217, 119, 6, 0.25) 35%, rgba(180, 83, 9, 0.08) 60%, transparent 75%)',
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
            width: '300px',
            height: '300px',
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
        </motion.div>

        {/* Biển ngọc: ĐẠI VIỆT DI SẢN - ĐỨNG YÊN HOÀN TOÀN KHÔNG XOAY THEO TRỐNG ĐỒNG */}
        <motion.div
          animate={{
            opacity: isRevealing ? [1, 0.8, 0] : 1,
            scale: isRevealing ? [1, 1.05, 0.95] : 1,
            y: isRevealing ? [0, 20, 40] : 0,
          }}
          transition={{ duration: 1.2 }}
          className="relative -mt-4 px-6 py-1.5 rounded-full text-xs font-bold tracking-[0.26em] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 uppercase shadow-[0_6px_22px_rgba(0,0,0,0.9)] border border-yellow-100 whitespace-nowrap font-serif-vi flex items-center gap-2 z-40 select-none pointer-events-none"
          style={{ transform: 'none' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
          <span>ĐẠI VIỆT DI SẢN</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-950 inline-block" />
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
            Làn mây cổ phong tản quanh vòm trời · Chạm hoặc bấm vào màn hình để khai mở
          </p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 6. HƯỚNG DẪN TƯƠNG TÁC: CHẠM / BẤM VÀO MÀN HÌNH ĐỂ KHAI MỞ                */}
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
                  Mây tản ra bốn phương, Trống đồng xoay vòng khai mở Cung điện Việt phục
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. LỚP HÀO QUANG VÀNG KIM BỪNG SÁNG KHI KHAI MỞ THẾ GIỚI (GOLDEN FLASH)     */}
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
