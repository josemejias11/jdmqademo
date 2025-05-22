// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Task from '../components/Task/Task';

const AppRouter = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/tasks" element={<Task />} />
        </Routes>
    </Router>
);

export default AppRouter;