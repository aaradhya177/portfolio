export const skillRadarData = [
  { category: 'AI/ML', score: 88 },
  { category: 'Web Dev', score: 85 },
  { category: 'Languages', score: 82 },
  { category: 'Databases', score: 78 },
  { category: 'DevOps', score: 72 },
];

export const skillCategories = [
  {
    id: 'ai-ml',
    label: 'AI/ML',
    colorClass: 'is-cyan',
    skills: [
      { name: 'XGBoost', value: 90 },
      { name: 'SHAP', value: 88 },
      { name: 'scikit-learn', value: 85 },
      { name: 'TensorFlow Lite', value: 78 },
      { name: 'Federated Learning', value: 72 },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    colorClass: 'is-violet',
    skills: [
      { name: 'React', value: 88 },
      { name: 'FastAPI', value: 90 },
      { name: 'Next.js', value: 82 },
      { name: 'Node.js', value: 78 },
      { name: 'TailwindCSS', value: 85 },
    ],
  },
  {
    id: 'languages',
    label: 'Languages',
    colorClass: 'is-amber',
    skills: [
      { name: 'Python', value: 92 },
      { name: 'JavaScript', value: 85 },
      { name: 'Java', value: 80 },
      { name: 'C++', value: 75 },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    colorClass: 'is-emerald',
    skills: [
      { name: 'PostgreSQL', value: 85 },
      { name: 'Firebase', value: 80 },
      { name: 'MongoDB', value: 78 },
      { name: 'Redis', value: 72 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    colorClass: 'is-rose',
    skills: [
      { name: 'Docker', value: 80 },
      { name: 'GitHub Actions', value: 78 },
      { name: 'AWS S3', value: 72 },
      { name: 'Linux', value: 82 },
    ],
  },
];
