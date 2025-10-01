# EmailJS Setup Guide for Township Green

This guide will help you set up EmailJS to handle email notifications for your Township Green website.

## 🚀 Quick Start

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Connect Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the connection steps for your provider
5. **Save the Service ID** - you'll need this later

### Step 3: Create Email Templates

You need to create **2 templates**:

#### Template 1: Admin Notification
1. Go to **Email Templates** → **Create New Template**
2. Set template name: `Township Green - Admin Notification`
3. Copy the HTML from `src/config/EMAIL_TEMPLATES.md` (Admin template)
4. **Save the Template ID**

#### Template 2: Customer Confirmation  
1. Create another new template
2. Set template name: `Township Green - Customer Confirmation`
3. Copy the HTML from `src/config/EMAIL_TEMPLATES.md` (Customer template)
4. **Save the Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. **Copy this key**

### Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin_xyz
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_customer_def
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_ADMIN_EMAIL=admin@yourdomain.com
```

Replace the placeholder values with your actual EmailJS credentials.

## 📧 How It Works

When a customer books an event or contacts you:

1. **Admin Email** - You receive a notification with all booking details
2. **Customer Email** - Customer receives a confirmation with booking info

Both emails are sent automatically and simultaneously.

## 🧪 Testing Your Setup

1. Fill in your `.env` file with real credentials
2. Start your development server: `npm run dev`
3. Try booking an event through your website
4. Check both admin and customer email inboxes
5. Verify emails are formatted correctly

## 🎨 Email Templates Preview

### Admin Notification Email
- **Subject**: "New Booking Request - Township Green"
- **Contains**: Customer details, event info, special requests
- **Purpose**: Notify you of new bookings to manage

### Customer Confirmation Email  
- **Subject**: "Booking Confirmation - Township Green"
- **Contains**: Booking details, what to expect, contact info
- **Purpose**: Confirm booking and provide customer with details

## 🛠️ Customization Options

### Update Business Information
Edit these variables in your `.env`:
- `VITE_ADMIN_EMAIL` - Where admin notifications go
- Update business details in the email templates

### Modify Email Content
1. Go to EmailJS dashboard
2. Edit your templates
3. Update HTML content as needed
4. Test changes with your website

### Add More Email Types
1. Create new templates in EmailJS
2. Add template IDs to `.env`
3. Update `useEmailJS.js` hook to handle new types

## 🔒 Security Best Practices

- **Never commit your `.env` file** - it's already in `.gitignore`
- **Use environment variables** for all sensitive data
- **Regenerate keys** if accidentally exposed
- **Test thoroughly** before going live

## 📊 Monitoring & Analytics

### EmailJS Dashboard
- Track email delivery rates
- Monitor usage limits
- View email logs

### Error Handling
The app includes error handling for:
- Invalid configuration
- Network failures  
- EmailJS service issues
- Template errors

## 🚨 Troubleshooting

### Common Issues

**1. "EmailJS configuration is incomplete"**
- Check all environment variables are set
- Verify no typos in variable names
- Restart development server after changes

**2. "Failed to send email"**
- Check EmailJS service is connected
- Verify template IDs are correct
- Check EmailJS usage limits

**3. "Emails not received"**
- Check spam/junk folders
- Verify email addresses are correct
- Test with different email providers

**4. "Template not found"**
- Double-check template IDs in dashboard
- Ensure templates are published/active

### Debug Steps
1. Check browser console for errors
2. Verify EmailJS dashboard shows delivery attempts
3. Test with EmailJS's test tool
4. Check network tab for failed requests

## 📱 Production Deployment

Before deploying:
1. ✅ Test all email functionality
2. ✅ Verify production environment variables
3. ✅ Check EmailJS usage limits for your plan
4. ✅ Set up monitoring/alerts

### Hosting Platforms
Add environment variables to your hosting platform:

**Vercel:**
- Project Settings → Environment Variables

**Netlify:**  
- Site Settings → Environment Variables

**Others:**
- Consult your hosting provider's documentation

## 💡 Tips for Success

- **Start with free plan** - EmailJS offers 200 emails/month free
- **Keep templates simple** - Complex HTML may not render in all email clients
- **Test across email providers** - Gmail, Outlook, Apple Mail, etc.
- **Monitor deliverability** - Check if emails end up in spam
- **Have fallback contact** - Always provide alternative contact methods

## 📞 Support

- **EmailJS Documentation**: https://www.emailjs.com/docs/
- **EmailJS Support**: Through their dashboard
- **Project Issues**: Check the project's GitHub issues

---

Your Township Green website is now ready to handle professional email communications! 🌿✨

