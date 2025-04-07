import { toast } from 'react-toastify'

export default function useCopyToClipboard() {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy')
      console.error('Failed to copy: ', err)
    }
  }

  return copyToClipboard
} 