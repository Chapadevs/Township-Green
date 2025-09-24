const ScheduledEvents = () => {
  const events = [
    {
      id: 1,
      date: "Sat 4th",
      title: "PUFF-N-PAINT",
      time: "6–9PM",
      highlight: "Art Session",
      isSpecial: false
    },
    {
      id: 2,
      date: "Sat 11th",
      title: "RIVERSIDE CAR SHOW",
      time: "12–5PM",
      highlight: "20% OFF Special",
      isSpecial: true,
      hasLink: true,
      linkUrl: "https://townshipgreen.com/shop/"
    },
    {
      id: 3,
      date: "Sun 12th",
      title: "JUST A WOMAN PRODUCT LAUNCH",
      time: "1–4PM",
      highlight: "Education Event",
      isSpecial: false
    },
    {
      id: 4,
      date: "Sat 25th",
      title: "HALLOWEED PARTY",
      time: "12PM–9PM",
      highlight: "Food, Games & More!",
      isSpecial: true
    }
  ];

  return (
    <section className="py-6 md:py-8 bg-[var(--background-dark)]" id="events">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl font-['Space_Grotesk'] mb-2">
            TOP OF THE GREEN
          </h2>
          <p className="text-lg text-[var(--text-secondary)] font-['Space_Grotesk'] font-medium">
            EVENTS SCHEDULE - OCTOBER 2025
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className={`bg-[var(--background-card)] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl border-l-4 ${
                event.isSpecial 
                  ? 'border-[var(--primary-color)]' 
                  : 'border-[var(--secondary-color)]'
              }`}
            >
              <div className="p-6">
                {/* Header with date and time */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--primary-color)] text-sm font-bold font-['Space_Grotesk'] tracking-wide">
                      {event.date}
                    </div>
                    <div className="h-4 w-px bg-[var(--text-muted)]"></div>
                    <div className="bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm font-bold font-['Space_Grotesk'] tracking-wide">
                      {event.time}
                    </div>
                  </div>
                  {event.isSpecial && (
                    <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Event title */}
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-3 leading-tight">
                  {event.title}
                </h3>
                
                {/* Highlight/description */}
                {event.hasLink ? (
                  <a 
                    href={event.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[var(--primary-color)] bg-opacity-90 hover:bg-opacity-100 text-white px-4 py-2 rounded-full text-sm font-bold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
                  >
                    {event.highlight} →
                  </a>
                ) : (
                  <div className="inline-block bg-white bg-opacity-10 text-white px-3 py-1 rounded-full text-sm font-medium font-['Space_Grotesk']">
                    {event.highlight}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduledEvents;
