import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { ContextMenu } from './ContextMenu';
import { DesktopAvailabilityBanner } from './DesktopAvailabilityBanner';
import { DesktopIcons } from './DesktopIcons';
import { MusicPlayer } from './MusicPlayer';
import { DesktopWallpaper } from './DesktopWallpaper';
import { ShareButton } from './ShareButton';
import { Taskbar } from './Taskbar';
import { WindowLayer } from './WindowLayer';

const BANNER_HEIGHT = 32;
const TASKBAR_HEIGHT = 48;
const SECURITY_TRIGGER = 'sudo rm -rf /';
const CONTEXT_MENU_WIDTH = 220;
const CONTEXT_MENU_HEIGHT = 184;

function formatUptime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

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
  const [wallpaperStyle, setWallpaperStyle] = useState(0);
  const [refreshCycle, setRefreshCycle] = useState(0);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [uptime, setUptime] = useState(0);
  const [bannerReady, setBannerReady] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const desktopRef = useRef(null);
  const taskbarButtonRegistryRef = useRef(new Map());
  const typedBufferRef = useRef('');
  const pageLoadTimeRef = useRef(Date.now());

  const registerTaskbarButton = (windowId, element) => {
    if (!element) {
      taskbarButtonRegistryRef.current.delete(windowId);
      return;
    }

    taskbarButtonRegistryRef.current.set(windowId, element);
  };

  const getTaskbarButtonRect = (windowId) => {
    const element = taskbarButtonRegistryRef.current.get(windowId);
    return element?.getBoundingClientRect() ?? null;
  };

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
  }, [desktopBounds.height, desktopBounds.width, syncWindowsToDesktop]);

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

  useEffect(() => {
    if (!desktopVisible) {
      return undefined;
    }

    const dismissed = window.sessionStorage.getItem('bannerDismissed');
    if (dismissed) {
      setBannerDismissed(true);
      setBannerReady(true);
      return undefined;
    }

    setBannerDismissed(false);
    setBannerReady(true);

    const timerId = window.setTimeout(() => {
      setBannerVisible(true);
    }, 500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [desktopVisible]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setUptime(Date.now() - pageLoadTimeRef.current);
    }, 1000);

    setUptime(Date.now() - pageLoadTimeRef.current);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!contextMenuPosition) {
      return undefined;
    }

    const dismissMenu = () => {
      setContextMenuPosition(null);
    };

    window.addEventListener('click', dismissMenu);
    window.addEventListener('contextmenu', dismissMenu, true);

    return () => {
      window.removeEventListener('click', dismissMenu);
      window.removeEventListener('contextmenu', dismissMenu, true);
    };
  }, [contextMenuPosition]);

  const handleDesktopClick = () => {
    setSelectedIconId(null);
    setContextMenuPosition(null);
  };

  const handleBannerDismiss = () => {
    window.sessionStorage.setItem('bannerDismissed', 'true');
    setBannerVisible(false);
  };

  const handleDesktopContextMenu = (event) => {
    if (
      event.target.closest('.desktop-icons') ||
      event.target.closest('.window-frame-shell') ||
      event.target.closest('.taskbar') ||
      event.target.closest('.context-menu') ||
      event.target.closest('.os-modal')
    ) {
      return;
    }

    event.preventDefault();
    setSelectedIconId(null);

    const maxX = Math.max(window.innerWidth - CONTEXT_MENU_WIDTH - 12, 12);
    const maxY = Math.max(window.innerHeight - CONTEXT_MENU_HEIGHT - 12, 12);

    setContextMenuPosition({
      x: Math.min(event.clientX, maxX),
      y: Math.min(event.clientY, maxY),
    });
  };

  const handleContextMenuAction = (actionId) => {
    if (actionId === 'refresh') {
      setRefreshCycle((currentCycle) => currentCycle + 1);
    }

    if (actionId === 'wallpaper') {
      setWallpaperStyle((currentStyle) => (currentStyle + 1) % 3);
    }

    if (actionId === 'about') {
      setAboutVisible(true);
    }

    setContextMenuPosition(null);
  };

  if (isMobile) {
    return (
      <div className="desktop-environment">
        <AnimatePresence
          onExitComplete={() => {
            setBannerDismissed(true);
          }}
        >
          {bannerReady && !bannerDismissed && bannerVisible ? (
            <DesktopAvailabilityBanner email={profile.email} onDismiss={handleBannerDismiss} />
          ) : null}
        </AnimatePresence>

        <motion.div
          ref={desktopRef}
          className="desktop-content-shell"
          initial={false}
          animate={{ top: bannerVisible ? BANNER_HEIGHT : 0 }}
          transition={{
            duration: bannerVisible ? 0.4 : 0.3,
            ease: bannerVisible ? 'easeOut' : 'easeIn',
          }}
        >
          <DesktopWallpaper wallpaperStyle={wallpaperStyle} />
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`desktop-environment${securityVisible ? ' is-flickering' : ''}`}>
      <AnimatePresence
        onExitComplete={() => {
          setBannerDismissed(true);
        }}
      >
        {bannerReady && !bannerDismissed && bannerVisible ? (
          <DesktopAvailabilityBanner email={profile.email} onDismiss={handleBannerDismiss} />
        ) : null}
      </AnimatePresence>

      <motion.div
        ref={desktopRef}
        className="desktop-content-shell"
        initial={false}
        animate={{ top: bannerVisible ? BANNER_HEIGHT : 0 }}
        transition={{
          duration: bannerVisible ? 0.4 : 0.3,
          ease: bannerVisible ? 'easeOut' : 'easeIn',
        }}
        onClick={handleDesktopClick}
        onContextMenu={handleDesktopContextMenu}
      >
        <DesktopWallpaper wallpaperStyle={wallpaperStyle} />

        <MusicPlayer />
        <ShareButton />

        <WindowLayer
          activeWindowId={activeWindowId}
          closeWindow={closeWindow}
          desktopBounds={desktopBounds}
          finalizeWindowTransition={finalizeWindowTransition}
          focusWindow={focusWindow}
          getTaskbarButtonRect={getTaskbarButtonRect}
          minimizeWindow={minimizeWindow}
          toggleMaximizeWindow={toggleMaximizeWindow}
          updateWindowRect={updateWindowRect}
          windows={windows}
        />

        <DesktopIcons
          desktopVisible={desktopVisible}
          onOpenIcon={openWindow}
          onSelectIcon={setSelectedIconId}
          refreshCycle={refreshCycle}
          selectedIconId={selectedIconId}
        />

        <Taskbar
          activeWindowId={activeWindowId}
          focusWindow={focusWindow}
          minimizeWindow={minimizeWindow}
          openWindow={openWindow}
          openWindows={openWindows}
          registerTaskbarButton={registerTaskbarButton}
        />
      </motion.div>

      {securityVisible ? (
        <div className="security-overlay" role="alert">
          Nice try. Permission denied. - AaradhyaOS Security
        </div>
      ) : null}

      {contextMenuPosition ? (
        <ContextMenu onAction={handleContextMenuAction} position={contextMenuPosition} />
      ) : null}

      {aboutVisible ? (
        <div className="os-modal-backdrop" onClick={() => setAboutVisible(false)}>
          <div
            className="os-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aaradhyaos-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="aaradhyaos-modal-title" className="os-modal-title">
              AaradhyaOS v1.0
            </h2>
            <div className="os-modal-copy">Built by Aaradhya Mehra</div>
            <div className="os-modal-copy">Kernel: Curiosity 9000X</div>
            <div className="os-modal-copy">Uptime: {formatUptime(uptime)}</div>
            <div className="os-modal-copy">Memory: 8192MB Ambition DDR5</div>
            <button type="button" className="os-modal-button" onClick={() => setAboutVisible(false)}>
              [OK]
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
