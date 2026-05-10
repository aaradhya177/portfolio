import { useEffect, useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getMotionTarget(transitionState, desktopBounds, x, y, width) {
  if (transitionState === 'closing') {
    return {
      opacity: 0,
      scale: 0.85,
      x: 0,
      y: 0,
    };
  }

  if (transitionState === 'minimizing') {
    return {
      opacity: 0,
      scale: 0.72,
      x: ((desktopBounds.width / 2) - (x + width / 2)) * 0.18,
      y: Math.max(desktopBounds.height - y - 72, 48),
    };
  }

  return {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  };
}

export function WindowFrame({
  id,
  title,
  icon,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  children,
  closeWindow,
  desktopBounds,
  finalizeWindowTransition,
  focusWindow,
  isActive,
  isMaximized,
  transitionState,
  minimizeWindow,
  toggleMaximizeWindow,
  updateWindowRect,
  zIndex,
}) {
  const nodeRef = useRef(null);
  const resizeStateRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragBounds = useMemo(
    () => ({
      left: 0,
      top: 0,
      right: Math.max(desktopBounds.width - defaultWidth, 0),
      bottom: Math.max(desktopBounds.height - defaultHeight, 0),
    }),
    [defaultHeight, defaultWidth, desktopBounds.height, desktopBounds.width],
  );

  useEffect(() => {
    return () => {
      if (resizeStateRef.current) {
        window.removeEventListener('mousemove', resizeStateRef.current.onMouseMove);
        window.removeEventListener('mouseup', resizeStateRef.current.onMouseUp);
      }
    };
  }, []);

  const handleResizeStart = (event) => {
    if (isMaximized) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusWindow(id);
    setIsResizing(true);

    const startState = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: defaultWidth,
      startHeight: defaultHeight,
    };

    const onMouseMove = (moveEvent) => {
      const minimumWidth = Math.min(MIN_WIDTH, desktopBounds.width);
      const minimumHeight = Math.min(MIN_HEIGHT, desktopBounds.height);
      const maxWidth = Math.max(minimumWidth, desktopBounds.width - defaultX);
      const maxHeight = Math.max(minimumHeight, desktopBounds.height - defaultY);
      const nextWidth = clamp(
        Math.round(startState.startWidth + (moveEvent.clientX - startState.startX)),
        minimumWidth,
        maxWidth,
      );
      const nextHeight = clamp(
        Math.round(startState.startHeight + (moveEvent.clientY - startState.startY)),
        minimumHeight,
        maxHeight,
      );

      updateWindowRect(id, {
        width: nextWidth,
        height: nextHeight,
      });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeStateRef.current = null;
    };

    resizeStateRef.current = { onMouseMove, onMouseUp };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleAnimationComplete = () => {
    if (transitionState !== 'idle') {
      finalizeWindowTransition(id);
    }
  };

  const motionTarget = useMemo(() => {
    if (transitionState !== 'minimizing') {
      return getMotionTarget(transitionState, desktopBounds, defaultX, defaultY, defaultWidth);
    }

    const taskbarButton = document.querySelector(
      `[data-taskbar-window-id="${window.CSS?.escape ? window.CSS.escape(String(id)) : String(id)}"]`,
    );

    if (!taskbarButton || !nodeRef.current) {
      return getMotionTarget(transitionState, desktopBounds, defaultX, defaultY, defaultWidth);
    }

    const buttonRect = taskbarButton.getBoundingClientRect();
    const windowRect = nodeRef.current.getBoundingClientRect();

    return {
      opacity: 0,
      scale: 0.72,
      x:
        buttonRect.left +
        buttonRect.width / 2 -
        (windowRect.left + windowRect.width / 2),
      y:
        buttonRect.top +
        buttonRect.height / 2 -
        (windowRect.top + windowRect.height / 2),
    };
  }, [defaultWidth, defaultX, defaultY, desktopBounds, id, transitionState]);

  return (
    <Draggable
      bounds={dragBounds}
      disabled={isMaximized || transitionState !== 'idle'}
      handle=".window-frame-titlebar"
      nodeRef={nodeRef}
      onDrag={(_, dragData) => {
        setIsDragging(true);
        updateWindowRect(id, {
          x: dragData.x,
          y: dragData.y,
        });
      }}
      onMouseDown={() => focusWindow(id)}
      onStart={() => {
        focusWindow(id);
        setIsDragging(true);
      }}
      onStop={(_, dragData) => {
        setIsDragging(false);
        updateWindowRect(id, {
          x: dragData.x,
          y: dragData.y,
        });
      }}
      position={{ x: defaultX, y: defaultY }}
    >
      <div
        ref={nodeRef}
        className="window-frame-shell"
        onMouseDown={() => focusWindow(id)}
        style={{
          width: `${defaultWidth}px`,
          height: `${defaultHeight}px`,
          zIndex,
          transition:
            isDragging || isResizing
              ? 'none'
              : 'width 220ms ease, height 220ms ease, transform 220ms ease',
        }}
      >
        <motion.div
          animate={motionTarget}
          className={`window-frame${isActive ? ' is-active' : ''}${isMaximized ? ' is-maximized' : ''}`}
          data-window-icon={icon}
          initial={{
            opacity: 0,
            scale: 0.85,
            x: 0,
            y: 18,
          }}
          layout
          onAnimationComplete={handleAnimationComplete}
          transition={{
            ...(transitionState === 'idle'
              ? {
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }
              : {
                  duration: transitionState === 'closing' ? 0.15 : 0.25,
                  ease: 'easeOut',
                }),
          }}
        >
          <header
            className={`window-frame-titlebar${isActive ? ' is-active' : ''}`}
            onDoubleClick={() => toggleMaximizeWindow(id, desktopBounds)}
          >
            <div className="window-frame-controls">
              <button
                type="button"
                className="window-frame-control window-frame-control-close"
                onClick={(event) => {
                  event.stopPropagation();
                  closeWindow(id);
                }}
                aria-label={`Close ${title}`}
              >
                <span aria-hidden="true">{'\u00D7'}</span>
              </button>
              <button
                type="button"
                className="window-frame-control window-frame-control-minimize"
                onClick={(event) => {
                  event.stopPropagation();
                  minimizeWindow(id);
                }}
                aria-label={`Minimize ${title}`}
              >
                <span aria-hidden="true">{'\u2212'}</span>
              </button>
              <button
                type="button"
                className="window-frame-control window-frame-control-maximize"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleMaximizeWindow(id, desktopBounds);
                }}
                aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>

            <div className="window-frame-title" title={title}>
              {title}
            </div>

            <div className="window-frame-titlebar-spacer" aria-hidden="true" />
          </header>

          <div className="window-frame-content">{children}</div>

          {!isMaximized && (
            <button
              type="button"
              className="window-frame-resize-handle"
              onMouseDown={handleResizeStart}
              aria-label={`Resize ${title}`}
            />
          )}
        </motion.div>
      </div>
    </Draggable>
  );
}
