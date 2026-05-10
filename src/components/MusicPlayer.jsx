import { motion } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function Equalizer({ isPlaying }) {
  return (
    <div className={`desktop-player-equalizer${isPlaying ? ' is-playing' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function MusicPlayer() {
  const {
    isPlaying,
    currentTrack,
    volume,
    currentTime,
    duration,
    isCollapsed,
    togglePlayback,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    setIsCollapsed,
  } = useMusicPlayer();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (event) => {
    if (duration <= 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    seek(duration * Math.min(Math.max(ratio, 0), 1));
  };

  if (isCollapsed) {
    return (
      <motion.div
        role="button"
        tabIndex={0}
        className="desktop-player desktop-player-mini"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.35, ease: 'easeOut' },
          y: { duration: 0.8, delay: 1, ease: 'easeInOut' },
        }}
        onClick={() => setIsCollapsed(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsCollapsed(false);
          }
        }}
      >
        <Equalizer isPlaying={isPlaying} />
        <span className="desktop-player-mini-title" title={currentTrack.name}>
          {currentTrack.name}
        </span>
        <button
          type="button"
          className="desktop-player-icon-button desktop-player-mini-toggle"
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '⏵'}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="desktop-player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.35, ease: 'easeOut' },
        y: { duration: 0.8, delay: 1, ease: 'easeInOut' },
      }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="desktop-player-topbar">
        <span className="desktop-player-note" aria-hidden="true">
          🎵
        </span>
        <span className="desktop-player-label">AaradhyaOS Radio</span>
        <button
          type="button"
          className="desktop-player-icon-button"
          onClick={() => setIsCollapsed(true)}
          aria-label="Collapse player"
        >
          ▾
        </button>
      </div>

      <div className="desktop-player-track-row">
        <div className="desktop-player-track-copy">
          <div className="desktop-player-track-name-row">
            <h3 className="desktop-player-track-name" title={currentTrack.name}>
              {currentTrack.name}
            </h3>
            <Equalizer isPlaying={isPlaying} />
          </div>
          <div className="desktop-player-track-meta">{currentTrack.artist}</div>
        </div>
      </div>

      <button
        type="button"
        className="desktop-player-progress"
        onClick={handleSeek}
        aria-label="Seek track"
      >
        <span className="desktop-player-progress-fill" style={{ width: `${progress}%` }} />
      </button>

      <div className="desktop-player-time-row">
        <span>{formatTime(currentTime)}</span>
        <span>{duration > 0 ? formatTime(duration) : 'LIVE'}</span>
      </div>

      <div className="desktop-player-controls">
        <button type="button" className="desktop-player-control-button" onClick={prevTrack} aria-label="Previous track">
          ⏮
        </button>
        <button
          type="button"
          className={`desktop-player-control-button desktop-player-play-button${isPlaying ? ' is-playing' : ''}`}
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '⏵'}
        </button>
        <button type="button" className="desktop-player-control-button" onClick={nextTrack} aria-label="Next track">
          ⏭
        </button>
      </div>

      <div className="desktop-player-volume-row">
        <span className="desktop-player-volume-icon" aria-hidden="true">
          🔈
        </span>
        <input
          className="desktop-player-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
        <span className="desktop-player-volume-icon" aria-hidden="true">
          🔊
        </span>
      </div>
    </motion.div>
  );
}
