import Button from '../Atoms/Button'
import useCloseModal from '../../hooks/handleModal'

export default function FeaturesModal() {
  const handleModal = useCloseModal()

  return (
    <section className='fixed inset-0 bg-black/55 flex items-center justify-center z-50'>
      <div className='bg-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-6 md:mx-8 p-8'>
        <article className='flex justify-between items-center border-b border-gray-700 pb-4'>
          <h2 className='text-2xl font-semibold text-white'>Features</h2>
          <Button variant='icon' icon='close' onClick={handleModal} ariaLabel='Close modal' />
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
          <Button text='Get Started' onClick={handleModal} variant='normal' />
        </div>
      </div>
    </section>
  )
}
