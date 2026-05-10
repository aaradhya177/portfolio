import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 120;
const PARTICLE_RADIUS = 1;
const PARTICLE_OPACITY = 0.4;
const PARTICLE_SPEEDS = [
  { min: 0.08, max: 0.22 },
  { min: 0.03, max: 0.11 },
];
const MATRIX_CHARS = '01$#@%&*+-<>/[]{}';
const MATRIX_FONT_SIZE = 16;

function createParticle(width, height, speedRange) {
  const angle = Math.random() * Math.PI * 2;
  const speed = speedRange.min + Math.random() * (speedRange.max - speedRange.min);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

export function DesktopWallpaper({ wallpaperStyle = 0 }) {
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
    let matrixDrops = [];
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

      if (wallpaperStyle === 2) {
        const columns = Math.ceil(nextWidth / MATRIX_FONT_SIZE);
        matrixDrops = Array.from({ length: columns }, () => Math.random() * nextHeight);
        return;
      }

      const speedRange = PARTICLE_SPEEDS[wallpaperStyle] ?? PARTICLE_SPEEDS[0];

      if (particles.length === 0 || particles.length !== PARTICLE_COUNT) {
        particles = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(nextWidth, nextHeight, speedRange),
        );
        return;
      }

      particles = particles.map((particle) => ({
        ...particle,
        x: Math.min(nextWidth, particle.x),
        y: Math.min(nextHeight, particle.y),
      }));
    };

    const renderParticles = (styleIndex) => {
      const isViolet = styleIndex === 1;
      const speedRange = PARTICLE_SPEEDS[styleIndex] ?? PARTICLE_SPEEDS[0];

      if (particles.length !== PARTICLE_COUNT) {
        particles = Array.from({ length: PARTICLE_COUNT }, () =>
          createParticle(width, height, speedRange),
        );
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = isViolet
        ? `rgba(214, 190, 255, ${PARTICLE_OPACITY})`
        : `rgba(255, 255, 255, ${PARTICLE_OPACITY})`;

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
    };

    const renderMatrix = () => {
      context.fillStyle = 'rgba(4, 8, 4, 0.18)';
      context.fillRect(0, 0, width, height);
      context.fillStyle = 'rgba(93, 255, 121, 0.78)';
      context.font = `${MATRIX_FONT_SIZE}px "JetBrains Mono", monospace`;

      matrixDrops.forEach((drop, columnIndex) => {
        const character = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = columnIndex * MATRIX_FONT_SIZE;
        const y = drop * MATRIX_FONT_SIZE;

        context.fillText(character, x, y);

        if (y > height && Math.random() > 0.975) {
          matrixDrops[columnIndex] = 0;
          return;
        }

        matrixDrops[columnIndex] += 1;
      });
    };

    const render = () => {
      if (isPaused) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      if (wallpaperStyle === 2) {
        renderMatrix();
      } else {
        renderParticles(wallpaperStyle);
      }

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
  }, [wallpaperStyle]);

  return (
    <div
      className={`desktop-wallpaper desktop-wallpaper-style-${wallpaperStyle + 1}`}
      aria-hidden="true"
    >
      {wallpaperStyle !== 2 ? <div className="desktop-gradient-blob" /> : null}
      <canvas ref={canvasRef} className="desktop-canvas" />
      <div className="desktop-grid-overlay" />
    </div>
  );
}
