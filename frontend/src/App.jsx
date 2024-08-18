import React from 'react';
// import { ToastContainer } from 'react-toastify';
import LayoutTemplate from './Components/Templates/LayoutTemplate';
import HomePage from './Components/Page/HomePage';

function App() {
  return (
    <LayoutTemplate>
      <HomePage />
      {/* <ToastContainer position="bottom-right" autoClose={3000} /> */}
    </LayoutTemplate>
  );
}

export default App;