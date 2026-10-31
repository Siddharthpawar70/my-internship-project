import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  joinedDate: string;
  role?: 'customer' | 'admin';
  status?: 'approved' | 'pending' | 'rejected';
}

export type RegisterResult =
  | { status: 'success'; user: UserProfile }
  | { status: 'pending' }
  | { status: 'error'; message: string };

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalScreen: 'login' | 'register';
  openAuthModal: (screen?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalScreen, setAuthModalScreen] = useState<'login' | 'register'>('login');

  useEffect(() => {
    apiRequest<{ user: UserProfile | null }>('/auth/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await apiRequest<{ user: UserProfile }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    setUser(result.user);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<RegisterResult> => {
    try {
      const result = await apiRequest<{ user?: UserProfile; pending?: boolean }>('/auth/register', {
        method: 'POST', body: JSON.stringify({ name, email, password, phone })
      });
      if (result.pending) {
        return { status: 'pending' };
      }
      if (result.user) {
        setUser(result.user);
        setIsAuthModalOpen(false);
        return { status: 'success', user: result.user };
      }
      return { status: 'pending' };
    } catch (err) {
      return { status: 'error', message: err instanceof Error ? err.message : 'Registration failed.' };
    }
  };

  const logout = async () => {
    await apiRequest<void>('/auth/session', { method: 'DELETE' });
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const result = await apiRequest<{ user: UserProfile }>('/auth/me', {
      method: 'PUT', body: JSON.stringify(updates)
    });
    setUser(result.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalScreen,
        openAuthModal: (screen?: 'login' | 'register') => {
          if (screen) setAuthModalScreen(screen);
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
