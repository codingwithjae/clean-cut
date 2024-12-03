import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Si está cargando, podrías mostrar un spinner o similar
  if (isLoading) {
    return <div>Cargando...</div>
  }

  // Si está autenticado, mostramos el contenido protegido
  // Si no, redirigimos al login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoutes
