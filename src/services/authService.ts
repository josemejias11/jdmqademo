// Authentication service functions
import axios, { AxiosResponse } from 'axios';
import { User, AuthResponse, AuthState, ApiError } from '../types';
import { setAuthToken, removeAuthToken } from '../utils/authUtils';

const API_URL = 'http://localhost:5000/api';

/**
 * Login a user with username and password
 * @param username The username
 * @param password The password
 * @returns The response data from the API
 * @throws ApiError if login fails
 */
export const login = async (username: string, password: string): Promise<{ success: boolean; user: User }> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });

    const data = response.data;
    const token = data?.success ? data.token : null;

    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token received from server.');
    }

    // Store token in localStorage
    setAuthToken(token);

    return {
      success: true,
      user: { username }
    };
  } catch (err) {
    const apiError = err as ApiError;
    console.error('Login failed:', apiError);
    throw apiError;
  }
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  try {
    // Remove token from localStorage
    removeAuthToken();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

/**
 * Check if the user is authenticated
 * @returns Object containing authentication status and user info
 */
export const checkAuthStatus = (): AuthState => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, you would validate the token here
      // For now, we'll just assume it's valid if it exists
      return {
        isAuthenticated: true,
        user: { username: 'user' }, // Placeholder
        loading: false,
        error: null
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    };
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Error checking authentication status:', apiError);
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: apiError.message || 'Authentication check failed'
    };
  }
};
