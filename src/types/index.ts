// User interface
export interface User {
  username: string;
  [key: string]: unknown;
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  token: string;
  user?: User;
  message?: string;
}

// API Error interface
export interface ApiError {
  message: string;
  status?: number;
  [key: string]: unknown;
} 