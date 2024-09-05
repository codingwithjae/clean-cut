export default function Button({ text, variant }) {
  const buttonSize = variant === 'small' ? 'w-[142px] ' : 'w-2xs md:w-[195px]';

  return (
    <button
      type="button"
      className={`
        flex items-center justify-center 
        text-lg font-normal text-white 
        bg-cerulean-blue-800 opacity-100 
        border-none rounded-lg 
        hover:opacity-90 
        h-[60px] 
        cursor-pointer 
        ${buttonSize}
      `}
    >
      {text}
    </button>
  );
}
