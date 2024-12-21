import Button from '../Atoms/Button'

export default function LinksTable({ links, onEdit, onCopy, onDelete }) {
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
      {/* Vista de escritorio - Tabla */}
      <div className='hidden md:block border border-gray-600 overflow-x-auto rounded-md'>
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

      {/* Vista móvil - Cards */}
      <div className='md:hidden space-y-4'>
        {links.map(link => (
          <div
            key={link.id}
            className='bg-gray-800 rounded-lg border border-gray-600 p-4 hover:bg-gray-700 transition-colors'
          >
            <div className='flex flex-col gap-4'>
              {/* URL Original */}
              <div className='flex items-center justify-between'>
                <a
                  href={link.originalUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-1 flex items-center gap-1 text-blue-400 hover:underline text-sm truncate'
                >
                  <span className='truncate'>{link.originalUrl}</span>
                  <Button
                    variant='iconButton'
                    icon='link'
                    ariaLabel='Open link'
                    className='text-blue-400 flex-shrink-0'
                  />
                </a>
              </div>

              {/* Short ID y Clicks */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-300 uppercase'>Short ID:</span>
                  <div className='flex items-center'>
                    <span className='font-mono text-sm truncate max-w-[100px]'>{link.shortId}</span>
                    <Button
                      variant='iconButton'
                      icon='copy'
                      onClick={() => onCopy(link.shortId)}
                      ariaLabel='Copy link'
                    />
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-300 uppercase'>Clicks:</span>
                  <span className='text-sm'>{link.clicks}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className='flex justify-end items-center gap-2 border-t border-gray-700 pt-3'>
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
          </div>
        ))}
      </div>
    </section>
  )
}
