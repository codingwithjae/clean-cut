import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

export default function useModals() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        setTimeout(() => {
            setIsAnimating(true)
        }, 50)
    }, [])

    const closeModal = () => {
        setIsAnimating(false)
        setTimeout(() => {
            setIsVisible(false)
            if (location.state?.backgroundLocation) {
                navigate(location.state.backgroundLocation.pathname)
            } else {
                navigate(-1)
            }
        }, 300)
    }

    return {
        isVisible,
        isAnimating,
        closeModal,
    }

}
