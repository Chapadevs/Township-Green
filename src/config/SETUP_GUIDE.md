# 🚀 EmailJS Setup Guide - Township Green

This guide will help you configure the EmailJS system for your Township Green website using our custom configuration file approach.

## 📁 Configuration Files Overview

- **`src/config/email.config.js`** - Main configuration file (you'll edit this)
- **`src/config/EMAIL_TEMPLATES.md`** - HTML email templates for EmailJS dashboard
- **`src/hooks/useEmailJS.js`** - Email sending logic (already configured)

## 🔧 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Verify your email address

### Step 2: Connect Your Email Service
1. In EmailJS dashboard → **Email Services** → **Add Service**
2. Choose your provider (Gmail, Outlook, Yahoo, etc.)
3. Follow the authentication steps
4. **Copy the Service ID** (looks like `service_abc123`)

### Step 3: Create Email Templates

You need to create **2 templates** in EmailJS:

#### Admin Notification Template
1. Go to **Email Templates** → **Create New Template**
2. Name: `Township Green - Admin Notification`
3. Copy HTML from `EMAIL_TEMPLATES.md` (Admin template section)
4. **Save and copy the Template ID**

#### Customer Confirmation Template
1. Create another template
2. Name: `Township Green - Customer Confirmation`  
3. Copy HTML from `EMAIL_TEMPLATES.md` (Customer template section)
4. **Save and copy the Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** 
3. **Copy this key**

### Step 5: Configure Your Settings

Open `src/config/email.config.js` and update these values:

```javascript
// Replace these with your actual EmailJS credentials
export const emailJSConfig = {
  serviceId: 'service_your_actual_id', // Your service ID from step 2
  
  templates: {
    adminNotification: 'template_your_admin_id', // Admin template ID from step 3
    customerConfirmation: 'template_your_customer_id', // Customer template ID from step 3
  },
  
  publicKey: 'your_actual_public_key', // Your public key from step 4
  
  // ... rest stays the same
};

// Update your business information
export const businessInfo = {
  name: 'Township Green', // Your business name
  
  contact: {
    adminEmail: 'your-email@yourdomain.com', // YOUR EMAIL ADDRESS
    customerServiceEmail: 'hello@yourdomain.com', // Customer service email
    phone: '(555) 123-4567', // YOUR PHONE NUMBER
    
    address: {
      street: '123 Your Street', // YOUR ADDRESS
      city: 'Your City',
      state: 'Your State', 
      zipCode: '12345',
      country: 'USA'
    }
  },
  
  web: {
    website: 'https://yourdomain.com', // YOUR WEBSITE
    // ... update social media if you have them
  }
};
```

## ✅ Test Your Setup

1. **Start your development server**: `npm run dev`
2. **Open your website** in browser
3. **Try booking an event** through the calendar
4. **Check both email inboxes**:
   - Your admin email should receive booking details
   - Test customer email should receive confirmation

## 🎯 Configuration Options

### Enable Test Mode (Development)
```javascript
export const devConfig = {
  testMode: true, // Set to true to simulate emails without sending
  enableLogging: true, // Enable console logs
};
```

### Update Business Hours
```javascript
export const businessInfo = {
  hours: {
    monday: '10:00 AM - 8:00 PM',
    tuesday: '10:00 AM - 8:00 PM',
    // ... update with your actual hours
  }
};
```

### Customize Email Content
```javascript
export const emailContent = {
  subjects: {
    bookingAdmin: 'New Art Session Booking - Your Business', // Customize subjects
    bookingCustomer: 'Your Art Session Confirmation - Your Business',
  },
  
  messages: {
    bookingThankYou: 'Thank you for choosing us!', // Customize messages
    responseTime: 'We will respond within 2 hours.', // Update response time
  }
};
```

## 🔍 Configuration Validation

The system automatically validates your configuration. If something is missing, you'll see helpful error messages in the browser console:

```
EmailJS configuration is incomplete: Admin email not configured, EmailJS Public Key not configured
```

## 🛠️ Troubleshooting

### "EmailJS configuration is incomplete"
- Check that all IDs in `email.config.js` are updated from placeholder values
- Verify EmailJS dashboard shows your templates as active

### "Failed to send email"
- Check EmailJS dashboard for delivery logs
- Verify your email service is properly connected
- Check if you've exceeded free tier limits (200 emails/month)

### Emails not received
- Check spam/junk folders
- Test with different email providers (Gmail, Outlook)
- Verify template IDs match exactly in EmailJS dashboard

### Template not found error
- Double-check template IDs in EmailJS dashboard
- Ensure templates are published/active, not draft

## 🚀 Going Live

Before deployment:

1. ✅ **Test thoroughly** with real email addresses
2. ✅ **Update all business information** in config file
3. ✅ **Disable test mode**: Set `testMode: false`
4. ✅ **Verify email deliverability** across different providers

## 💡 Pro Tips

- **Start with test mode enabled** to avoid sending real emails during development
- **Use your actual business email** as admin email to receive real notifications
- **Test with different email providers** (Gmail, Yahoo, Outlook) to ensure compatibility
- **Monitor EmailJS dashboard** for delivery statistics and potential issues
- **Keep templates simple** - complex HTML may not render well in all email clients

## 📊 What Happens When Someone Books

1. **Customer fills booking form** → System validates input
2. **Two emails sent simultaneously**:
   - **Admin email** (you) → Notification with all booking details
   - **Customer email** → Professional confirmation with booking info
3. **Success message** shown to customer
4. **You can manage** the booking from your email

## 🔒 Security Notes

- ✅ **EmailJS public keys are safe** to include in your code
- ✅ **No sensitive data** is exposed in the configuration
- ✅ **Email content is sanitized** before sending
- ✅ **Configuration file can be committed** to version control

## 📞 Support

- **EmailJS Documentation**: https://www.emailjs.com/docs/
- **EmailJS Dashboard**: Check delivery status and logs
- **Configuration Issues**: Check browser console for validation errors

---

Your Township Green email system is now ready to handle professional communications! 🌿✨

**Next**: Test the booking system and verify both admin and customer emails are working correctly.
