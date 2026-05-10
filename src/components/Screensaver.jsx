import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MONOGRAM_COUNT = 15;
const MIN_SIZE = 24;
const MAX_SIZE = 72;
const MIN_SPEED = 0.12;
const MAX_SPEED = 0.42;

function createMonogram(width, height) {
  const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
  const angle = Math.random() * Math.PI * 2;
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);

  return {
    x: Math.random() * Math.max(width - size * 2, 1),
    y: Math.random() * Math.max(height - size * 1.5, 1),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size,
    opacity: 0.1 + Math.random() * 0.3,
  };
}

export function Screensaver({ isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let monograms = [];

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;

      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (monograms.length === 0) {
        monograms = Array.from({ length: MONOGRAM_COUNT }, () => createMonogram(width, height));
        return;
      }

      monograms = monograms.map((monogram) => ({
        ...monogram,
        x: Math.min(monogram.x, Math.max(width - monogram.size * 2, 0)),
        y: Math.min(monogram.y, Math.max(height - monogram.size * 1.4, 0)),
      }));
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#050508';
      context.fillRect(0, 0, width, height);

      monograms.forEach((monogram) => {
        monogram.x += monogram.vx;
        monogram.y += monogram.vy;

        if (monogram.x <= 0 || monogram.x >= width - monogram.size * 2) {
          monogram.vx *= -1;
          monogram.x = Math.min(
            Math.max(monogram.x, 0),
            Math.max(width - monogram.size * 2, 0),
          );
        }

        if (monogram.y <= monogram.size || monogram.y >= height - monogram.size * 0.4) {
          monogram.vy *= -1;
          monogram.y = Math.min(
            Math.max(monogram.y, monogram.size),
            Math.max(height - monogram.size * 0.4, monogram.size),
          );
        }

        context.fillStyle = `rgba(0, 245, 255, ${monogram.opacity})`;
        context.font = `${monogram.size}px "Syne", sans-serif`;
        context.fillText('AM', monogram.x, monogram.y);
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    resizeCanvas();
    render();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  return (
    <motion.div
      key="screensaver"
      className="screensaver-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="screensaver-blackout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <motion.div
        className="screensaver-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.6,
          ease: 'easeOut',
        }}
      >
        <canvas ref={canvasRef} className="screensaver-canvas" />
        <div className="screensaver-wake-text">Click anywhere to wake</div>
      </motion.div>
    </motion.div>
  );
}
