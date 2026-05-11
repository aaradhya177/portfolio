export const projects = [
  {
    id: 'molgenix',
    name: 'MolGenix',
    category: 'AI/ML',
    note: '2nd Place - Augmentix Hackathon NMIT (36hrs)',
    description:
      'Accepts plain-English disease descriptions and outputs ranked drug candidates with binding scores and 3D molecular visualisations. Cut early-stage screening from weeks of manual work to a single pipeline run. Wired DeepChem GNN models to flag hepatotoxicity, cardiotoxicity, and BBB penetration via a traffic-light scoring system.',
    tags: ['React', 'FastAPI', 'DeepChem', 'RDKit', 'AutoDock Vina', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/aaradhya177',
    caseStudy: {
      problem:
        'Early-stage drug discovery requires weeks of manual screening by domain experts. There was no accessible pipeline for researchers to go from a disease description to ranked drug candidates automatically.',
      approach:
        'Built an end-to-end pipeline that accepts plain-English disease descriptions, uses DeepChem GNN models to score molecular properties, pipes candidates through AutoDock Vina for docking simulation, and outputs ranked results with 3D visualisations.',
      techDecisions:
        'Chose DeepChem over vanilla PyTorch for its built-in molecular graph support. Used AutoDock Vina for docking because it is open-source and battle-tested. FastAPI for serving because async support handles long-running ML jobs cleanly.',
      result:
        'Full pipeline runs in minutes vs weeks of manual work. Generates one-click PDF reports with binding scores, toxicity flags, and 3D molecular views.',
      metrics: [
        '36hr hackathon build',
        '2nd Place at NMIT Bangalore',
        '3 toxicity models integrated',
        'Automated PDF report generation',
      ],
    },
  },
  {
    id: 'athleos',
    name: 'Eklavya - AthleteOS',
    category: 'Full Stack + AI/ML',
    note: null,
    description:
      'Multi-interface sports intelligence platform with separate FastAPI services, a Next.js dashboard for coaches and federation admins, and a React Native mobile app for athletes - all on a shared PostgreSQL database. Includes a scikit-learn injury risk model with SHAP explanations so coaches can see which metrics drive each prediction.',
    tags: ['FastAPI', 'React Native', 'Next.js', 'PostgreSQL', 'Redis', 'Celery', 'scikit-learn', 'AWS S3'],
    github: 'https://github.com/aaradhya177',
    caseStudy: {
      problem:
        'Indian sports federations track athlete data in spreadsheets with no intelligent analysis. Coaches have no early warning system for injuries or performance drops.',
      approach:
        'Designed a multi-interface platform - Next.js dashboard for coaches, React Native app for athletes, shared FastAPI backend. Added a scikit-learn injury risk model with SHAP so coaches understand WHY an athlete is flagged.',
      techDecisions:
        'PostgreSQL over MongoDB for relational athlete-coach-team data. Redis for caching frequent dashboard queries. Celery for async model inference so the API never blocks on ML jobs.',
      result:
        'Coaches get injury risk scores with feature-level explanations. Athletes see their own metrics on mobile. Federation admins get aggregated views.',
      metrics: [
        '5 separate service modules',
        'SHAP explainability on every prediction',
        'React Native + Next.js + FastAPI stack',
        'AWS S3 for media storage',
      ],
    },
  },
  {
    id: 'payguard',
    name: 'PayGuard',
    category: 'AI/ML',
    note: 'Final Major Project - BIT Bengaluru',
    description:
      'UPI fraud detection system using ensemble ML methods. Combines XGBoost and Isolation Forest with SMOTE for class imbalance. SHAP explainability layer shows which transaction features triggered the fraud flag. Served via FastAPI with real-time prediction endpoints.',
    tags: ['XGBoost', 'Isolation Forest', 'SMOTE', 'SHAP', 'FastAPI'],
    github: 'https://github.com/aaradhya177',
    caseStudy: {
      problem:
        'UPI fraud detection at scale requires handling severely imbalanced datasets where fraud cases are under 1% of transactions. Most models fail on this imbalance.',
      approach:
        'Combined XGBoost for classification with Isolation Forest for anomaly detection. Applied SMOTE to handle class imbalance. Added SHAP explainability so every fraud flag comes with a reason.',
      techDecisions:
        'XGBoost over neural networks - better performance on tabular transaction data with far less training data needed. SMOTE over undersampling to preserve information. FastAPI for real-time inference endpoint.',
      result:
        'Strong F1 score on imbalanced dataset. Every prediction comes with a SHAP explanation showing which transaction features triggered the flag.',
      metrics: [
        'XGBoost + Isolation Forest ensemble',
        'SMOTE for class imbalance',
        'SHAP explainability on every flag',
        'Real-time FastAPI inference',
      ],
    },
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
    caseStudy: {
      problem:
        'Elderly people living alone are at risk of behavioral changes that signal health decline. Caregivers and family cannot monitor 24/7 and often miss early warning signs.',
      approach:
        'Built a companion app that uses Isolation Forest to detect anomalies in daily behavioral patterns (activity times, app usage, communication frequency). Groq API powers the conversational layer. SHAP explains anomaly flags to caregivers.',
      techDecisions:
        'React Native for cross-platform mobile. Firebase for real-time data sync between elder device and caregiver dashboard. Groq API over OpenAI for lower latency on conversational responses. Isolation Forest for unsupervised anomaly detection - no labeled data needed.',
      result:
        'Caregivers receive explainable alerts when behavioral patterns deviate. Elder gets a friendly AI companion that also monitors their health passively.',
      metrics: [
        'Isolation Forest anomaly detection',
        'Groq API conversational AI',
        'SHAP explainability for caregivers',
        'React Native + Firebase real-time sync',
      ],
    },
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
    caseStudy: {
      problem:
        'ICU patients can deteriorate rapidly. Nurses monitor many patients simultaneously and early warning signs are often missed until it is too late.',
      approach:
        'Built a real-time prediction pipeline that continuously monitors incoming patient vitals and generates deterioration risk scores. Designed for a Philips R&D judged hackathon environment.',
      techDecisions:
        'FastAPI for the real-time inference endpoint. Focused on low latency - predictions must arrive in under 200ms to be clinically useful. Designed the system to be model-agnostic so different ML models can be swapped in.',
      result:
        'Real-time deterioration risk scores from live vitals stream. System designed to integrate with existing ICU monitoring hardware.',
      metrics: [
        'Real-time ML inference pipeline',
        'Sub-200ms prediction target',
        'Philips R&D judged hackathon',
        'Model-agnostic architecture',
      ],
    },
  },
];
