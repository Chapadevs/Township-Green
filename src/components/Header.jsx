import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#254637] px-10 shadow-md bg-[var(--background-dark)]">
      <div className="flex items-center gap-4 text-white">
        <img
          src="/assets/Logo.png"
          alt="Top of the Green Logo"
          className="h-20 w-20 object-contain mr-3"
        />
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <nav className="flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium leading-normal"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('events')}
            className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium leading-normal"
          >
            Events
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium leading-normal"
          >
            Contact
          </button>
        </nav>
        <button 
          onClick={() => scrollToSection('booking')}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all"
        >
          <span className="truncate">Book Now</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1d2d25] border-b border-[#254637] md:hidden z-50">
          <div className="flex flex-col p-4 gap-4">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium text-left py-2"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium text-left py-2"
            >
              Events
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[var(--primary-color)] transition-colors text-base font-medium text-left py-2"
            >
              Contact
            </button>
            <button 
              onClick={() => scrollToSection('booking')}
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-[var(--primary-color)] text-white text-base font-bold tracking-[0.015em] hover:bg-opacity-90 transition-all mt-2"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;