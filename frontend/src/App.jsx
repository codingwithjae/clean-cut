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

function App() {
  const location = useLocation()
  const state = location.state

  return (
    <AuthProvider>
      <LinksProvider>
        <LayoutTemplate>
          <Routes location={state?.backgroundLocation || location}>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/signup' element={<SignUpForm />} />
            <Route path='/feature' element={<SignUpForm />} />

            <Route path='/dashboard' element={<PrivateRoute />}>
              <Route index element={<DashboardPage />} />
            </Route>
          </Routes>

          {location.pathname === '/features' && <FeaturesModal />}
          {location.pathname === '/login' && <LoginForm />}
          {location.pathname === '/signup' && <SignUpForm />}
        </LayoutTemplate>
        <ToastContainer />
      </LinksProvider>
    </AuthProvider>
  )
}

export default App
