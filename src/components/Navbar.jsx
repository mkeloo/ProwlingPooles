import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo2x.png';
// user icon from react icons
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-black text-white">
      {/* <div className="max-w-7xl mx-auto "> */}
      <div className="max-w-7xl mx-auto ">
        <div className="relative flex items-center justify-between h-20">
          <div className="flex-1 flex items-center justify-start sm:items-stretch sm:justify-start ">
            <div className="flex-shrink-0 flex items-center mx-2">
              <img
                className=" h-[74px] w-auto ml-8"
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
          </div>

          {/* Menu items */}
          <div className="sm:block sm:ml-6">
            <div className="flex space-x-4">
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
                Feature 5
              </Link>
              <div>
                {/* <Link to="/login">
                  <FaUser className="text-2xl text-white" />
                </Link> */}
                <Link to="/registration">
                  <FaUser className="text-2xl text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
