import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import linkService from '../api/links.api'
import { toast } from 'react-toastify'

export function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'ftp:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

export default function useShortenForm({ onSuccess, onCreateLink }) {
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState('')
  const { isAuthenticated } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!url) {
      toast.error('Please enter a URL')
      return
    }
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL (must start with http://, https://, or ftp://)')
      return
    }
    try {
      let response
      if (isAuthenticated) {
        response = await linkService.createLink(url)
        setShortened(`http://localhost:4000/${response.data.shortId}`)
      } else {
        response = await linkService.createLinkPublic(url)
        setShortened(response.data.shortUrl)
      }
      toast.success(response.data.message || 'Link shortened successfully!')
      if (onCreateLink) onCreateLink(response.data)
      setUrl('')
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error shortening link:', error)
      const errorMessage = error.response?.data?.message || 'Error shortening link'
      toast.error(errorMessage)
    }
  }

  return {
    url,
    shortened,
    setUrl,
    setShortened,
    handleSubmit,
  }
}
