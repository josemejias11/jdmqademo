import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/roboto/400.css';

const Navigation: React.FC = () => {
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate();

  // Only render navigation if user is authenticated
  if (!authState.isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    // Call logout service
    logout();

    // Update auth context
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });

    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
      <div className="container">
        <Link className="navbar-brand" to="/dashboard" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700, letterSpacing: '1px', fontSize: '1.5rem' }}>
          Task Manager
        </Link>

        <button
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-bs-target="#navbarNav"
          data-bs-toggle="collapse"
          type="button"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">
                Tasks
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            <span className="navbar-text me-3" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>Welcome, {authState.user?.username}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
