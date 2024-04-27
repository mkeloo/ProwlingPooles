import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo2x.png';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp > Date.now() / 1000) {
          navigate('/dashboard'); // Redirect to dashboard if token is valid and not expired
        }
      } catch {
        localStorage.removeItem('token'); // Remove invalid token if error occurs during decoding
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        {
          email: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : 'Login failed, please try again.'
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          <div className="text-center mb-4">
            <div className="flex-shrink-0 flex items-center mx-auto bg-black rounded-xl p-4">
              <img className="h-16 w-auto" src={logo} alt="Prowling Pooles" />
              <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-yellow-600 bg-clip-text">
                Prowling Pooles
              </div>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Login
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
          <div className="text-sm text-center">
            <a
              href="/registration"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Need to create an account? Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
