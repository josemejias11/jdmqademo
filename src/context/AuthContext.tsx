import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { User, AuthResponse, ApiError } from '../types';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/authUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = (): void => {
      try {
        const token = getAuthToken();
        if (token) {
          // In a real app, you would validate the token here
          // For now, we'll just assume it's valid if it exists
          setIsAuthenticated(true);
          // Extract user info from token or make an API call to get user data
          setUser({ username: 'user' }); // Placeholder
        }
      } catch (error) {
        const apiError = error as ApiError;
        console.error('Error checking authentication status:', apiError);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Use minimal headers for login request
      const response = await apiClient.post<AuthResponse>('/api/auth/login', {
        username,
        password
      });

      const data = response.data;
      const token = data.token;

      if (!data || !data.success || !token.trim()) {
        console.error('Invalid login response structure:', data);
        return;
      }

      // Store token in localStorage
      setAuthToken(token as string);

      // Update auth state
      setIsAuthenticated(true);
      setUser({ username });

      console.warn('Logged in successfully');
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Login failed:', apiError);

      // Special handling for 431 errors
      if (apiError.response?.status === 431) {
        setError('Server error: Headers too large. Please try again later.');
      } else {
        setError(
          apiError.response?.data?.message ||
            'Login failed. Please check your credentials and try again.'
        );
      }
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    try {
      // Remove token from localStorage
      removeAuthToken();

      // Update auth state
      setIsAuthenticated(false);
      setUser(null);

      console.warn('Logged out successfully');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Logout failed:', apiError);
    }
  };

  // Values and functions to expose via the context
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
