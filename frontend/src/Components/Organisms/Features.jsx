import Button from '../Atoms/Button'
import useModals from '../../hooks/useModals'

export default function FeaturesModal() {
  const { isVisible, isAnimating, closeModal } = useModals()

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
        className={`bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-6 md:mx-8 p-8 transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        <article className='flex justify-between items-center border-b border-gray-700 pb-4'>
          <h2 className='text-2xl font-semibold text-white'>Features</h2>
          <Button variant='icon' icon='close' onClick={closeModal} ariaLabel='Close modal' />
        </article>

        <article className='mt-4 text-gray-300'>
          <p className='mb-4'>Application features:</p>
          <ul className='list-disc list-inside space-y-3'>
            <li>
              <span className='font-semibold text-white'>Custom Short Links:</span> create short
              links for easy sharing. This works for unregistered and registered users
            </li>
            <li>
              <span className='font-semibold text-white'>Analytics Dashboard:</span> register in the
              app and be able to see, update, delete and track clicks of your shortened links
            </li>
          </ul>
        </article>

        <div className='mt-6 flex justify-center md:justify-end'>
          <Button text='Get Started' onClick={closeModal} variant='normal' />
        </div>
      </div>
    </section>
  )
}
