import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <AppRouter />
      </div>
    </AuthProvider>
  );
};

export default App;
