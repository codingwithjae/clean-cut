import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import AuthService from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'

export default function useForms() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const response = await AuthService.Login({ email, password })
      const token = response?.data?.accessToken

      if (response.status === 200) {
        login(token)
        toast.success(response.data.message)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error.response?.data?.message || 'An error occurred during login'
      toast.error(errorMessage)
    }
  }

  const handleRegistration = async e => {
    e.preventDefault()

    try {
      const response = await AuthService.Register({ email, password })

      if (response.status === 201) {
        toast.success(response.data.message)
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error.response?.data?.message || 'An error occurred during registration'
      toast.error(errorMessage)
      setEmail('')
      setPassword('')
      return false
    }
  }

  return {
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    handleRegistration,
  }
}
