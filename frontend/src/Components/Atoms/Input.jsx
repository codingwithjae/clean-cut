import Button from './Button'

export default function Input({ 
  placeholder, 
  value, 
  onChange, 
  required, 
  name, 
  type = 'text',
  actionButton,
  onActionClick
}) {
  return (
    <div className='relative w-full'>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full h-[60px] 
          px-6 py-3
          text-white
          bg-transparent
          border-2 border-gray-700
          rounded-lg
          placeholder-gray-300
          focus:outline-none
          focus:border-cerulean-blue-800
          ${actionButton ? 'pr-12' : ''}
        `}
      />
      {actionButton && (
        <Button
          variant='iconButton'
          icon={actionButton.icon}
          onClick={onActionClick}
          ariaLabel={actionButton.ariaLabel}
          className='absolute right-2 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-white transition-colors'
        />
      )}
    </div>
  )
}
