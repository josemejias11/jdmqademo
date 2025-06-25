import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/roboto/400.css';

// Validation schema for the login form
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthState, authState } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    setLoginError(null);
    setShowModal(false);
    try {
      // Call the login function from authService
      await login(values.username, values.password);

      // Update auth context with the new login state
      setAuthState({
        isAuthenticated: true,
        user: { username: values.username },
        loading: false,
        error: null
      });

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error: Error | unknown) {
      // Prefer error from context if available
      let errorMessage = authState.error || (error instanceof Error ? error.message : 'Login failed. Please try again.');
      if (errorMessage === 'Request failed with status code 401') {
        errorMessage = 'Invalid username or password. Please try again.';
      }
      setLoginError(errorMessage);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center bg-light" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-1" style={{ color: '#1F75FE', fontSize: '2.2rem', letterSpacing: '1px', fontFamily: 'Montserrat, Poppins, Arial, sans-serif' }}>Task Manager</h1>
                <p className="mb-0" style={{ color: '#2E2E2E', opacity: 0.7, fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>Please login to your account.</p>
              </div>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="username" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif' }}>
                        Username
                      </label>
                      <Field
                        className={`form-control form-control-lg ${errors.username && touched.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                      />
                      <ErrorMessage className="invalid-feedback" component="div" name="username" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="password" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif' }}>
                        Password
                      </label>
                      <Field
                        className={`form-control form-control-lg ${errors.password && touched.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                      />
                      <ErrorMessage className="invalid-feedback" component="div" name="password" />
                      <div className="form-text mt-1">Default: admin / changeme</div>
                    </div>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary btn-lg fw-bold shadow-sm"
                        disabled={isLoading || isSubmitting}
                        type="submit"
                      >
                        {isLoading ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Logging in...
                          </>
                        ) : (
                          'Login'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header>
                  <Modal.Title>Login Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="d-flex align-items-center text-danger border border-2 border-danger rounded p-3" style={{ fontWeight: 'bold', fontSize: '1.1rem', background: '#fff8f8' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982 4.905a.905.905 0 1 1 1.81 0l-.35 3.507a.552.552 0 0 1-1.11 0L8 6.47zm.002 6.002a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <span>{loginError}</span>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
