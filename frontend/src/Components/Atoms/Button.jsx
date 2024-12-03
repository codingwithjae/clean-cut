import Icon from './Icon'

export default function Button({
  text,
  type,
  variant,
  icon,
  onClick,
  ariaLabel,
  isMenuOpen,
  className = '',
}) {
  const baseStyles = `
    flex items-center justify-center
    text-lg
    text-white
    bg-cerulean-blue-800
    rounded-lg
    hover:opacity-90
    cursor-pointer
    transition-colors
  `

  const iconButtonStyles = `
    p-1 
    bg-transparent 
    rounded-full
    cursor-pointer
  `

  const sizeVariants = {
    small: 'w-[142px] h-[60px]',
    normal: 'w-3xs md:w-[195px] h-[60px]',
    large: 'w-[325px] h-[60px]',
    icon: 'w-10 h-10 bg-transparent',
    iconButton: iconButtonStyles,
  }

  const iconHoverClass = variant === 'iconButton' ? 'hover:text-blue-400 transition-colors' : ''

  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      aria-label={ariaLabel || (icon && !text ? `${icon} button` : text)}
      className={`
        ${variant === 'iconButton' ? iconButtonStyles : baseStyles}
        ${variant !== 'iconButton' ? sizeVariants[variant] || sizeVariants.normal : ''}
        ${variant === 'menu' ? (isMenuOpen ? 'rotate-90' : 'rotate-0') : ''}
        ${className}
      `}
    >
      {icon && (
        <Icon
          name={icon}
          isMenuOpen={isMenuOpen}
          size={variant === 'iconButton' ? 16 : 24}
          className={iconHoverClass}
        />
      )}
      {text}
    </button>
  )
}
