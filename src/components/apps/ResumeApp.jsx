import { memo } from 'react';
import { achievements } from '../../data/achievements';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { downloadResume } from '../../utils/downloadResume';

export const ResumeApp = memo(function ResumeApp() {
  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <div className="resume-toolbar-file">
          <span className="resume-toolbar-icon" aria-hidden="true">
            {'\u{1F4C4}'}
          </span>
          <span>Aaradhya_Mehra_Resume.pdf</span>
        </div>

        <button type="button" className="resume-download-button" onClick={downloadResume}>
          Download
        </button>
      </div>

      <div className="resume-document-scroll">
        <div className="resume-document">
          <header className="resume-header">
            <h1 className="resume-name">{profile.name}</h1>
            <div className="resume-contact-line">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>|</span>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span>|</span>
              <a href={profile.codeforcesUrl} target="_blank" rel="noreferrer">
                Codeforces
              </a>
              <span>|</span>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </div>
          </header>

          <section className="resume-section">
            <h2>Summary</h2>
            <p>{profile.summary}</p>
          </section>

          <section className="resume-section">
            <h2>Education</h2>
            <p>BIT Bengaluru | B.Tech CSE | CGPA 8.5/10 | Sept 2023 – June 2027</p>
          </section>

          <section className="resume-section">
            <h2>Skills</h2>
            {Object.entries(profile.skills).map(([group, items]) => (
              <p key={group}>
                <strong>{group}:</strong> {items.join(', ')}
              </p>
            ))}
          </section>

          <section className="resume-section">
            <h2>Projects</h2>
            <p>{projects.map((projectItem) => projectItem.name).join(', ')}</p>
          </section>

          <section className="resume-section">
            <h2>Achievements</h2>
            <p>{achievements.map((achievement) => achievement.title).join(', ')}</p>
          </section>
        </div>
      </div>
    </div>
  );
});
