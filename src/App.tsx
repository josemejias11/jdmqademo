import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import TaskProvider from './context/TaskContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="app-container">
          <AppRouter />
        </div>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
