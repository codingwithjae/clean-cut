export default function Button({ text }) {
  return (
    <button className="w-[195px] h-[68px] px-5 flex items-center justify-center text-[18px] font-normal text-white bg-cerulean-blue-800 opacity-100 border-none rounded-lg hover:opacity-90">
      {text}
    </button>
  );
}
