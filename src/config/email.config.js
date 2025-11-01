export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // Fallback for backward compatibility
  customerTemplateId: import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@townshipgreen.com'
};

// Validate configuration with detailed logging
export const isConfigValid = () => {
  const config = {
    serviceId: emailConfig.serviceId,
    customerTemplateId: emailConfig.customerTemplateId,
    publicKey: emailConfig.publicKey
  };
  
  // Debug logging to help identify missing values
  console.log('EmailJS Configuration Check:', {
    serviceId: config.serviceId ? '✓ Set' : '✗ Missing',
    customerTemplateId: config.customerTemplateId ? '✓ Set' : '✗ Missing',
    publicKey: config.publicKey ? '✓ Set' : '✗ Missing'
  });
  
  // Show actual values for debugging (first 10 chars only for security)
  console.log('Actual Values (partial):', {
    serviceId: config.serviceId ? config.serviceId.substring(0, 10) + '...' : 'undefined',
    customerTemplateId: config.customerTemplateId ? config.customerTemplateId.substring(0, 10) + '...' : 'undefined',
    publicKey: config.publicKey ? config.publicKey.substring(0, 10) + '...' : 'undefined'
  });
  
  const isValid = config.serviceId && config.customerTemplateId && config.publicKey;
  
  if (!isValid) {
    console.error('Missing EmailJS environment variables. Please check your .env file contains:');
    console.error('VITE_EMAILJS_SERVICE_ID=your_service_id');
    console.error('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=your_customer_template_id');
    console.error('VITE_EMAILJS_PUBLIC_KEY=your_public_key');
  }
  
  return isValid;
};