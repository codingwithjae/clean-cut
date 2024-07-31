import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../assets/logo.webp';
import Button from '../Atoms/Button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full h-auto flex justify-center p-5">
      <nav className="hidden md:flex w-full items-center justify-between px-4 lg:px-8">
        {/* Navigation Links (Left) */}
        <ul className="hidden md:flex items-center gap-8">
          <li className="cursor-pointer hover:text-blue-500">Features</li>
        </ul>

        {/* Logo (Center) */}
        <div className="flex justify-center items-center h-24 absolute left-1/2 transform -translate-x-1/2">
          <img className="w-72 cursor-pointer" src={logo} alt="Logo of the app" />
        </div>

        {/* Buttons (Right) */}
        <div className="hidden md:flex items-center gap-8">
          <Button text="Login" />
          <Button text="Sign Up" />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden flex w-full items-center justify-between px-4">
        {/* Logo */}
        <div className="flex justify-start items-center">
          <img className="w-24 h-auto cursor-pointer" src={logo} alt="Logo of the app" />
        </div>

        {/* Hamburger Menu */}
        <button className={`text-white focus:outline-none transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Dropdown Menu (Mobile) */}
      <ul className={`${isMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col items-center gap-8 absolute top-16 left-0 w-full bg-gray-900 p-4 transition-all duration-300`}>
        <li className="cursor-pointer hover:text-blue-500">Features</li>
        <li className="cursor-pointer hover:text-blue-500">FAQs</li>
        <Button text="Login" />
        <Button text="Sign Up" />
      </ul>
    </header>
  );
}
