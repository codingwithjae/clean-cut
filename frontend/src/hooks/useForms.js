import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import AuthService from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'

export default function useForms() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handleLogin = async e => {
    e.preventDefault()

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email || !password) {
      toast.error('You must enter an email and a password')
      return false
    }

    if (!emailValidation.test(email)) {
      toast.error('Please, enter a valid email')
      return false
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }

    try {
      const response = await AuthService.Login({ email, password })
      const token = response?.data?.accessToken

      if (response.status === 200) {
        // Usar el método login del contexto en lugar de establecer el token manualmente
        login(token)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      toast.error('You must register first')
    }
  }

  const handleRegistration = async e => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('You must enter an email and a password')
      return false
    }

    try {
      const response = await AuthService.Register({ email, password })

      if (response.status === 201) {
        toast.success('Registration successful, now you can login.')
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error in the registration process')
      if (error.response.status === 409) {
        toast.error('Email already exists')
      } else if (error.response.status === 422) {
        toast.error('Invalid email format')
      } else {
        toast.error('Registration failed')
      }
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
