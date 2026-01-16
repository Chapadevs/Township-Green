import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../hooks/useBookings';
import { supabase } from '../../lib/supabaseClient';

const BookingForm = ({ selectedEvent, selectedDate, onBookingSubmit, isModal = false, onLoginRequired }) => {
  const { user, isAuthenticated } = useAuth();
  const { createBooking } = useBookings();
  
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

  // Auto-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: prev.name || user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

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
    
    // Check authentication first
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    if (!validateForm() || !selectedEvent) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Create booking in Supabase
      const { data: booking, error: bookingError } = await createBooking({
        event_id: selectedEvent.id,
        session_date: bookingDate,
        session_time: selectedEvent.start_time || '00:00:00',
        number_of_guests: formData.guests || 1,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        special_requests: formData.specialRequests || null,
        total_price: (selectedEvent.price || 0) * (formData.guests || 1)
      });

      if (bookingError) {
        throw bookingError;
      }

      // Send confirmation email via Supabase Edge Function
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-booking-email', {
          body: {
            bookingData: {
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              eventTitle: selectedEvent.title,
              eventId: selectedEvent.id || selectedEvent.title,
              sessionDate: bookingDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              sessionTime: `${selectedEvent.start_time} - ${selectedEvent.end_time}`,
              numberOfGuests: formData.guests,
              confirmationCode: booking.confirmation_code,
              specialRequests: formData.specialRequests || undefined
            }
          }
        });

        if (emailError) {
          console.error('Email notification failed:', emailError);
        } else {
          console.log('✅ Confirmation email sent successfully');
        }
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr);
        // Don't fail the booking if email fails
      }
      
      // Call parent callback
      if (onBookingSubmit) {
        await onBookingSubmit(booking);
      }
      
      // Reset form and show success
      setFormData({
        name: '',
        email: user?.email || '',
        phone: '',
        guests: 1,
        specialRequests: ''
      });
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Booking submission failed:', error);
      setErrors({ submit: error.message || 'Failed to create booking' });
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

  const availableSpots = selectedEvent ? selectedEvent.capacity - (selectedEvent.booked_seats || 0) : 0;

  // Use event date if no specific date is selected
  const bookingDate = selectedDate || (selectedEvent?.event_date ? new Date(selectedEvent.event_date) : null);

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={isModal ? "w-full" : "flex-1 min-w-[320px] max-w-md"}>
        <div className="bg-[#1d2d25] p-8 rounded-lg text-center">
          <div className="text-[var(--primary-color)] mb-4">
            <span className="material-symbols-outlined text-5xl">lock</span>
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Login Required</h3>
          <p className="text-gray-400 mb-6">
            Please sign in to your account to make a booking
          </p>
          <button
            onClick={onLoginRequired}
            className="bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Sign In to Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? "w-full" : "flex-1 min-w-[320px] max-w-md"}>
      {!isModal && <h3 className="text-white text-2xl font-bold mb-4">Book a Session</h3>}
      
      {selectedEvent && bookingDate ? (
        <div className={isModal ? "space-y-6" : "space-y-3"}>
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-900 border border-green-600 p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400">check_circle</span>
                <div>
                  <p className="text-green-400 font-medium">Booking confirmed!</p>
                  <p className="text-green-300 text-sm">Check your email for confirmation details</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(emailError || errors.submit) && (
            <div className="bg-red-900 border border-red-600 p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400">error</span>
                <p className="text-red-400 font-medium">{errors.submit || 'Error submitting booking'}</p>
              </div>
            </div>
          )}

          {/* Event Details - Only show in non-modal version */}
          {!isModal && (
            <div className="bg-[#1d2d25] p-4 rounded-lg space-y-2">
              <p className="text-white font-bold text-lg">{selectedEvent.title}</p>
              <p className="text-gray-400">{formatDate(bookingDate)}</p>
              <p className="text-gray-400">{selectedEvent.start_time} - {selectedEvent.end_time}</p>
              <p className="text-gray-300">{selectedEvent.description}</p>
              <p className="text-[var(--primary-color)] font-bold">{availableSpots} spots available</p>
            </div>
          )}

          {availableSpots > 0 ? (
            /* Booking Form */
            <form onSubmit={handleSubmit} className={isModal ? "space-y-6" : "space-y-3"}>
              {isModal ? (
                /* Modal Layout - Two Column Grid for Form Fields */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-300 font-medium mb-2 text-xs">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-2 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none text-xs h-10"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-300 font-medium mb-2 text-xs">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-2 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none text-xs h-10"
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-gray-300 font-medium mb-2 text-xs">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-2 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none text-xs h-10"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-gray-300 font-medium mb-2 text-xs">
                        Number of Guests
                      </label>
                      <select
                        id="guests"
                        value={formData.guests || 1}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        className="w-full px-2 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none text-xs h-10"
                      >
                        {[...Array(Math.min(availableSpots, 6))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-gray-300 font-medium mb-2 text-xs">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      value={formData.specialRequests || ''}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-2 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none resize-none text-xs"
                      placeholder="Any special accommodations or requests..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || emailLoading}
                    className="w-full flex items-center justify-center rounded px-3 h-10 bg-[var(--primary-color)] text-white font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {(isSubmitting || emailLoading) ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </span>
                    ) : (
                      <span>Reserve Your Spot</span>
                    )}
                  </button>
                </>
              ) : (
                /* Non-Modal Layout - Single Column */
                <>
                  <div>
                    <label htmlFor="name" className="block text-gray-300 font-medium mb-1 text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none"
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-300 font-medium mb-1 text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-300 font-medium mb-1 text-sm">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-gray-300 font-medium mb-1 text-sm">
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      value={formData.guests || 1}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none"
                    >
                      {[...Array(Math.min(availableSpots, 6))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-gray-300 font-medium mb-1 text-sm">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      value={formData.specialRequests || ''}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#12211a] border border-gray-600 rounded text-white focus:border-[var(--primary-color)] focus:outline-none resize-none"
                      placeholder="Any special accommodations or requests..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || emailLoading}
                    className="w-full flex items-center justify-center rounded px-3 h-12 bg-[var(--primary-color)] text-white font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {(isSubmitting || emailLoading) ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </span>
                    ) : (
                      <span>Reserve Your Spot</span>
                    )}
                  </button>
                </>
              )}
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