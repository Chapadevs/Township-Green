import { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import Calendar from './Calendar.jsx';

const EventsSection = ({ onBookNow }) => {
  const { events, loading } = useEvents();
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBookNow = (event, date) => {
    if (onBookNow) {
      onBookNow(event, date);
    }
  };

  return (
    <section
      id="booking"
      style={{ padding: 'clamp(56px, 7vw, 88px) clamp(20px, 5vw, 40px)', background: 'radial-gradient(120% 80% at 50% 0%, rgba(29,85,76,0.30) 0%, rgba(18,33,26,0) 58%), #12211a' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div className="flex items-center justify-center gap-4" style={{ margin: '0 auto 52px' }}>
          <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
          <h2
            className="text-white font-['Space_Grotesk'] font-bold tracking-[-0.02em] leading-[1.08] text-center"
            style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}
          >
            Reserve your spot
          </h2>
          <span className="w-[26px] h-[2px] bg-[#23a867] flex-shrink-0"></span>
        </div>
        {/* Event Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[var(--background-card)] border border-white/[0.06] rounded-2xl p-[26px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[36px] text-[#23a867]">brush</span>
            <h4 className="text-white font-bold mt-[14px] mb-2 font-['Space_Grotesk'] text-base">All Materials Provided</h4>
            <p className="text-gray-400 text-[13.5px] leading-relaxed font-['Noto_Sans']">We supply everything you need for your creative session.</p>
          </div>
          <div className="bg-[var(--background-card)] border border-white/[0.06] rounded-2xl p-[26px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[36px] text-[#23a867]">schedule</span>
            <h4 className="text-white font-bold mt-[14px] mb-2 font-['Space_Grotesk'] text-base">Flexible Sessions</h4>
            <p className="text-gray-400 text-[13.5px] leading-relaxed font-['Noto_Sans']">Multiple time slots available throughout the week.</p>
          </div>
          <div className="bg-[var(--background-card)] border border-white/[0.06] rounded-2xl p-[26px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[36px] text-[#23a867]">group</span>
            <h4 className="text-white font-bold mt-[14px] mb-2 font-['Space_Grotesk'] text-base">Small Groups</h4>
            <p className="text-gray-400 text-[13.5px] leading-relaxed font-['Noto_Sans']">Intimate sessions with limited capacity for personal attention.</p>
          </div>
          <div className="bg-[var(--background-card)] border border-white/[0.06] rounded-2xl p-[26px] text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(35,168,103,0.5)]">
            <span className="material-symbols-outlined text-[36px] text-[#23a867]">verified</span>
            <h4 className="text-white font-bold mt-[14px] mb-2 font-['Space_Grotesk'] text-base">Safe Environment</h4>
            <p className="text-gray-400 text-[13.5px] leading-relaxed font-['Noto_Sans']">Legal, clean, and professionally managed space.</p>
          </div>
        </div>
        
        {/* Calendar and Event Sessions Section */}
        <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Left Side - Calendar */}
          <div>
            <Calendar 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              events={events}
            />
          </div>
          
          {/* Right Side - Event Sessions */}
          <div>
            {loading ? (
              <div className="bg-[var(--background-card)] rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="material-symbols-outlined text-5xl animate-pulse">hourglass_empty</span>
                </div>
                <p className="text-white">Loading events...</p>
              </div>
            ) : selectedDate ? (
              <div>
                <div className="space-y-6">
                  {events
                    .filter(event => {
                      const eventDate = new Date(event.event_date);
                      return eventDate.toDateString() === selectedDate.toDateString();
                    })
                    .map(event => {
                      const availableSpots = event.capacity - (event.booked_seats || 0);
                      const isFYI = event.event_type === 'special-event'; // Adjust as needed
                      
                      return (
                        <div key={event.id} className="bg-[var(--background-card)] rounded-xl p-6 shadow-2xl">
                          <div className="mb-4">
                            <h3 className="text-white text-2xl font-bold mb-2 font-['Space_Grotesk']">
                              Available Sessions
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-4 font-['Noto_Sans']">
                              {selectedDate.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <h4 className="text-white text-xl font-bold mb-2 font-['Space_Grotesk']">{event.title}</h4>
                            <div className="flex items-center gap-6 mb-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">schedule</span>
                                <p className="text-gray-300">
                                  {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">payments</span>
                                <p className="text-white font-bold">
                                  {event.price === 0 || event.price === '0.00' ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">group</span>
                                <p className="text-gray-300">{availableSpots} spots left</p>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-4 font-['Noto_Sans'] leading-relaxed">{event.description}</p>
                          </div>
                          
                          {isFYI ? (
                            <div className="w-full bg-orange-500 bg-opacity-20 border-2 border-orange-500 text-orange-300 font-bold py-3 px-6 rounded-lg text-center">
                              <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">info</span>
                                FYI Event - View Only
                              </span>
                            </div>
                          ) : availableSpots > 0 ? (
                            <button
                              onClick={() => handleBookNow(event, selectedDate)}
                              className="w-full bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined">event_available</span>
                              <span>Book This Session</span>
                            </button>
                          ) : (
                            <div className="w-full bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg text-center">
                              <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">event_busy</span>
                                Session Fully Booked
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  }
                  {events.filter(event => {
                    const eventDate = new Date(event.event_date);
                    return eventDate.toDateString() === selectedDate.toDateString();
                  }).length === 0 && (
                    <div className="bg-[var(--background-card)] rounded-xl p-8 text-center">
                      <div className="text-gray-400 mb-3">
                        <span className="material-symbols-outlined text-4xl">event_busy</span>
                      </div>
                      <p className="text-gray-300 font-medium mb-2">No sessions available</p>
                      <p className="text-gray-400 text-sm">Please select another date to view available sessions</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--background-card)] rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="material-symbols-outlined text-5xl">event</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2 font-['Space_Grotesk']">Select a date</h3>
                <p className="text-gray-400 font-['Noto_Sans']">Choose a date from the calendar to view available sessions and book your spot!</p>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default EventsSection;