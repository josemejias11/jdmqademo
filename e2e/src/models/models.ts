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
  STABLE = 'stable',
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
