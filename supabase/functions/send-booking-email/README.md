# Send Booking Email Edge Function

This Supabase Edge Function sends booking confirmation emails to customers.

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref yvxafxfatcudvkdsvlfu
```

### 4. Set Up Resend (Free Email API)

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your domain OR use their testing domain
4. Get your API key from the dashboard

### 5. Set Environment Variable in Supabase

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

Or set it in the Supabase Dashboard:
- Go to Project Settings → Edge Functions
- Add secret: `RESEND_API_KEY`

### 6. Deploy the Function

```bash
supabase functions deploy send-booking-email
```

## Usage

The function is called automatically from the frontend when a booking is created:

```javascript
const { data, error } = await supabase.functions.invoke('send-booking-email', {
  body: {
    bookingData: {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      eventTitle: 'Art Session',
      sessionDate: '2024-01-15',
      sessionTime: '14:00 - 16:00',
      numberOfGuests: 2,
      confirmationCode: 'ABC123',
      specialRequests: 'Vegetarian snacks'
    }
  }
})
```

## Testing Locally

```bash
supabase functions serve send-booking-email
```

Then test with:

```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-booking-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"bookingData":{"customerName":"Test User","customerEmail":"test@example.com","eventTitle":"Art Session","sessionDate":"2024-01-15","sessionTime":"14:00","numberOfGuests":1,"confirmationCode":"TEST123"}}'
```

## Cost

- Resend Free Tier: 100 emails/day, 3,000 emails/month
- Supabase Edge Functions: 500,000 invocations/month free
- **Total cost for this setup: $0/month** for small to medium traffic

## Email Provider Options

If you prefer a different email provider, you can easily modify the function:

- **Resend** (recommended) - Simple, modern API
- **SendGrid** - Free tier: 100 emails/day
- **Mailgun** - Free tier: 5,000 emails/month
- **SMTP** - Use any email service (Gmail, etc.)
