const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('crypto');

// Environment variables
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(o => o.trim());
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_TO = process.env.MAIL_TO || 'nextgen.coders.lab@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 3600
}));

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Rate limiting: 10 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    logEvent(req.ip, 'RATE_LIMIT', 429);
    res.status(429).json({ error: 'Too many requests' });
  }
});

app.use('/api/', limiter);

// Validation rules
const RULES = {
  name: { min: 1, max: 80 },
  contact: { min: 3, max: 120 },
  message: { min: 10, max: 2000 }
};

// Logging function (no PII, no message content)
function logEvent(ip, event, status, details = '') {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    event,
    ip: maskIp(ip),
    status,
    details
  }));
}

// Mask IP for logging
function maskIp(ip) {
  if (!ip) return 'unknown';
  if (ip === '::1') return 'localhost';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.* `;
  }
  return ip.substring(0, ip.length - 4) + 'xxxx';
}

// Sanitization function
function sanitizeField(value) {
  if (typeof value !== 'string') return '';
  // Remove HTML tags
  let clean = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  });
  // Prevent header injection: reject if contains CR or LF
  if (/[\r\n]/.test(clean)) {
    return null; // invalid
  }
  return clean.trim();
}

// Validation function
function validateInput(name, contact, message, company) {
  const errors = [];

  // Honeypot check
  if (company && company.trim() !== '') {
    return { valid: false, error: 'Invalid submission' };
  }

  // Sanitize
  const cleanName = sanitizeField(name);
  const cleanContact = sanitizeField(contact);
  const cleanMessage = sanitizeField(message);

  if (cleanName === null || cleanContact === null || cleanMessage === null) {
    return { valid: false, error: 'Invalid characters in submission' };
  }

  // Validate lengths
  if (!cleanName || cleanName.length < RULES.name.min || cleanName.length > RULES.name.max) {
    errors.push(`Name must be ${RULES.name.min}-${RULES.name.max} characters`);
  }
  if (!cleanContact || cleanContact.length < RULES.contact.min || cleanContact.length > RULES.contact.max) {
    errors.push(`Contact must be ${RULES.contact.min}-${RULES.contact.max} characters`);
  }
  if (!cleanMessage || cleanMessage.length < RULES.message.min || cleanMessage.length > RULES.message.max) {
    errors.push(`Message must be ${RULES.message.min}-${RULES.message.max} characters`);
  }

  if (errors.length > 0) {
    return { valid: false, error: errors[0] };
  }

  return {
    valid: true,
    data: {
      name: cleanName,
      contact: cleanContact,
      message: cleanMessage
    }
  };
}

// Email sending function
async function sendEmail(name, contact, message) {
  // Only create transporter if SMTP credentials are available
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP credentials not configured');
    throw new Error('Email service not configured');
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  const plaintext = `
Name: ${name}
Contact: ${contact}

Message:
${message}
`;

  const html = `
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
`;

  await transporter.sendMail({
    from: MAIL_FROM,
    to: MAIL_TO,
    subject: `Website Contact: ${name}`,
    text: plaintext,
    html: html,
    replyTo: contact
  });
}

// Escape HTML for safe email display
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const requestId = uuidv4().substring(0, 8);

  try {
    const { name, contact, message, company } = req.body || {};

    // Validate input
    const validation = validateInput(name, contact, message, company);
    if (!validation.valid) {
      logEvent(clientIp, 'VALIDATION_FAILED', 400, validation.error);
      return res.status(400).json({ error: validation.error });
    }

    const { data } = validation;

    // Send email
    await sendEmail(data.name, data.contact, data.message);

    logEvent(clientIp, 'CONTACT_SUCCESS', 200, requestId);
    return res.status(200).json({ success: true, message: 'Contact form submitted successfully' });

  } catch (error) {
    console.error(`[${requestId}] Error processing contact form:`, error.message);
    logEvent(clientIp, 'SERVER_ERROR', 500, error.message.substring(0, 50));
    res.status(500).json({ error: 'Failed to process request. Please try again later.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Contact API server started on port ${PORT}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
