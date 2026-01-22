import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/LoginModal';
import SignupModal from './Auth/SignupModal';

const Header = ({ onOpenSignup, showSignupModal: propShowSignupModal, onCloseSignup }) => {
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [internalSignupModal, setInternalSignupModal] = useState(false);
  
  // Use prop if provided, otherwise use internal state
  const showSignupModal = propShowSignupModal !== undefined ? propShowSignupModal : internalSignupModal;
  const handleCloseSignup = propShowSignupModal !== undefined 
    ? (onCloseSignup || (() => {}))
    : () => setInternalSignupModal(false);
  const handleOpenSignup = onOpenSignup || (() => setInternalSignupModal(true));

  const isAdminPage = location.pathname === '/admin';

  const scrollToSection = (sectionId) => {
    // If on admin page, navigate home first
    if (isAdminPage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      if (sectionId === 'about') {
        // Scroll a bit higher for the about section
        const elementPosition = element.offsetTop - 80;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      } else if (sectionId === 'calendar') {
        // Scroll a bit higher for the calendar section
        const elementPosition = element.offsetTop - 180;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setIsMobileMenuOpen(false);
  };

  const openSignupModal = () => {
    handleOpenSignup();
    setIsMobileMenuOpen(false);
  };

  const goToHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#254637] px-10 shadow-md bg-[var(--background-dark)]">
      <div className="flex items-center gap-8 text-white">
        <button 
          onClick={goToHome}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Go to home"
        >
          <img
            src="/assets/Logo.png"
            alt="Top of the Green Logo"
            className="h-20 w-20 object-contain"
          />
        </button>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('about')}
            className="text-white nav-button text-base font-medium leading-normal"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('events')}
            className="text-white nav-button text-base font-medium leading-normal"
          >
            Events
          </button>
          <button 
            onClick={() => { navigate('/blog'); setIsMobileMenuOpen(false); }}
            className="text-white nav-button text-base font-medium leading-normal"
          >
            What's happening
          </button>
        </nav>
      </div>
      {/* Desktop User Controls */}
      <div className="hidden md:flex flex-1 justify-end gap-8">
        {!loading && (
          user ? (
            <div className="flex items-center gap-6 h-12">
              <span className="text-white/80 text-sm whitespace-nowrap">
                Hi, {profile?.full_name || user.email?.split('@')[0]}
              </span>
              {isAdmin && !isAdminPage && (
                <button
                  onClick={() => navigate('/admin')}
                  className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-3 py-1.5 rounded-md font-semibold transition-all text-sm border-l border-white/20 pl-3 whitespace-nowrap"
                >
                  Admin Panel
                </button>
              )}
              {isAdminPage && (
                <button
                  onClick={() => navigate('/')}
                  className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-3 py-1.5 rounded-md font-semibold transition-all text-sm border-l border-white/20 pl-3 whitespace-nowrap"
                >
                  Home
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="text-[#23a867] hover:text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={openLoginModal}
                className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-3 py-1.5 rounded-md font-semibold transition-all text-sm"
              >
                Login
              </button>
              <button 
                onClick={openSignupModal}
                className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-3 py-1.5 rounded-md font-semibold transition-all text-sm"
              >
                Sign Up
              </button>
            </div>
          )
        )}
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
              className="text-white nav-button text-base font-medium text-left py-2"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="text-white nav-button text-base font-medium text-left py-2"
            >
              Events
            </button>
            <button 
              onClick={() => { navigate('/blog'); setIsMobileMenuOpen(false); }}
              className="text-white nav-button text-base font-medium text-left py-2"
            >
              What's happening
            </button>
            {!loading && (
              user ? (
                <>
                  <div className="text-white text-sm py-2 border-t border-[#254637] mt-2 pt-4">
                    Hi, {profile?.full_name || user.email?.split('@')[0]}
                  </div>
                  {isAdmin && !isAdminPage && (
                    <button
                      onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                      className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-4 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                      Admin Panel
                    </button>
                  )}
                  {isAdminPage && (
                    <button
                      onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                      className="text-white text-base font-medium text-left py-2 flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">home</span>
                      Home
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-white text-base font-medium text-left py-2 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={openLoginModal}
                    className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-4 py-2.5 rounded-lg font-bold transition-all"
                  >
                    Login
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className="border-2 border-[#23a867] text-[#23a867] hover:text-white px-4 py-2.5 rounded-lg font-bold transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          handleOpenSignup();
        }}
      />
      <SignupModal 
        isOpen={showSignupModal}
        onClose={handleCloseSignup}
        onSwitchToLogin={() => {
          handleCloseSignup();
          setShowLoginModal(true);
        }}
      />
    </header>
  );
};

export default Header;