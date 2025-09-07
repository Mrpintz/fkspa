
import React from 'react';
import { Track } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { PlayIcon, PauseIcon, LockIcon } from './icons/Icons';

interface MusicCardProps {
  track: Track;
}

const MusicCard: React.FC<MusicCardProps> = ({ track }) => {
  const { user, planRank } = useAuth();
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useMusicPlayer();

  const userPlanRank = user ? planRank(user.plan) : -1;
  const trackPlanRank = planRank(track.requiredPlan);
  const isLocked = userPlanRank < trackPlanRank;

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isLocked) return;
    
    if (isCurrentTrack) {
        togglePlayPause();
    } else {
        playTrack(track);
    }
  };

  return (
    <div className="group relative bg-gray-800/50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:bg-gray-800/80 hover:scale-105">
      <img src={track.albumArtUrl} alt={track.title} className="w-full h-auto aspect-square object-cover" />
      
      {isLocked && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4">
          <LockIcon />
          <span className="mt-2 text-sm font-semibold text-center">Requires {track.requiredPlan} Plan</span>
        </div>
      )}

      <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${!isLocked && 'opacity-0 group-hover:opacity-100'}`}>
        <button
          onClick={handlePlay}
          disabled={isLocked}
          className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform duration-200 hover:scale-110 disabled:bg-gray-500 disabled:cursor-not-allowed"
          aria-label={isCurrentTrack && isPlaying ? "Pause" : "Play"}
        >
          {isCurrentTrack && isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="font-bold text-white truncate">{track.title}</h3>
        <p className="text-sm text-gray-300 truncate">{track.artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;
