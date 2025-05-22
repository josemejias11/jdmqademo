import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(username, password);
      navigate('/tasks');
    } catch (err) {
      // Error is already handled in the AuthContext
      console.error('Login submission error:', err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Login</h2>
      <form
        className="card p-4 shadow-sm mx-auto"
        style={{ maxWidth: '400px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
