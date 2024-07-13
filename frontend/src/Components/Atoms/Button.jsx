export default function Button({ text }) {
  return (
    <button
      className="
        flex items-center justify-center 
        text-lg font-normal text-white 
        bg-cerulean-blue-800 opacity-100 
        border-none rounded-lg 
        hover:opacity-90 
        w-2xs h-[60px] md:w-[195px]
        cursor-pointer
      "
    >
      {text}
    </button>
  );
}
