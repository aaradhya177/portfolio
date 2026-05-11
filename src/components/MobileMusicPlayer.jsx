import { useEffect } from 'react';
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

export function MobileMusicPlayer() {
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

  useEffect(() => {
    setIsCollapsed(true);
  }, [setIsCollapsed]);

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
        className="mobile-player mobile-player-mini"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.4 }}
        onClick={() => setIsCollapsed(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsCollapsed(false);
          }
        }}
      >
        <div className="mobile-player-mini-copy">
          <Equalizer isPlaying={isPlaying} />
          <div className="mobile-player-mini-text">
            <span className="mobile-player-mini-label">Now Playing</span>
            <span className="mobile-player-mini-title" title={currentTrack.name}>
              {currentTrack.name}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="mobile-player-mini-button"
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '\u23f8' : '\u23f5'}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mobile-player"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mobile-player-topbar">
        <div className="mobile-player-topbar-copy">
          <span className="mobile-player-note" aria-hidden="true">
            {'\u{1F3B5}'}
          </span>
          <span className="mobile-player-label">AaradhyaOS Radio</span>
        </div>

        <button
          type="button"
          className="mobile-player-collapse-button"
          onClick={() => setIsCollapsed(true)}
          aria-label="Collapse music player"
        >
          {'\u25be'}
        </button>
      </div>

      <div className="mobile-player-track-row">
        <div className="mobile-player-track-copy">
          <div className="mobile-player-track-name-row">
            <h3 className="mobile-player-track-name" title={currentTrack.name}>
              {currentTrack.name}
            </h3>
            <Equalizer isPlaying={isPlaying} />
          </div>
          <div className="mobile-player-track-meta">{currentTrack.artist}</div>
        </div>
      </div>

      <button
        type="button"
        className="mobile-player-progress"
        onClick={handleSeek}
        aria-label="Seek track"
      >
        <span className="mobile-player-progress-fill" style={{ width: `${progress}%` }} />
      </button>

      <div className="mobile-player-time-row">
        <span>{formatTime(currentTime)}</span>
        <span>{duration > 0 ? formatTime(duration) : 'LIVE'}</span>
      </div>

      <div className="mobile-player-controls">
        <button type="button" className="mobile-player-control-button" onClick={prevTrack} aria-label="Previous track">
          {'\u23ee'}
        </button>
        <button
          type="button"
          className={`mobile-player-control-button mobile-player-play-button${isPlaying ? ' is-playing' : ''}`}
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '\u23f8' : '\u23f5'}
        </button>
        <button type="button" className="mobile-player-control-button" onClick={nextTrack} aria-label="Next track">
          {'\u23ed'}
        </button>
      </div>

      <div className="mobile-player-volume-row">
        <span className="mobile-player-volume-icon" aria-hidden="true">
          {'\u{1F508}'}
        </span>
        <input
          className="mobile-player-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          aria-label="Volume"
        />
        <span className="mobile-player-volume-icon" aria-hidden="true">
          {'\u{1F50A}'}
        </span>
      </div>
    </motion.div>
  );
}
