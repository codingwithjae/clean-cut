import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import linkService from '../api/links.api'
import { toast } from 'react-toastify'

export default function useShortenForm({ onSuccess, onCreateLink }) {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState('')
  const { isAuthenticated } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!url) return
    try {
      let response
      if (isAuthenticated) {
        response = await linkService.createLink(url)
        // Mostrar el shortUrl en el input para usuarios autenticados
        setShortened(`http://localhost:4000/${response.data.shortId}`)
        toast.success('Link shortened successfully!')
      } else {
        response = await linkService.createLinkPublic(url)
        setShortened(response.data.shortUrl)
        toast.success('Link shortened successfully!')
      }
      if (onCreateLink) onCreateLink(response.data)
      setUrl('')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error shortening link:', error)
      toast.error('Error shortening link')
    }
  }

  return {
    url,
    shortened,
    setUrl,
    setShortened,
    handleSubmit
  }
}
