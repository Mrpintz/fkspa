import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { generateTrackDescription, GEMINI_API_KEY_ERROR } from '../services/geminiService';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, GeminiIcon, LoadingSpinnerIcon, CloseIcon } from './icons/Icons';

const MusicPlayer: React.FC = () => {
  const { currentTrack, isPlaying, progress, duration, togglePlayPause, seek, playNext, playPrev } = useMusicPlayer();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // When the track changes, close the panel and reset its state
    setIsAiPanelOpen(false);
    setAiDescription('');
    setIsApiKeyMissing(false);
  }, [currentTrack]);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    seek(duration * percentage);
  };
  
  const handleGenerateDescription = async () => {
      if (!currentTrack) return;
      setIsAiPanelOpen(true);
      setIsLoadingAi(true);
      setIsApiKeyMissing(false); // Reset on each attempt
      
      const description = await generateTrackDescription(currentTrack);
      
      if (description === GEMINI_API_KEY_ERROR) {
        setIsApiKeyMissing(true);
        setAiDescription('');
      } else {
        setAiDescription(description);
      }
      setIsLoadingAi(false);
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-24 flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 w-1/4">
            <img src={currentTrack.albumArtUrl} alt={currentTrack.title} className="w-14 h-14 rounded-md object-cover" />
            <div>
              <p className="font-semibold text-white truncate">{currentTrack.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls & Progress */}
          <div className="flex flex-col items-center justify-center w-1/2">
            <div className="flex items-center space-x-6">
              <button onClick={playPrev} className="text-gray-300 hover:text-white transition-colors" aria-label="Previous track"><PrevIcon /></button>
              <button onClick={togglePlayPause} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg transform hover:scale-105 transition-transform" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <button onClick={playNext} className="text-gray-300 hover:text-white transition-colors" aria-label="Next track"><NextIcon /></button>
            </div>
            <div className="w-full flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-400">{formatTime(progress)}</span>
                <div className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer group" onClick={handleProgressBarClick}>
                    <div 
                        className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400" 
                        style={{ width: `${(progress / duration) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra Controls */}
          <div className="flex items-center justify-end w-1/4">
            <button onClick={handleGenerateDescription} className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700" title="Get AI Insights">
                <GeminiIcon />
            </button>
          </div>
        </div>
      </div>
      
       {/* AI Insights Panel */}
      {isAiPanelOpen && (
          <div className="absolute bottom-full left-0 right-0 p-6 bg-gray-800 border-t border-b border-gray-700 shadow-2xl">
              <div className="container mx-auto relative">
                <button onClick={() => setIsAiPanelOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><CloseIcon/></button>
                <h4 className="text-lg font-bold flex items-center mb-4"><GeminiIcon/> AI Insights for "{currentTrack.title}"</h4>
                {isLoadingAi ? (
                    <div className="flex items-center space-x-2 text-gray-300"><LoadingSpinnerIcon /> <span>Generating...</span></div>
                ) : isApiKeyMissing ? (
                    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg">
                        <h5 className="font-bold">Configuration Needed</h5>
                        <p className="text-sm mt-1 mb-3">To enable AI Insights, you need to set up your Gemini API Key.</p>
                        <ol className="list-decimal list-inside text-sm space-y-2">
                            <li>
                                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-white">
                                    Get your free API Key
                                </a> from Google AI Studio.
                            </li>
                            <li>
                                In your Netlify settings, go to <strong className="font-semibold">Site settings &gt; Build & deploy &gt; Environment</strong> and add a variable named <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">API_KEY</code> with your key as the value. Then, redeploy your site.
                            </li>
                        </ol>
                    </div>
                ) : (
                    <p className="text-gray-300 text-sm">{aiDescription}</p>
                )}
              </div>
          </div>
      )}
    </footer>
  );
};

export default MusicPlayer;
