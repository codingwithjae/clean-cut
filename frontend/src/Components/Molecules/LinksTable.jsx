import Button from '../Atoms/Button'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function LinksTable({ links, onEdit, onCopy, onDelete }) {
  const isMobile = useMediaQuery('(max-width: 639px)')

  if (!links || links.length === 0) {
    return (
      <section
        aria-label='Empty links state'
        className='bg-gray-800 rounded-lg border border-gray-600 p-8 text-center'
      >
        <p className='text-gray-400 text-lg'>No links added yet</p>
        <p className='text-gray-500 mt-2'>
          Click on "Add New Link" to create your first shortened URL
        </p>
      </section>
    )
  }

  return (
    <section aria-label='Links table' className='w-full'>
      {!isMobile ? (
        // Desktop Table View
        <div className='border border-gray-600 overflow-x-auto rounded-md'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-800'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase'
                >
                  Original URL
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase'
                >
                  Short ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase'
                >
                  Clicks
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-gray-700 divide-y divide-gray-600'>
              {links.map(link => (
                <tr key={link.id} className='hover:bg-gray-600'>
                  <td className='px-6 py-4 whitespace-nowrap truncate'>
                    <a
                      href={link.originalUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-blue-400 hover:underline'
                    >
                      <span className='truncate'>{link.originalUrl}</span>
                      <Button
                        variant='iconButton'
                        icon='link'
                        ariaLabel='Open link'
                        className='text-blue-400'
                      />
                    </a>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span className='font-mono mr-2 truncate'>{link.shortId}</span>
                      <Button
                        variant='iconButton'
                        icon='copy'
                        onClick={() => onCopy(link.shortId)}
                        ariaLabel='Copy link'
                      />
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-center'>{link.clicks}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-right'>
                    <div className='flex justify-end items-center gap-2'>
                      <Button
                        variant='iconButton'
                        icon='edit'
                        onClick={() => onEdit(link)}
                        ariaLabel='Edit link'
                      />
                      <Button
                        variant='iconButton'
                        icon='trash'
                        onClick={() => onDelete(link.shortId)}
                        ariaLabel='Delete link'
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile Card View
        <ul className='space-y-4'>
          {links.map(link => (
            <li key={link.id} className='bg-gray-800 rounded-lg p-4 border border-gray-600'>
              <article className='link-card'>
                <header className='mb-2 truncate'>
                  <a
                    href={link.originalUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-1 text-blue-400 hover:underline text-sm'
                  >
                    <span className='truncate'>{link.originalUrl}</span>
                    <Button
                      variant='iconButton'
                      icon='link'
                      ariaLabel='Open link'
                      className='text-blue-400'
                    />
                  </a>
                </header>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-xs text-gray-300 uppercase'>Short ID</span>
                  <span className='text-xs text-gray-300 uppercase'>Clicks</span>
                </div>
                <footer className='flex justify-between items-center'>
                  <div className='flex items-center max-w-[60%]'>
                    <span className='font-mono text-sm truncate mr-2'>{link.shortId}</span>
                    <Button
                      variant='iconButton'
                      icon='copy'
                      onClick={() => onCopy(link.shortId)}
                      ariaLabel='Copy link'
                    />
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm'>{link.clicks}</span>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='iconButton'
                        icon='edit'
                        onClick={() => onEdit(link)}
                        ariaLabel='Edit link'
                      />
                      <Button
                        variant='iconButton'
                        icon='trash'
                        onClick={() => onDelete(link.shortId)}
                        ariaLabel='Delete link'
                      />
                    </div>
                  </div>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
