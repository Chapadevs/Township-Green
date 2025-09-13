import { useState } from 'react';
import Calendar from './Calendar.jsx';
import BookingForm from './BookingForm.jsx';

const EventsSection = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events data - in a real app, this would come from an API
  const [events] = useState([
    {
      id: '1',
      title: 'Open Drawing Session',
      description: 'Bring your own materials and vibes. Perfect for beginners and experienced artists alike.',
      date: new Date(2024, 6, 5), // July 5, 2024
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      capacity: 20,
      registered: 12,
      price: 25
    },
    {
      id: '2',
      title: 'Watercolor Workshop',
      description: 'Guided watercolor session with all materials provided. Learn techniques while you relax.',
      date: new Date(2024, 6, 12), // July 12, 2024
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      capacity: 15,
      registered: 8,
      price: 35
    },
    {
      id: '3',
      title: 'Canvas & Chill',
      description: 'Free-form painting session on canvas. All skill levels welcome.',
      date: new Date(2024, 6, 19), // July 19, 2024
      startTime: '7:30 PM',
      endTime: '10:30 PM',
      capacity: 18,
      registered: 15,
      price: 30
    },
    {
      id: '4',
      title: 'Sketch & Smoke',
      description: 'Focused sketching session with live model. Drawing pads and pencils provided.',
      date: new Date(2024, 6, 26), // July 26, 2024
      startTime: '8:00 PM',
      endTime: '11:00 PM',
      capacity: 12,
      registered: 5,
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
    <section className="py-20 px-10 bg-[var(--secondary-color)] bg-opacity-20" id="events">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-white text-4xl font-bold leading-tight tracking-tight text-center mb-12">
          Upcoming Events
        </h2>
        
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

        {/* Event Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default EventsSection;