import { useEffect, useRef, useState } from 'react';

const IDLE_TIMEOUT_MS = 30000;
const CHECK_INTERVAL_MS = 1000;
const INTERACTION_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

export function useScreensaver(enabled) {
  const [isActive, setIsActive] = useState(false);
  const lastInteractionRef = useRef(Date.now());

  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      lastInteractionRef.current = Date.now();
      return undefined;
    }

    const handleInteraction = () => {
      lastInteractionRef.current = Date.now();
      setIsActive(false);
    };

    const intervalId = window.setInterval(() => {
      if (Date.now() - lastInteractionRef.current >= IDLE_TIMEOUT_MS) {
        setIsActive(true);
      }
    }, CHECK_INTERVAL_MS);

    INTERACTION_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleInteraction, { passive: true });
    });

    return () => {
      window.clearInterval(intervalId);
      INTERACTION_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleInteraction);
      });
    };
  }, [enabled]);

  return {
    isActive,
  };
}
