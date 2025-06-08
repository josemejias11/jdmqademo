// Authentication service functions
// noinspection ExceptionCaughtLocallyJS

import apiClient from '../utils/apiClient';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User, AuthResponse, ApiError } from '../types';
import { setAuthToken, removeAuthToken } from '../utils/';

/**
 * Login a user with username and password
 * @param username The username
 * @param password The password
 * @returns The response data from the API
 * @throws ApiError if login fails
 */
const login = async (
  username: string,
  password: string
): Promise<{ success: boolean; user: User }> => {
  try {
    const response = await apiClient.post<AuthResponse>('http://localhost:3001/api/auth/login', {
      username,
      password
    });

    const data = response.data;
    const token = data?.success ? data.token : null;

    if (!token || typeof token !== 'string') {
      // eslint-disable-next-line no-throw-literal
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

export { login };

/**
 * Logout the current user
 */
export const logout = (): void => {
  try {
    // Remove token from localStorage
    removeAuthToken();
    console.warn('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
