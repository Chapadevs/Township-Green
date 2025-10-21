# GitHub Pages Deployment Setup Guide

## 🚀 Setting Up Environment Variables for GitHub Pages

Your EmailJS configuration needs to be available during the GitHub Pages build process. Here's how to set it up:

### Step 1: Add GitHub Repository Secrets

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **In the left sidebar, click "Secrets and variables" → "Actions"**
4. **Click "New repository secret" for each of these:**

#### Required Secrets:
- **Name**: `VITE_EMAILJS_SERVICE_ID`
  - **Value**: Your EmailJS Service ID (from your .env file)

- **Name**: `VITE_EMAILJS_ADMIN_TEMPLATE_ID`  
  - **Value**: Your EmailJS Admin Template ID (from your .env file)

- **Name**: `VITE_EMAILJS_CUSTOMER_TEMPLATE_ID`
  - **Value**: Your EmailJS Customer Template ID (from your .env file)

- **Name**: `VITE_EMAILJS_PUBLIC_KEY`
  - **Value**: Your EmailJS Public Key (from your .env file)

- **Name**: `VITE_ADMIN_EMAIL`
  - **Value**: Your admin email address (from your .env file)

### Step 2: Enable GitHub Pages

1. **Go to repository "Settings"**
2. **Scroll down to "Pages" section**
3. **Under "Source", select "GitHub Actions"**
4. **Save the settings**

### Step 3: Push Your Changes

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### Step 4: Monitor the Deployment

1. **Go to the "Actions" tab in your repository**
2. **Watch the deployment process**
3. **Once complete, your site will be available at: `https://[username].github.io/[repository-name]`**

## 🔧 Alternative Solutions

### Option 2: Environment-Specific Config Files

If you prefer not to use GitHub Secrets, you can create environment-specific config files:

```javascript
// src/config/production.config.js
export const productionConfig = {
  emailJS: {
    serviceId: 'your_actual_service_id',
    adminTemplateId: 'your_actual_admin_template_id',
    customerTemplateId: 'your_actual_customer_template_id',
    publicKey: 'your_actual_public_key'
  }
};
```

**⚠️ Warning**: This exposes your EmailJS credentials in your repository. Only use this if your repository is private or if you're comfortable with the security implications.

### Option 3: Runtime Configuration

Load configuration from a separate endpoint or service at runtime.

## 🛠️ Troubleshooting

### Common Issues:

1. **"Missing environment variables" error**
   - Check that all secrets are added to GitHub with exact names
   - Verify the workflow file is in `.github/workflows/` directory

2. **Build fails**
   - Check the Actions tab for detailed error logs
   - Ensure all dependencies are in package.json

3. **Site doesn't update**
   - Check if GitHub Pages source is set to "GitHub Actions"
   - Wait a few minutes for propagation

### Verifying Your Setup:

1. **Check your local .env file contains:**
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
   VITE_ADMIN_EMAIL=admin@yourdomain.com
   ```

2. **Copy these exact values to GitHub Secrets**

## 📞 Need Help?

If you encounter issues:
1. Check the GitHub Actions logs in the "Actions" tab
2. Verify all secret names match exactly (case-sensitive)
3. Ensure your .env values are correct locally first

---

**Next Steps**: After setting up the secrets, push this workflow file and watch your site deploy automatically! 🎉
