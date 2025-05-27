// Authentication utility functions
import { AxiosAuthConfig } from '../types';

/**
 * Get the authentication token from local storage
 * @returns The authentication token or null if not found
 */
export const getAuthToken = (): string | null => localStorage.getItem('auth_token');

/**
 * Set the authentication token in local storage
 * @param token The token to store
 */
export const setAuthToken = (token: string): void => {
  // Ensure token is not excessively large
  if (token && token.length > 8000) {
    console.warn('Warning: Auth token is unusually large');
  }
  localStorage.setItem('auth_token', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Get axios configuration with authentication headers
 * @returns Axios config object with authorization header
 */
export const getAuthConfig = (): AxiosAuthConfig => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
};
