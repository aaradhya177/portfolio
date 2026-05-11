import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { achievements } from '../data/achievements';
import { MobileMusicPlayer } from './MobileMusicPlayer';
import { projects } from '../data/projects';
import { profile } from '../data/profile';
import { skillCategories } from '../data/skills';

const MOBILE_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: EmailIcon,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aaradhyamehra-builds/',
    icon: LinkedInIcon,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/aaradhya177',
    icon: GitHubIcon,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    href: 'https://x.com/4aradhya_17',
    icon: TwitterIcon,
  },
  {
    id: 'codeforces',
    label: 'Codeforces',
    href: 'https://codeforces.com/profile/YoullNeverCodeAlone17',
    icon: CodeforcesIcon,
  },
];

const SKILL_TONE_CLASS = {
  'AI/ML': 'is-cyan',
  Web: 'is-violet',
  Languages: 'is-amber',
  Databases: 'is-emerald',
  DevOps: 'is-rose',
};

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7.5h16v9H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m4.6 8.2 7.4 5.7 7.4-5.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7.2 9.6V18M7.2 6.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM11 9.6V18m0-4.8c0-1.9 1.1-3.6 3.3-3.6 1.9 0 2.9 1.3 2.9 3.6V18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 18.4c-4 .9-4-2.3-5.6-2.7m11.2 5.4v-2.3a3.2 3.2 0 0 0-.9-2.5c3-.4 6.2-1.5 6.2-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.5s-1.1-.4-3.7 1.4a12.6 12.6 0 0 0-6.8 0c-2.6-1.8-3.7-1.4-3.7-1.4a4.8 4.8 0 0 0-.1 3.5A5.2 5.2 0 0 0 4.2 9.7c0 5.1 3.2 6.2 6.2 6.6a3.2 3.2 0 0 0-.9 2.5v2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5h3.6l3.1 4.4L15.5 5H19l-5.7 6.5L19.5 19H16l-3.5-4.9L8.3 19H4.8l5.9-6.7z"
        fill="currentColor"
      />
    </svg>
  );
}

function CodeforcesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="11" width="3" height="7" rx="1.2" fill="currentColor" />
      <rect x="10.5" y="7" width="3" height="11" rx="1.2" fill="currentColor" />
      <rect x="17" y="4" width="3" height="14" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function openLink(href) {
  window.open(href, '_blank', 'noopener,noreferrer');
}

function handleProfileImageError(event) {
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
  fallback.style.fontSize = '28px';
  fallback.style.fontWeight = '700';
  fallback.style.color = 'white';

  parent.appendChild(fallback);
}

export const MobilePortfolio = memo(function MobilePortfolio() {
  const scrollRootRef = useRef(null);
  const heroCanvasRef = useRef(null);
  const sectionRefs = useRef({});
  const sectionRatiosRef = useRef({});
  const [visibleSections, setVisibleSections] = useState({ hero: true });
  const [activeSection, setActiveSection] = useState(MOBILE_SECTIONS[0].id);

  const aboutCopy = useMemo(
    () =>
      'I build AI systems and full-stack products that solve real problems. 3rd year at BIT Bengaluru. Shipping end-to-end systems, winning hackathons, actively looking for AI/ML and SWE internships.',
    [],
  );

  useEffect(() => {
    const canvas = heroCanvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return undefined;
    }

    let animationFrameId = 0;
    let particles = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? window.innerWidth;
      const height = parent?.clientHeight ?? window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 1.8,
        alpha: 0.12 + Math.random() * 0.22,
        velocityX: -0.12 + Math.random() * 0.24,
        velocityY: -0.12 + Math.random() * 0.24,
      }));
    };

    const renderFrame = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        if (particle.x < -8) {
          particle.x = width + 8;
        } else if (particle.x > width + 8) {
          particle.x = -8;
        }

        if (particle.y < -8) {
          particle.y = height + 8;
        } else if (particle.y > height + 8) {
          particle.y = -8;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(0, 245, 255, ${particle.alpha})`;
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    resizeCanvas();
    renderFrame();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const root = scrollRootRef.current;
    const sections = Object.entries(sectionRefs.current);

    if (!root || sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let nextActiveSection = null;
        let nextActiveRatio = 0;

        setVisibleSections((currentSections) => {
          let changed = false;
          const nextSections = { ...currentSections };

          entries.forEach((entry) => {
            const sectionId = entry.target.dataset.sectionId;

            sectionRatiosRef.current[sectionId] = entry.isIntersecting ? entry.intersectionRatio : 0;

            if (entry.isIntersecting && !nextSections[sectionId]) {
              nextSections[sectionId] = true;
              changed = true;
            }
          });

          return changed ? nextSections : currentSections;
        });

        Object.entries(sectionRatiosRef.current).forEach(([sectionId, ratio]) => {
          if (ratio > nextActiveRatio) {
            nextActiveRatio = ratio;
            nextActiveSection = sectionId;
          }
        });

        if (nextActiveSection) {
          setActiveSection(nextActiveSection);
        }
      },
      {
        root,
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '-10% 0px -10% 0px',
      },
    );

    sections.forEach(([, element]) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setSectionRef = (sectionId) => (element) => {
    if (element) {
      sectionRefs.current[sectionId] = element;
      return;
    }

    delete sectionRefs.current[sectionId];
    delete sectionRatiosRef.current[sectionId];
  };

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main ref={scrollRootRef} className="mobile-portfolio">
      <nav className="mobile-portfolio-dots" aria-label="Section navigation">
        {MOBILE_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`mobile-portfolio-dot${activeSection === section.id ? ' is-active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Go to ${section.label}`}
          />
        ))}
      </nav>

      <MobileMusicPlayer />

      <section
        ref={setSectionRef('hero')}
        data-section-id="hero"
        className={`mobile-portfolio-section mobile-portfolio-hero${
          visibleSections.hero ? ' is-visible' : ''
        }`}
      >
        <canvas ref={heroCanvasRef} className="mobile-portfolio-hero-canvas" aria-hidden="true" />

        <div className="mobile-portfolio-hero-content">
          <div className="mobile-portfolio-avatar-shell">
            <div className="mobile-portfolio-avatar">
              <img
                className="mobile-portfolio-avatar-image"
                src="/Aaradhya_linkedin.jpeg"
                alt="Aaradhya Mehra"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '58% 18%',
                }}
                onError={handleProfileImageError}
              />
            </div>
          </div>

          <h1 className="mobile-portfolio-name">{profile.name}</h1>

          <div className="mobile-portfolio-role-badge">AI/ML Engineer &amp; Full Stack Dev</div>

          <div className="mobile-portfolio-availability">
            <span className="mobile-portfolio-availability-dot" aria-hidden="true" />
            <span>Open to Internships {'\u2022'} July 2025</span>
          </div>

          <div className="mobile-portfolio-meta">BIT Bengaluru {'\u2022'} CGPA 8.5 {'\u2022'} Graduating June 2027</div>

          <div className="mobile-portfolio-socials">
            {SOCIAL_LINKS.map((linkItem) => {
              const Icon = linkItem.icon;

              return (
                <button
                  key={linkItem.id}
                  type="button"
                  className="mobile-portfolio-social-button"
                  onClick={() => openLink(linkItem.href)}
                  aria-label={linkItem.label}
                >
                  <Icon />
                </button>
              );
            })}
          </div>

          <div className="mobile-portfolio-scroll-hint">Scroll to explore {'\u2193'}</div>
        </div>
      </section>

      <section
        ref={setSectionRef('about')}
        data-section-id="about"
        className={`mobile-portfolio-section mobile-portfolio-content-section${
          visibleSections.about ? ' is-visible' : ''
        }`}
      >
        <div className="mobile-portfolio-section-label">About</div>
        <h2 className="mobile-portfolio-section-heading">Who I Am</h2>
        <div className="mobile-portfolio-about-card">
          <p>{aboutCopy}</p>
        </div>
      </section>

      <section
        ref={setSectionRef('projects')}
        data-section-id="projects"
        className={`mobile-portfolio-section mobile-portfolio-content-section${
          visibleSections.projects ? ' is-visible' : ''
        }`}
      >
        <div className="mobile-portfolio-section-label">Projects</div>
        <h2 className="mobile-portfolio-section-heading">What I&apos;ve Built</h2>
        <div className="mobile-portfolio-project-list">
          {projects.map((project) => (
            <article key={project.id} className="mobile-portfolio-project-card">
              <div className="mobile-portfolio-project-header">
                <h3 className="mobile-portfolio-project-name">{project.name}</h3>
                <span className="mobile-portfolio-project-category">{project.category}</span>
              </div>

              {project.note ? <div className="mobile-portfolio-project-note">{project.note}</div> : null}

              <p className="mobile-portfolio-project-description">{project.description}</p>

              <div className="mobile-portfolio-project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="mobile-portfolio-project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {project.github ? (
                <button
                  type="button"
                  className="mobile-portfolio-project-button"
                  onClick={() => openLink(project.github)}
                >
                  View on GitHub {'\u2192'}
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section
        ref={setSectionRef('skills')}
        data-section-id="skills"
        className={`mobile-portfolio-section mobile-portfolio-content-section${
          visibleSections.skills ? ' is-visible' : ''
        }`}
      >
        <div className="mobile-portfolio-section-label">Skills</div>
        <h2 className="mobile-portfolio-section-heading">Tech Stack</h2>
        <div className="mobile-portfolio-skill-list">
          {skillCategories.map((category) => (
            <article key={category.id} className="mobile-portfolio-skill-card">
              <div className={`mobile-portfolio-skill-title ${SKILL_TONE_CLASS[category.label] ?? ''}`}>
                {category.label}
              </div>
              <div className="mobile-portfolio-skill-tags">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`mobile-portfolio-skill-tag ${SKILL_TONE_CLASS[category.label] ?? ''}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={setSectionRef('achievements')}
        data-section-id="achievements"
        className={`mobile-portfolio-section mobile-portfolio-content-section${
          visibleSections.achievements ? ' is-visible' : ''
        }`}
      >
        <div className="mobile-portfolio-section-label">Achievements</div>
        <h2 className="mobile-portfolio-section-heading">Wins</h2>
        <div className="mobile-portfolio-achievement-list">
          {achievements.map((achievement) => (
            <article key={achievement.id} className="mobile-portfolio-achievement-card">
              <div className="mobile-portfolio-achievement-title-row">
                <span className="mobile-portfolio-achievement-icon" aria-hidden="true">
                  {achievement.icon}
                </span>
                <h3 className="mobile-portfolio-achievement-title">{achievement.title}</h3>
              </div>
              <p className="mobile-portfolio-achievement-description">{achievement.description}</p>
              <span className="mobile-portfolio-achievement-tag">{achievement.tag}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={setSectionRef('contact')}
        data-section-id="contact"
        className={`mobile-portfolio-section mobile-portfolio-contact-section${
          visibleSections.contact ? ' is-visible' : ''
        }`}
      >
        <h2 className="mobile-portfolio-contact-heading">Let&apos;s Talk</h2>
        <p className="mobile-portfolio-contact-copy">Looking for an AI/ML or SWE intern?</p>

        <button
          type="button"
          className="mobile-portfolio-contact-button"
          onClick={() => openLink(`mailto:${profile.email}`)}
        >
          {'\u{1F4EC}'} {profile.email}
        </button>

        <div className="mobile-portfolio-contact-socials">
          {SOCIAL_LINKS.filter((linkItem) => linkItem.id !== 'email').map((linkItem) => {
            const Icon = linkItem.icon;

            return (
              <button
                key={linkItem.id}
                type="button"
                className="mobile-portfolio-social-button"
                onClick={() => openLink(linkItem.href)}
                aria-label={linkItem.label}
              >
                <Icon />
              </button>
            );
          })}
        </div>

        <div className="mobile-portfolio-footer-copy">Built with React {'\u2022'} AaradhyaOS v1.0</div>
      </section>
    </main>
  );
});
