
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plan } from '../types';
import { MOCK_USERS } from '../constants';
import { CloseIcon } from './icons/Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();

  if (!isOpen) {
    return null;
  }

  const handleLogin = (plan: Plan) => {
    login(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Simulate Login</h2>
        <p className="text-center text-gray-300 mb-8">Choose a user profile to continue.</p>
        <div className="space-y-4">
          {MOCK_USERS.map(user => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.plan)}
              className="w-full text-left p-4 bg-gray-700 rounded-lg flex items-center justify-between hover:bg-indigo-600 transition-colors group"
            >
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-gray-300 group-hover:text-white">Access Level: {user.plan}</p>
              </div>
              <span className="text-lg font-bold text-indigo-400 group-hover:text-white transition-colors">&rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
