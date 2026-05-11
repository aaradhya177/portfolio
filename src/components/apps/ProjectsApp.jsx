import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { projects } from '../../data/projects';

const caseStudySections = [
  { key: 'problem', label: 'THE PROBLEM', className: 'is-problem' },
  { key: 'approach', label: 'THE APPROACH', className: 'is-approach' },
  { key: 'techDecisions', label: 'TECH DECISIONS', className: 'is-tech-decisions' },
  { key: 'result', label: 'THE RESULT', className: 'is-result' },
];

function openGithub(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export const ProjectsApp = memo(function ProjectsApp() {
  const [mode, setMode] = useState('list');
  const [selected, setSelected] = useState(projects[0]);
  const [caseStudyProject, setCaseStudyProject] = useState(null);

  const handleReadCaseStudy = () => {
    setCaseStudyProject(selected);
    setMode('casestudy');
  };

  const handleBackToProjects = () => {
    setMode('list');
    setCaseStudyProject(null);
  };

  const activeCaseStudyProject = caseStudyProject ?? selected;

  return (
    <motion.div
      className={`projects-app${mode === 'casestudy' ? ' is-case-study' : ''}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.12, ease: 'easeOut' }}
    >
      <AnimatePresence mode="wait">
        {mode === 'list' ? (
          <motion.div
            key="list"
            className="projects-mode-shell projects-mode-shell-list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <aside
              className="projects-sidebar"
              style={{
                overflowY: 'auto',
                height: '100%',
              }}
            >
              <div className="projects-sidebar-heading">PROJECTS</div>

              <div className="projects-sidebar-list app-scroll">
                {projects.map((project) => {
                  const isSelected = selected.id === project.id;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      className={`projects-sidebar-item${isSelected ? ' is-active' : ''}`}
                      onClick={() => setSelected(project)}
                    >
                      {project.name}
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="projects-detail-panel">
              <div
                className="projects-detail-scroll app-scroll"
                style={{
                  overflowY: 'auto',
                  height: '100%',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected.id}
                    className="projects-detail-pane"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{
                      opacity: { duration: 0.15 },
                      x: { duration: 0.15, ease: 'easeOut' },
                    }}
                  >
                    <div className="projects-detail-header">
                      <h2 className="projects-detail-title">{selected.name}</h2>
                    </div>

                    <div className="projects-detail-badges">
                      <span className="projects-category-badge">{selected.category}</span>
                      {selected.note ? <span className="projects-note-badge">{selected.note}</span> : null}
                    </div>

                    <div className="projects-copy-block">
                      <div className="projects-section-label">Description</div>
                      <p className="projects-detail-description">{selected.description}</p>
                    </div>

                    <div className="projects-copy-block">
                      <div className="projects-section-label">Tech Stack</div>
                      <div className="projects-tech-tags">
                        {selected.tags.map((tag) => (
                          <span key={tag} className="projects-tech-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="projects-detail-actions">
                      {selected.github ? (
                        <button
                          type="button"
                          className="projects-github-button"
                          onClick={() => openGithub(selected.github)}
                        >
                          View on GitHub {'\u2192'}
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className="projects-case-study-button"
                        onClick={handleReadCaseStudy}
                      >
                        Read Case Study {'\u2192'}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.section
            key="casestudy"
            className="projects-case-study-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="projects-case-study-topbar">
              <button
                type="button"
                className="projects-back-button"
                onClick={handleBackToProjects}
              >
                {'\u2190'} Back to Projects
              </button>
            </div>

            <div className="projects-case-study-scroll app-scroll">
              <div className="projects-case-study-header">
                <div className="projects-case-study-header-copy">
                  <h2 className="projects-detail-title">{activeCaseStudyProject.name}</h2>
                  <div className="projects-detail-badges">
                    <span className="projects-category-badge">{activeCaseStudyProject.category}</span>
                    {activeCaseStudyProject.note ? (
                      <span className="projects-note-badge">{activeCaseStudyProject.note}</span>
                    ) : null}
                  </div>
                </div>

                {activeCaseStudyProject.github ? (
                  <button
                    type="button"
                    className="projects-github-button"
                    onClick={() => openGithub(activeCaseStudyProject.github)}
                  >
                    View on GitHub {'\u2192'}
                  </button>
                ) : null}
              </div>

              <div className="projects-case-study-content">
                {caseStudySections.map((section, index) => (
                  <motion.section
                    key={section.key}
                    className={`projects-case-study-section ${section.className}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: 0.1 * (index + 1), ease: 'easeOut' }}
                  >
                    <div className="projects-case-study-label">{section.label}</div>
                    <p className="projects-case-study-body">
                      {activeCaseStudyProject.caseStudy[section.key]}
                    </p>
                  </motion.section>
                ))}

                <motion.section
                  className="projects-case-study-metrics-block"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: 0.5, ease: 'easeOut' }}
                >
                  <div className="projects-case-study-label">BY THE NUMBERS</div>
                  <div className="projects-case-study-metrics-grid">
                    {activeCaseStudyProject.caseStudy.metrics.map((metric) => (
                      <div key={metric} className="projects-case-study-metric-card">
                        <span className="projects-case-study-metric-dot" aria-hidden="true" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
