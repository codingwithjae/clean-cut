import { toast } from 'react-toastify'

export default function useCopyToClipboard() {
  return text => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'))
  }
}
