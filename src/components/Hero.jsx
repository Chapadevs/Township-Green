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
        className="flex h-[70vh] md:h-[90vh] w-full flex-col gap-6 bg-contain bg-top bg-no-repeat items-center justify-center p-8 text-center rounded-lg overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 33, 26, 0.3) 0%, rgba(18, 33, 26, 0.2) 100%), url("/assets/Hero-image.jpg")`,
          backgroundPosition: 'center -20px',
          // Remove borderRadius/backgroundClip from style, rely on Tailwind for rounded corners
        }}
      >
        <div className="flex flex-col items-center gap-4 -mt-20">
          <button 
            onClick={scrollToBooking}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg"
          >
            <span className="truncate">BOOK NOW</span>
          </button>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;