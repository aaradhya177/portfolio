import { AnimatePresence } from 'framer-motion';
import { WindowFrame } from './WindowFrame';
import { AboutApp } from './apps/AboutApp';
import { AchievementsApp } from './apps/AchievementsApp';
import { ContactApp } from './apps/ContactApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { ResumeApp } from './apps/ResumeApp';
import { TerminalApp } from './apps/TerminalApp';

const WINDOW_CONTENT = {
  terminal: 'AaradhyaOS shell online. Curiosity engine standing by for the next command.',
  resume: 'Resume module loaded. This window is a placeholder until the document app ships in the next phase.',
  contact: 'Messaging channels connected. Reach-out tools will land here once the communication apps are built.',
};

function renderWindowContent(windowId) {
  if (windowId === 'projects') {
    return <ProjectsApp />;
  }

  if (windowId === 'terminal') {
    return <TerminalApp />;
  }

  if (windowId === 'resume') {
    return <ResumeApp />;
  }

  if (windowId === 'about') {
    return <AboutApp />;
  }

  if (windowId === 'contact') {
    return <ContactApp />;
  }

  if (windowId === 'achievements') {
    return <AchievementsApp />;
  }

  return (
    <div className="window-placeholder-copy">
      <p>{WINDOW_CONTENT[windowId]}</p>
    </div>
  );
}

export function WindowLayer({
  activeWindowId,
  closeWindow,
  desktopBounds,
  finalizeWindowTransition,
  focusWindow,
  minimizeWindow,
  toggleMaximizeWindow,
  updateWindowRect,
  windows,
}) {
  const visibleWindows = windows
    .filter((windowItem) => windowItem.isOpen && !windowItem.isMinimized)
    .sort((firstWindow, secondWindow) => firstWindow.zIndex - secondWindow.zIndex);

  console.log('[WindowLayer] visibleWindows', visibleWindows);

  return (
    <div className="window-layer" onClick={(event) => event.stopPropagation()}>
      <AnimatePresence>
        {visibleWindows.map((windowItem) => (
          <WindowFrame
            key={windowItem.id}
            closeWindow={closeWindow}
            defaultHeight={windowItem.height}
            defaultWidth={windowItem.width}
            defaultX={windowItem.x}
            defaultY={windowItem.y}
            desktopBounds={desktopBounds}
            finalizeWindowTransition={finalizeWindowTransition}
            focusWindow={focusWindow}
            icon={windowItem.icon}
            id={windowItem.id}
            isActive={activeWindowId === windowItem.id}
            isMaximized={windowItem.isMaximized}
            minimizeWindow={minimizeWindow}
            title={windowItem.title}
            toggleMaximizeWindow={toggleMaximizeWindow}
            transitionState={windowItem.transitionState}
            updateWindowRect={updateWindowRect}
            zIndex={windowItem.zIndex}
          >
            {renderWindowContent(windowItem.id)}
          </WindowFrame>
        ))}
      </AnimatePresence>
    </div>
  );
}
