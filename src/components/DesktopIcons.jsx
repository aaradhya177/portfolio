const DESKTOP_ICONS = [
  { id: 'projects', icon: '\u{1F4C1}', label: 'Projects' },
  { id: 'terminal', icon: '>_', label: 'Terminal' },
  { id: 'resume', icon: '\u{1F4C4}', label: 'Resume' },
  { id: 'about', icon: '\u{1F464}', label: 'About Me' },
  { id: 'contact', icon: '\u{1F4EC}', label: 'Contact' },
  { id: 'achievements', icon: '\u{1F3C6}', label: 'Achievements' },
];

export function DesktopIcons({ desktopVisible, onOpenIcon, onSelectIcon, selectedIconId }) {
  const handleOpen = (iconId) => {
    console.log('[DesktopIcons] onDoubleClick openWindow', { id: iconId });
    onOpenIcon(iconId);
  };

  return (
    <div className="desktop-icons" onClick={(event) => event.stopPropagation()}>
      {DESKTOP_ICONS.map((iconItem, index) => {
        const isSelected = selectedIconId === iconItem.id;

        return (
          <button
            key={iconItem.id}
            type="button"
            className={`desktop-icon${isSelected ? ' is-selected' : ''}${desktopVisible ? ' is-visible' : ''}`}
            onClick={() => {
              if (isSelected) {
                handleOpen(iconItem.id);
                return;
              }

              onSelectIcon(iconItem.id);
            }}
            onDoubleClick={() => handleOpen(iconItem.id)}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="desktop-icon-glyph">{iconItem.icon}</span>
            <span className="desktop-icon-label">{iconItem.label}</span>
          </button>
        );
      })}
    </div>
  );
}
