# Township Community - Setup Guide

## 🚀 Complete Setup Instructions

### 1. Project Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Township-Green

# Install dependencies
npm install
```

### 2. EmailJS Configuration

#### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Create Email Service
1. In EmailJS dashboard, click "Add New Service"
2. Choose your email provider (Gmail recommended)
3. Follow the authentication steps
4. Note your **Service ID**

#### Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template content:

```html
Subject: Township Community - {{message_type}}

Hello Township Community,

You have received a new {{message_type}} from your website:

Name: {{from_name}}
Email: {{from_email}}
{{#phone}}Phone: {{phone}}{{/phone}}

{{#event_id}}
Event Details:
- Event ID: {{event_id}}
- Number of Guests: {{guests}}
- Special Requests: {{special_requests}}
{{/event_id}}

{{#message}}
Message:
{{message}}
{{/message}}

{{#subject}}
Subject: {{subject}}
{{/subject}}

Best regards,
Township Community Website
```

4. Note your **Template ID**

#### Step 4: Get Public Key
1. Go to "Account" in EmailJS dashboard
2. Find your **Public Key** (User ID)

#### Step 5: Set Environment Variables
Create a `.env` file in your project root:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxxxxx
```

### 3. Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 4. Testing Forms

1. **Navigate to the Events section**
2. **Select a date** from the calendar
3. **Fill out the booking form**
4. **Submit and check your email**

### 5. Production Deployment

#### Option A: Vercel (Recommended)

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Set Environment Variables**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add your EmailJS credentials:
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

#### Option B: Netlify

1. **Connect GitHub to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Set Environment Variables**
   - In Netlify dashboard, go to Site Settings > Environment Variables
   - Add your EmailJS credentials

3. **Deploy**
   - Netlify will use the `netlify.toml` configuration

### 6. Custom Domain (Optional)

#### For Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### For Netlify:
1. Go to Site Settings > Domain Management
2. Add your custom domain
3. Configure DNS records

### 7. SSL Certificate

Both Vercel and Netlify provide automatic SSL certificates for HTTPS.

## 🔧 Troubleshooting

### EmailJS Not Working?

1. **Check Console Errors**
   - Open browser DevTools (F12)
   - Look for EmailJS errors in Console

2. **Verify Environment Variables**
   ```bash
   # Check if variables are loaded
   console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID)
   ```

3. **Test EmailJS Credentials**
   - Use EmailJS dashboard test feature
   - Verify template variables are correct

### Build Errors?

1. **Clear Cache**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node Version**
   ```bash
   node --version  # Should be 18+
   ```

3. **TypeScript Errors**
   ```bash
   npm run build  # Check for type errors
   ```

### Performance Issues?

1. **Optimize Images**
   - Use WebP format when possible
   - Compress large images

2. **Check Bundle Size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

3. **Analyze Bundle**
   ```bash
   npm install -g webpack-bundle-analyzer
   npx vite-bundle-analyzer
   ```

## 📞 Support

Need help? Contact:
- **Technical Issues**: dev@townshipcommunity.com
- **Business Questions**: info@townshipcommunity.com
- **Emergency**: (555) 123-4567

## ✅ Checklist

- [ ] Project cloned and dependencies installed
- [ ] EmailJS account created and configured
- [ ] Environment variables set
- [ ] Development server running
- [ ] Forms tested and working
- [ ] Production deployment configured
- [ ] Custom domain set up (if applicable)
- [ ] SSL certificate verified

---

**You're now ready to launch Township Community! 🌿**
