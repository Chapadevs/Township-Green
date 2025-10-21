# Township Green - Booking Validation System

## 🎯 Overview

The booking validation system provides two methods for validating customer bookings at Township Green:

1. **Unique Booking IDs** - Human-readable identifiers for manual verification
2. **QR Codes** - Digital codes for quick scanning and validation

## 🔧 Implementation Details

### Unique Booking ID Format
```
TG-YYYYMMDD-HHMMSS-XXXX
```

- **TG**: Township Green prefix
- **YYYYMMDD**: Booking date (Year-Month-Day)
- **HHMMSS**: Booking time (Hour-Minute-Second)
- **XXXX**: Random 4-digit number for uniqueness

**Example**: `TG-20251020-143052-7429`

### QR Code Generation
- Uses local QRCode library (npm package) - no external dependencies
- Contains validation URL that displays booking information
- Styled with Township Green colors (#23a867 foreground, white background)
- 200x200 pixel size for optimal scanning
- Generated as base64 data URLs for email embedding
- When scanned, opens validation page showing booking details

### Validation Data Structure
```javascript
{
  bookingId: "TG-20251020-143052-7429",
  customerName: "John Doe",
  email: "john@example.com",
  phone: "(555) 123-4567",
  eventId: "art-session-001",
  guests: 2,
  timestamp: "2025-10-20T14:30:52.000Z",
  qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  validationUrl: "http://localhost:5173/validate.html?data=...",
  validationCode: "1430527429" // Time + Random for quick validation
}
```

## 📧 Email Integration

### Admin Email Template
- **Validation Section**: Displays booking ID and validation code prominently
- **QR Code Preview**: Shows the customer's QR code for reference
- **Quick Actions**: Updated with booking ID in email templates and SMS

### Customer Email Template
- **Digital Pass Section**: Highlighted validation code and status
- **QR Code Section**: Large, scannable QR code with instructions
- **Booking Details**: Full booking ID included in booking information
- **Reminders**: Clear instructions to bring email for check-in

## 🔄 Workflow

### 1. Booking Submission
```javascript
// When customer submits booking form
const bookingData = { name, email, phone, eventId, guests, specialRequests };
const validation = await generateBookingValidation(bookingData);
// Sends emails with validation data
```

### 2. Email Generation
- **Admin receives**: Booking notification with validation info and QR preview
- **Customer receives**: Confirmation with digital pass and QR code

### 3. On-Site Validation
**Option A - QR Code Scanning:**
1. Staff scans customer's QR code
2. System displays booking information
3. Verify customer identity and party size

**Option B - Manual ID Check:**
1. Customer provides booking ID (e.g., "TG 20251020 143052 7429")
2. Staff looks up booking in system
3. Verify customer details match

## 🛠️ Technical Components

### Files Modified/Created:
- `src/utils/bookingValidation.js` - Core validation utilities with local QR generation
- `src/hooks/useEmailJS.js` - Updated to handle async validation data generation
- `ADMIN_EMAIL_TEMPLATE.html` - Added validation sections
- `CUSTOMER_EMAIL_TEMPLATE.html` - Added digital pass and QR code
- `public/validate.html` - Validation page that displays booking information

### Key Functions:
- `generateBookingId()` - Creates unique booking identifiers
- `generateBookingValidation()` - Creates complete validation package (async)
- `generateQRCodeDataURL()` - Generates QR code base64 data URLs locally
- `formatValidationInfo()` - Formats data for display

### Dependencies:
- `qrcode` - Local QR code generation library

## 🔒 Security Features

### Unique Identifiers
- Timestamp-based generation prevents duplicates
- Random component adds security
- Human-readable format for staff verification

### QR Code Security
- Contains booking data embedded in QR code
- Generated locally with no external API calls
- Timestamp validation prevents replay attacks
- Visual verification through branded styling
- No data sent to third-party services

## 📱 Staff Usage Instructions

### QR Code Validation:
1. Open QR scanner app or camera
2. Scan customer's QR code from email
3. Browser opens validation page showing:
   - Customer name
   - Booking ID
   - Email address
   - Event ID
   - Number of guests
   - Booking date
4. Verify customer identity matches displayed information

### Manual ID Validation:
1. Ask customer for booking ID
2. Look up ID in booking system
3. Verify customer name, email, and party size
4. Check ID matches booking details

## 🎨 Visual Design

### QR Code Styling:
- **Background**: Township Green dark (#12211a)
- **Foreground**: Township Green primary (#23a867)
- **Size**: 200x200 pixels
- **Border**: Green border with rounded corners
- **Padding**: White background padding for contrast

### Email Styling:
- **Validation sections**: Highlighted with red gradient for urgency
- **QR codes**: Prominently displayed with clear instructions
- **Booking IDs**: Color-coded and formatted for readability

## 🚀 Future Enhancements

### Potential Additions:
- **Database Integration**: Store validation data for lookup
- **Mobile App**: Dedicated scanning app for staff
- **SMS Integration**: Send validation codes via SMS
- **Expiration Dates**: Add booking expiration for security
- **Check-in Status**: Track when customers arrive

### Analytics Opportunities:
- **Validation Success Rate**: Track QR vs manual validation
- **Check-in Times**: Monitor arrival patterns
- **No-show Tracking**: Identify unused bookings

---

## 📞 Support

For technical questions about the validation system:
- **Developer**: Contact development team
- **Staff Training**: Contact management for validation procedures
- **Customer Issues**: Direct to info@townshipgreen.com

---

*This validation system ensures secure, efficient customer check-in while maintaining Township Green's professional standards.*
