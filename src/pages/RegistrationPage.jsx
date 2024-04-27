import React, { useState } from 'react';
import axios from 'axios';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // State to hold error messages

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/register', // Corrected endpoint
        formData
      );
      console.log(response.data);
      // Handle the response further, like redirecting to a login page or showing success message
      setError(''); // Clear previous errors on successful registration
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data.message || error.message
      );
      setError(error.response?.data.message || 'Registration failed!'); // Set error message from server or fallback message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
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
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}{' '}
            {/* Display error message if present */}
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
