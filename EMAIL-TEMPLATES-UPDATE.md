# ✅ Email Templates Updated!

Your Supabase Edge Function now uses your beautiful existing email templates with QR codes and validation system!

---

## 🎉 What I Just Did

### 1. Updated Edge Function (`supabase/functions/send-booking-email/index.ts`)
- ✅ Added QR code generation using Deno-compatible library
- ✅ Integrated your full ADMIN_EMAIL_TEMPLATE.html design
- ✅ Integrated your full CUSTOMER_EMAIL_TEMPLATE.html design
- ✅ Sends BOTH admin and customer emails
- ✅ Includes booking validation system (QR codes + booking IDs)
- ✅ All your original styling and branding

### 2. Updated BookingForm Component
- ✅ Added `customerPhone` to email data
- ✅ Added `eventId` to email data
- ✅ Now sends complete booking information

---

## 📧 Email Features Now Working

### Admin Email:
- 🎨 Beautiful Township Green branding
- 🔔 New booking alert with full details
- 🔐 Booking ID and validation code
- 🎫 QR code preview (customer's QR code)
- 📱 Quick action buttons (email, call, SMS)
- ⏰ Timestamp and priority info

### Customer Email:
- 🎨 Gorgeous confirmation design
- 🎫 Digital pass with validation code
- 🔐 Unique QR code for check-in
- 📋 Complete booking details
- 💬 Special requests displayed
- ℹ️ What to expect at the lounge
- 📞 Contact information

---

## 🚀 Next Steps - Deployment

### Option A: Deploy via Supabase Dashboard (Recommended - Easiest)

1. **Go to Supabase Dashboard** → Your Project
2. Click **Edge Functions** in left sidebar
3. Click **"Deploy new function"** or **"Create function"**
4. Name: `send-booking-email`
5. Copy the entire contents of `supabase/functions/send-booking-email/index.ts`
6. Paste into the editor
7. Click **"Deploy"**

### Option B: Deploy via CLI

```bash
# If you haven't already
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-booking-email
```

### Set Environment Variables

In **Supabase Dashboard** → **Project Settings** → **Edge Functions** → **Secrets**:

Add these secrets:
- `RESEND_API_KEY` = Your Resend API key (from resend.com)
- `ADMIN_EMAIL` = Your admin email (e.g., `admin@topofgreen.com`)

---

## 🧪 Testing

After deployment:

1. **Make a test booking** on your website
2. **Check customer email** - Should receive beautiful confirmation with QR code
3. **Check admin email** - Should receive booking notification
4. **Verify QR codes** - They should be Township Green styled

---

## 📝 Important Notes

### Email Sender Address

Currently set to: `Top of the Green <onboarding@resend.dev>`

**To use your own domain:**
1. Add and verify your domain in Resend dashboard
2. Update line ~165 and ~188 in the Edge Function:
   ```typescript
   from: 'Top of the Green <bookings@yourdomain.com>'
   ```

### QR Code Data

QR codes contain booking information:
- Booking ID
- Customer name & email
- Event details
- Number of guests
- Booking date

When scanned, they display the validation information.

### Template Variables

All these variables are now properly mapped:
- `${bookingData.customerName}`
- `${bookingData.customerEmail}`
- `${bookingData.customerPhone}`
- `${bookingData.eventTitle}`
- `${bookingData.eventId}`
- `${bookingData.sessionDate}`
- `${bookingData.sessionTime}`
- `${bookingData.numberOfGuests}`
- `${bookingData.specialRequests}`
- `${bookingId}` - Auto-generated (TG-YYYYMMDD-HHMMSS-XXXX)
- `${validationCode}` - Quick validation code
- `${qrCodeUrl}` - Base64 QR code image
- `${timestamp}` - Request timestamp

---

## 🗑️ Optional Cleanup

You can now **delete these files** (they're embedded in the Edge Function):
- `ADMIN_EMAIL_TEMPLATE.html`
- `CUSTOMER_EMAIL_TEMPLATE.html`
- `src/utils/bookingValidation.js` (only if not used elsewhere)

**Or keep them** as documentation/reference - they don't affect deployment.

---

## 🐛 Troubleshooting

### QR Code Not Showing
- Check browser console for errors
- QR generation happens server-side now (should work)

### Emails Not Received
- Verify `RESEND_API_KEY` is set in Supabase secrets
- Check Resend dashboard for delivery status
- Check spam/junk folders

### Wrong Email Content
- Verify Edge Function deployed correctly
- Check template variables are mapping properly
- View Edge Function logs in Supabase Dashboard

### Admin Email Not Received
- Verify `ADMIN_EMAIL` secret is set
- Check it's a valid, verified email in Resend

---

## ✨ Success Criteria

After deployment, you should see:
- ✅ Customer receives beautiful branded confirmation
- ✅ Customer email has QR code for check-in
- ✅ Admin receives notification with all booking details
- ✅ Admin email has preview of customer's QR code
- ✅ Both emails have validation codes
- ✅ Township Green branding throughout

---

**You're all set!** Deploy the Edge Function and test it out! 🎉

If you encounter any issues, check the Supabase Edge Function logs for detailed error messages.
