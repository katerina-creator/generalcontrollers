# Railway Deployment Guide

## Overview

The GeneralControllers project uses a **monorepo** on Railway with two services:
- **Website** (static, existing) - serves HTML, CSS, JS
- **Contact API** (new) - backend for contact form with email delivery

## Service A: Website (Update Existing)

1. Go to Railway dashboard → your GeneralControllers service
2. Settings → **Root Directory**: leave as `/` (repo root)
3. Settings → **Start Command**: `npx serve . -l $PORT`
4. No environment variable changes needed
5. Deploy

## Service B: Contact API (Create New)

### Setup on Railway

1. **Create new Service**
   - Railway Dashboard → New Service
   - Select "Deploy from GitHub"
   - Choose your `generalcontrollers` repository
   - **Root Directory**: `contact-api/`
   - **Start Command**: `npm start`

2. **Add Environment Variables**
   
   Go to Service Settings → Variables. Add these:
   
   ```
   ALLOWED_ORIGINS=https://generalcontrollers-production.up.railway.app,https://your-custom-domain.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   MAIL_TO=nextgen.coders.lab@gmail.com
   MAIL_FROM=your-email@gmail.com
   ```

   **Note:** For Gmail:
   - Use an [App Password](https://myaccount.google.com/apppasswords), NOT your regular password
   - Enable 2-Factor Authentication first
   - For other providers (SendGrid, AWS SES, etc.), use their SMTP credentials

3. **Generate Domain**
   - In Railway settings, scroll to "Networking"
   - Click "Generate Domain" to get your API endpoint
   - Copy the domain (e.g., `https://gc-contact-api-prod.railway.app`)

4. **Deploy**
   - Click "Deploy" to start the service

### Update Frontend with API URL

Once your Contact API service has a domain, update `assets/js/main.js`:

```javascript
// Line near top of contactSubmit function - update this:
const API_BASE = window.CONTACT_API_URL || 'https://<your-contact-api-domain>.railway.app';
```

Or set it as a Railway environment variable for the **Website** service:
```
CONTACT_API_URL=https://your-contact-api-domain.railway.app
```

Then reference it in main.js:
```javascript
const API_BASE = window.CONTACT_API_URL || 'https://generalcontrollers-contact-api.up.railway.app';
```

## Verification Checklist

- [ ] Website loads without errors
- [ ] Health check works: `GET https://<api-domain>/health` returns `{"status":"ok"}`
- [ ] Contact form submits and shows success message (no mailto opens)
- [ ] Email arrives at `nextgen.coders.lab@gmail.com` with correct details
- [ ] Form shows error on spam attempts (empty honeypot field is required)
- [ ] Rate limit blocks requests after 10 in 15 minutes
- [ ] Mobile view (375px) shows proper form layout

## Troubleshooting

### Email not sending
- Check SMTP credentials in Railway variables
- Verify SMTP_PORT matches your provider (Gmail: 587 for TLS, 465 for SSL)
- Check Railway service logs for errors

### CORS errors in browser console
- Verify `ALLOWED_ORIGINS` includes your site URL
- Check that domain exactly matches browser URL (including `https://`)

### Form stuck on "Sending..."
- Check if Contact API service is running
- Verify API domain is accessible
- Check browser DevTools Network tab for actual API response

## Local Development

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install API dependencies:
   ```bash
   cd contact-api
   npm install
   ```

3. Create `.env` in `contact-api/`:
   ```bash
   cp .env.example .env
   # Edit with your SMTP credentials
   ```

4. Run both services:
   - Website: `npm start` (from repo root)
   - API: `cd contact-api && npm run dev` (from another terminal)

5. Test form at `http://localhost:3000` (or your serve port)

## Security Notes

- All inputs validated and sanitized server-side
- CSRF not needed (stateless API, no cookies)
- Rate limiting per IP prevents brute-force
- Honeypot field catches basic spam bots
- No sensitive data logged (only metadata)
- CORS prevents cross-site form submission

## Responsive Layout Update

- Replaced fixed px layout with flexible grid/flex system
- Added mobile breakpoints (1024px, 600px)
- Normalized images and typography
- Ensured compatibility with mobile devices

### Key changes

| Area | Before | After |
|---|---|---|
| Header columns | `220px 1fr 220px` | `minmax(120px,220px) 1fr minmax(80px,220px)` |
| Contact grid | `360px 1fr` | `minmax(200px,360px) 1fr` |
| Hero h1 | `font-size: 44px` | `clamp(24px, 5vw, 48px)` |
| Lead paragraph | `font-size: 18px` | `clamp(14px, 2.5vw, 18px)` |
| Cards (≤1024px) | 2 columns | 2 columns |
| Cards (≤600px) | 1 column | 1 column |
| Reasons (≤600px) | 2 columns | 1 column |
| Global images | — | `max-width:100%; height:auto` |
| Form button | partial | `width:100%` |
| Header mobile | fixed columns | grid-area stacked layout ≤768px |

## Header Mobile Fix

- Improved navigation spacing with `gap: 24px` on desktop, `gap: 12px` on mobile (≤600px)
- Moved `white-space: nowrap` from `.main-nav` to individual `.main-nav a` links to prevent text compression
- Added `flex-wrap: wrap` and `overflow-x: auto` to nav at ≤600px so items wrap gracefully rather than overflow
- Added `padding: 0 16px` to `.site-header` for consistent horizontal breathing room on all screen sizes
