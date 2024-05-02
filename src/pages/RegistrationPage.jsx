import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp > Date.now() / 1000) {
          navigate('/dashboard');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://prowling-pooles-backend.onrender.com/api/auth/register',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Assuming the backend sends back a token upon successful registration
      const { token } = response.data; // Destructure the token from the response
      localStorage.setItem('token', token); // Store the token in localStorage
      setMessage('Registration successful! Redirecting to dashboard...');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard after a short delay
      }, 2000);
    } catch (error) {
      setMessage(
        error.response ? error.response.data.message : 'Registration failed!'
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Register</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              className="w-full px-4 py-2 mt-2 border rounded-md"
              required
            />
          </div>
          {message && (
            <div
              className={`mt-4 text-center py-2 px-4 rounded-md text-lg font-semibold ${
                isSuccess
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {message}
            </div>
          )}
          <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
            Register
          </button>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already have an account? Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
