export default function HeroSection() {
  return (
    <section className="tracking-wide flex flex-col items-center text-center text-white">
      <div className="mb-12 md:mb-10 lg:mb-0 lg:w-7xl">
        <h2 className=" text-5xl font-medium leading-15 text-transparent bg-clip-text bg-gradient-to-b from-gray-50 to-gray-500 animate-gradient md:leading-21 md:text-7xl lg:leading-tight">
          Allow people find you on the internet. Superfast!
        </h2>
      </div>

      <div className="flex items-center w-xs md:w-2xl lg:mt-10 lg:w-2xl">
        <p className="tracking-wide mb-10 text-md font-light text-gray-400 md:mb-10 md:text-lg lg:leading-10">
          Say goodbye to long, cumbersome URLs and hello to a simple, sleeker way to shorten, share and manage your links.
        </p>
      </div>

      <div className="mb-10 md:mb-5 lg:mt-0">
        <p className="tracking-wide font-light text-md text-gray-300 md:text-lg">Enter your link now to shorten it</p>
      </div>
    </section>
  );
}
