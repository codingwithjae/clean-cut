export default function Input({ type = 'text', placeholder, value, onChange, name, required = false }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      className={`
        w-[325px] md:w-[365px] max-w-lg h-[60px] 
        px-4 py-3
        text-black text-left
        bg-transparent
        border-2 border-gray-700
        rounded-lg
        placeholder-gray-300
        focus:outline-none
        focus:border-cerulean-blue-800
      `}
    />
  );
}
