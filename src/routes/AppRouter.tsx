// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Task from '../components/Task/Task';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<Login />} path="/" />
      <Route
        element={
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        }
        path="/tasks"
      />
    </Routes>
  </Router>
);

export default AppRouter;
