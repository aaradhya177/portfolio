import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { projects } from '../../data/projects';

export const ProjectsApp = memo(function ProjectsApp() {
  const [selected, setSelected] = useState(projects[0]);

  return (
    <motion.div
      className="projects-app"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.12, ease: 'easeOut' }}
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

              {selected.github ? (
                <button
                  type="button"
                  className="projects-github-button"
                  onClick={() => window.open(selected.github, '_blank', 'noopener,noreferrer')}
                >
                  View on GitHub →
                </button>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
});
