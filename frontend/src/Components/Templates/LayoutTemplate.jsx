import React from 'react'
import Navbar from '../Organisms/Navbar'

export default function LayoutTemplate({ children }) {
  return (
    <>
      <header className='max-w-7xl flex justify-center items-center mx-auto lg:mt-10'>
        <Navbar />
      </header>

      <main className='max-w-7xl mt-20 mb-20 md:mt-30 md:mb-30 lg:mt-40 lg:mb-40 items-center justify-center mx-auto'>
        {children}
      </main>
    </>
  )
}
