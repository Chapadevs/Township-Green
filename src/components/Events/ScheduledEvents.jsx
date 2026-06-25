import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';

const ScheduledEvents = ({ onBookNow }) => {
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleImageClick = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <section
      className="bg-[var(--background-dark)]"
      id="events"
      style={{ padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 40px)' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div className="text-center" style={{ maxWidth: '720px', margin: '0 auto 52px' }}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
            <span className="text-[#23a867] font-['Space_Grotesk'] text-xs font-semibold tracking-[0.2em] uppercase whitespace-nowrap">Mark your calendar</span>
            <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
          </div>
          <h2
            className="text-white font-['Space_Grotesk'] font-bold tracking-[-0.02em] leading-[1.08]"
            style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}
          >
            Next events
          </h2>
          <p className="text-[#9ca3af] text-lg leading-[1.65] mt-[18px]">Events schedule — November 2025</p>
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
          <div
            className={
              displayEvents.length === 1
                ? 'flex justify-center'
                : displayEvents.length === 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            }
          >
            {displayEvents.map((event, index) => (
            <div
              key={event.id}
              className={`group relative flex flex-col bg-[var(--background-card)] border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(35,168,103,0.5)] ${
                displayEvents.length === 1 ? 'w-full max-w-lg' : ''
              }`}
            >
              {/* Large Event Image */}
              <div
                className={`relative overflow-hidden cursor-pointer ${
                  displayEvents.length === 1 ? 'h-[320px]' : 'h-[230px]'
                }`}
                onClick={() => handleImageClick(event)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                

                {/* Event Type Badge */}
                {event.type === 'fyi' && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30">
                    <span className="bg-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold font-['Space_Grotesk'] shadow-lg">
                      FYI
                    </span>
                  </div>
                )}


                {/* Date Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-30">
                  <div className="bg-white/90 text-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold font-['Space_Grotesk'] shadow-lg">
                    {event.date}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-[22px] flex flex-col gap-3 flex-1">
                {/* Time Header */}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-base">schedule</span>
                  <div className="text-white text-xs sm:text-sm font-bold font-['Space_Grotesk'] tracking-wide">
                    {event.time}
                  </div>
                  {event.isSpecial && (
                    <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full animate-pulse ml-1"></div>
                  )}
                </div>
                
                {/* Event Title */}
                <h3 className="text-base sm:text-lg font-black text-white font-['Space_Grotesk'] leading-tight group-hover:text-[var(--primary-color)] transition-colors duration-300">
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
                  <div className="pt-1">
                    {event.hasLink ? (
                      <a 
                        href={event.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 text-center shadow-lg block"
                      >
                        {event.highlight} →
                      </a>
                    ) : (
                      <button
                        onClick={() => onBookNow && onBookNow(event.originalEvent)}
                        className="w-full bg-[#23a867] hover:bg-[#1e8f57] text-white py-3 px-4 rounded-[10px] font-['Lora',serif] font-bold text-[15px] transition-all duration-300"
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

        {/* Event Details Modal */}
        {selectedEvent && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <div 
              className="relative max-w-5xl w-full my-4 bg-[var(--background-card)] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-[60] bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                <span className="material-symbols-outlined text-xl leading-none">close</span>
              </button>

              {/* Event Image - Left Side */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden flex-shrink-0">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Date Badge on Image */}
                <div className="absolute top-3 left-3 z-30">
                  <div className="bg-white/90 text-black px-3 py-1.5 rounded-lg text-xs font-bold font-['Space_Grotesk'] shadow-lg">
                    {selectedEvent.date}
                  </div>
                </div>

                {/* Event Type Badge */}
                {selectedEvent.type === 'fyi' && (
                  <div className="absolute top-3 right-3 z-30">
                    <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold font-['Space_Grotesk'] shadow-lg">
                      FYI
                    </span>
                  </div>
                )}
              </div>

              {/* Event Content - Right Side - Scrollable */}
              <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-4">
                {/* Header Section */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white font-['Space_Grotesk'] mb-3">
                    {selectedEvent.title}
                  </h2>
                  
                  {/* Time */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">schedule</span>
                    <div className="text-white text-base font-bold font-['Space_Grotesk']">
                      {selectedEvent.time}
                    </div>
                    {selectedEvent.isSpecial && (
                      <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full animate-pulse ml-1"></div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-3">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-lg mt-0.5">location_on</span>
                    <p className="text-white font-['Noto_Sans'] text-sm leading-relaxed">
                      {selectedEvent.address}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">attach_money</span>
                    <p className="text-white font-['Noto_Sans'] text-base font-semibold">
                      {selectedEvent.price}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-2">About This Event</h3>
                    <p className="text-[var(--text-secondary)] font-['Noto_Sans'] text-sm leading-relaxed whitespace-pre-line">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                {selectedEvent.type === 'bookable' && (
                  <div className="pt-3 border-t border-white/10">
                    {selectedEvent.hasLink ? (
                      <a 
                        href={selectedEvent.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-6 py-3 rounded-lg text-base font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 text-center shadow-lg block"
                      >
                        {selectedEvent.highlight} →
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          closeModal();
                          onBookNow && onBookNow(selectedEvent.originalEvent);
                        }}
                        className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 text-white px-6 py-3 rounded-lg text-base font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Reserve Now
                      </button>
                    )}
                  </div>
                )}

                {/* Close Hint */}
                <div className="text-center pt-2 pb-2">
                  <p className="text-[var(--text-muted)] font-['Noto_Sans'] text-xs">
                    Click outside or press X to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ScheduledEvents;
