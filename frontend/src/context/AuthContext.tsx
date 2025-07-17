import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser } from '../types';
import { authService } from '../services/authService';
import HamsterLoader from '../components/HamsterLoader';
import { useTheme } from './ThemeContext';
import { io, Socket } from 'socket.io-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear stored data
          authService.logout();
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Add effect to update state after Google login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user');
    if (token && user) {
      setToken(token);
      setUser(JSON.parse(decodeURIComponent(user)));
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Connect socket.io when user is logged in
      const socketUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
      const newSocket = io(socketUrl);
      setSocket(newSocket);
      newSocket.emit('user_connected', user.id);
      newSocket.on('online_users', (users: string[]) => {
        setOnlineUsers(users);
      });
      return () => {
        newSocket.disconnect();
      };
    } else {
      setOnlineUsers([]);
      if (socket) {
        socket.disconnect();
      }
    }
    // eslint-disable-next-line
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { token: newToken, user: newUser } = await authService.login({ email, password });
      authService.setAuthData(newToken, newUser);
      setUser(newUser);
      setToken(newToken);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, displayName: string) => {
    try {
      const { token: newToken, user: newUser } = await authService.register({ 
        username, 
        email, 
        password, 
        displayName 
      });
      authService.setAuthData(newToken, newUser);
      setUser(newUser);
      setToken(newToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    onlineUsers,
  };

  if (loading) {
    return <HamsterLoader theme={theme} />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 