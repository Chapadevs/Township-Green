const ScheduledEvents = () => {
  const events = [
    {
      id: 1,
      date: "Sat 4th",
      title: "PUFF-N-PAINT",
      time: "6–9PM",
      description: "Top of the Green Entertainment",
      address: "17 E Scott Street, Riverside, New Jersey",
      highlight: "Art Session",
      isSpecial: false,
      type: "bookable"
    },
    {
      id: 2,
      date: "Sat 11th",
      title: "RIVERSIDE CAR SHOW",
      time: "12–5PM",
      description: "– 20% OFF AT TOWNSHIP GREEN!",
      address: "Scott Street, Riverside",
      highlight: "20% OFF Special",
      isSpecial: true,
      hasLink: true,
      linkUrl: "https://townshipgreen.com/shop/",
      type: "fyi"
    },
    {
      id: 3,
      date: "Sun 12th",
      title: "JUST A WOMAN PRODUCT LAUNCH & EDUCATION EVENT",
      time: "1–4PM",
      description: "",
      address: "15 E Scott Street, Riverside, New Jersey",
      highlight: "Education Event",
      isSpecial: false,
      type: "fyi"
    },
    {
      id: 4,
      date: "Sat 25th",
      title: "HALLOWEED PARTY @ TOWNSHIP GREEN!",
      time: "12PM–9PM",
      description: "Food Truck, Games, Tarot Card Reading and More!",
      address: "15 E Scott Street, Riverside, New Jersey",
      highlight: "Special Event",
      isSpecial: true,
      type: "bookable"
    }
  ];

  return (
    <section className="md:pb-20 md:mb-8 bg-[var(--background-dark)]" id="events">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
        <div className="text-center mb-8">
          <div className="relative mb-2">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl font-['Space_Grotesk'] relative z-10">
              <span className="relative inline-block">
                <span className="text-white relative z-10">NEXT</span>
              </span>
              <span className="relative inline-block ml-4">
                <span className="text-[var(--primary-color)] relative z-10">EVENTS</span>
                <div className="absolute inset-0 bg-[var(--primary-color)] opacity-15 blur-lg transform scale-110"></div>
              </span>
            </h2>
          </div>
          <p className="text-lg text-[var(--text-secondary)] font-['Space_Grotesk'] font-medium">
            EVENTS SCHEDULE - OCTOBER 2025
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className={`bg-[var(--background-card)] rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl border-l-4 ${
                event.type === 'fyi'
                  ? 'border-orange-500'
                  : event.isSpecial 
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
                  {event.type === 'fyi' ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold font-['Space_Grotesk']">FYI</span>
                    </div>
                  ) : event.isSpecial && (
                    <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Event title */}
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-3 leading-tight">
                  {event.title}
                </h3>
                
                {/* Description */}
                {event.description && (
                  <p className="text-[var(--text-secondary)] font-['Noto_Sans'] mb-3">
                    {event.description}
                  </p>
                )}
                
                {/* Address */}
                <p className="text-sm text-[var(--text-muted)] font-['Noto_Sans'] mb-6">
                  {event.address}
                </p>
                
                {/* Highlight/action button */}
                {event.hasLink ? (
                  <a 
                    href={event.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neon-button inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer"
                  >
                    <span>{event.highlight} →</span>
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
