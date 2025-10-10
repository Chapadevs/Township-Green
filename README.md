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

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint


## 📄 Legal Compliance

This website is designed for a cannabis consumption lounge with the following considerations:

- Age verification requirements (21+)
- Local and state regulation compliance
- Clear terms of service and privacy policy
- Professional, trustworthy presentation

## 📝 License

This project is proprietary software for Township Community.

## 📞 Support

For technical support or questions:
- Email: admin@topofgreen.com
- Phone: (+1) 856-544-3065

---