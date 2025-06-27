/**
 * Global configuration values for the test suite
 */
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  
  // Default test user
  users: {
    standard: {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    },
    admin: {
      username: 'admin',
      password: 'adminpassword',
      email: 'admin@example.com',
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
