# EmailJS Templates for Township Green

## Admin Notification Template

Copy this HTML into your EmailJS admin template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Request - Township Green</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #12211a;
            color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #12211a;
            padding: 0;
        }
        .header {
            background: linear-gradient(135deg, #23a867 0%, #1d554c 100%);
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 900;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .tagline {
            font-size: 14px;
            color: #ffffff;
            opacity: 0.9;
            margin: 0;
        }
        .content {
            padding: 30px 20px;
            background-color: #1d2d25;
            margin: 20px;
            border-radius: 12px;
        }
        .alert-badge {
            background-color: #23a867;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .booking-title {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 20px;
            border-bottom: 2px solid #23a867;
            padding-bottom: 10px;
        }
        .info-section {
            margin-bottom: 25px;
        }
        .info-label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 16px;
            color: #ffffff;
            font-weight: 500;
            margin-bottom: 15px;
            padding: 8px 0;
        }
        .highlight {
            color: #23a867;
            font-weight: 700;
        }
        .special-requests {
            background-color: #12211a;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #23a867;
            margin-top: 10px;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #23a867;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
            margin: 0 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background-color: #1d8c56;
        }
        .footer {
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #374151;
            margin-top: 20px;
        }
        .urgent {
            background-color: #dc2626;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        @media only screen and (max-width: 600px) {
            .content {
                margin: 10px;
                padding: 20px 15px;
            }
            .booking-title {
                font-size: 20px;
            }
            .btn {
                display: block;
                margin: 10px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">TOWNSHIP GREEN</div>
            <p class="tagline">Cannabis Consumption Lounge</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="alert-badge">🔔 New Booking Request</div>
            
            <h1 class="booking-title">Session Booking Details</h1>

            <!-- Customer Information -->
            <div class="info-section">
                <div class="info-label">Customer Name</div>
                <div class="info-value highlight">{{from_name}}</div>
                
                <div class="info-label">Email Address</div>
                <div class="info-value">{{from_email}}</div>
                
                <div class="info-label">Phone Number</div>
                <div class="info-value">{{phone}}</div>
            </div>

            <!-- Booking Information -->
            <div class="info-section">
                <div class="info-label">Event/Session ID</div>
                <div class="info-value highlight">{{event_id}}</div>
                
                <div class="info-label">Number of Guests</div>
                <div class="info-value">{{guests}} guest(s)</div>
                
                <div class="info-label">Booking Date & Time</div>
                <div class="info-value">{{booking_date}} at {{booking_time}}</div>
            </div>

            <!-- Special Requests -->
            <div class="info-section">
                <div class="info-label">Special Requests</div>
                <div class="special-requests">
                    <div class="info-value">{{special_requests}}</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <a href="mailto:{{from_email}}?subject=Booking Confirmation - Township Green" class="btn">
                    📧 Reply to Customer
                </a>
                <a href="tel:{{phone}}" class="btn">
                    📞 Call Customer
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is an automated notification from your Township Green booking system.</p>
            <p>Please respond to the customer within 24 hours to confirm their booking.</p>
            <p style="margin-top: 15px; color: #23a867; font-weight: 600;">
                🌿 Township Green - Building Community Through Art & Cannabis
            </p>
        </div>
    </div>
</body>
</html>
```

## Customer Confirmation Template

Copy this HTML into your EmailJS customer template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - Township Green</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #12211a;
            color: #ffffff;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #12211a;
            padding: 0;
        }
        .header {
            background: linear-gradient(135deg, #23a867 0%, #1d554c 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .tagline {
            font-size: 16px;
            color: #ffffff;
            opacity: 0.9;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
            background-color: #1d2d25;
            margin: 20px;
            border-radius: 12px;
        }
        .success-badge {
            background-color: #059669;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-bottom: 25px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 15px;
        }
        .intro-text {
            font-size: 16px;
            color: #9ca3af;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .booking-details {
            background-color: #12211a;
            padding: 25px;
            border-radius: 12px;
            border: 2px solid #23a867;
            margin: 25px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #374151;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-size: 14px;
            color: #9ca3af;
            font-weight: 600;
        }
        .detail-value {
            font-size: 16px;
            color: #ffffff;
            font-weight: 700;
        }
        .highlight {
            color: #23a867;
        }
        .what-to-expect {
            background-color: #12211a;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #23a867;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #23a867;
            margin-bottom: 15px;
        }
        .expectation-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .expectation-item {
            padding: 8px 0;
            color: #d1d5db;
            position: relative;
            padding-left: 25px;
        }
        .expectation-item:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #23a867;
            font-weight: bold;
        }
        .contact-info {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #12211a;
            border-radius: 8px;
        }
        .contact-title {
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 10px;
        }
        .contact-details {
            color: #9ca3af;
            font-size: 14px;
        }
        .footer {
            padding: 30px 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #374151;
            margin-top: 20px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #23a867;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 600;
        }
        @media only screen and (max-width: 600px) {
            .content {
                margin: 10px;
                padding: 25px 20px;
            }
            .detail-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }
            .greeting {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">TOWNSHIP GREEN</div>
            <p class="tagline">Cannabis Consumption Lounge</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="success-badge">✨ Booking Confirmed</div>
            
            <h1 class="greeting">Thank you, {{from_name}}!</h1>
            <p class="intro-text">
                We're excited to welcome you to Township Green. Your booking request has been received and we'll confirm your session details within 24 hours.
            </p>

            <!-- Booking Details Card -->
            <div class="booking-details">
                <div class="detail-row">
                    <span class="detail-label">Session Date</span>
                    <span class="detail-value highlight">{{booking_date}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">{{booking_time}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Number of Guests</span>
                    <span class="detail-value">{{guests}} guest(s)</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Reference</span>
                    <span class="detail-value">#{{event_id}}</span>
                </div>
            </div>

            <!-- What to Expect -->
            <div class="what-to-expect">
                <h3 class="section-title">What to Expect</h3>
                <ul class="expectation-list">
                    <li class="expectation-item">Arrive 15 minutes early for check-in</li>
                    <li class="expectation-item">Bring valid ID (21+ required)</li>
                    <li class="expectation-item">Enjoy our welcoming, safe environment</li>
                    <li class="expectation-item">Participate in community art sessions</li>
                    <li class="expectation-item">Connect with like-minded individuals</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div class="contact-info">
                <h3 class="contact-title">Questions or Need to Reschedule?</h3>
                <div class="contact-details">
                    <p>Email: info@townshipgreen.com</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>We're here to help make your experience perfect!</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>🌿 Thank you for choosing Township Green</p>
            <div class="social-links">
                <a href="#">Instagram</a> |
                <a href="#">Facebook</a> |
                <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 15px;">
                This email was sent because you requested a booking at Township Green.<br>
                If you didn't make this request, please contact us immediately.
            </p>
        </div>
    </div>
</body>
</body>
</html>
```

## Template Variables Reference

### For Admin Template:
- `{{from_name}}` - Customer's name
- `{{from_email}}` - Customer's email
- `{{phone}}` - Customer's phone number
- `{{event_id}}` - Session/Event ID
- `{{guests}}` - Number of guests
- `{{special_requests}}` - Any special requests
- `{{booking_date}}` - Session date
- `{{booking_time}}` - Session time

### For Customer Template:
- `{{from_name}}` - Customer's name
- `{{event_id}}` - Booking reference number
- `{{guests}}` - Number of guests
- `{{booking_date}}` - Session date
- `{{booking_time}}` - Session time

## Setup Instructions:

1. **Admin Template**: Copy the first HTML template into EmailJS as "Township Green - Admin Notification"
2. **Customer Template**: Copy the second HTML template into EmailJS as "Township Green - Customer Confirmation"
3. **Update your useEmailJS.js** to include booking date/time in the template parameters
4. **Test both templates** to ensure proper formatting

The templates follow your design system with:
- ✅ Dark theme (#12211a, #1d2d25)
- ✅ Primary green (#23a867) accents
- ✅ Professional typography
- ✅ Responsive design
- ✅ Township Green branding
- ✅ Professional, welcoming tone
