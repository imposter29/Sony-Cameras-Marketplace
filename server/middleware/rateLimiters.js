const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

// Global limiter — generous ceiling to blunt abusive traffic without impacting
// normal browsing. Disabled under test so the suite isn't throttled.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Strict limiter for auth endpoints (login/register/password) to slow down
// credential-stuffing and brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    success: false,
    message: 'Too many attempts. Please try again in a few minutes.',
  },
});

module.exports = { globalLimiter, authLimiter };
