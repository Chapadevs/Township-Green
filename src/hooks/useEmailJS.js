import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailConfig, isConfigValid } from '../config/email.config.js';
import { generateBookingValidation, formatValidationInfo } from '../utils/bookingValidation.js';

const useEmailJS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (data, templateType) => {
    setIsLoading(true);
    setError(null);

    try {
      // VALIDADE CONFIG
      if (!isConfigValid()) {
        throw new Error('EmailJS configuration is incomplete. Please check your .env file.');
      }

      // Format the template parameters based on the type
      let templateParams;

      if (templateType === 'booking') {
        // GENERATE BOOKING VALIDATION DATA (now async)
        const validationData = await generateBookingValidation(data);
        const formattedValidation = formatValidationInfo(validationData);
        
        // TIMESTAMP
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        });

        templateParams = {
          to_name: 'Township Green',
          email: 'admin@topofgreen.com', // Admin notification email
          name: data.name, // Matches {{name}} in template
          from_name: data.name,
          from_email: data.email,
          phone: data.phone,
          event_id: data.eventId,
          guests: data.guests,
          special_requests: data.specialRequests || 'No special requests',
          message_type: 'Booking Request',
          timestamp: timestamp,
          // VALIDATION DATA
          booking_id: validationData.bookingId,
          booking_id_display: formattedValidation.displayId,
          booking_id_short: formattedValidation.shortId,
          validation_code: formattedValidation.validationCode,
          qr_code_url: validationData.qrCodeUrl
        };

        // Debug log to verify data structure
        console.log('Sending booking email with params:', templateParams);
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

      // SELECT THE CORRECT TEMPLATE ID BASED ON TYPE
      const templateId = templateType === 'booking' 
        ? emailConfig.adminTemplateId 
        : emailConfig.customerTemplateId || emailConfig.adminTemplateId;

      // ADMIN NOTIFICATION
      const adminResult = await emailjs.send(
        emailConfig.serviceId,
        templateId,
        templateParams,
        emailConfig.publicKey
      );

      // CUSTOMER CONFIRMATION
      if (templateType === 'booking') {
        const customerParams = {
          to_name: data.name,
          email: data.email, 
          name: data.name,
          from_name: data.name,
          from_email: data.email,
          event_id: data.eventId,
          guests: data.guests,
          special_requests: data.specialRequests || 'No special requests',
          message_type: 'Booking Confirmation',
          timestamp: templateParams.timestamp,
          // VALIDATION DATA FOR CUSTOMER
          booking_id: templateParams.booking_id,
          booking_id_display: templateParams.booking_id_display,
          booking_id_short: templateParams.booking_id_short,
          validation_code: templateParams.validation_code,
          qr_code_url: templateParams.qr_code_url
        };

        // SEND CUSTOMER CONFIRMATION
        await emailjs.send(
          emailConfig.serviceId,
          emailConfig.customerTemplateId,
          customerParams,
          emailConfig.publicKey
        );

        console.log('Both admin and customer emails sent successfully');
      }

      const result = adminResult;

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