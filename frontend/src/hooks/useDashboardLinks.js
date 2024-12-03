import { useState } from 'react'
import { toast } from 'react-toastify'
import linkService from '../api/links.api'
import { useLinks } from '../contexts/LinksContext'

export default function useDashboardLinks() {
  const { links, addLink, updateLink, deleteLink } = useLinks()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isShortenFormOpen, setIsShortenFormOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [newShortId, setNewShortId] = useState('')

  const handleDelete = async shortId => {
    try {
      await linkService.deleteLink(shortId)
      deleteLink(shortId)
    } catch {
      toast.error('There was an error deleting your link')
    }
  }

  const handleEditLink = link => {
    setEditingLink(link)
    setNewShortId(link.shortId)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async newShortId => {
    try {
      const response = await linkService.updateLink(editingLink.shortId, newShortId)
      updateLink(editingLink.id, response.data)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error('Failed to update link')
    }
  }

  const openShortenForm = () => {
    setIsShortenFormOpen(true)
  }

  const addNewLink = linkObj => {
    addLink(linkObj)
  }

  return {
    links,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isShortenFormOpen,
    setIsShortenFormOpen,
    editingLink,
    setEditingLink,
    newShortId,
    setNewShortId,
    handleDelete,
    handleEditLink,
    handleSaveEdit,
    openShortenForm,
    addNewLink,
  }
}
