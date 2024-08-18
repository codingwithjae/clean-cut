import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo.webp';
import Button from '../Atoms/Button';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)'); // Hook to detect mobile screens

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-gray-800 md:bg-gray-900 text-white px-4 lg:px-8 justify-center">
      <div className="flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center gap-8 flex-grow relative right-8">
          <img className="w-[200px] cursor-pointer" src={logo} alt="Logo of the app" />
        </div>

        {/* Toggle Button (Visible on Mobile) */}
        {isMobile && (
          <button
           className={`text-white focus:outline-none md:hidden transition-transform duration-300 ${
              isMenuOpen ? 'rotate-90' : 'rotate-0'
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ?  <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        )}

        {/* Navigation Links and Buttons */}
        <div className={`flex items-center gap-8 ${isMobile && isMenuOpen ? 'absolute top-20 left-0 w-full flex-col bg-gray-800 p-4 shadow-md z-50' : 'hidden md:flex'}`}>
          <ul className="flex items-center gap-6 duration-500 ease-in-out">
            <li className="cursor-pointer hover:text-blue-500">
              <a href="#features">Features</a>
            </li>
          </ul>
          <Button text="Login" variant={isMobile ? undefined : "small"} />
          <Button text="Sign Up" variant={isMobile ? undefined : "small"} />
        </div>
      </div>
    </nav>
  );
}