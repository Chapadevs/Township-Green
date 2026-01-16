import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero carousel images with event-specific content
  const heroImages = [
    {
      src: '/assets/hero-images/hero-1.png',
      alt: 'Township Green Community Space',
      title: 'Top of the Green'
    },
    {
      src: '/assets/hero-images/hero-2.png',
      alt: 'Top of the Green Entertainment Lounge',
      title: 'Entertainment Hub'
    }
  ];

  // Event types for the bottom section
  const eventTypes = [
    {
      src: '/assets/hero-images/1.png',
      alt: 'A group of people painting on canvases in a relaxed atmosphere',
      title: 'Puff n Paint'
    },
    {
      src: '/assets/hero-images/2.png',
      alt: 'A comedian performing on a stage to an audience',
      title: 'Comedy Night'
    },
    {
      src: '/assets/hero-images/3.png',
      alt: 'A tattoo artist working on a client\'s arm',
      title: 'Tattoo Artists'
    },
    {
      src: '/assets/hero-images/4.png',
      alt: 'A group of friends celebrating a bachelorette party',
      title: 'Bachelorette Parties'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
        {/* Carousel Slides */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            data-alt={image.alt}
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(33, 33, 33, 0.6) 0%, rgba(33, 33, 33, 0.2) 50%, rgba(33, 33, 33, 0) 100%), url("${image.src}")`
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
              <h2 className="text-white text-5xl font-bold tracking-tight">{image.title}</h2>
            </div>
          </div>
        ))}

        {/* Main Headline */}
        <div className="absolute inset-x-0 top-[10%] flex justify-center pointer-events-none px-4">
          <h1 
            className="text-white tracking-tight text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight md:whitespace-nowrap"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            Host your events at Top of the Green
          </h1>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-8 h-1.5 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* More Event Ideas Section */}
      <div className="pt-16 pb-12 sm:pt-24 sm:pb-16 bg-[var(--background-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center mb-10">What's happening</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((event, index) => (
              <div key={index} className="flex flex-col gap-4 rounded-lg">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  data-alt={event.alt}
                  style={{ backgroundImage: `url("${event.src}")` }}
                ></div>
                <p className="text-white text-lg font-medium leading-normal text-center">{event.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;