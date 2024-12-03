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
        toast.error('Failed to fetch links')
      }
    }
    fetchLinks()
  }, [isAuthenticated])

  const addLink = useCallback(linkObj => {
    setLinks(prev => [...prev, linkObj])
    toast.success('Link generated successfully')
  }, [])

  const updateLink = useCallback((id, updatedLink) => {
    setLinks(prev => prev.map(link => (link.id === id ? updatedLink : link)))
    toast.success('Link updated successfully')
  }, [])

  const deleteLink = useCallback(shortId => {
    setLinks(prev => prev.filter(link => link.shortId !== shortId))
    toast.success('Link deleted successfully')
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
