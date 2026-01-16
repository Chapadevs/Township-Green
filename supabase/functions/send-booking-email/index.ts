// Supabase Edge Function for sending booking confirmation emails
// This runs on Supabase's servers - no additional hosting needed

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingEmailData {
  customerName: string
  customerEmail: string
  customerPhone?: string
  eventTitle: string
  eventId: string
  sessionDate: string
  sessionTime: string
  numberOfGuests: number
  confirmationCode: string
  specialRequests?: string
}

// Generate unique booking ID
const generateBookingId = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `TG-${year}${month}${day}-${hours}${minutes}${seconds}-${randomNum}`
}

// Generate QR code as data URL using qrcode npm module
const generateQRCode = async (data: string): Promise<string> => {
  try {
    // Use esm.sh CDN to load qrcode library for Deno
    const QRCode = await import('https://esm.sh/qrcode@1.5.4')
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#23a867',
        light: '#ffffff'
      },
      width: 200
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('QR Code generation error:', error)
    return '' // Return empty string as fallback
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingData } = await req.json() as { bookingData: BookingEmailData }

    // Validate required fields
    if (!bookingData.customerEmail || !bookingData.customerName) {
      throw new Error('Missing required booking data')
    }

    // Generate validation data
    const bookingId = generateBookingId()
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    // Generate QR code with booking data
    const qrData = JSON.stringify({
      id: bookingId,
      name: bookingData.customerName,
      email: bookingData.customerEmail,
      event: bookingData.eventId,
      guests: bookingData.numberOfGuests,
      date: bookingData.sessionDate
    })
    const qrCodeUrl = await generateQRCode(qrData)

    // Format validation data
    const bookingIdDisplay = bookingId.replace('TG-', 'TG ')
    const validationCode = bookingId.split('-')[2] + bookingId.split('-')[3]

    // Admin email template (full HTML from ADMIN_EMAIL_TEMPLATE.html)
    const adminEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Request - Top of the Green</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #12211a; color: #ffffff; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #12211a; padding: 0; }
        .header { background: linear-gradient(135deg, #23a867 0%, #1d554c 100%); padding: 30px 20px; text-align: center; border-radius: 0 0 12px 12px; }
        .logo { font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
        .tagline { font-size: 14px; color: #ffffff; opacity: 0.9; margin: 0; font-weight: 500; }
        .content { padding: 30px 20px; background-color: #1d2d25; margin: 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
        .alert-badge { background: linear-gradient(135deg, #23a867, #1d8c56); color: #ffffff; padding: 10px 18px; border-radius: 25px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; display: inline-block; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(35, 168, 103, 0.3); }
        .booking-title { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 25px; border-bottom: 3px solid #23a867; padding-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
        .info-card { background-color: #12211a; padding: 18px; border-radius: 10px; border-left: 4px solid #23a867; transition: transform 0.2s ease; }
        .info-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
        .info-value { font-size: 16px; color: #ffffff; font-weight: 600; word-break: break-word; }
        .highlight { color: #23a867; font-weight: 700; }
        .priority-info { background: linear-gradient(135deg, #23a867, #1d554c); padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center; }
        .priority-title { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .priority-details { font-size: 16px; color: #ffffff; font-weight: 600; }
        .special-requests { background-color: #12211a; padding: 20px; border-radius: 10px; border: 2px solid #23a867; margin: 25px 0; }
        .special-requests-title { font-size: 14px; color: #23a867; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .special-requests-content { font-size: 15px; color: #ffffff; line-height: 1.5; font-style: italic; }
        .action-section { background-color: #12211a; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .action-title { font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .timestamp { background-color: #12211a; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #374151; }
        .timestamp-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 5px; }
        .timestamp-value { font-size: 14px; color: #ffffff; font-weight: 600; }
        .footer { padding: 25px 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 2px solid #374151; margin-top: 30px; }
        @media only screen and (max-width: 600px) {
            .content { margin: 10px; padding: 20px 15px; }
            .info-grid { grid-template-columns: 1fr; gap: 15px; }
            .booking-title { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Top of the Green</div>
            <p class="tagline">Art Space & Lounge</p>
        </div>
        <div class="content">
            <div class="alert-badge">New Booking Alert</div>
            <h1 class="booking-title">Session Booking Request</h1>
            <div class="priority-info">
                <div class="priority-title">Immediate Action Required</div>
                <div class="priority-details">New booking from <strong>${bookingData.customerName}</strong> • ${bookingData.numberOfGuests} guest(s) • Event: ${bookingData.eventTitle}</div>
            </div>
            <div class="info-grid">
                <div class="info-card"><div class="info-label">Customer Name</div><div class="info-value highlight">${bookingData.customerName}</div></div>
                <div class="info-card"><div class="info-label">Email Address</div><div class="info-value">${bookingData.customerEmail}</div></div>
                <div class="info-card"><div class="info-label">Phone Number</div><div class="info-value">${bookingData.customerPhone || 'Not provided'}</div></div>
                <div class="info-card"><div class="info-label">Number of Guests</div><div class="info-value highlight">${bookingData.numberOfGuests} guest(s)</div></div>
            </div>
            <div class="info-grid">
                <div class="info-card"><div class="info-label">Event/Session</div><div class="info-value highlight">${bookingData.eventTitle}</div></div>
                <div class="info-card"><div class="info-label">Date & Time</div><div class="info-value">${bookingData.sessionDate} at ${bookingData.sessionTime}</div></div>
            </div>
            <div class="priority-info" style="background: linear-gradient(135deg, #dc2626, #b91c1c); margin: 30px 0;">
                <div class="priority-title">BOOKING VALIDATION INFO</div>
                <div class="priority-details"><strong>Booking ID:</strong> ${bookingIdDisplay}<br><strong>Validation Code:</strong> ${validationCode}<br><strong>Status:</strong> PENDING CONFIRMATION</div>
            </div>
            <div class="info-grid">
                <div class="info-card"><div class="info-label">Full Booking ID</div><div class="info-value highlight">${bookingId}</div></div>
                <div class="info-card"><div class="info-label">Quick Validation</div><div class="info-value">${validationCode}</div></div>
            </div>
            <div class="special-requests">
                <div class="special-requests-title">Special Requests & Notes</div>
                <div class="special-requests-content">"${bookingData.specialRequests || 'No special requests'}"</div>
            </div>
            <div class="timestamp">
                <div class="timestamp-label">Request Received</div>
                <div class="timestamp-value">${timestamp}</div>
            </div>
            ${qrCodeUrl ? `<div class="action-section" style="background: linear-gradient(135deg, #1d554c, #155249);">
                <div class="action-title">Customer QR Code Validation</div>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${qrCodeUrl}" alt="Booking QR Code" style="max-width: 200px; border: 3px solid #23a867; border-radius: 12px; background: white; padding: 10px;">
                    <p style="color: #ffffff; margin-top: 15px; font-size: 14px;"><strong>Customer will receive this QR code for validation</strong><br>Scan on arrival to verify booking: <span style="color: #23a867;">${bookingIdDisplay}</span></p>
                </div>
            </div>` : ''}
        </div>
        <div class="footer">
            <p><strong>⚠️ Response Required:</strong> Please respond to this booking request within 24 hours.</p>
            <p>This automated notification was generated by your Top of the Green booking system.</p>
        </div>
    </div>
</body>
</html>`

    // Customer email template (full HTML from CUSTOMER_EMAIL_TEMPLATE.html)
    const customerEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - Top of the Green</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #12211a; color: #ffffff; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background-color: #12211a; padding: 0; }
        .header { background: linear-gradient(135deg, #23a867 0%, #1d554c 100%); padding: 40px 20px; text-align: center; border-radius: 0 0 12px 12px; }
        .logo { font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
        .tagline { font-size: 16px; color: #ffffff; opacity: 0.9; margin: 0; font-weight: 500; }
        .content { padding: 40px 30px; background-color: #1d2d25; margin: 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); }
        .success-badge { background: linear-gradient(135deg, #059669, #047857); color: #ffffff; padding: 12px 20px; border-radius: 25px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; display: inline-block; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); }
        .greeting { font-size: 28px; font-weight: 700; color: #ffffff; margin-bottom: 15px; text-align: center; }
        .greeting-highlight { color: #23a867; }
        .intro-text { font-size: 16px; color: #9ca3af; line-height: 1.7; margin-bottom: 30px; text-align: center; }
        .booking-summary { background: linear-gradient(135deg, #23a867, #1d554c); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; }
        .summary-title { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-details { font-size: 16px; color: #ffffff; font-weight: 600; line-height: 1.5; }
        .booking-details { background-color: #12211a; padding: 25px; border-radius: 12px; border: 2px solid #23a867; margin: 25px 0; }
        .details-title { font-size: 18px; font-weight: 700; color: #23a867; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
        .detail-row { display: flex; justify-content: flex-start; align-items: center; padding: 12px 0; border-bottom: 1px solid #374151; gap: 20px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-size: 14px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; min-width: 100px; }
        .detail-value { font-size: 16px; color: #ffffff; font-weight: 700; }
        .highlight { color: #23a867; }
        .what-to-expect { background-color: #12211a; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #23a867; }
        .section-title { font-size: 18px; font-weight: 700; color: #23a867; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .expectation-list { list-style: none; padding: 0; margin: 0; }
        .expectation-item { padding: 10px 0; color: #d1d5db; position: relative; padding-left: 30px; font-size: 15px; line-height: 1.5; }
        .expectation-item:before { content: "✓"; position: absolute; left: 0; color: #23a867; font-weight: bold; font-size: 18px; }
        .next-steps { background: linear-gradient(135deg, #1d554c, #155249); padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; }
        .next-steps-title { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .next-steps-text { font-size: 15px; color: #ffffff; line-height: 1.6; margin-bottom: 20px; }
        .special-requests-section { background-color: #12211a; padding: 20px; border-radius: 10px; border: 2px solid #23a867; margin: 25px 0; }
        .special-requests-title { font-size: 16px; color: #23a867; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; text-align: center; }
        .special-requests-content { font-size: 15px; color: #ffffff; line-height: 1.5; font-style: italic; text-align: center; padding: 10px; background-color: #1d2d25; border-radius: 8px; }
        .contact-info { background-color: #12211a; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #374151; }
        .contact-title { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .contact-details { color: #9ca3af; font-size: 15px; line-height: 1.6; }
        .contact-highlight { color: #23a867; font-weight: 600; }
        .disclaimer { background-color: #1d2d25; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #9ca3af; }
        .disclaimer-text { font-size: 12px; color: #9ca3af; line-height: 1.4; }
        .footer { padding: 30px 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 2px solid #374151; margin-top: 30px; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #23a867; text-decoration: none; margin: 0 15px; font-weight: 600; font-size: 14px; }
        @media only screen and (max-width: 600px) {
            .content { margin: 10px; padding: 25px 20px; }
            .detail-row { flex-direction: column; align-items: flex-start; gap: 5px; padding: 15px 0; }
            .greeting { font-size: 24px; }
            .logo { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Top of the Green</div>
            <p class="tagline">Art Space & Lounge</p>
        </div>
        <div class="content">
            <div class="success-badge">Booking Request Received</div>
            <h1 class="greeting">Thank you, <span class="greeting-highlight">${bookingData.customerName}</span>!</h1>
            <p class="intro-text">Your booking request has been successfully received and our team will be aware of your presence!</p>
            <div class="booking-summary">
                <div class="summary-title">🎯 Your Booking Summary</div>
                <div class="summary-details"><strong>Booking ID:</strong> ${bookingIdDisplay}<br><strong>Event:</strong> ${bookingData.eventTitle}<br><strong>Party Size:</strong> ${bookingData.numberOfGuests} guest(s)</div>
            </div>
            <div class="booking-summary" style="background: linear-gradient(135deg, #dc2626, #b91c1c); margin: 30px 0;">
                <div class="summary-title">🎫 YOUR DIGITAL PASS</div>
                <div class="summary-details"><strong>Validation Code:</strong> ${validationCode}<br><em>Present this email at check-in</em></div>
            </div>
            <div class="booking-details">
                <div class="details-title">📋 Booking Information</div>
                <div class="detail-row"><span class="detail-label">👤 Name</span><span class="detail-value highlight">${bookingData.customerName}</span></div>
                <div class="detail-row"><span class="detail-label">📧 Email</span><span class="detail-value">${bookingData.customerEmail}</span></div>
                <div class="detail-row"><span class="detail-label">📱 Phone</span><span class="detail-value">${bookingData.customerPhone || 'Not provided'}</span></div>
                <div class="detail-row"><span class="detail-label">👥 Guests</span><span class="detail-value highlight">${bookingData.numberOfGuests} guest(s)</span></div>
                <div class="detail-row"><span class="detail-label">📅 Date</span><span class="detail-value">${bookingData.sessionDate}</span></div>
                <div class="detail-row"><span class="detail-label">🕐 Time</span><span class="detail-value">${bookingData.sessionTime}</span></div>
                <div class="detail-row"><span class="detail-label">🆔 Booking ID</span><span class="detail-value highlight">${bookingId}</span></div>
            </div>
            ${qrCodeUrl ? `<div class="next-steps" style="background: linear-gradient(135deg, #1d554c, #155249);">
                <div class="next-steps-title">📱 Your QR Code Pass</div>
                <div style="text-align: center; margin: 25px 0;">
                    <img src="${qrCodeUrl}" alt="Your Booking QR Code" style="max-width: 200px; border: 3px solid #23a867; border-radius: 12px; background: white; padding: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <p style="color: #ffffff; margin-top: 20px; font-size: 16px; line-height: 1.6;"><strong>🔐 Save this QR code!</strong><br>Present this code at check-in for quick validation.<br><span style="color: #23a867; font-weight: 700;">Booking ID: ${bookingIdDisplay}</span></p>
                </div>
            </div>` : ''}
            <div class="special-requests-section">
                <div class="special-requests-title">💬 Your Special Requests</div>
                <div class="special-requests-content">"${bookingData.specialRequests || 'No special requests'}"</div>
            </div>
            <div class="next-steps">
                <div class="next-steps-title">🚀 What Happens Next?</div>
                <p class="next-steps-text">Our team will review your booking request and contact you within <strong>24 hours</strong> to confirm your session details.</p>
            </div>
            <div class="what-to-expect">
                <h3 class="section-title">What to Expect at our space?</h3>
                <ul class="expectation-list">
                    <li class="expectation-item">A warm, welcoming community atmosphere</li>
                    <li class="expectation-item">Safe, clean, and comfortable environment</li>
                    <li class="expectation-item">Engaging art sessions and creative activities</li>
                    <li class="expectation-item">Knowledgeable and friendly staff</li>
                    <li class="expectation-item">Premium cannabis consumption experience</li>
                    <li class="expectation-item">Connection with like-minded individuals</li>
                </ul>
            </div>
            <div class="contact-info">
                <h3 class="contact-title">Questions or Need to Make Changes?</h3>
                <div class="contact-details">
                    <p><strong>Email:</strong> <span class="contact-highlight">admin@topofgreen.com</span></p>
                    <p><strong>Phone:</strong> <span class="contact-highlight">(+1) 856-544-3065</span></p>
                    <p><strong>Hours:</strong> Monday - Sunday, 10 AM - 10 PM</p>
                </div>
            </div>
            <div class="disclaimer">
                <div class="disclaimer-text"><strong>Important Reminders:</strong><br>• Must be 21+ with valid ID<br>• Please arrive 15 minutes early for check-in<br>• Consumption is limited to designated areas only<br>• We maintain a safe, respectful environment for all guests</div>
            </div>
        </div>
        <div class="footer">
            <p>🌿 <strong>Thank you for choosing Top of Green!</strong></p>
            <div class="social-links">
                <a href="#">📱 Instagram</a>
                <a href="#">📘 Facebook</a>
                <a href="#">🌐 Website</a>
            </div>
            <p style="margin-top: 20px; font-size: 11px;">This email was sent because you submitted a booking request.<br>If you didn't make this request, please contact us immediately.</p>
        </div>
    </div>
</body>
</html>`

    // Send emails using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@topofgreen.com'
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Booking created but email not configured' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const results = {
      customer: null as any,
      admin: null as any,
      errors: [] as string[]
    }

    // Send customer email
    try {
      const customerRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Top of the Green <onboarding@resend.dev>',
          to: [bookingData.customerEmail],
          subject: `Booking Confirmation - ${bookingData.eventTitle}`,
          html: customerEmailHtml,
        }),
      })

      if (customerRes.ok) {
        results.customer = await customerRes.json()
        console.log('Customer email sent successfully:', results.customer.id)
      } else {
        const error = await customerRes.text()
        console.error('Customer email error:', error)
        results.errors.push(`Customer email failed: ${error}`)
      }
    } catch (error) {
      console.error('Customer email exception:', error)
      results.errors.push(`Customer email exception: ${error.message}`)
    }

    // Send admin notification email
    try {
      const adminRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Top of the Green <onboarding@resend.dev>',
          to: [ADMIN_EMAIL],
          subject: `New Booking Request - ${bookingData.eventTitle}`,
          html: adminEmailHtml,
        }),
      })

      if (adminRes.ok) {
        results.admin = await adminRes.json()
        console.log('Admin email sent successfully:', results.admin.id)
      } else {
        const error = await adminRes.text()
        console.error('Admin email error:', error)
        results.errors.push(`Admin email failed: ${error}`)
      }
    } catch (error) {
      console.error('Admin email exception:', error)
      results.errors.push(`Admin email exception: ${error.message}`)
    }

    // Return success if at least one email was sent
    if (results.customer || results.admin) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          customerEmailId: results.customer?.id,
          adminEmailId: results.admin?.id,
          errors: results.errors.length > 0 ? results.errors : undefined
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Both emails failed
    throw new Error(`Failed to send emails: ${results.errors.join(', ')}`)
  } catch (error) {
    console.error('Error in send-booking-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
