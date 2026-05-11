import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const PASSWORD_DOT_COUNT = 6;
const PARTICLE_COUNT = 80;
const ROLE_LABEL = 'AI/ML Engineer & Full Stack Dev';
const SOCIAL_LINKS = [
  { id: 'github', label: 'GH', href: 'https://github.com/aaradhya177' },
  { id: 'linkedin', label: 'in', href: 'https://www.linkedin.com/in/aaradhyamehra-builds/' },
  { id: 'twitter', label: 'X', href: 'https://x.com/4aradhya_17' },
  { id: 'codeforces', label: 'CF', href: 'https://codeforces.com/profile/YoullNeverCodeAlone17' },
];

function getGreeting(hours) {
  if (hours < 12) {
    return 'Good Morning,';
  }

  if (hours < 18) {
    return 'Good Afternoon,';
  }

  return 'Good Evening,';
}

function formatLoginClock() {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  }).format(new Date());
}

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.08 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 0.08,
  };
}

function handleProfileImageError(event, size) {
  const image = event.currentTarget;
  image.style.display = 'none';

  const parent = image.parentElement;

  if (!parent || parent.dataset.fallbackApplied === 'true') {
    return;
  }

  parent.dataset.fallbackApplied = 'true';
  parent.style.background = 'linear-gradient(135deg, #00F5FF, #7C3AED)';

  const fallback = document.createElement('span');
  fallback.textContent = 'AM';
  fallback.style.position = 'absolute';
  fallback.style.top = '50%';
  fallback.style.left = '50%';
  fallback.style.transform = 'translate(-50%, -50%)';
  fallback.style.fontFamily = 'Syne, sans-serif';
  fallback.style.fontSize = size;
  fallback.style.fontWeight = '700';
  fallback.style.color = 'white';

  parent.appendChild(fallback);
}

export function LoginScreen({ isExiting, onLogin }) {
  const canvasRef = useRef(null);
  const [filledDots, setFilledDots] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [clock, setClock] = useState(() => formatLoginClock());
  const greeting = useMemo(() => getGreeting(new Date().getHours()), [clock]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setShowTip(false);
        onLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLogin]);

  useEffect(() => {
    let animationFrameId = 0;
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (particles.length === 0) {
        particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));
      }
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(255, 255, 255, 0.3)';

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < 0) {
          particle.y = height + Math.random() * 24;
          particle.x = Math.random() * width;
        }

        if (particle.x < 0) {
          particle.x = width;
        }

        if (particle.x > width) {
          particle.x = 0;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        context.fill();
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
  }, []);

  useEffect(() => {
    const dotIntervalId = window.setInterval(() => {
      setFilledDots((currentDots) => {
        if (currentDots >= PASSWORD_DOT_COUNT) {
          window.clearInterval(dotIntervalId);
          return currentDots;
        }

        return currentDots + 1;
      });
    }, 150);

    const clockIntervalId = window.setInterval(() => {
      setClock(formatLoginClock());
    }, 1000);

    const tipTimeoutId = window.setTimeout(() => {
      setShowTip(true);
    }, 4000);

    return () => {
      window.clearInterval(dotIntervalId);
      window.clearInterval(clockIntervalId);
      window.clearTimeout(tipTimeoutId);
    };
  }, []);

  const handleLogin = () => {
    setShowTip(false);
    onLogin();
  };

  return (
    <section className={`login-screen${isExiting ? ' is-exiting' : ''}`} aria-label="Login screen">
      <div className="login-aurora-layer login-aurora-cyan" aria-hidden="true" />
      <div className="login-aurora-layer login-aurora-violet" aria-hidden="true" />
      <div className="login-aurora-layer login-aurora-teal" aria-hidden="true" />
      <canvas ref={canvasRef} className="login-particle-canvas" aria-hidden="true" />
      <div className="login-grid-overlay" aria-hidden="true" />

      <div className="login-status login-status-left">AaradhyaOS v1.0</div>
      <div className="login-status login-status-right">{clock} - IST</div>

      <div className="login-center-stack">
        <motion.div
          className={`login-card login-card-redesigned${isExiting ? ' is-exiting' : ''}`}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(0,245,255,0.4)',
              boxShadow: '0 0 24px rgba(0,245,255,0.25), 0 0 48px rgba(0,245,255,0.1)',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <img
              src="/Aaradhya_linkedin.jpeg"
              alt="Aaradhya Mehra"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
              onError={(event) => handleProfileImageError(event, '28px')}
            />
          </div>

          <div className="login-greeting">{greeting}</div>
          <div className="login-name">Aaradhya Mehra</div>
          <div className="login-role-badge">{ROLE_LABEL}</div>

          <div className="login-divider" aria-hidden="true" />

          <div className="password-dots password-dots-redesigned" aria-hidden="true">
            {Array.from({ length: PASSWORD_DOT_COUNT }).map((_, index) => (
              <span
                key={index}
                className={`password-dot password-dot-redesigned${index < filledDots ? ' is-filled' : ''}${
                  filledDots >= PASSWORD_DOT_COUNT ? ' is-pulsing' : ''
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            className="login-enter-button"
            onClick={handleLogin}
            aria-label="Enter portfolio"
          >
            <span>Enter Portfolio →</span>
          </button>

          <div className="login-hint">or press Enter</div>

          <div className="login-social-links">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="login-social-link"
                aria-label={link.id}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        {showTip ? <div className="login-tip">💡 Tip: Press Enter to skip</div> : null}
      </div>
    </section>
  );
}
