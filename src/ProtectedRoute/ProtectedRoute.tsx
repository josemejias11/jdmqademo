import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  // Show loading state while checking authentication
  if (authState.loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
