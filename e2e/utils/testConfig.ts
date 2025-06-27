/**
 * Test configuration constants and utilities
 */

export const TEST_CONFIG = {
  // Default test data
  DEFAULT_USER: {
    username: 'admin',
    password: 'changeme'
  },
  
  // Timeouts
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    NETWORK_IDLE: 15000
  },
  
  // Retry configuration
  RETRIES: {
    FLAKY_ACTION: 3,
    NETWORK_REQUEST: 2
  },
  
  // Test data patterns
  SELECTORS: {
    // Form selectors
    USERNAME_INPUT: 'input[name="username"]',
    PASSWORD_INPUT: 'input[name="password"]',
    TITLE_INPUT: 'input[name="title"]',
    DESCRIPTION_INPUT: 'textarea[name="description"]',
    
    // Common elements
    TASK_ITEM: '[data-testid="task-item"]',
    TASK_LIST: '.list-group',
    LOADING_SPINNER: '.spinner-border',
    
    // Buttons
    LOGIN_BUTTON: 'button:has-text("Login")',
    ADD_BUTTON: 'button:has-text("Add")',
    DELETE_BUTTON: 'button:has-text("Delete")',
    
    // Navigation
    DASHBOARD_LINK: 'a[href*="/dashboard"]',
    TASKS_LINK: 'a[href*="/tasks"]'
  },
  
  // URLs
  URLS: {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    TASKS: '/tasks'
  }
} as const;

export const TEST_DATA = {
  VALID_TASKS: [
    {
      title: 'Complete project documentation',
      description: 'Update README and add inline comments'
    },
    {
      title: 'Fix authentication bug',
      description: 'Resolve issue with token expiration'
    },
    {
      title: 'Implement user settings',
      description: 'Add user preference configuration page'
    }
  ],
  
  INVALID_TASKS: [
    {
      title: '',
      description: 'Task with empty title'
    },
    {
      title: 'A'.repeat(256), // Too long title
      description: 'Task with overly long title'
    }
  ]
} as const;
