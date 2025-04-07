import LinksTable from '../Molecules/LinksTable'
import Button from '../Atoms/Button'
import { useLinks } from '../../contexts/LinksContext'

export default function Dashboard() {
  const { links, openShortenForm } = useLinks()
  
  return (
    <section>
      <div className='container mx-auto px-4 py-4 sm:py-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0'>
          <h2 className='text-xl sm:text-2xl font-bold tracking-tight'>Your Links</h2>
          <Button text='Add New Link' onClick={openShortenForm} variant='normal' />
        </div>

        <LinksTable />
      </div>
    </section>
  )
}
