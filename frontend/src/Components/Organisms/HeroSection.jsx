export default function HeroSection() {
  return (
    <section className="tracking-wide flex flex-col items-center text-center text-white mb-10">
      <article className="mb-12 md:mb-10 lg:mb-0 lg:w-5xl xl:w-7xl">
        <h2 className=" text-5xl font-medium leading-15 text-transparent bg-clip-text bg-gradient-to-b from-gray-50 to-gray-500 animate-gradient md:leading-21 md:text-7xl lg:leading-tight">
          Allow people find you on the internet. Superfast!
        </h2>
      </article>

      <article className="flex items-center p-2 w-s md-p-0 md:w-3xl lg:mt-10 lg:w-2xl">
        <p className="tracking-wide leading-8 mb-10 text-md font-light text-gray-400 md:mb-10 md:text-lg lg:leading-10">
          Say goodbye to long, cumbersome URLs and hello to a simple, sleeker way to shorten, share and manage your links.
        </p>
      </article>

      <article className="mb-10 md:mb-5 lg:mt-0">
        <p className="tracking-wide font-light text-md text-gray-300 md:text-lg">Enter your link now to shorten it</p>
      </article>
    </section>
  );
}
