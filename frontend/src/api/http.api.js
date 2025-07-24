import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL

const requests = axios.create({
  baseURL: BASE_URL || 'http://localhost:5000',
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


export default requests
