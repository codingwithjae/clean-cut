import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Button({ text, variant, icon, onClick, ariaLabel, isMenuOpen }) {
  const stylesVariants = {
    large: 'w-[195px] h-[60px]',
    small: 'w-[142px] h-[60px]',
    icon: 'w-[22px] h[22px] bg-transparent '
  };

  let iconVariants = null;
  if (icon === 'close') {
    iconVariants = AiOutlineClose;
  } else if (icon === 'menu') {
    iconVariants = isMenuOpen ? FaTimes : FaBars;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center
        text-lg font-normal text-white
        bg-cerulean-blue-800 opacity-100
        border-none rounded-lg
        hover:opacity-90
        cursor-pointer
        ${stylesVariants[variant] || stylesVariants.large} 
        ${variant === 'menu' ? (isMenuOpen ? 'rotate-90 ' : 'rotate-0') : ''}
      `}
    >
      {iconVariants && React.createElement(iconVariants, { size: 22 })}
      {text}
    </button>
  );
}
