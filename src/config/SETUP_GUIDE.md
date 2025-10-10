# 🚀 EmailJS Setup - 3 Simple Steps

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) 
2. Create free account & verify email

## Step 2: Setup EmailJS Dashboard
1. **Add Email Service**: Gmail/Outlook/Yahoo
2. **Create Email Template**: Copy this HTML template:

```html
<p>New booking from {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Event:</strong> {{event_id}}</p>
<p><strong>Guests:</strong> {{guests}}</p>
<p><strong>Special Requests:</strong> {{special_requests}}</p>
```

3. **Get Your IDs**: Copy Service ID, Template ID, and Public Key

## Step 3: Update Your .env File
Copy `.env.example` to `.env` and add your EmailJS credentials:

```
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_ADMIN_EMAIL=your-email@yourdomain.com
```

## ✅ Test
Run `npm run dev` and try booking an event!

---
That's it! Your email system is ready 🌿