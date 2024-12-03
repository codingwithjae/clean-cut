import Button from '../Atoms/Button'
import ShortenForm from './ShortenForm'

export default function DashboardModal({ onClose, onCreateLink }) {
  const handleSuccess = () => {
    onClose()
  }

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 '
    >
      <article className='bg-gray-800 rounded-lg w-full max-w-2xl mx-auto shadow-lg relative'>
        <div className='absolute right-4 top-4 z-10'>
          <Button variant='icon' icon='close' onClick={onClose} ariaLabel='Close modal' />
        </div>

        <div className='p-8 flex flex-col items-center justify-center'>
          <h3 id='modal-title' className='text-xl font-semibold text-white mb-6 text-center'>
            Create New Link
          </h3>
          <ShortenForm onSuccess={handleSuccess} onCreateLink={onCreateLink} />
          {/* El botón de copiar ya está incluido en ShortenForm, así que los links generados aquí también pueden copiarse */}
        </div>
      </article>
    </div>
  )
}
