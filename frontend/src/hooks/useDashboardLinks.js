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
      const response = await linkService.deleteLink(shortId)
      deleteLink(shortId)
      toast.success(response.data.message || 'Link deleted successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error deleting your link'
      toast.error(errorMessage)
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
      toast.success(response.data.message || 'Link updated successfully')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update link'
      toast.error(errorMessage)
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
