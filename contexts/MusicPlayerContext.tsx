import React, { createContext, useState, useContext, ReactNode, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track, playlist?: Track[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
  playlist: Track[];
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = useCallback((track: Track, newPlaylist?: Track[]) => {
    if (audioRef.current) {
        if (currentTrack?.id !== track.id) {
            setCurrentTrack(track);
            audioRef.current.src = track.audioUrl;
            if (newPlaylist) {
                setPlaylist(newPlaylist);
            } else {
                setPlaylist([track]);
            }
        }
        audioRef.current.play().catch(e => console.error("Error playing track:", e));
        setIsPlaying(true);
    }
  }, [currentTrack]);

  const playNext = useCallback(() => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.length - 1) {
        const nextTrack = playlist[currentIndex + 1];
        playTrack(nextTrack, playlist);
    } else {
        setIsPlaying(false);
    }
  }, [playlist, currentTrack, playTrack]);


  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        const handleEnded = () => playNext();

        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        }
    }
  }, [playNext]);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying && currentTrack) {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentTrack]);

  const togglePlayPause = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const playPrev = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
        const prevTrack = playlist[currentIndex - 1];
        playTrack(prevTrack, playlist);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }
  };


  return (
    <MusicPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlayPause, playNext, playPrev, duration, currentTime, seek, playlist }}>
      {children}
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
