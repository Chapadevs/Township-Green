import { useState, useEffect } from 'react';
import { useHeroNews } from '../hooks/useHeroNews';
import { useHeroCarousel } from '../hooks/useHeroCarousel';
import NewsForm from './Admin/NewsForm';

const Hero = ({ isAdmin = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { news, loading: newsLoading, fetchAllNews } = useHeroNews();
  const { carouselImages, loading: carouselLoading } = useHeroCarousel();
  const [editingNews, setEditingNews] = useState(null);
  const [showNewsForm, setShowNewsForm] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || carouselImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem);
    setShowNewsForm(true);
  };

  const handleCloseNewsForm = () => {
    setShowNewsForm(false);
    setEditingNews(null);
    fetchAllNews();
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
        {carouselLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-dark)]">
            <div className="text-white text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p>Loading carousel...</p>
            </div>
          </div>
        ) : carouselImages.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-dark)]">
            <div className="text-center px-4">
              <h1 
                className="text-white tracking-tight text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                Host your events at Top of the Green
              </h1>
              {isAdmin && (
                <p className="text-white/70 mt-4">No carousel images yet. Add them in the admin panel.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Carousel Slides */}
            {carouselImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                data-alt={image.alt_text}
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(33, 33, 33, 0.6) 0%, rgba(33, 33, 33, 0.2) 50%, rgba(33, 33, 33, 0) 100%), url("${image.image_url}")`
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
            {carouselImages.length > 1 && (
              <>
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
                  {carouselImages.map((_, index) => (
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
              </>
            )}
          </>
        )}
      </div>

      {/* What's Happening Section - Hero News */}
      <div className="pt-12 pb-6 sm:pt-16 sm:pb-8 bg-[var(--background-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white text-center mb-10">What's happening</h2>
          
          {newsLoading ? (
            <div className="text-center text-white py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-4">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>No news available at the moment.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="flex flex-col gap-4 rounded-lg w-full sm:w-auto sm:max-w-[300px] lg:max-w-[240px]">
                  <div 
                    className={`relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl ${
                      isAdmin ? 'cursor-pointer group' : ''
                    }`}
                    data-alt={newsItem.alt_text}
                    style={{ backgroundImage: `url("${newsItem.image_url}")` }}
                    onClick={() => isAdmin && handleEditNews(newsItem)}
                  >
                    {/* Admin Edit Overlay */}
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-white flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="font-bold">Edit</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white text-lg font-bold leading-normal mb-2">{newsItem.title}</p>
                    {newsItem.description && (
                      <p className="text-gray-400 text-sm leading-relaxed">{newsItem.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* News Form Modal (Admin Only) */}
      {showNewsForm && (
        <NewsForm
          news={editingNews}
          onClose={handleCloseNewsForm}
          onSuccess={handleCloseNewsForm}
        />
      )}
    </>
  );
};

export default Hero;