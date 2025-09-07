import React, { useState } from 'react';
import MusicCard from '../components/MusicCard';
import { TRACKS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import AIPlaylistModal from '../components/AIPlaylistModal';
import { MagicWandIcon } from '../components/icons/Icons';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome{user ? `, ${user.name}`: ''}
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
            Discover exclusive AI-generated soundscapes. Your next favorite track awaits.
          </p>
        </div>
        <button 
          onClick={() => setPlaylistModalOpen(true)}
          className="mt-6 sm:mt-0 flex-shrink-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <MagicWandIcon />
          <span className="ml-3">Create AI Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {TRACKS.map(track => (
          <MusicCard key={track.id} track={track} />
        ))}
      </div>

      <AIPlaylistModal 
        isOpen={isPlaylistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
