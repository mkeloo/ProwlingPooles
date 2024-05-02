import React from 'react';
import logo from '../assets/logo2x.png';
import { Link } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

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
    <nav className="bg-black ">
      <div className="max-w-7xl mx-auto ">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/">
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
            </Link>
          </div>

          {/* Menu items */}
          {/* <div className="sm:block sm:ml-6">
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
                Present Season Player Statistics
              </Link>
              <Link
                to="/feature2"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Player Performance Chart
              </Link>
              <Link
                to="/feature3"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Trade Analyzer
              </Link>
              <Link
                to="/feature4"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                NBA News
              </Link>
              <Link
                to="/feature5"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Team Peformance Analyzer
              </Link>
              <Link
                to="/login"
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaUser className="text-2xl" />
              </Link>
            </div>
          </div> */}

          {/* Menu items - Responsive Menu */}

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaBars />}
              aria-label="Options"
              variant="outline"
              size="lg"
              borderColor="transparent"
              color="white"
              _hover={{ bg: useColorModeValue('gray.700', 'gray.600') }}
            >
              Menu
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/login">
                Login
              </MenuItem>
              <MenuItem
                as={Link}
                to="/dashboard
              "
              >
                Dashboard
              </MenuItem>
              <MenuItem as={Link} to="/feature1">
                Player Lookup
              </MenuItem>
              <MenuItem as={Link} to="/feature2">
                Player Performance Chart
              </MenuItem>
              <MenuItem as={Link} to="/feature3">
                Trade Analyzer
              </MenuItem>
              <MenuItem as={Link} to="/feature4">
                NBA News
              </MenuItem>
              <MenuItem as={Link} to="/feature5">
                Team Performance Analyzer
              </MenuItem>
              {/* <MenuItem as={Link} to="/login">
                <Flex align="center">
                  <FaUser mr={2} />
                  <Text>Login</Text>
                </Flex>
              </MenuItem> */}
            </MenuList>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
