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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#254637] px-10 py-4 shadow-md">
      <div className="flex items-center gap-4 text-white">
        <div className="size-6 text-[var(--primary-color)]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          Township Community
        </h2>
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
          onClick={() => scrollToSection('events')}
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
              onClick={() => scrollToSection('events')}
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