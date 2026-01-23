# 🎨 Top of the Green - Website Flow Diagram

## 📊 How Everything Works Together

```
┌─────────────────────────────────────────────────────────────────┐
│                        CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. VISIT WEBSITE
   └─> See upcoming events
   └─> View event details (date, time, capacity, price)
   └─> Click "Book Now"


2. CREATE ACCOUNT
   └─> Sign up with email/password
   └─> Account created automatically


3. BOOK EVENT
   └─> Fill booking form:
       • Name
       • Email (auto-filled)
       • Phone
       • Number of guests
       • Special requests (optional)
   └─> Submit booking


4. BOOKING PROCESSED
   └─> ✅ Saved to database
   └─> ✅ Capacity updated (e.g., 39/40 → 40/40)
   └─> ✅ Confirmation code generated (e.g., TG-20250115-1234)
   └─> ✅ QR code generated
   └─> 📧 Email sent to customer
   └─> 📧 Email sent to you (Scott)


5. CUSTOMER RECEIVES EMAIL
   └─> Booking confirmation with:
       • Confirmation code
       • Event details
       • Date & time
       • QR code for check-in
       • Your contact information


6. CHECK-IN PROCESS
   └─> Customer arrives with QR code
   └─> You scan QR code (on phone/tablet)
   └─> QR code opens website: validate.html?code=TG-20250115-1234
   └─> Website shows booking information from database
   └─> Verify customer matches booking
   └─> ✅ Check-in complete!
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL                               │
└─────────────────────────────────────────────────────────────────┘

    LOGIN → ADMIN DASHBOARD
              │
              ├─> EVENTS TAB
              │   ├─> Create Event
              │   ├─> Edit Event
              │   ├─> Delete Event
              │   ├─> View Capacity (e.g., "39 / 40 booked")
              │   └─> Publish/Hide Events
              │
              ├─> BOOKINGS TAB
              │   ├─> View All Bookings
              │   ├─> Filter by Status:
              │   │     • Confirmed
              │   │     • Cancelled
              │   │     • Completed
              │   ├─> Update Status
              │   ├─> Email Customer
              │   └─> View Details
              │
              ├─> NEWS TAB
              │   ├─> Add Hero News
              │   ├─> Edit News
              │   └─> Publish/Hide
              │
              └─> CAROUSEL TAB
                  ├─> Upload Images
                  ├─> Reorder Images
                  └─> Delete Images
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                 │
└─────────────────────────────────────────────────────────────────┘

CUSTOMER BOOKS
      │
      ├─> Booking Form Data
      │   • Name, Email, Phone
      │   • Event ID
      │   • Number of guests
      │   • Date/Time
      │
      ├─> SAVED TO DATABASE
      │   └─> bookings table
      │       • confirmation_code (auto-generated)
      │       • status: "confirmed"
      │
      ├─> CAPACITY UPDATED
      │   └─> events table
      │       • booked_seats increases automatically
      │       • (e.g., 39 → 40)
      │
      ├─> EMAIL SYSTEM TRIGGERED
      │   ├─> Customer Email
      │   │   • Confirmation code
      │   │   • Event details
      │   │   • QR code image
      │   │
      │   └─> Admin Email (to you)
      │       • Customer info
      │       • Booking details
      │       • QR code for validation
      │       • Quick action buttons
      │
      └─> QR CODE GENERATED
          └─> Contains URL: yourdomain.com/validate.html?code=TG-XXX
          └─> Links to booking validation page
          └─> Shows real-time booking info from database
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                        WHAT NEEDS TO HAPPEN                      │
└─────────────────────────────────────────────────────────────────┘

RIGHT NOW:
  1. ✅ Website is 95% complete
  2. ✅ All features working
  3. ⏳ Waiting on: Email setup


EMAIL SETUP (30 minutes):
  Option 1: You create Resend account → Share API key with me
  Option 2: I create Resend account → You provide email access

  └─> API key added to website backend
  └─> Email function deployed
  └─> ✅ Emails start working!


AFTER EMAIL SETUP:
  1. Quick test (make a test booking)
  2. Verify emails received
  3. ✅ Website ready to launch!
```

---

```
┌─────────────────────────────────────────────────────────────────┐
│                        QR CODE VALIDATION                        │
└─────────────────────────────────────────────────────────────────┘

CUSTOMER ARRIVES
      │
      └─> Shows QR code (from email)
          │
          └─> YOU SCAN QR CODE
              │
              └─> Opens: yourdomain.com/validate.html?code=TG-XXX
                  │
                  └─> WEBSITE FETCHES FROM DATABASE
                      │
                      └─> Shows:
                          • Customer name
                          • Confirmation code
                          • Event details
                          • Date & time
                          • Number of guests
                          • Booking status
                              ✓ Confirmed
                              ✗ Cancelled
                              ✓ Completed
                          • Special requests (if any)
                          │
                          └─> ✅ VERIFY & CHECK-IN!
```

---

## 📋 Simple Checklist

### ✅ **Already Done:**
- [x] Website built
- [x] Database configured
- [x] Booking system working
- [x] Admin panel complete
- [x] QR codes generated

### ⏳ **Needs Your Decision:**
- [ ] Email setup option (Option 1 or 2)

### ✅ **After Email Setup:**
- [ ] Email system configured
- [ ] Test booking made
- [ ] Emails verified
- [ ] **WEBSITE READY TO LAUNCH!**

---

## 💡 Key Points for Scott

1. **Everything works** - Just need email setup (30 min)
2. **Free to run** - All services on free tiers
3. **Easy to use** - Simple admin panel
4. **Automated** - Bookings, emails, QR codes all automatic
5. **Professional** - Customers get beautiful confirmation emails

**Time to launch:** 1 hour after email setup decision

---

*Simple, clear, ready to go!*
