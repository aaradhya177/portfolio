import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 120;
const PARTICLE_RADIUS = 1;
const PARTICLE_OPACITY = 0.4;
const MIN_SPEED = 0.08;
const MAX_SPEED = 0.22;

function createParticle(width, height) {
  const angle = Math.random() * Math.PI * 2;
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

export function DesktopWallpaper() {
  const canvasRef = useRef(null);

  useEffect(() => {
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
    let particles = [];
    let isPaused = document.visibilityState === 'hidden';

    const resizeCanvas = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(nextWidth * pixelRatio);
      canvas.height = Math.floor(nextHeight * pixelRatio);
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (particles.length === 0) {
        particles = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(nextWidth, nextHeight),
        );
        return;
      }

      particles = particles.map((particle) => ({
        ...particle,
        x: Math.min(nextWidth, particle.x),
        y: Math.min(nextHeight, particle.y),
      }));
    };

    const render = () => {
      if (isPaused) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = `rgba(255, 255, 255, ${PARTICLE_OPACITY})`;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= PARTICLE_RADIUS || particle.x >= width - PARTICLE_RADIUS) {
          particle.vx *= -1;
          particle.x = Math.min(width - PARTICLE_RADIUS, Math.max(PARTICLE_RADIUS, particle.x));
        }

        if (particle.y <= PARTICLE_RADIUS || particle.y >= height - PARTICLE_RADIUS) {
          particle.vy *= -1;
          particle.y = Math.min(height - PARTICLE_RADIUS, Math.max(PARTICLE_RADIUS, particle.y));
        }

        context.beginPath();
        context.arc(particle.x, particle.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      isPaused = document.visibilityState === 'hidden';
    };

    resizeCanvas();
    render();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="desktop-wallpaper" aria-hidden="true">
      <div className="desktop-gradient-blob" />
      <canvas ref={canvasRef} className="desktop-canvas" />
      <div className="desktop-grid-overlay" />
    </div>
  );
}
