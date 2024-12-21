import Dashboard from '../Organisms/Dashboard'
import EditLinkModal from '../Molecules/EditLinkModal'
import DashboardModal from '../Molecules/DashboardModal'
import useDashboardLinks from '../../hooks/useDashboardLinks'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'

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
  const copyToClipboard = useCopyToClipboard()

  return (
    <>
      <Dashboard
        links={links}
        onDelete={handleDelete}
        onEdit={handleEditLink}
        onCopy={shortId => copyToClipboard(`http://localhost:4000/${shortId}`)}
        onAddNew={openShortenForm}
      />

      {isShortenFormOpen && (
        <DashboardModal isOpen={isShortenFormOpen} onClose={() => setIsShortenFormOpen(false)} onCreateLink={addNewLink} />
      )}

      {isEditDialogOpen && (
        <EditLinkModal
          isOpen={isEditDialogOpen}
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
