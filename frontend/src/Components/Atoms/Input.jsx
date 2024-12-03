export default function Input({ placeholder, value, onChange, required, name, type = 'text' }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-3xs md:w-sm h-[60px] 
        px-6 py-3
        text-white
        bg-transparent
        border-2 border-gray-700
        rounded-lg
        placeholder-gray-300
        focus:outline-none
        focus:border-cerulean-blue-800
      `}
    />
  )
}
