import { useState } from 'react';
import useEmailJS from '../../hooks/useEmailJS.js';

const BookingForm = ({ selectedEvent, selectedDate, onBookingSubmit, isModal = false }) => {
  const { sendEmail, isLoading: emailLoading, error: emailError } = useEmailJS();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedEvent) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventId: selectedEvent.id,
        guests: formData.guests || 1,
        specialRequests: formData.specialRequests
      };

      // Send email via EmailJS
      await sendEmail(bookingData, 'booking');
      
      // Call parent callback
      await onBookingSubmit(bookingData);
      
      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests: 1,
        specialRequests: ''
      });
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const availableSpots = selectedEvent ? selectedEvent.capacity - selectedEvent.registered : 0;

  return (
    <div className={isModal ? "w-full" : "flex-1 min-w-[320px] max-w-md"}>
      {!isModal && <h3 className="text-white text-2xl font-bold mb-4">Book a Session</h3>}
      
      {selectedEvent && selectedDate ? (
        <div className={isModal ? "space-y-3" : "space-y-4"}>
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-900 border border-green-600 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                <p className="text-green-400 font-medium text-sm">Booking submitted successfully!</p>
              </div>
              <p className="text-green-300 text-xs mt-1">You will receive a confirmation email shortly.</p>
            </div>
          )}

          {/* Error Message */}
          {emailError && (
            <div className="bg-red-900 border border-red-600 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-lg">error</span>
                <p className="text-red-400 font-medium text-sm">Error submitting booking</p>
              </div>
              <p className="text-red-300 text-xs mt-1">{emailError}</p>
            </div>
          )}

          {/* Event Details - Only show in non-modal version */}
          {!isModal && (
            <div className="bg-[#1d2d25] p-4 rounded-lg space-y-2">
              <p className="text-white font-bold text-lg">{selectedEvent.title}</p>
              <p className="text-gray-400">{formatDate(selectedDate)}</p>
              <p className="text-gray-400">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
              <p className="text-gray-300">{selectedEvent.description}</p>
              <p className="text-[var(--primary-color)] font-medium">
                {availableSpots} spots available
              </p>
            </div>
          )}

          {availableSpots > 0 ? (
            /* Booking Form */
            <form onSubmit={handleSubmit} className={isModal ? "space-y-3" : "space-y-4"}>
              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded-lg text-white focus:border-[var(--primary-color)] focus:outline-none"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded-lg text-white focus:border-[var(--primary-color)] focus:outline-none"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded-lg text-white focus:border-[var(--primary-color)] focus:outline-none"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="guests" className="block text-gray-300 text-sm font-medium mb-1">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  value={formData.guests || 1}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded-lg text-white focus:border-[var(--primary-color)] focus:outline-none"
                >
                  {[...Array(Math.min(availableSpots, 6))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-gray-300 text-sm font-medium mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  value={formData.specialRequests || ''}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded-lg text-white focus:border-[var(--primary-color)] focus:outline-none resize-none"
                  placeholder="Any special accommodations or requests..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || emailLoading}
                className={`w-full flex items-center justify-center rounded-lg px-6 bg-[var(--primary-color)] text-white font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isModal ? 'h-10 text-sm' : 'h-12 text-lg'}`}
              >
                {(isSubmitting || emailLoading) ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking...
                  </span>
                ) : (
                  'Reserve Your Spot'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-[#1d2d25] p-4 rounded-lg text-center">
              <p className="text-red-400 font-medium">This session is fully booked</p>
              <p className="text-gray-400 text-sm mt-1">Please select another date</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1d2d25] p-4 rounded-lg text-center">
          <div className="text-gray-400 mb-2">
            <span className="material-symbols-outlined text-4xl">event</span>
          </div>
          <p className="text-gray-300 font-medium">Select a date to view available sessions</p>
          <p className="text-gray-400 text-sm mt-1">Choose from the calendar to see booking options</p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;