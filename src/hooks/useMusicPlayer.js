import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  {
    name: 'Jarvis Activate Auto Smile',
    artist: 'mix',
    url: '/jarvis-activate-auto-smile-mix.mp3',
  },
  {
    name: 'Chill Afternoon',
    artist: 'lo-fi beats',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
  },
  {
    name: 'Late Night Code',
    artist: 'study mode',
    url: 'https://streams.radiomast.io/lofi',
  },
];

function clampVolume(value) {
  return Math.min(Math.max(value, 0), 1);
}

function isFiniteDuration(value) {
  return Number.isFinite(value) && value > 0;
}

export function useMusicPlayer() {
  const audioRef = useRef(new Audio());
  const fallbackContextRef = useRef(null);
  const fallbackGainRef = useRef(null);
  const fallbackOscillatorRef = useRef(null);
  const shouldResumeAfterTrackChangeRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.45);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const track = TRACKS[currentTrack] ?? TRACKS[0];

  const stopFallback = () => {
    if (fallbackOscillatorRef.current) {
      fallbackOscillatorRef.current.disconnect();
      fallbackOscillatorRef.current = null;
    }

    if (fallbackGainRef.current) {
      fallbackGainRef.current.disconnect();
      fallbackGainRef.current = null;
    }

    if (fallbackContextRef.current) {
      fallbackContextRef.current.close().catch(() => {});
      fallbackContextRef.current = null;
    }
  };

  const startFallback = async () => {
    try {
      stopFallback();

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return false;
      }

      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 432;
      gainNode.gain.value = clampVolume(volume) * 0.05;

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start();

      fallbackContextRef.current = context;
      fallbackGainRef.current = gainNode;
      fallbackOscillatorRef.current = oscillator;
      setIsFallbackMode(true);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);

      return true;
    } catch {
      return false;
    }
  };

  const pause = async () => {
    audioRef.current.pause();

    if (fallbackContextRef.current) {
      await fallbackContextRef.current.suspend().catch(() => {});
    }

    setIsPlaying(false);
  };

  const play = async () => {
    if (isFallbackMode && fallbackContextRef.current) {
      try {
        await fallbackContextRef.current.resume();
        setIsPlaying(true);
        return;
      } catch {
        stopFallback();
        setIsFallbackMode(false);
      }
    }

    try {
      await audioRef.current.play();
      setIsFallbackMode(false);
      setIsPlaying(true);
    } catch {
      const fallbackStarted = await startFallback();

      if (!fallbackStarted) {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audio.src = track.url;
    audio.volume = volume;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(isFiniteDuration(audio.duration) ? audio.duration : 0);
    };

    const handleDurationChange = () => {
      setDuration(isFiniteDuration(audio.duration) ? audio.duration : 0);
    };

    const handleEnded = () => {
      shouldResumeAfterTrackChangeRef.current = true;
      setCurrentTrack((currentIndex) => (currentIndex + 1) % TRACKS.length);
    };

    const handleError = async () => {
      if (isPlaying || shouldResumeAfterTrackChangeRef.current) {
        await startFallback();
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    setCurrentTime(0);
    setDuration(0);

    if (shouldResumeAfterTrackChangeRef.current) {
      shouldResumeAfterTrackChangeRef.current = false;
      play();
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack]);

  useEffect(() => {
    audioRef.current.volume = volume;

    if (fallbackGainRef.current) {
      fallbackGainRef.current.gain.value = clampVolume(volume) * 0.05;
    }
  }, [volume]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (!isPlaying || isFallbackMode) {
        return;
      }

      const audio = audioRef.current;
      setCurrentTime(audio.currentTime || 0);
      setDuration(isFiniteDuration(audio.duration) ? audio.duration : 0);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isFallbackMode, isPlaying]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
      stopFallback();
    };
  }, []);

  const togglePlayback = async () => {
    if (isPlaying) {
      await pause();
      return;
    }

    await play();
  };

  const changeTrack = (direction) => {
    const shouldResume = isPlaying || isFallbackMode;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    stopFallback();
    setIsFallbackMode(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(shouldResume);
    shouldResumeAfterTrackChangeRef.current = shouldResume;
    setCurrentTrack((currentIndex) => (currentIndex + direction + TRACKS.length) % TRACKS.length);
  };

  const seek = (time) => {
    if (isFallbackMode || !isFiniteDuration(duration)) {
      return;
    }

    const nextTime = Math.min(Math.max(time, 0), duration);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return {
    isPlaying,
    currentTrack: isFallbackMode
      ? { name: 'Ambient Mode', artist: '432Hz fallback' }
      : track,
    volume,
    currentTime,
    duration,
    isCollapsed,
    isFallbackMode,
    play,
    pause,
    togglePlayback,
    nextTrack: () => changeTrack(1),
    prevTrack: () => changeTrack(-1),
    seek,
    setVolume: (nextVolume) => setVolumeState(clampVolume(nextVolume)),
    setIsCollapsed,
  };
}
