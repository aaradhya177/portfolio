import { memo, useEffect, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import { skillCategories, skillRadarData } from '../../data/skills';

function SkillsAppComponent() {
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setBarsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="skills-app">
      <div className="skills-app-header">
        <h2 className="skills-app-title">Skills Overview</h2>
      </div>

      <div className="skills-app-grid">
        <section className="skills-chart-panel">
          <div className="skills-chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadarData} outerRadius="72%">
                <PolarGrid stroke="rgba(0, 245, 255, 0.16)" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{
                    fill: '#f8fbff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 13,
                  }}
                />
                <Radar
                  dataKey="score"
                  fill="rgba(0, 245, 255, 0.3)"
                  stroke="#00F5FF"
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="skills-bars-panel">
          {skillCategories.map((category) => (
            <div key={category.id} className="skills-category-block">
              <div className="skills-category-label">{category.label}</div>

              <div className="skills-bar-list">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skills-bar-row">
                    <div className="skills-bar-copy">
                      <span className="skills-bar-name">{skill.name}</span>
                      <span className="skills-bar-value">{skill.value}</span>
                    </div>

                    <div className="skills-bar-track">
                      <div
                        className={`skills-bar-fill ${category.colorClass}${barsVisible ? ' is-visible' : ''}`}
                        style={{
                          width: `${barsVisible ? skill.value : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export const SkillsApp = memo(SkillsAppComponent);
