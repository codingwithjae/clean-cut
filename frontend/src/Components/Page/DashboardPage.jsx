import React from 'react'
import Dashboard from '../Organisms/Dashboard'
import EditLinkModal from '../Molecules/EditLinkModal'
import DashboardModal from '../Molecules/DashboardModal'
import useDashboardLinks from '../../hooks/useDashboardLinks'
import useCopyShortUrlToClipboard from '../../hooks/useCopyShortUrlToClipboard'

export default function DashboardPage() {
  const {
    links,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isShortenFormOpen,
    setIsShortenFormOpen,
    editingLink,
    newShortId,
    setNewShortId,
    handleDelete,
    handleEditLink,
    handleSaveEdit,
    openShortenForm,
    addNewLink,
  } = useDashboardLinks()
  const copyToClipboard = useCopyShortUrlToClipboard()

  return (
    <>
      <Dashboard
        links={links}
        onDelete={handleDelete}
        onEdit={handleEditLink}
        onCopy={copyToClipboard}
        onAddNew={openShortenForm}
      />

      {isShortenFormOpen && (
        <DashboardModal onClose={() => setIsShortenFormOpen(false)} onCreateLink={addNewLink} />
      )}

      {isEditDialogOpen && (
        <EditLinkModal
          link={editingLink}
          shortId={newShortId}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEdit}
          onShortIdChange={setNewShortId}
        />
      )}
    </>
  )
}
