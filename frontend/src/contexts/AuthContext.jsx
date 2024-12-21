/* This code snippet is setting up an authentication context in a React application. Here's a breakdown
of what it does: */

import React, { createContext, useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  const login = token => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/', { replace: true, state: undefined })
    toast.info('Sesión cerrada')
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
