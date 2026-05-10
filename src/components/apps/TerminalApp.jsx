import { memo, useRef } from 'react';
import 'xterm/css/xterm.css';
import { useTerminal } from '../../hooks/useTerminal';
import { downloadResume } from '../../utils/downloadResume';

export const TerminalApp = memo(function TerminalApp() {
  const terminalRef = useRef(null);

  useTerminal(terminalRef, downloadResume);

  return (
    <div className="terminal-app">
      <div ref={terminalRef} className="terminal-shell" />
    </div>
  );
});
