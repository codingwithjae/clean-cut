export default function Input({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="
        w-full max-w-2xs min-w-3xs h-[60px] px-5 text-lg 
        bg-pickled-bluewood-950 text-white 
        border border-gray-700 
        rounded-lg outline-none
      "
    />
  );
}
