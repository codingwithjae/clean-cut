import React from 'react';
import { ToastContainer } from 'react-toastify';
import HomePage from './Components/Page/HomePage';

function App() {
  return (
    <>
      <HomePage />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
