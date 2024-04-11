import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2x.png';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // loginf for now 'test' username and 'dummy' password
    if (username === 'test' && password === 'dummy') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-md">
          {/* Logo and title */}
          <div className="text-center mb-4 ">
            <div className="flex-shrink-0 flex items-center mx-4 bg-black rounded-xl p-4">
              <img
                className="mx-auto h-16 w-auto"
                src={logo}
                alt="Prowling Pooles"
              />
              <div className="mx-4">
                <span className="block font-bold text-2xl leading-none bg-gradient-to-r from-orange-400 to-yellow-600 text-transparent bg-clip-text hover:cursor-pointer">
                  Prowling
                </span>
                <span className="block font-bold text-2xl leading-none bg-gradient-to-r from-orange-400 to-yellow-600 text-transparent bg-clip-text hover:cursor-pointer">
                  Pooles
                </span>
              </div>
            </div>
            <div>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                Login
              </h2>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs mt-4">
            Use "test" for username and "dummy" for password.
          </p>
          <div className="text-sm text-center">
            <a
              href="/register"
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
