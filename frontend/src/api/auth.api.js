import requests from './http.api'

const AuthService = {
  Login(body) {
    return requests.post('/api/v1/login', body)
  },
  Register(body) {
    return requests.post('/api/v1/register', body)
  },
}

export default AuthService
