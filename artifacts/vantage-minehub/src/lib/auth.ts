import { AppUserRole } from "@workspace/api-client-react";

export interface AuthUser {
  uid: string;
  email?: string;
  username: string;
  role: AppUserRole;
  loginProvider: 'email' | 'google' | 'phone' | 'guest';
  isGuest: boolean;
}

const AUTH_KEY = 'vantage_auth_user';

export const auth = {
  login: (email: string, password?: string): AuthUser => {
    const user: AuthUser = {
      uid: 'user_' + Date.now(),
      email,
      username: email.split('@')[0],
      role: email === 'admin@vantageminehub.com' ? AppUserRole.admin : AppUserRole.user,
      loginProvider: 'email',
      isGuest: false,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  loginWithGoogle: (): AuthUser => {
    const user: AuthUser = {
      uid: 'google_' + Date.now(),
      email: 'googleuser@example.com',
      username: 'Google User',
      role: AppUserRole.user,
      loginProvider: 'google',
      isGuest: false,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  loginWithPhone: (phone: string): AuthUser => {
    const user: AuthUser = {
      uid: 'phone_' + Date.now(),
      username: phone,
      role: AppUserRole.user,
      loginProvider: 'phone',
      isGuest: false,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  loginAsGuest: (): AuthUser => {
    const user: AuthUser = {
      uid: 'guest_' + Date.now(),
      username: 'Guest User',
      role: AppUserRole.user,
      loginProvider: 'guest',
      isGuest: true,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): AuthUser | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAdmin: (): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === AppUserRole.admin || user?.email === 'admin@vantageminehub.com';
  }
};
