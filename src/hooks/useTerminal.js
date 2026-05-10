import { useEffect } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from 'xterm';
import { achievements } from '../data/achievements';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

const PROMPT = 'aaradhya@AaradhyaOS:~$ ';
const WELCOME_MESSAGE = [
  '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
  "\u2551     Welcome to AaradhyaOS v1.0      \u2551",
  "\u2551     Type 'help' to get started      \u2551",
  '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D',
];

function formatColumns(rows) {
  const width = Math.max(...rows.map(([key]) => key.length));
  return rows.map(([key, value]) => `${key.padEnd(width, ' ')}  ${value}`).join('\r\n');
}

function buildCommandMap(onDownloadResume) {
  return {
    help: (term) => {
      term.writeln('Available commands');
      term.writeln('------------------');
      term.writeln(
        formatColumns([
          ['help', 'Print this help table'],
          ['whoami', 'Show profile summary'],
          ['skills', 'List grouped technical skills'],
          ['projects', 'List flagship projects'],
          ['education', 'Show education details'],
          ['achievements', 'List achievements'],
          ['contact', 'Show contact links'],
          ['download resume', 'Download resume PDF'],
          ['clear', 'Clear the terminal'],
          ['hire me', 'Launch the rocket pitch'],
        ]),
      );
    },
    whoami: (term) => {
      term.writeln('Aaradhya Mehra');
      term.writeln('CS Undergrad @ BIT Bengaluru (CGPA: 8.5)');
      term.writeln('Graduating: June 2027');
      term.writeln('Focus: AI/ML Engineering + Full Stack Development');
      term.writeln('Status: Actively seeking internships');
    },
    skills: (term) => {
      term.writeln(
        formatColumns([
          ['Languages:', 'Python  Java  C++  JavaScript'],
          ['Web:', 'React  Next.js  FastAPI  Node.js  TailwindCSS'],
          ['AI/ML:', 'XGBoost  SHAP  scikit-learn  TensorFlow Lite  Federated Learning'],
          ['Databases:', 'PostgreSQL  MongoDB  Firebase  Redis'],
          ['DevOps:', 'Docker  GitHub Actions  AWS S3  Linux'],
        ]),
      );
    },
    projects: (term) => {
      projects.forEach((projectItem) => {
        term.writeln(`• ${projectItem.name} — ${projectItem.description}`);
      });
    },
    education: (term) => {
      term.writeln('Bangalore Institute of Technology');
      term.writeln('B.Tech Computer Science Engineering');
      term.writeln('CGPA: 8.5 / 10.0');
      term.writeln('Duration: Sept 2023 – June 2027');
    },
    achievements: (term) => {
      achievements.forEach((achievement) => {
        term.writeln(`• ${achievement.title}`);
        term.writeln(`  ${achievement.description}`);
      });
    },
    contact: (term) => {
      term.writeln(
        formatColumns([
          ['Email:', profile.email],
          ['LinkedIn:', profile.linkedinUrl],
          ['GitHub:', profile.githubUrl],
          ['Codeforces:', profile.codeforcesUrl],
        ]),
      );
    },
    'download resume': (term) => {
      term.writeln('Downloading resume...');
      onDownloadResume();
    },
    clear: (term) => {
      term.clear();
    },
    'hire me': (term) => {
      term.writeln('            /\\');
      term.writeln('           /  \\');
      term.writeln('          / /\\ \\');
      term.writeln('         / ____ \\');
      term.writeln('        /_/    \\_\\');
      term.writeln("Great choice. aaradhyamehra240@gmail.com — don't wait too long.");
    },
  };
}

export function useTerminal(containerRef, onDownloadResume) {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const term = new Terminal({
      convertEol: true,
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 15,
      theme: {
        background: '#050508',
        foreground: '#00F5FF',
        cursor: '#00F5FF',
        cursorAccent: '#050508',
        selectionBackground: 'rgba(0,245,255,0.2)',
      },
    });
    const fitAddon = new FitAddon();
    const commandMap = buildCommandMap(onDownloadResume);
    const commandNames = Object.keys(commandMap);
    const inputRef = { current: '' };
    const commandHistoryRef = { current: [] };
    const historyIndexRef = { current: -1 };

    const writePrompt = () => {
      term.write(PROMPT);
    };

    const replaceInput = (nextValue) => {
      const clearSequence = '\b \b'.repeat(inputRef.current.length);
      if (inputRef.current.length > 0) {
        term.write(clearSequence);
      }
      inputRef.current = nextValue;
      term.write(nextValue);
    };

    const autocomplete = () => {
      const currentInput = inputRef.current.toLowerCase();
      const matches = commandNames.filter((commandName) => commandName.startsWith(currentInput));

      if (matches.length === 0) {
        return;
      }

      if (matches.length === 1) {
        const completion = matches[0].slice(inputRef.current.length);
        inputRef.current += completion;
        term.write(completion);
        return;
      }

      term.writeln('');
      term.writeln(matches.join('    '));
      writePrompt();
      term.write(inputRef.current);
    };

    const cycleHistory = () => {
      if (commandHistoryRef.current.length === 0) {
        return;
      }

      if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
        historyIndexRef.current += 1;
      }

      const nextValue =
        commandHistoryRef.current[commandHistoryRef.current.length - 1 - historyIndexRef.current];
      replaceInput(nextValue);
    };

    const runCommand = (rawInput) => {
      const normalized = rawInput.trim().toLowerCase();

      if (!normalized) {
        return;
      }

      const command = commandMap[normalized];

      if (!command) {
        term.writeln(`command not found: ${rawInput}. Type 'help' for available commands.`);
        return;
      }

      command(term);
    };

    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();

    WELCOME_MESSAGE.forEach((line) => term.writeln(line));
    term.writeln('');
    writePrompt();

    const disposable = term.onData((data) => {
      if (data === '\r') {
        const submitted = inputRef.current;
        term.writeln('');
        inputRef.current = '';
        historyIndexRef.current = -1;
        if (submitted.trim()) {
          commandHistoryRef.current.push(submitted);
        }
        runCommand(submitted);
        writePrompt();
        return;
      }

      if (data === '\u007F') {
        if (inputRef.current.length > 0) {
          inputRef.current = inputRef.current.slice(0, -1);
          term.write('\b \b');
        }
        return;
      }

      if (data === '\t') {
        autocomplete();
        return;
      }

      if (data === '\u001b[A') {
        cycleHistory();
        return;
      }

      if (data >= ' ' && data !== '\u007F') {
        inputRef.current += data;
        historyIndexRef.current = -1;
        term.write(data);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(container);

    return () => {
      disposable.dispose();
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [containerRef, onDownloadResume]);
}
