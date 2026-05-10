import { memo } from 'react';
import { motion } from 'framer-motion';
import { achievements } from '../../data/achievements';

export const AchievementsApp = memo(function AchievementsApp() {
  return (
    <div className="achievements-app">
      <header className="achievements-header">
        <h2 className="achievements-title">Achievements</h2>
      </header>

      <div
        className="achievements-list app-scroll"
        style={{
          overflowY: 'auto',
          height: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {achievements.map((achievement, index) => (
          <motion.article
            key={achievement.id}
            className="achievement-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.26,
              ease: 'easeOut',
              delay: index * 0.1,
            }}
          >
            <div className="achievement-icon">{achievement.icon}</div>

            <div className="achievement-copy">
              <h3 className="achievement-card-title">{achievement.title}</h3>
              <p className="achievement-card-description">{achievement.description}</p>
              <div className="achievement-card-tag">{achievement.tag}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
});
