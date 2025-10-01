/**
 * EmailJS Configuration for Township Green
 * 
 * This file contains the EmailJS configuration for sending automated emails
 * when customers book events or submit contact forms.
 * 
 * 🔧 Setup Instructions:
 * 1. Create an account at https://www.emailjs.com/
 * 2. Set up your email service (Gmail, Outlook, etc.)
 * 3. Create two email templates using the templates in EMAIL_TEMPLATES.md
 * 4. Replace the placeholder values below with your actual EmailJS credentials
 * 5. Update the business information in the businessInfo section
 * 
 * 🚨 Security Note:
 * This file can be safely committed to version control as it uses public keys.
 * EmailJS public keys are designed to be exposed in client-side applications.
 */

// EmailJS Service Configuration
export const emailJSConfig = {
  // Your EmailJS Service ID (from EmailJS dashboard)
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_township_green',
  
  // Email Template IDs
  templates: {
    // Admin notification template - sends booking details to business owner
    adminNotification: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || 'template_admin_notification',
    
    // Customer confirmation template - sends booking confirmation to customer
    customerConfirmation: import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID || 'template_customer_confirmation',
  },
  
  // Your EmailJS Public Key (safe to expose in client-side code)
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY_HERE',
  
  // Email delivery options
  options: {
    // Timeout for email sending (in milliseconds)
    timeout: 10000,
    
    // Maximum retry attempts on failure
    maxRetries: 3,
    
    // Enable/disable email notifications
    enableNotifications: true,
  }
};

// Business Information Configuration
export const businessInfo = {
  // Business Details
  name: 'Township Green',
  tagline: 'Creating Safe Spaces for Art & Community',
  
  // Contact Information
  contact: {
    // Primary admin email where notifications will be sent
    adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@townshipgreen.com',
    
    // Customer service email for replies
    customerServiceEmail: import.meta.env.VITE_CUSTOMER_SERVICE_EMAIL || 'hello@townshipgreen.com',
    
    // Business phone number
    phone: import.meta.env.VITE_BUSINESS_PHONE || '(555) 123-4567',
    
    // Business address
    address: {
      street: import.meta.env.VITE_BUSINESS_STREET || '123 Community Street',
      city: import.meta.env.VITE_BUSINESS_CITY || 'Your City',
      state: import.meta.env.VITE_BUSINESS_STATE || 'Your State',
      zipCode: import.meta.env.VITE_BUSINESS_ZIP || '12345',
      country: import.meta.env.VITE_BUSINESS_COUNTRY || 'USA'
    }
  },
  
  // Website and Social Media
  web: {
    website: 'https://townshipgreen.com',
    social: {
      instagram: '@townshipgreen',
      facebook: 'Township Green Community',
      twitter: '@townshipgreen'
    }
  },
  
  // Business Hours
  hours: {
    monday: '10:00 AM - 8:00 PM',
    tuesday: '10:00 AM - 8:00 PM',
    wednesday: '10:00 AM - 8:00 PM',
    thursday: '10:00 AM - 8:00 PM',
    friday: '10:00 AM - 10:00 PM',
    saturday: '12:00 PM - 10:00 PM',
    sunday: 'Closed'
  }
};

// Email Content Templates
export const emailContent = {
  // Subject lines for different email types
  subjects: {
    bookingAdmin: 'New Art Session Booking - Township Green',
    bookingCustomer: 'Your Art Session Booking Confirmation - Township Green',
    contactAdmin: 'New Contact Form Submission - Township Green',
    contactCustomer: 'Thank you for contacting Township Green'
  },
  
  // Email signatures
  signatures: {
    admin: `
Best regards,
The Township Green Team
${businessInfo.contact.customerServiceEmail}
${businessInfo.contact.phone}
    `,
    customer: `
Best regards,
The Township Green Team

🌿 ${businessInfo.tagline}
📧 ${businessInfo.contact.customerServiceEmail}
📱 ${businessInfo.contact.phone}
🌐 ${businessInfo.web.website}
    `
  },
  
  // Standard messages
  messages: {
    bookingThankYou: 'Thank you for choosing Township Green for your art session experience!',
    contactThankYou: 'Thank you for contacting Township Green. We appreciate your interest!',
    responseTime: 'We will get back to you within 24 hours.',
    cancellationPolicy: 'Please note our 24-hour cancellation policy for all bookings.'
  }
};

// Validation Configuration
export const validation = {
  // Required fields for booking forms
  requiredBookingFields: ['name', 'email', 'phone'],
  
  // Required fields for contact forms
  requiredContactFields: ['name', 'email', 'message'],
  
  // Email validation regex
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone validation regex (flexible format)
  phoneRegex: /^[\+]?[1-9][\d]{0,15}$/,
  
  // Maximum lengths for form fields
  maxLengths: {
    name: 100,
    subject: 200,
    message: 1000,
    specialRequests: 500
  }
};

// Development Configuration
export const devConfig = {
  // Enable console logging in development
  enableLogging: import.meta.env.VITE_ENABLE_EMAIL_LOGGING === 'true' || import.meta.env.DEV,
  
  // Test mode - doesn't actually send emails (useful for development)
  testMode: import.meta.env.VITE_ENABLE_TEST_MODE === 'true',
  
  // Mock responses for testing
  mockResponses: {
    success: { status: 200, text: 'Email sent successfully' },
    error: { status: 400, text: 'Failed to send email' }
  }
};

// Utility function to validate configuration
export const validateConfig = () => {
  const errors = [];
  
  if (!emailJSConfig.serviceId || emailJSConfig.serviceId === 'service_township_green') {
    errors.push('EmailJS Service ID not configured');
  }
  
  if (!emailJSConfig.templates.adminNotification || emailJSConfig.templates.adminNotification === 'template_admin_notification') {
    errors.push('Admin notification template ID not configured');
  }
  
  if (!emailJSConfig.templates.customerConfirmation || emailJSConfig.templates.customerConfirmation === 'template_customer_confirmation') {
    errors.push('Customer confirmation template ID not configured');
  }
  
  if (!emailJSConfig.publicKey || emailJSConfig.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY_HERE') {
    errors.push('EmailJS Public Key not configured');
  }
  
  if (!businessInfo.contact.adminEmail || businessInfo.contact.adminEmail === 'admin@townshipgreen.com') {
    errors.push('Admin email not configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to get formatted business address
export const getFormattedAddress = () => {
  const { address } = businessInfo.contact;
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
};

// Helper function to get business hours for a specific day
export const getBusinessHours = (day) => {
  const dayLower = day.toLowerCase();
  return businessInfo.hours[dayLower] || 'Hours not available';
};

// Export default configuration object
export default {
  emailJS: emailJSConfig,
  business: businessInfo,
  content: emailContent,
  validation,
  dev: devConfig,
  validateConfig,
  getFormattedAddress,
  getBusinessHours
};
