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
    <section className="py-16 px-10 bg-[var(--secondary-color)] bg-opacity-20" id="booking">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <h2 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tight font-['Space_Grotesk'] relative z-10">
                <span className="relative inline-block">
                  <span className="text-white relative z-10">Reserve</span>
                </span>
                <span className="text-white mx-3">Your</span>
                <span className="relative inline-block">
                  <span className="relative z-10">Spot</span>
                  <div className="absolute inset-0 bg-[var(--primary-color)] opacity-15 blur-lg transform scale-110"></div>
                </span>
              </h2>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] text-lg font-['Noto_Sans'] max-w-2xl mx-auto">
            Book an event or host your own private session. We'll handle the details.
          </p>
        </div>
      <div className="max-w-5xl mx-auto">
              {/* Event Features */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--background-card)] rounded-lg p-6 text-center hover:bg-opacity-80 transition-all duration-300">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">brush</span>
            </div>
            <h4 className="text-white font-bold mb-2 font-['Space_Grotesk']">All Materials Provided</h4>
            <p className="text-gray-400 text-sm font-['Noto_Sans']">We supply everything you need for your creative session</p>
          </div>
          
          <div className="bg-[var(--background-card)] rounded-lg p-6 text-center hover:bg-opacity-80 transition-all duration-300">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">schedule</span>
            </div>
            <h4 className="text-white font-bold mb-2 font-['Space_Grotesk']">Flexible Sessions</h4>
            <p className="text-gray-400 text-sm font-['Noto_Sans']">Multiple time slots available throughout the week</p>
          </div>
          
          <div className="bg-[var(--background-card)] rounded-lg p-6 text-center hover:bg-opacity-80 transition-all duration-300">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">group</span>
            </div>
            <h4 className="text-white font-bold mb-2 font-['Space_Grotesk']">Small Groups</h4>
            <p className="text-gray-400 text-sm font-['Noto_Sans']">Intimate sessions with limited capacity for personal attention</p>
          </div>
          
          <div className="bg-[var(--background-card)] rounded-lg p-6 text-center hover:bg-opacity-80 transition-all duration-300">
            <div className="text-[var(--primary-color)] mb-4">
              <span className="material-symbols-outlined text-4xl">verified</span>
            </div>
            <h4 className="text-white font-bold mb-2 font-['Space_Grotesk']">Safe Environment</h4>
            <p className="text-gray-400 text-sm font-['Noto_Sans']">Legal, clean, and professionally managed space</p>
          </div>
        </div>
        
        {/* Calendar and Event Sessions Section */}
        <div className="flex flex-wrap items-start justify-center gap-12">
          {/* Left Side - Legend and Calendar */}
          <div className="flex-1 min-w-[320px] max-w-md">
            {/* Event Legend */}
            <div className="mb-8 min-w-[320px] max-w-md">
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <div className="flex justify-center items-center gap-4 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full"></div>
                    <span className="text-white font-medium">Events</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-white font-medium">Informational</span>
                  </div>
                </div>
              </div>
            </div>
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
          </div>
          
          {/* Right Side - Event Sessions */}
          <div className="flex-1 min-w-[320px] max-w-2xl">
            {loading ? (
              <div className="bg-[var(--background-card)] rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="material-symbols-outlined text-5xl animate-pulse">hourglass_empty</span>
                </div>
                <p className="text-white">Loading events...</p>
              </div>
            ) : selectedDate ? (
              <div>
                <h3 className="text-white text-2xl font-bold mb-6 font-['Space_Grotesk']">
                  Available Sessions
                </h3>
                <p className="text-[var(--text-secondary)] mb-6 font-['Noto_Sans']">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
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