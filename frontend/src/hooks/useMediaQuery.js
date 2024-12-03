import { useState, useEffect } from 'react'

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Actualizar estado inicial
    setMatches(media.matches)

    // Definir callback
    const listener = event => {
      setMatches(event.matches)
    }

    // Añadir listener
    media.addEventListener('change', listener)

    // Limpiar al desmontar
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}
