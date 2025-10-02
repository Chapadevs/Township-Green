# 🌿 Township Green - Development Guide

## 🚀 Quick Start

### Development Mode
```bash
# Start development server
npm run dev

# Build for development (with sourcemaps, unminified)
npm run build:dev

# Preview development build
npm run preview:dev
```

### Production Mode
```bash
# Build for production (optimized, minified)
npm run build:prod

# Preview production build
npm run preview:prod
```

## 📁 Build Outputs

- **Development Build**: `dist-dev/` - Includes sourcemaps, unminified code
- **Production Build**: `dist/` - Optimized, minified, production-ready

## 🔧 Environment Configuration

### Setting Up Environment Variables

1. **Create your local environment file**:
   ```bash
   # Copy the example file
   cp .env.local.example .env.local
   ```

2. **Fill in your EmailJS credentials** in `.env.local`:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

### Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `VITE_EMAILJS_SERVICE_ID` | Required | Required | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | Required | Required | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | Required | Required | EmailJS public key |
| `VITE_DEBUG_MODE` | `true` | `false` | Enable debug logging |
| `VITE_CONSOLE_LOGS` | `true` | `false` | Enable console logs |

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run build:prod` | Build for production (explicit) |
| `npm run preview` | Preview production build |
| `npm run preview:dev` | Preview development build |
| `npm run preview:prod` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run serve` | Serve build on port 4173 |

## 🏗️ Development Workflow

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
- Server runs on `http://localhost:5173`
- Hot reload enabled
- Source maps available
- Debug mode active

### 2. Testing Changes
```bash
# Build development version
npm run build:dev

# Preview the build
npm run preview:dev
```

### 3. Production Testing
```bash
# Build production version
npm run build:prod

# Preview production build
npm run preview:prod
```

### 4. Deployment
```bash
# Build for production
npm run build:prod

# Deploy the 'dist' folder to your hosting platform
```

## 🎨 Development Features

### Debug Mode
When in development mode, you'll see:
- Console logs with configuration details
- Detailed error messages
- Source maps for debugging
- Unminified code

### Environment Detection
The app automatically detects the environment:
```javascript
import config from './src/config/environment.js'

if (config.isDevelopment) {
  console.log('Running in development mode')
}
```

## 📦 Build Differences

### Development Build (`dist-dev/`)
- **Sourcemaps**: Enabled for debugging
- **Minification**: Disabled for readability
- **Debug**: Console logs enabled
- **Size**: Larger bundle size

### Production Build (`dist/`)
- **Sourcemaps**: Disabled for security
- **Minification**: Enabled for performance
- **Debug**: Console logs disabled
- **Size**: Optimized bundle size

## 🔍 Debugging

### Environment Issues
```javascript
// Check current environment
console.log('Environment:', import.meta.env.MODE)
console.log('Config:', config)

// Validate configuration
import { validateConfig } from './src/config/environment.js'
validateConfig()
```

### EmailJS Issues
1. Check environment variables are set
2. Verify EmailJS service is configured
3. Check browser console for errors
4. Test with development template first

## 🚀 Deployment

### Development Deployment
- Use `npm run build:dev` for staging environments
- Includes debugging tools
- Larger bundle size

### Production Deployment
- Use `npm run build:prod` for live site
- Optimized performance
- Minimal bundle size

### Hosting Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build command: npm run build:prod
# Publish directory: dist
```

## 🔧 Customization

### Adding Environment Variables
1. Add to `src/config/environment.js`
2. Use `VITE_` prefix for client-side variables
3. Update both development and production configs

### Modifying Build Process
Edit `vite.config.js` to customize:
- Build output directories
- Optimization settings
- Plugin configurations

## 📝 Best Practices

### Development
- Always use `npm run dev` for local development
- Test with `npm run build:dev` before committing
- Keep environment variables in `.env.local`

### Production
- Use `npm run build:prod` for deployments
- Test production build locally with `npm run preview:prod`
- Never commit `.env.local` or real credentials

### Code Quality
- Run `npm run lint` before committing
- Follow the design system guidelines
- Test on multiple devices/browsers

## 🆘 Troubleshooting

### Common Issues

**Build fails with environment errors**
- Check `.env.local` exists and has correct values
- Verify all required environment variables are set

**EmailJS not working**
- Validate EmailJS credentials
- Check CORS settings in EmailJS dashboard
- Verify template configuration

**Development server won't start**
- Check port 5173 isn't in use
- Clear node_modules and reinstall
- Check for syntax errors in config files

### Getting Help
1. Check browser console for errors
2. Review this development guide
3. Check the main project documentation
4. Verify environment configuration

---

Happy coding! 🌿✨
