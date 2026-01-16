import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';

const ScheduledEvents = ({ onBookNow }) => {
  const { events, loading } = useEvents();
  const [selectedImage, setSelectedImage] = useState(null);

  // Transform Supabase events data to match the display format
  const displayEvents = events.map(event => {
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    const formattedStart = event.start_time?.slice(0, 5) || '';
    const formattedEnd = event.end_time?.slice(0, 5) || '';

    return {
      id: event.id,
      date: formattedDate,
      title: event.title,
      time: `${formattedStart} – ${formattedEnd}`,
      description: event.description,
      address: event.location || '15 E Scott Street, Riverside, New Jersey',
      highlight: event.event_type === 'paint-night' ? 'Art Session' : event.event_type === 'art-session' ? 'Film Screening' : 'Live Music',
      isSpecial: event.is_featured || false,
      type: event.event_type === 'special-event' ? 'fyi' : 'bookable',
      image: event.image_url,
      price: event.price === 0 || event.price === '0.00' ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`,
      originalEvent: event, // Keep reference to original event for booking
    };
  });

  const handleImageClick = (image, title) => {
    setSelectedImage({ src: image, title });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="md:pb-12 md:mb-6 bg-[var(--background-dark)]" id="events">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="text-center mb-6">
          <div className="relative mb-2">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl font-['Space_Grotesk'] relative z-10">
              <span className="relative inline-block">
                <span className="text-white relative z-10">NEXT</span>
              </span>
              <span className="relative inline-block ml-4">
                <span className="relative z-10">EVENTS</span>
                <div className="absolute inset-0 bg-[var(--primary-color)] opacity-15 blur-lg transform scale-110"></div>
              </span>
            </h2>
          </div>
          <p className="text-lg text-[var(--text-secondary)] font-['Space_Grotesk'] font-medium">
            EVENTS SCHEDULE - NOVEMBER 2025
          </p>
        </div>
        
        {/* Enhanced Event Cards Layout with Bigger Images */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
            <p className="text-white mt-4">Loading events...</p>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No upcoming events at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, index) => (
            <div 
              key={event.id}
              className="group relative bg-[var(--background-card)] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
            >
              {/* Large Event Image */}
              <div className="relative overflow-hidden h-64 cursor-pointer" onClick={() => handleImageClick(event.image, event.title)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                

                {/* Event Type Badge */}
                {event.type === 'fyi' && (
                  <div className="absolute top-3 right-3 z-30">
                    <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold font-['Space_Grotesk'] shadow-lg">
                      FYI
                    </span>
                  </div>
                )}


                {/* Date Badge */}
                <div className="absolute top-3 left-3 z-30">
                  <div className="bg-white/90 text-black px-3 py-1.5 rounded-lg text-sm font-bold font-['Space_Grotesk'] shadow-lg">
                    {event.date}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4 space-y-3">
                {/* Time Header */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-base">schedule</span>
                  <div className="text-white text-sm font-bold font-['Space_Grotesk'] tracking-wide">
                    {event.time}
                  </div>
                  {event.isSpecial && (
                    <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full animate-pulse ml-1"></div>
                  )}
                </div>
                
                {/* Event Title */}
                <h3 className="text-lg font-black text-white font-['Space_Grotesk'] leading-tight group-hover:text-[var(--primary-color)] transition-colors duration-300">
                  {event.title}
                </h3>
                
                {/* Description */}
                <p className="text-[var(--text-secondary)] font-['Noto_Sans'] text-xs leading-relaxed line-clamp-2">
                  {event.description}
                </p>
                
                {/* Address */}
                <div className="flex items-start gap-1">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-sm mt-0.5">location_on</span>
                  <p className="text-[var(--text-muted)] font-['Noto_Sans'] text-xs leading-relaxed line-clamp-1">
                    {event.address}
                  </p>
                </div>
                
                {/* Action Button - Only for bookable events */}
                {event.type === 'bookable' && (
                  <div>
                    {event.hasLink ? (
                      <a 
                        href={event.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 text-center shadow-lg block"
                      >
                        {event.highlight} →
                      </a>
                    ) : (
                      <button 
                        onClick={() => onBookNow && onBookNow(event.originalEvent)}
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Reserve Now
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Decorative Border */}
              <div className={`absolute left-0 top-0 w-1 h-full ${
                event.type === 'fyi'
                  ? 'bg-orange-500'
                  : event.isSpecial 
                    ? 'bg-[var(--primary-color)]' 
                    : 'bg-[var(--secondary-color)]'
              }`}></div>
            </div>
          ))}
          </div>
        )}

        {/* Full-Size Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              {/* Image Title */}
              <div className="absolute top-4 left-4 z-60 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold font-['Space_Grotesk'] text-lg">{selectedImage.title}</h3>
              </div>

              {/* Full Size Image */}
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation Hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm">
                <p className="font-['Noto_Sans']">Click anywhere outside to close</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ScheduledEvents;
