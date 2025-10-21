/**
 * Booking Validation Utilities
 * Generates unique booking IDs and QR codes for Township Green bookings
 */
import QRCode from 'qrcode';

/**
 * Generates a unique booking ID
 * Format: TG-YYYYMMDD-HHMMSS-XXXX
 * TG = Township Green
 * YYYYMMDD = Date
 * HHMMSS = Time
 * XXXX = Random 4-digit number
 */
export const generateBookingId = () => {
  const now = new Date();
  
  // Format date as YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Format time as HHMMSS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}${minutes}${seconds}`;
  
  // Generate random 4-digit number
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `TG-${dateStr}-${timeStr}-${randomNum}`;
};

/**
 * Generates booking validation data including QR code
 * @param {Object} bookingData - The booking information
 * @returns {Promise<Object>} Validation data with booking ID and QR code base64
 */
export const generateBookingValidation = async (bookingData) => {
  const bookingId = generateBookingId();
  
  // Create validation data object
  const validationData = {
    bookingId,
    customerName: bookingData.name,
    email: bookingData.email,
    phone: bookingData.phone,
    eventId: bookingData.eventId,
    guests: bookingData.guests,
    timestamp: new Date().toISOString(),
    specialRequests: bookingData.specialRequests || 'None'
  };
  
  // Create booking data for QR code
  const bookingQRData = {
    id: bookingId,
    name: bookingData.name,
    email: bookingData.email,
    event: bookingData.eventId,
    guests: bookingData.guests,
    date: validationData.timestamp
  };
  
  // Generate validation URL that will display booking info
  const baseUrl = window.location.origin || 'https://topofgreen.com/';
  const validationUrl = `${baseUrl}/validate.html?data=${encodeURIComponent(JSON.stringify(bookingQRData))}`;
  
  // Use the URL as QR code data
  const qrData = validationUrl;
  
  // Generate QR code as base64 data URL using local QRCode library
  const qrCodeUrl = await generateQRCodeDataURL(qrData);
  
  return {
    ...validationData,
    qrCodeUrl,
    qrData: validationUrl,
    validationUrl
  };
};

/**
 * Generates QR code as base64 data URL using local QRCode library
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} QR code base64 data URL
 */
export const generateQRCodeDataURL = async (data) => {
  try {
    // QR code options with Township Green styling
    const options = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#23a867',  // Township Green primary color
        light: '#ffffff'  // White background for better contrast
      },
      width: 200
    };
    
    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(data, options);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Fallback: return a placeholder or throw error
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Formats booking validation info for display
 * @param {Object} validation - Validation data object
 * @returns {Object} Formatted validation info
 */
export const formatValidationInfo = (validation) => {
  return {
    bookingId: validation.bookingId,
    displayId: validation.bookingId.replace('TG-', 'TG '),
    shortId: validation.bookingId.split('-').pop(), // Last 4 digits
    qrCodeUrl: validation.qrCodeUrl,
    validationCode: validation.bookingId.split('-')[2] + validation.bookingId.split('-')[3] // Time + Random for quick validation
  };
};

/**
 * Validates a booking ID format
 * @param {string} bookingId - Booking ID to validate
 * @returns {boolean} True if valid format
 */
export const isValidBookingId = (bookingId) => {
  const pattern = /^TG-\d{8}-\d{6}-\d{4}$/;
  return pattern.test(bookingId);
};

/**
 * Extracts booking date from booking ID
 * @param {string} bookingId - Valid booking ID
 * @returns {Date|null} Booking date or null if invalid
 */
export const getBookingDateFromId = (bookingId) => {
  if (!isValidBookingId(bookingId)) return null;
  
  const datePart = bookingId.split('-')[1]; // YYYYMMDD
  const year = parseInt(datePart.substring(0, 4));
  const month = parseInt(datePart.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(datePart.substring(6, 8));
  
  return new Date(year, month, day);
};
