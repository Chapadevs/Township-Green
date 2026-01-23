# How Email Templates Work with Resend.com & Supabase

## 📧 Complete Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  1. USER MAKES BOOKING (Frontend)                                │
│     - User fills out booking form                                │
│     - Form submits to your React app                             │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. FRONTEND CALLS SUPABASE EDGE FUNCTION                       │
│     - Your React app calls:                                      │
│       supabase.functions.invoke('send-booking-email', {...})      │
│     - Sends booking data (name, email, event, etc.)              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. SUPABASE EDGE FUNCTION RUNS (index.ts)                      │
│     Location: supabase/functions/send-booking-email/index.ts     │
│                                                                   │
│     Step 3a: Loads your HTML template                            │
│     ┌─────────────────────────────────────────┐                 │
│     │ const template = await loadTemplate(     │                 │
│     │   'CUSTOMER_EMAIL_TEMPLATE.html'         │                 │
│     │ )                                         │                 │
│     │                                           │                 │
│     │ Reads the file from:                      │                 │
│     │ supabase/functions/send-booking-email/    │                 │
│     │   CUSTOMER_EMAIL_TEMPLATE.html            │                 │
│     └─────────────────────────────────────────┘                 │
│                                                                   │
│     Step 3b: Replaces template variables                         │
│     ┌─────────────────────────────────────────┐                 │
│     │ Template has: {{from_name}}               │                 │
│     │                                          │                 │
│     │ Function replaces with:                  │                 │
│     │ "John Doe" (from bookingData)            │                 │
│     │                                          │                 │
│     │ All {{variables}} get replaced!          │                 │
│     └─────────────────────────────────────────┘                 │
│                                                                   │
│     Step 3c: Gets Resend API Key                                 │
│     ┌─────────────────────────────────────────┐                 │
│     │ const RESEND_API_KEY =                   │                 │
│     │   Deno.env.get('RESEND_API_KEY')         │                 │
│     │                                          │                 │
│     │ This comes from Supabase secrets!        │                 │
│     └─────────────────────────────────────────┘                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. SENDS EMAIL VIA RESEND.COM API                              │
│     - Makes HTTP POST request to:                                │
│       https://api.resend.com/emails                              │
│                                                                   │
│     Request includes:                                            │
│     ┌─────────────────────────────────────────┐                 │
│     │ {                                        │                 │
│     │   "from": "Top of the Green <...>",     │                 │
│     │   "to": ["customer@example.com"],       │                 │
│     │   "subject": "Booking Confirmation...",  │                 │
│     │   "html": "<!DOCTYPE html>..."           │                 │
│     │     ↑                                    │                 │
│     │     This is your processed template!     │                 │
│     │     All {{variables}} are replaced      │                 │
│     │ }                                        │                 │
│     └─────────────────────────────────────────┘                 │
│                                                                   │
│     Authorization Header:                                         │
│     Bearer re_your_api_key_here                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. RESEND.COM DELIVERS EMAIL                                    │
│     - Resend receives the request                                │
│     - Validates your API key                                     │
│     - Sends email to customer's inbox                            │
│     - Returns success/error response                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Step-by-Step Process

### **Step 1: Template File Location**
```
supabase/functions/send-booking-email/
├── index.ts                          ← Edge Function code
├── CUSTOMER_EMAIL_TEMPLATE.html      ← Your HTML template
└── ADMIN_EMAIL_TEMPLATE.html         ← Admin template
```

### **Step 2: Template Loading (in index.ts)**

```typescript
// Line 160: Loads your HTML file
const customerTemplate = await loadTemplate('CUSTOMER_EMAIL_TEMPLATE.html')

// This reads the file from the function directory
// Deno.readTextFile('CUSTOMER_EMAIL_TEMPLATE.html')
```

### **Step 3: Variable Replacement**

Your template has placeholders:
```html
<h1>Thank you, <span>{{from_name}}</span>!</h1>
<p>Booking ID: {{booking_id_display}}</p>
```

The function replaces them:
```typescript
// Line 139-152: Creates variable map
const templateVariables = {
  from_name: bookingData.customerName,        // "John Doe"
  booking_id_display: bookingIdDisplay,        // "TG 20241215-143022-1234"
  // ... etc
}

// Line 161: Replaces all {{variables}}
customerEmailHtml = replaceTemplateVariables(
  customerTemplate, 
  templateVariables
)
```

Result:
```html
<h1>Thank you, <span>John Doe</span>!</h1>
<p>Booking ID: TG 20241215-143022-1234</p>
```

### **Step 4: Sending via Resend API**

```typescript
// Line 198-209: Makes API call to Resend
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,  // From Supabase secrets
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'Top of the Green <onboarding@resend.dev>',
    to: [bookingData.customerEmail],
    subject: `Booking Confirmation - ${bookingData.eventTitle}`,
    html: customerEmailHtml  // ← Your processed template!
  })
})
```

## 🔑 Key Connections

### **1. Template File → Function**
- Template is in the same directory as `index.ts`
- Function reads it using `Deno.readTextFile()`
- Works both locally and when deployed to Supabase

### **2. Function → Resend.com**
- Function makes HTTP request to Resend API
- Uses API key stored in Supabase secrets
- Sends the processed HTML as email body

### **3. Supabase Secrets → Resend API Key**
```bash
# You set this in Supabase:
supabase secrets set RESEND_API_KEY=re_your_key_here

# Function reads it:
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
```

## 📝 Template Variable Mapping

| Template Variable | Source | Example |
|------------------|--------|---------|
| `{{from_name}}` | `bookingData.customerName` | "John Doe" |
| `{{from_email}}` | `bookingData.customerEmail` | "john@example.com" |
| `{{phone}}` | `bookingData.customerPhone` | "+1234567890" |
| `{{guests}}` | `bookingData.numberOfGuests` | "2" |
| `{{event_id}}` | `bookingData.eventId` | "event-123" |
| `{{booking_id}}` | Generated | "TG-20241215-143022-1234" |
| `{{booking_id_display}}` | Formatted | "TG 20241215-143022-1234" |
| `{{validation_code}}` | Extracted | "1430221234" |
| `{{qr_code_url}}` | Generated QR code | "data:image/png;base64,..." |
| `{{special_requests}}` | `bookingData.specialRequests` | "Vegetarian snacks" |
| `{{message_type}}` | Hardcoded | "Booking Request" |
| `{{timestamp}}` | Generated | "Monday, December 15, 2024, 02:30 PM EST" |

## 🚀 How It All Works Together

1. **You edit the HTML template** → Change `CUSTOMER_EMAIL_TEMPLATE.html`
2. **Function loads it** → Reads file when booking is made
3. **Variables get replaced** → `{{from_name}}` becomes actual name
4. **Resend sends email** → Uses your API key to deliver
5. **Customer receives email** → Beautiful HTML email in their inbox!

## ✅ Why This Setup Works

- **Separation of Concerns**: HTML templates separate from code
- **Easy to Edit**: Change email design without touching TypeScript
- **Secure**: API key stored in Supabase, not in code
- **Scalable**: Resend handles email delivery reliably
- **Flexible**: Can update templates without redeploying function

## 🔧 Testing the Flow

1. **Make a booking** on your website
2. **Check Supabase logs**:
   ```bash
   supabase functions logs send-booking-email --tail
   ```
3. **Check Resend dashboard** for email status
4. **Check customer inbox** for the email

---

**The magic happens in `index.ts` lines 158-209** - that's where your template gets loaded, processed, and sent via Resend! 🎉
