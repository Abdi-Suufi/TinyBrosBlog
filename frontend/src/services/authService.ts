import api from './api';
import { AuthUser, LoginFormData, RegisterFormData } from '../types';

export const authService = {
  async login(credentials: LoginFormData): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterFormData): Promise<{ token: string; user: AuthUser }> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): AuthUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuthData(token: string, user: AuthUser): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Handle Google OAuth callback
  handleGoogleCallback(): boolean {
    // Check if token and user are in the URL as query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      this.setAuthData(token, JSON.parse(decodeURIComponent(user)));
      // Remove token and user from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return false;
  }
}; 