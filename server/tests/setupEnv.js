// Runs before the test framework is installed. Ensures env is deterministic and
// that no real Google OAuth / SMTP is required.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
delete process.env.GOOGLE_CLIENT_ID;
delete process.env.GOOGLE_CLIENT_SECRET;
delete process.env.SMTP_HOST;
