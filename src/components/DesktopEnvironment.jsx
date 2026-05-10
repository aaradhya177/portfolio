import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { DesktopIcons } from './DesktopIcons';
import { DesktopWallpaper } from './DesktopWallpaper';
import { Taskbar } from './Taskbar';
import { WindowLayer } from './WindowLayer';

const TASKBAR_HEIGHT = 48;
const SECURITY_TRIGGER = 'sudo rm -rf /';

export function DesktopEnvironment({
  activeWindowId,
  closeWindow,
  desktopVisible,
  finalizeWindowTransition,
  focusWindow,
  minimizeWindow,
  openWindow,
  openWindows,
  syncWindowsToDesktop,
  toggleMaximizeWindow,
  updateWindowRect,
  windows,
}) {
  const [selectedIconId, setSelectedIconId] = useState(null);
  const [desktopBounds, setDesktopBounds] = useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [securityVisible, setSecurityVisible] = useState(false);
  const desktopRef = useRef(null);
  const typedBufferRef = useRef('');

  useEffect(() => {
    const element = desktopRef.current;

    if (!element) {
      return undefined;
    }

    const measure = () => {
      const nextBounds = {
        width: Math.max(element.clientWidth, 400),
        height: Math.max(element.clientHeight - TASKBAR_HEIGHT, 300),
      };

      setDesktopBounds((currentBounds) => {
        if (
          currentBounds.width === nextBounds.width &&
          currentBounds.height === nextBounds.height
        ) {
          return currentBounds;
        }

        return nextBounds;
      });

      setIsMobile(window.innerWidth < 768);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(element);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (desktopBounds.width === 0 || desktopBounds.height === 0) {
      return;
    }

    syncWindowsToDesktop(desktopBounds);
  }, [desktopBounds.height, desktopBounds.width]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.length === 1) {
        typedBufferRef.current = `${typedBufferRef.current}${event.key}`
          .slice(-SECURITY_TRIGGER.length)
          .toLowerCase();
      } else if (event.key === 'Backspace') {
        typedBufferRef.current = typedBufferRef.current.slice(0, -1);
      }

      if (typedBufferRef.current === SECURITY_TRIGGER) {
        setSecurityVisible(true);
        typedBufferRef.current = '';
        window.setTimeout(() => {
          setSecurityVisible(false);
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDesktopClick = () => {
    setSelectedIconId(null);
  };

  console.log('[DesktopEnvironment] render windows', windows);

  if (isMobile) {
    return (
      <div ref={desktopRef} className="desktop-environment">
        <DesktopWallpaper />
        <div className="mobile-fallback">
          <div className="mobile-fallback-card">
            <div className="mobile-fallback-monogram">AM</div>
            <h2 className="mobile-fallback-title">AaradhyaOS is best experienced on desktop.</h2>
            <div className="mobile-fallback-name">{profile.name}</div>
            <p className="mobile-fallback-bio">
              AI/ML and full stack engineer building end-to-end products, research-driven systems,
              and ambitious developer tools.
            </p>
            <div className="mobile-fallback-links">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={desktopRef}
      className={`desktop-environment${securityVisible ? ' is-flickering' : ''}`}
      onClick={handleDesktopClick}
    >
      <DesktopWallpaper />

      <WindowLayer
        activeWindowId={activeWindowId}
        closeWindow={closeWindow}
        desktopBounds={desktopBounds}
        finalizeWindowTransition={finalizeWindowTransition}
        focusWindow={focusWindow}
        minimizeWindow={minimizeWindow}
        toggleMaximizeWindow={toggleMaximizeWindow}
        updateWindowRect={updateWindowRect}
        windows={windows}
      />

      <DesktopIcons
        desktopVisible={desktopVisible}
        onOpenIcon={openWindow}
        onSelectIcon={setSelectedIconId}
        selectedIconId={selectedIconId}
      />

      <Taskbar
        activeWindowId={activeWindowId}
        focusWindow={focusWindow}
        minimizeWindow={minimizeWindow}
        openWindow={openWindow}
        openWindows={openWindows}
      />

      {securityVisible ? (
        <div className="security-overlay" role="alert">
          Nice try. Permission denied. — AaradhyaOS Security
        </div>
      ) : null}
    </div>
  );
}
