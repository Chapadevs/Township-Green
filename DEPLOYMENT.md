# Township Community - GitHub Pages Deployment Guide

## 🚀 Deploy to GitHub Pages in 5 Minutes

### Step 1: Set Up Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Configure EmailJS Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings > Secrets and variables > Actions**
3. **Add these Repository Secrets**:
   - Name: `VITE_EMAILJS_SERVICE_ID`, Value: `your_service_id`
   - Name: `VITE_EMAILJS_TEMPLATE_ID`, Value: `your_template_id`
   - Name: `VITE_EMAILJS_PUBLIC_KEY`, Value: `your_public_key`

### Step 3: Enable GitHub Pages

1. **Go to Settings > Pages**
2. **Set Source to "GitHub Actions"**
3. **Save the settings**

### Step 4: Deploy

1. **Push any changes to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Check the Actions tab** to see deployment progress

3. **Your site will be live at**:
   `https://your-username.github.io/Township-Green/`

## 🔧 Troubleshooting

### Build Fails?

1. **Check Action logs** in the Actions tab
2. **Verify secrets are set correctly**
3. **Ensure all files are committed**

### EmailJS Not Working?

1. **Double-check your secrets**
2. **Test EmailJS in development first**
3. **Verify your EmailJS template variables**

### Site Not Loading?

1. **Check if GitHub Pages is enabled**
2. **Verify the source is set to "GitHub Actions"**
3. **Wait 5-10 minutes for DNS propagation**

## 🎯 Custom Domain (Optional)

1. **Add a CNAME file** to your repository root:
   ```
   your-domain.com
   ```

2. **Configure DNS** with your domain provider:
   - Add a CNAME record pointing to `your-username.github.io`

3. **Enable HTTPS** in GitHub Pages settings

## 📊 Monitoring

- **Check build status**: GitHub Actions tab
- **View deployment logs**: Actions > Deploy workflow
- **Monitor site health**: Your live URL

---

**Your Township Community website is now live! 🌿**
