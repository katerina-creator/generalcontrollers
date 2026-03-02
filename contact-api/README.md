# Contact API

Simple, secure contact form email service for GeneralControllers website.

## Features

- Express.js backend with security hardening (Helmet, CORS)
- Input validation & HTML sanitization
- Rate limiting (10 requests/15 min per IP)
- Honeypot field anti-spam
- Email delivery via Nodemailer
- Request logging (no PII)

## Local Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your SMTP credentials (Gmail, SendGrid, etc.)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start server:
   ```bash
   npm start
   ```

   Or with auto-reload:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:3000`

## API Endpoints

- **GET /health** - Health check
  ```bash
  curl http://localhost:3000/health
  ```

- **POST /api/contact** - Submit contact form
  ```bash
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{
      "name": "John Doe",
      "contact": "john@example.com",
      "message": "Hello, I am interested in your services",
      "company": ""
    }'
  ```

## Railway Deployment

1. Create new Service → point to this directory (`contact-api/`)
2. Set Start Command: `npm start`
3. Add Railway Variables:
   - `ALLOWED_ORIGINS` = https://your-site-url.up.railway.app
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `MAIL_TO` = nextgen.coders.lab@gmail.com
   - `MAIL_FROM` = your-verified-sender@domain.com

4. Deploy

## Validation Rules

| Field   | Min | Max  |
|---------|-----|------|
| name    | 1   | 80   |
| contact | 3   | 120  |
| message | 10  | 2000 |

All inputs are stripped of HTML tags. CR/LF characters rejected to prevent header injection.
