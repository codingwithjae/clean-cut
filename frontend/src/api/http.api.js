import axios from 'axios'
import { toast } from 'react-toastify'

const requests = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

requests.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar expiración de sesión
requests.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      toast.error('Tu sesión expiró, por favor inicia sesión de nuevo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default requests
