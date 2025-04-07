import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LayoutTemplate from './Components/Templates/LayoutTemplate'
import HomePage from './Components/Page/HomePage'
import FeaturesModal from './Components/Organisms/Features'
import LoginForm from './Components/Organisms/LoginForm'
import SignUpForm from './Components/Organisms/SignUpForm'
import DashboardPage from './Components/Page/DashboardPage'
import PrivateRoute from './routes/PrivateRoute'
import { AuthProvider } from './contexts/AuthContext'
import { LinksProvider } from './contexts/LinksContext'
import '/global.css'
import 'react-toastify/dist/ReactToastify.css'
import NotFoundPage from './Components/Page/NotFoundPage'

function App() {
  const location = useLocation()
  // Usa backgroundLocation para determinar si un modal debe mostrarse
  const background = location.state?.backgroundLocation

  return (
    <AuthProvider>
      <LinksProvider>
        <LayoutTemplate>
          {/* Rutas principales */}
          <Routes location={background || location}>
            <Route path='/' element={<HomePage />} />
            <Route path='/dashboard' element={<PrivateRoute />}>
              <Route index element={<DashboardPage />} />
            </Route>
            {/* En rutas normales, los modales son páginas completas */}
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignUpForm />} />
            <Route path='/features' element={<HomePage />} />
            {/* Ruta 404 */}
            <Route path='*' element={<NotFoundPage />} />
          </Routes>

          {/* Rutas de modales - solo se muestran cuando hay una backgroundLocation */}
          {background && (
            <Routes>
              <Route path='/features' element={<FeaturesModal />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/signup' element={<SignUpForm />} />
            </Routes>
          )}
        </LayoutTemplate>
        <ToastContainer />
      </LinksProvider>
    </AuthProvider>
  )
}

export default App
