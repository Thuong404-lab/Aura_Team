import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AtmosphericEffectsProps {
  /** Mode of anchoring: 'absolute' (relative to container) or 'fixed' (viewport) */
  positioning?: 'absolute' | 'fixed';
  /** Density level for golden sparks */
  intensity?: 'subtle' | 'medium' | 'mystic';
  /** Optional extra classes */
  className?: string;
  /** Whether to show the ethereal gold halos */
  showHalos?: boolean;
}

export const AtmosphericEffects: React.FC<AtmosphericEffectsProps> = ({
  positioning = 'absolute',
  intensity = 'mystic',
  className = '',
  showHalos = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle multiplier based on intensity
    const counts = {
      subtle: { embers: 22, stars: 12 },
      medium: { embers: 36, stars: 20 },
      mystic: { embers: 48, stars: 28 },
    }[intensity];

    // 1. Floating Golden Particle Sparks (Embers)
    const embers = Array.from({ length: counts.embers }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.4 + 0.8,
      speedY: Math.random() * 0.38 + 0.12,
      speedX: (Math.random() - 0.5) * 0.22,
      opacity: Math.random() * 0.55 + 0.18,
      pulseSpeed: Math.random() * 0.022 + 0.009,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // 2. Twinkling Diamond Star Sparkles
    const sparkleStars = Array.from({ length: counts.stars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.2 + 1.6,
      speedY: Math.random() * 0.22 + 0.06,
      speedX: (Math.random() - 0.5) * 0.12,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.018,
      opacity: Math.random() * 0.65 + 0.2,
      twinkleSpeed: Math.random() * 0.035 + 0.012,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Draw 4-pointed shimmering diamond sparkle
    const drawSparkle = (
      x: number,
      y: number,
      radius: number,
      opacity: number,
      rotation: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Outer golden glow
      ctx.shadowBlur = radius * 4.5;
      ctx.shadowColor = 'rgba(250, 204, 21, 0.85)';
      ctx.fillStyle = `rgba(254, 240, 138, ${opacity})`;

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const innerAngle = angle + Math.PI / 4;
        const outerX = Math.cos(angle) * (radius * 2.8);
        const outerY = Math.sin(angle) * (radius * 2.8);
        const innerX = Math.cos(innerAngle) * (radius * 0.45);
        const innerY = Math.sin(innerAngle) * (radius * 0.45);

        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();

      // Gleaming white crystal core
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.7, radius * 0.38), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.6)})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render Floating Golden Embers
      embers.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const currentOpacity = Math.max(
          0.1,
          Math.min(0.9, p.opacity + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.25)
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 197, 85, ${currentOpacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Twinkling Diamond Star Sparkles
      sparkleStars.forEach((star) => {
        star.y -= star.speedY;
        star.x += star.speedX;
        star.rotation += star.rotSpeed;

        if (star.y < -16) {
          star.y = height + 16;
          star.x = Math.random() * width;
        }
        if (star.x < -16) star.x = width + 16;
        if (star.x > width + 16) star.x = -16;

        const currentOpacity = Math.max(
          0.08,
          Math.min(0.95, star.opacity + Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.38)
        );

        drawSparkle(star.x, star.y, star.size, currentOpacity, star.rotation);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  const posClass = positioning === 'fixed' ? 'fixed inset-0' : 'absolute inset-0';

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden z-0 ${posClass} ${className}`}
      aria-hidden="true"
    >
      {/* 1. Slow-Moving Mist Layers (Anchored to Background) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Layer A: Lower rising misty aura with slow drift */}
        <div className="absolute -bottom-28 -left-[20%] w-[140%] h-[480px] bg-gradient-to-t from-amber-500/[0.09] via-slate-900/[0.22] to-transparent blur-3xl animate-mist-drift-slow" />

        {/* Layer B: Upper palace mist veil moving in reverse */}
        <div className="absolute -top-24 -right-[20%] w-[140%] h-[500px] bg-gradient-to-b from-amber-400/[0.07] via-amber-950/[0.1] to-transparent blur-3xl animate-mist-drift-reverse" />

        {/* Layer C: Mid-level soft drifting misty fog band */}
        <div className="absolute top-1/3 -left-[10%] w-[120%] h-[320px] bg-radial from-amber-200/[0.04] via-emerald-950/[0.04] to-transparent blur-3xl animate-mist-drift-slow" />

        {/* Layer D: Central celestial gold aura glow */}
        {showHalos && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] max-w-[95vw] h-[450px] bg-radial from-amber-400/[0.14] via-amber-600/[0.05] to-transparent blur-[140px] rounded-full" />
        )}
      </motion.div>

      {/* 2. Floating Golden Particle Sparks & Diamond Sparkles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85"
      />
    </div>
  );
};

export default AtmosphericEffects;
