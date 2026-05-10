import { useEffect, useRef, useState } from 'react';

const RING_LERP = 0.12;
const TRAIL_LIMIT = 4;
const TRAIL_LIFETIME = 300;
const TRAIL_SAMPLE_MS = 16;

function isTextTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('input, textarea, p, span, [contenteditable="true"]'));
}

function isHoverTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'button, a, [role="button"], .clickable, .icon, .desktop-icon, .taskbar-window-button, .window-frame-control, .desktop-player-control-button, .desktop-player-icon-button'
    )
  );
}

function isDragTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('.window-frame-titlebar'));
}

function getBaseState(target) {
  if (isHoverTarget(target)) {
    return 'hover';
  }

  if (isTextTarget(target)) {
    return 'text';
  }

  return 'default';
}

export function useCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [trailPositions, setTrailPositions] = useState([]);
  const [cursorState, setCursorState] = useState('default');
  const baseStateRef = useRef('default');
  const isClickingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef(0);
  const ringPosRef = useRef({ x: -100, y: -100 });
  const mousePosRef = useRef({ x: -100, y: -100 });
  const lastSampleRef = useRef(0);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const updateCursorState = () => {
      if (isDraggingRef.current) {
        setCursorState('drag');
        return;
      }

      if (isClickingRef.current) {
        setCursorState('click');
        return;
      }

      setCursorState(baseStateRef.current);
    };

    const handleMouseMove = (event) => {
      const nextPos = { x: event.clientX, y: event.clientY };
      mousePosRef.current = nextPos;
      setMousePos(nextPos);

      if (!isDraggingRef.current) {
        baseStateRef.current = getBaseState(event.target);
      }

      const now = performance.now();
      if (now - lastSampleRef.current >= TRAIL_SAMPLE_MS) {
        lastSampleRef.current = now;
        setTrailPositions((previous) => {
          const nextTrail = [
            { id: trailIdRef.current++, x: nextPos.x, y: nextPos.y, createdAt: now },
            ...previous.filter((item) => now - item.createdAt < TRAIL_LIFETIME),
          ];

          return nextTrail.slice(0, TRAIL_LIMIT);
        });
      }

      updateCursorState();
    };

    const handleMouseDown = (event) => {
      if (isDragTarget(event.target)) {
        isDraggingRef.current = true;
        setCursorState('drag');
        return;
      }

      isClickingRef.current = true;
      setCursorState('click');

      window.setTimeout(() => {
        isClickingRef.current = false;
        updateCursorState();
      }, 200);
    };

    const handleMouseUp = (event) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
      }

      baseStateRef.current = getBaseState(event.target);
      updateCursorState();
    };

    const handleMouseLeave = () => {
      baseStateRef.current = 'default';
      if (!isDraggingRef.current && !isClickingRef.current) {
        setCursorState('default');
      }
    };

    const animateRing = () => {
      ringPosRef.current = {
        x: ringPosRef.current.x + (mousePosRef.current.x - ringPosRef.current.x) * RING_LERP,
        y: ringPosRef.current.y + (mousePosRef.current.y - ringPosRef.current.y) * RING_LERP,
      };

      setRingPos(ringPosRef.current);

      const now = performance.now();
      setTrailPositions((previous) => {
        const nextTrail = previous.filter((item) => now - item.createdAt < TRAIL_LIFETIME);
        return nextTrail.length === previous.length ? previous : nextTrail;
      });

      animationFrameRef.current = window.requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);

    animationFrameRef.current = window.requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return {
    mousePos,
    ringPos,
    cursorState,
    trailPositions,
  };
}
