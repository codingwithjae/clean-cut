import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import { useLinks } from '../../contexts/LinksContext'

export default function ShortenForm({ onSuccess }) {
  const { 
    url, 
    setUrl, 
    shortened, 
    setShortened, 
    shortenUrl, 
    copyToClipboard 
  } = useLinks()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await shortenUrl(url)
    if (result && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form className='w-full max-w-xl mx-auto px-4' onSubmit={handleSubmit} noValidate>
      <fieldset className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full'>
        <div className='w-full sm:w-1/2'>
          <Input
            placeholder='Enter a link to be shortened'
            required
            value={shortened || url}
            onChange={e => {
              setUrl(e.target.value)
              setShortened('')
            }}
            actionButton={shortened ? {
              icon: 'copy',
              ariaLabel: 'Copy shortened link'
            } : null}
            onActionClick={() => copyToClipboard(shortened)}
          />
        </div>
        <Button
          type='submit'
          variant='large'
          text='Shorten link'
          className='w-full sm:w-[180px] h-[60px] text-lg'
        />
      </fieldset>
    </form>
  )
}
