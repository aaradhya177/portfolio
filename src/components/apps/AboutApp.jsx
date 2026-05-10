import { memo } from 'react';
import { aboutNote } from '../../data/about';

export const AboutApp = memo(function AboutApp() {
  return (
    <div className="about-app">
      <aside className="about-sidebar">
        <div className="about-sidebar-heading">Notes</div>

        <button type="button" className="about-note-item is-active">
          {aboutNote.title}
        </button>
      </aside>

      <section className="about-note-panel">
        <header className="about-note-header">
          <h2 className="about-note-title">{aboutNote.title}</h2>
          <div className="about-note-modified">{aboutNote.modified}</div>
        </header>

        <div className="about-note-divider" />

        <div className="about-note-body">
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
  );
});
