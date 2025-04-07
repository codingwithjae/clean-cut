import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function useModal(isOpen = true) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsAnimating(true), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])


  const openModal = (path) => {
    navigate(path, { 
      state: { backgroundLocation: location } 
    })
  }


  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      closeModal()
    }, 300)
  }


  const closeModal = () => {
    navigate(-1)
  }

  return { 
    openModal, 
    closeModal,
    handleClose, 
    isVisible, 
    isAnimating 
  }
}

export function useDashboardModal(isOpen, onClose) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 30)
    } else if (!isOpen && isVisible) {
      setIsAnimating(false)
  
      const timeout = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, isVisible])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)
  }

  return {
    isVisible,
    isAnimating,
    handleClose,
  }
} 