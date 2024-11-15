import React, { useState } from 'react';
import logo from '../../assets/logo.webp';
import Button from '../Atoms/Button';
import { Link, useLocation } from 'react-router';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const location = useLocation();

  return (
    <nav className="w-full md:h-0 p-4 text-white bg-gray-800 md:bg-gray-900 lg:px-8">
      <section className="flex items-center justify-between">
        <figure className="flex items-center justify-start w-30 md:w-40">
          <img className="w-full object-contain cursor-pointer" src={logo} alt="Logo of the app" />
        </figure>

        {isMobile && <Button variant="icon" icon="menu" onClick={toggleMenu} ariaLabel="Toggle menu" isMenuOpen={isMenuOpen} />}

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isMobile
              ? isMenuOpen
                ? 'absolute top-14 left-0 w-full flex-col p-6 bg-gray-800 shadow-md z-50 opacity-100 scale-100'
                : 'absolute top-14 left-0 w-full flex-col p-6 bg-gray-800 shadow-md z-50 opacity-0 scale-95 pointer-events-none'
              : 'md:flex opacity-100 scale-100'
          } flex items-center gap-10`}
        >
          <ul className="flex items-center gap-6">
            <li className="cursor-pointer hover:text-blue-500">
              <Link to="/features" state={{ backgroundLocation: location }}>
                Features
              </Link>
            </li>
          </ul>
          <Link to="/login" state={{ backgroundLocation: location }}>
            <Button text="Login" variant={isMobile ? undefined : 'small'} />
          </Link>
          <Link to="/signup" state={{ backgroundLocation: location }}>
            <Button text="Sign Up" variant={isMobile ? undefined : 'small'} />
          </Link>
        </div>
      </section>
    </nav>
  );
}
