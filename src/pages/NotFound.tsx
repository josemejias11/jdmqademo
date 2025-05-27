import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

const NotFound: React.FC = () => {
  const { authState } = useAuth();
  const isAuthenticated = authState.isAuthenticated;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm text-center">
            <div className="card-body py-5">
              <FaExclamationTriangle className="text-warning mb-3" size={50} />
              <h1 className="card-title display-4 mb-4">404</h1>
              <h2 className="card-subtitle mb-3">Page Not Found</h2>
              <p className="card-text text-muted mb-4">
                The page you are looking for might have been removed, had its name changed, or is
                temporarily unavailable.
              </p>

              <div className="d-grid gap-2 col-md-8 mx-auto">
                {isAuthenticated ? (
                  <>
                    <Link className="btn btn-primary" to="/dashboard">
                      <FaHome className="me-2" />
                      Go to Dashboard
                    </Link>
                    <Link className="btn btn-outline-secondary" to="/tasks">
                      <FaClipboardList className="me-2" />
                      View Tasks
                    </Link>
                  </>
                ) : (
                  <Link className="btn btn-primary" to="/login">
                    <FaHome className="me-2" />
                    Go to Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
