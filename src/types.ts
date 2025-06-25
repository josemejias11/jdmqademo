// Task related types
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth related types
export interface User {
  username: string;
  id?: number;
  email?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user?: User;
  message?: string;
}
// API related types
export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
    statusText?: string;
  };
}
