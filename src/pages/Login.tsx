import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Validation schema for the login form
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    setLoginError(null);

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
      // Handle login errors
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Login</h2>

              {loginError && (
                <div className="alert alert-danger" role="alert">
                  {loginError}
                </div>
              )}

              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                      <Field
                        className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        type="text"
                      />
                      <ErrorMessage className="invalid-feedback" component="div" name="username" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                      <Field
                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                      />
                      <ErrorMessage className="invalid-feedback" component="div" name="password" />
                      <div className="form-text mt-1">Default: admin / changeme</div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
