import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import logo from '../assets/logo2x.png';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       const currentTime = Date.now() / 1000;
  //       if (decodedToken.exp > currentTime) {
  //         navigate('/dashboard');
  //       }
  //     } catch (error) {
  //       console.error('Token decoding failed:', error);
  //     }
  //   }
  // }, [navigate]);

  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto ">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0 flex items-center mx-2">
              <img
                className="h-[74px] w-auto ml-8"
                src={logo}
                alt="Prowling Pooles"
              />
              <div className="mx-4">
                <span className="block font-bold text-2xl leading-none bg-gradient-to-r from-orange-400 to-yellow-600 text-transparent bg-clip-text">
                  Prowling
                </span>
                <span className="block font-bold text-2xl leading-none bg-gradient-to-r from-orange-400 to-yellow-600 text-transparent bg-clip-text">
                  Pooles
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="sm:block sm:ml-6">
            <div className="flex space-x-4">
              {/* Links */}
              <Link
                to="/"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/feature1"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Feature 1
              </Link>
              <Link
                to="/feature2"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Feature 2
              </Link>
              <Link
                to="/feature3"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Feature 3
              </Link>
              <Link
                to="/feature4"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Feature 4
              </Link>
              <Link
                to="/feature5"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Team Peformance Analyzer
              </Link>
              <Link
                to="/registration"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaUser className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
