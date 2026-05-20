import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as authService, AuthUser } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string) => void;
  loginWithGoogle: () => void;
  loginWithPhone: (phone: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const login = (email: string, password?: string) => {
    setUser(authService.login(email, password));
  };

  const loginWithGoogle = () => {
    setUser(authService.loginWithGoogle());
  };

  const loginWithPhone = (phone: string) => {
    setUser(authService.loginWithPhone(phone));
  };

  const loginAsGuest = () => {
    setUser(authService.loginAsGuest());
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, loginWithPhone, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
