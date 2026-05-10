export const projects = [
  {
    id: 'molgenix',
    name: 'MolGenix',
    category: 'AI/ML',
    note: '2nd Place — Augmentix Hackathon, NMIT Bangalore (36hrs)',
    description:
      'Accepts plain-English disease descriptions and outputs ranked drug candidates with binding scores and 3D molecular visualisations. Cut early-stage screening from weeks of manual work to a single pipeline run. Wired DeepChem GNN models to flag hepatotoxicity, cardiotoxicity, and BBB penetration via a traffic-light scoring system.',
    tags: ['React', 'FastAPI', 'DeepChem', 'RDKit', 'AutoDock Vina', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/aaradhya177',
  },
  {
    id: 'athleos',
    name: 'Eklavya – AthleteOS',
    category: 'Full Stack + AI/ML',
    note: null,
    description:
      'Multi-interface sports intelligence platform with separate FastAPI services, a Next.js dashboard for coaches and federation admins, and a React Native mobile app for athletes — all on a shared PostgreSQL database. Includes a scikit-learn injury risk model with SHAP explanations so coaches can see which metrics drive each prediction.',
    tags: ['FastAPI', 'React Native', 'Next.js', 'PostgreSQL', 'Redis', 'Celery', 'scikit-learn', 'AWS S3'],
    github: 'https://github.com/aaradhya177',
  },
  {
    id: 'payguard',
    name: 'PayGuard',
    category: 'AI/ML',
    note: 'Final Major Project — BIT Bengaluru',
    description:
      'UPI fraud detection system using ensemble ML methods. Combines XGBoost and Isolation Forest with SMOTE for class imbalance. SHAP explainability layer shows which transaction features triggered the fraud flag. Served via FastAPI with real-time prediction endpoints.',
    tags: ['XGBoost', 'Isolation Forest', 'SMOTE', 'SHAP', 'FastAPI'],
    github: 'https://github.com/aaradhya177',
  },
  {
    id: 'dostai',
    name: 'DostAI',
    category: 'AI/ML + Mobile',
    note: null,
    description:
      'AI elderly care companion with behavioral anomaly detection using Isolation Forest, a conversational AI layer via Groq API, and SHAP explainability for caregivers. Built on a React Native + FastAPI + Firebase stack with real-time alerts.',
    tags: ['React Native', 'FastAPI', 'Firebase', 'Groq API', 'SHAP', 'Isolation Forest'],
    github: 'https://github.com/aaradhya177',
  },
  {
    id: 'vitaldrift',
    name: 'VitalDrift',
    category: 'AI/ML',
    note: 'Philips R&D Judged Hackathon',
    description:
      'Real-time ICU patient deterioration prediction system. Monitors live patient vitals and flags early signs of deterioration using a real-time ML pipeline. Built for a hackathon judged by Philips R&D engineers.',
    tags: ['Real-time ML', 'FastAPI', 'ICU Data', 'Python'],
    github: 'https://github.com/aaradhya177',
  },
];
