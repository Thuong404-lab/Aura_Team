import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  RoyalGoldenSwirlCloud,
  CinnabarFireCloud,
  IvoryRuyiCloud,
  IndigoWaveCloud,
  StreamerWispsCloud,
  WingedImperialCloud,
} from './CloudMotifs';

/**
 * HeroCloudDepthParallax
 *
 * Mây Cổ Phong 3D Chiều Sâu Hoàng Triều:
 * 1. KHÔNG BAO GIỜ BIẾN MẤT: Các đám mây luôn hiện diện lộng lẫy và bồng bềnh,
 *    khi cuộn trang sẽ rẽ lối sang hai bên cánh gà để mở rộng tầm nhìn cho nội dung
 * 2. Phân bố đều khắp các tầng không gian: Cận cảnh, trung cảnh và viễn cảnh
 * 3. Chuyển động hữu cơ tự nhiên: Mỗi đám mây dập dờn thở nhẹ, lướt êm 120fps
 * 4. Phản hồi mượt mà theo con lăn chuột và cử động chuột tinh tế
 */
export const HeroCloudDepthParallax: React.FC = () => {
  const { scrollY } = useScroll();

  // Mouse position for subtle 3D tilt tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 20;
        const y = (e.clientY / innerHeight - 0.5) * 20;
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Spring smoothed transforms for mouse wheel scrolling
  const smoothScrollY = useSpring(scrollY, { damping: 30, stiffness: 180, mass: 0.35 });

  // 1. TOP-LEFT: Royal Golden Swirl Cloud (Vạt mây vàng hoàng triều trên bên trái)
  const cloud1X = useTransform(smoothScrollY, [0, 800], [0, -120]);
  const cloud1Y = useTransform(smoothScrollY, [0, 800], [0, -40]);
  const cloud1Scale = useTransform(smoothScrollY, [0, 800], [1, 1.25]);
  const cloud1Opacity = useTransform(smoothScrollY, [0, 800], [0.95, 0.78]);

  // 2. TOP-RIGHT: Cinnabar Fire Cloud (Vạt mây lửa chu sa trên bên phải)
  const cloud2X = useTransform(smoothScrollY, [0, 800], [0, 120]);
  const cloud2Y = useTransform(smoothScrollY, [0, 800], [0, -40]);
  const cloud2Scale = useTransform(smoothScrollY, [0, 800], [1, 1.25]);
  const cloud2Opacity = useTransform(smoothScrollY, [0, 800], [0.95, 0.78]);

  // 3. MID-LEFT: Ivory Ruyi Cloud (Mây Như Ý Bạch Ngọc bên sườn trái)
  const cloud3X = useTransform(smoothScrollY, [0, 1000], [0, -80]);
  const cloud3Y = useTransform(smoothScrollY, [0, 1000], [0, 60]);
  const cloud3Opacity = useTransform(smoothScrollY, [0, 1000], [0.9, 0.75]);

  // 4. MID-RIGHT: Winged Imperial Cloud (Mây Cánh Én Hoàng Triều bên sườn phải)
  const cloud4X = useTransform(smoothScrollY, [0, 1000], [0, 80]);
  const cloud4Y = useTransform(smoothScrollY, [0, 1000], [0, 60]);
  const cloud4Opacity = useTransform(smoothScrollY, [0, 1000], [0.9, 0.75]);

  // 5. LOWER-LEFT: Indigo Wave Cloud (Mây Sóng Thủy Ba tầng dưới)
  const cloud5X = useTransform(smoothScrollY, [0, 1200], [0, -60]);
  const cloud5Y = useTransform(smoothScrollY, [0, 1200], [0, 90]);
  const cloud5Opacity = useTransform(smoothScrollY, [0, 1200], [0.85, 0.7]);

  // 6. LOWER-RIGHT: Streamer Wisps Cloud (Dải lụa mây phiêu bồng tầng dưới)
  const cloud6X = useTransform(smoothScrollY, [0, 1200], [0, 60]);
  const cloud6Y = useTransform(smoothScrollY, [0, 1200], [0, 90]);
  const cloud6Opacity = useTransform(smoothScrollY, [0, 1200], [0.85, 0.7]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      aria-hidden="true"
    >
      {/* 1. TOP-LEFT ROYAL SWIRL CLOUD (FOREGROUND DEPTH) */}
      <motion.div
        style={{
          x: cloud1X,
          y: cloud1Y,
          scale: cloud1Scale,
          opacity: cloud1Opacity,
        }}
        className="absolute -top-10 -left-12 sm:-top-6 sm:-left-8 z-20 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [mousePos.x * 0.6 - 6, mousePos.x * 0.6 + 6, mousePos.x * 0.6 - 6],
            y: [mousePos.y * 0.6 - 8, mousePos.y * 0.6 + 8, mousePos.y * 0.6 - 8],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <RoyalGoldenSwirlCloud className="w-64 sm:w-88 md:w-[420px] h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]" />
        </motion.div>
      </motion.div>

      {/* 2. TOP-RIGHT HARMONIZED FLAME CLOUD (FOREGROUND DEPTH) */}
      <motion.div
        style={{
          x: cloud2X,
          y: cloud2Y,
          scale: cloud2Scale,
          opacity: cloud2Opacity,
        }}
        className="absolute -top-10 -right-12 sm:-top-6 sm:-right-8 z-20 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [-mousePos.x * 0.6 + 6, -mousePos.x * 0.6 - 6, -mousePos.x * 0.6 + 6],
            y: [mousePos.y * 0.6 - 8, mousePos.y * 0.6 + 8, mousePos.y * 0.6 - 8],
            rotate: [1, -1, 1],
          }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CinnabarFireCloud
            className="w-64 sm:w-88 md:w-[420px] h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
            flipX
          />
        </motion.div>
      </motion.div>

      {/* 3. MIDGROUND LEFT: IVORY RUYI CLOUD (SƯỜN TRÁI BỐNG BỀNH) */}
      <motion.div
        style={{
          x: cloud3X,
          y: cloud3Y,
          opacity: cloud3Opacity,
        }}
        className="absolute top-72 -left-16 sm:-left-10 z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [mousePos.x * 0.4 - 8, mousePos.x * 0.4 + 8, mousePos.x * 0.4 - 8],
            y: [-10, 10, -10],
            rotate: [-1.2, 1.2, -1.2],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IvoryRuyiCloud className="w-56 sm:w-72 md:w-88 h-auto drop-shadow-xl" />
        </motion.div>
      </motion.div>

      {/* 4. MIDGROUND RIGHT: WINGED IMPERIAL CLOUD (SƯỜN PHẢI BỐNG BỀNH) */}
      <motion.div
        style={{
          x: cloud4X,
          y: cloud4Y,
          opacity: cloud4Opacity,
        }}
        className="absolute top-80 -right-16 sm:-right-10 z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [-mousePos.x * 0.4 + 8, -mousePos.x * 0.4 - 8, -mousePos.x * 0.4 + 8],
            y: [10, -10, 10],
            rotate: [1.2, -1.2, 1.2],
          }}
          transition={{
            duration: 9.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <WingedImperialCloud className="w-56 sm:w-72 md:w-88 h-auto drop-shadow-xl" flipX />
        </motion.div>
      </motion.div>

      {/* 5. LOWER-LEFT: INDIGO WAVE CLOUD */}
      <motion.div
        style={{
          x: cloud5X,
          y: cloud5Y,
          opacity: cloud5Opacity,
        }}
        className="absolute top-[520px] -left-20 sm:-left-12 z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [mousePos.x * 0.3 - 6, mousePos.x * 0.3 + 6, mousePos.x * 0.3 - 6],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IndigoWaveCloud className="w-52 sm:w-68 md:w-80 h-auto drop-shadow-lg" />
        </motion.div>
      </motion.div>

      {/* 6. LOWER-RIGHT: STREAMER WISPS CLOUD */}
      <motion.div
        style={{
          x: cloud6X,
          y: cloud6Y,
          opacity: cloud6Opacity,
        }}
        className="absolute top-[560px] -right-24 sm:-right-16 z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [-mousePos.x * 0.3 + 6, -mousePos.x * 0.3 - 6, -mousePos.x * 0.3 + 6],
            y: [8, -8, 8],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <StreamerWispsCloud className="w-72 sm:w-96 md:w-[460px] h-auto drop-shadow-lg" flipX />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroCloudDepthParallax;
