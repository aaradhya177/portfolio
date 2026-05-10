import { useCursor } from '../hooks/useCursor';

const TRAIL_OPACITIES = [0.4, 0.3, 0.2, 0.1];

export function Cursor() {
  const { mousePos, ringPos, cursorState, trailPositions } = useCursor();
  const isHover = cursorState === 'hover';
  const isClick = cursorState === 'click';
  const isText = cursorState === 'text';
  const isDrag = cursorState === 'drag';

  return (
    <div className="cursor-system" aria-hidden="true">
      {trailPositions.map((trail, index) => (
        <div
          key={trail.id}
          className="cursor-trail-dot"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: TRAIL_OPACITIES[index] ?? 0.1,
          }}
        />
      ))}

      <div
        className={`cursor-ring${isHover ? ' is-hover' : ''}${isClick ? ' is-click' : ''}${isText ? ' is-text' : ''}${isDrag ? ' is-drag' : ''}`}
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
        }}
      />

      <div
        className={`cursor-dot${isHover ? ' is-hover' : ''}${isClick ? ' is-click' : ''}${isText ? ' is-text' : ''}${isDrag ? ' is-drag' : ''}`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      >
        {isDrag ? '+' : null}
      </div>
    </div>
  );
}
