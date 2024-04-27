import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  let username = 'User';

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.log('Token is expired');
        logout();
        return;
      }

      username = decodedToken.username || username;
    } catch (error) {
      console.error('Failed to decode token:', error);
      logout();
      return;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>This is your personalized dashboard.</p>
      <button
        onClick={logout}
        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
