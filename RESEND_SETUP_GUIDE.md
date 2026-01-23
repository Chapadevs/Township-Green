# Resend.com Email Setup Guide

This guide will help you configure Resend.com to send booking confirmation emails through your Supabase Edge Function.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get Your API Key

1. After logging in, go to the **API Keys** section in your dashboard
2. Click **"Create API Key"**
3. Give it a name (e.g., "Township Green Booking Emails")
4. Select **"Sending access"** permissions
5. Copy the API key (it starts with `re_`)

⚠️ **Important**: Save this key securely - you won't be able to see it again!

## Step 3: Configure Your Domain (Optional but Recommended)

### Option A: Use Resend's Test Domain (Quick Setup)
- You can use `onboarding@resend.dev` for testing
- This is already configured in the code
- **Limitation**: Emails may go to spam and you can't customize the "from" address

### Option B: Verify Your Own Domain (Production)
1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `topofgreen.com`)
4. Follow the DNS configuration instructions:
   - Add the provided TXT record for domain verification
   - Add the provided SPF record
   - Add the provided DKIM records
5. Wait for verification (usually takes a few minutes)
6. Once verified, update the `from` address in `supabase/functions/send-booking-email/index.ts`:
   ```typescript
   from: 'Top of the Green <noreply@topofgreen.com>',
   ```

## Step 4: Set the API Key in Supabase

### Method 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref yvxafxfatcudvkdsvlfu

# Set the Resend API key as a secret
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

### Method 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions**
3. Scroll down to **Secrets**
4. Click **"Add new secret"**
5. Name: `RESEND_API_KEY`
6. Value: Your Resend API key (starts with `re_`)
7. Click **"Save"**

## Step 5: Deploy the Edge Function

```bash
# Deploy the function with templates
supabase functions deploy send-booking-email
```

## Step 6: Test the Email Sending

1. Make a test booking through your website
2. Check the Supabase Edge Functions logs:
   ```bash
   supabase functions logs send-booking-email
   ```
3. Check your Resend dashboard for email delivery status
4. Verify the customer received the email

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is set correctly
   ```bash
   supabase secrets list
   ```

2. **Check Function Logs**: Look for errors
   ```bash
   supabase functions logs send-booking-email --tail
   ```

3. **Check Resend Dashboard**: 
   - Go to **Logs** in Resend dashboard
   - Look for failed deliveries
   - Check error messages

4. **Verify Template Files**: Make sure both template files exist:
   - `supabase/functions/send-booking-email/CUSTOMER_EMAIL_TEMPLATE.html`
   - `supabase/functions/send-booking-email/ADMIN_EMAIL_TEMPLATE.html`

### Common Errors

**"RESEND_API_KEY not configured"**
- The secret is not set in Supabase
- Run: `supabase secrets set RESEND_API_KEY=your_key`

**"Could not load template"**
- Template files are missing from the function directory
- Make sure both HTML template files are in `supabase/functions/send-booking-email/`

**"Invalid API key"**
- Your API key is incorrect or expired
- Generate a new key in Resend dashboard

**"Domain not verified"**
- If using custom domain, verify it's properly configured in Resend
- Check DNS records are correct

## Email Template Variables

The email templates use these variables (automatically replaced):

- `{{from_name}}` - Customer name
- `{{from_email}}` - Customer email
- `{{phone}}` - Customer phone number
- `{{guests}}` - Number of guests
- `{{event_id}}` - Event/Session ID
- `{{booking_id}}` - Full booking ID
- `{{booking_id_display}}` - Formatted booking ID
- `{{validation_code}}` - Quick validation code
- `{{special_requests}}` - Special requests from customer
- `{{qr_code_url}}` - QR code image (data URL)
- `{{message_type}}` - Type of message
- `{{timestamp}}` - When the booking was created

## Resend Free Tier Limits

- **100 emails per day**
- **3,000 emails per month**
- Perfect for small to medium businesses!

## Upgrading

If you need more emails:
- **Pro Plan**: $20/month for 50,000 emails/month
- Visit [Resend Pricing](https://resend.com/pricing) for details

## Support

- **Resend Docs**: [https://resend.com/docs](https://resend.com/docs)
- **Supabase Edge Functions**: [https://supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)

---

**Next Steps**: After setting up Resend, test a booking to ensure emails are being sent correctly!
