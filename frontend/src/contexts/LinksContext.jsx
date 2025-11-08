import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import linkService from '../api/links.api'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'
import useCopyToClipboard from '../hooks/useCopyToClipboard'

const LinksContext = createContext()

export function useLinks() {
  return useContext(LinksContext)
}

export function LinksProvider({ children }) {
  const [links, setLinks] = useState([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isShortenFormOpen, setIsShortenFormOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [newShortId, setNewShortId] = useState('')
  const [url, setUrl] = useState('')
  const [shortened, setShortened] = useState('')
  const { isAuthenticated } = useAuth()
  const copyToClipboard = useCopyToClipboard()

  // Fetch links on authentication change
  useEffect(() => {
    if (!isAuthenticated) return
    fetchLinks()
  }, [isAuthenticated])

  // Fetch links function
  const fetchLinks = async () => {
    try {
      const response = await linkService.getMyLinks()
      setLinks(response.data)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch links'
      toast.error(errorMessage)
    }
  }

  // Add a new link to the state
  const addLink = useCallback(linkObj => {
    setLinks(prev => [...prev, linkObj])
  }, [])

  // Update a link in the state
  const updateLink = useCallback((id, updatedLink) => {
    setLinks(prev => prev.map(link => (link.id === id ? updatedLink : link)))
  }, [])

  // Delete a link from the state
  const deleteLink = useCallback(shortId => {
    setLinks(prev => prev.filter(link => link.shortId !== shortId))
  }, [])

  // Handle link deletion
  const handleDelete = async shortId => {
    try {
      const response = await linkService.deleteLink(shortId)
      deleteLink(shortId)
      toast.success(response.data.message || 'Link deleted successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error deleting your link'
      toast.error(errorMessage)
    }
  }

  // Edit link functions
  const handleEditLink = link => {
    setEditingLink(link)
    setNewShortId(link.shortId)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async shortId => {
    try {
      const response = await linkService.updateLink(editingLink.shortId, shortId)
      updateLink(editingLink.id, response.data)
      setIsEditDialogOpen(false)
      toast.success(response.data.message || 'Link updated successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update link'
      toast.error(errorMessage)
    }
  }

  // Modal handling
  const openShortenForm = () => {
    setIsShortenFormOpen(true)
  }

  const closeShortenForm = () => {
    setIsShortenFormOpen(false)
  }

  // URL shortening functions
  const shortenUrl = async (urlToShorten) => {
    if (!urlToShorten) {
      toast.error('Please enter a URL')
      return
    }

    try {
      let response
      if (isAuthenticated) {
        response = await linkService.createLink(urlToShorten)
        setShortened(`http://localhost:5000/${response.data.shortId}`)
        addLink(response.data)
      } else {
        response = await linkService.createLinkPublic(urlToShorten)
        setShortened(response.data.shortUrl)
      }
      toast.success(response.data.message || 'Link shortened successfully!')
      setUrl('')
      return response.data
    } catch (error) {
      console.error('Error shortening link:', error)
      const errorMessage = error.response?.data?.message || 'Error shortening link'
      toast.error(errorMessage)
    }
  }

  const value = {
    // Data
    links,
    setLinks,
    url,
    setUrl,
    shortened,
    setShortened,
    newShortId,
    setNewShortId,
    editingLink,

    // Modal state
    isEditDialogOpen,
    setIsEditDialogOpen,
    isShortenFormOpen,
    setIsShortenFormOpen,

    // Link operations
    addLink,
    updateLink,
    deleteLink,
    handleDelete,
    handleEditLink,
    handleSaveEdit,

    // Modal operations
    openShortenForm,
    closeShortenForm,

    // URL operations
    shortenUrl,

    // Utility functions
    copyToClipboard
  }

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>
}
