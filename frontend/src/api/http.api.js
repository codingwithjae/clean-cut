import axios from 'axios'

const requests = axios.create({
  baseURL: 'http://localhost:4000',
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
