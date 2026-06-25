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

  useEffect(() => {
    if (!isAutoPlaying || carouselImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

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
      <div
        className="relative w-full overflow-hidden group"
        style={{ height: 'clamp(440px, 68vh, 640px)' }}
      >
        {carouselLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-dark)]">
            <div className="text-white text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p>Loading carousel...</p>
            </div>
          </div>
        ) : carouselImages.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-[var(--background-dark)]">
            <h1
              className="text-white font-['Space_Grotesk'] font-bold text-center"
              style={{ fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '14ch', textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}
            >
              Host your events at Top of the Green
            </h1>
            {isAdmin && (
              <p className="text-white/70 mt-4">No carousel images yet. Add them in the admin panel.</p>
            )}
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
                  backgroundImage: `linear-gradient(180deg, rgba(18,33,26,0.35) 0%, rgba(18,33,26,0.15) 38%, rgba(18,33,26,0.85) 88%, #12211a 100%), url("${image.image_url}")`
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Centered Hero Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
              {/* Main headline */}
              <h1
                className="text-white font-['Space_Grotesk'] font-bold text-center"
                style={{
                  fontSize: 'clamp(34px, 6vw, 64px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  maxWidth: '14ch',
                  textShadow: '0 2px 24px rgba(0,0,0,0.55)'
                }}
              >
                Host your events at Top of the Green
              </h1>

              {/* Description */}
              <p
                className="text-white/85 mt-5 max-w-[34ch] leading-[1.55]"
                style={{ fontSize: 'clamp(15px, 2.2vw, 19px)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
              >
                Gather, create, and celebrate in Riverside's home for cannabis-friendly events.
              </p>

              {/* Pagination dots */}
              {carouselImages.length > 1 && (
                <div className="flex justify-center gap-3 mt-[34px]">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'w-[30px] bg-white' : 'w-[14px] bg-white/45 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 text-white/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* What's Happening Section */}
      <section
        id="news"
        className="bg-[var(--background-dark)]"
        style={{ padding: 'clamp(64px, 8vw, 96px) clamp(20px, 5vw, 40px) clamp(48px, 6vw, 72px)' }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div className="flex items-center justify-center gap-4" style={{ margin: '0 auto 40px' }}>
            <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
            <h2
              className="text-white font-['Space_Grotesk'] font-bold tracking-[-0.02em] leading-[1.08] text-center"
              style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}
            >
              What's happening
            </h2>
            <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
          </div>

          {newsLoading ? (
            <div className="text-center text-white py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-4">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div
              className="flex flex-col items-center gap-[14px] text-center bg-[#1d2d25] border border-white/[0.06] rounded-2xl"
              style={{ maxWidth: '560px', margin: '0 auto', padding: '44px 32px' }}
            >
              <span className="material-symbols-outlined text-[38px] text-[#3f6152]">campaign</span>
              <p className="text-gray-400 text-base leading-relaxed" style={{ maxWidth: '34ch' }}>
                No news available at the moment — check back soon for the latest from the community.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {news.map((newsItem) => (
                <div key={newsItem.id} className="flex flex-col gap-5 rounded-lg w-full sm:w-auto sm:max-w-[360px] lg:max-w-[320px] xl:max-w-[380px]">
                  <div
                    className={`relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl ${isAdmin ? 'cursor-pointer group/card' : ''}`}
                    data-alt={newsItem.alt_text}
                    style={{ backgroundImage: `url("${newsItem.image_url}")` }}
                    onClick={() => isAdmin && handleEditNews(newsItem)}
                  >
                    {isAdmin && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
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
                    <p className="text-white text-xl md:text-2xl font-bold leading-normal mb-3">{newsItem.title}</p>
                    {newsItem.description && (
                      <p className="text-gray-400 text-base md:text-lg leading-relaxed">{newsItem.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
