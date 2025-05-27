import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import Navigation from '../components/Navigation';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import TaskForm from '../components/TaskForm';
import TaskDetail from '../pages/TaskDetail';
import NotFound from '../pages/NotFound';

// Protected Route wrapper component
const ProtectedRoute: React.FC = () => {
  const { authState } = useAuth();

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  // If authenticated, render the child routes with the Navigation component
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

// Login route wrapper - redirects to dashboard if already logged in
const LoginRoute: React.FC = () => {
  const { authState } = useAuth();

  // If already authenticated, redirect to dashboard
  if (authState.isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  // If not authenticated, show the login page
  return <Login />;
};

// Root route wrapper - redirects to dashboard if logged in, login if not
const RootRoute: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  } else {
    return <Navigate replace to="/login" />;
  }
};

// Task Detail page - placeholder component that would be implemented in a real app
const TaskDetailComponent: React.FC = () => {
  return <TaskDetail />;
};

// Not Found page - placeholder component that would be implemented in a real app
const NotFoundComponent: React.FC = () => {
  return <NotFound />;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<LoginRoute />} path="/login" />

        {/* Root route redirects based on auth state */}
        <Route element={<RootRoute />} path="/" />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Dashboard />} path="/dashboard" />

          <Route element={<Tasks />} path="/tasks" />
          <Route element={<TaskForm />} path="/tasks/new" />
          <Route element={<TaskForm />} path="/tasks/edit/:id" />
          <Route element={<TaskDetailComponent />} path="/tasks/:id" />
        </Route>

        {/* 404 Not Found route */}
        <Route element={<NotFoundComponent />} path="*" />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
