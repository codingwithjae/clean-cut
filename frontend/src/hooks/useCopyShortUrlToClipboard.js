import { toast } from 'react-toastify'

export default function useCopyShortUrlToClipboard() {
  return shortId => {
    const backendBaseUrl = 'http://localhost:4000'
    const shortUrl = `${backendBaseUrl}/${shortId}`
    navigator.clipboard
      .writeText(shortUrl)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'))
  }
}
