import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import ScheduledEvents from './components/Events/ScheduledEvents.jsx';
import EventsSection from './components/Events/EventsSection.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#12211a] dark group/design-root overflow-x-hidden font-['Space_Grotesk','Noto_Sans',sans-serif]">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 pt-20">
          <Hero />
          <About />
          <ScheduledEvents />
          <EventsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;