import Button from '../Atoms/Button'
import { useDashboardModal } from '../../hooks/useModal'
import Input from '../Atoms/Input'
import { useLinks } from '../../contexts/LinksContext'

export default function EditLinkModal() {
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    shortId: currentShortId, 
    newShortId, 
    setNewShortId, 
    handleSaveEdit 
  } = useLinks()
  
  const { isVisible, isAnimating, handleClose } = useDashboardModal(
    isEditDialogOpen, 
    () => setIsEditDialogOpen(false)
  )

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-gray-800 rounded-lg w-full max-w-lg mx-auto relative transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className='absolute right-4 top-4'>
          <Button variant='icon' icon='close' onClick={handleClose} ariaLabel='Close modal' />
        </div>

        <div className='px-6 py-4 border-b border-gray-600'>
          <h3 className='text-lg font-medium text-white'>Edit Short ID</h3>
          <p className='text-sm text-gray-400 mt-1'>Enter a new custom short ID for this link.</p>
        </div>
        <div className='p-6'>
          <div>
            <label htmlFor='short-id' className='block text-sm font-medium text-white mb-1'>
              Short ID
            </label>
            <Input
              id='short-id'
              type='text'
              value={newShortId}
              onChange={e => setNewShortId(e.target.value)}
              placeholder='Enter custom short ID'
              autoFocus
            />
          </div>
          <div className='flex justify-end mt-6'>
            <Button text='Save Changes' onClick={() => handleSaveEdit(newShortId)} />
          </div>
        </div>
      </div>
    </div>
  )
}
