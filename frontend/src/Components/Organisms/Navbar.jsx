import React, { useState } from 'react'
import logo from '../../assets/logo.webp'
import Button from '../Atoms/Button'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className='w-full p-4 text-white bg-gray-800 md:bg-gray-900 lg:px-8'>
      <section className='flex items-center justify-between'>
        <figure className='flex items-center justify-start w-30 md:w-40'>
          <Link to='/'>
            <img
              className='w-full object-contain cursor-pointer'
              src={logo}
              alt='Logo of the app'
            />
          </Link>
        </figure>

        <Button
          variant='icon'
          icon='menu'
          onClick={toggleMenu}
          ariaLabel='Toggle menu'
          isMenuOpen={isMenuOpen}
          className='md:hidden'
        />

        <div
          className={`flex items-center gap-10 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'absolute top-14 left-0 w-full flex-col p-6 bg-gray-800 shadow-md z-50 opacity-100 translate-y-0 md:relative md:top-0 md:left-0 md:w-auto md:flex-row md:bg-transparent md:shadow-none md:p-0 md:opacity-100 md:translate-y-0'
              : 'absolute top-14 left-0 w-full flex-col p-6 bg-gray-800 shadow-md z-50 opacity-0 -translate-y-4 pointer-events-none md:relative md:top-0 md:left-0 md:w-auto md:flex-row md:bg-transparent md:shadow-none md:p-0 md:opacity-100 md:translate-y-0 md:pointer-events-auto'
          }`}
        >
          <ul className='flex flex-col md:flex-row items-center gap-10'>
            <li className='cursor-pointer hover:text-blue-500'>
              <Link to='/features' state={{ backgroundLocation: location }}>Features</Link>
            </li>
            {isAuthenticated && (
              <li className='cursor-pointer hover:text-blue-500'>
                <Link to='/dashboard'>Dashboard</Link>
              </li>
            )}
          </ul>

          {isAuthenticated ? (
            <Button text='Logout' variant='small' onClick={handleLogout} />
          ) : (
            <>
              <Link to='/login' state={{ backgroundLocation: location }}>
                <Button text='Login' variant='small' />
              </Link>
              <Link to='/signup' state={{ backgroundLocation: location }}>
                <Button text='Sign Up' variant='small' />
              </Link>
            </>
          )}
        </div>
      </section>
    </nav>
  )
}
