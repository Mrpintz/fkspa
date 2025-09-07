import React, { useState } from 'react';
import { generatePlaylist, GEMINI_API_KEY_ERROR } from '../services/geminiService';
import { TRACKS } from '../constants';
import { Track } from '../types';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { CloseIcon, LoadingSpinnerIcon, MagicWandIcon, PlaySolidIcon } from './icons/Icons';

interface AIPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPlaylistModal: React.FC<AIPlaylistModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Track[] | null>(null);
  const { playTrack } = useMusicPlayer();

  if (!isOpen) {
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your playlist.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedPlaylist(null);
    try {
      const trackIds = await generatePlaylist(prompt, TRACKS);
      if (trackIds.length === 0) {
        setError("I couldn't find any tracks that match your request. Try a different prompt!");
      } else {
        const playlist = TRACKS.filter(track => trackIds.includes(track.id));
        // Preserve the order returned by the AI
        playlist.sort((a, b) => trackIds.indexOf(a.id) - trackIds.indexOf(b.id));
        setGeneratedPlaylist(playlist);
      }
    } catch (e: any) {
      if (e.message === GEMINI_API_KEY_ERROR) {
          setError('The AI features are not configured. Please add your Gemini API key in the Netlify settings.');
      } else {
          setError('An error occurred while creating the playlist. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayPlaylist = () => {
    if (generatedPlaylist && generatedPlaylist.length > 0) {
        playTrack(generatedPlaylist[0], generatedPlaylist);
        onClose();
    }
  }

  const resetAndClose = () => {
    setPrompt('');
    setGeneratedPlaylist(null);
    setError('');
    setIsLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={resetAndClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <button onClick={resetAndClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>

        <div className="flex items-center space-x-3 mb-4">
            <MagicWandIcon />
            <h2 className="text-2xl font-bold text-white">Create a playlist with AI</h2>
        </div>
        
        {!generatedPlaylist ? (
            <>
                <p className="text-gray-300 mb-6">Describe the mood, vibe, or occasion for your playlist.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Upbeat electronic music for a workout"
                    className="w-full h-24 p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    disabled={isLoading}
                />
                 {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-6 py-3 font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center justify-center disabled:bg-gray-600"
                >
                    {isLoading ? <><LoadingSpinnerIcon /> <span className="ml-2">Generating...</span></> : 'Generate Playlist'}
                </button>
            </>
        ) : (
            <div>
                <p className="text-gray-300 mb-4">Here is your AI-curated playlist for "{prompt}":</p>
                <div className="max-h-60 overflow-y-auto bg-gray-900/50 rounded-lg p-2 space-y-2">
                    {generatedPlaylist.map((track) => (
                        <div key={track.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700/50">
                            <img src={track.albumArtUrl} alt={track.title} className="w-10 h-10 rounded-sm object-cover" />
                            <div>
                                <p className="font-medium text-white">{track.title}</p>
                                <p className="text-sm text-gray-400">{track.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handlePlayPlaylist}
                    className="w-full mt-6 py-3 font-semibold rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                    <PlaySolidIcon className="h-5 w-5" />
                    <span className="ml-2">Play Now</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AIPlaylistModal;