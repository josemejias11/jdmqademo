import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/authUtils';

// Simple JWT decoder function
const decodeJWT = (token: string): { username?: string } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Define types here to avoid dependency on external types file
export interface User {
  username: string;

  [key: string]: unknown;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user?: User;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: (state: Partial<AuthState>) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
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
  // Use a single state object for better consistency
  const [authState, setAuthStateValue] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Function to update auth state
  const setAuthState = (newState: Partial<AuthState>) => {
    setAuthStateValue(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // Check if user is already authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = (): void => {
      try {
        const token = getAuthToken();
        if (token) {
          // Decode the JWT token to extract username
          const decodedUser = decodeJWT(token);
          const username = decodedUser?.username || 'user';
          
          setAuthState({
            isAuthenticated: true,
            user: { username },
            loading: false
          });
        } else {
          setAuthState({ loading: false });
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthState({
          loading: false,
          error: 'Failed to verify authentication status'
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setAuthState({
      loading: true,
      error: null
    });

    try {
      // Use minimal headers for login request
      const response = await apiClient.post<AuthResponse>('/api/auth/login', {
        username,
        password
      });

      const data = response.data;
      const token = data.token;

      if (!data || !data.success || !token || typeof token !== 'string' || !token.trim()) {
        console.error('Invalid login response structure:', data);
        setAuthState({
          loading: false,
          error: 'Invalid response from server'
        });
        return;
      }

      // Store token in localStorage
      setAuthToken(token);

      // Update auth state
      setAuthState({
        isAuthenticated: true,
        user: { username },
        loading: false,
        error: null
      });

      // Authentication successful
    } catch (err: unknown) {
      // Handle login error

      let errorMessage = 'Login failed. Please check your credentials and try again.';

      // Special handling for specific errors
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
        if (errorObj.response?.status === 431) {
          errorMessage = 'Server error: Headers too large. Please try again later.';
        } else if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        }
      }

      setAuthState({
        loading: false,
        error: errorMessage
      });

      throw err;
    }
  };

  const logout = (): void => {
    try {
      // Remove token from localStorage
      removeAuthToken();

      // Update auth state
      setAuthState({
        isAuthenticated: false,
        user: null,
        error: null
      });

      // Logout successful
    } catch (error) {
      // Error during logout
    }
  };

  // Values and functions to expose via the context
  const contextValue: AuthContextType = {
    authState,
    setAuthState,
    login,
    logout
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
