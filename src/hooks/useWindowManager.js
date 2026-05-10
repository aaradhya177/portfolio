import { useMemo, useState } from 'react';

const TASKBAR_HEIGHT = 48;
const MIN_WINDOW_WIDTH = 400;
const MIN_WINDOW_HEIGHT = 300;
const DEFAULT_WINDOW_WIDTH = 720;
const DEFAULT_WINDOW_HEIGHT = 480;
const WINDOW_DEFINITIONS = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '>_',
    defaultWidth: 720,
    defaultHeight: 460,
  },
  {
    id: 'resume',
    title: 'Resume',
    icon: '\u{1F4C4}',
    defaultWidth: 680,
    defaultHeight: 580,
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '\u{1F4C1}',
    defaultWidth: 860,
    defaultHeight: 520,
  },
  {
    id: 'about',
    title: 'About Me',
    icon: '\u{1F464}',
    defaultWidth: 560,
    defaultHeight: 480,
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: '\u{1F4EC}',
    defaultWidth: 640,
    defaultHeight: 460,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    icon: '\u{1F3C6}',
    defaultWidth: 640,
    defaultHeight: 420,
  },
];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getDesktopBounds() {
  if (typeof window === 'undefined') {
    return {
      width: DEFAULT_WINDOW_WIDTH + 200,
      height: DEFAULT_WINDOW_HEIGHT + 180,
    };
  }

  return {
    width: window.innerWidth,
    height: Math.max(window.innerHeight - TASKBAR_HEIGHT, MIN_WINDOW_HEIGHT),
  };
}

function createCenteredRect(
  index,
  defaultWidth = DEFAULT_WINDOW_WIDTH,
  defaultHeight = DEFAULT_WINDOW_HEIGHT,
) {
  const desktopBounds = getDesktopBounds();
  const minimumWidth = Math.min(MIN_WINDOW_WIDTH, desktopBounds.width);
  const minimumHeight = Math.min(MIN_WINDOW_HEIGHT, desktopBounds.height);
  const width = Math.min(
    defaultWidth,
    Math.max(minimumWidth, desktopBounds.width - 64),
  );
  const height = Math.min(
    defaultHeight,
    Math.max(minimumHeight, desktopBounds.height - 64),
  );
  const offsetX = Math.round(Math.sin((index + 1) * 1.73) * 42);
  const offsetY = Math.round(Math.cos((index + 1) * 1.31) * 28);
  const x = clamp(
    Math.round((desktopBounds.width - width) / 2 + offsetX),
    0,
    Math.max(desktopBounds.width - width, 0),
  );
  const y = clamp(
    Math.round((desktopBounds.height - height) / 2 + offsetY),
    0,
    Math.max(desktopBounds.height - height, 0),
  );

  return { x, y, width, height };
}

function createInitialWindows() {
  return WINDOW_DEFINITIONS.map((windowDefinition, index) => {
    const rect = createCenteredRect(
      index,
      windowDefinition.defaultWidth,
      windowDefinition.defaultHeight,
    );

    return {
      ...windowDefinition,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      transitionState: 'idle',
      restoreBounds: null,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      zIndex: index + 1,
    };
  });
}

function nextFrontZIndex(windows) {
  return Math.max(...windows.map((windowItem) => windowItem.zIndex), 0) + 1;
}

function constrainRect(rect, desktopBounds) {
  const minimumWidth = Math.min(MIN_WINDOW_WIDTH, desktopBounds.width);
  const minimumHeight = Math.min(MIN_WINDOW_HEIGHT, desktopBounds.height);
  const width = clamp(rect.width, minimumWidth, desktopBounds.width);
  const height = clamp(rect.height, minimumHeight, desktopBounds.height);

  return {
    x: clamp(rect.x, 0, Math.max(desktopBounds.width - width, 0)),
    y: clamp(rect.y, 0, Math.max(desktopBounds.height - height, 0)),
    width,
    height,
  };
}

export function useWindowManager() {
  const [windows, setWindows] = useState(() => createInitialWindows());

  const openWindow = (id) => {
    setWindows((currentWindows) => {
      const frontZIndex = nextFrontZIndex(currentWindows);
      const nextWindows = currentWindows.map((windowItem) =>
        windowItem.id === id
          ? {
              ...windowItem,
              isOpen: true,
              isMinimized: false,
              transitionState: 'idle',
              zIndex: frontZIndex,
            }
          : windowItem,
      );

      console.log('[useWindowManager] openWindow', {
        id,
        nextWindows,
      });

      return nextWindows;
    });
  };

  const closeWindow = (id) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) =>
        windowItem.id === id && windowItem.transitionState === 'idle'
          ? {
              ...windowItem,
              transitionState: 'closing',
            }
          : windowItem,
      ),
    );
  };

  const minimizeWindow = (id) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) =>
        windowItem.id === id && windowItem.transitionState === 'idle'
          ? {
              ...windowItem,
              transitionState: 'minimizing',
            }
          : windowItem,
      ),
    );
  };

  const finalizeWindowTransition = (id) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) => {
        if (windowItem.id !== id || windowItem.transitionState === 'idle') {
          return windowItem;
        }

        if (windowItem.transitionState === 'closing') {
          return {
            ...windowItem,
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            transitionState: 'idle',
            restoreBounds: null,
          };
        }

        return {
          ...windowItem,
          isMinimized: true,
          transitionState: 'idle',
        };
      }),
    );
  };

  const focusWindow = (id) => {
    setWindows((currentWindows) => {
      const frontZIndex = nextFrontZIndex(currentWindows);

      return currentWindows.map((windowItem) =>
        windowItem.id === id
          ? {
              ...windowItem,
              zIndex: frontZIndex,
            }
          : windowItem,
      );
    });
  };

  const updateWindowRect = (id, nextRect) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) =>
        windowItem.id === id && !windowItem.isMaximized
          ? {
              ...windowItem,
              ...nextRect,
            }
          : windowItem,
      ),
    );
  };

  const toggleMaximizeWindow = (id, desktopBounds) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) => {
        if (windowItem.id !== id) {
          return windowItem;
        }

        if (windowItem.isMaximized && windowItem.restoreBounds) {
          return {
            ...windowItem,
            ...windowItem.restoreBounds,
            isMaximized: false,
            restoreBounds: null,
          };
        }

        return {
          ...windowItem,
          x: 0,
          y: 0,
          width: desktopBounds.width,
          height: desktopBounds.height,
          isMaximized: true,
          restoreBounds: {
            x: windowItem.x,
            y: windowItem.y,
            width: windowItem.width,
            height: windowItem.height,
          },
        };
      }),
    );
  };

  const syncWindowsToDesktop = (desktopBounds) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) => {
        if (windowItem.isMaximized) {
          return {
            ...windowItem,
            x: 0,
            y: 0,
            width: desktopBounds.width,
            height: desktopBounds.height,
          };
        }

        const nextRect = constrainRect(
          {
            x: windowItem.x,
            y: windowItem.y,
            width: windowItem.width,
            height: windowItem.height,
          },
          desktopBounds,
        );

        return {
          ...windowItem,
          ...nextRect,
        };
      }),
    );
  };

  const openWindows = useMemo(
    () => windows.filter((windowItem) => windowItem.isOpen),
    [windows],
  );

  const activeWindowId = useMemo(() => {
    const visibleWindows = openWindows.filter(
      (windowItem) => !windowItem.isMinimized && windowItem.transitionState !== 'closing',
    );

    if (visibleWindows.length === 0) {
      return null;
    }

    return visibleWindows.reduce((frontWindow, windowItem) =>
      windowItem.zIndex > frontWindow.zIndex ? windowItem : frontWindow,
    ).id;
  }, [openWindows]);

  return {
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
  };
}
