/**
 * Base interface for page objects
 */
export interface BasePage {
  /**
   * Navigate to the page
   */
  goto(): Promise<void>;

  /**
   * Verify page is loaded correctly
   */
  verifyPageLoaded(): Promise<void>;
}

/**
 * Enum for element states used for waiting
 */
export enum ElementState {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  ATTACHED = 'attached',
  DETACHED = 'detached',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  STABLE = 'stable'
}

/**
 * Interface for the user credentials
 */
export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
}

/**
 * Interface for task data
 */
export interface TaskData {
  title: string;
  description: string;
  completed?: boolean;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Interface for complete task object from API
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Interface for API login response
 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
  };
}
