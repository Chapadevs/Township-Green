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
    <>
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap px-10 shadow-md backdrop-blur-[10px]" style={{ background: 'rgba(18,33,26,0.92)' }}>
      <div className="flex items-center gap-8 text-white">
        <button
          onClick={goToHome}
          className="cursor-pointer hover:opacity-80 transition-opacity p-2"
          aria-label="Go to home"
        >
          <img
            src="/assets/Logo.png"
            alt="Top of the Green Logo"
            className="h-[50px] w-[50px] object-contain"
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
            onClick={() => { 
              navigate('/blog')
              setIsMobileMenuOpen(false)
              // Scroll to top after navigation
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }, 100)
            }}
            className="text-white nav-button text-base font-medium leading-normal"
          >
            News
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
                className="border border-[#1d8c56] text-[#1d8c56] hover:text-white hover:bg-[#1d8c56] px-[18px] py-2 rounded-[9px] font-semibold transition-all text-sm"
              >
                Login
              </button>
              <button
                onClick={openSignupModal}
                className="bg-[#23a867] border border-[#23a867] text-white hover:bg-[#1e8f57] hover:border-[#1e8f57] px-[18px] py-2 rounded-[9px] font-semibold transition-all text-sm"
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

    </header>

      {/* Mobile Menu - Full Screen Overlay — rendered outside <header> to escape backdrop-blur stacking context */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0d1f16] z-[100] md:hidden flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-[70px] border-b border-white/[0.08] flex-shrink-0">
            <button onClick={goToHome} className="hover:opacity-80 transition-opacity">
              <img src="/assets/Logo.png" alt="Top of the Green Logo" className="h-[44px] w-[44px] object-contain" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col flex-1 px-6 pt-2 overflow-y-auto">
            <button
              onClick={() => scrollToSection('about')}
              className="flex items-center justify-between py-3 border-b border-white/[0.08] text-white font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left hover:text-[#23a867] transition-colors"
            >
              About
              <span className="text-xl font-light opacity-60">→</span>
            </button>
            <button
              onClick={() => scrollToSection('events')}
              className="flex items-center justify-between py-3 border-b border-white/[0.08] text-white font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left hover:text-[#23a867] transition-colors"
            >
              Events
              <span className="text-xl font-light opacity-60">→</span>
            </button>
            <button
              onClick={() => {
                navigate('/blog');
                setIsMobileMenuOpen(false);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              }}
              className="flex items-center justify-between py-3 border-b border-white/[0.08] text-white font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left hover:text-[#23a867] transition-colors"
            >
              News
              <span className="text-xl font-light opacity-60">→</span>
            </button>

            {/* Reserve a Spot — guests only */}
            {!loading && !user && (
              <button
                onClick={() => scrollToSection('calendar')}
                className="flex items-center justify-between py-3 border-b border-white/[0.08] text-[#23a867] font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left"
              >
                Reserve a Spot
                <span className="text-xl font-light">→</span>
              </button>
            )}

            {/* Admin Panel */}
            {!loading && user && isAdmin && !isAdminPage && (
              <button
                onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-between py-3 border-b border-white/[0.08] text-[#23a867] font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left"
              >
                Admin Panel
                <span className="text-xl font-light">→</span>
              </button>
            )}
            {!loading && user && isAdminPage && (
              <button
                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-between py-3 border-b border-white/[0.08] text-[#23a867] font-['Space_Grotesk'] font-bold text-xl tracking-tight text-left"
              >
                Back to Home
                <span className="text-xl font-light">→</span>
              </button>
            )}
          </nav>

          {/* Bottom auth section */}
          <div className="px-6 pb-10 pt-4 space-y-3 flex-shrink-0">
            {!loading && (
              user ? (
                <>
                  <p className="text-white/40 text-sm text-center font-['Space_Grotesk'] mb-4">
                    Hi, {profile?.full_name || user.email?.split('@')[0]}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-white/20 text-white py-[10px] rounded-xl font-['Space_Grotesk'] font-bold text-sm transition-all hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openSignupModal}
                    className="w-full bg-[#23a867] text-white py-[10px] rounded-xl font-['Space_Grotesk'] font-bold text-sm transition-all hover:bg-[#1e8f57]"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={openLoginModal}
                    className="w-full border border-white/20 text-white py-[10px] rounded-xl font-['Space_Grotesk'] font-bold text-sm transition-all hover:bg-white/10"
                  >
                    Login
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
    </>
  );
};

export default Header;