import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  RoyalGoldenSwirlCloud,
  CinnabarFireCloud,
  IndigoWaveCloud,
  StreamerWispsCloud,
} from './CloudMotifs';

/**
 * HeroCloudDepthParallax
 * Adds continuous 3D Depth Parallax when scrolling down the page.
 * As the user scrolls with their mouse wheel:
 * - Foreground clouds zoom forward and fly outward past the viewport in 3D space
 * - Midground clouds drift at varied speeds creating deep spatial layers
 * - Clouds also gently react to mouse cursor movement on desktop
 */
export const HeroCloudDepthParallax: React.FC = () => {
  const { scrollY } = useScroll();

  // Mouse position for subtle 3D tilt tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spring smoothed transforms for mouse wheel scrolling
  const smoothScrollY = useSpring(scrollY, { damping: 25, stiffness: 120 });

  // Top-left foreground cloud: fly out to top-left with 3D scale zoom
  const cloud1X = useTransform(smoothScrollY, [0, 500], [0, -180]);
  const cloud1Y = useTransform(smoothScrollY, [0, 500], [0, -80]);
  const cloud1Scale = useTransform(smoothScrollY, [0, 500], [1, 1.6]);
  const cloud1Opacity = useTransform(smoothScrollY, [0, 400], [0.85, 0]);

  // Top-right foreground cloud: fly out to top-right with 3D scale zoom
  const cloud2X = useTransform(smoothScrollY, [0, 500], [0, 180]);
  const cloud2Y = useTransform(smoothScrollY, [0, 500], [0, -80]);
  const cloud2Scale = useTransform(smoothScrollY, [0, 500], [1, 1.6]);
  const cloud2Opacity = useTransform(smoothScrollY, [0, 400], [0.85, 0]);

  // Midground bottom-left wave cloud: slow drift
  const cloud3X = useTransform(smoothScrollY, [0, 600], [0, -90]);
  const cloud3Y = useTransform(smoothScrollY, [0, 600], [0, 70]);
  const cloud3Opacity = useTransform(smoothScrollY, [0, 500], [0.65, 0]);

  // Midground bottom-right streamer wisps: stretch and shift
  const cloud4X = useTransform(smoothScrollY, [0, 600], [0, 90]);
  const cloud4Y = useTransform(smoothScrollY, [0, 600], [0, 50]);
  const cloud4Opacity = useTransform(smoothScrollY, [0, 500], [0.6, 0]);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      style={{
        perspective: '1000px',
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
        animate={{
          x: mousePos.x * 0.8,
          y: mousePos.y * 0.8,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute -top-12 -left-16 sm:-top-8 sm:-left-10 z-20 pointer-events-none"
      >
        <RoyalGoldenSwirlCloud className="w-56 sm:w-80 md:w-96 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]" />
      </motion.div>

      {/* 2. TOP-RIGHT HARMONIZED FLAME CLOUD (FOREGROUND DEPTH) */}
      <motion.div
        style={{
          x: cloud2X,
          y: cloud2Y,
          scale: cloud2Scale,
          opacity: cloud2Opacity,
        }}
        animate={{
          x: -mousePos.x * 0.8,
          y: mousePos.y * 0.8,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute -top-12 -right-16 sm:-top-8 sm:-right-10 z-20 pointer-events-none"
      >
        <CinnabarFireCloud
          className="w-56 sm:w-80 md:w-96 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          flipX
        />
      </motion.div>

      {/* 3. MIDGROUND WAVE SCALLOP CLOUD (LEFT LOWER FLANK) */}
      <motion.div
        style={{
          x: cloud3X,
          y: cloud3Y,
          opacity: cloud3Opacity,
        }}
        animate={{
          x: mousePos.x * 0.4,
          y: mousePos.y * 0.4,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute top-96 -left-20 sm:-left-12 z-10 pointer-events-none"
      >
        <IndigoWaveCloud className="w-48 sm:w-64 md:w-80 h-auto drop-shadow-lg" />
      </motion.div>

      {/* 4. MIDGROUND STREAMER WISPS (RIGHT LOWER FLANK) */}
      <motion.div
        style={{
          x: cloud4X,
          y: cloud4Y,
          opacity: cloud4Opacity,
        }}
        animate={{
          x: -mousePos.x * 0.4,
          y: mousePos.y * 0.4,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute top-[420px] -right-24 sm:-right-16 z-10 pointer-events-none"
      >
        <StreamerWispsCloud className="w-72 sm:w-96 md:w-[480px] h-auto drop-shadow-lg" flipX />
      </motion.div>
    </div>
  );
};

export default HeroCloudDepthParallax;
