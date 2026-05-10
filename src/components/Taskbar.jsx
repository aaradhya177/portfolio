import { useEffect, useState } from 'react';

function formatClock(date) {
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
    date.getMonth()
  ];
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  return `${day} ${month} ${dayOfMonth}  ${time}`;
}

function WifiIcon() {
  return (
    <svg aria-hidden="true" className="taskbar-signal-icon" viewBox="0 0 24 24">
      <path
        d="M3.2 9.8a13.8 13.8 0 0 1 17.6 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M6.4 13.1a9.2 9.2 0 0 1 11.2 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.6 16.4a4.6 4.6 0 0 1 4.8 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="19" r="1.25" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <span className="taskbar-battery-shell" aria-hidden="true">
      <span className="taskbar-battery-level" />
      <span className="taskbar-battery-tip" />
    </span>
  );
}

export function Taskbar({ activeWindowId, focusWindow, minimizeWindow, openWindow, openWindows }) {
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleTaskbarButtonClick = (windowItem) => {
    if (windowItem.isMinimized) {
      openWindow(windowItem.id);
      return;
    }

    if (activeWindowId === windowItem.id) {
      minimizeWindow(windowItem.id);
      return;
    }

    focusWindow(windowItem.id);
  };

  return (
    <footer className="taskbar" onClick={(event) => event.stopPropagation()}>
      <div className="taskbar-section taskbar-left">
        <button type="button" className="taskbar-brand">
          AM
        </button>
      </div>

      <div className="taskbar-section taskbar-center">
        {openWindows.map((windowItem) => (
          <button
            key={windowItem.id}
            type="button"
            className={`taskbar-window-button${activeWindowId === windowItem.id && !windowItem.isMinimized ? ' is-active' : ''}`}
            data-taskbar-window-id={windowItem.id}
            onClick={() => handleTaskbarButtonClick(windowItem)}
          >
            <span className="taskbar-window-icon">{windowItem.icon}</span>
            <span className="taskbar-window-title">{windowItem.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-section taskbar-right">
        <span className="taskbar-clock">{clock}</span>
        <WifiIcon />
        <div className="taskbar-battery">
          <BatteryIcon />
          <span>87%</span>
        </div>
      </div>
    </footer>
  );
}
