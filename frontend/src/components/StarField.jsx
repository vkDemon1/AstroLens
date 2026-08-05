import { useEffect, useRef } from 'react';

/**
 * Animated star field canvas — renders in the background of all pages.
 * Stars twinkle with randomised opacity and size.
 */
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    // Generate star data once
    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),         // normalized 0-1
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    // A handful of larger "feature stars"
    const bigStars = Array.from({ length: 8 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2 + 1.5,
      baseAlpha: 0.5,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      const allStars = [...stars, ...bigStars];
      allStars.forEach(star => {
        const alpha = star.baseAlpha + Math.sin(t * star.twinkleSpeed + star.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(
          star.x * canvas.width,
          star.y * canvas.height,
          star.r,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(240, 232, 208, ${Math.max(0, alpha)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
      aria-hidden="true"
    />
  );
}
