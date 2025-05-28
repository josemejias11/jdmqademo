// Custom Axios instance with minimal headers
import axios from 'axios';

// Create a custom instance with minimal default headers
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Export the instance
export default apiClient;
