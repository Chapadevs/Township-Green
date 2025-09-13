# Township Community - Cannabis Art Lounge

A modern, responsive website for Township Community - a cannabis consumption lounge focused on artistic expression and community building.

![Township Community](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19+-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4+-blue)

## 🎯 Features

- **Modern Design**: Dark theme with professional green accents
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Calendar**: Book art sessions with real-time availability
- **Email Integration**: Form submissions via EmailJS
- **Accessibility**: WCAG 2.1 AA compliant
- **Fast Performance**: Optimized for Core Web Vitals

## 🛠️ Tech Stack

- **Framework**: React 19 with JavaScript (JSX)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Forms**: EmailJS integration
- **Icons**: Material Symbols Outlined
- **Fonts**: Google Fonts (Space Grotesk, Noto Sans)
- **Deployment**: GitHub Pages

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended: 20.19+)
- npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Township-Green.git
   cd Township-Green
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📧 EmailJS Setup

To enable form submissions, you'll need to set up EmailJS:

1. **Create an EmailJS account** at [emailjs.com](https://www.emailjs.com/)

2. **Create a service** (Gmail, Outlook, etc.)

3. **Create an email template** with the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Phone number (for bookings)
   - `{{message}}` - Message content
   - `{{event_id}}` - Event ID (for bookings)
   - `{{guests}}` - Number of guests (for bookings)
   - `{{special_requests}}` - Special requests (for bookings)

4. **Get your credentials**:
   - Service ID from your EmailJS dashboard
   - Template ID from your email template
   - Public Key from your account settings

5. **Update your `.env` file** with these credentials

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header.jsx       # Navigation header
│   ├── Hero.jsx         # Hero section
│   ├── About.jsx        # About section
│   ├── Footer.jsx       # Site footer
│   └── Events/          # Event-related components
│       ├── EventsSection.jsx
│       ├── Calendar.jsx
│       └── BookingForm.jsx
├── hooks/               # Custom React hooks
│   └── useEmailJS.js    # EmailJS integration
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: `#23a867` (Green)
- **Secondary**: `#1d554c` (Dark Teal)
- **Background**: `#12211a` (Dark Green)
- **Cards**: `#1d2d25` (Card Background)

### Typography
- **Headers**: Space Grotesk (400, 500, 700, 900)
- **Body**: Noto Sans (400, 500, 700, 900)

### Component Standards
- Consistent padding and spacing
- Smooth hover transitions
- Rounded corners (8px)
- Shadow effects for depth

## 🚢 Deployment to GitHub Pages

### Automatic Deployment

1. **Fork or clone this repository**
2. **Set up repository secrets** in GitHub:
   - Go to Settings > Secrets and variables > Actions
   - Add these secrets:
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

3. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"

4. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

5. **Your site will be available at**:
   `https://your-username.github.io/Township-Green/`

### Manual Deployment

```bash
npm run build
# Upload the dist/ directory to your hosting provider
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Proper heading hierarchy
- Color contrast ratios met

## 📄 Legal Compliance

This website is designed for a cannabis consumption lounge with the following considerations:

- Age verification requirements (21+)
- Local and state regulation compliance
- Clear terms of service and privacy policy
- Professional, trustworthy presentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary software for Township Community.

## 📞 Support

For technical support or questions:
- Email: dev@townshipcommunity.com
- Phone: (555) 123-4567

---

**Built with ❤️ for the cannabis art community**