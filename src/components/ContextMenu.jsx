const MENU_ITEMS = [
  {
    id: 'refresh',
    icon: '🔄',
    label: 'Refresh Desktop',
  },
  {
    id: 'wallpaper',
    icon: '🖼️',
    label: 'Change Wallpaper',
  },
  {
    id: 'about',
    icon: '💻',
    label: 'About AaradhyaOS',
  },
  {
    id: 'close',
    icon: '✕',
    label: 'Close Menu',
  },
];

export function ContextMenu({ onAction, position }) {
  return (
    <div
      className="context-menu"
      role="menu"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="context-menu-item"
          role="menuitem"
          onClick={() => onAction(item.id)}
        >
          <span className="context-menu-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="context-menu-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
