# EmailJS Email Templates for Township Green

This document contains the HTML templates you need to create in your EmailJS dashboard.

## Setup Instructions

1. Go to [EmailJS Dashboard](https://www.emailjs.com/dashboard)
2. Create a new service (Gmail, Outlook, etc.)
3. Create two email templates using the HTML below
4. Copy the Service ID, Template IDs, and Public Key to your `.env` file

## Template 1: Admin Notification Template

**Template ID**: Use this for `VITE_EMAILJS_ADMIN_TEMPLATE_ID`

**Subject**: New {{message_type}} - Township Green

**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{message_type}} - Township Green</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header { 
            background: #23a867; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
        }
        .content { 
            background: #f9f9f9; 
            padding: 20px; 
            border: 1px solid #ddd;
        }
        .footer { 
            background: #1d554c; 
            color: white; 
            padding: 15px; 
            text-align: center; 
            border-radius: 0 0 8px 8px;
        }
        .detail-row { 
            margin: 10px 0; 
            padding: 8px; 
            background: white; 
            border-left: 4px solid #23a867;
        }
        .label { 
            font-weight: bold; 
            color: #1d554c;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌿 Township Green</h1>
        <h2>{{message_type}}</h2>
    </div>
    
    <div class="content">
        <p><strong>Hello Admin,</strong></p>
        
        <p>You have received a new {{message_type}} from your website.</p>
        
        <div class="detail-row">
            <span class="label">Customer Name:</span> {{from_name}}
        </div>
        
        <div class="detail-row">
            <span class="label">Email:</span> {{from_email}}
        </div>
        
        {{#phone}}
        <div class="detail-row">
            <span class="label">Phone:</span> {{phone}}
        </div>
        {{/phone}}
        
        {{#event_type}}
        <div class="detail-row">
            <span class="label">Event:</span> {{event_type}}
        </div>
        {{/event_type}}
        
        {{#event_date}}
        <div class="detail-row">
            <span class="label">Date:</span> {{event_date}}
        </div>
        {{/event_date}}
        
        {{#event_time}}
        <div class="detail-row">
            <span class="label">Time:</span> {{event_time}}
        </div>
        {{/event_time}}
        
        {{#guests}}
        <div class="detail-row">
            <span class="label">Number of Guests:</span> {{guests}}
        </div>
        {{/guests}}
        
        {{#special_requests}}
        <div class="detail-row">
            <span class="label">Special Requests:</span> {{special_requests}}
        </div>
        {{/special_requests}}
        
        {{#subject}}
        <div class="detail-row">
            <span class="label">Subject:</span> {{subject}}
        </div>
        {{/subject}}
        
        {{#message}}
        <div class="detail-row">
            <span class="label">Message:</span><br>
            {{message}}
        </div>
        {{/message}}
        
        <p><strong>Please respond to this customer as soon as possible.</strong></p>
    </div>
    
    <div class="footer">
        <p>Township Green Admin Panel<br>
        Sent via EmailJS from your website</p>
    </div>
</body>
</html>
```

## Template 2: Customer Confirmation Template

**Template ID**: Use this for `VITE_EMAILJS_CUSTOMER_TEMPLATE_ID`

**Subject**: {{message_type}} - Township Green

**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{message_type}} - Township Green</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header { 
            background: #23a867; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
        }
        .content { 
            background: #f9f9f9; 
            padding: 20px; 
            border: 1px solid #ddd;
        }
        .footer { 
            background: #1d554c; 
            color: white; 
            padding: 15px; 
            text-align: center; 
            border-radius: 0 0 8px 8px;
        }
        .booking-details { 
            background: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            border-left: 5px solid #23a867;
        }
        .detail-item { 
            margin: 8px 0; 
        }
        .label { 
            font-weight: bold; 
            color: #1d554c;
        }
        .highlight { 
            background: #e8f5e8; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌿 Township Green</h1>
        <h2>Thank you, {{to_name}}!</h2>
    </div>
    
    <div class="content">
        {{#notification_type}}
        {{#if notification_type === 'CUSTOMER_CONFIRMATION'}}
        
        <p>Dear {{to_name}},</p>
        
        {{#event_type}}
        <p>Thank you for your booking request! We're excited to have you join us for our {{event_type}}.</p>
        
        <div class="booking-details">
            <h3>📅 Your Booking Details</h3>
            
            <div class="detail-item">
                <span class="label">Event:</span> {{event_type}}
            </div>
            
            <div class="detail-item">
                <span class="label">Date:</span> {{event_date}}
            </div>
            
            <div class="detail-item">
                <span class="label">Time:</span> {{event_time}}
            </div>
            
            <div class="detail-item">
                <span class="label">Number of Guests:</span> {{guests}}
            </div>
            
            {{#special_requests}}
            <div class="detail-item">
                <span class="label">Special Requests:</span> {{special_requests}}
            </div>
            {{/special_requests}}
        </div>
        
        <div class="highlight">
            <p><strong>⏰ What's Next?</strong></p>
            <p>We will review your booking request and confirm your reservation within 24 hours. You'll receive a confirmation email with additional details about your session.</p>
        </div>
        
        <p><strong>📍 What to Expect:</strong></p>
        <ul>
            <li>Professional art supplies provided</li>
            <li>Comfortable, welcoming environment</li>
            <li>Guidance from experienced facilitators</li>
            <li>Safe consumption space</li>
        </ul>
        {{/event_type}}
        
        {{^event_type}}
        <p>Thank you for contacting Township Green! We've received your message and will get back to you within 24 hours.</p>
        
        <div class="highlight">
            <p><strong>Your Message:</strong></p>
            <p>{{message}}</p>
        </div>
        {{/event_type}}
        
        <p><strong>Questions?</strong> Reply to this email or contact us:</p>
        <ul>
            <li>📧 Email: {{from_email}}</li>
            <li>📱 Phone: {{business_phone}}</li>
            <li>📍 Address: {{business_address}}</li>
        </ul>
        
        {{/if}}
        {{/notification_type}}
        
        <p>We look forward to welcoming you to our community!</p>
        
        <p>Best regards,<br>
        <strong>The Township Green Team</strong></p>
    </div>
    
    <div class="footer">
        <p><strong>{{business_name}}</strong><br>
        Creating Safe Spaces for Art & Community<br>
        <small>This is an automated confirmation. Please save this email for your records.</small></p>
    </div>
</body>
</html>
```

## Environment Variables Setup

Create a `.env` file in your project root with these variables:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=your_customer_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_ADMIN_EMAIL=admin@townshipgreen.com
```

## Testing the Setup

1. Fill in your actual EmailJS credentials in the `.env` file
2. Test the booking form on your website
3. Check that both admin and customer receive emails
4. Verify email formatting and content

## Template Variables Reference

### Booking Emails
- `{{to_name}}` - Recipient name
- `{{from_name}}` - Customer name
- `{{from_email}}` - Customer email
- `{{phone}}` - Customer phone
- `{{event_type}}` - Event title
- `{{event_date}}` - Formatted date
- `{{event_time}}` - Time range
- `{{guests}}` - Number of guests
- `{{special_requests}}` - Customer requests
- `{{business_name}}` - Your business name
- `{{business_address}}` - Your address
- `{{business_phone}}` - Your phone number

### Contact Form Emails
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{message_type}}` - Type of message

## Troubleshooting

- Ensure all environment variables are set correctly
- Check EmailJS dashboard for delivery status
- Verify email service configuration
- Test with different email addresses
- Check spam folders if emails aren't received

