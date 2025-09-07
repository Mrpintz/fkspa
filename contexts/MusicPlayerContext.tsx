
import React, { createContext, useState, useContext, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrev: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>(TRACKS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playTrack = (track: Track, newPlaylist: Track[] = TRACKS) => {
    setCurrentTrack(track);
    setPlaylist(newPlaylist);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      const nextTrack = playlist[currentIndex + 1];
      playTrack(nextTrack, playlist);
    } else {
        const nextTrack = playlist[0];
        playTrack(nextTrack, playlist);
    }
  }, [currentTrack, playlist]);

  const playPrev = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = playlist[currentIndex - 1];
      playTrack(prevTrack, playlist);
    } else {
        const prevTrack = playlist[playlist.length-1];
        playTrack(prevTrack, playlist);
    }
  };
  
  const seek = (time: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = time;
        setProgress(time);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      if (audio.src !== currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
      }
      isPlaying ? audio.play().catch(e => console.error("Playback error:", e)) : audio.pause();
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext]);


  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, progress, duration, playTrack, togglePlayPause, seek, playNext, playPrev }}>
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): MusicPlayerContextType => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
