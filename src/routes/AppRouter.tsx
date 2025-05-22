// src/routes/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Task from '../components/Task/Task';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route 
                path="/tasks" 
                element={
                    <ProtectedRoute>
                        <Task />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    </Router>
);

export default AppRouter;
