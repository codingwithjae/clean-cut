import React from 'react';
import Navbar from '../Organisms/Navbar';

export default function LayoutTemplate({ children }) {
  return (
    <>
      <header className="max-w-7xl flex justify-center items-center mx-auto">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mt-20 items-center justify-center mx-auto">{children}</main>
    </>
  );
}
