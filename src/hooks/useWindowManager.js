import { useMemo, useState } from 'react';

const TASKBAR_HEIGHT = 48;
const ICON_COLUMN_WIDTH = 80;
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
    defaultWidth: 780,
    defaultHeight: 620,
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '\u{1F4C1}',
    defaultWidth: 860,
    defaultHeight: 520,
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: '\u{1F4CA}',
    defaultWidth: 720,
    defaultHeight: 500,
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
      restoreFromTaskbar: false,
      transitionState: 'idle',
      restoreBounds: null,
      prevX: null,
      prevY: null,
      prevWidth: null,
      prevHeight: null,
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

function getMaximizedRect() {
  if (typeof window === 'undefined') {
    return {
      x: ICON_COLUMN_WIDTH,
      y: 0,
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFAULT_WINDOW_HEIGHT,
    };
  }

  return {
    x: ICON_COLUMN_WIDTH,
    y: 0,
    width: Math.max(window.innerWidth - ICON_COLUMN_WIDTH, MIN_WINDOW_WIDTH),
    height: Math.max(window.innerHeight - TASKBAR_HEIGHT, MIN_WINDOW_HEIGHT),
  };
}

export function useWindowManager() {
  const [windows, setWindows] = useState(() => createInitialWindows());

  const openWindow = (id) => {
    setWindows((currentWindows) => {
      const frontZIndex = nextFrontZIndex(currentWindows);

      return currentWindows.map((windowItem) =>
        windowItem.id === id
          ? {
              ...windowItem,
              isOpen: true,
              isMinimized: false,
              restoreFromTaskbar: windowItem.isMinimized,
              transitionState: 'idle',
              zIndex: frontZIndex,
            }
          : windowItem,
      );
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
            restoreFromTaskbar: false,
            transitionState: 'idle',
            restoreBounds: null,
            prevX: null,
            prevY: null,
            prevWidth: null,
            prevHeight: null,
          };
        }

        return {
          ...windowItem,
          isMinimized: true,
          restoreFromTaskbar: false,
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
              restoreFromTaskbar: false,
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

        if (
          windowItem.isMaximized &&
          windowItem.prevX !== null &&
          windowItem.prevY !== null &&
          windowItem.prevWidth !== null &&
          windowItem.prevHeight !== null
        ) {
          return {
            ...windowItem,
            x: windowItem.prevX,
            y: windowItem.prevY,
            width: windowItem.prevWidth,
            height: windowItem.prevHeight,
            isMaximized: false,
            restoreBounds: null,
            prevX: null,
            prevY: null,
            prevWidth: null,
            prevHeight: null,
          };
        }

        const maximizedRect = getMaximizedRect();

        return {
          ...windowItem,
          x: maximizedRect.x,
          y: maximizedRect.y,
          width: maximizedRect.width,
          height: maximizedRect.height,
          isMaximized: true,
          restoreBounds: {
            x: windowItem.x,
            y: windowItem.y,
            width: windowItem.width,
            height: windowItem.height,
          },
          prevX: windowItem.x,
          prevY: windowItem.y,
          prevWidth: windowItem.width,
          prevHeight: windowItem.height,
        };
      }),
    );
  };

  const syncWindowsToDesktop = (desktopBounds) => {
    setWindows((currentWindows) =>
      currentWindows.map((windowItem) => {
        if (windowItem.isMaximized) {
          const maximizedRect = getMaximizedRect();
          return {
            ...windowItem,
            x: maximizedRect.x,
            y: maximizedRect.y,
            width: maximizedRect.width,
            height: maximizedRect.height,
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
