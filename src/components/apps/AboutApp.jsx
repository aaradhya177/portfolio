import { memo } from 'react';
import { aboutNote } from '../../data/about';

function handleProfileImageError(event, size) {
  const image = event.currentTarget;
  image.style.display = 'none';

  const parent = image.parentElement;

  if (!parent || parent.dataset.fallbackApplied === 'true') {
    return;
  }

  parent.dataset.fallbackApplied = 'true';
  parent.style.position = 'relative';
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

export const AboutApp = memo(function AboutApp() {
  return (
    <div
      className="about-app"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div className="about-app-shell">
      <aside
        className="about-sidebar app-scroll"
        style={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <div className="about-sidebar-heading">Notes</div>

        <button type="button" className="about-note-item is-active">
          {aboutNote.title}
        </button>
      </aside>

      <section
        className="about-note-panel app-scroll"
        style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '20px 24px',
            borderBottom: '1px solid #2a2a3a',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(0,245,255,0.3)',
              boxShadow: '0 0 16px rgba(0,245,255,0.15)',
              flexShrink: 0,
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
              onError={(event) => handleProfileImageError(event, '20px')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '17px',
                fontWeight: 700,
                color: '#e2e8f0',
              }}
            >
              Aaradhya Mehra
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: '#00F5FF',
              }}
            >
              AI/ML Engineer & Full Stack Dev
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: '#64748b',
              }}
            >
              BIT Bengaluru • CGPA 8.5 • 2023–2027
            </span>
          </div>
        </div>

        <header className="about-note-header">
          <h2 className="about-note-title">{aboutNote.title}</h2>
          <div className="about-note-modified">{aboutNote.modified}</div>
        </header>

        <div className="about-note-divider" />

        <div
          className="about-note-body"
          style={{
            whiteSpace: 'pre-line',
            lineHeight: 1.9,
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {aboutNote.lines.map((line, index) => (
            <div key={`${index}-${line || 'blank'}`} className="about-note-line">
              {line || '\u00A0'}
              {index === aboutNote.lines.length - 1 ? (
                <span className="about-note-cursor" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
});
