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
  }
}; 