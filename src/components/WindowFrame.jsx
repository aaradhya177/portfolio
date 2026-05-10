import { useEffect, useMemo, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const CLOSE_EASE = [0.32, 0, 0.67, 0];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function getTaskbarOffset(taskbarButtonRect, x, y, width, height, desktopBounds) {
  if (!taskbarButtonRect) {
    return {
      x: 0,
      y: desktopBounds.height * 0.6,
    };
  }

  return {
    x: taskbarButtonRect.left + taskbarButtonRect.width / 2 - (x + width / 2),
    y: taskbarButtonRect.top + taskbarButtonRect.height / 2 - (y + height / 2),
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
  getTaskbarButtonRect,
  isActive,
  isMaximized,
  restoreFromTaskbar,
  minimizeWindow,
  toggleMaximizeWindow,
  transitionState,
  updateWindowRect,
  zIndex,
}) {
  const nodeRef = useRef(null);
  const resizeStateRef = useRef(null);
  const focusPulseTimerRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [focusPulse, setFocusPulse] = useState(false);
  const [entrySettled, setEntrySettled] = useState(false);
  const previousActiveRef = useRef(isActive);
  const taskbarButtonRect = getTaskbarButtonRect(id);
  const isRestoreEntry = restoreFromTaskbar && !entrySettled;

  const dragBounds = useMemo(
    () => ({
      left: 0,
      top: 0,
      right: Math.max(desktopBounds.width - defaultWidth, 0),
      bottom: Math.max(desktopBounds.height - defaultHeight, 0),
    }),
    [defaultHeight, defaultWidth, desktopBounds.height, desktopBounds.width],
  );

  const taskbarOffset = useMemo(
    () =>
      getTaskbarOffset(
        taskbarButtonRect,
        defaultX,
        defaultY,
        defaultWidth,
        defaultHeight,
        desktopBounds,
      ),
    [defaultHeight, defaultWidth, defaultX, defaultY, desktopBounds, taskbarButtonRect],
  );

  useEffect(() => {
    return () => {
      if (resizeStateRef.current) {
        window.removeEventListener('mousemove', resizeStateRef.current.onMouseMove);
        window.removeEventListener('mouseup', resizeStateRef.current.onMouseUp);
      }

      window.clearTimeout(focusPulseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        toggleMaximizeWindow(id, desktopBounds);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [desktopBounds, id, isActive, toggleMaximizeWindow]);

  useEffect(() => {
    if (isActive && !previousActiveRef.current && transitionState === 'idle' && !isRestoreEntry) {
      setFocusPulse(true);
      window.clearTimeout(focusPulseTimerRef.current);
      focusPulseTimerRef.current = window.setTimeout(() => {
        setFocusPulse(false);
      }, 150);
    }

    previousActiveRef.current = isActive;
  }, [isActive, isRestoreEntry, transitionState]);

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
      return;
    }

    if (!entrySettled) {
      setEntrySettled(true);
    }
  };

  const motionInitial = useMemo(() => {
    if (isRestoreEntry) {
      return {
        opacity: 0,
        scale: 0.4,
        x: taskbarOffset.x,
        y: taskbarOffset.y,
      };
    }

    return {
      opacity: 0,
      scale: 0.92,
      x: 0,
      y: 12,
    };
  }, [isRestoreEntry, taskbarOffset.x, taskbarOffset.y]);

  const motionAnimate = useMemo(() => {
    if (transitionState === 'closing') {
      return {
        opacity: 0,
        scale: 0.94,
        x: 0,
        y: 8,
      };
    }

    if (transitionState === 'minimizing') {
      return {
        opacity: 0,
        scale: 0.4,
        x: taskbarOffset.x,
        y: taskbarOffset.y,
      };
    }

    if (focusPulse) {
      return {
        opacity: 1,
        scale: [1, 1.008, 1],
        x: 0,
        y: 0,
      };
    }

    return {
      opacity: 1,
      scale: isDragging || isResizing ? 1.02 : 1,
      x: 0,
      y: 0,
    };
  }, [focusPulse, isDragging, isResizing, taskbarOffset.x, taskbarOffset.y, transitionState]);

  const motionTransition = useMemo(() => {
    if (transitionState === 'closing') {
      return {
        duration: 0.18,
        ease: CLOSE_EASE,
      };
    }

    if (transitionState === 'minimizing') {
      return {
        duration: 0.28,
        ease: CLOSE_EASE,
      };
    }

    if (focusPulse) {
      return {
        duration: 0.15,
      };
    }

    if (isDragging || isResizing) {
      return {
        duration: 0.08,
      };
    }

    if (isRestoreEntry) {
      return {
        type: 'spring',
        stiffness: 320,
        damping: 24,
      };
    }

    return {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.8,
    };
  }, [focusPulse, isDragging, isResizing, isRestoreEntry, transitionState]);

  return (
    <Draggable
      bounds={dragBounds}
      disabled={isMaximized || transitionState !== 'idle'}
      handle=".drag-handle"
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
              : 'width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <motion.div
          animate={motionAnimate}
          className={`window-frame${isActive ? ' is-active' : ''}${isMaximized ? ' is-maximized' : ''}${isDragging || isResizing ? ' is-lifted' : ''}`}
          data-window-icon={icon}
          initial={motionInitial}
          layout
          layoutId={`window-${id}`}
          onAnimationComplete={handleAnimationComplete}
          style={{
            borderRadius: isMaximized ? '0px' : '10px',
            boxShadow:
              isDragging || isResizing
                ? '0 36px 84px rgba(0, 0, 0, 0.92)'
                : '0 25px 60px rgba(0, 0, 0, 0.8)',
          }}
          transition={{
            ...motionTransition,
            layout: {
              type: 'spring',
              stiffness: 260,
              damping: 24,
            },
          }}
        >
          <header
            className={`window-frame-titlebar title-bar${isActive ? ' is-active' : ''}${isDragging ? ' is-dragging' : ''}`}
            onDoubleClick={() => toggleMaximizeWindow(id, desktopBounds)}
            style={{
              borderRadius: isMaximized ? '0px' : '10px 10px 0 0',
            }}
          >
            <div
              className="window-frame-controls"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 4px',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                className="window-frame-control window-frame-control-close traffic-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  closeWindow(id);
                }}
                aria-label={`Close ${title}`}
                title="Close"
                style={{
                  width: '14px',
                  height: '14px',
                  minWidth: '14px',
                  minHeight: '14px',
                  borderRadius: '50%',
                  background: '#FF5F57',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  className="btn-icon"
                  style={{
                    fontSize: '9px',
                    color: '#4a0000',
                    fontWeight: 700,
                    opacity: 0,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  ✕
                </span>
              </button>
              <button
                type="button"
                className="window-frame-control window-frame-control-minimize traffic-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  minimizeWindow(id);
                }}
                aria-label={`Minimize ${title}`}
                title="Minimize"
                style={{
                  width: '14px',
                  height: '14px',
                  minWidth: '14px',
                  minHeight: '14px',
                  borderRadius: '50%',
                  background: '#FFBD2E',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  className="btn-icon"
                  style={{
                    fontSize: '9px',
                    color: '#4a3000',
                    fontWeight: 700,
                    opacity: 0,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  −
                </span>
              </button>
              <button
                type="button"
                className="window-frame-control window-frame-control-maximize traffic-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleMaximizeWindow(id, desktopBounds);
                }}
                aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
                title={isMaximized ? 'Restore' : 'Maximize'}
                style={{
                  width: '14px',
                  height: '14px',
                  minWidth: '14px',
                  minHeight: '14px',
                  borderRadius: '50%',
                  background: '#28CA41',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  className="btn-icon"
                  style={{
                    fontSize: '9px',
                    color: '#003a00',
                    fontWeight: 700,
                    opacity: 0,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {isMaximized ? '❐' : '+'}
                </span>
              </button>
            </div>

            <div className="window-frame-title drag-handle" title={title}>
              {title}
            </div>

            <div className="window-frame-titlebar-spacer" aria-hidden="true" />
          </header>

          <div
            className="window-frame-content"
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
              height: 'calc(100% - 40px)',
            }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="window-frame-content-inner"
              initial={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, delay: 0.12, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </div>

          {!isMaximized && (
            <button
              type="button"
              className="window-frame-resize-handle resize-handle"
              onMouseDown={handleResizeStart}
              aria-label={`Resize ${title}`}
            />
          )}
        </motion.div>
      </div>
    </Draggable>
  );
}
