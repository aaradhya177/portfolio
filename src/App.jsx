import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BiosScreen } from './components/BiosScreen';
import { DesktopEnvironment } from './components/DesktopEnvironment';
import { LoadingBar } from './components/LoadingBar';
import { LoginScreen } from './components/LoginScreen';
import { MobilePortfolio } from './components/MobilePortfolio';
import { Screensaver } from './components/Screensaver';
import { useBoot } from './hooks/useBoot';
import { useScreensaver } from './hooks/useScreensaver';
import { useWindowManager } from './hooks/useWindowManager';

function MobileApp() {
  const { stage, biosLines, loadingProgress, loadingMessage, unlock } = useBoot();

  useEffect(() => {
    if (stage === 'login') {
      unlock();
    }
  }, [stage, unlock]);

  return (
    <main className="app-shell">
      {stage === 'bios' && <BiosScreen lines={biosLines} />}

      {(stage === 'loading' || stage === 'login') && (
        <LoadingBar
          progress={stage === 'login' ? 100 : loadingProgress}
          message={stage === 'login' ? 'Optimizing mobile portfolio...' : loadingMessage}
        />
      )}

      {stage === 'desktop' && <MobilePortfolio />}
    </main>
  );
}

function DesktopApp() {
  const {
    stage,
    biosLines,
    loadingProgress,
    loadingMessage,
    loginActive,
    loginExiting,
    desktopVisible,
    desktopReady,
    unlock,
  } = useBoot();
  const {
    windows,
    openWindows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    finalizeWindowTransition,
    focusWindow,
    updateWindowRect,
    toggleMaximizeWindow,
    syncWindowsToDesktop,
  } = useWindowManager();
  const screensaverEnabled = stage === 'desktop' && desktopVisible && !loginActive;
  const { isActive: screensaverActive } = useScreensaver(screensaverEnabled);

  return (
    <main className="app-shell">
      {stage === 'bios' && <BiosScreen lines={biosLines} />}

      {stage === 'loading' && (
        <LoadingBar
          progress={loadingProgress}
          message={loadingMessage}
        />
      )}

      {(stage === 'login' || stage === 'desktop') && (
        <>
          <div
            className={`desktop-shell${desktopReady ? ' is-ready' : ''}${desktopVisible ? ' is-visible' : ''}${screensaverActive ? ' is-dimmed' : ''}`}
            aria-hidden={!desktopVisible}
          >
            <DesktopEnvironment
              activeWindowId={activeWindowId}
              closeWindow={closeWindow}
              desktopVisible={desktopVisible}
              finalizeWindowTransition={finalizeWindowTransition}
              focusWindow={focusWindow}
              minimizeWindow={minimizeWindow}
              openWindow={openWindow}
              openWindows={openWindows}
              syncWindowsToDesktop={syncWindowsToDesktop}
              toggleMaximizeWindow={toggleMaximizeWindow}
              updateWindowRect={updateWindowRect}
              windows={windows}
            />
          </div>

          {loginActive && (
            <LoginScreen
              isExiting={loginExiting}
              onLogin={unlock}
            />
          )}

          <AnimatePresence>
            {screensaverActive ? <Screensaver isActive={screensaverActive} /> : null}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return <MobileApp />;
  }

  return <DesktopApp />;
}

export default App;
