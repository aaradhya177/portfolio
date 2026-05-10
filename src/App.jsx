import { BiosScreen } from './components/BiosScreen';
import { DesktopEnvironment } from './components/DesktopEnvironment';
import { LoadingBar } from './components/LoadingBar';
import { LoginScreen } from './components/LoginScreen';
import { useBoot } from './hooks/useBoot';
import { useWindowManager } from './hooks/useWindowManager';

function App() {
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
            className={`desktop-shell${desktopReady ? ' is-ready' : ''}${desktopVisible ? ' is-visible' : ''}`}
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
        </>
      )}
    </main>
  );
}

export default App;
