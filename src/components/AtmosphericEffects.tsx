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

/**
 * AtmosphericEffects (Không Gian Mờ Ảo & Sương Khói Hoàng Cung)
 *
 * Tái hiện trọn vẹn không gian huyền bí, mờ ảo bồng bềnh chốn hoàng triều:
 * 1. Màn sương khói cung đình nhiều lớp (Multi-layered Volumetric Palace Mist)
 *    chuyển động trôi dạt êm đềm với độ mờ đục và lan tỏa ánh sáng rực rỡ
 * 2. Vầng hào quang hoàng kim ấm áp (Celestial Gold Halos) tỏa sáng mềm mại
 * 3. Hạt bụi vàng lấp lánh (Golden Embers) & Ngôi sao kim cương lấp lánh (Diamond Sparkles)
 *    bay bổng trên nền Canvas mượt mà 60fps
 */
export const AtmosphericEffects: React.FC<AtmosphericEffectsProps> = ({
  positioning = 'fixed',
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
      subtle: { embers: 28, stars: 16 },
      medium: { embers: 45, stars: 26 },
      mystic: { embers: 65, stars: 38 },
    }[intensity];

    // 1. Floating Golden Particle Sparks (Embers)
    const embers = Array.from({ length: counts.embers }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1.0,
      speedY: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.28,
      opacity: Math.random() * 0.65 + 0.25,
      pulseSpeed: Math.random() * 0.025 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // 2. Twinkling Diamond Star Sparkles
    const sparkleStars = Array.from({ length: counts.stars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.6 + 1.8,
      speedY: Math.random() * 0.25 + 0.08,
      speedX: (Math.random() - 0.5) * 0.16,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.75 + 0.25,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
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
      ctx.shadowBlur = radius * 5;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
      ctx.fillStyle = `rgba(254, 240, 138, ${opacity})`;

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const innerAngle = angle + Math.PI / 4;
        const outerX = Math.cos(angle) * (radius * 3.0);
        const outerY = Math.sin(angle) * (radius * 3.0);
        const innerX = Math.cos(innerAngle) * (radius * 0.5);
        const innerY = Math.sin(innerAngle) * (radius * 0.5);

        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();

      // Gleaming white crystal core
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(0.8, radius * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.8)})`;
      ctx.shadowBlur = 5;
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
          0.15,
          Math.min(0.95, p.opacity + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.3)
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 197, 85, ${currentOpacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#F59E0B';
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
          0.12,
          Math.min(1.0, star.opacity + Math.sin(tick * star.twinkleSpeed + star.twinkleOffset) * 0.42)
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
      {/* 1. MÀN SƯƠNG MỜ ẢO HOÀNG CUNG NHIỀU TẦNG (LUMINOUS VOLUMETRIC PALACE MIST) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Layer A: Sương mù hoàng kim dâng lên từ đáy màn hình (Dày dặn, mờ ảo) */}
        <div className="absolute -bottom-24 -left-[20%] w-[140%] h-[560px] bg-gradient-to-t from-amber-500/25 via-amber-900/15 to-transparent blur-3xl animate-mist-drift-slow" />

        {/* Layer B: Màn sương mờ ảo cổ phong trôi dạt từ trên xuống */}
        <div className="absolute -top-20 -right-[20%] w-[140%] h-[560px] bg-gradient-to-b from-amber-400/20 via-yellow-950/15 to-transparent blur-3xl animate-mist-drift-reverse" />

        {/* Layer C: Dải mây sương khói lững lờ trôi ngang thân giữa */}
        <div className="absolute top-1/4 -left-[15%] w-[130%] h-[420px] bg-radial from-amber-300/15 via-amber-950/10 to-transparent blur-3xl animate-mist-drift-slow" />

        {/* Layer D: Quầng sáng vầng thái dương hoàng cung ấm áp */}
        {showHalos && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[950px] max-w-[95vw] h-[520px] bg-radial from-amber-400/25 via-amber-600/10 to-transparent blur-[120px] rounded-full pointer-events-none" />
        )}

        {/* Layer E: Luồng sương tím sẫm hoàng triều tạo chiều sâu không gian */}
        <div className="absolute bottom-1/4 -right-[10%] w-[800px] h-[380px] bg-radial from-red-900/15 via-amber-950/10 to-transparent blur-3xl animate-mist-drift-reverse" />
      </motion.div>

      {/* 2. Floating Golden Particle Sparks & Diamond Sparkles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 pointer-events-none"
      />
    </div>
  );
};

export default AtmosphericEffects;
