import { useState, useEffect } from 'react'


export default function useDashboardModalAnimation(isOpen, onClose) {
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            setTimeout(() => setIsAnimating(true), 30)
        } else if (!isOpen && isVisible) {
            setIsAnimating(false)
            // Espera la animación antes de ocultar
            const timeout = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timeout)
        }
    }, [isOpen, isVisible])

    // Cierra el modal con animación
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