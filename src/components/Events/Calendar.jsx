import { useState } from 'react';

const Calendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // Start at October 2025

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeForDate = (date) => {
    if (!date) return null;
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return null;
    
    // Check if any event is FYI type
    const hasFyiEvent = dayEvents.some(event => event.type === 'fyi');
    const hasBookableEvent = dayEvents.some(event => event.type !== 'fyi');
    
    // Priority: if there's a bookable event, show that style
    if (hasBookableEvent) return 'bookable';
    if (hasFyiEvent) return 'fyi';
    return 'bookable'; // default
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="flex-1 min-w-[320px] max-w-md bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="text-white hover:text-[var(--primary-color)] transition-colors"
          aria-label="Previous month"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
        </button>
        <h3 className="text-white text-2xl font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button 
          onClick={() => navigateMonth('next')}
          className="text-white hover:text-[var(--primary-color)] transition-colors"
          aria-label="Next month"
        >
          <span className="material-symbols-outlined text-3xl">arrow_forward_ios</span>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {dayNames.map((day) => (
          <p key={day} className="text-gray-400 font-bold text-sm">
            {day}
          </p>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((date, index) => {
          const hasEvents = date ? getEventsForDate(date).length > 0 : false;
          const eventType = getEventTypeForDate(date);
          const dateIsToday = isToday(date);
          const dateIsSelected = isSelected(date);

          // Define colors based on event type
          const getEventColors = () => {
            if (eventType === 'fyi') {
              return {
                bg: 'bg-orange-500 bg-opacity-30 border-2 border-orange-500 hover:bg-opacity-50',
                dot: 'bg-orange-500',
                ring: 'ring-orange-500'
              };
            }
            return {
              bg: 'bg-[var(--primary-color)] bg-opacity-30 border-2 border-[var(--primary-color)] hover:bg-opacity-50',
              dot: 'bg-[var(--primary-color)]',
              ring: 'ring-[var(--primary-color)]'
            };
          };

          const colors = getEventColors();

          // Define selected state colors based on event type
          const getSelectedColors = () => {
            if (eventType === 'fyi') {
              return 'bg-orange-500 ring-2 ring-orange-800 ring-opacity-50';
            }
            return 'bg-[var(--primary-color)] ring-2 ring-[var(--primary-color)] ring-opacity-50';
          };

          return (
            <div key={index} className="relative">
              {date ? (
                <button
                  onClick={() => onDateSelect(date)}
                  className={`
                    h-10 w-10 mx-auto text-white text-sm font-medium rounded-md transition-colors relative
                    ${dateIsSelected 
                      ? getSelectedColors()
                      : hasEvents
                        ? colors.bg
                        : 'hover:bg-[var(--secondary-color)]'
                    }
                  `}
                >
                  {date.getDate()}
                  {hasEvents && !dateIsSelected && (
                    <div className="absolute -top-1 -right-1">
                      <div className={`w-3 h-3 ${colors.dot} rounded-full border-2 border-[#1d2d25]`}></div>
                    </div>
                  )}
                </button>
              ) : (
                <div className="h-12"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;