// Authentication utility functions
import { AxiosAuthConfig } from '../types';

/**
 * Get the authentication token from local storage
 * @returns The authentication token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Set the authentication token in local storage
 * @param token The token to store
 */
export const setAuthToken = (token: string): void => {
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
      Authorization: `Bearer ${token}`
    }
  };
};
