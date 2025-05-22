// Task related types
export interface Task {
    id: number;
    text: string;
    done: boolean;
}

export interface BackendTask {
    id: number;
    title: string;
    completed: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
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

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
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

export interface AxiosAuthConfig {
    headers: {
        Authorization: string;
    };
}
