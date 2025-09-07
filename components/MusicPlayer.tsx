import React from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon, PauseIcon } from './icons/Icons';

const SkipIcon: React.FC<{ reversed?: boolean } & React.SVGProps<SVGSVGElement>> = ({ reversed = false, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" {...props}>
      <path d={reversed ? "M5.586 12l7.707-7.707 1.414 1.414L8.414 12l6.293 6.293-1.414 1.414L5.586 12zM18 18h-2V6h2v12z" : "M18.414 12l-7.707 7.707-1.414-1.414L15.586 12 9.293 5.707l1.414-1.414L18.414 12zM6 6h2v12H6V6z"} />
    </svg>
);


const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlayPause, playNext, playPrev, duration, currentTime, seek, playlist } = useMusicPlayer();
  
  const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex > -1 && currentIndex < playlist.length - 1;

  if (!currentTrack) {
    return null;
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          <div className="flex items-center space-x-4 w-1/4 min-w-0">
            <img src={currentTrack.albumArtUrl} alt={currentTrack.title} className="w-14 h-14 rounded-md object-cover" />
            <div className="min-w-0">
              <p className="font-bold text-white truncate">{currentTrack.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-grow max-w-2xl">
              <div className="flex items-center space-x-6">
                <button onClick={playPrev} disabled={!canGoPrev} className="text-gray-400 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed">
                    <SkipIcon reversed />
                </button>
                <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg transform transition-transform hover:scale-105"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8 ml-1" />}
                </button>
                 <button onClick={playNext} disabled={!canGoNext} className="text-gray-400 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed">
                    <SkipIcon />
                </button>
              </div>
              <div className="w-full flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
              </div>
          </div>
          
          <div className="flex items-center space-x-4 w-1/4 justify-end">
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
