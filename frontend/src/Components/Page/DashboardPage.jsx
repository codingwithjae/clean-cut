import Dashboard from '../Organisms/Dashboard'
import EditLinkModal from '../Molecules/EditLinkModal'
import DashboardModal from '../Molecules/DashboardModal'
import { useLinks } from '../../contexts/LinksContext'

export default function DashboardPage() {
  const {
    isEditDialogOpen,
    isShortenFormOpen,

  } = useLinks()

  return (
    <>
      <Dashboard />

      {isShortenFormOpen && (
        <DashboardModal />
      )}

      {isEditDialogOpen && (
        <EditLinkModal />
      )}
    </>
  )
}
