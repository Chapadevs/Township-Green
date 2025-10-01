# 🔧 Environment Variables Setup - Township Green

## 🎯 **Recommended Approach: .env + Config File Hybrid**

After analyzing best practices for React/Vite projects, here's the optimal setup for your Township Green website:

### **Why This Hybrid Approach?**

✅ **Security**: Sensitive data in `.env` (not committed to git)  
✅ **Developer Experience**: Rich configuration with validation  
✅ **Flexibility**: Easy to override for different environments  
✅ **Professional**: Industry-standard approach  

## 🚀 **Setup Instructions**

### **Step 1: Create Your .env File**

Create a `.env` file in your project root with these variables:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_actual_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin_your_id
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_customer_your_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key

# Business Information
VITE_ADMIN_EMAIL=youremail@yourdomain.com
VITE_CUSTOMER_SERVICE_EMAIL=hello@yourdomain.com
VITE_BUSINESS_PHONE=(555) 123-4567

# Business Address
VITE_BUSINESS_STREET=123 Your Street
VITE_BUSINESS_CITY=Your City
VITE_BUSINESS_STATE=Your State
VITE_BUSINESS_ZIP=12345
VITE_BUSINESS_COUNTRY=USA

# Development Options (optional)
VITE_ENABLE_TEST_MODE=false
VITE_ENABLE_EMAIL_LOGGING=true
```

### **Step 2: Copy Template**

Use the template from `ENV_EXAMPLE.txt` as your starting point.

### **Step 3: Verify Setup**

The system will automatically:
- ✅ Load variables from `.env`
- ✅ Fall back to safe defaults if missing
- ✅ Validate configuration on startup
- ✅ Show helpful error messages

## 📦 **Recommended Extensions**

### **VS Code Extensions**

Install these extensions for better environment variable management:

#### **1. DotENV Extension**
```bash
# Install via VS Code Extensions
ext install mikestead.dotenv
```
**Features:**
- Syntax highlighting for `.env` files
- Auto-completion for environment variables
- Error detection for malformed variables

#### **2. Better Comments**
```bash
ext install aaron-bond.better-comments
```
**Features:**
- Enhanced comments in your config files
- Color-coded comment types
- Better documentation readability

#### **3. Error Lens**
```bash
ext install usernamehw.errorlens
```
**Features:**
- Inline error display
- Immediate feedback on configuration issues
- Better debugging experience

### **Package Recommendations**

#### **Optional: dotenv-expand**
```bash
npm install dotenv-expand
```
Allows variable interpolation in `.env` files:
```env
VITE_API_URL=https://api.example.com
VITE_WEBHOOKS_URL=${VITE_API_URL}/webhooks
```

## 🔒 **Security Best Practices**

### **✅ Safe for Frontend (Our Approach)**
- **EmailJS Public Keys** - Designed to be exposed
- **Business Information** - Public contact details
- **Non-sensitive Configuration** - API endpoints, feature flags

### **❌ Never Put in Frontend .env**
- Database passwords
- Private API keys
- Secret tokens
- Payment gateway secrets

### **🛡️ Security Checklist**
- ✅ `.env` is in `.gitignore`
- ✅ Only `VITE_` prefixed variables are exposed
- ✅ No sensitive data in environment variables
- ✅ Example file doesn't contain real credentials

## 🌍 **Different Environments**

### **Development (.env.development)**
```env
VITE_ENABLE_TEST_MODE=true
VITE_ENABLE_EMAIL_LOGGING=true
```

### **Production (.env.production)**
```env
VITE_ENABLE_TEST_MODE=false
VITE_ENABLE_EMAIL_LOGGING=false
```

### **Staging (.env.staging)**
```env
VITE_ADMIN_EMAIL=staging@yourdomain.com
VITE_ENABLE_TEST_MODE=true
```

## 🏗️ **How It Works**

### **Configuration Loading Order:**
1. **Environment Variables** (`.env` file) - Highest priority
2. **Default Values** (in `email.config.js`) - Fallback
3. **Validation** - Ensures everything is configured properly

### **Example Flow:**
```javascript
// In email.config.js
serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default'

// Process:
// 1. Check .env file for VITE_EMAILJS_SERVICE_ID
// 2. If found, use that value
// 3. If not found, use 'service_default'
// 4. Validation warns if still using defaults
```

## 🧪 **Testing Your Setup**

### **1. Verify Environment Loading**
```javascript
// Open browser console and run:
console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
```

### **2. Check Configuration Validation**
The app will show console warnings for missing configuration:
```
EmailJS configuration is incomplete: EmailJS Service ID not configured
```

### **3. Test Email Functionality**
1. Enable test mode: `VITE_ENABLE_TEST_MODE=true`
2. Try booking an event
3. Check console for mock email responses

## 🚀 **Deployment**

### **Vercel**
Add environment variables in project settings:
- Dashboard → Project → Settings → Environment Variables

### **Netlify**
Add environment variables in site settings:
- Site Settings → Build & Deploy → Environment Variables

### **Others**
Most hosting providers have environment variable management in their dashboards.

## 💡 **Pro Tips**

### **1. Use Descriptive Variable Names**
```env
# Good
VITE_EMAILJS_SERVICE_ID=service_abc123

# Bad
VITE_SID=service_abc123
```

### **2. Group Related Variables**
```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_ADMIN_TEMPLATE_ID=...

# Business Information
VITE_ADMIN_EMAIL=...
VITE_BUSINESS_PHONE=...
```

### **3. Use Comments in .env**
```env
# Your primary business email where booking notifications are sent
VITE_ADMIN_EMAIL=admin@yourdomain.com
```

### **4. Validate Early and Often**
The configuration system will warn you immediately if something is wrong, making debugging much easier.

## 🔧 **Troubleshooting**

### **Variables Not Loading**
- ✅ Restart development server after changing `.env`
- ✅ Ensure variables start with `VITE_`
- ✅ Check for typos in variable names
- ✅ Verify `.env` file is in project root

### **Configuration Warnings**
Check browser console for validation messages:
```
EmailJS configuration is incomplete: Admin email not configured
```

### **VS Code Not Highlighting .env**
Install the DotENV extension or check file associations.

## 📊 **Comparison: .env vs Config File Only**

| Feature | .env + Config | Config Only |
|---------|---------------|-------------|
| Security | ✅ Excellent | ⚠️ Exposed |
| Developer Experience | ✅ Excellent | ✅ Excellent |
| Environment Flexibility | ✅ Excellent | ❌ Limited |
| Industry Standard | ✅ Yes | ❌ Uncommon |
| Git Safety | ✅ Safe | ⚠️ Risk |

## 🎯 **Conclusion**

**The hybrid approach (.env + config file) is the best choice** for Township Green because:

- ✅ **Professional standard** used by most React projects
- ✅ **Secure** - sensitive data stays out of git
- ✅ **Flexible** - easy to configure for different environments
- ✅ **Developer-friendly** - great tooling and VS Code support
- ✅ **Maintainable** - clear separation of concerns

Your current setup now supports both approaches, giving you the best of both worlds! 🌿✨
