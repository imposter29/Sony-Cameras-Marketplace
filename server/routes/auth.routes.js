const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  setPassword,
} = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');
const {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  setPasswordRules,
} = require('../middleware/validators');

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.get('/me', verifyToken, getMe);

// Password reset & set-password (P3)
router.post('/forgot-password', authLimiter, forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordRules, validate, resetPassword);
router.post('/set-password', verifyToken, setPasswordRules, validate, setPassword);

// ── Google OAuth ──────────────────────────────────────────
// Guard so unconfigured Google OAuth returns a clean error instead of throwing
// "Unknown authentication strategy".
const googleConfigured = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const requireGoogle = (req, res, next) => {
  if (!googleConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Google sign-in is not configured on this server.',
    });
  }
  next();
};

// Step 1: Redirect user to Google consent screen
router.get('/google', requireGoogle,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects back here; issue JWT and send to frontend
router.get('/google/callback', requireGoogle,
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false,
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );
      const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      res.redirect(`${clientURL}/auth/callback?token=${token}`);
    } catch (err) {
      const clientURL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
      res.redirect(`${clientURL}/login?error=server_error`);
    }
  }
);

module.exports = router;

