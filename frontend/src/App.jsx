import React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutTemplate from './Components/Templates/LayoutTemplate';
import HomePage from './Components/Page/HomePage';
import FeaturesModal from './Components/Organisms/Features';
import LoginForm from './Components/Organisms/LoginForm';
import SignUpForm from './Components/Organisms/SignUpForm';

function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <ToastContainer />
      <LayoutTemplate>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>

        {location.pathname === '/features' && <FeaturesModal />}
        {location.pathname === '/login' && <LoginForm />}
        {location.pathname === '/signup' && <SignUpForm />}
      </LayoutTemplate>
    </>
  );
}

export default App;
