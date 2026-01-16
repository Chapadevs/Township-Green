import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import ScheduledEvents from './components/Events/ScheduledEvents.jsx';
import EventsSection from './components/Events/EventsSection.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/Events/BookingModal.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';

function HomePage() {
  // Shared booking state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleBookNow = (event, date = null) => {
    setSelectedEventForBooking(event);
    setSelectedDate(date || event.date);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedEventForBooking(null);
  };

  const handleBookingSubmit = async (data) => {
    try {
      console.log('Booking submitted:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Booking processed successfully');
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#12211a] dark group/design-root overflow-x-hidden font-['Space_Grotesk','Noto_Sans',sans-serif]">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <Hero />
          <About />
          <ScheduledEvents 
            onBookNow={handleBookNow}
          />
          <EventsSection 
            onBookNow={handleBookNow}
          />
        </main>
        <Footer />
      </div>
      <BookingModal
        isOpen={showBookingForm}
        event={selectedEventForBooking}
        selectedDate={selectedDate}
        onClose={handleCloseBookingForm}
        onBookingSubmit={handleBookingSubmit}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;