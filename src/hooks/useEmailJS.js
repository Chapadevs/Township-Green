import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig, isConfigValid } from '../config/email.config.js';

const useEmailJS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (data, templateType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate configuration
      if (!isConfigValid()) {
        throw new Error('EmailJS configuration is incomplete. Please check your .env file.');
      }

      // Format the template parameters based on the type
      let templateParams;

      if (templateType === 'booking') {
        templateParams = {
          to_name: 'Township Green',
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          event_id: data.eventId,
          guests: data.guests,
          special_requests: data.specialRequests || 'None',
          message_type: 'Booking Request'
        };
      } else {
        templateParams = {
          to_name: 'Township Green',
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
          message_type: 'General Inquiry'
        };
      }

      // Send the email using EmailJS
      const result = await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        templateParams,
        emailConfig.publicKey
      );

      if (result.status !== 200) {
        throw new Error('Failed to send email');
      }

      console.log('Email sent successfully:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      console.error('EmailJS error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
    error
  };
};

export default useEmailJS;