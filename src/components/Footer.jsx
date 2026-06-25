const Footer = () => {
  return (
    <footer
      id="contact"
      style={{ background: '#1d2d25', padding: 'clamp(48px, 6vw, 64px) clamp(20px, 5vw, 40px) 40px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Top row: logo + Instagram */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img src="/assets/Logo.png" alt="Top of the Green" style={{ height: '44px', width: '44px', objectFit: 'contain' }} />
            <div>
              <p className="text-white font-['Space_Grotesk'] font-bold text-base">Top of the Green</p>
              <p className="text-[#6b7280] text-[13px]">© 2025 — All rights reserved.</p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/townshipgreen/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors"
          >
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
            <span className="text-sm font-medium">@townshipgreen</span>
          </a>
        </div>

        {/* 4-column info grid */}
        <div
          className="grid gap-8 py-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          <div>
            <h4 className="text-white font-['Space_Grotesk'] font-bold text-[15px] mb-3">Contact Us</h4>
            <p className="text-[#9ca3af] text-sm leading-[1.8]">admin@topofgreen.com<br />(609) 325-1339</p>
          </div>
          <div>
            <h4 className="text-white font-['Space_Grotesk'] font-bold text-[15px] mb-3">Location</h4>
            <p className="text-[#9ca3af] text-sm leading-[1.8]">17 E. Scott Street<br />Riverside, NJ 08075</p>
          </div>
          <div>
            <h4 className="text-white font-['Space_Grotesk'] font-bold text-[15px] mb-3">Hours</h4>
            <p className="text-[#9ca3af] text-sm leading-[1.8]">Mon – Thu: 6PM – 11PM<br />Fri – Sat: 5PM – 12AM<br />Sunday: Closed</p>
          </div>
          <div>
            <h4 className="text-white font-['Space_Grotesk'] font-bold text-[15px] mb-3">Legal</h4>
            <p className="text-[#9ca3af] text-sm leading-[1.8]">
              <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-[#9ca3af] hover:text-white transition-colors">Privacy Policy</a>
              <br />
              <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="text-[#9ca3af] hover:text-white transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[#52606b] text-xs leading-relaxed pt-6 border-t border-white/[0.06]">
          Please consume responsibly. Must be 21+ with valid ID. Compliance with all local and state cannabis regulations.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
