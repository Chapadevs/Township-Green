import BookingForm from './BookingForm.jsx';

const BookingModal = ({
  isOpen,
  event,
  selectedDate,
  onClose,
  onBookingSubmit,
}) => {
  if (!isOpen || !event) return null;

  const formatDurationHours = () => {
    const start = new Date(`2000/01/01 ${event.startTime}`);
    const end = new Date(`2000/01/01 ${event.endTime}`);
    const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
    return Number.isInteger(diffHours) ? diffHours : diffHours.toFixed(1);
  };

  const availableSpots = event.capacity - event.registered;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-0 sm:p-6">
      <div className="bg-[var(--background-dark)] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl max-h-screen sm:max-h-[95vh] relative shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-4 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-bold font-['Space_Grotesk'] mb-1">
                {event.title}
              </h3>
              <p className="text-white text-opacity-90 font-['Noto_Sans'] text-xs">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                • {event.startTime} - {event.endTime}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors p-1 hover:bg-white hover:bg-opacity-10 rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-full">
            {/* Left Column - Event Details */}
            <div className="space-y-4 sm:space-y-5">
              <div className="bg-[var(--background-card)] rounded-xl p-4 sm:p-5">
                <h4 className="text-white text-lg font-bold mb-3 font-['Space_Grotesk']">
                  Time & Duration
                </h4>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-lg">
                    schedule
                  </span>
                  <div>
                    <p className="text-white font-medium">
                      {event.startTime} - {event.endTime}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Duration: {formatDurationHours()} hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--background-card)] rounded-xl p-4 sm:p-5">
                <h4 className="text-white text-lg font-bold mb-3 font-['Space_Grotesk']">
                  What's Included
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-xs">
                      check
                    </span>
                    All art materials provided
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-xs">
                      check
                    </span>
                    Cannabis-friendly environment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-xs">
                      check
                    </span>
                    Professional guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-xs">
                      check
                    </span>
                    Relaxing atmosphere
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--primary-color)] text-xs">
                      check
                    </span>
                    Take your art home
                  </li>
                </ul>
              </div>

              <div className="border-2 border-[var(--primary-color)] p-3 rounded-lg shadow-lg text-center">
                <p className="text-white font-bold text-sm text-center">
                  <span>$ Payment at entrance - Cash accepted</span>
                </p>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="overflow-y-auto">
              <BookingForm
                selectedEvent={event}
                selectedDate={selectedDate}
                onBookingSubmit={onBookingSubmit}
                isModal={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

