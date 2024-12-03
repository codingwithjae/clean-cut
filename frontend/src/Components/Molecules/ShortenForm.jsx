import { useState } from 'react'
import Input from '../Atoms/Input'
import Button from '../Atoms/Button'
import { useAuth } from '../../contexts/AuthContext'
import linkService from '../../api/links.api'
import { toast } from 'react-toastify'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'
import useShortenForm from '../../hooks/useShortenForm'

export default function ShortenForm({ onSuccess, onCreateLink }) {
  const {
    url,
    shortened,
    setUrl,
    setShortened,
    handleSubmit
  } = useShortenForm({ onSuccess, onCreateLink })
  const copyToClipboard = useCopyToClipboard()

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <fieldset className='flex flex-col md:flex-row items-center justify-center gap-4'>
        <div className='relative w-full md:w-auto'>
          <Input
            placeholder='Enter a link to be shortened'
            required
            value={shortened || url}
            onChange={e => {
              setUrl(e.target.value)
              setShortened('')
            }}
          />
          <Button
            variant='iconButton'
            icon='copy'
            onClick={() => {
              if (shortened) {
                copyToClipboard(shortened)
              } else {
                toast.info('No link to copy yet')
              }
            }}
            ariaLabel='Copy shortened link'
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10'
          />
        </div>
        <Button type='submit' variant='normal' text='Shorten link' />
      </fieldset>
    </form>
  )
}
