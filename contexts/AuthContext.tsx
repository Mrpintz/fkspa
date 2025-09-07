
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Plan } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (plan: Plan) => void;
  logout: () => void;
  planRank: (plan: Plan) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const planHierarchy = {
  [Plan.FREE]: 0,
  [Plan.PREMIUM]: 1,
  [Plan.PRO]: 2,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (plan: Plan) => {
    const mockUser = MOCK_USERS.find(u => u.plan === plan);
    setUser(mockUser || null);
  };

  const logout = () => {
    setUser(null);
  };

  const planRank = (plan: Plan): number => {
    return planHierarchy[plan];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, planRank }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
