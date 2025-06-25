import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
