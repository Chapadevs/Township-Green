const Hero = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      <div 
        className="flex min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 33, 26, 0.8) 0%, rgba(18, 33, 26, 0.6) 100%), 
            url("https://lh3.googleusercontent.com/aida-public/AB6AXuBs46PxS17bJ2Uris_dKQYY4Z0hbB2CMQiVqdcH1no39IBOi9AMGt2v7KuAlXt3Cl8lHLUwtb5nH5EbM6vgpu_S8wV_1MURlI86B2bqsxZhA09h606Wwqyx8IbCO7pRfvaP2Aga6RrO4oJNKax2sXRvMs72Ck7V0uD7xHrqlXD6V4yL7mglNMcVqE7KE17KjlRRtJxPZPHGhq5DvOXERnhE8pQsTnx0H44CR9HQD2dozZE8eheLa3EWVmHkJ12pcAtLDeVpxmzDwLo")`
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tight">
            Gather, Draw, and Elevate Your Creativity
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-normal leading-normal mt-4 max-w-2xl mx-auto">
            Top of the Green offers a unique space for stoners to gather, smoke, and unleash their artistic talents. 
            Book your session today and join a community of like-minded individuals.
          </p>
        </div>
        <button 
          onClick={scrollToBooking}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 mt-6 bg-[var(--primary-color)] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg"
        >
          <span className="truncate">Book Now</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;