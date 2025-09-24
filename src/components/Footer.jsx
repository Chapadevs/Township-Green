const Footer = () => {
  return (
    <footer className="bg-[#1d2d25] py-8 px-10" id="contact">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-gray-400">© 2024 Top of the Green. All rights reserved.</p>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-6">
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Follow us on Instagram"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Follow us on Twitter"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-white font-bold mb-2">Contact Us</h4>
            <p className="text-gray-400 text-sm">Email: info@townshipcommunity.com</p>
            <p className="text-gray-400 text-sm">Phone: (555) 123-4567</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-2">Location</h4>
            <p className="text-gray-400 text-sm">123 Art District</p>
            <p className="text-gray-400 text-sm">Creative City, CC 12345</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-2">Hours</h4>
            <p className="text-gray-400 text-sm">Monday - Thursday: 6PM - 11PM</p>
            <p className="text-gray-400 text-sm">Friday - Saturday: 5PM - 12AM</p>
            <p className="text-gray-400 text-sm">Sunday: Closed</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Please consume responsibly. Must be 21+ with valid ID. 
            Compliance with all local and state cannabis regulations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;