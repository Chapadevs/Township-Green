/**
 * Simple EmailJS Configuration
 * Just add your EmailJS credentials to .env file
 */

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@townshipgreen.com'
};

// Validate configuration
export const isConfigValid = () => {
  return emailConfig.serviceId && 
         emailConfig.templateId && 
         emailConfig.publicKey;
};