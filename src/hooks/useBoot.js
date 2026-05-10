import { useEffect, useMemo, useRef, useState } from 'react';

const BIOS_LINES = [
  'AaradhyaOS BIOS v2.4.1',
  'Copyright (C) 2024 AM Systems',
  '',
  'CPU: AMD Curiosity 9000X @ 3.6GHz',
  'RAM: 8192MB Ambition DDR5',
  'GPU: NVIDIA Creativity RTX 9090',
  '',
  'Detecting storage devices...',
  '> SSD: Projects_Drive (512GB) .............. OK',
  '> SSD: Skills_Vault (256GB) ................ OK',
  '> HDD: Achievements_Archive (1TB) .......... OK',
  '',
  'Press DEL to enter Setup. Press F12 for boot menu.',
  'Booting AaradhyaOS...',
];

const LOADING_MESSAGES = [
  'Initializing neural networks...',
  'Mounting project drives...',
  'Loading skill modules...',
  'Calibrating curiosity engine...',
  'Compiling achievements...',
];

const BIOS_LINE_DELAY = 200;
const BIOS_STAGE_PAUSE = 1000;
const LOADING_DURATION = 2500;
const LOADING_MESSAGE_DELAY = 600;
const PROGRESS_INTERVAL = 40;
const DESKTOP_FADE_DURATION = 600;

export function useBoot() {
  const [stage, setStage] = useState('bios');
  const [biosIndex, setBiosIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loginActive, setLoginActive] = useState(true);
  const [loginExiting, setLoginExiting] = useState(false);
  const [desktopReady, setDesktopReady] = useState(false);
  const [desktopVisible, setDesktopVisible] = useState(false);
  const timeoutsRef = useRef([]);
  const loginTriggeredRef = useRef(false);

  const biosLines = useMemo(() => BIOS_LINES.slice(0, biosIndex), [biosIndex]);
  const loadingMessage = LOADING_MESSAGES[loadingMessageIndex] ?? LOADING_MESSAGES[0];

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (stage !== 'bios') {
      return undefined;
    }

    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const timeoutId = window.setTimeout(callback, delay);
      timeoutsRef.current.push(timeoutId);
      timeoutIds.push(timeoutId);
      return timeoutId;
    };

    const printLine = (index) => {
      schedule(() => {
        setBiosIndex(index + 1);

        if (index < BIOS_LINES.length - 1) {
          printLine(index + 1);
          return;
        }

        schedule(() => {
          setStage('loading');
        }, BIOS_STAGE_PAUSE);
      }, index === 0 ? 0 : BIOS_LINE_DELAY);
    };

    printLine(0);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'loading') {
      return undefined;
    }

    const timeoutIds = [];

    const schedule = (callback, delay) => {
      const timeoutId = window.setTimeout(callback, delay);
      timeoutsRef.current.push(timeoutId);
      timeoutIds.push(timeoutId);
      return timeoutId;
    };

    setLoadingProgress(0);
    setLoadingMessageIndex(0);

    const steps = Math.ceil(LOADING_DURATION / PROGRESS_INTERVAL);

    const updateProgress = (step) => {
      schedule(() => {
        const nextProgress = Math.min(100, Math.round((step / steps) * 100));
        setLoadingProgress(nextProgress);

        if (step < steps) {
          updateProgress(step + 1);
          return;
        }

        setStage('login');
      }, PROGRESS_INTERVAL);
    };

    const cycleMessage = (index) => {
      schedule(() => {
        setLoadingMessageIndex(index % LOADING_MESSAGES.length);

        cycleMessage(index + 1);
      }, index === 0 ? 0 : LOADING_MESSAGE_DELAY);
    };

    updateProgress(1);
    cycleMessage(0);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'login') {
      return undefined;
    }

    setLoginActive(true);
    setLoginExiting(false);
    setDesktopReady(false);
    setDesktopVisible(false);

    return undefined;
  }, [stage]);

  const unlock = () => {
    if (stage !== 'login' || loginTriggeredRef.current) {
      return;
    }

    loginTriggeredRef.current = true;
    setStage('desktop');
    setLoginExiting(true);
    setDesktopReady(true);

    const revealTimeout = window.setTimeout(() => {
      setDesktopVisible(true);
    }, 20);

    const completeTimeout = window.setTimeout(() => {
      setLoginActive(false);
      setLoginExiting(false);
      loginTriggeredRef.current = false;
    }, DESKTOP_FADE_DURATION);

    timeoutsRef.current.push(revealTimeout, completeTimeout);
  };

  return {
    stage,
    biosLines,
    loadingProgress,
    loadingMessage,
    loginActive,
    loginExiting,
    desktopReady,
    desktopVisible,
    unlock,
  };
}
