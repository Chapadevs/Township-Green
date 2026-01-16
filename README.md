# 🎨 Township Green - Cannabis Art Lounge Website

A modern, professional website for Township Green community cannabis consumption lounge, featuring event bookings, art sessions, and community engagement.

---

## ✨ Features

- 🎯 **Event Management** - Beautiful calendar and booking system
- 🔐 **User Authentication** - Secure sign-up and login via Supabase
- 📧 **Email Confirmations** - Automated booking confirmations
- 👨‍💼 **Admin Panel** - Easy event and booking management
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Modern** - Built with React + Vite
- 🎨 **Professional Design** - Dark theme with green accents

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works!)
- Resend account (free tier: 3,000 emails/month)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR-USERNAME/Township-Green.git
cd Township-Green
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Update with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to **SQL Editor**
4. Copy and run `supabase-schema.sql`

### 4. Set Up Emails

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Set Resend API key
supabase secrets set RESEND_API_KEY=your_resend_api_key

# Deploy email function
supabase functions deploy send-booking-email
```

Get your Resend API key from [resend.com](https://resend.com) (free account).

### 5. Run Locally

```bash
npm run dev
```

Open http://localhost:5173

### 6. Deploy to Production

See **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** for full deployment instructions.

---

## 📚 Documentation

- **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** - Full deployment walkthrough
- **[EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md)** - Email configuration
- **[ADMIN-PANEL-GUIDE.md](./ADMIN-PANEL-GUIDE.md)** - Admin panel usage

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend & Services
- **Supabase** - Database, Authentication, Edge Functions
- **PostgreSQL** - Database (via Supabase)
- **Resend** - Email delivery service

### Deployment
- **GitHub Pages** / Vercel / Netlify - Frontend hosting
- **Supabase** - Backend & serverless functions (all included)

---

## 📁 Project Structure

```
Township-Green/
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Admin/         # Admin panel components
│   │   └── Events/        # Event & booking components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Supabase client
│   └── utils/             # Helper functions
├── supabase/
│   └── functions/         # Edge Functions (email)
│       └── send-booking-email/
├── public/                # Static assets
└── dist/                  # Production build
```

---

## 🎨 Design System

### Colors
- **Primary**: `#23a867` (Green)
- **Secondary**: `#1d554c` (Dark Teal)
- **Background**: `#12211a` (Dark)
- **Cards**: `#1d2d25`

### Typography
- **Headings**: Space Grotesk
- **Body**: Noto Sans

See project rules in `.cursorrules` for complete design system.

---

## 💰 Costs

### Free Tier (Small Business)
- **Supabase**: 500MB database, 50,000 monthly active users - **FREE**
- **Resend**: 3,000 emails/month, 100/day - **FREE**
- **GitHub Pages**: Unlimited static hosting - **FREE**

**Total: $0/month** for most small businesses! 🎉

### When You Scale
- **Supabase Pro**: $25/month (starts at 100K+ MAU)
- **Resend Pro**: $20/month (starts at 50K emails/month)

---

## 🔑 Key Features Explained

### 1. Event Booking System
- Interactive calendar with available dates
- Real-time capacity tracking
- User-friendly booking form
- Automatic email confirmations

### 2. Authentication
- Secure user signup/login via Supabase Auth
- Email-based authentication
- Profile management
- Session persistence

### 3. Admin Panel
- Create and manage events
- View all bookings
- Track event capacity
- User-friendly interface

### 4. Email System
- **No frontend dependencies** (EmailJS removed!)
- Backend-only email sending via Supabase Edge Functions
- Professional HTML email templates
- Reliable delivery via Resend

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Modes

- **Development**: `npm run dev` - Uses development config
- **Production**: `npm run build` - Optimized build

---

## 🔒 Security

- ✅ Row Level Security (RLS) on all database tables
- ✅ Secure authentication via Supabase
- ✅ API keys stored server-side only
- ✅ HTTPS enforced in production
- ✅ Input validation and sanitization

---

## 🆘 Troubleshooting

### Common Issues

**"Can't connect to Supabase"**
- Check your `.env` file has correct credentials
- Verify Supabase project is active

**"Emails not sending"**
- Follow [EMAIL-SETUP-GUIDE.md](./EMAIL-SETUP-GUIDE.md)
- Check Resend dashboard for errors
- Verify `RESEND_API_KEY` is set in Supabase

**"Can't access admin panel"**
- Make your user an admin:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

See **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** for more troubleshooting.

---

## 📝 Creating an Admin User

```sql
-- Run this in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Then go to `/admin` on your site.

---

## 🎯 What's Included

### For Customers
- Browse upcoming events
- View event details and schedules
- Book art sessions with date selection
- Receive email confirmations
- Manage their profile

### For Admins
- Full event management (create, edit, delete)
- View all bookings in one place
- Track event capacity in real-time
- Simple, intuitive interface

---

## 📦 Deployment

### Quick Deploy to GitHub Pages

```bash
# Ensure environment is configured
# Add secrets to GitHub: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# Deploy
git add .
git commit -m "Deploy Township Green"
git push origin main
```

GitHub Actions will automatically build and deploy!

### Alternative Platforms

**Vercel**: One-click deploy - [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Netlify**: Drag & drop `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

---

## 🤝 Support

For issues or questions:
1. Check the documentation in this repo
2. Review [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)
3. Check Supabase logs for errors
4. Review Resend dashboard for email issues

---

## 📄 License

Private project for Township Green cannabis lounge.

---

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Resend](https://resend.com)
- [Vite](https://vitejs.dev)

---

**🎨 Township Green** - Where community meets creativity

*A professional, modern website for your cannabis art lounge.*
