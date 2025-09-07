
import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LIBRARY);

  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-100 flex flex-col">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-grow p-4 sm:p-6 lg:p-8 pb-32">
            {currentPage === Page.LIBRARY && <HomePage />}
            {currentPage === Page.PRICING && <PricingPage />}
          </main>
          <MusicPlayer />
        </div>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}

export default App;
