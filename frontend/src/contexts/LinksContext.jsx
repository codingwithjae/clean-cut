import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import linkService from '../api/links.api'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

const LinksContext = createContext()

export function useLinks() {
  return useContext(LinksContext)
}

export function LinksProvider({ children }) {
  const [links, setLinks] = useState([])
  const { isAuthenticated } = useAuth()

  // Cargar links solo si está autenticado
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchLinks = async () => {
      try {
        const response = await linkService.getMyLinks()
        setLinks(response.data)
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch links'
        toast.error(errorMessage)
      }
    }
    fetchLinks()
  }, [isAuthenticated])

  const addLink = useCallback(linkObj => {
    setLinks(prev => [...prev, linkObj])
  }, [])

  const updateLink = useCallback((id, updatedLink) => {
    setLinks(prev => prev.map(link => (link.id === id ? updatedLink : link)))
  }, [])

  const deleteLink = useCallback(shortId => {
    setLinks(prev => prev.filter(link => link.shortId !== shortId))
  }, [])

  const value = {
    links,
    setLinks,
    addLink,
    updateLink,
    deleteLink,
  }

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>
}
