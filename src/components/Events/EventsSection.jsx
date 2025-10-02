import { useState } from 'react';
import Calendar from './Calendar.jsx';
import BookingForm from './BookingForm.jsx';

const EventsSection = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  // Sample events data - in a real app, this would come from an API
  const [events] = useState([
    {
      id: '1',
      title: 'PUFF-N-PAINT',
      description: 'Art session with all materials provided. Perfect for creative relaxation.',
      date: new Date(2025, 9, 4), // October 4, 2025
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      capacity: 20,
      registered: 12,
      price: 25
    },
    {
      id: '2',
      title: 'RIVERSIDE CAR SHOW',
      description: 'Community car show with special Top of the Green discount.',
      date: new Date(2025, 9, 11), // October 11, 2025
      startTime: '12:00 PM',
      endTime: '5:00 PM',
      capacity: 100,
      registered: 45,
      price: 0
    },
    {
      id: '3',
      title: 'JUST A WOMAN PRODUCT LAUNCH',
      description: 'Educational event featuring women-focused cannabis products.',
      date: new Date(2025, 9, 12), // October 12, 2025
      startTime: '1:00 PM',
      endTime: '4:00 PM',
      capacity: 30,
      registered: 18,
      price: 15
    },
    {
      id: '4',
      title: 'HALLOWEED PARTY',
      description: 'Halloween celebration with food truck, games, and more!',
      date: new Date(2025, 9, 25), // October 25, 2025
      startTime: '12:00 PM',
      endTime: '9:00 PM',
      capacity: 50,
      registered: 35,
      price: 20
    }
  ]);

  const getSelectedEvent = () => {
    if (!selectedDate) return null;
    
    return events.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    }) || null;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBookNow = (event, date) => {
    setSelectedEventForBooking(event);
    setSelectedDate(date);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedEventForBooking(null);
  };

  const handleBookingSubmit = async (data) => {
    try {
      // In a real app, this would also update your backend/database
      console.log('Booking submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // You could update local state here, send to analytics, etc.
      console.log('Booking processed successfully');
      
      // Don't reset selection - let the BookingForm handle the success state
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  };

  return (
    <section className="py-20 px-10 bg-[var(--secondary-color)] bg-opacity-20" id="booking">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">event</span>
            <h2 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tight font-['Space_Grotesk']">
          Upcoming Events
        </h2>
            <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">event</span>
          </div>
          <p className="text-[var(--text-secondary)] text-lg font-['Noto_Sans'] max-w-2xl mx-auto">
            Join our creative community for art sessions, special events, and unforgettable experiences
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
          {/* Left Side - Calendar */}
          <div className="flex-1 min-w-[320px] max-w-md">
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
          </div>
          
          {/* Right Side - Event Sessions */}
          <div className="flex-1 min-w-[320px] max-w-2xl">
            {selectedDate ? (
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
                      const eventDate = new Date(event.date);
                      return eventDate.toDateString() === selectedDate.toDateString();
                    })
                    .map(event => {
                      const availableSpots = event.capacity - event.registered;
                      return (
                        <div key={event.id} className="bg-[var(--background-card)] rounded-xl p-6 shadow-2xl">
                          <div className="mb-4">
                            <h4 className="text-white text-xl font-bold mb-2 font-['Space_Grotesk']">{event.title}</h4>
                            <div className="flex items-center gap-6 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">schedule</span>
                                <p className="text-gray-300">{event.startTime} - {event.endTime}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">group</span>
                                <p className="text-[var(--primary-color)] font-medium">
                                  {availableSpots} spots available
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">payments</span>
                                <p className="text-white font-bold">
                                  {event.price === 0 ? 'Free' : `$${event.price}`}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-400 mb-4 font-['Noto_Sans'] leading-relaxed">{event.description}</p>
                          </div>
                          
                          {availableSpots > 0 ? (
                            <button
                              onClick={() => handleBookNow(event, selectedDate)}
                              className="w-full bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined">event_available</span>
                              Book This Session
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
                    const eventDate = new Date(event.date);
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
                <h3 className="text-white text-xl font-bold mb-2 font-['Space_Grotesk']">Select a Date</h3>
                <p className="text-gray-400 font-['Noto_Sans']">Choose a date from the calendar to view available sessions and book your spot</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && selectedEventForBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--background-dark)] rounded-2xl max-w-2xl w-full relative shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-xl font-bold font-['Space_Grotesk'] mb-1">
                      {selectedEventForBooking.title}
                    </h3>
                    <p className="text-white text-opacity-90 font-['Noto_Sans'] text-sm">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • {selectedEventForBooking.startTime} - {selectedEventForBooking.endTime}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseBookingForm}
                    className="text-white hover:text-gray-300 transition-colors p-1 hover:bg-white hover:bg-opacity-10 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>
              
              {/* Modal Body - Compact Layout */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Event Details */}
                  <div className="bg-[var(--background-card)] p-3 rounded-lg h-fit">
                    <h4 className="text-white font-bold text-sm mb-2 font-['Space_Grotesk']">Session Details</h4>
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-300 leading-tight">{selectedEventForBooking.description}</p>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-sm">group</span>
                        <p className="text-[var(--primary-color)] font-medium">
                          {selectedEventForBooking.capacity - selectedEventForBooking.registered} spots available
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-sm">payments</span>
                        <p className="text-white font-bold">
                          {selectedEventForBooking.price === 0 ? 'Free' : `$${selectedEventForBooking.price}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Booking Form */}
                  <div>
                    <h4 className="text-white font-bold text-lg mb-4 font-['Space_Grotesk']">Book Your Spot</h4>
                    <BookingForm 
                      selectedEvent={selectedEventForBooking}
                      selectedDate={selectedDate}
                      onBookingSubmit={handleBookingSubmit}
                      isModal={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </section>
  );
};

export default EventsSection;