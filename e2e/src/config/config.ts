/**
 * Global configuration values for the test suite
 */
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001',

  // Default test user
  users: {
    admin: {
      username: 'admin',
      password: 'changeme',
    }
  },

  // Default wait times in milliseconds
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    extraLong: 30000
  }
};
