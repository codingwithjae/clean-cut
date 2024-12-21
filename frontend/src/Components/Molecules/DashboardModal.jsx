import Button from '../Atoms/Button'
import ShortenForm from './ShortenForm'
import useDashboardModalAnimation from '../../hooks/useDashboardModalAnimation'

export default function DashboardModal({ onClose, onCreateLink, isOpen }) {
  const { isVisible, isAnimating, handleClose } = useDashboardModalAnimation(isOpen, onClose)

  const handleSuccess = () => {
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
    >
      <article className={`bg-gray-800 rounded-lg w-full max-w-2xl mx-auto shadow-lg relative transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className='absolute right-4 top-4 z-10'>
          <Button variant='icon' icon='close' onClick={handleClose} ariaLabel='Close modal' />
        </div>

        <div className='p-8 flex flex-col items-center justify-center'>
          <h3 id='modal-title' className='text-xl font-semibold text-white mb-6 text-center'>
            Create New Link
          </h3>
          <ShortenForm onSuccess={handleSuccess} onCreateLink={onCreateLink} />
        </div>
      </article>
    </div>
  )
}
