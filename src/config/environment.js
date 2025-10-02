// Environment Configuration
// This file manages environment-specific settings

const isDevelopment = import.meta.env.MODE === 'development'
const isProduction = import.meta.env.MODE === 'production'

// Default configuration
const config = {
  // App Information
  appName: isDevelopment ? 'Township Green - Dev' : 'Township Green',
  appVersion: '1.0.0',
  
  // Environment flags
  isDevelopment,
  isProduction,
  
  // API Configuration
  apiUrl: isDevelopment 
    ? 'http://localhost:3000/api' 
    : 'https://your-domain.com/api',
  
  // EmailJS Configuration
  emailJS: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
  },
  
  // Debug Settings
  debug: {
    enabled: isDevelopment || import.meta.env.VITE_DEBUG_MODE === 'true',
    consoleLogs: isDevelopment || import.meta.env.VITE_CONSOLE_LOGS === 'true'
  },
  
  // Feature Flags
  features: {
    analytics: isProduction,
    errorReporting: isProduction,
    devTools: isDevelopment
  }
}

// Validation function
export const validateConfig = () => {
  const errors = []
  
  if (!config.emailJS.serviceId) {
    errors.push('VITE_EMAILJS_SERVICE_ID is required')
  }
  
  if (!config.emailJS.templateId) {
    errors.push('VITE_EMAILJS_TEMPLATE_ID is required')
  }
  
  if (!config.emailJS.publicKey) {
    errors.push('VITE_EMAILJS_PUBLIC_KEY is required')
  }
  
  if (errors.length > 0 && config.debug.enabled) {
    console.warn('Configuration validation errors:', errors)
  }
  
  return errors.length === 0
}

// Debug logging
if (config.debug.consoleLogs) {
  console.log('🌿 Township Green Configuration:', {
    mode: import.meta.env.MODE,
    isDevelopment,
    isProduction,
    features: config.features
  })
}

export default config
