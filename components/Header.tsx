
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import { Page, Plan } from '../types';
import { MusicIcon } from './icons/Icons';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const getPlanBadgeColor = (plan: Plan) => {
    switch(plan) {
        case Plan.FREE: return 'bg-gray-500';
        case Plan.PREMIUM: return 'bg-indigo-500';
        case Plan.PRO: return 'bg-purple-500';
    }
  }

  const NavLink: React.FC<{page: Page}> = ({ page }) => (
    <button 
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === page ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
    >
        {page}
    </button>
  );

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage(Page.LIBRARY)}>
                <MusicIcon />
                <span className="font-bold text-xl text-white">Fkspa</span>
              </div>
              <nav className="hidden md:flex items-center space-x-4">
                  <NavLink page={Page.LIBRARY} />
                  <NavLink page={Page.PRICING} />
              </nav>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPlanBadgeColor(user.plan)}`}>{user.plan}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Header;