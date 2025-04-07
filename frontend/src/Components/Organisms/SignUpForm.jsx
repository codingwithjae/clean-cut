import Button from '../Atoms/Button'
import { useModal } from '../../hooks/useModal'
import useForms from '../../hooks/useForms'

export default function SignUpForm() {
  const { handleClose, isVisible, isAnimating } = useModal()
  const { email, password, handleEmailChange, handlePasswordChange, handleRegistration } =
    useForms()

  if (!isVisible) return null

  return (
    <section
      role='dialog'
      aria-modal='true'
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 transition-opacity duration-300 ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-gray-800 p-10 rounded-lg shadow-lg w-[350px] h-[420px] flex flex-col justify-center transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <div className='flex justify-between items-center border-b border-b-gray-400 pb-4'>
          <h2 className='text-2xl font-semibold text-white'>Sign Up</h2>
          <Button
            variant='icon'
            icon='close'
            type='button'
            onClick={handleClose}
            ariaLabel='Close modal'
          />
        </div>

        <form className='mt-4 space-y-4' onSubmit={handleRegistration} noValidate>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-400'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={handleEmailChange}
              className='mt-1 w-full px-4 py-2 text-white bg-transparent border-2 border-gray-700 rounded-lg placeholder-gray-300 focus:outline-none focus:border-cerulean-blue-800'
              placeholder='Enter your email'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-400'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={password}
              onChange={handlePasswordChange}
              className='mt-1 w-full px-4 py-2 text-white bg-transparent border-2 border-gray-700 rounded-lg placeholder-gray-300 focus:outline-none focus:border-cerulean-blue-800'
              placeholder='Enter your password'
            />
          </div>

          <div className='flex justify-center'>
            <Button text='Register' type='submit' variant='large' />
          </div>
        </form>
      </div>
    </section>
  )
}
