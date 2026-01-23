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

// Load template file from function directory
// In Supabase Edge Functions, files are relative to the function directory
const loadTemplate = async (filename: string): Promise<string> => {
  try {
    // Try using Deno.cwd() relative path first (for local development)
    try {
      const file = await Deno.readTextFile(filename)
      return file
    } catch {
      // If that fails, try with import.meta.url (for deployed functions)
      const baseUrl = new URL('.', import.meta.url)
      const templateUrl = new URL(filename, baseUrl)
      const file = await Deno.readTextFile(templateUrl)
      return file
    }
  } catch (error) {
    console.error(`Error loading template ${filename}:`, error)
    throw new Error(`Could not load template: ${filename}. Make sure the file exists in the function directory.`)
  }
}

// Replace template variables with actual values
const replaceTemplateVariables = (template: string, variables: Record<string, string>): string => {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, value || '')
  }
  return result
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

    // Use actual confirmation code from database (provided in bookingData)
    // If not provided, use the generated bookingId as fallback
    const confirmationCode = bookingData.confirmationCode || bookingId

    // Get website URL from environment variable or use default
    const websiteUrl = Deno.env.get('WEBSITE_URL') || 'https://topofgreen.com'
    
    // Generate QR code with URL pointing to validation page
    // The URL contains just the confirmation code
    const validationUrl = `${websiteUrl}/validate.html?code=${encodeURIComponent(confirmationCode)}`
    
    // Generate QR code with the validation URL
    const qrCodeUrl = await generateQRCode(validationUrl)

    // Format validation data using actual confirmation code
    const bookingIdDisplay = confirmationCode.replace('TG-', 'TG ')
    const validationCode = confirmationCode.split('-').length > 2 
      ? confirmationCode.split('-')[2] + (confirmationCode.split('-')[3] || '')
      : confirmationCode.substring(confirmationCode.length - 8)

    // Prepare template variables
    const templateVariables = {
      from_name: bookingData.customerName,
      from_email: bookingData.customerEmail,
      phone: bookingData.customerPhone || 'Not provided',
      guests: String(bookingData.numberOfGuests),
      event_id: bookingData.eventId,
      booking_id: confirmationCode,
      booking_id_display: bookingIdDisplay,
      validation_code: validationCode,
      special_requests: bookingData.specialRequests || 'No special requests',
      qr_code_url: qrCodeUrl || '',
      message_type: 'Booking Request',
      timestamp: timestamp
    }

    // Load and process email templates
    let customerEmailHtml: string
    let adminEmailHtml: string

    try {
      // Load customer template
      const customerTemplate = await loadTemplate('CUSTOMER_EMAIL_TEMPLATE.html')
      customerEmailHtml = replaceTemplateVariables(customerTemplate, templateVariables)
      
      // Load admin template
      const adminTemplate = await loadTemplate('ADMIN_EMAIL_TEMPLATE.html')
      adminEmailHtml = replaceTemplateVariables(adminTemplate, templateVariables)
    } catch (templateError) {
      console.error('Template loading error:', templateError)
      // If template loading failed, throw error (no fallback for now)
      throw new Error(`Failed to load email templates: ${templateError.message}`)
    }

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
