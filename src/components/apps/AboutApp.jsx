import { memo } from 'react';
import { aboutNote } from '../../data/about';

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
