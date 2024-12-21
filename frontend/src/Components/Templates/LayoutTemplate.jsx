import Navbar from '../Organisms/Navbar'

export default function LayoutTemplate({ children }) {
  return (
    <>
      <header className='max-w-7xl flex justify-center items-center mx-auto lg:mt-10'>
        <Navbar />
      </header>

      <main className='max-w-7xl mt-10 mb-10 md:mt-30 md:mb-30 lg:mt-20 lg:mb-20 items-center justify-center mx-auto'>
        {children}
      </main>
    </>
  )
}
