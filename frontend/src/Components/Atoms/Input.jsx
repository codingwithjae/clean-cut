export default function Input({ placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-[385px] h-[68px] px-5 text-[18px]  bg-pickled-bluewood-950 text-white border border-gray-700 rounded-lg outline-none
       
        `}
    />
  );
}
