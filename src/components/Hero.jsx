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
        className="flex h-[50vh] md:h-[90vh] w-full flex-col gap-6 bg-contain bg-top bg-no-repeat items-center justify-center text-center rounded-lg overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 33, 26, 0.3) 0%, rgba(18, 33, 26, 0.2) 100%), url("/assets/Hero-image.jpg")`,
          backgroundPosition: 'center -20px',
          // Remove borderRadius/backgroundClip from style, rely on Tailwind for rounded corners
        }}
      >
      </div>
    </section>
  );
};

export default Hero;