import { useState } from 'react';
import Calendar from './Calendar.jsx';
import BookingForm from './BookingForm.jsx';

const EventsSection = () => {
  const [selectedDate, setSelectedDate] = useState(null);

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
              <h2 className="text-white text-4xl font-bold leading-tight tracking-tight text-center mb-12">
          Upcoming Events
        </h2>
      <div className="max-w-5xl mx-auto">
              {/* Event Features */}
      <div className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-[var(--primary-color)] mb-3">
              <span className="material-symbols-outlined text-3xl">brush</span>
            </div>
            <h4 className="text-white font-bold mb-2">All Materials Provided</h4>
            <p className="text-gray-400 text-sm">We supply everything you need for your creative session</p>
          </div>
          
          <div className="text-center">
            <div className="text-[var(--primary-color)] mb-3">
              <span className="material-symbols-outlined text-3xl">schedule</span>
            </div>
            <h4 className="text-white font-bold mb-2">Flexible Sessions</h4>
            <p className="text-gray-400 text-sm">Multiple time slots available throughout the week</p>
          </div>
          
          <div className="text-center">
            <div className="text-[var(--primary-color)] mb-3">
              <span className="material-symbols-outlined text-3xl">group</span>
            </div>
            <h4 className="text-white font-bold mb-2">Small Groups</h4>
            <p className="text-gray-400 text-sm">Intimate sessions with limited capacity for personal attention</p>
          </div>
          
          <div className="text-center">
            <div className="text-[var(--primary-color)] mb-3">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h4 className="text-white font-bold mb-2">Safe Environment</h4>
            <p className="text-gray-400 text-sm">Legal, clean, and professionally managed space</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-start justify-center gap-12">
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
          
          <BookingForm 
            selectedEvent={getSelectedEvent()}
            selectedDate={selectedDate}
            onBookingSubmit={handleBookingSubmit}
          />
        </div>

        
      </div>
    </section>
  );
};

export default EventsSection;