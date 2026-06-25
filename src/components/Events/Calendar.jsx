import { useState } from 'react';

const Calendar = ({ selectedDate, onDateSelect, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Start at current month

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
    if (!date || !events) return [];
    return events.filter(event => {
      // Handle both 'date' and 'event_date' properties (Supabase uses event_date)
      const eventDateStr = event.event_date || event.date;
      if (!eventDateStr) return false;
      
      const eventDate = new Date(eventDateStr);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeForDate = (date) => {
    if (!date) return null;
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return null;

    // Supabase raw events use event_type; transformed events use type
    const isFyi = (event) =>
      event.event_type === 'special-event' || event.type === 'fyi';

    const hasFyiEvent = dayEvents.some(isFyi);
    const hasBookableEvent = dayEvents.some((e) => !isFyi(e));

    if (hasBookableEvent) return 'bookable';
    if (hasFyiEvent) return 'fyi';
    return 'bookable';
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

  const hasEventsInMonth = (year, month) => {
    if (!events) return false;
    return events.some(event => {
      const dateStr = event.event_date || event.date;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === month;
    });
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
  const prevY = currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear();
  const prevM = currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1;
  const nextY = currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear();
  const nextM = currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1;
  const prevHasEvents = hasEventsInMonth(prevY, prevM);
  const nextHasEvents = hasEventsInMonth(nextY, nextM);
  const currentHasEvents = hasEventsInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  return (
    <div id="calendar" className="flex-1 min-w-[320px] max-w-md bg-[#1d2d25] p-6 rounded-lg shadow-2xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="text-white hover:text-[var(--primary-color)] transition-colors"
          aria-label="Previous month"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
        </button>
        <h3 className="flex items-center gap-2 text-white text-2xl font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          {currentHasEvents && (
            <span className="w-2.5 h-2.5 bg-[var(--primary-color)] rounded-full flex-shrink-0" />
          )}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="text-white hover:text-[var(--primary-color)] transition-colors"
          aria-label="Next month"
        >
          <span className="material-symbols-outlined text-3xl">arrow_forward_ios</span>
        </button>
      </div>

      {/* Event Legend */}
      <div className="mb-4">
        <div className="flex justify-center items-center gap-6 sm:gap-8 text-base sm:text-lg flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full"></div>
            <span className="text-white font-bold italic">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-white font-bold italic">Informational</span>
          </div>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {dayNames.map((day, index) => (
          <p key={`day-${index}`} className="text-gray-400 font-bold text-sm">
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

          // Create unique key for each calendar cell
          const uniqueKey = date 
            ? `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${date.getDate()}`
            : `empty-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${index}`;

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
            <div key={uniqueKey} className="relative">
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